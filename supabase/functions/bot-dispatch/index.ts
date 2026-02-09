import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { job_id } = await req.json();

    if (!job_id) {
      return new Response(
        JSON.stringify({ error: "job_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from("ai_jobs")
      .select("*")
      .eq("id", job_id)
      .maybeSingle();

    if (jobError || !job) {
      throw new Error(`Job not found: ${job_id}`);
    }

    const startTime = new Date();

    // Route to appropriate bot function based on job_type
    const botRoutes: Record<string, string> = {
      QUALIFY_LEAD: "bot-qualify-lead",
      MATCH_OFFER: "bot-match-offer",
      GENERATE_PROPOSAL: "bot-generate-proposal",
      SCHEDULE_NURTURE_SEQUENCE: "bot-schedule-nurture",
      SEND_FOLLOWUP: "bot-send-followup",
      ONBOARD_CLIENT: "bot-onboard-client",
      SUPPORT_TRIAGE: "bot-support-triage",
      DOC_CLASSIFY: "bot-doc-classify",
      ROUTE_PARTNER: "bot-route-partner",
      RISK_SCAN: "bot-risk-scan",
      AUDIT_PACK: "bot-audit-pack",
      UPSELL_RECOMMEND: "bot-upsell-recommend",
      BILLING_DUNNING: "bot-billing-dunning",
      RETENTION_SAVE: "bot-retention-save",
      REQUEST_REVIEW: "bot-request-review",
      AWARD_BADGE: "bot-award-badge",
      CEO_BRIEF: "bot-ceo-brief",
      LOG_SHARE: "bot-log-share",
    };

    const botFunction = botRoutes[job.job_type];

    if (!botFunction) {
      throw new Error(`Unknown job type: ${job.job_type}`);
    }

    // Call the bot function
    const botUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/${botFunction}`;
    const botResponse = await fetch(botUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        job_id: job.id,
        context: job.context,
      }),
    });

    const finishTime = new Date();
    const durationMs = finishTime.getTime() - startTime.getTime();

    if (botResponse.ok) {
      const result = await botResponse.json();

      // Mark job as succeeded
      await supabase
        .from("ai_jobs")
        .update({ status: "succeeded" })
        .eq("id", job.id);

      // Log the run
      await supabase.from("ai_runs").insert({
        job_id: job.id,
        job_type: job.job_type,
        status: "succeeded",
        started_at: startTime.toISOString(),
        finished_at: finishTime.toISOString(),
        model: result.model || "gpt-4o-mini",
        tokens_in: result.tokens_in || 0,
        tokens_out: result.tokens_out || 0,
        output: result.output || {},
      });

      return new Response(
        JSON.stringify({
          success: true,
          job_id: job.id,
          duration_ms: durationMs,
          result,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const errorText = await botResponse.text();

      // Check if we should retry
      const shouldRetry = job.attempts < job.max_attempts;

      if (shouldRetry) {
        // Schedule retry with exponential backoff
        const backoffMinutes = Math.min(Math.pow(2, job.attempts) * 2, 240);
        const nextRetry = new Date();
        nextRetry.setMinutes(nextRetry.getMinutes() + backoffMinutes);

        await supabase
          .from("ai_jobs")
          .update({
            status: "queued",
            run_at: nextRetry.toISOString(),
            last_error: errorText,
            locked_at: null,
            locked_by: null,
          })
          .eq("id", job.id);
      } else {
        // Max attempts reached, mark as failed
        await supabase
          .from("ai_jobs")
          .update({
            status: "failed",
            last_error: errorText,
          })
          .eq("id", job.id);
      }

      // Log the failed run
      await supabase.from("ai_runs").insert({
        job_id: job.id,
        job_type: job.job_type,
        status: "failed",
        started_at: startTime.toISOString(),
        finished_at: finishTime.toISOString(),
        error: errorText,
        output: {},
      });

      throw new Error(errorText);
    }
  } catch (error) {
    console.error("[Bot Dispatch] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
