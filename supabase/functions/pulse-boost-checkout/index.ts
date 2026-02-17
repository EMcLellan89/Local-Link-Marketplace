import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { dealId, boostType } = await req.json();

    if (!dealId || !boostType) {
      throw new Error('Missing dealId or boostType');
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get merchant
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id, business_name')
      .eq('user_id', user.id)
      .single();

    if (merchantError || !merchant) {
      throw new Error('Merchant not found');
    }

    // Get deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('id, title, merchant_id')
      .eq('id', dealId)
      .eq('merchant_id', merchant.id)
      .single();

    if (dealError || !deal) {
      throw new Error('Deal not found or unauthorized');
    }

    // Define boost pricing
    const boostPricing: Record<string, { price: number; name: string; duration: string }> = {
      standard_7day: { price: 2900, name: 'Standard 7-Day Boost', duration: '7 days' },
      flash_friday: { price: 4900, name: 'Flash Friday Boost', duration: 'Friday only' },
      homepage_featured: { price: 9900, name: 'Homepage Featured', duration: '7 days' },
      push_blast: { price: 14900, name: 'Push Blast', duration: '7 days' },
    };

    const boost = boostPricing[boostType];
    if (!boost) {
      throw new Error('Invalid boost type');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${boost.name} - ${deal.title}`,
              description: `Boost your deal for ${boost.duration}`,
            },
            unit_amount: boost.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/merchant/pulse?boost_success=true`,
      cancel_url: `${req.headers.get('origin')}/merchant/pulse?boost_canceled=true`,
      metadata: {
        type: 'pulse_boost',
        merchant_id: merchant.id,
        deal_id: dealId,
        boost_type: boostType,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating boost checkout:', error);
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
