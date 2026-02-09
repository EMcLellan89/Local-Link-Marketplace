import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { dealId, dealType, partnerId, campaignId } = await req.json();

    let item: any;
    let itemType: string;

    if (dealType === 'bundle') {
      const { data: bundle, error } = await supabaseClient
        .from('deal_bundles')
        .select('*')
        .eq('id', dealId)
        .eq('status', 'active')
        .single();

      if (error || !bundle) {
        throw new Error('Bundle not found');
      }

      item = bundle;
      itemType = 'bundle';
    } else {
      const { data: deal, error } = await supabaseClient
        .from('business_deals')
        .select('*, vendor:vendors(*)')
        .eq('id', dealId)
        .eq('status', 'active')
        .single();

      if (error || !deal) {
        throw new Error('Deal not found');
      }

      item = deal;
      itemType = 'deal';
    }

    // Check if item has Stripe price ID, otherwise create on the fly
    let priceId = itemType === 'bundle' ? item.stripe_price_id : null;

    if (!priceId) {
      // Create Stripe product and price on the fly
      const product = await stripe.products.create({
        name: item.title || item.name,
        description: item.description,
        images: item.image_url ? [item.image_url] : [],
        metadata: {
          type: itemType,
          item_id: dealId
        }
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: itemType === 'bundle' ? item.bundle_price_cents : item.deal_price_cents,
        currency: 'usd',
        metadata: {
          type: itemType,
          item_id: dealId
        }
      });

      priceId = price.id;

      // Update the item with Stripe IDs
      if (itemType === 'bundle') {
        await supabaseClient
          .from('deal_bundles')
          .update({
            stripe_product_id: product.id,
            stripe_price_id: priceId
          })
          .eq('id', dealId);
      }
    }

    // Get merchant/partner info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let merchantId = null;
    if (profile?.role === 'merchant') {
      const { data: merchant } = await supabaseClient
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      merchantId = merchant?.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('SITE_URL')}/marketplace/deals/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/marketplace/deals/${item.slug || dealId}`,
      metadata: {
        type: itemType,
        item_id: dealId,
        user_id: user.id,
        merchant_id: merchantId || '',
        partner_id: partnerId || '',
        campaign_id: campaignId || '',
        vendor_id: itemType === 'deal' ? item.vendor_id : ''
      }
    });

    // Create pending transaction
    await supabaseClient
      .from('deal_transactions')
      .insert({
        transaction_type: itemType,
        deal_id: itemType === 'deal' ? dealId : null,
        bundle_id: itemType === 'bundle' ? dealId : null,
        vendor_id: itemType === 'deal' ? item.vendor_id : null,
        partner_id: partnerId || null,
        merchant_id: merchantId || null,
        amount_cents: itemType === 'bundle' ? item.bundle_price_cents : item.deal_price_cents,
        stripe_session_id: session.id,
        status: 'pending',
        campaign_id: campaignId || null,
        metadata: {
          session_url: session.url
        }
      });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
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
