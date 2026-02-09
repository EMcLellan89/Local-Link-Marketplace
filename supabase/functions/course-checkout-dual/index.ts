import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PayBrightCheckoutRequest {
  merchantId: string;
  amount: number;
  currency: string;
  orderId: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  callbackUrl: string;
}

async function createPayBrightCheckout(request: PayBrightCheckoutRequest): Promise<string> {
  const apiKey = Deno.env.get("PAYBRIGHT_API_KEY");
  const apiUrl = Deno.env.get("PAYBRIGHT_API_URL") || "https://api.paybright.com/v1";

  if (!apiKey) {
    throw new Error("PayBright API key not configured");
  }

  const response = await fetch(`${apiUrl}/checkout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_id: request.merchantId,
      amount: request.amount,
      currency: request.currency,
      order_id: request.orderId,
      product_name: request.productName,
      customer: {
        email: request.customerEmail,
        name: request.customerName,
      },
      return_url: request.returnUrl,
      callback_url: request.callbackUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayBright checkout failed: ${error}`);
  }

  const data = await response.json();
  return data.checkout_url || data.url;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { productSlug, affiliateCode, preferredProvider = "stripe" } = await req.json();

    const { data: product, error: productError } = await supabaseAdmin
      .from("products_catalog")
      .select("slug, product_type, stripe_price_id, price_cents, title")
      .eq("slug", productSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";
    let checkoutUrl: string | null = null;
    let provider = preferredProvider;
    let error: string | null = null;

    if (preferredProvider === "stripe") {
      try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

        if (!stripeKey || !product.stripe_price_id) {
          throw new Error("Stripe not configured");
        }

        const stripe = new Stripe(stripeKey, {
          apiVersion: "2024-12-18.acacia",
        });

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [{ price: product.stripe_price_id, quantity: 1 }],
          success_url: `${siteUrl}/learn/${product.slug}?success=1&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/marketplace/products/${product.slug}?canceled=1`,
          customer_email: user.email,
          metadata: {
            user_id: user.id,
            product_slug: product.slug,
            product_type: product.product_type,
            affiliate_code: affiliateCode || "",
          },
        });

        checkoutUrl = session.url;
        provider = "stripe";
      } catch (stripeErr: any) {
        console.warn("Stripe checkout failed:", stripeErr.message);
        error = stripeErr.message;
      }
    }

    if (!checkoutUrl && (preferredProvider === "paybright" || error)) {
      try {
        const paybrightMerchantId = Deno.env.get("PAYBRIGHT_MERCHANT_ID");

        if (!paybrightMerchantId) {
          throw new Error("PayBright not configured");
        }

        const orderId = `course_${user.id}_${Date.now()}`;

        checkoutUrl = await createPayBrightCheckout({
          merchantId: paybrightMerchantId,
          amount: product.price_cents,
          currency: "USD",
          orderId,
          productName: product.title || "Online Course",
          customerEmail: user.email || "",
          customerName: user.user_metadata?.full_name || user.email || "Customer",
          returnUrl: `${siteUrl}/learn/${product.slug}?success=1&order_id=${orderId}`,
          callbackUrl: `${siteUrl}/functions/v1/paybright-webhook`,
        });

        await supabaseAdmin.from("paybright_transactions").insert({
          external_order_id: orderId,
          customer_id: user.id,
          amount_cents: product.price_cents,
          currency: "USD",
          transaction_type: "course_purchase",
          status: "pending",
          reference_table: "products_catalog",
          reference_id: product.slug,
          metadata: {
            product_slug: product.slug,
            affiliate_code: affiliateCode || null,
          },
        });

        provider = "paybright";
      } catch (paybrightErr: any) {
        console.error("Both payment providers failed");
        return new Response(
          JSON.stringify({
            error: "Payment system unavailable. Please try again later.",
            details: `Stripe: ${error}, PayBright: ${paybrightErr.message}`
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (!checkoutUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        url: checkoutUrl,
        provider,
        fallbackUsed: preferredProvider !== provider
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Course checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
