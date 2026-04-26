import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";
import { sendSaleToLocalLink, sendRefundToLocalLink } from "../_shared/localLinkIntegration.ts";

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
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

function getTierRate(tier: string): number {
  if (tier === "enterprise") return 0.20;
  if (tier === "pro") return 0.15;
  return 0.10;
}

function computeCommissionRate(partner: any): number {
  if (!partner) return 0;

  const tierRate = getTierRate(partner.tier);

  if (partner.membership_active === true) return tierRate;

  if (partner.membership_ends_at) {
    const endsAt = new Date(partner.membership_ends_at).getTime();
    const now = Date.now();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
    if (now <= endsAt + tenDaysMs) return tierRate;
  }

  return 0;
}

async function upsertSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  await supabaseAdmin.from("marketplace_subscriptions").upsert({
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
    status: sub.status,
    current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
    canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
  }, { onConflict: "stripe_subscription_id" });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentIntentId = typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

        const { data: cs, error: csErr } = await supabaseAdmin
          .from("marketplace_checkout_sessions")
          .select("*")
          .eq("stripe_checkout_session_id", session.id)
          .maybeSingle();

        if (csErr) throw csErr;
        if (!cs) {
          console.log("No local checkout session found");
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (cs.status === "paid") {
          return new Response(JSON.stringify({ received: true, note: "Already paid" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        let partner: any = null;
        if (cs.partner_id) {
          const { data: p } = await supabaseAdmin
            .from("marketplace_partners")
            .select("*")
            .eq("id", cs.partner_id)
            .maybeSingle();
          partner = p;
        }

        const commissionRate = computeCommissionRate(partner);

        const subtotal = cs.subtotal_cents ?? 0;
        const bumpCents = cs.bump_selected ? (cs.bump_amount_cents ?? 0) : 0;
        const total = cs.total_cents ?? (subtotal + bumpCents);

        const { data: order, error: orderErr } = await supabaseAdmin
          .from("marketplace_orders")
          .insert({
            checkout_session_id: cs.id,
            product_id: cs.product_id,
            price_id: cs.price_id,
            user_id: cs.user_id,
            customer_email: cs.customer_email ?? session.customer_details?.email ?? session.customer_email ?? null,
            partner_id: cs.partner_id,
            commission_rate: commissionRate,
            subtotal_cents: subtotal,
            bump_cents: bumpCents,
            total_cents: total,
            currency: cs.currency ?? "usd",
            stripe_payment_intent_id: paymentIntentId ?? null,
            stripe_customer_id: (typeof session.customer === "string" ? session.customer : session.customer?.id) ?? null,
            paid_at: new Date().toISOString(),
            status: "paid",
          })
          .select("*")
          .single();

        if (orderErr) throw orderErr;

        const items: any[] = [
          { order_id: order.id, product_id: cs.product_id, item_type: "primary", amount_cents: subtotal },
        ];

        if (cs.bump_selected && cs.bump_product_id && bumpCents > 0) {
          items.push({ order_id: order.id, product_id: cs.bump_product_id, item_type: "bump", amount_cents: bumpCents });
        }

        const { error: itemsErr } = await supabaseAdmin.from("marketplace_order_items").insert(items);
        if (itemsErr) throw itemsErr;

        if (cs.partner_id && commissionRate > 0) {
          const commissionAmount = Math.round(total * commissionRate);

          const { error: commErr } = await supabaseAdmin.from("marketplace_commissions").insert({
            order_id: order.id,
            partner_id: cs.partner_id,
            commission_rate: commissionRate,
            commission_amount_cents: commissionAmount,
            status: "earned",
            earned_at: new Date().toISOString(),
          });
          if (commErr) throw commErr;

          await supabaseAdmin.from("marketplace_orders").update({
            commission_status: "earned",
          }).eq("id", order.id);
        } else {
          await supabaseAdmin.from("marketplace_orders").update({
            commission_status: "void",
          }).eq("id", order.id);
        }

        await supabaseAdmin.from("marketplace_checkout_sessions").update({
          status: "paid",
          stripe_payment_intent_id: paymentIntentId ?? null,
          stripe_customer_id: (typeof session.customer === "string" ? session.customer : session.customer?.id) ?? null,
        }).eq("id", cs.id);

        await supabaseAdmin.from("marketplace_abandoned_carts").update({
          status: "recovered",
          recovered_at: new Date().toISOString()
        }).eq("checkout_session_id", cs.id);

        const { data: product } = await supabaseAdmin
          .from("marketplace_products")
          .select("*")
          .eq("id", cs.product_id)
          .maybeSingle();

        const kind = product?.metadata?.kind;
        const courseSlug = product?.metadata?.course_slug;

        if (kind === "academy_core" && courseSlug) {
          const { data: course } = await supabaseAdmin
            .from("course_products")
            .select("id")
            .eq("slug", courseSlug)
            .maybeSingle();

          if (course && cs.user_id) {
            await supabaseAdmin.from("course_enrollments").upsert({
              user_id: cs.user_id,
              course_id: course.id,
              enrolled_at: new Date().toISOString(),
              progress_percent: 0,
              status: "active",
            }, { onConflict: "user_id,course_id", ignoreDuplicates: true });
          }
        }

        if (kind === "academy_track" && courseSlug) {
          const { data: course } = await supabaseAdmin
            .from("course_products")
            .select("id")
            .eq("slug", courseSlug)
            .maybeSingle();

          if (course && cs.user_id) {
            await supabaseAdmin.from("course_enrollments").upsert({
              user_id: cs.user_id,
              course_id: course.id,
              enrolled_at: new Date().toISOString(),
              progress_percent: 0,
              status: "active",
            }, { onConflict: "user_id,course_id", ignoreDuplicates: true });
          }
        }

        // Send sale to LocalLink for accounting/attribution
        await sendSaleToLocalLink({
          order_id: order.id,
          ref_code: partner?.referral_code || partner?.slug,
          amount_cents: total,
          product_key: product?.slug || `product_${cs.product_id}`,
          product_name: product?.name,
          customer_email: order.customer_email || undefined,
          customer_id: cs.user_id || undefined,
          partner_id: cs.partner_id || undefined,
          commission_amount_cents: commissionRate > 0 ? Math.round(total * commissionRate) : 0,
          metadata: {
            stripe_payment_intent_id: paymentIntentId,
            stripe_customer_id: order.stripe_customer_id,
            product_type: kind,
            bump_included: cs.bump_selected,
          },
        });

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "charge.refunded":
      case "refund.created": {
        const obj: any = event.data.object as any;
        const paymentIntentId = obj.payment_intent ?? obj.payment_intent?.id;

        if (!paymentIntentId) {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: order } = await supabaseAdmin
          .from("marketplace_orders")
          .select("*")
          .eq("stripe_payment_intent_id", paymentIntentId)
          .maybeSingle();

        if (!order) {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabaseAdmin.from("marketplace_orders").update({ status: "refunded" }).eq("id", order.id);
        await supabaseAdmin.from("marketplace_commissions").update({ status: "void" }).eq("order_id", order.id);

        // Notify LocalLink of refund
        await sendRefundToLocalLink({
          order_id: order.id,
          amount_cents: order.total_cents || 0,
          reason: "stripe_refund",
        });

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: err.message || "Webhook handler failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
