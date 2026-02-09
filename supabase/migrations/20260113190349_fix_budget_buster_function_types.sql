/*
  # Fix Budget Buster Function Return Types
  
  Fixes type mismatches in the analytics functions by ensuring
  all numeric columns are properly cast to NUMERIC type.
*/

DROP FUNCTION IF EXISTS get_budget_buster_mrr_by_mode();
DROP FUNCTION IF EXISTS get_budget_buster_margins_by_mode();

CREATE OR REPLACE FUNCTION get_budget_buster_mrr_by_mode()
RETURNS TABLE (
  mode TEXT,
  billing_cycle TEXT,
  active_subs BIGINT,
  mrr_cents BIGINT,
  avg_price_cents NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.mode,
    s.billing_cycle,
    COUNT(*) as active_subs,
    SUM(
      CASE 
        WHEN s.billing_cycle = 'monthly' THEN s.actual_price_cents
        WHEN s.billing_cycle = 'annual' THEN s.actual_price_cents / 12
        ELSE 0
      END
    )::BIGINT as mrr_cents,
    AVG(s.actual_price_cents)::NUMERIC as avg_price_cents
  FROM budget_buster_subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.mode, s.billing_cycle;
END;
$$;

CREATE OR REPLACE FUNCTION get_budget_buster_margins_by_mode()
RETURNS TABLE (
  mode TEXT,
  total_revenue_cents BIGINT,
  total_cost_cents BIGINT,
  gross_profit_cents BIGINT,
  gross_margin_percent NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.mode,
    SUM(s.actual_price_cents)::BIGINT as total_revenue_cents,
    SUM(s.estimated_monthly_cost_cents)::BIGINT as total_cost_cents,
    SUM(s.actual_price_cents - s.estimated_monthly_cost_cents)::BIGINT as gross_profit_cents,
    CASE 
      WHEN SUM(s.actual_price_cents) > 0 THEN
        (SUM(s.actual_price_cents - s.estimated_monthly_cost_cents)::NUMERIC / SUM(s.actual_price_cents)::NUMERIC) * 100
      ELSE 0
    END as gross_margin_percent
  FROM budget_buster_subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.mode;
END;
$$;
