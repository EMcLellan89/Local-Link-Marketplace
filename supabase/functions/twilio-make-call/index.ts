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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { merchantId, toNumber, leadId } = await req.json();

    if (!merchantId || !toNumber) {
      throw new Error('merchantId and toNumber are required');
    }

    const { data: merchant } = await supabaseClient
      .from('merchants')
      .select('user_id')
      .eq('id', merchantId)
      .eq('user_id', user.id)
      .single();

    if (!merchant) {
      throw new Error('Merchant not found or unauthorized');
    }

    const { data: config } = await supabaseClient
      .from('twilio_configurations')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('is_active', true)
      .single();

    if (!config || !config.account_sid || !config.auth_token_encrypted || !config.phone_number) {
      throw new Error('Twilio not configured for this merchant');
    }

    const accountSid = config.account_sid;
    const authToken = config.auth_token_encrypted;
    const fromNumber = config.phone_number;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-voice-webhook`;

    const params = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Url: webhookUrl,
      StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-status-webhook`,
      StatusCallbackEvent: 'initiated,ringing,answered,completed',
      Record: config.call_recording_enabled ? 'record-from-answer' : 'do-not-record',
    });

    const basicAuth = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Twilio API error: ${errorData}`);
    }

    const call = await response.json();

    await supabaseClient.from('twilio_call_logs').insert({
      merchant_id: merchantId,
      lead_id: leadId || null,
      call_sid: call.sid,
      direction: 'outbound',
      from_number: fromNumber,
      to_number: toNumber,
      status: call.status,
      cost_cents: 0,
    });

    return new Response(
      JSON.stringify({ success: true, callSid: call.sid, status: call.status }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});