/*
  # Customer Referral Engine™ System

  1. New Tables
    - `customer_referral_industry_presets`
      - Pre-configured referral program settings by industry
      - Includes reward types, values, and qualifying events
    
    - `customer_referral_programs`
      - Merchant referral program configurations
      - One per merchant, can be enabled/disabled
      - Industry-based or custom settings
    
    - `customer_referral_links`
      - Personal referral links for each customer
      - Unique share codes for tracking
    
    - `customer_referrals`
      - Track all referral activity (clicks, leads, conversions)
      - Links referrer to referee with status tracking
    
    - `customer_referral_rewards`
      - Track rewards owed, issued, and redeemed
      - Links back to qualifying referral

  2. Security
    - Enable RLS on all tables
    - Merchants can manage their programs and view data
    - Customers can view their own referral links and activity
    - Public access for landing pages and lead capture
    - Admins can view and manage everything

  3. Features
    - Industry presets (cleaning, trades, medspa, restaurant)
    - Multiple reward types (credit, cash, coupon, gift card)
    - Flexible qualifying events (first purchase, minimum spend, etc)
    - Fraud protection (max rewards per customer, block self-referrals)
    - Full activity tracking and reporting
*/

-- Industry presets table
create table if not exists public.customer_referral_industry_presets (
  id uuid primary key default gen_random_uuid(),
  industry_key text not null,
  industry_name text not null,
  program_name text not null,
  tagline text not null,
  reward_type text not null default 'credit',
  reward_value_cents integer not null default 2500,
  referee_incentive_type text not null default 'coupon',
  referee_incentive_value_cents integer not null default 1500,
  qualifying_event text not null default 'first_paid_invoice',
  min_spend_cents integer not null default 0,
  created_at timestamptz not null default now(),
  unique(industry_key)
);

create index if not exists idx_cust_ref_presets_industry on public.customer_referral_industry_presets(industry_key);

-- Merchant customer referral programs
create table if not exists public.customer_referral_programs (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  is_enabled boolean not null default true,
  industry_key text not null default 'general',
  landing_slug text not null,
  program_name text not null default 'Refer & Earn',
  reward_type text not null default 'credit',
  reward_value_cents integer not null default 2500,
  referee_incentive_type text not null default 'coupon',
  referee_incentive_value_cents integer not null default 1500,
  qualifying_event text not null default 'first_paid_invoice',
  min_spend_cents integer not null default 0,
  fraud_max_rewards_per_customer integer not null default 3,
  fraud_block_self_referrals boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(merchant_id),
  unique(landing_slug)
);

create index if not exists idx_cust_ref_programs_merchant on public.customer_referral_programs(merchant_id);
create index if not exists idx_cust_ref_programs_slug on public.customer_referral_programs(landing_slug);
create index if not exists idx_cust_ref_programs_enabled on public.customer_referral_programs(is_enabled);

-- Customer referral links
create table if not exists public.customer_referral_links (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete cascade,
  customer_email text not null,
  customer_name text,
  share_code text not null,
  created_at timestamptz not null default now(),
  unique(share_code)
);

create index if not exists idx_cust_ref_links_merchant on public.customer_referral_links(merchant_id);
create index if not exists idx_cust_ref_links_customer on public.customer_referral_links(customer_id);
create index if not exists idx_cust_ref_links_email on public.customer_referral_links(customer_email);
create index if not exists idx_cust_ref_links_code on public.customer_referral_links(share_code);

