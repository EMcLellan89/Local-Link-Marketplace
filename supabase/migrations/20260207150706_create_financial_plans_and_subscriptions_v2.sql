/*
  # Financial Engine - Plans & Subscriptions

  1. Products/Plans
    - `financial_plans` - Service tiers (SmartBooks, ProBooks, DFY, CFO)
    - `plan_pricing` - Pricing reference for simulator
    
  2. Subscriptions
    - `financial_subscriptions` - Active subscriptions with referral tracking
    
  3. Security
    - RLS policies for merchant access
*/

-- Financial plans/products
create table if not exists financial_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  billing_type text not null check (billing_type in ('subscription','one_time')),
  price_cents int not null,
  interval text check (interval in ('month','year')),
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Plan pricing reference (for simulator)
create table if not exists plan_pricing (
  code text primary key,
  name text not null,
  monthly_price numeric not null,
  commission_rate numeric not null default 0.25,
  is_active boolean not null default true
);

-- Seed plan pricing
insert into plan_pricing (code, name, monthly_price, commission_rate) values
('SMARTBOOKS_STARTER','SmartBooks Starter',79,0.25),
('SMARTBOOKS_GROWTH','SmartBooks Growth',149,0.25),
('PROBOOKS_STANDARD','ProBooks Standard',249,0.25),
('PROBOOKS_PLUS','ProBooks Plus',399,0.25),
('CFO_LITE','CFO Lite',299,0.25),
('CFO_GROWTH','CFO Growth',799,0.25)
on conflict (code) do update
set name=excluded.name, monthly_price=excluded.monthly_price, commission_rate=excluded.commission_rate;

-- Financial subscriptions (tracks active plans + referrals)
create table if not exists financial_subscriptions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  plan_id uuid not null references financial_plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'pending' check (status in ('pending','active','past_due','canceled','paused')),
  referral_id text,
  referral_name text,
  partner_id uuid references partners(id),
  created_at timestamptz default now()
);

alter table financial_subscriptions enable row level security;

-- RLS policies
create policy "members can select subscriptions"
on financial_subscriptions for select
using (is_merchant_member(merchant_id));

-- Indexes
create index if not exists financial_subscriptions_merchant_idx on financial_subscriptions(merchant_id);
create index if not exists financial_subscriptions_partner_idx on financial_subscriptions(partner_id);
create index if not exists financial_subscriptions_stripe_idx on financial_subscriptions(stripe_subscription_id);
