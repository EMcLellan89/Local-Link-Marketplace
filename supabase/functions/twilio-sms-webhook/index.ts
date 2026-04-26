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
    const messageSid = formData.get('MessageSid')?.toString() || '';
    const from = formData.get('From')?.toString() || '';
    const to = formData.get('To')?.toString() || '';
    const body = formData.get('Body')?.toString() || '';
    const numMedia = parseInt(formData.get('NumMedia')?.toString() || '0');

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
      const mediaUrls = [];
      for (let i = 0; i < numMedia; i++) {
        const mediaUrl = formData.get(`MediaUrl${i}`)?.toString();
        if (mediaUrl) mediaUrls.push(mediaUrl);
      }

      await supabaseClient.from('twilio_sms_logs').insert({
        merchant_id: phoneConfig.merchant_id,
        message_sid: messageSid,
        direction: 'inbound',
        from_number: from,
        to_number: to,
        body: body,
        status: 'received',
        num_media: numMedia,
        media_urls: mediaUrls,
      });

      const { data: lead } = await supabaseClient
        .from('crm_leads')
        .select('id')
        .eq('merchant_id', phoneConfig.merchant_id)
        .eq('phone', from)
        .single();

      if (lead) {
        await supabaseClient
          .from('twilio_sms_logs')
          .update({ lead_id: lead.id })
          .eq('message_sid', messageSid);
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for your message. We'll get back to you soon!</Message>
</Response>`;

    return new Response(twiml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  } catch (error: any) {
    console.error('Error processing SMS webhook:', error);
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