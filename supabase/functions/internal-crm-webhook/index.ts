import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-API-Key, X-API-Secret',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const apiKey = req.headers.get('X-API-Key');
    const apiSecret = req.headers.get('X-API-Secret');
    const payload = await req.json();

    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: 'Missing API credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate API key and secret
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_api_key', {
        key_param: apiKey,
        secret_param: apiSecret
      })
      .single();

    if (validationError || !validationResult || !validationResult.valid) {
      return new Response(JSON.stringify({ error: 'Invalid API credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const businessId = validationResult.business_unit_id;
    const businessName = validationResult.business_name;

    const business = {
      id: businessId,
      name: businessName
    };

    // Store webhook payload
    await supabase.from('external_business_webhooks').insert({
      business_unit_id: business.id,
      webhook_type: payload.event_type || 'unknown',
      payload: payload,
      processed: false,
    });

    // Process based on event type
    switch (payload.event_type) {
      case 'customer.created':
      case 'customer.updated':
        await processCustomerEvent(supabase, business.id, payload);
        break;

      case 'sale.completed':
      case 'payment.succeeded':
        await processSaleEvent(supabase, business.id, payload);
        break;

      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.cancelled':
        await processSubscriptionEvent(supabase, business.id, payload);
        break;

      default:
        console.log('Unknown event type:', payload.event_type);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed',
        business: business.name,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processCustomerEvent(supabase: any, businessId: string, payload: any) {
  const customerData = payload.customer || payload.data;

  if (!customerData || !customerData.email) {
    console.log('Missing customer email');
    return;
  }

  // Find or create unified customer
  let { data: customer, error } = await supabase
    .from('unified_customers')
    .select('id')
    .eq('email', customerData.email)
    .single();

  if (error || !customer) {
    // Create new customer
    const { data: newCustomer, error: createError } = await supabase
      .from('unified_customers')
      .insert({
        email: customerData.email,
        full_name: customerData.name || customerData.full_name,
        phone: customerData.phone,
        business_name: customerData.business_name || customerData.company,
        customer_type: customerData.type || 'individual',
        primary_business_unit_id: businessId,
        stripe_customer_id: customerData.stripe_customer_id || customerData.id,
        metadata: customerData,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating customer:', createError);
      return;
    }

    customer = newCustomer;
  } else {
    // Update existing customer
    await supabase
      .from('unified_customers')
      .update({
        full_name: customerData.name || customerData.full_name,
        phone: customerData.phone,
        business_name: customerData.business_name || customerData.company,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.id);
  }

  // Create or update business relationship
  await supabase
    .from('customer_business_relationships')
    .upsert({
      customer_id: customer.id,
      business_unit_id: businessId,
      external_customer_id: customerData.id,
      metadata: customerData,
    }, {
      onConflict: 'customer_id,business_unit_id',
    });

  // Log activity
  await supabase.from('customer_activity_log').insert({
    customer_id: customer.id,
    business_unit_id: businessId,
    activity_type: payload.event_type,
    activity_description: `Customer ${payload.event_type.split('.')[1]} via webhook`,
    metadata: payload,
  });
}

async function processSaleEvent(supabase: any, businessId: string, payload: any) {
  const saleData = payload.sale || payload.payment || payload.data;

  if (!saleData || !saleData.customer_email) {
    console.log('Missing sale data or customer email');
    return;
  }

  // Find customer
  const { data: customer } = await supabase
    .from('unified_customers')
    .select('id')
    .eq('email', saleData.customer_email)
    .single();

  if (!customer) {
    console.log('Customer not found for sale');
    return;
  }

  // Record sale
  await supabase.from('unified_sales').insert({
    customer_id: customer.id,
    business_unit_id: businessId,
    transaction_id: saleData.transaction_id || saleData.id,
    order_number: saleData.order_number,
    product_name: saleData.product_name || saleData.description,
    product_sku: saleData.product_sku || saleData.sku,
    amount: parseFloat(saleData.amount) || 0,
    tax_amount: parseFloat(saleData.tax_amount) || 0,
    fee_amount: parseFloat(saleData.fee_amount) || 0,
    net_amount: parseFloat(saleData.net_amount || saleData.amount) || 0,
    currency: saleData.currency || 'USD',
    payment_method: saleData.payment_method,
    payment_status: saleData.status || 'paid',
    subscription_id: saleData.subscription_id,
    sale_date: saleData.sale_date || new Date().toISOString().split('T')[0],
    metadata: saleData,
  });

  // Update customer LTV
  const amount = parseFloat(saleData.net_amount || saleData.amount) || 0;
  await supabase.rpc('increment_customer_ltv', {
    p_customer_id: customer.id,
    p_amount: amount,
  });

  // Update business relationship
  await supabase.rpc('update_business_relationship_ltv', {
    p_customer_id: customer.id,
    p_business_id: businessId,
    p_amount: amount,
  });

  // Log activity
  await supabase.from('customer_activity_log').insert({
    customer_id: customer.id,
    business_unit_id: businessId,
    activity_type: 'purchase',
    activity_description: `Purchase: ${saleData.product_name || 'Product'} - $${amount}`,
    metadata: saleData,
  });
}

async function processSubscriptionEvent(supabase: any, businessId: string, payload: any) {
  const subData = payload.subscription || payload.data;

  if (!subData || !subData.customer_email) {
    console.log('Missing subscription data or customer email');
    return;
  }

  // Find customer
  const { data: customer } = await supabase
    .from('unified_customers')
    .select('id')
    .eq('email', subData.customer_email)
    .single();

  if (!customer) {
    console.log('Customer not found for subscription');
    return;
  }

  // Update business relationship status
  const status = subData.status === 'cancelled' ? 'cancelled' : 'active';
  await supabase
    .from('customer_business_relationships')
    .update({
      subscription_status: status,
      metadata: subData,
    })
    .eq('customer_id', customer.id)
    .eq('business_unit_id', businessId);

  // Log activity
  await supabase.from('customer_activity_log').insert({
    customer_id: customer.id,
    business_unit_id: businessId,
    activity_type: payload.event_type,
    activity_description: `Subscription ${payload.event_type.split('.')[1]}`,
    metadata: subData,
  });
}
