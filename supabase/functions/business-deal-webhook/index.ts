import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature');
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET_DEALS');

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Processing event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await handleSuccessfulPayment(session);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
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

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const {
    type,
    item_id,
    user_id,
    merchant_id,
    partner_id,
    campaign_id,
    vendor_id
  } = metadata;

  const amountCents = session.amount_total || 0;

  // Calculate revenue split
  let vendorCommissionCents = 0;
  let partnerCommissionCents = 0;
  let platformRevenueCents = amountCents;

  // Get deal/bundle details for commission calculation
  if (type === 'deal' && item_id) {
    const { data: deal } = await supabaseAdmin
      .from('business_deals')
      .select('commission_percent, partner_commission_percent, vendor_id')
      .eq('id', item_id)
      .single();

    if (deal) {
      // Vendor gets their commission
      if (deal.commission_percent) {
        vendorCommissionCents = Math.round(amountCents * (deal.commission_percent / 100));
      }

      // Partner gets their commission
      if (partner_id && deal.partner_commission_percent) {
        partnerCommissionCents = Math.round(amountCents * (deal.partner_commission_percent / 100));
      }

      // Platform gets the rest
      platformRevenueCents = amountCents - vendorCommissionCents - partnerCommissionCents;

      // Update deal stats
      await supabaseAdmin.rpc('increment', {
        table_name: 'business_deals',
        row_id: item_id,
        column_name: 'purchase_count'
      });
    }
  } else if (type === 'bundle' && item_id) {
    const { data: bundle } = await supabaseAdmin
      .from('deal_bundles')
      .select('margin_cents, commission_split')
      .eq('id', item_id)
      .single();

    if (bundle) {
      platformRevenueCents = bundle.margin_cents || 0;

      // Partner gets 30% of margin by default
      if (partner_id) {
        partnerCommissionCents = Math.round(platformRevenueCents * 0.30);
        platformRevenueCents -= partnerCommissionCents;
      }

      // Update bundle stats
      await supabaseAdmin.rpc('increment', {
        table_name: 'deal_bundles',
        row_id: item_id,
        column_name: 'purchase_count'
      });
    }
  }

  // Update transaction to completed
  const { error: updateError } = await supabaseAdmin
    .from('deal_transactions')
    .update({
      status: 'completed',
      vendor_commission_cents: vendorCommissionCents,
      partner_commission_cents: partnerCommissionCents,
      platform_revenue_cents: platformRevenueCents,
      stripe_payment_intent_id: session.payment_intent as string,
      completed_at: new Date().toISOString()
    })
    .eq('stripe_session_id', session.id);

  if (updateError) {
    console.error('Error updating transaction:', updateError);
  }

  // Update vendor revenue
  if (vendor_id && vendorCommissionCents > 0) {
    await supabaseAdmin.rpc('increment', {
      table_name: 'vendors',
      row_id: vendor_id,
      column_name: 'total_revenue_cents',
      increment_by: vendorCommissionCents
    });

    await supabaseAdmin.rpc('increment', {
      table_name: 'vendors',
      row_id: vendor_id,
      column_name: 'total_referrals'
    });
  }

  // Create partner commission record
  if (partner_id && partnerCommissionCents > 0) {
    await supabaseAdmin
      .from('marketplace_affiliate_commissions')
      .insert({
        affiliate_id: partner_id,
        product_id: item_id,
        order_id: session.id,
        commission_amount_cents: partnerCommissionCents,
        commission_rate: metadata.partner_commission_percent || 30,
        status: 'approved',
        order_date: new Date().toISOString(),
        metadata: {
          type,
          session_id: session.id
        }
      });

    // Update partner deal link stats
    if (type === 'deal') {
      await supabaseAdmin
        .from('partner_deal_links')
        .update({
          conversion_count: supabaseAdmin.sql`conversion_count + 1`,
          total_revenue_cents: supabaseAdmin.sql`total_revenue_cents + ${amountCents}`,
          total_commission_cents: supabaseAdmin.sql`total_commission_cents + ${partnerCommissionCents}`
        })
        .eq('partner_id', partner_id)
        .eq('deal_id', item_id);
    }
  }

  // Update campaign stats
  if (campaign_id) {
    await supabaseAdmin
      .from('seasonal_campaigns')
      .update({
        total_revenue_cents: supabaseAdmin.sql`total_revenue_cents + ${amountCents}`,
        total_conversions: supabaseAdmin.sql`total_conversions + 1`
      })
      .eq('id', campaign_id);
  }

  console.log('Payment processed successfully:', {
    session_id: session.id,
    amount_cents: amountCents,
    vendor_commission_cents: vendorCommissionCents,
    partner_commission_cents: partnerCommissionCents,
    platform_revenue_cents: platformRevenueCents
  });
}
