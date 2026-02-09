import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_AFFILIATE_WEBHOOK_SECRET");
    const INTERNAL_API_KEY = Deno.env.get("INTERNAL_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !INTERNAL_API_KEY) {
      throw new Error("Missing env vars");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const Stripe = (await import("npm:stripe@16")).default;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const meta = (session.metadata || {}) as Record<string, string>;

        const partner_code = (meta.partner_code || "").trim();
        const product_sku = (meta.product_sku || "").trim();
        const referral_id = (meta.referral_id || "").trim();

        if (!partner_code || !product_sku) {
          console.log("No partner attribution on checkout session");
          break;
        }

        if (session.mode === "subscription") {
          console.log("Subscription checkout - waiting for invoice.payment_succeeded");
          break;
        }

        const sale_amount_cents = Number(session.amount_total || 0);

        if (!sale_amount_cents || sale_amount_cents <= 0) {
          console.warn("No sale amount for payment mode checkout");
          break;
        }

        const order_id = session.id;
        const referred_email = session.customer_details?.email || null;

        const fnUrl = `${SUPABASE_URL}/functions/v1/create-marketplace-affiliate-commission`;
        const resp = await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Api-Key": INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            affiliate_code: partner_code,
            product_sku,
            order_id,
            sale_amount_cents,
            referred_email,
            referral_id: referral_id || null,
          }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("create-marketplace-affiliate-commission failed:", text);
        } else {
          console.log("Commission created for payment mode checkout:", order_id);
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;

        const subscriptionId = typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

        if (!subscriptionId) {
          console.log("No subscription on invoice");
          break;
        }

        const lockInsert = await supabase
          .from("marketplace_affiliate_subscription_locks")
          .insert({ subscription_id: subscriptionId });

        if (lockInsert.error) {
          const msg = String(lockInsert.error.message || "");
          if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")) {
            console.log("Commission already paid for subscription:", subscriptionId);
            break;
          }
          console.error("Lock insert error:", lockInsert.error);
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const meta = (sub.metadata || {}) as Record<string, string>;

        const partner_code = (meta.partner_code || "").trim();
        const product_sku = (meta.product_sku || "").trim();
        const referral_id = (meta.referral_id || "").trim();

        if (!partner_code || !product_sku) {
          console.log("No partner attribution on subscription");
          break;
        }

        const sale_amount_cents = Number(invoice.amount_paid || 0);

        if (!sale_amount_cents || sale_amount_cents <= 0) {
          console.log("Trial invoice ($0) - removing lock to pay later");
          await supabase
            .from("marketplace_affiliate_subscription_locks")
            .delete()
            .eq("subscription_id", subscriptionId);
          break;
        }

        const order_id = invoice.id;
        const referred_email = invoice.customer_email || null;

        const fnUrl = `${SUPABASE_URL}/functions/v1/create-marketplace-affiliate-commission`;
        const resp = await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Api-Key": INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            affiliate_code: partner_code,
            product_sku,
            order_id,
            sale_amount_cents,
            referred_email,
            referral_id: referral_id || null,
          }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("create-marketplace-affiliate-commission failed:", text);

          await supabase
            .from("marketplace_affiliate_subscription_locks")
            .delete()
            .eq("subscription_id", subscriptionId);
        } else {
          console.log("Commission created for subscription:", subscriptionId);
        }

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
