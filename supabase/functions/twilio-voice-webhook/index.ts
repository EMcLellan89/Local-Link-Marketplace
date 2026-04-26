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
    const callSid = formData.get('CallSid')?.toString() || '';
    const from = formData.get('From')?.toString() || '';
    const to = formData.get('To')?.toString() || '';
    const callStatus = formData.get('CallStatus')?.toString() || '';

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: phoneConfig } = await supabaseClient
      .from('twilio_phone_numbers')
      .select('merchant_id')
      .eq('phone_number', to)
      .eq('status', 'active')
      .single();

    if (phoneConfig) {
      const { data: existingCall } = await supabaseClient
        .from('twilio_call_logs')
        .select('id')
        .eq('call_sid', callSid)
        .single();

      if (!existingCall) {
        await supabaseClient.from('twilio_call_logs').insert({
          merchant_id: phoneConfig.merchant_id,
          call_sid: callSid,
          direction: 'inbound',
          from_number: from,
          to_number: to,
          status: callStatus,
        });
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling. Please hold while we connect you.</Say>
  <Dial timeout="30" record="record-from-answer">
    <Number>+11234567890</Number>
  </Dial>
  <Say voice="alice">Sorry, no one is available to take your call. Please leave a message after the beep.</Say>
  <Record maxLength="120" transcribe="true" transcribeCallback="${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-transcription-webhook"/>
  <Say voice="alice">Thank you for your message. Goodbye.</Say>
</Response>`;

    return new Response(twiml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  } catch (error: any) {
    console.error('Error processing voice webhook:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We're sorry, but we're experiencing technical difficulties. Please try again later.</Say>
  <Hangup/>
</Response>`;

    return new Response(errorTwiml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});