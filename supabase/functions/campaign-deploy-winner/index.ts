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

    const {
      creative_id,
      business_key = "storylab_kids",
      vertical_key = "kids",
      daily_budget_cents = 2000,
    } = await req.json();

    if (!creative_id) {
      return new Response(
        JSON.stringify({ error: "creative_id_required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enforce minimum budget
    if (daily_budget_cents < 2000) {
      return new Response(
        JSON.stringify({ error: "minimum_budget_20_dollars" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify creative exists and is approved
    const { data: creative, error: creativeError } = await supabase
      .from("ad_creatives")
      .select("id, is_approved, is_active")
      .eq("id", creative_id)
      .single();

    if (creativeError || !creative) {
      return new Response(
        JSON.stringify({ error: "creative_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!creative.is_approved || !creative.is_active) {
      return new Response(
        JSON.stringify({ error: "creative_not_available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if partner already has an active campaign for this creative
    const { data: existingCampaign } = await supabase
      .from("partner_campaigns")
      .select("id, status")
      .eq("partner_id", partner.id)
      .eq("creative_id", creative_id)
      .in("status", ["active", "paused"])
      .single();

    if (existingCampaign) {
      return new Response(
        JSON.stringify({
          error: "campaign_already_exists",
          campaign_id: existingCampaign.id
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create campaign
    // funded_until_week = 8 (first 8 weeks are funded)
    const { data: campaign, error: campaignError } = await supabase
      .from("partner_campaigns")
      .insert({
        partner_id: partner.id,
        creative_id,
        business_key,
        vertical_key,
        daily_budget_cents,
        status: "active",
        deployed_at: new Date().toISOString(),
        funded_until_week: 8,
        total_funded_cents: 0,
        total_ad_spend_cents: 0,
        payback_balance_cents: 0,
        payback_per_week_cents: 5000, // $50/week default
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    return new Response(
      JSON.stringify({
        success: true,
        campaign,
        message: "Campaign deployed! First 8 weeks funded at $20/day."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[campaign-deploy-winner] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "deployment_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
