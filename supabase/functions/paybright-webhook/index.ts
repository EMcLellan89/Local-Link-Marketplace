import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function verifySignature(params: Record<string, any>, signature: string, apiToken: string): Promise<boolean> {
  const sortedKeys = Object.keys(params)
    .filter(key => key !== 'x_signature')
    .sort();
  
  const signatureString = sortedKeys
    .map(key => `${key}${params[key]}`)
    .join('');
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiToken);
  const messageData = encoder.encode(signatureString);
  
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => 
    crypto.subtle.sign('HMAC', key, messageData)
  ).then(generatedSignature => {
    const generatedHex = Array.from(new Uint8Array(generatedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return generatedHex === signature;
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const contentType = req.headers.get('content-type') || '';
    let webhookData: Record<string, any>;

    if (contentType.includes('application/json')) {
      webhookData = await req.json();
    } else {
      const formData = await req.formData();
      webhookData = {};
      for (const [key, value] of formData.entries()) {
        webhookData[key] = value;
      }
    }

    const paybrightReference = webhookData.x_reference;
    const gatewayReference = webhookData.x_gateway_reference;
    const result = webhookData.x_result;
    const signature = webhookData.x_signature;

    const { data: webhookLog, error: logError } = await supabase
      .from('paybright_webhook_events')
      .insert({
        event_type: result || 'unknown',
        paybright_transaction_id: gatewayReference,
        paybright_reference: paybrightReference,
        payload: webhookData,
        signature: signature,
        status: 'received',
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Failed to log webhook:', logError);
    }

    const { data: transaction, error: txError } = await supabase
      .from('paybright_transactions')
      .select('id, merchant_id')
      .eq('paybright_reference', paybrightReference)
      .maybeSingle();

    if (txError || !transaction) {
      throw new Error('Transaction not found');
    }

    const { data: config, error: configError } = await supabase
      .from('paybright_config')
      .select('api_token_encrypted')
      .eq('merchant_id', transaction.merchant_id)
      .maybeSingle();

    if (configError || !config) {
      throw new Error('Configuration not found');
    }

    const isValid = await verifySignature(webhookData, signature, config.api_token_encrypted);

    await supabase
      .from('paybright_webhook_events')
      .update({ signature_verified: isValid })
      .eq('id', webhookLog.id);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    let updateData: any = {
      paybright_transaction_id: gatewayReference,
      updated_at: new Date().toISOString(),
    };

    switch (result) {
      case 'completed':
        updateData.status = 'authorized';
        updateData.authorization_date = new Date().toISOString();
        break;
      case 'pending':
        updateData.status = 'pending';
        break;
      case 'failed':
        updateData.status = 'failed';
        updateData.failure_reason = webhookData.x_message || 'Payment failed';
        break;
      default:
        updateData.status = 'pending';
    }

    const { data: updatedTx } = await supabase
      .from('paybright_transactions')
      .update(updateData)
      .eq('id', transaction.id)
      .select()
      .single();

    if (updatedTx && result === 'completed' && updatedTx.reference_id) {
      if (updatedTx.transaction_type === 'subscription') {
        const { data: subscription } = await supabase
          .from('merchant_subscriptions')
          .select('*, subscription_tiers(*)')
          .eq('id', updatedTx.reference_id)
          .maybeSingle();

        if (subscription && subscription.status !== 'active') {
          await supabase
            .from('merchant_subscriptions')
            .update({ status: 'active' })
            .eq('id', subscription.id);

          await supabase
            .from('merchants')
            .update({
              subscription_plan: subscription.subscription_tiers.name.toLowerCase(),
              current_subscription_id: subscription.id
            })
            .eq('id', subscription.merchant_id);

          const nextBillingDate = new Date();
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

          await supabase
            .from('paybright_subscriptions')
            .insert({
              merchant_id: subscription.merchant_id,
              customer_id: updatedTx.customer_id,
              subscription_type: 'merchant_tier',
              plan_name: subscription.subscription_tiers.name,
              amount_cents: updatedTx.amount_cents,
              billing_frequency: 'monthly',
              status: 'active',
              next_billing_date: nextBillingDate.toISOString().split('T')[0],
              start_date: new Date().toISOString().split('T')[0],
              last_payment_date: new Date().toISOString(),
              metadata: { subscription_id: subscription.id, tier_id: subscription.tier_id }
            });
        }
      } else if (updatedTx.transaction_type === 'merchant_service' && updatedTx.reference_table === 'swipe_file_access') {
        const { data: accessRecord } = await supabase
          .from('swipe_file_access')
          .select('*')
          .eq('id', updatedTx.reference_id)
          .maybeSingle();

        if (accessRecord && !accessRecord.access_granted_at) {
          await supabase
            .from('swipe_file_access')
            .update({
              access_granted_at: new Date().toISOString()
            })
            .eq('id', accessRecord.id);
        }
      }
    }

    await supabase
      .from('paybright_webhook_events')
      .update({
        status: 'processed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', webhookLog.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
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