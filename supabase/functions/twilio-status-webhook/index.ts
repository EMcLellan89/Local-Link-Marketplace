import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid')?.toString();
    const messageSid = formData.get('MessageSid')?.toString();
    const status = formData.get('CallStatus')?.toString() || formData.get('MessageStatus')?.toString();
    const duration = formData.get('CallDuration')?.toString();
    const recordingUrl = formData.get('RecordingUrl')?.toString();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (callSid) {
      const updateData: any = { status };
      if (duration) updateData.duration_seconds = parseInt(duration);
      if (recordingUrl) updateData.recording_url = recordingUrl;

      await supabaseClient
        .from('twilio_call_logs')
        .update(updateData)
        .eq('call_sid', callSid);
    }

    if (messageSid) {
      await supabaseClient
        .from('twilio_sms_logs')
        .update({ status })
        .eq('message_sid', messageSid);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error processing status webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});