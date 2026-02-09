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

    const {
      business_key = "storylab_kids",
      vertical_key = "kids",
      creative_id,
      event_type, // impression, click, checkout_started, purchase
      profile_id,
      session_id,
      ref_code,
      partner_id,
      meta = {},
      revenue_cents = 0,
    } = await req.json();

    if (!event_type) {
      return new Response(
        JSON.stringify({ error: "event_type_required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from("creative_events")
      .insert({
        business_key,
        vertical_key,
        creative_id: creative_id || null,
        event_type,
        profile_id: profile_id || null,
        session_id: session_id || null,
        ref_code: ref_code || null,
        partner_id: partner_id || null,
        meta,
        revenue_cents,
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // If this is a purchase event, also update creative lifetime stats
    if (event_type === "purchase" && creative_id) {
      await supabase.rpc("update_creative_performance");
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "tracking_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
