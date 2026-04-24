/*
  # Fix Security Definer Views and Audit Log RLS

  ## Summary
  Recreates 11 views that were incorrectly created with SECURITY DEFINER property.
  Views should use SECURITY INVOKER (the default) so they run under the caller's
  permissions and respect RLS policies on the underlying tables.

  Also tightens the internal_audit_logs INSERT policy so employees can only
  insert rows attributed to themselves (replaces the always-true WITH CHECK).

  ## Changes

  ### Views recreated as SECURITY INVOKER (default):
  1. v_partner_earnings_simulator
  2. v_tax_ready_score_trend_6mo
  3. tier_comparison_view
  4. ai_health_15m
  5. merchant_crm_tiers_comparison
  6. v_partner_actual_commissions_12mo
  7. merchant_tier_value_breakdown
  8. v_partner_earnings_simulator_totals
  9. partner_job_board
  10. partner_weekly_ledger_summary
  11. v_partner_actual_commissions_mom

  ### RLS policy fixed:
  - internal_audit_logs: INSERT policy now requires actor_id = auth.uid()
    instead of WITH CHECK (true)
*/

-- ============================================================
-- Drop and recreate each view WITHOUT security_barrier / definer
-- ORDER matters: views that depend on other views go last
-- ============================================================

-- 1. ai_health_15m
DROP VIEW IF EXISTS public.ai_health_15m CASCADE;
CREATE VIEW public.ai_health_15m
  WITH (security_invoker = true)
AS
  WITH j AS (
    SELECT count(*) AS jobs_total,
      sum(CASE WHEN ai_runs.status = 'failed' THEN 1 ELSE 0 END) AS jobs_failed
    FROM ai_runs
    WHERE ai_runs.started_at >= (now() - '00:15:00'::interval)
  ), c AS (
    SELECT count(*) AS comm_total,
      sum(CASE WHEN comm_outbox.status = 'failed' THEN 1 ELSE 0 END) AS comm_failed
    FROM comm_outbox
    WHERE comm_outbox.created_at >= (now() - '00:15:00'::interval)
  )
  SELECT 15 AS window_minutes,
    now() AS ts,
    j.jobs_total,
    j.jobs_failed,
    CASE WHEN j.jobs_total = 0 THEN 0::numeric
         ELSE j.jobs_failed::numeric / j.jobs_total::numeric
    END AS jobs_fail_rate,
    c.comm_total,
    c.comm_failed,
    CASE WHEN c.comm_total = 0 THEN 0::numeric
         ELSE c.comm_failed::numeric / c.comm_total::numeric
    END AS comm_fail_rate
  FROM j, c;

-- 2. merchant_crm_tiers_comparison
DROP VIEW IF EXISTS public.merchant_crm_tiers_comparison CASCADE;
CREATE VIEW public.merchant_crm_tiers_comparison
  WITH (security_invoker = true)
AS
  SELECT name AS tier_name,
    tier_level,
    monthly_price,
    crm_tier,
    ((crm_features ->> 'max_contacts'))::integer AS max_contacts,
    (crm_features ->> 'books_tier') AS books_tier,
    ((crm_features ->> 'team_members'))::integer AS team_members,
    ((crm_features ->> 'ai_prompts'))::boolean AS ai_prompts,
    ((crm_features ->> 'automation'))::boolean AS automation,
    ((crm_features ->> 'api_access'))::boolean AS api_access,
    ((crm_features ->> 'white_label'))::boolean AS white_label
  FROM subscription_tiers
  WHERE is_active = true
  ORDER BY tier_level;

-- 3. merchant_tier_value_breakdown
DROP VIEW IF EXISTS public.merchant_tier_value_breakdown CASCADE;
CREATE VIEW public.merchant_tier_value_breakdown
  WITH (security_invoker = true)
