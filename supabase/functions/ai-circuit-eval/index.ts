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

    // Get current health metrics
    const { data: health } = await supabase
      .from("ai_health_15m")
      .select("*")
      .maybeSingle();

    if (!health) {
      return new Response(
        JSON.stringify({ message: "No health data available" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get settings and breaker state
    const { data: settings } = await supabase
      .from("ai_system_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const { data: breaker } = await supabase
      .from("ai_circuit_breaker")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const jobFailRate = parseFloat(health.jobs_fail_rate) || 0;
    const commFailRate = parseFloat(health.comm_fail_rate) || 0;
    const totalEvents = health.jobs_total + health.comm_total;

    let newState = breaker?.state || "closed";
    let reason = null;

    // Evaluate circuit breaker state
    if (breaker?.state === "closed") {
      // Check if we should open the breaker
      if (totalEvents >= (settings?.min_events_for_eval || 25)) {
        if (
          jobFailRate >= (settings?.fail_rate_open_threshold || 0.15) ||
          commFailRate >= (settings?.comm_fail_rate_open_threshold || 0.10)
        ) {
          newState = "open";
          reason = `High failure rate detected - Jobs: ${(jobFailRate * 100).toFixed(1)}%, Comms: ${(commFailRate * 100).toFixed(1)}%`;

          await supabase
            .from("ai_circuit_breaker")
            .update({
              state: newState,
              reason,
              opened_at: new Date().toISOString(),
              last_eval_at: new Date().toISOString(),
              last_fail_rate: jobFailRate,
              last_comm_fail_rate: commFailRate,
            })
            .eq("id", 1);

          console.log(`[Circuit Breaker] OPENED: ${reason}`);
        }
      }
    } else if (breaker?.state === "half_open") {
      // Check if we should close or re-open
      if (totalEvents >= 10) {
        if (
          jobFailRate >= (settings?.fail_rate_open_threshold || 0.15) ||
          commFailRate >= (settings?.comm_fail_rate_open_threshold || 0.10)
        ) {
          // Still failing, re-open
          newState = "open";
          reason = `Still experiencing failures in half-open state - Jobs: ${(jobFailRate * 100).toFixed(1)}%, Comms: ${(commFailRate * 100).toFixed(1)}%`;

          await supabase
            .from("ai_circuit_breaker")
            .update({
              state: newState,
              reason,
              opened_at: new Date().toISOString(),
              last_eval_at: new Date().toISOString(),
              last_fail_rate: jobFailRate,
              last_comm_fail_rate: commFailRate,
            })
            .eq("id", 1);

          console.log(`[Circuit Breaker] RE-OPENED: ${reason}`);
        } else {
          // Recovered, close the breaker
          newState = "closed";
          reason = "System recovered - closing breaker";

          await supabase
            .from("ai_circuit_breaker")
            .update({
              state: newState,
              reason,
              opened_at: null,
              last_eval_at: new Date().toISOString(),
              last_fail_rate: jobFailRate,
              last_comm_fail_rate: commFailRate,
            })
            .eq("id", 1);

          console.log(`[Circuit Breaker] CLOSED: System recovered`);
        }
      }
    }

    // Record health snapshot
    await supabase.from("ai_health_snapshots").insert({
      window_minutes: 15,
      jobs_total: health.jobs_total,
      jobs_failed: health.jobs_failed,
      jobs_fail_rate: jobFailRate,
      comm_total: health.comm_total,
      comm_failed: health.comm_failed,
      comm_fail_rate: commFailRate,
      circuit_state: newState,
    });

    return new Response(
      JSON.stringify({
        success: true,
        health: {
          jobs_total: health.jobs_total,
          jobs_failed: health.jobs_failed,
          jobs_fail_rate: jobFailRate,
          comm_total: health.comm_total,
          comm_failed: health.comm_failed,
          comm_fail_rate: commFailRate,
        },
        circuit_state: newState,
        reason,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[AI Circuit Eval] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
