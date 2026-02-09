/*
  # Fix Partner Earnings Views

  Remove FILTER syntax, use CASE instead
*/

-- Simulator view (per plan)
create or replace view v_partner_earnings_simulator as
select
  pes.partner_id,
  pes.plan_code,
  pp.name as plan_name,
  pes.client_count,
  pp.monthly_price,
  pp.commission_rate,
  (pes.client_count * pp.monthly_price * pp.commission_rate) as simulated_monthly_commission,
  (pes.client_count * pp.monthly_price * pp.commission_rate * 12) as simulated_annual_commission
from partner_earnings_simulator pes
join plan_pricing pp on pp.code = pes.plan_code
where pp.is_active = true;

-- Simulator totals
create or replace view v_partner_earnings_simulator_totals as
select
  partner_id,
  sum(simulated_monthly_commission) as simulated_monthly_total,
  sum(simulated_annual_commission) as simulated_annual_total
from v_partner_earnings_simulator
group by partner_id;

-- Actual commissions (last 12 months)
create or replace view v_partner_actual_commissions_12mo as
select
  partner_id,
  date_trunc('month', created_at)::date as month_start,
  sum(amount_cents)/100.0 as commission_amount
from commissions
where status in ('pending','approved','paid')
  and created_at >= (date_trunc('month', now()) - interval '11 months')
group by partner_id, date_trunc('month', created_at)
order by partner_id, month_start;

-- Actual commissions (this month vs last month)
create or replace view v_partner_actual_commissions_mom as
with m as (
  select
    partner_id,
    sum(case when created_at >= date_trunc('month', now()) then amount_cents else 0 end)/100.0 as this_month,
    sum(case 
      when created_at >= (date_trunc('month', now()) - interval '1 month')
        and created_at <  date_trunc('month', now())
      then amount_cents else 0 end)/100.0 as last_month
  from commissions
  where status in ('pending','approved','paid')
  group by partner_id
)
select
  partner_id,
  coalesce(this_month,0) as this_month,
  coalesce(last_month,0) as last_month,
  (coalesce(this_month,0) - coalesce(last_month,0)) as mom_delta
from m;
