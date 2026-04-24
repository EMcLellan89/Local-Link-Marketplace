/**
 * Renamed context: Previously a Twilio inbound SMS webhook.
 * Now handles Brevo inbound SMS webhooks.
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
    const { sender, recipient, content, messageId } = body;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Look up merchant by their configured sender phone
    const { data: config } = await supabaseClient
      .from('comm_configurations')
      .select('merchant_id')
      .eq('sender_phone', recipient)
      .eq('is_active', true)
      .maybeSingle();

    if (config?.merchant_id) {
      await supabaseClient.from('comm_sms_logs').insert({
        merchant_id: config.merchant_id,
        message_id: messageId || String(Date.now()),
        direction: 'inbound',
        from_number: sender,
        to_number: recipient,
        body: content,
        status: 'received',
      });

      // Link to CRM lead if phone matches
      const { data: lead } = await supabaseClient
        .from('crm_leads')
        .select('id')
        .eq('merchant_id', config.merchant_id)
        .eq('phone', sender)
        .maybeSingle();

      if (lead) {
        await supabaseClient
          .from('comm_sms_logs')
          .update({ lead_id: lead.id })
          .eq('message_id', messageId);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing SMS webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
