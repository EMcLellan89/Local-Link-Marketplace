import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Internal-Api-Key",
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
    const INTERNAL_API_KEY = Deno.env.get("INTERNAL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!INTERNAL_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing env vars");
    }

    const apiKey = req.headers.get("X-Internal-Api-Key") || "";
    if (apiKey !== INTERNAL_API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const affiliate_code = String(body.affiliate_code || body.ref || "");
    const product_sku = String(body.product_sku || "");
    const order_id = String(body.order_id || "");
    const sale_amount_cents = Number(body.sale_amount_cents || 0);
    const referred_user_id = body.referred_user_id ? String(body.referred_user_id) : null;
    const referred_email = body.referred_email ? String(body.referred_email) : null;

    if (!affiliate_code || !product_sku || !order_id || !Number.isFinite(sale_amount_cents) || sale_amount_cents <= 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: affiliate } = await supabase
      .from("marketplace_affiliates")
      .select("id, status")
      .eq("affiliate_code", affiliate_code)
      .maybeSingle();

    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Affiliate not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (affiliate.status !== "active") {
      return new Response(JSON.stringify({ error: "Affiliate not active" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: product } = await supabase
      .from("marketplace_affiliate_products")
      .select("sku, commission_rate_bp, active")
      .eq("sku", product_sku)
      .maybeSingle();

    if (!product) {
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

    const { data: existing } = await supabase
      .from("marketplace_affiliate_commissions")
      .select("id, status")
      .eq("marketplace_affiliate_id", affiliate.id)
      .eq("order_id", order_id)
      .eq("product_sku", product_sku)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ ok: true, commission_id: existing.id, already_exists: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let referral_id: string | null = null;
    if (referred_user_id || referred_email) {
      const { data: refData } = await supabase
        .from("marketplace_affiliate_referrals")
        .insert({
          marketplace_affiliate_id: affiliate.id,
          referred_user_id,
          referred_email,
          source: "manual",
          utm: { product: product_sku },
        })
        .select("id")
        .single();

      if (refData) referral_id = refData.id;
    }

    const commission_amount_cents = Math.round((sale_amount_cents * product.commission_rate_bp) / 10000);

    const { data: commission, error } = await supabase
      .from("marketplace_affiliate_commissions")
      .insert({
        marketplace_affiliate_id: affiliate.id,
        referral_id,
        product_sku,
        order_id,
        sale_amount_cents,
        commission_rate_bp: product.commission_rate_bp,
        commission_amount_cents,
        status: "pending",
        eligible_at: new Date().toISOString(),
      })
      .select("id, status")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, commission }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
