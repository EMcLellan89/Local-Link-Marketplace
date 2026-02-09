/*
  # Fix Banking & Transactions Tables

  Drop and recreate with proper structure
*/

-- Drop existing if has issues
drop table if exists transaction_categorizations cascade;
drop table if exists transactions cascade;
drop table if exists chart_of_accounts cascade;
drop table if exists bank_accounts cascade;
drop table if exists bank_connections cascade;

-- Bank connections (Plaid)
create table bank_connections (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  plaid_item_id text unique,
  plaid_access_token text,
  institution_name text,
  status text not null default 'active' check (status in ('active','disconnected','error','reauth_required')),
  created_at timestamptz default now()
);

alter table bank_connections enable row level security;

-- Bank accounts
create table bank_accounts (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  connection_id uuid not null references bank_connections(id) on delete cascade,
  plaid_account_id text unique,
  name text,
  mask text,
  subtype text,
  type text,
  created_at timestamptz default now()
);

alter table bank_accounts enable row level security;

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  account_id uuid references bank_accounts(id) on delete set null,
  plaid_transaction_id text unique,
  date date,
  name text,
  amount numeric,
  iso_currency_code text default 'USD',
  pending boolean default false,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table transactions enable row level security;

-- Chart of accounts
create table chart_of_accounts (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  code text,
  name text not null,
  type text not null check (type in ('income','expense','asset','liability','equity','cogs')),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table chart_of_accounts enable row level security;

-- Transaction categorizations
create table transaction_categorizations (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  coa_id uuid references chart_of_accounts(id),
  confidence numeric,
  source text not null default 'ai' check (source in ('ai','manual','rules','provider')),
  notes text,
  approved boolean default false,
  created_at timestamptz default now(),
  unique(transaction_id)
);

alter table transaction_categorizations enable row level security;

-- RLS policies
create policy "members can select bank data"
on bank_connections for select
using (is_merchant_member(merchant_id));

create policy "members can select bank accounts"
on bank_accounts for select
using (is_merchant_member(merchant_id));

create policy "members can select transactions"
on transactions for select
using (is_merchant_member(merchant_id));

create policy "members can select categorizations"
on transaction_categorizations for select
using (is_merchant_member(merchant_id));

create policy "members can select COA"
on chart_of_accounts for select
using (is_merchant_member(merchant_id));

-- Indexes
create index bank_connections_merchant_idx on bank_connections(merchant_id);
create index bank_accounts_merchant_idx on bank_accounts(merchant_id);
create index bank_accounts_connection_idx on bank_accounts(connection_id);
create index transactions_merchant_date_idx on transactions(merchant_id, date desc);
create index transactions_account_idx on transactions(account_id);
create index transaction_categorizations_merchant_idx on transaction_categorizations(merchant_id);
create index transaction_categorizations_tx_idx on transaction_categorizations(transaction_id);
create index chart_of_accounts_merchant_idx on chart_of_accounts(merchant_id, is_active);
