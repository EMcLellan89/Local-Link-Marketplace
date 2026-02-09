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

    const { data: commissions } = await supabase
      .from("marketplace_affiliate_commissions")
      .select("status, commission_amount_cents, created_at")
      .eq("marketplace_affiliate_id", affiliate.id);

    let lifetime = 0, pending = 0, approved = 0, paid = 0, last30 = 0;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    for (const comm of (commissions || [])) {
      const amt = comm.commission_amount_cents;
      lifetime += amt;
      if (comm.status === "pending") pending += amt;
      else if (comm.status === "approved") approved += amt;
      else if (comm.status === "paid") paid += amt;

      const created = new Date(comm.created_at);
      if (created >= thirtyDaysAgo) last30 += amt;
    }

    const { count: referrals_count } = await supabase
      .from("marketplace_affiliate_referrals")
      .select("id", { count: "exact", head: true })
      .eq("marketplace_affiliate_id", affiliate.id);

    return new Response(JSON.stringify({
      ok: true,
      affiliate,
      metrics: {
        referrals_count: referrals_count ?? 0,
        commission_lifetime_cents: lifetime,
        commission_last30_cents: last30,
        commission_pending_cents: pending,
        commission_approved_cents: approved,
        commission_paid_cents: paid,
      },
    }), {
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
