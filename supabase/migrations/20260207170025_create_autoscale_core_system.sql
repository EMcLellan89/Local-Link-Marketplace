/*
  # Local-Link AutoScale™ - Core System

  1. New Tables
    - `ll_partners` - Partner organizations
    - `ll_brand_profiles` - Branding configurations (white-label/co-brand)
    - `ll_autoscale_clients` - Merchant AutoScale subscriptions
    - `ll_autoscale_subscriptions` - Stripe subscription mapping
    - `ll_autoscale_industry_packs` - Industry-specific templates
    - `ll_autoscale_workflow_templates` - Funnel templates
    - `ll_autoscale_workflows` - Client workflow instances
    - `ll_autoscale_bots` - Bot catalog
    - `ll_autoscale_bot_runs` - Bot execution logs
    - `ll_comm_outbox` - Reliable message queue
    - `ll_circuit_breakers` - Auto-disable on failures
    - `ll_stripe_price_map` - Stripe price to tier mapping
    - `ll_partner_commission_rules` - Partner-specific rates
    - `ll_global_commission_rules` - Default commission rates

  2. Security
    - Enable RLS on all tables
    - Service role bypass for automation
    - Authenticated read for catalogs
*/

-- Partners (Local-Link partner orgs)
create table if not exists ll_partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique,
  referral_id text unique,
  contact_email text,
  is_active boolean not null default true
);

alter table ll_partners enable row level security;

-- Branding Profiles (Local-Link / White-label / Co-brand)
create table if not exists ll_brand_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  partner_id uuid references ll_partners(id) on delete cascade,
  brand_mode text not null check (brand_mode in ('local_link','white_label','co_brand')),
  brand_name text not null,
  logo_url text,
  primary_color text,
  secondary_color text,
  custom_domain text,
  support_email text,
  powered_by_local_link boolean not null default true
);

create index ll_brand_profiles_partner_id_idx on ll_brand_profiles(partner_id);
alter table ll_brand_profiles enable row level security;

-- AutoScale Clients (merchant accounts under a partner)
create table if not exists ll_autoscale_clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  partner_id uuid references ll_partners(id) on delete restrict,
  brand_profile_id uuid references ll_brand_profiles(id) on delete set null,

  business_name text not null,
  industry_pack text not null default 'general',
  tier text not null check (tier in ('starter','growth','elite')),

  status text not null default 'active' check (status in ('trial','active','paused','canceled')),
  timezone text not null default 'America/New_York',

  phone text,
  email text,
  website_url text,
  booking_url text,

  custom_level int not null default 0 check (custom_level in (0,1,2)),
  features jsonb not null default '{}'::jsonb
);

create index ll_autoscale_clients_partner_id_idx on ll_autoscale_clients(partner_id);
create index ll_autoscale_clients_tier_idx on ll_autoscale_clients(tier);
alter table ll_autoscale_clients enable row level security;

-- Stripe Subscription Mapping
create table if not exists ll_autoscale_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references ll_autoscale_clients(id) on delete cascade,

  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,

  current_period_start timestamptz,
  current_period_end timestamptz,
  status text
);

create unique index ll_autoscale_subs_client_unique on ll_autoscale_subscriptions(client_id);
alter table ll_autoscale_subscriptions enable row level security;

-- Industry Packs Catalog
create table if not exists ll_autoscale_industry_packs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  key text unique not null,
  label text not null,
  description text,
  default_config jsonb not null default '{}'::jsonb
);

insert into ll_autoscale_industry_packs (key, label, description, default_config)
values
('general','General','Universal pack for any business','{}'),
('home_services','Home Services','Emergency routing, quote logic, job scheduling','{"tone":"direct_helpful","followup_intensity":"high"}'),
('cleaning','Cleaning','Recurring schedule + reminders + upsells','{"tone":"friendly_detail","followup_intensity":"medium","recurring_offer":true}'),
('landscaping','Landscaping','Seasonal campaigns + quote follow-ups','{"tone":"professional","followup_intensity":"medium"}'),
('roofing','Roofing','Storm/insurance lead routing + inspection booking','{"tone":"confident_urgent","followup_intensity":"high"}'),
('auto','Auto','Service reminders + reactivation cycles','{"tone":"friendly","followup_intensity":"medium"}'),
('wellness','Wellness','Appointment cadence + retention touchpoints','{"tone":"caring","followup_intensity":"low"}')
on conflict (key) do nothing;

alter table ll_autoscale_industry_packs enable row level security;

-- Workflow Templates
create table if not exists ll_autoscale_workflow_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  key text unique not null,
  label text not null,
  version text not null default 'v1',
  tier_min text not null check (tier_min in ('starter','growth','elite')),
  template jsonb not null
);

alter table ll_autoscale_workflow_templates enable row level security;

-- Client Workflows
create table if not exists ll_autoscale_workflows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references ll_autoscale_clients(id) on delete cascade,
  template_key text,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb
);

