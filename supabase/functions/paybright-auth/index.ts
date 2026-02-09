import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PayBrightAuthRequest {
  merchantId: string;
  transactionType: 'deal_purchase' | 'subscription' | 'merchant_service' | 'other';
  referenceId?: string;
  referenceTable?: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  callbackUrl: string;
  redirectUrl: string;
  metadata?: Record<string, any>;
}

function generateSignature(params: Record<string, any>, apiToken: string): string {
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

    const requestData: PayBrightAuthRequest = await req.json();

    const { data: config, error: configError } = await supabase
      .from('paybright_config')
      .select('api_key, api_token_encrypted, environment')
      .eq('merchant_id', requestData.merchantId)
      .eq('is_active', true)
      .maybeSingle();

    if (configError || !config) {
      throw new Error('PayBright not configured for this merchant');
    }

    const amountCents = Math.round(requestData.amount * 100);

    const paybrightParams: Record<string, any> = {
      x_account_id: config.api_key,
      x_amount: (amountCents / 100).toFixed(2),
      x_currency: 'CAD',
      x_reference: crypto.randomUUID(),
      x_shop_name: 'LocalLink Marketplace',
      x_customer_email: requestData.customerEmail,
      x_customer_first_name: requestData.billingAddress.firstName,
      x_customer_last_name: requestData.billingAddress.lastName,
      x_customer_phone: requestData.billingAddress.phone,
      x_customer_billing_address1: requestData.billingAddress.address1,
      x_customer_billing_city: requestData.billingAddress.city,
      x_customer_billing_state: requestData.billingAddress.province,
      x_customer_billing_zip: requestData.billingAddress.postalCode,
      x_customer_billing_country: requestData.billingAddress.country,
      x_url_callback: requestData.callbackUrl,
      x_url_complete: requestData.redirectUrl,
      x_url_cancel: requestData.redirectUrl,
    };

    if (requestData.shippingAddress) {
      paybrightParams.x_customer_shipping_first_name = requestData.shippingAddress.firstName;
      paybrightParams.x_customer_shipping_last_name = requestData.shippingAddress.lastName;
      paybrightParams.x_customer_shipping_address1 = requestData.shippingAddress.address1;
      paybrightParams.x_customer_shipping_city = requestData.shippingAddress.city;
      paybrightParams.x_customer_shipping_state = requestData.shippingAddress.province;
      paybrightParams.x_customer_shipping_zip = requestData.shippingAddress.postalCode;
      paybrightParams.x_customer_shipping_country = requestData.shippingAddress.country;
    }

    const signature = await generateSignature(paybrightParams, config.api_token_encrypted);
    paybrightParams.x_signature = signature;

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: transaction, error: txError } = await supabase
      .from('paybright_transactions')
      .insert({
        merchant_id: requestData.merchantId,
        customer_id: customer?.id,
        transaction_type: requestData.transactionType,
        reference_id: requestData.referenceId,
        reference_table: requestData.referenceTable,
        amount_cents: amountCents,
        currency: 'CAD',
        paybright_reference: paybrightParams.x_reference,
        status: 'pending',
        customer_email: requestData.customerEmail,
        customer_name: requestData.customerName,
        billing_address: requestData.billingAddress,
        shipping_address: requestData.shippingAddress,
        metadata: requestData.metadata || {},
      })
      .select('id')
      .single();

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`);
    }

    const paybrightUrl = config.environment === 'live' 
      ? 'https://app.paybright.com/CheckOut/Apply'
      : 'https://sandbox.paybright.com/CheckOut/Apply';

    const formData = new URLSearchParams(paybrightParams);
    const paybrightResponse = await fetch(paybrightUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const responseText = await paybrightResponse.text();

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transaction.id,
        paybrightReference: paybrightParams.x_reference,
        checkoutHtml: responseText,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('PayBright auth error:', error);
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