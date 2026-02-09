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
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Key",
};

function requireAdmin(req: Request): boolean {
  const adminKey = req.headers.get("x-admin-key");
  return adminKey === Deno.env.get("LOCAL_LINK_ADMIN_KEY");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!requireAdmin(req)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid admin key" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { product_id, price_id } = await req.json();

    if (!product_id || !price_id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing product_id or price_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: product } = await supabaseAdmin
      .from("marketplace_products")
      .select("*")
      .eq("id", product_id)
      .single();

    if (!product) {
      return new Response(
        JSON.stringify({ ok: false, error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: price } = await supabaseAdmin
      .from("marketplace_product_prices")
      .select("*")
      .eq("id", price_id)
      .single();

    if (!price) {
      return new Response(
        JSON.stringify({ ok: false, error: "Price not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let stripeProductId = product.metadata?.stripe_product_id;

    if (!stripeProductId) {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description || undefined,
        metadata: {
          local_link_product_id: product.id,
          local_link_product_slug: product.slug,
          kind: product.metadata?.kind ?? "standard",
        },
      });

      stripeProductId = stripeProduct.id;

      await supabaseAdmin
        .from("marketplace_products")
        .update({
          metadata: { ...(product.metadata ?? {}), stripe_product_id: stripeProductId }
        })
        .eq("id", product.id);
    }

    const stripePrice = await stripe.prices.create({
      product: stripeProductId,
      currency: price.currency || "usd",
      unit_amount: price.amount_cents,
      recurring: price.pricing === "recurring"
        ? { interval: price.interval === "year" ? "year" : "month" }
        : undefined,
      metadata: {
        local_link_price_id: price.id,
        local_link_product_id: product.id,
        pricing_type: price.pricing,
      },
    });

    await supabaseAdmin
      .from("marketplace_product_prices")
      .update({ stripe_price_id: stripePrice.id })
      .eq("id", price.id);

    return new Response(
      JSON.stringify({
        ok: true,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePrice.id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
