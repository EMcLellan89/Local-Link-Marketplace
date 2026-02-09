# Complete API Implementation Guide
## Local-Link Content & Automation Platform

This document contains ALL API handlers needed for the platform.

## Setup Required

### 1. Install Dependencies
```bash
npm install stripe @supabase/supabase-js
```

### 2. Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Shared Library (`src/lib/api-helpers.ts`)
```typescript
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const supabaseAdmin = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function requireUser(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw new Response("Unauthorized", { status: 401 });

  const sb = supabaseAdmin();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) throw new Response("Unauthorized", { status: 401 });

  return { user: data.user, token };
}

export async function getOrgIdForUser(
  sb: ReturnType<typeof supabaseAdmin>,
  userId: string
) {
  const { data, error } = await sb
    .from("org_members")
    .select("org_id, role")
    .eq("profile_id", userId)
    .single();

  if (error || !data?.org_id) throw new Response("Forbidden", { status: 403 });
  return { orgId: data.org_id as string, role: data.role as string };
}

export async function requireAdmin(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();

  const { data: mem } = await sb
    .from("org_members")
    .select("role")
    .eq("profile_id", user.id);
  const isAdmin = (mem || []).some((m) => m.role === "admin");

  if (!isAdmin) throw new Response("Forbidden", { status: 403 });
  return { sb, user };
}
```

---

## API Endpoints

### 1. AUTH & ONBOARDING

#### POST /api/auth/merchant-signup
```typescript
import { supabaseAdmin } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const sb = supabaseAdmin();
  const body = await req.json();
  const {
    business_name,
    owner_name,
    email,
    phone,
    industry,
    service_area,
    referral_name,
    referral_id,
  } = body;

  // Create auth user
  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    phone,
    email_confirm: true,
    user_metadata: { name: owner_name },
  });
  if (createErr) return new Response(createErr.message, { status: 400 });
  const userId = created.user.id;

  // Create org
  const { data: org, error: orgErr } = await sb
    .from("organizations")
    .insert({ type: "merchant", name: business_name, timezone: "America/New_York" })
    .select("*")
    .single();
  if (orgErr) return new Response(orgErr.message, { status: 400 });

  // Create membership
  await sb.from("org_members").insert({
    org_id: org.id,
    profile_id: userId,
    role: "merchant",
  });

  // Create merchant settings
  await sb.from("merchant_settings").insert({
    org_id: org.id,
    industry,
    service_area,
    phone,
    onboarding_complete: false,
  });

  // Attach referral if provided
  if (referral_id) {
    await sb.rpc("rpc_attach_partner_referral_v2", {
      p_merchant_org_id: org.id,
      p_referral_id: referral_id,
      p_referral_name: referral_name || null,
    });
  }

  // Seed default CRM
  await sb.rpc("rpc_seed_default_crm", { p_org_id: org.id });

  return Response.json({ ok: true, org_id: org.id, user_id: userId });
}
```

#### GET /api/org/me
```typescript
import { supabaseAdmin, requireUser } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();

  const { data: membership, error } = await sb
    .from("org_members")
    .select("org_id, role, organizations(*)")
    .eq("profile_id", user.id)
    .single();

  if (error) return new Response(error.message, { status: 400 });

  const { data: settings } = await sb
    .from("merchant_settings")
    .select("*")
    .eq("org_id", membership.org_id)
    .maybeSingle();

  return Response.json({
    org: membership.organizations,
    role: membership.role,
    merchant_settings: settings,
  });
}
```

---

### 2. BILLING & SUBSCRIPTIONS

