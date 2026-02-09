import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { product_slug, addon_codes = [], ref } = await req.json();

    if (!product_slug) {
      return new Response(
        JSON.stringify({ error: 'product_slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('dfy_products')
      .select('*, dfy_product_stripe(*)')
      .eq('slug', product_slug)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch addons if any
    let addons = [];
    if (addon_codes.length > 0) {
      const { data: addonsData, error: addonsError } = await supabase
        .from('dfy_addons')
        .select('*')
        .eq('product_id', product.id)
        .in('code', addon_codes)
        .eq('is_active', true);

      if (addonsError) throw addonsError;
      addons = addonsData || [];
    }

    // Resolve partner tracking if ref provided
    let partnerData = null;
    if (ref) {
      const { data: trackingLink } = await supabase
        .from('partner_dfy_tracking_links')
        .select('partner_id')
        .eq('slug', ref)
        .single();

      if (trackingLink) {
        partnerData = trackingLink;

        // Increment click count
        await supabase
          .from('partner_dfy_tracking_links')
          .update({ clicks: supabase.sql`clicks + 1` })
          .eq('slug', ref);
      }
    }

    // Create Stripe checkout session
    const lineItems = [];

    // Add setup fee
    if (product.dfy_product_stripe?.stripe_price_setup_id) {
      lineItems.push({
        price: product.dfy_product_stripe.stripe_price_setup_id,
        quantity: 1,
      });
    }

    // Add monthly subscription
    if (product.dfy_product_stripe?.stripe_price_monthly_id) {
      lineItems.push({
        price: product.dfy_product_stripe.stripe_price_monthly_id,
        quantity: 1,
      });
    }

    // Add addons
    for (const addon of addons) {
      if (addon.stripe_price_id) {
        lineItems.push({
          price: addon.stripe_price_id,
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${Deno.env.get('APP_URL')}/merchant/done-for-you/orders/{CHECKOUT_SESSION_ID}/success`,
      cancel_url: `${Deno.env.get('APP_URL')}/merchant/done-for-you/${product_slug}`,
      metadata: {
        user_id: user.id,
        product_id: product.id,
        product_slug: product.slug,
        referral_partner_id: partnerData?.partner_id || '',
        referral_source: ref ? 'partner_ad' : 'organic',
      },
    });

    // Create order record (webhook will update it later)
    const { error: orderError } = await supabase
      .from('dfy_orders')
      .insert({
        user_id: user.id,
        product_id: product.id,
        status: 'pending_payment',
        stripe_checkout_session_id: session.id,
        referral_partner_id: partnerData?.partner_id,
        referral_source: ref ? 'partner_ad' : 'organic',
        total_setup_cents: product.setup_price_cents,
        total_monthly_cents: product.monthly_price_cents,
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
    }

    return new Response(
      JSON.stringify({ checkout_url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error creating checkout session:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
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
