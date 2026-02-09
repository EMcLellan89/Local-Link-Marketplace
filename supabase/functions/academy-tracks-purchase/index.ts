import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, track_slug, referral_code } = await req.json();

    if (!user_id || !track_slug) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or track_slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("marketplace_products")
      .select("*, prices:marketplace_product_prices(*)")
      .eq("slug", track_slug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Track product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const activePrice = product.prices?.find((p: any) => p.is_active && p.pricing === "one_time");

    if (!activePrice) {
      return new Response(
        JSON.stringify({ error: "No active pricing for this track" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let partner_id = null;
    if (referral_code) {
      const { data: partner } = await supabaseAdmin
        .from("marketplace_partners")
        .select("id")
        .eq("referral_code", referral_code)
        .maybeSingle();

      if (partner) {
        partner_id = partner.id;
      }
    }

    const checkoutSessionRecord = await supabaseAdmin
      .from("marketplace_checkout_sessions")
      .insert({
        product_id: product.id,
        customer_email: null,
        partner_referral_code: referral_code || null,
        total_cents: activePrice.amount_cents,
        currency: activePrice.currency || "usd",
        status: "pending",
      })
      .select()
      .single();

    if (checkoutSessionRecord.error) {
      throw checkoutSessionRecord.error;
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: activePrice.currency || "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
            },
            unit_amount: activePrice.amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get("APP_BASE_URL")}/academy/tracks/${track_slug}?success=true`,
      cancel_url: `${Deno.env.get("APP_BASE_URL")}/academy/tracks/${track_slug}?canceled=true`,
      client_reference_id: user_id,
      metadata: {
        product_id: product.id,
        partner_id: partner_id || "",
        checkout_session_id: checkoutSessionRecord.data.id,
        track_slug: track_slug,
        type: "academy_track",
      },
    });

    await supabaseAdmin
      .from("marketplace_checkout_sessions")
      .update({
        stripe_session_id: stripeSession.id,
        customer_email: stripeSession.customer_details?.email || null,
      })
      .eq("id", checkoutSessionRecord.data.id);

    return new Response(
      JSON.stringify({
        ok: true,
        checkout_url: stripeSession.url,
        session_id: stripeSession.id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating track purchase:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create track purchase" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
