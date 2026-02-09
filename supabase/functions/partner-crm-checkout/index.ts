import Stripe from 'npm:stripe@16.12.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_BASE_URL = Deno.env.get('APP_BASE_URL') || 'http://localhost:5173';

const STRIPE_PRICE_PARTNER_CRM_MONTHLY = Deno.env.get('STRIPE_PRICE_PARTNER_CRM_MONTHLY') || 'price_partner_crm_monthly';
const STRIPE_PRICE_PARTNER_CRM_ANNUAL = Deno.env.get('STRIPE_PRICE_PARTNER_CRM_ANNUAL') || 'price_partner_crm_annual';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { tier } = await req.json();
    const partner_id = user.id;

    const price_id = tier === 'annual' ? STRIPE_PRICE_PARTNER_CRM_ANNUAL : STRIPE_PRICE_PARTNER_CRM_MONTHLY;

    const { data: existingSub } = await supabase
      .from('partner_crm_subscriptions')
      .select('stripe_customer_id')
      .eq('partner_id', partner_id)
      .maybeSingle();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: existingSub?.stripe_customer_id || undefined,
      customer_email: existingSub ? undefined : user.email,
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${APP_BASE_URL}/partner/billing?success=true`,
      cancel_url: `${APP_BASE_URL}/partner/billing?canceled=true`,
      metadata: {
        partner_id,
        order_type: 'partner_crm_subscription',
        tier,
      },
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          partner_id,
          order_type: 'partner_crm_subscription',
        },
      },
    });

    return new Response(JSON.stringify({ ok: true, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Partner CRM checkout error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});