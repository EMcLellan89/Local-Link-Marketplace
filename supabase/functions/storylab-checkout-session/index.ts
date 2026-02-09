import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CheckoutRequest {
  itemKey: string;
  businessKey: string;
  verticalKey: 'kids' | 'teen' | 'adult';
  refCode?: string;
  refPartnerId?: string;
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body: CheckoutRequest = await req.json();
    const { itemKey, businessKey, verticalKey, refCode, refPartnerId, successUrl, cancelUrl } = body;

    // Get pricing from database
    const { data: pricingItem, error: pricingError } = await supabase
      .from('marketplace_affiliate_products')
      .select('*')
      .eq('sku', itemKey)
      .eq('business_key', businessKey)
      .single();

    if (pricingError || !pricingItem) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get partner if ref code provided
    let partnerId = refPartnerId;
    if (refCode && !partnerId) {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('unique_link_code', refCode)
        .single();

      if (partner) {
        partnerId = partner.id;
      }
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: user.id,
        business_key: businessKey,
        item_key: itemKey,
        vertical_key: verticalKey,
        partner_id: partnerId,
        amount_cents: pricingItem.price_cents,
        status: 'pending',
        meta: {
          product_name: pricingItem.name,
          is_recurring: pricingItem.recurring || false,
          ref_code: refCode
        }
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: pricingItem.recurring ? 'subscription' : 'payment',
      customer_email: user.email,
      line_items: [
        {
          price: pricingItem.stripe_price_id,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: order.id,
        business_key: businessKey,
        item_key: itemKey,
        vertical_key: verticalKey,
        partner_id: partnerId || '',
        user_id: user.id
      }
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update order with session ID
    await supabase
      .from('orders')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        orderId: order.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
