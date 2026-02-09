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

function tierRate(tier: string): number {
  if (tier === "enterprise") return 0.20;
  if (tier === "pro") return 0.15;
  return 0.10;
}

function computeCommissionRate(partner: any): number {
  if (!partner) return 0;

  const rate = tierRate(partner.tier);

  if (partner.membership_active === true) return rate;

  if (partner.membership_ends_at) {
    const endsAt = new Date(partner.membership_ends_at).getTime();
    const now = Date.now();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
    if (now <= endsAt + tenDaysMs) return rate;
  }

  return 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Load order
    const { data: order, error: oErr } = await supabaseAdmin
      .from("marketplace_orders")
      .select("*")
      .eq("id", order_id)
      .maybeSingle();

    if (oErr || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Load checkout session
    const { data: cs } = await supabaseAdmin
      .from("marketplace_checkout_sessions")
      .select("*")
      .eq("id", order.checkout_session_id)
      .maybeSingle();

    if (!cs) {
      return new Response(
        JSON.stringify({ error: "Missing checkout session" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Load checkout config
    const { data: cfg } = await supabaseAdmin
      .from("marketplace_checkout_configs")
      .select("*")
      .eq("product_id", cs.product_id)
      .maybeSingle();

    if (!cfg?.enable_upsell || !cfg?.upsell_product_id) {
      return new Response(
        JSON.stringify({ error: "Upsell not enabled for this product" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get upsell price
    const { data: upsellPrice } = await supabaseAdmin
      .from("marketplace_product_prices")
      .select("*")
      .eq("product_id", cfg.upsell_product_id)
      .eq("pricing", "one_time")
      .eq("is_active", true)
      .maybeSingle();

    if (!upsellPrice) {
      return new Response(
        JSON.stringify({ error: "Upsell price not configured" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Order missing stripe_customer_id for 1-click upsell" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Charge off-session using stored payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: upsellPrice.amount_cents,
      currency: upsellPrice.currency || "usd",
      customer: order.stripe_customer_id,
      off_session: true,
      confirm: true,
      description: `Upsell for order ${order.id}`,
      metadata: {
        type: "upsell",
        parent_order_id: order.id,
        upsell_product_id: cfg.upsell_product_id,
      },
    });

    // Add upsell as order item
    await supabaseAdmin.from("marketplace_order_items").insert({
      order_id: order.id,
      product_id: cfg.upsell_product_id,
      item_type: "upsell",
      amount_cents: upsellPrice.amount_cents,
    });

    // Create commission if applicable
    if (cfg.upsell_commissionable && order.partner_id) {
      const { data: partner } = await supabaseAdmin
        .from("marketplace_partners")
        .select("*")
        .eq("id", order.partner_id)
        .maybeSingle();

      const rate = computeCommissionRate(partner);

      if (rate > 0) {
        const commAmount = Math.round(upsellPrice.amount_cents * rate);

        await supabaseAdmin.from("marketplace_commissions").insert({
          order_id: order.id,
          partner_id: order.partner_id,
          commission_rate: rate,
          commission_amount_cents: commAmount,
          status: "earned",
          earned_at: new Date().toISOString(),
        });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, payment_intent_id: paymentIntent.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error charging upsell:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to charge upsell" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
