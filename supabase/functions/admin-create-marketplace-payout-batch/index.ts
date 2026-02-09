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
    const NET_DAYS = Number(Deno.env.get("NET_DAYS") || 30);

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const affiliate_id = body.affiliate_id ? String(body.affiliate_id) : null;
    const min_payout_cents = Number(body.min_payout_cents || 5000);
    const method = String(body.method || "manual");

    const eligibleBefore = new Date(Date.now() - NET_DAYS * 24 * 3600 * 1000).toISOString();

    let query = supabase
      .from("marketplace_affiliate_commissions")
      .select("id, marketplace_affiliate_id, commission_amount_cents")
      .eq("status", "approved")
      .lte("eligible_at", eligibleBefore);

    if (affiliate_id) query = query.eq("marketplace_affiliate_id", affiliate_id);

    const { data: commissions, error } = await query;
    if (error) throw error;

    const byAffiliate = new Map<string, { ids: string[]; total: number }>();
    for (const comm of (commissions || [])) {
      const aid = comm.marketplace_affiliate_id;
      const amt = comm.commission_amount_cents;
      const cur = byAffiliate.get(aid) || { ids: [], total: 0 };
      cur.ids.push(comm.id);
      cur.total += amt;
      byAffiliate.set(aid, cur);
    }

    const created: any[] = [];

    for (const [aid, grp] of byAffiliate.entries()) {
      if (grp.total < min_payout_cents) continue;

      const { data: payout, error: payoutError } = await supabase
        .from("marketplace_affiliate_payouts")
        .insert({
          marketplace_affiliate_id: aid,
          amount_cents: grp.total,
          currency: "usd",
          status: "pending",
          method,
          commission_ids: grp.ids,
        })
        .select("id, marketplace_affiliate_id, amount_cents, status")
        .single();

      if (payoutError) throw payoutError;

      created.push(payout);
    }

    return new Response(JSON.stringify({ ok: true, payouts_created: created.length, payouts: created }), {
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
