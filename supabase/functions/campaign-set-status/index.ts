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

    const { campaign_id, status } = await req.json();

    if (!campaign_id || !status) {
      return new Response(
        JSON.stringify({ error: "campaign_id_and_status_required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate status
    const validStatuses = ["active", "paused", "stopped"];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: "invalid_status", valid_statuses: validStatuses }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify campaign belongs to partner
    const { data: campaign, error: campaignError } = await supabase
      .from("partner_campaigns")
      .select("id, status, partner_id")
      .eq("id", campaign_id)
      .eq("partner_id", partner.id)
      .single();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "campaign_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Don't allow reactivating stopped campaigns
    if (campaign.status === "stopped" && status !== "stopped") {
      return new Response(
        JSON.stringify({ error: "cannot_reactivate_stopped_campaign" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status
    const { data: updated, error: updateError } = await supabase
      .from("partner_campaigns")
      .update({
        status,
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
        message: `Campaign ${status}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[campaign-set-status] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "update_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
