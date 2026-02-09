/*
  # Tax-Ready Score System

  1. Views
    - v_tax_ready_metrics_month - Monthly metrics per merchant
    - v_tax_ready_fix_list - What to fix this week
    - v_tax_ready_score_trend_6mo - Last 6 months trend
    
  2. Functions
    - tax_ready_score_month() - Calculate 0-100 score for a month
    
  3. Queues
    - v_queue_needs_review - Transactions needing review
    - v_queue_missing_receipts - Transactions missing receipts
*/

-- Monthly metrics view
create or replace view v_tax_ready_metrics_month as
with tx as (
  select
    t.merchant_id,
    extract(year from t.date)::int as year,
    extract(month from t.date)::int as month,
    count(*) as tx_count,
    sum(case when t.amount > 0 then t.amount else 0 end) as spend_total
  from transactions t
  where t.date is not null
  group by 1,2,3
),
uncat as (
  select
    t.merchant_id,
    extract(year from t.date)::int as year,
    extract(month from t.date)::int as month,
    count(*) filter (where tc.transaction_id is null) as uncategorized_count,
    sum(case when tc.transaction_id is null and t.amount > 0 then t.amount else 0 end) as uncategorized_spend
  from transactions t
  left join transaction_categorizations tc on tc.transaction_id = t.id
  where t.date is not null
  group by 1,2,3
),
miss_receipts as (
  select
    t.merchant_id,
    extract(year from t.date)::int as year,
    extract(month from t.date)::int as month,
    count(*) filter (where r.id is null and t.amount > 25) as missing_receipt_count,
    sum(case when r.id is null and t.amount > 25 then t.amount else 0 end) as missing_receipt_spend
  from transactions t
  left join receipts r on r.linked_transaction_id = t.id
  where t.amount > 0 and t.date is not null
  group by 1,2,3
)
select
  tx.merchant_id,
  tx.year,
  tx.month,
  tx.tx_count,
  tx.spend_total,
  coalesce(uncat.uncategorized_count,0) as uncategorized_count,
  coalesce(uncat.uncategorized_spend,0) as uncategorized_spend,
  coalesce(miss_receipts.missing_receipt_count,0) as missing_receipt_count,
  coalesce(miss_receipts.missing_receipt_spend,0) as missing_receipt_spend
from tx
left join uncat on uncat.merchant_id=tx.merchant_id and uncat.year=tx.year and uncat.month=tx.month
left join miss_receipts on miss_receipts.merchant_id=tx.merchant_id and miss_receipts.year=tx.year and miss_receipts.month=tx.month;

-- Tax-Ready Score function
create or replace function tax_ready_score_month(
  p_merchant_id uuid,
  p_year int,
  p_month int
)
returns int
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  m record;
  score numeric := 100;
  uncat_pct numeric := 0;
  miss_pct numeric := 0;
begin
  select * into m
  from v_tax_ready_metrics_month
  where merchant_id = p_merchant_id and year = p_year and month = p_month;

  if not found then
    return 100;
  end if;

  if m.tx_count > 0 then
    uncat_pct := (m.uncategorized_count::numeric / m.tx_count::numeric);
    miss_pct  := (m.missing_receipt_count::numeric / m.tx_count::numeric);
  end if;

  -- Penalty calculations
  score := score - least(40, uncat_pct * 100 * 0.4);
  score := score - least(40, miss_pct  * 100 * 0.4);
  score := score - least(10, (coalesce(m.uncategorized_spend,0) / 1000.0) * 2.0);
  score := score - least(10, (coalesce(m.missing_receipt_spend,0) / 1000.0) * 2.0);

  if score < 0 then score := 0; end if;
  return round(score)::int;
end;
$$;

-- Needs Review queue
create or replace view v_queue_needs_review as
select
  t.id as transaction_id,
  t.merchant_id,
  t.date,
  t.name as vendor,
  t.amount,
  tc.coa_id,
  coa.name as coa_name,
  coalesce(tc.confidence, 0) as confidence,
  coalesce(tc.approved, false) as approved,
  case
    when tc.transaction_id is null then 'missing_category'
    when coalesce(tc.approved,false) = false and coalesce(tc.confidence,0) < 0.85 then 'low_confidence'
    when coalesce(tc.approved,false) = false then 'needs_approval'
    else 'ok'
  end as reason
from transactions t
left join transaction_categorizations tc on tc.transaction_id = t.id
left join chart_of_accounts coa on coa.id = tc.coa_id
where
  tc.transaction_id is null
  or coalesce(tc.approved,false) = false;

-- Missing receipts queue
create or replace view v_queue_missing_receipts as
select
  t.id as transaction_id,
  t.merchant_id,
  t.date,
  t.name as vendor,
  t.amount,
  coalesce(r.id, null) as receipt_id,
  case
    when r.id is null and t.amount >= 75 then 'missing_receipt_high_value'
    when r.id is null and t.amount >= 25 then 'missing_receipt_mid_value'
    else 'ok'
  end as reason
from transactions t
left join receipts r on r.linked_transaction_id = t.id
where
  t.amount > 0
  and r.id is null
  and t.name is not null
  and lower(t.name) not like '%payroll%'
  and lower(t.name) not like '%transfer%';

-- Fix list view
create or replace view v_tax_ready_fix_list as
with last_30 as (
  select
    merchant_id,
    count(*) as tx_count,
    count(*) filter (where reason in ('missing_category','low_confidence','needs_approval')) as needs_review_count
  from v_queue_needs_review
  group by 1
),
missing_receipts as (
  select merchant_id, count(*) as missing_receipts_count
  from v_queue_missing_receipts
  group by 1
),
open_tasks as (
  select merchant_id, count(*) as open_tasks_count
  from finance_tasks
  where status='open'
  group by 1
)
select
  m.id as merchant_id,
  coalesce(l.needs_review_count,0) as needs_review_total,
  coalesce(mr.missing_receipts_count,0) as missing_receipts_total,
  coalesce(ot.open_tasks_count,0) as open_tasks_total,
  jsonb_build_object('priority',1,'issue','Missing receipts','count',coalesce(mr.missing_receipts_count,0),'action','Upload receipts for flagged transactions') as item1,
  jsonb_build_object('priority',2,'issue','Needs review transactions','count',coalesce(l.needs_review_count,0),'action','Approve/correct categories in Needs Review queue') as item2,
  jsonb_build_object('priority',3,'issue','Open finance tasks','count',coalesce(ot.open_tasks_count,0),'action','Complete open tasks to stay tax-ready') as item3
from merchants m
left join last_30 l on l.merchant_id = m.id
left join missing_receipts mr on mr.merchant_id = m.id
left join open_tasks ot on ot.merchant_id = m.id;

-- 6-month trend view
create or replace view v_tax_ready_score_trend_6mo as
with months as (
  select
    (date_trunc('month', now()) - (n || ' month')::interval) as month_start
  from generate_series(0, 5) as n
),
merchant_months as (
  select
    m.id as merchant_id,
    extract(year from mo.month_start)::int as year,
    extract(month from mo.month_start)::int as month,
    mo.month_start::date as month_start
  from merchants m
  cross join months mo
)
select
  mm.merchant_id,
  mm.year,
  mm.month,
  tax_ready_score_month(mm.merchant_id, mm.year, mm.month) as score
from merchant_months mm
order by mm.merchant_id, mm.year, mm.month;
