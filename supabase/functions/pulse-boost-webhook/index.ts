import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET_PULSE_BOOST')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature',
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

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature provided');
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Check if this is a boost payment
      if (session.metadata?.type === 'pulse_boost') {
        const { merchant_id, deal_id, boost_type } = session.metadata;

        // Calculate boost expiry
        const now = new Date();
        let expiresAt = new Date(now);

        switch (boost_type) {
          case 'flash_friday':
            // Expires at end of Friday
            expiresAt.setHours(23, 59, 59, 999);
            break;
          case 'standard_7day':
          case 'homepage_featured':
          case 'push_blast':
            // 7 days from now
            expiresAt.setDate(expiresAt.getDate() + 7);
            break;
        }

        // Insert boost record
        const { error: boostError } = await supabase.from('pulse_boosts').insert({
          merchant_id,
          deal_id,
          boost_type,
          price_cents: session.amount_total || 0,
          stripe_payment_intent_id: session.payment_intent as string,
          purchased_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        });

        if (boostError) {
          console.error('Error inserting boost record:', boostError);
          throw boostError;
        }

        // Update deal with boost
        const { error: dealError } = await supabase
          .from('deals')
          .update({
            boost_type,
            boost_expires_at: expiresAt.toISOString(),
          })
          .eq('id', deal_id);

        if (dealError) {
          console.error('Error updating deal:', dealError);
          throw dealError;
        }

        // Increment merchant boost counter
        await supabase.rpc('increment', {
          row_id: merchant_id,
          table_name: 'merchants',
          column_name: 'total_boosts_purchased',
        }).catch(() => {
          // If RPC doesn't exist, do manual update
          supabase
            .from('merchants')
            .select('total_boosts_purchased')
            .eq('id', merchant_id)
            .single()
            .then(({ data }) => {
              if (data) {
                supabase
                  .from('merchants')
                  .update({
                    total_boosts_purchased: (data.total_boosts_purchased || 0) + 1,
                  })
                  .eq('id', merchant_id);
              }
            });
        });

        console.log(`Boost activated: ${boost_type} for deal ${deal_id}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
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
