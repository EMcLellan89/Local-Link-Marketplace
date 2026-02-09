import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface WebhookPayload {
  event: string;
  data: {
    session_id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, any>;
    customer?: {
      email: string;
      name?: string;
      phone?: string;
    };
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

    const payload: WebhookPayload = await req.json();
    const { event, data } = payload;

    console.log('Processing subscription webhook:', event, data.reference);

    await supabase.from('webhook_event_store').insert({
      event_type: event,
      source: 'gopaybright',
      payload: payload,
      status: 'received'
    });

    if (event === 'checkout.completed' && data.status === 'paid') {
      const metadata = data.metadata || {};
      const type = metadata.type;

      console.log('Payment completed for type:', type);

      switch (type) {
        case 'tier_upgrade':
          await handleTierUpgrade(supabase, data, metadata);
          break;
        case 'partner_subscription':
          await handlePartnerSubscription(supabase, data, metadata);
          break;
        case 'addon_subscription':
          await handleAddonSubscription(supabase, data, metadata);
          break;
        case 'territory_license':
          await handleTerritoryLicense(supabase, data, metadata);
          break;
        case 'professional_service':
          await handleProfessionalService(supabase, data, metadata);
          break;
        default:
          console.warn('Unknown payment type:', type);
      }
    }

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
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function handleTierUpgrade(supabase: any, data: any, metadata: any) {
  const { merchant_id, tier_slug, billing_cycle, user_id } = metadata;

  console.log('Processing tier upgrade:', { merchant_id, tier_slug, billing_cycle });

  const startDate = new Date();
  const expiresAt = new Date(startDate);
  if (billing_cycle === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  await supabase
    .from('merchants')
    .update({
      subscription_plan: tier_slug,
      updated_at: new Date().toISOString()
    })
    .eq('id', merchant_id);

  await supabase
    .from('transactions')
    .insert({
      paybright_transaction_id: data.session_id,
      merchant_id: merchant_id,
      gross_amount_cents: data.amount,
      currency_code: data.currency,
      payment_status: 'Paid',
      payout_status: 'Unpaid',
      metadata: {
        type: 'tier_upgrade',
        tier_slug,
        billing_cycle
      }
    });

  console.log('Tier upgrade completed:', merchant_id, tier_slug);
}

async function handlePartnerSubscription(supabase: any, data: any, metadata: any) {
  const { partner_id, tier_id, billing_cycle } = metadata;

  console.log('Processing partner subscription:', { partner_id, tier_id, billing_cycle });

  const startDate = new Date();
  const expiresAt = new Date(startDate);
  const nextBillingDate = new Date(startDate);
  
  if (billing_cycle === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  }

  const { data: existingSub } = await supabase
    .from('partner_subscriptions')
    .select('id')
    .eq('partner_id', partner_id)
    .eq('status', 'active')
    .maybeSingle();

  if (existingSub) {
    await supabase
      .from('partner_subscriptions')
      .update({ status: 'canceled', canceled_at: new Date().toISOString() })
      .eq('id', existingSub.id);
  }

  await supabase
    .from('partner_subscriptions')
    .insert({
      partner_id,
      tier_id,
      status: 'active',
      billing_frequency: billing_cycle,
      amount_cents: data.amount,
      currency: data.currency,
      paybright_transaction_id: data.session_id,
      started_at: startDate.toISOString(),
      expires_at: expiresAt.toISOString(),
      next_billing_date: nextBillingDate.toISOString().split('T')[0]
    });

  console.log('Partner subscription activated:', partner_id);
}

async function handleAddonSubscription(supabase: any, data: any, metadata: any) {
  const { merchant_id, addon_id, billing_cycle } = metadata;

  console.log('Processing addon subscription:', { merchant_id, addon_id, billing_cycle });

  const startDate = new Date();
  const expiresAt = new Date(startDate);
  const nextBillingDate = new Date(startDate);
  
  if (billing_cycle === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  }

  await supabase
    .from('merchant_addon_subscriptions')
    .insert({
      merchant_id,
      addon_id,
      status: 'active',
      billing_frequency: billing_cycle,
      amount_cents: data.amount,
      currency: data.currency,
      paybright_transaction_id: data.session_id,
      started_at: startDate.toISOString(),
      expires_at: expiresAt.toISOString(),
      next_billing_date: nextBillingDate.toISOString().split('T')[0]
    });

  console.log('Addon subscription activated:', merchant_id, addon_id);
}

async function handleTerritoryLicense(supabase: any, data: any, metadata: any) {
  const { territory_id, partner_id, pricing_tier_id, billing_cycle } = metadata;

  console.log('Processing territory license:', { territory_id, partner_id, pricing_tier_id });

  const startDate = new Date();
  const expiresAt = new Date(startDate);
  const nextBillingDate = new Date(startDate);
  
  if (billing_cycle === 'annual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  }

  await supabase
    .from('territory_licenses')
    .insert({
      territory_id,
      partner_id,
      pricing_tier_id,
      status: 'active',
      billing_frequency: billing_cycle,
      amount_cents: data.amount,
      currency: data.currency,
      paybright_transaction_id: data.session_id,
      started_at: startDate.toISOString(),
      expires_at: expiresAt.toISOString(),
      next_billing_date: nextBillingDate.toISOString().split('T')[0]
    });

  await supabase
    .from('territories')
    .update({
      status: 'Assigned',
      assigned_partner_id: partner_id,
      launch_date: startDate.toISOString()
    })
    .eq('id', territory_id);

  console.log('Territory license activated:', territory_id);
}

async function handleProfessionalService(supabase: any, data: any, metadata: any) {
  const { service_id, customer_type, customer_id } = metadata;

  console.log('Processing professional service:', { service_id, customer_type, customer_id });

  const { data: booking } = await supabase
    .from('service_bookings')
    .select('id')
    .eq('service_id', service_id)
    .eq('customer_type', customer_type)
    .eq('customer_id', customer_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (booking) {
    await supabase
      .from('service_bookings')
      .update({
        status: 'confirmed',
        paybright_transaction_id: data.session_id
      })
      .eq('id', booking.id);

    console.log('Service booking confirmed:', booking.id);
  } else {
    await supabase
      .from('service_bookings')
      .insert({
        service_id,
        customer_type,
        customer_id,
        status: 'confirmed',
        amount_cents: data.amount,
        currency: data.currency,
        paybright_transaction_id: data.session_id
      });

    console.log('New service booking created');
  }
}