#### GET /api/billing/status
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);

  // Recompute features
  await sb.rpc("rpc_recompute_org_features", { p_org_id: orgId });

  const { data: access, error } = await sb
    .from("v_org_access")
    .select("*")
    .eq("org_id", orgId)
    .single();

  if (error) return new Response(error.message, { status: 400 });

  const { data: items } = await sb
    .from("subscription_items")
    .select("stripe_price_id,item_type,quantity,status,plans(name,price_monthly,features)")
    .eq("org_id", orgId)
    .order("item_type", { ascending: true });

  return Response.json({
    ok: true,
    subscription_status: access?.subscription_status ?? "none",
    base_plan: {
      name: access?.base_plan_name ?? null,
      price_monthly: access?.base_price_monthly ?? null,
    },
    items: items ?? [],
    effective_features: access?.effective_features ?? {},
    features_updated_at: access?.features_updated_at ?? null,
  });
}
```

#### POST /api/billing/create-checkout-session
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser, stripe } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);

  const body = await req.json();
  const { stripe_price_id } = body;
  if (!stripe_price_id) return new Response("Missing stripe_price_id", { status: 400 });

  const { data: sub } = await sb
    .from("subscriptions")
    .select("*")
    .eq("org_id", orgId)
    .maybeSingle();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: sub?.stripe_customer_id || undefined,
    line_items: [{ price: stripe_price_id, quantity: 1 }],
    success_url: `${process.env.PUBLIC_BASE_URL}/app/billing?success=1`,
    cancel_url: `${process.env.PUBLIC_BASE_URL}/app/billing?canceled=1`,
    metadata: { org_id: orgId, kind: "base" },
  });

  return Response.json({ ok: true, url: session.url });
}
```

#### POST /api/billing/add-addon
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser, stripe } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);

  const body = await req.json();
  const stripePriceId = body.stripe_price_id;
  const quantity = Number(body.quantity ?? 1);

  if (!stripePriceId) return new Response("Missing stripe_price_id", { status: 400 });

  const { data: sub, error: subErr } = await sb
    .from("subscriptions")
    .select("*")
    .eq("org_id", orgId)
    .single();

  if (subErr || !sub?.stripe_subscription_id) {
    return new Response("No active subscription. Purchase a base plan first.", {
      status: 400,
    });
  }

  // Add item to subscription
  const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [{ price: stripePriceId, quantity }],
    proration_behavior: "create_prorations",
  });

  // Sync to DB
  const items = updated.items.data.map((it) => ({
    id: it.id,
    quantity: it.quantity ?? 1,
    price: { id: it.price.id },
  }));

  await sb.rpc("rpc_sync_subscription_items", {
    p_org_id: orgId,
    p_stripe_subscription_id: updated.id,
    p_items: items,
    p_status: updated.status,
  });

  return Response.json({ ok: true });
}
```

#### POST /api/webhooks/stripe
```typescript
import Stripe from "stripe";
import { supabaseAdmin, stripe } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const sb = supabaseAdmin();
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.org_id as string | undefined;
    if (!orgId) return Response.json({ received: true });

    const customerId = session.customer as string;
    const stripeSubId = session.subscription as string;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 10,
    });
    const basePriceId = lineItems.data?.[0]?.price?.id;

    if (basePriceId) {
      await sb.rpc("rpc_upsert_subscription_from_checkout", {
        p_org_id: orgId,
        p_stripe_customer_id: customerId,
        p_stripe_subscription_id: stripeSubId,
        p_base_price_id: basePriceId,
        p_status: "active",
      });
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;

    const { data: srow } = await sb
      .from("subscriptions")
      .select("org_id")
      .eq("stripe_subscription_id", sub.id)
      .single();

    if (srow?.org_id) {
      const items = sub.items.data.map((it) => ({
        id: it.id,
        quantity: it.quantity ?? 1,
        price: { id: it.price.id },
      }));

      await sb.rpc("rpc_sync_subscription_items", {
        p_org_id: srow.org_id,
        p_stripe_subscription_id: sub.id,
        p_items: items,
        p_status: sub.status,
      });
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const stripeSubId = invoice.subscription as string;

    await sb.rpc("rpc_create_commission_splits_from_invoice", {
      p_stripe_subscription_id: stripeSubId,
      p_invoice_id: invoice.id,
      p_amount_paid: invoice.amount_paid,
    });
  }

  return Response.json({ received: true });
}
```

---

### 3. CONTENT & CAMPAIGNS

#### POST /api/dfy/install-30-days
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);
  const body = await req.json();

  const { data, error } = await sb.rpc("rpc_install_dfy_30_days", {
    p_org_id: orgId,
    p_goal: body.goal, // calls|bookings|reviews|sales
    p_frequency: body.frequency, // e.g., 3, 5, 7 posts/week
    p_channels: body.channels, // text[] of channels
  });

  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true, result: data });
}
```

