/*
  # Fix Commissions Table

  Create commissions table with proper policies
*/

drop table if exists commissions cascade;

-- Commissions
create table commissions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  partner_id uuid references partners(id),
  referral_id text,
  referral_name text,
  source text not null check (source in ('subscription','one_time','upsell')),
  stripe_invoice_id text,
  amount_cents int not null,
  status text not null default 'pending' check (status in ('pending','approved','paid','void')),
  created_at timestamptz default now()
);

alter table commissions enable row level security;

-- Partner can view their commissions
create policy "partners can view own commissions"
on commissions for select
using (
  partner_id in (
    select id from partners p where p.user_id = auth.uid()
  )
);

-- Indexes
create index commissions_partner_idx on commissions(partner_id, status);
create index commissions_merchant_idx on commissions(merchant_id);
create index commissions_created_idx on commissions(created_at);
