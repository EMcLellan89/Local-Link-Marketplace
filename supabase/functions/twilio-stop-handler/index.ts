/**
 * Renamed context: Previously handled Twilio STOP/START SMS compliance commands.
 * Now handles Brevo SMS opt-out/opt-in webhook events.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const body = await req.json();
    const sender: string = (body.sender || body.from || '').replace(/[\s\-\+]/g, '');
    const content: string = (body.content || body.text || '').trim().toUpperCase();

    console.log('Inbound SMS opt event:', { sender, content });

    const stopCommands = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
    const startCommands = ['START', 'UNSTOP', 'SUBSCRIBE', 'YES'];

    if (stopCommands.includes(content)) {
      await supabase
        .from('contact_suppressions')
        .upsert(
          { channel: 'sms', address: sender, reason: 'user_opt_out' },
          { onConflict: 'channel,address' }
        );
      console.log('User opted out:', sender);
    } else if (startCommands.includes(content)) {
      await supabase
        .from('contact_suppressions')
        .delete()
        .eq('channel', 'sms')
        .eq('address', sender);
      console.log('User opted back in:', sender);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('SMS opt handler error:', error);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
