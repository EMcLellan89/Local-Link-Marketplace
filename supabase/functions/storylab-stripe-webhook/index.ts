import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'stripe-signature, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'No signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET_STORYLAB') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // ============ IDEMPOTENCY CHECK ============
    const { data: existingEvent } = await supabase
      .from('stripe_webhook_events')
      .select('id')
      .eq('id', event.id)
      .single();

    if (existingEvent) {
      console.log('Event already processed:', event.id);
      return new Response(JSON.stringify({ received: true, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record event as processed
    await supabase
      .from('stripe_webhook_events')
      .insert({
        id: event.id,
        event_type: event.type,
        meta: { data: event.data }
      });

    // ============ HANDLE EVENTS ============
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(supabase, event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(supabase, event.data.object as Stripe.Subscription);
        break;

      case 'charge.refunded':
        await handleRefund(supabase, event.data.object as Stripe.Charge);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error('No order_id in session metadata');
    return;
  }

  // Get order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }

  // Update order status
  await supabase
    .from('orders')
    .update({
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent,
      paid_at: new Date().toISOString(),
      meta: {
        ...order.meta,
        stripe_session_id: session.id
      }
    })
    .eq('id', orderId);

  // ============ CREATE COMMISSION ============
  if (order.partner_id) {
    await createCommission(supabase, order);
  }

  // ============ GRANT ACCESS ============
  await grantStoryLabAccess(supabase, order);

  console.log('Checkout completed for order:', orderId);
}

async function createCommission(supabase: any, order: any) {
  // Get business commission rate
  const { data: business } = await supabase
    .from('profit_network_businesses')
    .select('*')
    .eq('business_key', order.business_key)
    .single();

  if (!business) {
    console.error('Business not found:', order.business_key);
    return;
  }

  // Calculate commission
  let commissionRate = business.base_commission_rate;

  // Add bonus if active
  if (business.bonus_active) {
    const now = new Date();
    const bonusExpires = business.bonus_expires_at ? new Date(business.bonus_expires_at) : null;
    if (!bonusExpires || bonusExpires > now) {
      commissionRate += business.bonus_commission_rate;
    }
  }

  const grossCommissionCents = Math.floor(order.amount_cents * commissionRate);

  // Create commission record
  await supabase
    .from('marketplace_affiliate_commissions')
    .insert({
      creator_id: order.partner_id,
      product_id: order.item_key,
      order_id: order.id,
      sale_amount_cents: order.amount_cents,
      commission_rate: commissionRate,
      commission_amount_cents: grossCommissionCents,
      status: 'pending',
      meta: {
        business_key: order.business_key,
        vertical_key: order.vertical_key,
        base_rate: business.base_commission_rate,
        bonus_rate: business.bonus_commission_rate || 0
      }
    });

  console.log('Commission created:', {
    partner_id: order.partner_id,
    amount_cents: grossCommissionCents,
    rate: commissionRate
  });
}

async function grantStoryLabAccess(supabase: any, order: any) {
  const isRecurring = order.meta?.is_recurring || false;

  if (isRecurring) {
    // Create subscription record
    await supabase
      .from('user_subscriptions')
      .insert({
        user_id: order.profile_id,
        subscription_type: order.item_key,
        business_key: order.business_key,
        vertical_key: order.vertical_key,
        status: 'active',
        started_at: new Date().toISOString(),
        meta: {
          order_id: order.id,
          product_name: order.meta?.product_name
        }
      });
  } else {
    // Grant one-time access (DFY, addons, etc.)
    await supabase
      .from('user_purchases')
      .insert({
        user_id: order.profile_id,
        product_key: order.item_key,
        business_key: order.business_key,
        vertical_key: order.vertical_key,
        order_id: order.id,
        purchased_at: new Date().toISOString(),
        meta: {
          product_name: order.meta?.product_name
        }
      });
  }

  console.log('Access granted for order:', order.id);
}

async function handleSubscriptionChange(supabase: any, subscription: Stripe.Subscription) {
  // Update subscription status in database
  const metadata = subscription.metadata;
  if (!metadata?.user_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' : 'inactive',
      stripe_subscription_id: subscription.id,
      meta: {
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      }
    })
    .eq('user_id', metadata.user_id)
    .eq('subscription_type', metadata.item_key || '');

  console.log('Subscription updated:', subscription.id, subscription.status);
}

async function handleSubscriptionCanceled(supabase: any, subscription: Stripe.Subscription) {
  const metadata = subscription.metadata;
  if (!metadata?.user_id) return;

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('user_id', metadata.user_id)
    .eq('stripe_subscription_id', subscription.id);

  console.log('Subscription canceled:', subscription.id);
}

async function handleRefund(supabase: any, charge: Stripe.Charge) {
  // Find order by payment intent
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', charge.payment_intent)
    .single();

  if (!order) return;

  // Update order status
  await supabase
    .from('orders')
    .update({
      status: 'refunded',
      refunded_at: new Date().toISOString(),
      refund_amount_cents: charge.amount_refunded
    })
    .eq('id', order.id);

  // Reverse commission if exists
  if (order.partner_id) {
    await supabase
      .from('marketplace_affiliate_commissions')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString()
      })
      .eq('order_id', order.id);
  }

  console.log('Refund processed for order:', order.id);
}
