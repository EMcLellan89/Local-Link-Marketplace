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
      return new Response(JSON.stringify({ error: "Missing env vars" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: affiliates, error: affiliatesError } = await supabase
      .from("marketplace_affiliates")
      .select("id, affiliate_code, display_name, points, current_badge")
      .eq("status", "active")
      .order("points", { ascending: false });

    if (affiliatesError) {
      return new Response(JSON.stringify({ error: affiliatesError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const leaderboard = [];

    for (const affiliate of affiliates || []) {
      const { data: commissions } = await supabase
        .from("marketplace_affiliate_commissions")
        .select("commission_amount_cents, status")
        .eq("marketplace_affiliate_id", affiliate.id)
        .in("status", ["approved", "paid"]);

      const totalSales = commissions?.length || 0;
      const totalEarned =
        commissions?.reduce((sum, c) => sum + (c.commission_amount_cents || 0), 0) || 0;

      leaderboard.push({
        affiliate_code: affiliate.affiliate_code,
        display_name: affiliate.display_name,
        points: affiliate.points || 0,
        current_badge: affiliate.current_badge || "starter",
        total_sales: totalSales,
        total_earned: totalEarned,
      });
    }

    leaderboard.sort((a, b) => b.points - a.points);

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return new Response(JSON.stringify(rankedLeaderboard), {
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
