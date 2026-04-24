/**
 * Renamed context: Previously tracked Twilio call/SMS status callbacks.
 * Now handles Retell AI call status updates and Brevo SMS delivery receipts.
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Retell call status update
    if (body.call_id) {
      const update: Record<string, unknown> = { status: body.call_status };
      if (body.duration_ms) update.duration_seconds = Math.round(body.duration_ms / 1000);
      if (body.transcript) update.transcript = body.transcript;

      await supabaseClient
        .from('comm_call_logs')
        .update(update)
        .eq('call_id', body.call_id);
    }

    // Brevo SMS delivery receipt
    if (body.messageId && body.status) {
      await supabaseClient
        .from('comm_sms_logs')
        .update({ status: body.status })
        .eq('message_id', String(body.messageId));
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing status webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
