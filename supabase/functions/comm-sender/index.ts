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
      .select("bots_enabled, keep_failed_outbox_rows")
      .eq("id", 1)
      .maybeSingle();

    if (!settings?.bots_enabled) {
      return new Response(
        JSON.stringify({ message: "Bots disabled via kill switch" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch ready messages
    const now = new Date().toISOString();
    const { data: messages, error: msgError } = await supabase
      .from("comm_outbox")
      .select("*")
      .eq("status", "queued")
      .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
      .limit(50);

    if (msgError) {
      throw new Error(`Failed to fetch messages: ${msgError.message}`);
    }

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ message: "No messages to send" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      moved_to_dlq: 0,
    };

    for (const msg of messages) {
      try {
        let success = false;
        let provider = "sendgrid";
        let providerId = null;
        let error = null;

        // Try primary provider (SendGrid)
        if (msg.channel === "email") {
          try {
            const response = await fetch(
              `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({
                  to: msg.to_address,
                  subject: msg.subject,
                  body: msg.body,
                }),
              }
            );

            if (response.ok) {
              const result = await response.json();
              providerId = result.message_id;
              success = true;
            } else {
              error = await response.text();
            }
          } catch (e) {
            error = e.message;
          }
        } else if (msg.channel === "sms") {
          try {
            const response = await fetch(
              `${Deno.env.get("SUPABASE_URL")}/functions/v1/twilio-send-sms`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({
                  to: msg.to_address,
                  body: msg.body,
                }),
              }
            );

            if (response.ok) {
              const result = await response.json();
              providerId = result.sid;
              success = true;
              provider = "twilio";
            } else {
              error = await response.text();
            }
          } catch (e) {
            error = e.message;
          }
        }

        if (success) {
          // Mark as sent
          await supabase
            .from("comm_outbox")
            .update({
              status: "sent",
              provider,
              provider_message_id: providerId,
              sent_at: new Date().toISOString(),
            })
            .eq("id", msg.id);

          results.sent++;
        } else {
          // Failed - check if we should retry or move to DLQ
          const newAttempts = msg.attempts + 1;

          if (newAttempts >= msg.max_attempts) {
            // Move to dead letter queue
            await supabase.from("comm_outbox_dead").insert({
              original_outbox_id: msg.id,
              channel: msg.channel,
              to_address: msg.to_address,
              subject: msg.subject,
              body: msg.body,
              metadata: msg.metadata,
              provider,
              last_error: error,
              attempts: newAttempts,
              max_attempts: msg.max_attempts,
              failed_at: new Date().toISOString(),
              status: "dead",
            });

            // Delete or mark the original message
            if (settings.keep_failed_outbox_rows) {
              await supabase
                .from("comm_outbox")
                .update({
                  status: "failed",
                  last_error: error,
                  attempts: newAttempts,
                })
                .eq("id", msg.id);
            } else {
              await supabase.from("comm_outbox").delete().eq("id", msg.id);
            }

            results.moved_to_dlq++;
          } else {
            // Schedule retry with exponential backoff
            const backoffMinutes = [2, 5, 15, 60, 240][newAttempts - 1] || 240;
            const nextRetry = new Date();
            nextRetry.setMinutes(nextRetry.getMinutes() + backoffMinutes);

            await supabase
              .from("comm_outbox")
              .update({
                attempts: newAttempts,
                last_error: error,
                next_retry_at: nextRetry.toISOString(),
              })
              .eq("id", msg.id);

            results.failed++;
          }
        }

        results.processed++;
      } catch (error) {
        console.error(`[Comm Sender] Failed to process message ${msg.id}:`, error);
        results.failed++;
        results.processed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Comm Sender] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
