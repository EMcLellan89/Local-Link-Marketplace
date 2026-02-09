import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_PARTNER_WEBHOOK_SECRET");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (!stripeWebhookSecret) {
      throw new Error("Missing Stripe webhook secret");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();

    const event = JSON.parse(body);

    console.log(`Received Stripe event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const partnerId = subscription.metadata?.partner_id;

        if (!partnerId) {
          console.warn("No partner_id in subscription metadata");
          break;
        }

        const { error: upsertError } = await supabase
          .from("partner_crm_subscriptions")
          .upsert({
            partner_id: partnerId,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: "stripe_subscription_id"
          });

        if (upsertError) {
          console.error("Error upserting subscription:", upsertError);
          throw upsertError;
        }

        console.log(`Subscription ${subscription.id} updated for partner ${partnerId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const { error: updateError } = await supabase
          .from("partner_crm_subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        if (updateError) {
          console.error("Error canceling subscription:", updateError);
          throw updateError;
        }

        console.log(`Subscription ${subscription.id} canceled`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const { data: subscription } = await supabase
          .from("partner_crm_subscriptions")
          .select("partner_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (!subscription) {
          console.warn(`No subscription found for invoice ${invoice.id}`);
          break;
        }

        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            partner_id: subscription.partner_id,
            amount_cents: invoice.amount_paid,
            status: "paid",
            order_type: "partner_crm",
            sku: "partner-crm",
            description: "Partner CRM Subscription",
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: invoice.customer,
            stripe_event_id: event.id,
          });

        if (orderError && !orderError.message.includes("duplicate")) {
          console.error("Error creating order:", orderError);
          throw orderError;
        }

        console.log(`Order created for invoice ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const { error: updateError } = await supabase
          .from("partner_crm_subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);

        if (updateError) {
          console.error("Error updating subscription to past_due:", updateError);
        }

        console.log(`Payment failed for subscription ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
