import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    const {
      product_slug,
      pricing,
      partner_referral_code,
      customer_email,
      bump_selected = false,
      success_url,
      cancel_url,
    } = await req.json();

    if (!product_slug || !pricing) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("marketplace_products")
      .select("*")
      .eq("slug", product_slug)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: price, error: priceError } = await supabaseAdmin
      .from("marketplace_product_prices")
      .select("*")
      .eq("product_id", product.id)
      .eq("pricing", pricing)
      .eq("is_active", true)
      .single();

    if (priceError || !price || !price.stripe_price_id) {
      return new Response(JSON.stringify({ error: "Price not found or not configured" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let partnerId: string | null = null;
    if (partner_referral_code) {
      const { data: partner } = await supabaseAdmin
        .from("marketplace_partners")
        .select("*")
        .eq("referral_code", partner_referral_code)
        .maybeSingle();
      if (partner) {
        partnerId = partner.id;
      }
    }

    const { data: config } = await supabaseAdmin
      .from("marketplace_checkout_configs")
      .select("*")
      .eq("product_id", product.id)
      .maybeSingle();

    let subtotal = price.amount_cents;
    let bumpProduct: any = null;
    let bumpAmount = 0;

    if (bump_selected && config?.enable_order_bump && config.order_bump_product_id) {
      const { data: bump } = await supabaseAdmin
        .from("marketplace_products")
        .select("*")
        .eq("id", config.order_bump_product_id)
        .eq("is_active", true)
        .maybeSingle();

      if (bump) {
        bumpProduct = bump;
        if (config.order_bump_amount_cents) {
          bumpAmount = config.order_bump_amount_cents;
        } else {
          const { data: bumpPrice } = await supabaseAdmin
            .from("marketplace_product_prices")
            .select("*")
            .eq("product_id", bump.id)
            .eq("pricing", "one_time")
            .eq("is_active", true)
            .maybeSingle();
          if (bumpPrice) {
            bumpAmount = bumpPrice.amount_cents;
          }
        }
      }
    }

    const total = subtotal + bumpAmount;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: price.stripe_price_id,
        quantity: 1,
      },
    ];

    if (bumpProduct && bumpAmount > 0) {
      const { data: bumpPrice } = await supabaseAdmin
        .from("marketplace_product_prices")
        .select("stripe_price_id")
        .eq("product_id", bumpProduct.id)
        .eq("pricing", "one_time")
        .maybeSingle();

      if (bumpPrice?.stripe_price_id) {
        lineItems.push({
          price: bumpPrice.stripe_price_id,
          quantity: 1,
        });
      }
    }

    const appUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/.*/, "") || "http://localhost:3000";
    const defaultSuccessUrl = `${appUrl}/marketplace/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${appUrl}/marketplace/products/${product_slug}`;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: pricing === "one_time" ? "payment" : "subscription",
      line_items: lineItems,
      success_url: success_url || defaultSuccessUrl,
      cancel_url: cancel_url || defaultCancelUrl,
      customer_email: customer_email || undefined,
      metadata: {
        product_id: product.id,
        price_id: price.id,
        partner_id: partnerId || "",
        partner_referral_code: partner_referral_code || "",
        bump_selected: bump_selected.toString(),
      },
    });

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("marketplace_checkout_sessions")
      .insert({
        product_id: product.id,
        price_id: price.id,
        partner_id: partnerId,
        partner_referral_code: partner_referral_code || null,
        user_id: userId,
        customer_email: customer_email || null,
        stripe_checkout_session_id: stripeSession.id,
        status: "pending",
        bump_selected: bump_selected,
        bump_product_id: bumpProduct?.id || null,
        bump_amount_cents: bumpAmount,
        subtotal_cents: subtotal,
        total_cents: total,
        currency: price.currency,
      })
      .select("*")
      .single();

    if (sessionError) throw sessionError;

    await supabaseAdmin.from("marketplace_abandoned_carts").insert({
      checkout_session_id: session.id,
      status: "open",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    return new Response(JSON.stringify({
      checkout_url: stripeSession.url,
      session_id: stripeSession.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to create checkout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