AS
  SELECT st.name AS tier_name,
    st.tier_level,
    st.monthly_price,
    (((st.monthly_price * 12::numeric) * 0.9))::numeric(10,2) AS annual_price_estimate,
    lcp.tier_name AS included_crm,
    lcp.contact_limit AS crm_contacts,
    lcp.books_tier AS included_accounting,
    st.postcard_placement,
    st.features,
    CASE
      WHEN st.name = 'Founders'  THEN 'LOCKED RATE FOR LIFE'
      WHEN st.name = 'Standard'  THEN 'MOST POPULAR'
      WHEN st.name = 'Premium'   THEN 'BEST VALUE'
      ELSE NULL
    END AS badge,
    CASE
      WHEN st.name = 'Starter'   THEN 'Perfect for solo businesses just getting started'
      WHEN st.name = 'Founders'  THEN 'Lock in this rate forever - best for growing businesses'
      WHEN st.name = 'Standard'  THEN 'Complete suite for established businesses'
      WHEN st.name = 'Premium'   THEN 'Enterprise features with maximum visibility'
      ELSE NULL
    END AS marketing_message
  FROM subscription_tiers st
  LEFT JOIN subscription_crm_mapping scm ON scm.subscription_tier_name = st.name
  LEFT JOIN ll_crm_pricing_tiers lcp ON lcp.id = scm.crm_tier_id
  WHERE st.is_active = true
  ORDER BY st.tier_level;

-- 4. partner_job_board
DROP VIEW IF EXISTS public.partner_job_board CASCADE;
CREATE VIEW public.partner_job_board
  WITH (security_invoker = true)
AS
  SELECT j.id,
    j.service_type,
    j.title,
    j.description,
    j.requirements,
    j.status,
    j.budget,
    j.partner_payout_cents,
    j.due_date,
    j.created_at,
    j.merchant_id,
    j.selected_partner_id,
    m.business_name AS merchant_business_name,
    c.service_name,
    c.service_category,
    c.estimated_turnaround_days
  FROM dfy_jobs j
  LEFT JOIN merchants m ON j.merchant_id = m.id
  LEFT JOIN service_fulfillment_config c ON j.service_type = c.product_key
  WHERE j.status = ANY (ARRAY['open','assigned','in_progress','submitted'])
  ORDER BY j.created_at DESC;

-- 5. partner_weekly_ledger_summary
DROP VIEW IF EXISTS public.partner_weekly_ledger_summary CASCADE;
CREATE VIEW public.partner_weekly_ledger_summary
  WITH (security_invoker = true)
AS
  SELECT partner_id,
    week_start_date,
    week_number,
    sum(CASE WHEN entry_type = 'ad_spend'          THEN amount_cents ELSE 0 END) AS total_ad_spend_cents,
    sum(CASE WHEN entry_type = 'payback_deduction'  THEN abs(amount_cents) ELSE 0 END) AS total_payback_cents,
    sum(CASE WHEN entry_type = 'commission_earned'  THEN amount_cents ELSE 0 END) AS total_commissions_cents,
    sum(CASE WHEN entry_type = 'payout'             THEN amount_cents ELSE 0 END) AS total_payouts_cents,
    sum(amount_cents) AS net_week_cents,
    count(*) AS entry_count,
    max(balance_after_cents) AS ending_balance_cents
  FROM partner_ledger
  GROUP BY partner_id, week_start_date, week_number;

-- 6. tier_comparison_view
DROP VIEW IF EXISTS public.tier_comparison_view CASCADE;
CREATE VIEW public.tier_comparison_view
  WITH (security_invoker = true)
AS
  SELECT name,
    tier_level,
    monthly_price,
    (((monthly_price * 12::numeric) * 0.89))::numeric(10,2) AS annual_price,
    postcard_placement,
    features,
    description,
    CASE
      WHEN name = 'Starter'   THEN 'Best for getting started'
      WHEN name = 'Founders'  THEN 'Locked rate for early adopters'
      WHEN name = 'Standard'  THEN 'Most Popular'
      WHEN name = 'Premium'   THEN 'Maximum Visibility'
      ELSE NULL
    END AS badge_text
  FROM subscription_tiers
  WHERE is_active = true
  ORDER BY tier_level;

-- 7. v_partner_actual_commissions_12mo
DROP VIEW IF EXISTS public.v_partner_actual_commissions_12mo CASCADE;
CREATE VIEW public.v_partner_actual_commissions_12mo
  WITH (security_invoker = true)
