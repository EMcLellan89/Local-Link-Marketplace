/*
  # Create User Subscriptions Table

  Tracks user subscriptions for Local-Link Pro and other plans.
  Used to automatically grant free course access to Pro subscribers.
*/

-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null,
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists user_subscriptions_user_id_idx
on public.user_subscriptions(user_id);

create index if not exists user_subscriptions_plan_status_idx
on public.user_subscriptions(plan_slug, status);

-- RLS
alter table public.user_subscriptions enable row level security;

create policy "subscriptions_self_read"
on public.user_subscriptions for select
using (user_id = auth.uid());

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_user_subscriptions_updated_at on public.user_subscriptions;

create trigger trg_user_subscriptions_updated_at
before update on public.user_subscriptions
for each row execute function public.set_updated_at();

-- Stripe subscription mapping table (for webhook lookups)
create table if not exists public.stripe_subscription_map (
  stripe_subscription_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null,
  created_at timestamptz default now()
);

alter table public.stripe_subscription_map enable row level security;

-- Only service role needs access
create policy "stripe_subscription_map_admin_read"
on public.stripe_subscription_map for select
using (false);
