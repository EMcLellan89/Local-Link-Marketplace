import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

const DFY_TASK_TEMPLATES: Record<string, Array<{ title: string; offsetHours?: number }>> = {
  "ai-missed-call-booking": [
    { title: "Verify intake + required access", offsetHours: 2 },
    { title: "Connect SMS number + missed-call trigger", offsetHours: 8 },
    { title: "Configure AI replies (services/FAQs/tone)", offsetHours: 12 },
    { title: "Connect booking link/calendar + test booking", offsetHours: 20 },
    { title: "Launch + send merchant confirmation", offsetHours: 30 },
  ],

  "ai-website-chat-closer": [
    { title: "Verify intake + website access", offsetHours: 2 },
    { title: "Install chat widget on website", offsetHours: 10 },
    { title: "Train AI on services/FAQs + tone", offsetHours: 16 },
    { title: "Connect booking/lead capture + test", offsetHours: 24 },
    { title: "Launch + send merchant confirmation", offsetHours: 36 },
  ],

  "ai-social-dm-autoresponder": [
    { title: "Verify intake + connect FB/IG permissions", offsetHours: 4 },
    { title: "Configure DM flows (FAQs/qualifiers/booking)", offsetHours: 12 },
    { title: "Test flows + edge cases", offsetHours: 20 },
    { title: "Launch + send merchant confirmation", offsetHours: 30 },
  ],

  "ai-speed-to-lead-dialer": [
    { title: "Verify intake + lead source triggers", offsetHours: 4 },
    { title: "Configure AI call script + qualifiers", offsetHours: 12 },
    { title: "Set routing/transfer rules", offsetHours: 20 },
    { title: "QA test with sample leads", offsetHours: 28 },
    { title: "Launch + send merchant confirmation", offsetHours: 36 },
  ],

  "ai-marketing-funnels": [
    { title: "Verify intake + gather assets (logo/photos/testimonials)", offsetHours: 6 },
    { title: "Build landing page + thank-you page", offsetHours: 24 },
    { title: "Configure lead form + tracking", offsetHours: 30 },
    { title: "Set AI SMS/email follow-up sequences", offsetHours: 40 },
    { title: "Connect booking + end-to-end QA", offsetHours: 52 },
    { title: "Launch + send merchant confirmation", offsetHours: 60 },
  ],

  "ai-quote-generator": [
    { title: "Verify intake + pricing rules", offsetHours: 6 },
    { title: "Build quote flow + estimate logic", offsetHours: 20 },
    { title: "Configure quote delivery + follow-up", offsetHours: 28 },
    { title: "Connect booking + QA test", offsetHours: 36 },
    { title: "Launch + send merchant confirmation", offsetHours: 48 },
  ],

  "ai-reactivation-engine": [
    { title: "Verify intake + list upload requirements", offsetHours: 6 },
    { title: "Import list + segment audience", offsetHours: 18 },
    { title: "Configure offer + messaging sequences", offsetHours: 28 },
    { title: "QA test + compliance checks", offsetHours: 36 },
    { title: "Launch + reporting setup", offsetHours: 44 },
  ],

  "ai-review-booster": [
    { title: "Verify intake + review link + triggers", offsetHours: 6 },
    { title: "Configure review request flow", offsetHours: 18 },
    { title: "Configure private feedback routing", offsetHours: 26 },
    { title: "Test + launch + confirmation", offsetHours: 36 },
  ],

  "ai-gbp-manager": [
    { title: "Verify intake + GBP access", offsetHours: 8 },
    { title: "Configure posting topics + cadence", offsetHours: 20 },
    { title: "Configure response rules", offsetHours: 28 },
    { title: "Launch + confirmation", offsetHours: 36 },
  ],

  "ai-local-seo-pages": [
    { title: "Verify intake + cities/services list", offsetHours: 8 },
    { title: "Generate first batch of pages", offsetHours: 28 },
    { title: "Publish + internal linking checks", offsetHours: 40 },
    { title: "QA + confirmation", offsetHours: 52 },
  ],

  "ai-social-content-repurposer": [
    { title: "Verify intake + content sources", offsetHours: 6 },
    { title: "Configure content themes + cadence", offsetHours: 18 },
    { title: "Set approval/auto-post mode", offsetHours: 26 },
    { title: "Launch + confirmation", offsetHours: 36 },
  ],

  "ai-ad-copy-generator": [
    { title: "Verify intake + offers/angles", offsetHours: 4 },
    { title: "Configure weekly copy pack templates", offsetHours: 16 },
    { title: "Deliver first pack + confirmation", offsetHours: 24 },
  ],

  "ai-upsell-engine": [
    { title: "Verify intake + upsell offers", offsetHours: 6 },
    { title: "Configure post-job triggers + messaging", offsetHours: 20 },
    { title: "Connect booking/checkout routing", offsetHours: 28 },
    { title: "QA + launch + confirmation", offsetHours: 36 },
  ],

  "ai-subscription-saver": [
    { title: "Verify intake + cancellation triggers", offsetHours: 6 },
    { title: "Configure save offers + rules", offsetHours: 20 },
    { title: "QA test + reporting", offsetHours: 28 },
    { title: "Launch + confirmation", offsetHours: 36 },
  ],

  "faceless-growth-engine": [
    { title: "Verify intake + gather brand assets (logo, colors, offers, service areas)", offsetHours: 6 },
    { title: "Build monthly content plan (themes + cadence + CTAs)", offsetHours: 18 },
    { title: "Create 30-post faceless pack (Canva-ready)", offsetHours: 48 },
    { title: "Write captions + hooks library + CTA set", offsetHours: 60 },
    { title: "Build bio link / mini-funnel page + tracking", offsetHours: 78 },
    { title: "Set approval workflow + deliver first pack", offsetHours: 96 },
    { title: "Launch + send merchant confirmation + next refresh date", offsetHours: 108 },
  ],
};

