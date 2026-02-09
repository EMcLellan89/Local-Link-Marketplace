/*
  # Marketplace Checkout System (SamCart Parity)

  1. Tables
    - marketplace_partners: Partner sellers with tier commissions
    - marketplace_products: Products for sale
    - marketplace_product_prices: Pricing options
    - marketplace_checkout_configs: Checkout settings
    - marketplace_checkout_sessions: Session tracking
    - marketplace_orders: Completed orders
    - marketplace_order_items: Order line items
    - marketplace_abandoned_carts: Cart recovery
    - marketplace_subscriptions: Subscription tracking
    - marketplace_commissions: Commission ledger

  2. Security
    - RLS on all tables
    - Public read for active products
    - User-scoped access
*/

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'marketplace_pricing_type') then
    create type marketplace_pricing_type as enum ('one_time','monthly','annual');
  end if;
  if not exists (select 1 from pg_type where typname = 'marketplace_cart_status') then
    create type marketplace_cart_status as enum ('open','abandoned','recovered','expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'marketplace_payment_status') then
    create type marketplace_payment_status as enum ('pending','paid','refunded','disputed','failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'marketplace_commission_status') then
    create type marketplace_commission_status as enum ('pending','earned','void','paid');
  end if;
end $$;

-- Partners
create table if not exists public.marketplace_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null,
  referral_code text unique not null,
  referral_id text unique not null,
  tier text not null default 'starter',
  membership_active boolean not null default true,
  membership_ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  long_description text,
  image_url text,
  is_active boolean not null default true,
  product_type text not null default 'digital',
  created_at timestamptz not null default now()
);

-- Prices
create table if not exists public.marketplace_product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  pricing marketplace_pricing_type not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  stripe_price_id text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_id, pricing)
);

-- Checkout config
create table if not exists public.marketplace_checkout_configs (
  product_id uuid primary key references public.marketplace_products(id) on delete cascade,
  enable_coupons boolean not null default true,
  enable_order_bump boolean not null default false,
  order_bump_product_id uuid references public.marketplace_products(id),
  order_bump_amount_cents integer,
  order_bump_commissionable boolean not null default true,
  enable_upsell boolean not null default false,
  upsell_product_id uuid references public.marketplace_products(id),
  upsell_commissionable boolean not null default true,
  require_terms boolean not null default true,
  created_at timestamptz not null default now()
);

-- Checkout sessions
create table if not exists public.marketplace_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_id uuid not null references public.marketplace_products(id),
  price_id uuid not null references public.marketplace_product_prices(id),
  partner_id uuid references public.marketplace_partners(id),
  partner_referral_code text,
  embedded boolean not null default false,
  source_domain text,
  user_id uuid references auth.users(id),
  customer_email text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status marketplace_payment_status not null default 'pending',
  bump_selected boolean not null default false,
  bump_product_id uuid references public.marketplace_products(id),
  bump_amount_cents integer,
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'usd'
);

-- Orders
create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  checkout_session_id uuid unique references public.marketplace_checkout_sessions(id) on delete set null,
  product_id uuid not null references public.marketplace_products(id),
  price_id uuid not null references public.marketplace_product_prices(id),
  user_id uuid references auth.users(id),
  customer_email text,
  partner_id uuid references public.marketplace_partners(id),
  commission_rate numeric(5,4) not null default 0,
  commission_status marketplace_commission_status not null default 'pending',
  subtotal_cents integer not null,
  bump_cents integer not null default 0,
  total_cents integer not null,
  currency text not null default 'usd',
  stripe_payment_intent_id text unique,
  stripe_invoice_id text,
  stripe_customer_id text,
  paid_at timestamptz,
  status marketplace_payment_status not null default 'paid'
);

-- Order items
create table if not exists public.marketplace_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  product_id uuid not null references public.marketplace_products(id),
  item_type text not null check (item_type in ('primary','bump','upsell')),
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

-- Abandoned carts
create table if not exists public.marketplace_abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  checkout_session_id uuid unique references public.marketplace_checkout_sessions(id) on delete cascade,
  status marketplace_cart_status not null default 'open',
  last_email_sent_at timestamptz,
  last_sms_sent_at timestamptz,
  recovered_at timestamptz,
  expires_at timestamptz
);

