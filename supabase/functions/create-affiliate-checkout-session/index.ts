import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
      throw new Error("Missing env vars");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const Stripe = (await import("npm:stripe@16")).default;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const body = await req.json();
    const product_sku = String(body.product_sku || "");
    const partner_code = body.partner_code ? String(body.partner_code) : null;
    const referral_id = body.referral_id ? String(body.referral_id) : null;

    if (!product_sku) {
      return new Response(JSON.stringify({ error: "product_sku required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: product, error: productError } = await supabase
      .from("marketplace_affiliate_products")
      .select("sku, name, type, price_cents, currency, active, stripe_price_id")
      .eq("sku", product_sku)
      .maybeSingle();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!product.active) {
      return new Response(JSON.stringify({ error: "Product inactive" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!product.stripe_price_id) {
      return new Response(
        JSON.stringify({ error: "Missing stripe_price_id. Please configure in admin." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (partner_code) {
      const { data: affiliate } = await supabase
        .from("marketplace_affiliates")
        .select("id, status")
        .eq("affiliate_code", partner_code)
        .maybeSingle();

      if (!affiliate || affiliate.status !== "active") {
        console.warn("Invalid/inactive partner_code; ignoring:", partner_code);
      }
    }

    const successUrl = `${APP_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${APP_BASE_URL}/billing/cancel`;

    const isSub = product.type === "subscription" || product.type === "crm";

    const sessionParams: any = {
      mode: isSub ? "subscription" : "payment",
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        product_sku,
        partner_code: partner_code || "",
        referral_id: referral_id || "",
      },
    };

    if (isSub) {
      sessionParams.subscription_data = {
        metadata: {
          product_sku,
          partner_code: partner_code || "",
          referral_id: referral_id || "",
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ ok: true, url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
