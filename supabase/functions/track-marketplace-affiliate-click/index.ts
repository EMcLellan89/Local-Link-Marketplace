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

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing env vars");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const affiliate_code = String(body.affiliate_code || body.ref || "");
    const product = String(body.product || "");
    const utm = (body.utm && typeof body.utm === "object") ? body.utm : {};

    if (!affiliate_code) {
      return new Response(JSON.stringify({ error: "affiliate_code is required" }), {
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

    const { data: referral, error } = await supabase
      .from("marketplace_affiliate_referrals")
      .insert({
        marketplace_affiliate_id: affiliate.id,
        source: "link",
        utm: { ...utm, product },
      })
      .select("id")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, referral_id: referral.id }), {
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
