import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = Deno.env.get("CRON_SECRET");

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();

    // Check if bots are enabled
    const { data: settings } = await supabase
      .from("ai_system_settings")
      .select("bots_enabled, max_jobs_per_run")
      .eq("id", 1)
      .maybeSingle();

    if (!settings?.bots_enabled) {
      return new Response(
        JSON.stringify({ message: "Bots disabled via kill switch" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check circuit breaker state
    const { data: breaker } = await supabase
      .from("ai_circuit_breaker")
      .select("state, opened_at, cooldown_minutes")
      .eq("id", 1)
      .maybeSingle();

    if (breaker?.state === "open") {
      const cooldownEnd = new Date(breaker.opened_at);
      cooldownEnd.setMinutes(cooldownEnd.getMinutes() + breaker.cooldown_minutes);

      if (new Date() < cooldownEnd) {
        return new Response(
          JSON.stringify({ message: "Circuit breaker open - cooling down" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Cooldown expired, move to half-open
      await supabase
        .from("ai_circuit_breaker")
        .update({ state: "half_open" })
        .eq("id", 1);
    }

    const maxJobs = breaker?.state === "half_open" ? 5 : (settings.max_jobs_per_run || 50);

    // Fetch ready jobs
    const { data: jobs, error: jobError } = await supabase
      .from("ai_jobs")
      .select("*")
      .eq("status", "queued")
      .lte("run_at", new Date().toISOString())
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(maxJobs);

    if (jobError) {
      throw new Error(`Failed to fetch jobs: ${jobError.message}`);
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No jobs to process" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
    };

    // Process each job
    for (const job of jobs) {
      try {
        // Lock the job
        await supabase
          .from("ai_jobs")
          .update({
            status: "running",
            locked_at: new Date().toISOString(),
            locked_by: "ai-job-runner",
            attempts: job.attempts + 1,
          })
          .eq("id", job.id);

        // Dispatch to bot-dispatch function
        const dispatchUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/bot-dispatch`;
        const dispatchResponse = await fetch(dispatchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ job_id: job.id }),
        });

        if (dispatchResponse.ok) {
          results.succeeded++;
        } else {
          const errorText = await dispatchResponse.text();

          // Mark job as failed
          await supabase
            .from("ai_jobs")
            .update({
              status: "failed",
              last_error: errorText,
            })
            .eq("id", job.id);

          results.failed++;
        }

        results.processed++;
      } catch (error) {
        console.error(`[Job Runner] Failed to process job ${job.id}:`, error);

        // Mark job as failed
        await supabase
          .from("ai_jobs")
          .update({
            status: "failed",
            last_error: error.message,
          })
          .eq("id", job.id);

        results.failed++;
        results.processed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
        circuit_state: breaker?.state || "closed",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[AI Job Runner] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
