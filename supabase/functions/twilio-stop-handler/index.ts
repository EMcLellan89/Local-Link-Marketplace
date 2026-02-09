import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Twilio SMS Inbound Webhook Handler
 * Handles STOP/START/HELP messages for SMS compliance
 *
 * CRITICAL: Must respond with TwiML to Twilio
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Parse Twilio webhook body (application/x-www-form-urlencoded)
    const formData = await req.formData();
    const from = formData.get('From')?.toString() || '';
    const body = (formData.get('Body')?.toString() || '').trim().toUpperCase();
    const messageSid = formData.get('MessageSid')?.toString() || '';

    console.log('Inbound SMS:', { from, body, messageSid });

    // Normalize phone number (remove +1, spaces, dashes)
    const normalizedPhone = from.replace(/[\s\-\+]/g, '');

    // ============ HANDLE STOP COMMANDS ============
    const stopCommands = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
    if (stopCommands.includes(body)) {
      // Add to suppression list
      await supabase
        .from('contact_suppressions')
        .upsert({
          channel: 'sms',
          address: normalizedPhone,
          reason: 'user_opt_out'
        }, {
          onConflict: 'channel,address'
        });

      console.log('User opted out:', normalizedPhone);

      // Respond with confirmation (required by carriers)
      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>You have been unsubscribed from StoryLab messages. Reply START to resubscribe.</Message>
</Response>`;

      return new Response(twimlResponse, {
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    }

    // ============ HANDLE START COMMANDS ============
    const startCommands = ['START', 'UNSTOP', 'SUBSCRIBE', 'YES'];
    if (startCommands.includes(body)) {
      // Remove from suppression list
      await supabase
        .from('contact_suppressions')
        .delete()
        .eq('channel', 'sms')
        .eq('address', normalizedPhone);

      console.log('User opted back in:', normalizedPhone);

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>You have been resubscribed to StoryLab messages. Reply STOP to unsubscribe.</Message>
</Response>`;

      return new Response(twimlResponse, {
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    }

    // ============ HANDLE HELP COMMANDS ============
    const helpCommands = ['HELP', 'INFO', '?'];
    if (helpCommands.includes(body)) {
      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>StoryLab: AI-powered story creation. Reply STOP to unsubscribe or START to resubscribe. Help: support@storylab.ai</Message>
</Response>`;

      return new Response(twimlResponse, {
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    }

    // ============ LOG UNRECOGNIZED MESSAGE ============
    console.log('Unrecognized inbound message:', { from, body });

    // Empty TwiML response (no reply)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

    return new Response(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });

  } catch (error: any) {
    console.error('Twilio webhook error:', error);

    // Return empty TwiML even on error (don't break Twilio)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

    return new Response(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  }
});
