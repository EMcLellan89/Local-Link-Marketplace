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

    const { merchantId, toEmail, subject, bodyHtml, bodyText, leadId } = await req.json();

    if (!merchantId || !toEmail || !subject || (!bodyHtml && !bodyText)) {
      throw new Error('merchantId, toEmail, subject, and body are required');
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
      .eq('email_enabled', true)
      .single();

    if (!config || !config.sendgrid_api_key_encrypted || !config.email_from_address) {
      throw new Error('SendGrid not configured for this merchant');
    }

    const sendGridApiKey = config.sendgrid_api_key_encrypted;
    const fromEmail = config.email_from_address;
    const fromName = config.email_from_name || 'Local-Link CRM';

    const emailData = {
      personalizations: [{
        to: [{ email: toEmail }],
        subject: subject,
      }],
      from: {
        email: fromEmail,
        name: fromName,
      },
      content: [
        ...(bodyText ? [{ type: 'text/plain', value: bodyText }] : []),
        ...(bodyHtml ? [{ type: 'text/html', value: bodyHtml }] : []),
      ],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sendGridApiKey}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`SendGrid API error: ${errorData}`);
    }

    const messageId = response.headers.get('x-message-id') || `msg_${Date.now()}`;

    await supabaseClient.from('twilio_email_logs').insert({
      merchant_id: merchantId,
      lead_id: leadId || null,
      message_id: messageId,
      from_email: fromEmail,
      to_email: toEmail,
      subject: subject,
      body_html: bodyHtml || '',
      body_text: bodyText || '',
      status: 'sent',
      cost_cents: 0,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: messageId }),
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