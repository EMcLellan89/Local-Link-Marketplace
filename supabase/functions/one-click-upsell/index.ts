import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { upsell_offer_id } = await req.json();

    if (!upsell_offer_id) {
      return new Response(
        JSON.stringify({ error: "Missing upsell_offer_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get upsell offer details
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("upsell_offers")
      .select("*")
      .eq("id", upsell_offer_id)
      .eq("is_active", true)
      .single();

    if (offerError || !offer) {
      return new Response(
        JSON.stringify({ error: "Invalid offer" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get or create Stripe customer
    const { data: existingCustomer } = await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let stripeCustomerId = existingCustomer?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await supabaseAdmin.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        email: user.email!,
      });
    }

    // Create Payment Intent for one-click purchase
    const paymentIntent = await stripe.paymentIntents.create({
      amount: offer.price_cents,
      currency: "usd",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
      metadata: {
        user_id: user.id,
        product_slug: offer.product_slug,
        upsell_offer_id: offer.id,
        product_type: "upsell",
      },
    });

    // Create pending upsell purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from("upsell_purchases")
      .insert({
        user_id: user.id,
        upsell_offer_id: offer.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: offer.price_cents,
        status: "pending",
      });

    if (purchaseError) {
      console.error("Error creating purchase record:", purchaseError);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upsell error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});