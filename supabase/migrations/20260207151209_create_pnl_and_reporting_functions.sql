/*
  # P&L and Reporting Functions

  1. Helper Views
    - v_tx_with_category - Transactions with effective categories
    
  2. P&L Functions
    - pnl_monthly() - Line items by category
    - pnl_monthly_totals() - Revenue, COGS, Expenses, Net Income
    
  Note: Assumes Plaid sign convention (positive = outflow, negative = inflow)
*/

-- View: Transactions with effective category
create or replace view v_tx_with_category as
select
  t.id as transaction_id,
  t.merchant_id,
  t.date,
  t.name as vendor,
  t.amount,
  t.iso_currency_code,
  coalesce(tc.approved, false) as approved,
  tc.confidence,
  coa.id as coa_id,
  coa.name as coa_name,
  coa.type as coa_type
from transactions t
left join transaction_categorizations tc on tc.transaction_id = t.id
left join chart_of_accounts coa on coa.id = tc.coa_id;

-- P&L by month (line items)
create or replace function pnl_monthly(
  p_merchant_id uuid,
  p_year int,
  p_month int
)
returns table (
  category text,
  category_type text,
  total numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with month_tx as (
    select *
    from v_tx_with_category
    where merchant_id = p_merchant_id
      and date >= make_date(p_year, p_month, 1)
      and date < (make_date(p_year, p_month, 1) + interval '1 month')
      and coa_type in ('income','expense','cogs')
  ),
  sums as (
    select
      coa_name as category,
      coa_type as category_type,
      sum(amount) as raw_total
    from month_tx
    where coa_name is not null
    group by 1,2
  )
  select
    category,
    category_type,
    case
      when category_type = 'income' then (raw_total * -1)
      else raw_total
    end as total
  from sums
  order by category_type, category;
$$;

-- P&L totals by month
create or replace function pnl_monthly_totals(
  p_merchant_id uuid,
  p_year int,
  p_month int
)
returns table (
  revenue numeric,
  cogs numeric,
  expenses numeric,
  net_income numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with lines as (
    select * from pnl_monthly(p_merchant_id, p_year, p_month)
  ),
  agg as (
    select
      sum(case when category_type='income' then total else 0 end) as revenue,
      sum(case when category_type='cogs' then total else 0 end) as cogs,
      sum(case when category_type='expense' then total else 0 end) as expenses
    from lines
  )
  select
    revenue,
    cogs,
    expenses,
    (revenue - cogs - expenses) as net_income
  from agg;
$$;