-- Subscriptions
create table if not exists public.marketplace_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id),
  customer_email text,
  product_id uuid references public.marketplace_products(id),
  price_id uuid references public.marketplace_product_prices(id),
  stripe_subscription_id text unique not null,
  stripe_customer_id text,
  status text not null,
  current_period_end timestamptz,
  canceled_at timestamptz
);

-- Commissions
create table if not exists public.marketplace_commissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  partner_id uuid not null references public.marketplace_partners(id),
  commission_rate numeric(5,4) not null,
  commission_amount_cents integer not null,
  status marketplace_commission_status not null default 'pending',
  earned_at timestamptz,
  paid_at timestamptz
);

-- Indexes
create index if not exists idx_mkt_partners_user on public.marketplace_partners(user_id);
create index if not exists idx_mkt_partners_ref_code on public.marketplace_partners(referral_code);
create index if not exists idx_mkt_products_slug on public.marketplace_products(slug);
create index if not exists idx_mkt_product_prices_product on public.marketplace_product_prices(product_id);
create index if not exists idx_mkt_checkout_sessions_stripe on public.marketplace_checkout_sessions(stripe_checkout_session_id);
create index if not exists idx_mkt_checkout_sessions_user on public.marketplace_checkout_sessions(user_id);
create index if not exists idx_mkt_orders_user on public.marketplace_orders(user_id);
create index if not exists idx_mkt_orders_partner on public.marketplace_orders(partner_id);
create index if not exists idx_mkt_orders_stripe_pi on public.marketplace_orders(stripe_payment_intent_id);
create index if not exists idx_mkt_subscriptions_user on public.marketplace_subscriptions(user_id);
create index if not exists idx_mkt_subscriptions_stripe on public.marketplace_subscriptions(stripe_subscription_id);
create index if not exists idx_mkt_commissions_partner_status on public.marketplace_commissions(partner_id, status);
create index if not exists idx_mkt_abandoned_carts_status on public.marketplace_abandoned_carts(status);

-- Triggers
create or replace function public.update_marketplace_cart_timestamp()
returns trigger language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists update_abandoned_cart_timestamp on public.marketplace_abandoned_carts;
create trigger update_abandoned_cart_timestamp
before update on public.marketplace_abandoned_carts
for each row execute function public.update_marketplace_cart_timestamp();

-- RLS
alter table public.marketplace_partners enable row level security;
alter table public.marketplace_products enable row level security;
alter table public.marketplace_product_prices enable row level security;
alter table public.marketplace_checkout_configs enable row level security;
alter table public.marketplace_checkout_sessions enable row level security;
alter table public.marketplace_orders enable row level security;
alter table public.marketplace_order_items enable row level security;
alter table public.marketplace_abandoned_carts enable row level security;
alter table public.marketplace_subscriptions enable row level security;
alter table public.marketplace_commissions enable row level security;

-- Policies
create policy "Anyone can view active products"
  on public.marketplace_products for select
  using (is_active = true);

create policy "Anyone can view active prices"
  on public.marketplace_product_prices for select
  using (is_active = true);

create policy "Anyone can view checkout configs"
  on public.marketplace_checkout_configs for select
  using (true);

create policy "Partners can view own profile"
  on public.marketplace_partners for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can view own checkout sessions"
  on public.marketplace_checkout_sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can view own orders"
  on public.marketplace_orders for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can view own order items"
  on public.marketplace_order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.marketplace_orders o
      where o.id = marketplace_order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "Users can view own abandoned carts"
  on public.marketplace_abandoned_carts for select
  to authenticated
  using (
    exists (
      select 1 from public.marketplace_checkout_sessions cs
      where cs.id = marketplace_abandoned_carts.checkout_session_id
        and cs.user_id = auth.uid()
    )
  );

create policy "Users can view own subscriptions"
  on public.marketplace_subscriptions for select
  to authenticated
  using (user_id = auth.uid());

create policy "Partners can view own commissions"
  on public.marketplace_commissions for select
  to authenticated
  using (
    exists (
      select 1 from public.marketplace_partners p
      where p.id = marketplace_commissions.partner_id
        and p.user_id = auth.uid()
    )
  );