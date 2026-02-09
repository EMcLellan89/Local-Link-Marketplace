import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function verifyGoPayBrightSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSignature === signature;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const pbWebhookSecret = Deno.env.get("GOPAYBRIGHT_WEBHOOK_SECRET");

  const sb = createClient(supabaseUrl, supabaseKey);

  try {
    const signature = req.headers.get("x-gopaybright-signature");
    const body = await req.text();

    if (pbWebhookSecret && signature) {
      const isValid = await verifyGoPayBrightSignature(body, signature, pbWebhookSecret);
      if (!isValid) {
        await sb.from("payment_events").insert({
          provider: "gopaybright",
          event_type: "signature_verification_failed",
          payload: { body, signature },
          error: "Invalid signature",
          processed: false
        });

        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);

    await sb.from("payment_events").insert({
      provider: "gopaybright",
      event_type: event.event_type || event.type || "callback",
      event_id: event.order_id || event.transaction_id,
      payload: event,
      signature,
      processed: false
    });

    const metadata = event.metadata ? JSON.parse(event.metadata) : {};
    const partnerId = metadata.partner_id;
    const tier = metadata.tier || "core";
    const sku = metadata.sku || `partner-crm-${tier}`;

    if (!partnerId) {
      console.error("No partner_id in callback metadata");
      return new Response(JSON.stringify({ ok: true, message: "No partner_id" }), {
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }

    if (event.status === "approved" || event.status === "completed" || event.status === "active") {
      const subscriptionId = event.subscription_id || event.recurring_id || `gpb-${event.order_id}`;

      const nextBillingDate = event.next_billing_date
        ? new Date(event.next_billing_date).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await sb.from("partner_crm_subscriptions").upsert({
        partner_id: partnerId,
        stripe_customer_id: event.customer_id || event.order_id,
        stripe_subscription_id: subscriptionId,
        provider_subscription_id: subscriptionId,
        payment_provider: "gopaybright",
        tier,
        status: "active",
        current_period_end: nextBillingDate
      }, { onConflict: "payment_provider,stripe_subscription_id" });

      const amountCents = Math.round(parseFloat(event.amount || "0") * 100);

      await sb.from("orders").insert({
        stripe_customer_id: event.customer_id || event.order_id,
        stripe_subscription_id: subscriptionId,
        partner_id: partnerId,
        amount_cents: amountCents,
        currency: event.currency || "CAD",
        status: "paid",
        order_type: "partner_crm",
        sku,
        description: `Partner CRM ${tier} subscription`,
        metadata: { provider: "gopaybright", ...event }
      });

      await sb.from("payment_events").update({
        processed: true
      }).eq("event_id", event.order_id || event.transaction_id);

      console.log(`Partner CRM subscription activated for partner ${partnerId}`);
    } else if (event.status === "declined" || event.status === "failed" || event.status === "cancelled") {
      const subscriptionId = event.subscription_id || event.recurring_id || `gpb-${event.order_id}`;

      await sb.from("partner_crm_subscriptions").update({
        status: "canceled"
      }).eq("stripe_subscription_id", subscriptionId).eq("partner_id", partnerId);

      console.log(`Partner CRM subscription cancelled for partner ${partnerId}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    console.error("GoPayBright callback error:", e);

    await sb.from("payment_events").insert({
      provider: "gopaybright",
      event_type: "callback_error",
      payload: { error: String(e) },
      error: String(e),
      processed: false
    });

    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});