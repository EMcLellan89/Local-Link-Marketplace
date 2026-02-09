import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
}

function generateSignature(params: Record<string, any>, apiToken: string): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
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
  ).then(signature => 
    Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const requestData: RefundRequest = await req.json();

    const { data: transaction, error: txError } = await supabase
      .from('paybright_transactions')
      .select('*')
      .eq('id', requestData.transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      throw new Error('Transaction not found');
    }

    if (!['captured', 'completed'].includes(transaction.status)) {
      throw new Error('Transaction cannot be refunded in current status');
    }

    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id')
      .eq('id', transaction.merchant_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (merchantError || !merchant) {
      throw new Error('Unauthorized to refund this transaction');
    }

    const { data: config, error: configError } = await supabase
      .from('paybright_config')
      .select('*')
      .eq('merchant_id', transaction.merchant_id)
      .eq('is_active', true)
      .maybeSingle();

    if (configError || !config) {
      throw new Error('PayBright not configured');
    }

    const refundAmountCents = requestData.amount 
      ? Math.round(requestData.amount * 100)
      : transaction.amount_cents;

    if (refundAmountCents > transaction.amount_cents) {
      throw new Error('Refund amount exceeds transaction amount');
    }

    const paybrightParams: Record<string, any> = {
      x_account_id: config.api_key,
      x_amount: (refundAmountCents / 100).toFixed(2),
      x_gateway_reference: transaction.paybright_transaction_id,
      x_reference: transaction.paybright_reference,
    };

    const signature = await generateSignature(paybrightParams, config.api_token_encrypted);
    paybrightParams.x_signature = signature;

    const { data: refund, error: refundError } = await supabase
      .from('paybright_refunds')
      .insert({
        transaction_id: transaction.id,
        merchant_id: transaction.merchant_id,
        refund_amount_cents: refundAmountCents,
        currency: transaction.currency,
        reason: requestData.reason,
        status: 'processing',
        requested_by: user.id,
      })
      .select('id')
      .single();

    if (refundError) {
      throw new Error('Failed to create refund record');
    }

    const paybrightUrl = config.environment === 'live'
      ? 'https://app.paybright.com/api/refund'
      : 'https://sandbox.paybright.com/api/refund';

    const formData = new URLSearchParams(paybrightParams);
    const paybrightResponse = await fetch(paybrightUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const responseText = await paybrightResponse.text();
    let responseData: any;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (paybrightResponse.ok) {
      await supabase
        .from('paybright_refunds')
        .update({
          status: 'completed',
          paybright_refund_id: responseData.x_gateway_reference || responseData.refund_id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', refund.id);

      const currentRefunds = await supabase
        .from('paybright_refunds')
        .select('refund_amount_cents')
        .eq('transaction_id', transaction.id)
        .eq('status', 'completed');

      const totalRefunded = currentRefunds.data?.reduce((sum, r) => sum + r.refund_amount_cents, 0) || 0;

      const newStatus = totalRefunded >= transaction.amount_cents ? 'refunded' : 'partially_refunded';

      await supabase
        .from('paybright_transactions')
        .update({ status: newStatus })
        .eq('id', transaction.id);

      return new Response(
        JSON.stringify({
          success: true,
          refundId: refund.id,
          status: 'completed',
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      await supabase
        .from('paybright_refunds')
        .update({
          status: 'failed',
          failure_reason: responseData.message || 'Refund failed',
        })
        .eq('id', refund.id);

      throw new Error(responseData.message || 'Refund failed');
    }
  } catch (error) {
    console.error('Refund error:', error);
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