function addHours(date: Date, hours: number): string {
  const d = new Date(date.getTime());
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

// Commission helpers
function computeCommissionableCents(invoice: Stripe.Invoice): number {
  const anyInv: any = invoice as any;
  const excl = anyInv.total_excluding_tax;
  const paid = invoice.amount_paid ?? 0;
  const base = (typeof excl === "number" ? excl : paid);
  return base > 0 ? base : 0;
}

async function resolvePartnerFromRefSlug(supabase: any, refSlug: string | null) {
  if (!refSlug) return null;
  const { data } = await supabase
    .from("partner_tracking_links")
    .select("partner_id")
    .eq("slug", refSlug)
    .maybeSingle();
  return data?.partner_id ?? null;
}

async function getPartnerTierRateBps(supabase: any, partnerId: string): Promise<number> {
  const { data: partner } = await supabase
    .from("partners")
    .select("tier_key,is_active_subscriber")
    .eq("id", partnerId)
    .maybeSingle();

  if (!partner || !partner.is_active_subscriber) return 0;

  const { data: tier } = await supabase
    .from("partner_tiers")
    .select("commission_rate_bps")
    .eq("key", partner.tier_key)
    .maybeSingle();

  return tier?.commission_rate_bps ?? 0;
}

async function getUpline(supabase: any, partnerId: string) {
  const { data } = await supabase
    .from("partner_uplines")
    .select("upline_partner_id,upline_rate_bps")
    .eq("partner_id", partnerId)
    .maybeSingle();

  if (!data) return null;

  const { data: up } = await supabase
    .from("partners")
    .select("id,is_active_subscriber")
    .eq("id", data.upline_partner_id)
    .maybeSingle();

  if (!up?.is_active_subscriber) return null;

  return { upline_partner_id: data.upline_partner_id as string, upline_rate_bps: data.upline_rate_bps as number };
}

async function createFulfillmentTasksOnce(supabase: any, orderId: string) {
  const { data: order } = await supabase
    .from("dfy_orders")
    .select("id, product_slug, fulfillment_tasks_created")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return;
  if (order.fulfillment_tasks_created) return;

  const templates = DFY_TASK_TEMPLATES[order.product_slug] || [
    { title: "Verify intake + required access", offsetHours: 6 },
    { title: "Configure system", offsetHours: 24 },
    { title: "QA test", offsetHours: 48 },
    { title: "Launch + confirmation", offsetHours: 60 },
  ];

  const now = new Date();
  const tasks = templates.map((t: any) => ({
    order_id: orderId,
    title: t.title,
    status: "todo",
    due_at: t.offsetHours != null ? addHours(now, t.offsetHours) : null,
  }));

  const { error: insertErr } = await supabase.from("dfy_fulfillment_tasks").insert(tasks);
  if (insertErr) {
    console.error("Failed to insert tasks:", insertErr);
    throw new Error(insertErr.message);
  }

  const { error: flagErr } = await supabase
    .from("dfy_orders")
    .update({ fulfillment_tasks_created: true })
    .eq("id", orderId);

  if (flagErr) {
    console.error("Failed to update fulfillment_tasks_created flag:", flagErr);
    throw new Error(flagErr.message);
  }

  console.log(`✅ Created ${tasks.length} fulfillment tasks for order ${orderId}`);
}

function mapSubscriptionStatusToOrderStatus(subStatus: string): string {
  if (subStatus === "active" || subStatus === "trialing") return "in_progress";
  if (subStatus === "past_due" || subStatus === "unpaid") return "paused";
  if (subStatus === "canceled") return "canceled";
  if (subStatus === "paused") return "paused";
  return "in_progress";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_DFY_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId =
          (session.client_reference_id as string) ||
          (session.metadata?.order_id as string) ||
          "";

        if (!orderId) {
          console.warn("No order_id found in checkout session");
          break;
        }

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id || null;

        const stripeSubscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id || null;

        await supabase
          .from("dfy_orders")
          .update({
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            stripe_checkout_session_id: session.id,
            status: "onboarding",
          })
          .eq("id", orderId);

        console.log(`✅ Updated order ${orderId} with Stripe IDs, status: onboarding`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        const invoiceId = invoice.id;

        let orderId = (invoice.subscription_details?.metadata?.order_id ||
          (invoice.metadata?.order_id as string) ||
          "") as string;

        if (!orderId && subId) {
          const { data: found } = await supabase
            .from("dfy_orders")
            .select("id,status")
            .eq("stripe_subscription_id", subId)
            .maybeSingle();
          orderId = found?.id || "";
        }

        if (!orderId) {
          console.warn("No order_id found for invoice.paid event");
          break;
        }

        const { data: onboard } = await supabase
          .from("dfy_onboarding")
          .select("submitted_at")
          .eq("order_id", orderId)
          .maybeSingle();

        const nextStatus = onboard?.submitted_at ? "queued" : "onboarding";

        await supabase
          .from("dfy_orders")
          .update({
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subId || null,
            stripe_payment_intent_id:
              typeof invoice.payment_intent === "string"
                ? invoice.payment_intent
                : invoice.payment_intent?.id || null,
            status: nextStatus,
          })
          .eq("id", orderId);

        console.log(`✅ Invoice paid for order ${orderId}, status: ${nextStatus}`);

        await createFulfillmentTasksOnce(supabase, orderId);

        // Create commission entries
        const { data: orderRow } = await supabase
          .from("dfy_orders")
          .select("id, referral_partner_link_slug, stripe_subscription_id")
          .eq("id", orderId)
          .maybeSingle();

        if (orderRow?.referral_partner_link_slug) {
          const directPartnerId = await resolvePartnerFromRefSlug(supabase, orderRow.referral_partner_link_slug);
          const commissionableCents = computeCommissionableCents(invoice);

          if (directPartnerId && commissionableCents > 0) {
            // Direct partner commission
            const directRateBps = await getPartnerTierRateBps(supabase, directPartnerId);
            if (directRateBps > 0) {
              const owed = Math.floor((commissionableCents * directRateBps) / 10000);

              await supabase.from("commission_ledger").upsert({
                recipient_partner_id: directPartnerId,
                order_id: orderId,
                stripe_invoice_id: invoice.id,
                stripe_subscription_id: subId || null,
                event_type: "invoice_paid",
                amount_gross_cents: commissionableCents,
                commission_rate_bps: directRateBps,
                commission_owed_cents: owed,
                status: "owed",
              }, { onConflict: "recipient_partner_id,stripe_invoice_id,event_type" });

              console.log(`✅ Created commission for partner ${directPartnerId}: $${(owed / 100).toFixed(2)}`);
            }

            // Upline commission (7%)
            const upline = await getUpline(supabase, directPartnerId);
            if (upline?.upline_partner_id && upline.upline_rate_bps > 0) {
              const owedUp = Math.floor((commissionableCents * upline.upline_rate_bps) / 10000);

              await supabase.from("commission_ledger").upsert({
                recipient_partner_id: upline.upline_partner_id,
                order_id: orderId,
                stripe_invoice_id: invoice.id,
                stripe_subscription_id: subId || null,
                event_type: "invoice_paid",
                amount_gross_cents: commissionableCents,
                commission_rate_bps: upline.upline_rate_bps,
                commission_owed_cents: owedUp,
                status: "owed",
              }, { onConflict: "recipient_partner_id,stripe_invoice_id,event_type" });

              console.log(`✅ Created upline commission for partner ${upline.upline_partner_id}: $${(owedUp / 100).toFixed(2)}`);
            }
          }
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;

        if (!subId) break;

        await supabase
          .from("dfy_orders")
          .update({ status: "paused" })
          .eq("stripe_subscription_id", subId);

        console.log(`⚠️ Payment failed, order paused for subscription ${subId}`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const subId = sub.id;

        const next = mapSubscriptionStatusToOrderStatus(sub.status);

        await supabase
          .from("dfy_orders")
          .update({ status: next })
          .eq("stripe_subscription_id", subId);

        console.log(`✅ Subscription ${subId} updated, status: ${next}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("dfy_orders")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", sub.id);

        console.log(`✅ Subscription ${sub.id} deleted, order canceled`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`ℹ️ Charge refunded: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: err.message || "Webhook handler error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
