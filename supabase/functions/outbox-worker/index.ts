import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_RETRIES = 5;

async function processEvent(sb: any, event: any) {
  const { id, event_type, payload } = event;

  try {
    if (event_type === "bot.run") {
      // Call bots-run function
      const { exec_case_id } = payload;
      const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/bots-run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ exec_case_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`bots-run failed: ${errorText}`);
      }
    } else if (event_type === "jobs.generate") {
      // Call jobs-generate function
      const { exec_case_id } = payload;
      const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/jobs-generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ exec_case_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`jobs-generate failed: ${errorText}`);
      }
    } else {
      throw new Error(`Unknown event type: ${event_type}`);
    }

    // Mark as completed
    await sb
      .from("event_outbox")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return { ok: true };
  } catch (error: any) {
    // Increment retry count
    const newRetryCount = (event.retry_count || 0) + 1;

    if (newRetryCount >= MAX_RETRIES) {
      // Mark as failed
      await sb
        .from("event_outbox")
        .update({
          status: "failed",
          retry_count: newRetryCount,
          last_error: error.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } else {
      // Schedule retry with exponential backoff
      const backoffMinutes = Math.pow(2, newRetryCount);
      const nextRetry = new Date();
      nextRetry.setMinutes(nextRetry.getMinutes() + backoffMinutes);

      await sb
        .from("event_outbox")
        .update({
          status: "pending",
          retry_count: newRetryCount,
          last_error: error.message,
          next_retry_at: nextRetry.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    }

    return { ok: false, error: error.message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Fetch pending events
    const { data: events, error: fetchErr } = await sb
      .from("event_outbox")
      .select("*")
      .eq("status", "pending")
      .or(`next_retry_at.is.null,next_retry_at.lte.${new Date().toISOString()}`)
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchErr) throw fetchErr;

    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each event
    const results = [];
    for (const event of events) {
      const result = await processEvent(sb, event);
      results.push({ event_id: event.id, ...result });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        processed: events.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
