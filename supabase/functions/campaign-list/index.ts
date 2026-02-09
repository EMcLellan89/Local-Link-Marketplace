import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Authenticate partner
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "authentication_required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "invalid_token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get partner ID
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (partnerError || !partner) {
      return new Response(
        JSON.stringify({ error: "partner_not_found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get campaigns with creative details
    const { data: campaigns, error: campaignsError } = await supabase
      .from("partner_campaigns")
      .select(`
        *,
        ad_creatives (
          creative_key,
          headline,
          primary_text,
          image_url,
          lifetime_impressions,
          lifetime_clicks,
          lifetime_purchases,
          lifetime_revenue_cents
        )
      `)
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false });

    if (campaignsError) throw campaignsError;

    // Calculate week number for each campaign
    const now = new Date();
    const enrichedCampaigns = (campaigns || []).map((campaign: any) => {
      const deployedAt = new Date(campaign.deployed_at);
      const daysSince = Math.floor((now.getTime() - deployedAt.getTime()) / (86400000));
      const weekNumber = Math.floor(daysSince / 7) + 1;
      const isInFundedPeriod = weekNumber <= 8;

      return {
        ...campaign,
        week_number: weekNumber,
        is_in_funded_period: isInFundedPeriod,
        days_active: daysSince,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        campaigns: enrichedCampaigns,
        count: enrichedCampaigns.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[campaign-list] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "fetch_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
