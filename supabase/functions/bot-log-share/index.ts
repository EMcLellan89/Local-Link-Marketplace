import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { job_id, context } = await req.json();
    const supabase = supabaseAdmin();

    const partnerId = context.partner_id;
    const actionType = context.action_type;
    const entityType = context.entity_type;
    const entityId = context.entity_id;

    if (!partnerId || !actionType) {
      throw new Error("partner_id and action_type required in context");
    }

    // Get agent config (though this bot doesn't use AI)
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "ShareBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("ShareBot not enabled");
    }

    // Log the partner activity
    await supabase.from("partner_activity_log").insert({
      partner_id: partnerId,
      action_type: actionType,
      entity_type: entityType || "unknown",
      entity_id: entityId,
      metadata: context.metadata || {},
      created_at: new Date().toISOString(),
    });

    // Update partner's activity score
    const activityPoints: Record<string, number> = {
      SHARE_KIT_GENERATED: 5,
      LINK_CLICKED: 10,
      LEAD_CREATED: 50,
      DEAL_CLOSED: 100,
      REFERRAL_MADE: 25,
      CONTENT_SHARED: 15,
    };

    const points = activityPoints[actionType] || 1;

    // Increment partner score
    await supabase.rpc("increment_partner_score", {
      p_partner_id: partnerId,
      p_points: points,
    });

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "ShareBot",
      action_type: "ACTIVITY_LOGGED",
      entity_type: "partner",
      entity_id: partnerId,
      details: {
        action: actionType,
        points,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          points_awarded: points,
          action_logged: actionType,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ShareBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
