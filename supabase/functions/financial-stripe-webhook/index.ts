import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { stripeClient } from "../_shared/stripeClient.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import Stripe from "npm:stripe@14.25.0";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    const stripe = stripeClient();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET_FINANCIAL");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err) {
      console.error("[Financial Webhook] Signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("[Financial Webhook] Event type:", event.type);

    const supabase = supabaseAdmin();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        if (session.mode === "subscription" && session.subscription) {
          const merchant_id = metadata.merchant_id;
          const plan_code = metadata.plan_code;
          const referral_id = metadata.referral_id || null;
          const referral_name = metadata.referral_name || null;
          const partner_id = metadata.partner_id || null;

          const { data: plan } = await supabase
            .from("plan_pricing")
            .select("*")
            .eq("code", plan_code)
            .maybeSingle();

          if (merchant_id && plan) {
            const { error: subError } = await supabase
              .from("financial_subscriptions")
              .insert({
                merchant_id,
                plan_code,
                stripe_subscription_id: session.subscription as string,
                stripe_customer_id: session.customer as string,
                status: "active",
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                referral_id,
                referral_name,
                partner_id,
              });

            if (subError) {
              console.error("[Financial Webhook] Subscription insert error:", subError);
            } else {
              console.log("[Financial Webhook] Subscription created for merchant:", merchant_id);
            }
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
          const { data: subscription } = await supabase
            .from("financial_subscriptions")
            .select("*, plan_pricing(*)")
            .eq("stripe_subscription_id", invoice.subscription)
            .eq("status", "active")
            .maybeSingle();

          if (subscription && subscription.partner_id) {
            const amount_cents = Math.round(
              (invoice.amount_paid / 100) * (subscription.plan_pricing?.commission_rate || 0.25) * 100
            );

            const { error: commError } = await supabase
              .from("commissions")
              .insert({
                partner_id: subscription.partner_id,
                merchant_id: subscription.merchant_id,
                subscription_id: subscription.id,
                amount_cents,
                currency: "USD",
                type: "recurring",
                status: "pending",
                period_start: new Date(invoice.period_start * 1000).toISOString(),
                period_end: new Date(invoice.period_end * 1000).toISOString(),
                stripe_invoice_id: invoice.id,
              });

            if (commError) {
              console.error("[Financial Webhook] Commission insert error:", commError);
            } else {
              console.log("[Financial Webhook] Commission created:", amount_cents / 100);
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error: updateError } = await supabase
          .from("financial_subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (updateError) {
          console.error("[Financial Webhook] Subscription update error:", updateError);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error: cancelError } = await supabase
          .from("financial_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (cancelError) {
          console.error("[Financial Webhook] Subscription cancel error:", cancelError);
        }
        break;
      }

      default:
        console.log("[Financial Webhook] Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Financial Webhook] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
