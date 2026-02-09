/*
  # Financial Engine - Monthly Close & Reporting

  1. Monthly Close
    - `monthly_closes` - Month-end close process tracking
    - `finance_tasks` - Tasks for merchants/providers
    
  2. Reports
    - `financial_reports` - Stored P&L, tax packs, etc
    
  3. Security
    - RLS policies for access control
*/

-- Monthly closes
create table if not exists monthly_closes (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  month int not null check (month between 1 and 12),
  year int not null,
  status text not null default 'open' check (status in ('open','in_review','closed')),
  provider_id uuid references providers(id),
  summary jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique (merchant_id, month, year)
);

alter table monthly_closes enable row level security;

-- Financial reports
create table if not exists financial_reports (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  report_type text not null check (report_type in ('pnl','balance_sheet','cashflow','tax_pack')),
  month int,
  year int,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  unique (merchant_id, report_type, month, year)
);

alter table financial_reports enable row level security;

-- Finance tasks
create table if not exists finance_tasks (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  title text not null,
  task_type text not null,
  status text not null default 'open' check (status in ('open','done','blocked')),
  assigned_to text not null default 'bot',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table finance_tasks enable row level security;

-- RLS policies
create policy "members can select closes"
on monthly_closes for select
using (is_merchant_member(merchant_id));

create policy "providers can select assigned closes"
on monthly_closes for select
using (is_assigned_provider(merchant_id));

create policy "providers can update assigned closes"
on monthly_closes for update
using (is_assigned_provider(merchant_id));

create policy "members can select reports"
on financial_reports for select
using (is_merchant_member(merchant_id));

create policy "members can select tasks"
on finance_tasks for select
using (is_merchant_member(merchant_id));

-- Indexes
create index if not exists monthly_closes_merchant_idx on monthly_closes(merchant_id, year, month);
create index if not exists monthly_closes_provider_idx on monthly_closes(provider_id);
create index if not exists financial_reports_merchant_idx on financial_reports(merchant_id, report_type, year, month);
create index if not exists finance_tasks_merchant_idx on finance_tasks(merchant_id, status);
