import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: queuedSMS, error: fetchError } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('status', 'queued')
      .lte('send_after', new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    if (!queuedSMS || queuedSMS.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No SMS to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const sms of queuedSMS) {
      try {
        if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
          const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
              },
              body: new URLSearchParams({
                To: sms.phone_number,
                From: TWILIO_PHONE_NUMBER,
                Body: sms.body,
              }),
            }
          );

          if (!twilioResponse.ok) {
            const errorData = await twilioResponse.text();
            throw new Error(`Twilio API error: ${errorData}`);
          }

          const twilioData = await twilioResponse.json();

          await supabase
            .from('sms_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              twilio_sid: twilioData.sid,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sms.id);

          results.sent++;
        } else {
          console.log(`[DEV] Would send SMS to ${sms.phone_number}: ${sms.body}`);

          await supabase
            .from('sms_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              twilio_sid: 'dev-mode-' + sms.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sms.id);

          results.sent++;
        }
      } catch (error) {
        await supabase
          .from('sms_queue')
          .update({
            status: 'failed',
            error_message: String(error),
            updated_at: new Date().toISOString(),
          })
          .eq('id', sms.id);

        results.failed++;
        results.errors.push(`${sms.template_key || 'sms'}: ${String(error)}`);
      }
    }

    return new Response(
      JSON.stringify({
        processed: queuedSMS.length,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('SMS worker error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});