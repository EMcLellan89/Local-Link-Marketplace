import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing env vars");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: affiliate } = await supabase
      .from("marketplace_affiliates")
      .select("id, affiliate_code, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Affiliate not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: products } = await supabase
      .from("marketplace_affiliate_products")
      .select("*")
      .eq("active", true)
      .order("type", { ascending: true });

    const links = (products || []).map((p) => {
      const url = new URL(`${APP_BASE_URL}/join`);
      url.searchParams.set("ref", affiliate.affiliate_code);
      url.searchParams.set("product", p.sku);

      const commissionAmount = Math.round((p.price_cents * p.commission_rate_bp) / 10000);

      return {
        sku: p.sku,
        name: p.name,
        type: p.type,
        price_cents: p.price_cents,
        currency: p.currency,
        commission_rate_bp: p.commission_rate_bp,
        commission_amount_cents: commissionAmount,
        link: url.toString(),
      };
    });

    return new Response(JSON.stringify({ ok: true, affiliate, links }), {
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
