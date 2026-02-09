import Stripe from 'npm:stripe@16.12.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'No signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Partner CRM Webhook Event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.order_type !== 'partner_crm_subscription') {
          return new Response(JSON.stringify({ received: true, skipped: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const partner_id = session.metadata.partner_id;
        const customer_id = session.customer as string;
        const subscription_id = session.subscription as string;

        const { data: subscription } = await stripe.subscriptions.retrieve(subscription_id);

        await supabase.from('partner_crm_subscriptions').upsert({
          partner_id,
          stripe_customer_id: customer_id,
          stripe_subscription_id: subscription_id,
          status: 'active',
          payment_provider: 'stripe',
          tier: session.metadata.tier || 'monthly',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }, { onConflict: 'partner_id' });

        await supabase.from('partner_onboarding_progress').upsert({
          partner_id,
          step_key: 'partner_crm_activated',
          completed: true,
          completed_at: new Date().toISOString(),
          meta: { subscription_id, customer_id },
        }, { onConflict: 'partner_id,step_key' });

        await supabase
          .from('course_affiliate_referrals')
          .update({ status: 'pending' })
          .eq('affiliate_id', (select) =>
            select.from('course_affiliates').select('id').eq('user_id', partner_id).single()
          )
          .eq('status', 'withheld');

        console.log('Partner CRM activated:', partner_id);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription_id = invoice.subscription as string;

        if (!subscription_id) break;

        const { data: partnerSub } = await supabase
          .from('partner_crm_subscriptions')
          .select('partner_id')
          .eq('stripe_subscription_id', subscription_id)
          .maybeSingle();

        if (!partnerSub) break;

        const { data: subscription } = await stripe.subscriptions.retrieve(subscription_id);

        await supabase.from('partner_crm_subscriptions').update({
          status: 'active',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }).eq('stripe_subscription_id', subscription_id);

        await supabase.rpc('release_withheld_commissions', {
          p_partner_id: partnerSub.partner_id,
        });

        console.log('Partner CRM payment received:', partnerSub.partner_id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription_id = invoice.subscription as string;

        if (!subscription_id) break;

        const { data: partnerSub } = await supabase
          .from('partner_crm_subscriptions')
          .select('partner_id')
          .eq('stripe_subscription_id', subscription_id)
          .maybeSingle();

        if (!partnerSub) break;

        await supabase.from('partner_crm_subscriptions').update({
          status: 'past_due',
        }).eq('stripe_subscription_id', subscription_id);

        console.log('Partner CRM payment failed:', partnerSub.partner_id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscription_id = subscription.id;

        const { data: partnerSub } = await supabase
          .from('partner_crm_subscriptions')
          .select('partner_id')
          .eq('stripe_subscription_id', subscription_id)
          .maybeSingle();

        if (!partnerSub) break;

        await supabase.from('partner_crm_subscriptions').update({
          status: 'inactive',
        }).eq('stripe_subscription_id', subscription_id);

        const { data: affiliate } = await supabase
          .from('course_affiliates')
          .select('id')
          .eq('user_id', partnerSub.partner_id)
          .maybeSingle();

        if (affiliate) {
          await supabase
            .from('course_affiliate_referrals')
            .update({ status: 'withheld' })
            .eq('affiliate_id', affiliate.id)
            .eq('status', 'pending');
        }

        console.log('Partner CRM subscription canceled:', partnerSub.partner_id);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscription_id = subscription.id;

        await supabase.from('partner_crm_subscriptions').update({
          status: subscription.status === 'active' ? 'active' :
                  subscription.status === 'past_due' ? 'past_due' : 'inactive',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }).eq('stripe_subscription_id', subscription_id);

        console.log('Partner CRM subscription updated:', subscription_id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});