AS
  SELECT partner_id,
    (date_trunc('month', created_at))::date AS month_start,
    (sum(amount_cents)::numeric / 100.0) AS commission_amount
  FROM commissions
  WHERE status = ANY (ARRAY['pending','approved','paid'])
    AND created_at >= (date_trunc('month', now()) - '11 mons'::interval)
  GROUP BY partner_id, date_trunc('month', created_at)
  ORDER BY partner_id, (date_trunc('month', created_at))::date;

-- 8. v_partner_actual_commissions_mom
DROP VIEW IF EXISTS public.v_partner_actual_commissions_mom CASCADE;
CREATE VIEW public.v_partner_actual_commissions_mom
  WITH (security_invoker = true)
AS
  WITH m AS (
    SELECT commissions.partner_id,
      (sum(CASE WHEN commissions.created_at >= date_trunc('month', now())
                THEN commissions.amount_cents ELSE 0 END)::numeric / 100.0) AS this_month,
      (sum(CASE WHEN commissions.created_at >= (date_trunc('month', now()) - '1 mon'::interval)
                 AND commissions.created_at < date_trunc('month', now())
                THEN commissions.amount_cents ELSE 0 END)::numeric / 100.0) AS last_month
    FROM commissions
    WHERE commissions.status = ANY (ARRAY['pending','approved','paid'])
    GROUP BY commissions.partner_id
  )
  SELECT partner_id,
    COALESCE(this_month, 0::numeric) AS this_month,
    COALESCE(last_month, 0::numeric) AS last_month,
    (COALESCE(this_month, 0::numeric) - COALESCE(last_month, 0::numeric)) AS mom_delta
  FROM m;

-- 9. v_partner_earnings_simulator
DROP VIEW IF EXISTS public.v_partner_earnings_simulator CASCADE;
CREATE VIEW public.v_partner_earnings_simulator
  WITH (security_invoker = true)
AS
  SELECT pes.partner_id,
    pes.plan_code,
    pp.name AS plan_name,
    pes.client_count,
    pp.monthly_price,
    pp.commission_rate,
    ((pes.client_count::numeric * pp.monthly_price) * pp.commission_rate) AS simulated_monthly_commission,
    (((pes.client_count::numeric * pp.monthly_price) * pp.commission_rate) * 12::numeric) AS simulated_annual_commission
  FROM partner_earnings_simulator pes
  JOIN plan_pricing pp ON pp.code = pes.plan_code
  WHERE pp.is_active = true;

-- 10. v_partner_earnings_simulator_totals (depends on v_partner_earnings_simulator)
DROP VIEW IF EXISTS public.v_partner_earnings_simulator_totals CASCADE;
CREATE VIEW public.v_partner_earnings_simulator_totals
  WITH (security_invoker = true)
AS
  SELECT partner_id,
    sum(simulated_monthly_commission) AS simulated_monthly_total,
    sum(simulated_annual_commission) AS simulated_annual_total
  FROM v_partner_earnings_simulator
  GROUP BY partner_id;

-- 11. v_tax_ready_score_trend_6mo
DROP VIEW IF EXISTS public.v_tax_ready_score_trend_6mo CASCADE;
CREATE VIEW public.v_tax_ready_score_trend_6mo
  WITH (security_invoker = true)
AS
  WITH months AS (
    SELECT (date_trunc('month', now()) - (n.n || ' month')::interval) AS month_start
    FROM generate_series(0, 5) n(n)
  ), merchant_months AS (
    SELECT m.id AS merchant_id,
      EXTRACT(year FROM mo.month_start)::integer AS year,
      EXTRACT(month FROM mo.month_start)::integer AS month,
      mo.month_start::date AS month_start
    FROM merchants m
    CROSS JOIN months mo
  )
  SELECT merchant_id,
    year,
    month,
    tax_ready_score_month(merchant_id, year, month) AS score
  FROM merchant_months mm
  ORDER BY merchant_id, year, month;

-- ============================================================
-- Fix internal_audit_logs INSERT policy (was always-true)
-- Employees may only insert rows where actor_id = their own uid
-- ============================================================

DROP POLICY IF EXISTS "Employee can insert audit log" ON public.internal_audit_logs;

CREATE POLICY "Authenticated users insert own audit log entries"
  ON public.internal_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    actor_id = (SELECT auth.uid())
  );