#### GET /api/merchant/dashboard
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);

  const { data: leads7d } = await sb
    .from("leads")
    .select("id", { count: "exact" })
    .eq("org_id", orgId)
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const { data: scheduled7d } = await sb
    .from("content_calendar")
    .select("id", { count: "exact" })
    .eq("org_id", orgId)
    .gte("scheduled_for", new Date().toISOString())
    .lt("scheduled_for", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  const { data: activeCampaigns } = await sb
    .from("campaigns")
    .select("id", { count: "exact" })
    .eq("org_id", orgId)
    .eq("status", "active");

  return Response.json({
    ok: true,
    kpis: {
      leads_7d: leads7d?.length ?? 0,
      scheduled_next_7d: scheduled7d?.length ?? 0,
      active_campaigns: activeCampaigns?.length ?? 0,
    },
  });
}
```

---

### 4. PARTNER PORTAL

#### GET /api/partner/dashboard
```typescript
import { supabaseAdmin, requireUser, getOrgIdForUser } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const { user } = await requireUser(req);
  const sb = supabaseAdmin();
  const { orgId } = await getOrgIdForUser(sb, user.id);

  const { data: rels } = await sb
    .from("partner_relationships")
    .select("merchant_org_id, commission_rate, created_at")
    .eq("partner_org_id", orgId);

  const merchantIds = (rels || []).map((r) => r.merchant_org_id);

  let influencedMRR = 0;
  if (merchantIds.length) {
    const { data: merchSubs } = await sb
      .from("subscriptions")
      .select("org_id, plan_id, plans(price_monthly,name)")
      .in("org_id", merchantIds)
      .eq("status", "active");

    influencedMRR = (merchSubs || []).reduce(
      (sum, s: any) => sum + (s.plans?.price_monthly ?? 0),
      0
    );
  }

  const { data: comms } = await sb
    .from("commission_splits")
    .select("amount,status")
    .eq("recipient_partner_org_id", orgId);

  const totals = (comms || []).reduce(
    (acc: any, c: any) => {
      const amt = Number(c.amount ?? 0);
      if (c.status === "earned") acc.earned += amt;
      if (c.status === "paid") acc.paid += amt;
      return acc;
    },
    { earned: 0, paid: 0 }
  );

  const { data: existing } = await sb
    .from("referrals")
    .select("*")
    .eq("referrer_partner_org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const referralUrl = existing
    ? `${process.env.PUBLIC_BASE_URL}/signup/merchant?ref=${encodeURIComponent(
        existing.referral_code
      )}`
    : null;

  return Response.json({
    ok: true,
    merchants_count: merchantIds.length,
    influenced_mrr: influencedMRR,
    commission_totals: totals,
    referral: existing
      ? {
          referral_code: existing.referral_code,
          referral_name: existing.referral_name,
          url: referralUrl,
        }
      : null,
  });
}
```

---

## Next Steps

1. **Create Supabase Edge Functions** for webhooks (optional - can use API routes)
2. **Seed Plans & Features** using the SQL in the next file
3. **Build UI Components** using the API endpoints above
4. **Test Stripe Integration** in test mode first

---

## Feature Gating Example

```typescript
// In your UI components
const { effective_features } = await fetch("/api/billing/status").then((r) =>
  r.json()
);

// Check features
if (effective_features.content_ai) {
  // Show AI content generator
}

if (effective_features.scheduler) {
  // Show multi-platform scheduler
}

if (effective_features.crm) {
  // Show CRM dashboard
}
```