-- Customer referrals tracking
create table if not exists public.customer_referrals (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  referrer_customer_id uuid references public.profiles(id) on delete set null,
  referee_customer_id uuid references public.profiles(id) on delete set null,
  share_code text not null,
  referee_email text,
  referee_phone text,
  status text not null default 'clicked',
  qualifying_amount_cents integer,
  qualifying_source text,
  qualified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cust_referrals_merchant on public.customer_referrals(merchant_id);
create index if not exists idx_cust_referrals_referrer on public.customer_referrals(referrer_customer_id);
create index if not exists idx_cust_referrals_referee on public.customer_referrals(referee_customer_id);
create index if not exists idx_cust_referrals_code on public.customer_referrals(share_code);
create index if not exists idx_cust_referrals_status on public.customer_referrals(merchant_id, status);
create index if not exists idx_cust_referrals_email on public.customer_referrals(merchant_id, referee_email);

-- Customer referral rewards
create table if not exists public.customer_referral_rewards (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  referral_id uuid not null references public.customer_referrals(id) on delete cascade,
  referrer_customer_id uuid references public.profiles(id) on delete set null,
  reward_type text not null,
  reward_value_cents integer not null,
  status text not null default 'owed',
  coupon_code text,
  issued_at timestamptz,
  redeemed_at timestamptz,
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cust_ref_rewards_merchant on public.customer_referral_rewards(merchant_id);
create index if not exists idx_cust_ref_rewards_referral on public.customer_referral_rewards(referral_id);
create index if not exists idx_cust_ref_rewards_referrer on public.customer_referral_rewards(referrer_customer_id);
create index if not exists idx_cust_ref_rewards_status on public.customer_referral_rewards(merchant_id, status);

-- Enable RLS
alter table public.customer_referral_industry_presets enable row level security;
alter table public.customer_referral_programs enable row level security;
alter table public.customer_referral_links enable row level security;
alter table public.customer_referrals enable row level security;
alter table public.customer_referral_rewards enable row level security;

-- RLS Policies: Industry presets (public read)
create policy "Anyone can view customer referral industry presets"
  on public.customer_referral_industry_presets for select
  to authenticated
  using (true);

-- RLS Policies: Customer referral programs
create policy "Merchants can view their own customer referral program"
  on public.customer_referral_programs for select
  to authenticated
  using (
    auth.uid() = merchant_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Merchants can manage their own customer referral program"
  on public.customer_referral_programs for all
  to authenticated
  using (auth.uid() = merchant_id);

create policy "Public can view enabled customer referral programs by landing slug"
  on public.customer_referral_programs for select
  to anon, authenticated
  using (is_enabled = true);

-- RLS Policies: Customer referral links
create policy "Customers can view their own customer referral links"
  on public.customer_referral_links for select
  to authenticated
  using (
    auth.uid() = customer_id
    or auth.uid() = merchant_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Public can view customer referral links by share code"
  on public.customer_referral_links for select
  to anon, authenticated
  using (true);

create policy "Merchants can create customer referral links"
  on public.customer_referral_links for insert
  to authenticated
  with check (auth.uid() = merchant_id);

-- RLS Policies: Customer referrals
create policy "Users can view their own customer referrals"
  on public.customer_referrals for select
  to authenticated
  using (
    auth.uid() = referrer_customer_id
    or auth.uid() = referee_customer_id
    or auth.uid() = merchant_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Public can create customer referral clicks and leads"
  on public.customer_referrals for insert
  to anon, authenticated
  with check (true);

create policy "Merchants can update their customer referrals"
  on public.customer_referrals for update
  to authenticated
  using (auth.uid() = merchant_id);

-- RLS Policies: Customer referral rewards
create policy "Users can view their own customer referral rewards"
  on public.customer_referral_rewards for select
  to authenticated
  using (
    auth.uid() = referrer_customer_id
    or auth.uid() = merchant_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Merchants can manage customer referral rewards"
  on public.customer_referral_rewards for all
  to authenticated
  using (auth.uid() = merchant_id);

-- Seed industry presets
insert into public.customer_referral_industry_presets (
  industry_key,
  industry_name,
  program_name,
  tagline,
  reward_type,
  reward_value_cents,
  referee_incentive_type,
  referee_incentive_value_cents,
  qualifying_event,
  min_spend_cents
) values
  (
    'cleaning',
    'Cleaning Services',
    'Refer a Neighbor',
    'Share the sparkle — earn $25 credit when your neighbor books their first clean',
    'credit',
    2500,
    'coupon',
    1500,
    'first_paid_invoice',
    0
  ),
  (
    'trades',
    'Trades & Contractors',
    'Refer & Save',
    'Know someone who needs work done? Refer them and earn $30 toward your next project',
    'credit',
    3000,
    'coupon',
    2000,
    'first_paid_invoice',
    10000
  ),
  (
    'medspa',
    'Med Spa & Beauty',
    'Share the Glow',
    'Refer a friend to experience our treatments — you both earn $20 credit',
    'credit',
    2000,
    'credit',
    2000,
    'first_paid_invoice',
    0
  ),
  (
    'restaurant',
    'Restaurants',
    'Bring a Friend',
    'Love our food? Refer a friend and get $15 off your next visit when they dine with us',
    'coupon',
    1500,
    'coupon',
    1000,
    'first_paid_invoice',
    2500
  ),
  (
    'general',
    'General Business',
    'Refer & Earn',
    'Love our service? Refer a friend and earn rewards when they become a customer',
    'credit',
    2500,
    'coupon',
    1500,
    'first_paid_invoice',
    0
  )
on conflict (industry_key) do nothing;

comment on table public.customer_referral_industry_presets is 'Pre-configured customer referral program settings by industry';
comment on table public.customer_referral_programs is 'Merchant customer referral program configurations';
comment on table public.customer_referral_links is 'Personal referral links for customers';
comment on table public.customer_referrals is 'Track all customer referral activity (clicks, leads, conversions)';
comment on table public.customer_referral_rewards is 'Track customer referral rewards owed, issued, and redeemed';
