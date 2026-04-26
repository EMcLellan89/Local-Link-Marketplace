import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.21.0";
import { sendSaleToLocalLink, sendSubscriptionRenewalToLocalLink } from "../_shared/localLinkIntegration.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const org_id = session.metadata?.org_id;
  const checkout_session_id = session.metadata?.checkout_session_id;

  if (!org_id || !checkout_session_id) {
    console.log("Missing org_id or checkout_session_id in metadata");
    return;
  }

  // Pull stored checkout session
  const { data: cs } = await supabaseAdmin
    .from("checkout_sessions")
    .select("id, org_id, plan_name, addon_names, referral_name, referral_id")
    .eq("id", checkout_session_id)
    .single();

  if (!cs) {
    console.log("Checkout session not found:", checkout_session_id);
    return;
  }

  const stripe_subscription_id =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  // Mark checkout complete
  await supabaseAdmin
    .from("checkout_sessions")
    .update({ status: "completed", stripe_subscription_id })
    .eq("id", cs.id);

  // Get subscription details
  const sub = stripe_subscription_id
    ? await stripe.subscriptions.retrieve(stripe_subscription_id)
    : null;

  const current_period_end = sub?.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  // Create/update subscription record
  await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        org_id: cs.org_id,
        stripe_subscription_id,
        status: sub?.status || "active",
        base_plan_name: cs.plan_name,
        addon_names: cs.addon_names || [],
        current_period_end,
        metadata: {
          referral_name: cs.referral_name,
          referral_id: cs.referral_id,
        },
      },
      { onConflict: "org_id" }
    );

  // Apply feature flags to org based on plan + addons
  await applyOrgEntitlements(cs.org_id, cs.plan_name, cs.addon_names || []);
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const org_id = sub.metadata?.org_id;
  if (!org_id) {
    console.log("Missing org_id in subscription metadata");
    return;
  }

  const status = sub.status;
  const current_period_end = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status,
      current_period_end,
      stripe_subscription_id: sub.id,
    })
    .eq("org_id", org_id);

  // If canceled/unpaid, optionally downgrade flags
  if (status === "canceled" || status === "unpaid") {
    // Optional: disable features
    await supabaseAdmin
      .from("organizations")
      .update({ features: {} })
      .eq("id", org_id);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const org_id = invoice.subscription_details?.metadata?.org_id || invoice.metadata?.org_id;
  if (!org_id) {
    console.log("Missing org_id in invoice metadata");
    return;
  }

  const stripeCustomerId = invoice.customer as string;

  // Look up local customer by stripe_customer_id
  const { data: cust } = await supabaseAdmin
    .from("customers")
    .select("id, merchant_org_id, referred_by_customer_id")
    .eq("merchant_org_id", org_id)
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (!cust?.referred_by_customer_id) {
    console.log("No referrer found for customer");
    return;
  }

  // Check if already rewarded
  const { data: prior } = await supabaseAdmin
    .from("customer_rewards_ledger")
    .select("id")
    .eq("merchant_org_id", org_id)
    .eq("source->>stripe_customer_id", stripeCustomerId)
    .limit(1);

  if ((prior || []).length > 0) {
    console.log("Reward already issued for this customer");
    return;
  }

  // Load reward rule
  const { data: rule } = await supabaseAdmin
    .from("customer_reward_rules")
    .select("*")
    .eq("merchant_org_id", org_id)
    .maybeSingle();

  const amount_cents = rule?.reward_amount_cents ?? 2500;

  // Award reward
  await supabaseAdmin.from("customer_rewards_ledger").insert({
    merchant_org_id: org_id,
    customer_id: cust.referred_by_customer_id,
    amount_cents,
    reason: "Referral reward (invoice paid)",
    source: {
      stripe_invoice_id: invoice.id,
      stripe_customer_id: stripeCustomerId,
      amount_paid: invoice.amount_paid,
    },
    status: "earned",
  });

  console.log("Referral reward issued:", amount_cents, "cents");

  // Send subscription payment to LocalLink
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("base_plan_name, metadata")
    .eq("org_id", org_id)
    .maybeSingle();

  await sendSubscriptionRenewalToLocalLink({
    subscription_id: invoice.subscription as string,
    partner_id: sub?.metadata?.referral_id,
    amount_cents: invoice.amount_paid || 0,
    product_key: sub?.base_plan_name || "subscription",
    customer_email: invoice.customer_email || undefined,
  });
}

async function applyOrgEntitlements(org_id: string, base_plan_name: string, addon_names: string[]) {
  const allNames = [base_plan_name, ...addon_names];

  const { data: plans } = await supabaseAdmin
    .from("plans")
    .select("name, features")
    .in("name", allNames)
    .eq("is_active", true);

  const merged: Record<string, boolean> = {};
  for (const p of plans || []) {
    const f = p.features || {};
    for (const k of Object.keys(f)) {
      if (f[k] === true) merged[k] = true;
    }
  }

  // Write to organizations.features
  await supabaseAdmin
    .from("organizations")
    .update({ features: merged })
    .eq("id", org_id);

  console.log("Applied entitlements for org:", org_id, merged);
}
