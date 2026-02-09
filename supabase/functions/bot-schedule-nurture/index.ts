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

    const leadId = context.lead_id;
    if (!leadId) {
      throw new Error("lead_id required in context");
    }

    // Fetch lead details
    const { data: lead } = await supabase
      .from("internal_crm_leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "NurtureBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("NurtureBot not enabled");
    }

    // Determine nurture sequence based on lead temperature
    const temperature = lead.metadata?.temperature || "cool";
    const score = lead.metadata?.qualification_score || 0;

    let sequence = [];

    if (temperature === "hot" || score >= 90) {
      // Hot leads: aggressive 3-day sequence
      sequence = [
        { delay_days: 1, touch: 1, message: "Quick check-in" },
        { delay_days: 2, touch: 2, message: "Case study share" },
        { delay_days: 3, touch: 3, message: "Direct call offer" },
      ];
    } else if (temperature === "warm" || score >= 70) {
      // Warm leads: moderate 7-day sequence
      sequence = [
        { delay_days: 2, touch: 1, message: "Value content" },
        { delay_days: 5, touch: 2, message: "Social proof" },
        { delay_days: 7, touch: 3, message: "Limited time offer" },
      ];
    } else if (temperature === "cool" || score >= 50) {
      // Cool leads: extended 14-day sequence
      sequence = [
        { delay_days: 3, touch: 1, message: "Educational content" },
        { delay_days: 7, touch: 2, message: "Success stories" },
        { delay_days: 14, touch: 3, message: "Re-engagement offer" },
      ];
    } else {
      // Cold leads: monthly nurture
      sequence = [
        { delay_days: 7, touch: 1, message: "Newsletter signup" },
        { delay_days: 30, touch: 2, message: "Industry insights" },
      ];
    }

    // Schedule follow-up jobs
    const now = new Date();
    const scheduledJobs = [];

    for (const touch of sequence) {
      const runAt = new Date(now);
      runAt.setDate(runAt.getDate() + touch.delay_days);

      const { data: job } = await supabase
        .from("ai_jobs")
        .insert({
          job_type: "SEND_FOLLOWUP",
          priority: 5,
          run_at: runAt.toISOString(),
          idempotency_key: `nurture:${leadId}:touch${touch.touch}`,
          context: {
            lead_id: leadId,
            touch_number: touch.touch,
            message_type: touch.message,
          },
        })
        .select()
        .single();

      if (job) {
        scheduledJobs.push({
          job_id: job.id,
          run_at: runAt.toISOString(),
          touch: touch.touch,
          message: touch.message,
        });
      }
    }

    // Update lead with nurture schedule
    await supabase
      .from("internal_crm_leads")
      .update({
        metadata: {
          ...lead.metadata,
          nurture_sequence: sequence,
          nurture_started_at: new Date().toISOString(),
          scheduled_touches: scheduledJobs,
        },
      })
      .eq("id", leadId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "NurtureBot",
      action_type: "NURTURE_SCHEDULED",
      entity_type: "lead",
      entity_id: leadId,
      details: {
        temperature,
        score,
        touches_scheduled: scheduledJobs.length,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          temperature,
          touches_scheduled: scheduledJobs.length,
          sequence: scheduledJobs,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[NurtureBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
