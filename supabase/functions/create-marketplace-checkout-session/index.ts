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
    const {
      product_slug,
      pricing,
      bump_selected = false,
      referral_code,
      ref,
      referral_name,
      referral_id,
      embedded = false,
      source_domain,
      customer_email,
    } = await req.json();

    if (!product_slug || !pricing) {
      return new Response(
        JSON.stringify({ error: "Missing product_slug or pricing" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1) Load product
    const { data: product, error: pErr } = await supabaseAdmin
      .from("marketplace_products")
      .select("*")
      .eq("slug", product_slug)
      .eq("is_active", true)
      .maybeSingle();

    if (pErr || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2) Load price
    const { data: price, error: prErr } = await supabaseAdmin
      .from("marketplace_product_prices")
      .select("*")
      .eq("product_id", product.id)
      .eq("pricing", pricing)
      .eq("is_active", true)
      .maybeSingle();

    if (prErr || !price || !price.stripe_price_id) {
      return new Response(
        JSON.stringify({ error: "Price not configured" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3) Load checkout config
    const { data: cfg } = await supabaseAdmin
      .from("marketplace_checkout_configs")
      .select("*")
      .eq("product_id", product.id)
      .maybeSingle();

    // 4) Handle order bump
    const shouldAddBump = bump_selected && cfg?.enable_order_bump && cfg?.order_bump_product_id;
    let bumpAmountCents = 0;

    if (shouldAddBump) {
      if (cfg.order_bump_amount_cents && cfg.order_bump_amount_cents > 0) {
        bumpAmountCents = cfg.order_bump_amount_cents;
      } else {
        const { data: bumpPrice } = await supabaseAdmin
          .from("marketplace_product_prices")
          .select("*")
          .eq("product_id", cfg.order_bump_product_id)
          .eq("pricing", "one_time")
          .eq("is_active", true)
          .maybeSingle();

        if (bumpPrice) {
          bumpAmountCents = bumpPrice.amount_cents;
        }
      }
    }

    const subtotalCents = price.amount_cents;
    const totalCents = subtotalCents + bumpAmountCents;

    // 5) Partner attribution - resolve referral
    let partner: any = null;
    let resolvedReferralId: number | null = null;
    let resolvedReferralName: string | null = null;
    let grantsLifetimeFree = false;

    // Special case: referral_id=2428 grants lifetime free (silent)
    if (referral_id && Number(referral_id) === 2428) {
      resolvedReferralId = 2428;
      resolvedReferralName = referral_name || "Family";
      grantsLifetimeFree = true;
      partner = null;
    } else if (ref) {
      // Resolve by partner slug (from ?ref= link)
      const { data: p } = await supabaseAdmin
        .from("partners")
        .select("id, referral_id, display_name, tier, status")
        .eq("referral_partner_link_slug", ref)
        .maybeSingle();

      if (p && p.status === "active") {
        partner = p;
        resolvedReferralId = p.referral_id;
        resolvedReferralName = p.display_name || referral_name;
      }
    } else if (referral_id) {
      // Resolve by referral_id (manually entered)
      const { data: p } = await supabaseAdmin
        .from("partners")
        .select("id, referral_id, display_name, tier, status")
        .eq("referral_id", Number(referral_id))
        .maybeSingle();

      if (p && p.status === "active") {
        partner = p;
        resolvedReferralId = p.referral_id;
        resolvedReferralName = p.display_name || referral_name;
      }
    } else if (referral_code) {
      // Legacy: referral_code from marketplace_partners
      const { data: p } = await supabaseAdmin
        .from("marketplace_partners")
        .select("*")
        .eq("referral_code", referral_code)
        .maybeSingle();
      partner = p;
    }

    // 6) Create Stripe checkout session
    const appUrl = Deno.env.get("APP_BASE_URL") || Deno.env.get("SUPABASE_URL")?.replace(/\/.*/, "") || "http://localhost:3000";
    const successUrl = `${appUrl}/marketplace/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/marketplace/products/${product.slug}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: price.stripe_price_id, quantity: 1 },
    ];

    if (shouldAddBump && bumpAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: price.currency || "usd",
          product_data: { name: `Order Bump Add-on` },
          unit_amount: bumpAmountCents,
        },
        quantity: 1,
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: pricing === "one_time" ? "payment" : "subscription",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customer_email || undefined,
      allow_promotion_codes: cfg?.enable_coupons ?? true,
      metadata: {
        product_id: product.id,
        price_id: price.id,
        partner_id: partner?.id ?? "",
        referral_code: referral_code ?? "",
        referral_name: resolvedReferralName ?? "",
        referral_id: resolvedReferralId ? String(resolvedReferralId) : "",
        embedded: embedded ? "true" : "false",
        source_domain: source_domain ?? "",
      },
    });

    // 7) Create checkout session record (store referral fields)
    const { data: cs, error: csErr } = await supabaseAdmin
      .from("marketplace_checkout_sessions")
      .insert({
        product_id: product.id,
        price_id: price.id,
        partner_id: partner?.id ?? null,
        partner_referral_code: referral_code ?? null,
        referral_name: resolvedReferralName,
        referral_id: resolvedReferralId,
        embedded,
        source_domain: source_domain ?? null,
        customer_email: customer_email ?? null,
        stripe_checkout_session_id: stripeSession.id,
        bump_selected: shouldAddBump,
        bump_product_id: shouldAddBump ? cfg?.order_bump_product_id : null,
        bump_amount_cents: bumpAmountCents,
        subtotal_cents: subtotalCents,
        total_cents: totalCents,
        currency: price.currency || "usd",
      })
      .select("*")
      .single();

    if (csErr) throw csErr;

    // 8) Create abandoned cart record
    await supabaseAdmin.from("marketplace_abandoned_carts").upsert(
      {
        checkout_session_id: cs.id,
        status: "open",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "checkout_session_id" }
    );

    return new Response(
      JSON.stringify({
        checkout_session_id: cs.id,
        stripe_checkout_url: stripeSession.url,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
