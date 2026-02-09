/*
  # Financial Engine - Rules Engine

  1. Categorization Rules
    - `categorization_rules` - Vendor→category automation rules
    - `rule_suggestions` - AI-suggested rules for merchant approval
    
  2. Helper Functions
    - normalize_vendor() - Vendor name normalization
    
  3. Views
    - v_rule_matches - Which rules match which transactions
    - v_rule_winners - Winning rule per transaction (highest priority)
    - v_effective_category - Final category (rule > AI > manual)
    
  4. Security
    - RLS policies
*/

-- Categorization rules
create table if not exists categorization_rules (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  rule_name text not null,
  match_type text not null check (match_type in ('vendor_contains','vendor_equals','memo_contains','amount_range')),
  match_value text not null,
  amount_min numeric,
  amount_max numeric,
  coa_id uuid not null references chart_of_accounts(id),
  priority int not null default 100,
  is_active boolean not null default true,
  created_by text not null default 'merchant',
  created_at timestamptz default now()
);

alter table categorization_rules enable row level security;

create index if not exists categorization_rules_merchant_idx on categorization_rules(merchant_id, is_active, priority);

-- Rule suggestions (AI-generated)
create table if not exists rule_suggestions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  vendor_key text not null,
  suggested_coa_id uuid references chart_of_accounts(id),
  confidence numeric,
  sample_transactions jsonb not null default '[]'::jsonb,
  reason text,
  status text not null default 'suggested' check (status in ('suggested','accepted','rejected')),
  created_at timestamptz default now(),
  unique (merchant_id, vendor_key)
);

alter table rule_suggestions enable row level security;

-- Vendor normalization helper
create or replace function normalize_vendor(v text)
returns text language sql immutable as $$
  select trim(regexp_replace(lower(coalesce(v,'')), '\s+', ' ', 'g'));
$$;

-- View: Rule matches
create or replace view v_rule_matches as
select
  t.id as transaction_id,
  t.merchant_id,
  t.date,
  t.name as vendor,
  t.amount,
  r.id as rule_id,
  r.rule_name,
  r.priority,
  r.coa_id
from transactions t
join categorization_rules r
  on r.merchant_id = t.merchant_id
 and r.is_active = true
where
  (
    r.match_type = 'vendor_equals' and normalize_vendor(t.name) = normalize_vendor(r.match_value)
  )
  or (
    r.match_type = 'vendor_contains' and normalize_vendor(t.name) like '%' || normalize_vendor(r.match_value) || '%'
  )
  or (
    r.match_type = 'amount_range'
    and (r.amount_min is null or t.amount >= r.amount_min)
    and (r.amount_max is null or t.amount <= r.amount_max)
  );

-- View: Winning rule per transaction
create or replace view v_rule_winners as
select distinct on (transaction_id)
  transaction_id,
  merchant_id,
  rule_id,
  rule_name,
  coa_id
from v_rule_matches
order by transaction_id, priority asc, rule_id asc;

-- View: Effective category (rules override AI)
create or replace view v_effective_category as
select
  t.id as transaction_id,
  t.merchant_id,
  coalesce(rw.coa_id, tc.coa_id) as effective_coa_id,
  case
    when rw.coa_id is not null then 'rules'
    when tc.transaction_id is not null then tc.source
    else 'none'
  end as effective_source,
  coalesce(tc.confidence, null) as ai_confidence,
  coalesce(tc.approved, false) as ai_approved,
  rw.rule_id,
  rw.rule_name
from transactions t
left join v_rule_winners rw on rw.transaction_id = t.id
left join transaction_categorizations tc on tc.transaction_id = t.id;

-- RLS policies
create policy "members can select rules"
on categorization_rules for select
using (is_merchant_member(merchant_id));

create policy "members can insert rules"
on categorization_rules for insert
with check (is_merchant_member(merchant_id));

create policy "members can update rules"
on categorization_rules for update
using (is_merchant_member(merchant_id));

create policy "members can select suggestions"
on rule_suggestions for select
using (is_merchant_member(merchant_id));
