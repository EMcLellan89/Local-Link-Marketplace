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

    const partnerId = context.partner_id || context.entity_id;
    const badgeKey = context.badge_key;

    if (!partnerId || !badgeKey) {
      throw new Error("partner_id and badge_key required in context");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "CertBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("CertBot not enabled");
    }

    // Fetch partner and badge details
    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .maybeSingle();

    const { data: badge } = await supabase
      .from("partner_badges")
      .select("*")
      .eq("key", badgeKey)
      .maybeSingle();

    if (!partner || !badge) {
      throw new Error("Partner or badge not found");
    }

    // Award the badge
    const { data: award, error: awardError } = await supabase
      .from("partner_badge_awards")
      .insert({
        partner_id: partnerId,
        badge_id: badge.id,
        awarded_at: new Date().toISOString(),
        awarded_by: "system",
      })
      .select()
      .single();

    if (awardError) {
      // Badge might already be awarded
      if (awardError.code === "23505") {
        return new Response(
          JSON.stringify({
            success: true,
            output: { message: "Badge already awarded" },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw awardError;
    }

    // Send congratulations email
    if (partner.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: partner.email,
        subject: `Congratulations! You've earned the ${badge.name} badge`,
        body: `Hi ${partner.name},

Congratulations! You've earned the ${badge.name} badge! 🎉

${badge.description || 'This achievement recognizes your outstanding work.'}

Your badge is now visible on your partner profile.

Keep up the great work!

Local-Link Team`,
        metadata: {
          partner_id: partnerId,
          badge_id: badge.id,
          campaign: "gamification",
          bot: "CertBot",
        },
        status: "queued",
      });
    }

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "CertBot",
      action_type: "BADGE_AWARDED",
      entity_type: "partner",
      entity_id: partnerId,
      details: {
        badge_key: badgeKey,
        badge_name: badge.name,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          badge_name: badge.name,
          notification_sent: !!partner.email,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CertBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
