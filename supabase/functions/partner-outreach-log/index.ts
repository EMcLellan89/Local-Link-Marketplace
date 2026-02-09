import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Get partner record
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (partnerError) throw partnerError;
    if (!partner) {
      throw new Error("Partner not found");
    }

    const body = await req.json();
    const { channel, industry, outcome, notes } = body;

    if (!channel || !industry || !outcome) {
      throw new Error("Missing required fields: channel, industry, outcome");
    }

    // Create outreach log entry
    const { data: logEntry, error: logError } = await supabase
      .from("partner_outreach_logs")
      .insert({
        partner_id: partner.id,
        channel,
        industry,
        outcome,
        notes: notes || null,
      })
      .select()
      .single();

    if (logError) throw logError;

    // Create system event for badge awarding (First Pitch Sent badge)
    const dedupeKey = `first-pitch-sent-${partner.id}`;
    const { error: eventError } = await supabase
      .from("system_events")
      .insert({
        event_type: "outreach_logged",
        payload: {
          partner_id: partner.id,
          outreach_log_id: logEntry.id,
          channel,
          industry,
          outcome,
        },
        dedupe_key: dedupeKey,
        processed: false,
      });

    // Ignore duplicate key errors (already logged first outreach)
    if (eventError && !eventError.message.includes("duplicate key")) {
      throw eventError;
    }

    return new Response(JSON.stringify({ success: true, log_entry: logEntry }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Error in partner-outreach-log:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
