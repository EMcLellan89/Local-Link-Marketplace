import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const { campaign_id, daily_budget_cents } = await req.json();

    if (!campaign_id || daily_budget_cents === undefined) {
      return new Response(
        JSON.stringify({ error: "campaign_id_and_budget_required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enforce minimum budget ($20 = 2000 cents)
    if (daily_budget_cents < 2000) {
      return new Response(
        JSON.stringify({
          error: "budget_below_minimum",
          minimum_cents: 2000,
          minimum_dollars: 20,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify campaign belongs to partner
    const { data: campaign, error: campaignError } = await supabase
      .from("partner_campaigns")
      .select("id, partner_id, daily_budget_cents")
      .eq("id", campaign_id)
      .eq("partner_id", partner.id)
      .single();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "campaign_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update budget
    const { data: updated, error: updateError } = await supabase
      .from("partner_campaigns")
      .update({
        daily_budget_cents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign_id)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        campaign: updated,
        message: `Budget updated to $${(daily_budget_cents / 100).toFixed(2)}/day`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[campaign-set-budget] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "update_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
