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

    const body = await req.json();
    const referral_id = String(body.referral_id || "");
    const affiliate_code = String(body.affiliate_code || body.ref || "");

    if (!referral_id && !affiliate_code) {
      return new Response(JSON.stringify({ error: "referral_id or affiliate_code required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (referral_id) {
      const { data, error } = await supabase
        .from("marketplace_affiliate_referrals")
        .update({
          referred_user_id: user.id,
          referred_email: user.email,
        })
        .eq("id", referral_id)
        .select("id, marketplace_affiliate_id")
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, referral: data }), {
        status: 200,
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

    const { data: existing } = await supabase
      .from("marketplace_affiliate_referrals")
      .select("id")
      .eq("marketplace_affiliate_id", affiliate.id)
      .eq("referred_user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ ok: true, referral_id: existing.id, already_exists: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: referral, error } = await supabase
      .from("marketplace_affiliate_referrals")
      .insert({
        marketplace_affiliate_id: affiliate.id,
        referred_user_id: user.id,
        referred_email: user.email,
        source: "code",
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
