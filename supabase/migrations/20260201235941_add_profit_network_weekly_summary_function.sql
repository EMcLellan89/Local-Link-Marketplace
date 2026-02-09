/*
  # Add weekly summary function for Profit Network

  1. New Functions
    - `get_partner_profit_network_weekly_summary()` - Returns weekly commission summary for a partner
*/

CREATE OR REPLACE FUNCTION get_partner_profit_network_weekly_summary(
  p_partner_id uuid
)
RETURNS TABLE (
  week_start date,
  week_end date,
  total_sales bigint,
  gross_commission_cents bigint,
  total_deductions_cents bigint,
  net_commission_cents bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH weekly_data AS (
    SELECT
      DATE_TRUNC('week', sale_date)::date AS week_start,
      DATE_TRUNC('week', sale_date)::date + INTERVAL '6 days' AS week_end,
      COUNT(*) AS total_sales,
      SUM(commission_amount_cents) AS gross_commission_cents,
      SUM(total_deductions_cents) AS total_deductions_cents,
      SUM(net_commission_cents) AS net_commission_cents
    FROM profit_network_sales
    WHERE partner_id = p_partner_id
    AND sale_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY DATE_TRUNC('week', sale_date)
    ORDER BY DATE_TRUNC('week', sale_date) DESC
  )
  SELECT
    wd.week_start::date,
    wd.week_end::date,
    wd.total_sales,
    wd.gross_commission_cents,
    wd.total_deductions_cents,
    wd.net_commission_cents
  FROM weekly_data wd;
END;
$$;
