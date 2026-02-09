/*
  # Subscription + Plans + Feature Flags System
  
  ## Overview
  This creates the billing foundation for Local-Link Content Platform.
  
  ## Key Features
  - Flexible plan system (base plans + add-ons)
  - Feature flag gating
  - Stripe integration ready
  - Multi-plan support per org (base + addons as separate subscription items)
  
  ## Tables
  
  ### plans
  - Base plans (CORE/GROW/REVENUE for merchants, tiers for partners)
  - Add-on plans (Scheduler, Email, SMS, etc.)
  - JSON features object for gating
  - Stripe price ID mapping
  
  ### feature_flags
  - Granular feature toggles per plan
  - Easy admin override capability
  
  ### subscriptions
  - One subscription per org
  - Links to Stripe subscription
  - Tracks status and billing info
  
  ### subscription_items
  - Tracks individual Stripe subscription items
  - Separates base plan from add-ons
  - Enables flexible add-on management
  
  ### org_features
  - Materialized view of effective features per org
  - Computed from base plan + all active add-ons
  - Used for fast feature gating
*/

-- Plans table (base plans + add-ons)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  audience text not null check (audience in ('merchant', 'partner', 'internal')),
  price_monthly numeric not null default 0,
  stripe_price_id text,
  features jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_plans_audience on public.plans(audience);
create index if not exists idx_plans_stripe_price on public.plans(stripe_price_id);

-- Feature flags (granular control)
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  key text not null,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  unique(plan_id, key)
);

create index if not exists idx_feature_flags_plan on public.feature_flags(plan_id);

-- Subscriptions (one per org)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references public.organizations(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_org on public.subscriptions(org_id);
create index if not exists idx_subscriptions_stripe_sub on public.subscriptions(stripe_subscription_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- Subscription items (base + add-ons)
create table if not exists public.subscription_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  stripe_subscription_id text not null,
  stripe_subscription_item_id text not null unique,
  stripe_price_id text not null,
  plan_id uuid references public.plans(id) on delete set null,
  item_type text not null check (item_type in ('base', 'addon')),
  quantity int not null default 1,
  status text not null default 'active' check (status in ('active', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscription_items_org on public.subscription_items(org_id);
create index if not exists idx_subscription_items_sub on public.subscription_items(stripe_subscription_id);
create index if not exists idx_subscription_items_price on public.subscription_items(stripe_price_id);

-- Prevent duplicate active add-ons per org+price
create unique index if not exists uniq_active_item_per_price
  on public.subscription_items (org_id, stripe_price_id)
  where status = 'active';

-- Org features (materialized effective features)
create table if not exists public.org_features (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  effective_features jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_plans_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create trigger trg_subscription_items_updated_at
  before update on public.subscription_items
  for each row execute function public.set_updated_at();