create index ll_autoscale_workflows_client_idx on ll_autoscale_workflows(client_id);
alter table ll_autoscale_workflows enable row level security;

-- Bot Catalog
create table if not exists ll_autoscale_bots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  key text unique not null,
  label text not null,
  description text,
  tier_min text not null check (tier_min in ('starter','growth','elite')),
  enabled boolean not null default true
);

insert into ll_autoscale_bots (key,label,description,tier_min,enabled) values
('IntakeBot','IntakeBot','Collects onboarding info and validates inputs','starter',true),
('SetupBot','SetupBot','Provisions workflows, channels, defaults','starter',true),
('FollowUpBot','FollowUpBot','Runs multi-step follow-up sequences','starter',true),
('BookingBot','BookingBot','Books appointments and handles reschedules','starter',true),
('ReviewBot','ReviewBot','Requests reviews and routes unhappy responses','growth',true),
('ReportBot','ReportBot','Generates weekly/monthly performance reports','growth',true),
('MonitorBot','MonitorBot','Monitors errors, delivery, and triggers circuit breaker','starter',true),
('CustomBuildBot','CustomBuildBot','Elite-only customizations and integrations','elite',true)
on conflict (key) do nothing;

alter table ll_autoscale_bots enable row level security;

-- Bot Executions
create table if not exists ll_autoscale_bot_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references ll_autoscale_clients(id) on delete cascade,
  bot_key text not null,
  status text not null check (status in ('queued','running','succeeded','failed','skipped')),
  started_at timestamptz,
  finished_at timestamptz,
  error text,
  meta jsonb not null default '{}'::jsonb
);

create index ll_autoscale_bot_runs_client_idx on ll_autoscale_bot_runs(client_id);
create index ll_autoscale_bot_runs_status_idx on ll_autoscale_bot_runs(status, created_at desc);
alter table ll_autoscale_bot_runs enable row level security;

-- Comms Outbox
create table if not exists ll_comm_outbox (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid references ll_autoscale_clients(id) on delete cascade,
  channel text not null check (channel in ('sms','email','voice')),
  to_addr text not null,
  template_key text,
  payload jsonb not null default '{}'::jsonb,

  status text not null default 'queued'
    check (status in ('queued','sending','sent','retrying','failed','deadletter')),
  attempts int not null default 0,
  last_error text,
  next_attempt_at timestamptz not null default now()
);

create index ll_comm_outbox_status_idx on ll_comm_outbox(status, next_attempt_at);
create index ll_comm_outbox_client_idx on ll_comm_outbox(client_id);
alter table ll_comm_outbox enable row level security;

-- Circuit Breaker
create table if not exists ll_circuit_breakers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references ll_autoscale_clients(id) on delete cascade,
  scope text not null default 'global',
  bot_key text,
  is_tripped boolean not null default false,
  tripped_reason text,
  tripped_at timestamptz,
  reset_at timestamptz
);

create index ll_circuit_breakers_client_idx on ll_circuit_breakers(client_id);
create index ll_circuit_breakers_scope_idx on ll_circuit_breakers(client_id, scope, bot_key);
alter table ll_circuit_breakers enable row level security;

-- Stripe Price Mapping
create table if not exists ll_stripe_price_map (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_price_id text unique not null,
  product_family text not null default 'autoscale',
  tier text not null check (tier in ('starter','growth','elite')),
  amount_cents int,
  currency text default 'usd',
  is_active boolean not null default true
);

create index ll_stripe_price_map_tier_idx on ll_stripe_price_map(tier);
alter table ll_stripe_price_map enable row level security;

-- Partner Commission Rules
create table if not exists ll_partner_commission_rules (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  partner_id uuid references ll_partners(id) on delete cascade,
  product_family text not null default 'autoscale',
  tier text not null check (tier in ('starter','growth','elite')),
  commission_rate numeric not null default 0.25,
  is_active boolean not null default true
);

create index ll_partner_commission_rules_partner_idx on ll_partner_commission_rules(partner_id);
alter table ll_partner_commission_rules enable row level security;

-- Global Commission Rules
create table if not exists ll_global_commission_rules (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_family text not null default 'autoscale',
  tier text not null check (tier in ('starter','growth','elite')),
  commission_rate numeric not null
);

insert into ll_global_commission_rules (product_family, tier, commission_rate) values
('autoscale','starter',0.20),
('autoscale','growth',0.25),
('autoscale','elite',0.30)
on conflict do nothing;

alter table ll_global_commission_rules enable row level security;

-- RLS Policies
create policy "auth_read_industry_packs"
  on ll_autoscale_industry_packs for select
  to authenticated
  using (true);

create policy "auth_read_bot_catalog"
  on ll_autoscale_bots for select
  to authenticated
  using (true);

create policy "auth_read_workflow_templates"
  on ll_autoscale_workflow_templates for select
  to authenticated
  using (true);

create policy "auth_read_global_commission"
  on ll_global_commission_rules for select
  to authenticated
  using (true);
