/*
  # Add Partner Commission System (Safe)

  1. Changes to Existing Tables
    - Add tier_key, is_active_subscriber, stripe_connect_account_id to partners

  2. New Tables
    - partner_uplines, commission_ledger, payout_batches

  3. Security
    - RLS policies for all new tables
*/

-- Add columns to existing partners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'tier_key'
  ) THEN
    ALTER TABLE public.partners ADD COLUMN tier_key text references public.partner_tiers(key) default 'starter';
    UPDATE public.partners SET tier_key = 'starter' WHERE tier_key IS NULL;
    ALTER TABLE public.partners ALTER COLUMN tier_key SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'is_active_subscriber'
  ) THEN
    ALTER TABLE public.partners ADD COLUMN is_active_subscriber boolean not null default true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'stripe_connect_account_id'
  ) THEN
    ALTER TABLE public.partners ADD COLUMN stripe_connect_account_id text;
    UPDATE public.partners SET stripe_connect_account_id = stripe_account_id WHERE stripe_account_id IS NOT NULL;
  END IF;
END $$;

create index if not exists idx_partners_tier on public.partners(tier_key);
create index if not exists idx_partners_active_subscriber on public.partners(is_active_subscriber);

-- Upline relationships
create table if not exists public.partner_uplines (
  partner_id uuid primary key references public.partners(id) on delete cascade,
  upline_partner_id uuid not null references public.partners(id) on delete restrict,
  upline_rate_bps int not null default 700,
  created_at timestamptz not null default now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'partner_uplines' 
    AND policyname = 'Partners can view their upline relationships'
  ) THEN
    EXECUTE 'alter table public.partner_uplines enable row level security';
    
    EXECUTE 'create policy "Partners can view their upline relationships"
      on public.partner_uplines for select
      to authenticated
      using (
        exists (
          select 1 from public.partners
          where partners.id = partner_uplines.partner_id
          and partners.user_id = auth.uid()
        )
      )';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'partner_uplines' 
    AND policyname = 'Admins can manage all upline relationships'
  ) THEN
    EXECUTE 'create policy "Admins can manage all upline relationships"
      on public.partner_uplines for all
      to authenticated
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.role = ''admin''
        )
      )';
  END IF;
END $$;

-- Payout batches
create table if not exists public.payout_batches (
  id uuid primary key default gen_random_uuid(),
  run_type text not null default 'manual',
  notes text,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'payout_batches' 
    AND policyname = 'Admins can manage payout batches'
  ) THEN
    EXECUTE 'alter table public.payout_batches enable row level security';
    
    EXECUTE 'create policy "Admins can manage payout batches"
      on public.payout_batches for all
      to authenticated
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.role = ''admin''
        )
      )';
  END IF;
END $$;

-- Commission ledger
create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  recipient_partner_id uuid not null references public.partners(id) on delete restrict,
  order_id uuid references public.dfy_orders(id) on delete set null,
  stripe_invoice_id text not null,
  stripe_subscription_id text,
  event_type text not null,
  amount_gross_cents int not null,
  commission_rate_bps int not null,
  commission_owed_cents int not null,
  status text not null default 'owed',
  paid_at timestamptz,
  payout_batch_id uuid references public.payout_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(recipient_partner_id, stripe_invoice_id, event_type)
);

create index if not exists idx_commission_status on public.commission_ledger(status);
create index if not exists idx_commission_recipient on public.commission_ledger(recipient_partner_id);
create index if not exists idx_commission_invoice on public.commission_ledger(stripe_invoice_id);
create index if not exists idx_commission_payout_batch on public.commission_ledger(payout_batch_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'commission_ledger' 
    AND policyname = 'Partners can view their own commissions'
  ) THEN
    EXECUTE 'alter table public.commission_ledger enable row level security';
    
    EXECUTE 'create policy "Partners can view their own commissions"
      on public.commission_ledger for select
      to authenticated
      using (
        exists (
          select 1 from public.partners
          where partners.id = commission_ledger.recipient_partner_id
          and partners.user_id = auth.uid()
        )
      )';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'commission_ledger' 
    AND policyname = 'Admins can manage all commissions'
  ) THEN
    EXECUTE 'create policy "Admins can manage all commissions"
      on public.commission_ledger for all
      to authenticated
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.role = ''admin''
        )
      )';
  END IF;
END $$;

comment on table public.partner_uplines is 'Upline relationships for 7% override commissions';
comment on table public.commission_ledger is 'Commission tracking per invoice with idempotency';
comment on table public.payout_batches is 'Payout run tracking for batch processing';
