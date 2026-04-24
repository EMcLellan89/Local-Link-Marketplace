/**
 * Renamed context: Previously used Twilio. Now uses Brevo SMS API.
 * Function slug kept for backward compatibility with existing callers.
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { merchantId, toNumber, body, leadId } = await req.json();
    if (!merchantId || !toNumber || !body) {
      throw new Error('merchantId, toNumber, and body are required');
    }

    const { data: merchant } = await supabaseClient
      .from('merchants')
      .select('user_id')
      .eq('id', merchantId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!merchant) throw new Error('Merchant not found or unauthorized');

    // Load comm config (now stores Brevo sender phone)
    const { data: config } = await supabaseClient
      .from('comm_configurations')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('is_active', true)
      .eq('sms_enabled', true)
      .maybeSingle();

    const BREVO_API_KEY = config?.brevo_api_key || Deno.env.get('BREVO_API_KEY');
    const senderPhone = config?.sender_phone || Deno.env.get('BREVO_SMS_SENDER') || 'LocalLink';

    if (!BREVO_API_KEY) throw new Error('Brevo SMS not configured');

    const resp = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: senderPhone,
        recipient: toNumber,
        content: body,
        type: 'transactional',
      }),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(json?.message || `Brevo SMS failed (${resp.status})`);

    await supabaseClient.from('comm_sms_logs').insert({
      merchant_id: merchantId,
      lead_id: leadId || null,
      message_id: String(json.messageId || Date.now()),
      direction: 'outbound',
      from_number: senderPhone,
      to_number: toNumber,
      body,
      status: 'sent',
    });

    return new Response(
      JSON.stringify({ success: true, messageId: json.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
