/**
 * Renamed context: Previously a Twilio TwiML voice webhook.
 * Now handles Retell AI call status/event webhooks.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { event, call } = body;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (call?.call_id) {
      const updateData: Record<string, unknown> = { status: call.call_status };
      if (call.end_timestamp && call.start_timestamp) {
        updateData.duration_seconds = Math.round(
          (call.end_timestamp - call.start_timestamp) / 1000
        );
      }
      if (call.transcript) updateData.transcript = call.transcript;

      await supabaseClient
        .from('comm_call_logs')
        .update(updateData)
        .eq('call_id', call.call_id);
    }

    console.log(`Retell webhook event: ${event}`, call?.call_id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing Retell webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
