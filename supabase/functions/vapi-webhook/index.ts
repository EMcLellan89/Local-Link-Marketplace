import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface VapiWebhookEvent {
  type: string;
  call?: {
    id: string;
    orgId: string;
    assistantId: string;
    phoneNumberId: string;
    customer: {
      number: string;
    };
    status: string;
    startedAt?: string;
    endedAt?: string;
    cost?: number;
    transcript?: string;
    summary?: string;
    messages?: any[];
  };
  message?: {
    type: string;
    role: string;
    content: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const event: VapiWebhookEvent = await req.json();
    console.log('Vapi webhook event:', event.type);

    switch (event.type) {
      case 'assistant-request': {
        // Vapi is requesting which assistant to use for this call
        const phoneNumber = event.call?.phoneNumberId;

        if (!phoneNumber) {
          throw new Error('No phone number ID provided');
        }

        // Find merchant by phone number
        const { data: config } = await supabase
          .from('vapi_configurations')
          .select('merchant_id')
          .eq('phone_number_id', phoneNumber)
          .eq('is_active', true)
          .single();

        if (!config) {
          throw new Error('No active Vapi configuration found for this phone number');
        }

        // Get active assistant for merchant
        const { data: assistantData } = await supabase
          .rpc('get_merchant_active_assistant', { p_merchant_id: config.merchant_id });

        if (!assistantData || assistantData.error) {
          throw new Error('No active assistant found');
        }

        // Return assistant configuration
        return new Response(JSON.stringify({
          assistant: {
            name: assistantData.name,
            model: {
              provider: assistantData.model.includes('claude') ? 'anthropic' : 'openai',
              model: assistantData.model,
              temperature: assistantData.temperature,
              maxTokens: 500,
            },
            voice: {
              provider: assistantData.voice_provider,
              voiceId: assistantData.voice_id,
            },
            firstMessage: assistantData.first_message,
            firstMessageMode: 'assistant-speaks-first',
            recordingEnabled: true,
            interruptionsEnabled: true,
            transcriber: {
              provider: 'deepgram',
              model: 'nova-2',
              language: 'en-US',
            },
            serverMessages: ['conversation-update', 'end-of-call-report', 'status-update'],
            serverUrl: `${supabaseUrl}/functions/v1/vapi-webhook`,
          },
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'status-update': {
        // Call status changed (queued, ringing, in-progress, completed, etc.)
        if (!event.call) break;

        const { data: config } = await supabase
          .from('vapi_configurations')
          .select('merchant_id')
          .eq('phone_number_id', event.call.phoneNumberId)
          .single();

        if (config) {
          await supabase
            .from('vapi_call_logs')
            .upsert({
              merchant_id: config.merchant_id,
              vapi_call_id: event.call.id,
              customer_phone: event.call.customer.number,
              status: event.call.status,
              started_at: event.call.startedAt,
            }, {
              onConflict: 'vapi_call_id',
            });
        }
        break;
      }

      case 'end-of-call-report': {
        // Call ended, save transcript and summary
        if (!event.call) break;

        const { data: config } = await supabase
          .from('vapi_configurations')
          .select('merchant_id')
          .eq('phone_number_id', event.call.phoneNumberId)
          .single();

        if (config) {
          // Find or create customer
          let customerId = null;
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', event.call.customer.number)
            .maybeSingle();

          customerId = existingCustomer?.id;

          const durationSeconds = event.call.endedAt && event.call.startedAt
            ? Math.floor((new Date(event.call.endedAt).getTime() - new Date(event.call.startedAt).getTime()) / 1000)
            : null;

          const platformCostCents = event.call.cost ? Math.round(event.call.cost * 100) : null;

          // Save call log
          await supabase
            .from('vapi_call_logs')
            .upsert({
              merchant_id: config.merchant_id,
              vapi_call_id: event.call.id,
              customer_id: customerId,
              customer_phone: event.call.customer.number,
              status: event.call.status,
              duration_seconds: durationSeconds,
              cost_cents: platformCostCents,
              transcript: event.call.transcript || null,
              summary: event.call.summary || null,
              started_at: event.call.startedAt,
              ended_at: event.call.endedAt,
            }, {
              onConflict: 'vapi_call_id',
            });

          // Track billing for completed calls
          if (event.call.status === 'completed' && durationSeconds && platformCostCents) {
            await supabase.rpc('record_vapi_call_billing', {
              p_merchant_id: config.merchant_id,
              p_call_id: event.call.id,
              p_duration_seconds: durationSeconds,
              p_platform_cost_cents: platformCostCents,
            });
          }
        }
        break;
      }

      case 'conversation-update': {
        // Real-time transcript update (optional: can be used for live monitoring)
        console.log('Conversation update:', event.message);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing Vapi webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
