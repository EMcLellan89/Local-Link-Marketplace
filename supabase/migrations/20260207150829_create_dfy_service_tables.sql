/*
  # Financial Engine - DFY Service Tables

  1. DFY Intakes
    - `dfy_intakes` - DFY service requests (cleanup, setup, etc)
    - `dfy_updates` - Status update log
    - `cleanup_quote_requests` - Cleanup quote bot requests
    
  2. Security
    - RLS policies
*/

-- DFY intakes
create table if not exists dfy_intakes (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  plan_code text not null,
  status text not null default 'new' check (status in ('new','in_progress','waiting_client','delivered','paused')),
  answers jsonb not null default '{}'::jsonb,
  provider_id uuid references providers(id),
  created_at timestamptz default now()
);

alter table dfy_intakes enable row level security;

-- DFY updates (status log)
create table if not exists dfy_updates (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references dfy_intakes(id) on delete cascade,
  status text not null,
  message text,
  created_at timestamptz default now()
);

alter table dfy_updates enable row level security;

-- Cleanup quote requests
create table if not exists cleanup_quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_by text not null default 'partner',
  partner_id uuid references partners(id),
  merchant_id uuid references merchants(id),
  answers jsonb not null default '{}'::jsonb,
  quote jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','quoted','accepted','declined')),
  created_at timestamptz default now()
);

alter table cleanup_quote_requests enable row level security;

-- RLS policies
create policy "members can select dfy intakes"
on dfy_intakes for select
using (is_merchant_member(merchant_id));

create policy "members can select dfy updates"
on dfy_updates for select
using (
  exists (
    select 1 from dfy_intakes di
    where di.id = dfy_updates.intake_id
    and is_merchant_member(di.merchant_id)
  )
);

create policy "members can select cleanup quotes"
on cleanup_quote_requests for select
using (merchant_id is null or is_merchant_member(merchant_id));

create policy "partners can select their quotes"
on cleanup_quote_requests for select
using (
  exists (
    select 1 from partners p
    where p.id = cleanup_quote_requests.partner_id
    and p.user_id = auth.uid()
  )
);

-- Indexes
create index if not exists dfy_intakes_merchant_idx on dfy_intakes(merchant_id, status);
create index if not exists dfy_updates_intake_idx on dfy_updates(intake_id);
create index if not exists cleanup_quote_requests_partner_idx on cleanup_quote_requests(partner_id);
