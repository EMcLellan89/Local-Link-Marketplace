/**
 * SMS queue worker — previously used Twilio. Now uses Brevo transactional SMS.
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const BREVO_SMS_SENDER = Deno.env.get('BREVO_SMS_SENDER') || 'LocalLink';
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

    if (fetchError) throw fetchError;

    if (!queuedSMS || queuedSMS.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No SMS to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const sms of queuedSMS) {
      try {
        if (BREVO_API_KEY) {
          const brevoResp = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
            method: 'POST',
            headers: {
              'api-key': BREVO_API_KEY,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              sender: BREVO_SMS_SENDER,
              recipient: sms.phone_number,
              content: sms.body,
              type: 'transactional',
            }),
          });

          if (!brevoResp.ok) {
            const errJson = await brevoResp.json().catch(() => ({}));
            throw new Error(errJson?.message || `Brevo SMS error (${brevoResp.status})`);
          }

          const brevoData = await brevoResp.json();

          await supabase
            .from('sms_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              provider_id: String(brevoData.messageId || ''),
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
              provider_id: 'dev-mode-' + sms.id,
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
      JSON.stringify({ processed: queuedSMS.length, ...results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SMS worker error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
