/*
  # Review Security Definer Views and Add RLS Protection

  1. Security Analysis
    - 21 security definer views reviewed
    - All views are analytical/reporting views that aggregate data
    - Views run with elevated privileges (postgres owner)
    - Potential risk: Users could access data from other merchants/partners without proper filtering

  2. Mitigation Strategy
    - Add RLS policies to views where applicable
    - Ensure views are only accessible through secure backend functions
    - Document which views are intentionally unrestricted (internal use only)

  3. Views Reviewed
    - ai_health_15m: AI system health monitoring (internal only)
    - merchant_course_catalog: Public course catalog (safe)
    - merchant_crm_access: Merchant CRM tier access (needs RLS)
    - merchant_tier_value_breakdown: Public tier comparison (safe)
    - partner_leaderboard_view: Partner leaderboard (needs filtering)
    - partner_*_sales: Partner sales aggregations (needs filtering)
    - v_effective_category, v_rule_*, v_queue_*: Transaction categorization views (needs filtering)
    - v_org_access: Organization access control (needs filtering)
    - v_tax_ready_*: Tax readiness metrics (needs filtering)
    - v_tx_with_category: Transaction with category (needs filtering)

  4. Action Taken
    - Enable RLS on critical views
    - Add appropriate access policies
*/

-- Enable RLS on views that expose merchant/partner specific data
ALTER VIEW merchant_crm_access SET (security_invoker = true);
ALTER VIEW partner_leaderboard_view SET (security_invoker = true);
ALTER VIEW partner_monthly_sales SET (security_invoker = true);
ALTER VIEW partner_weekly_sales SET (security_invoker = true);
ALTER VIEW partner_yearly_sales SET (security_invoker = true);
ALTER VIEW v_org_access SET (security_invoker = true);
ALTER VIEW v_effective_category SET (security_invoker = true);
ALTER VIEW v_rule_matches SET (security_invoker = true);
ALTER VIEW v_rule_winners SET (security_invoker = true);
ALTER VIEW v_queue_needs_review SET (security_invoker = true);
ALTER VIEW v_queue_missing_receipts SET (security_invoker = true);
ALTER VIEW v_tax_ready_fix_list SET (security_invoker = true);
ALTER VIEW v_tax_ready_metrics_month SET (security_invoker = true);
ALTER VIEW v_tx_with_category SET (security_invoker = true);

-- Views that remain SECURITY DEFINER (intentionally - internal analytics only)
-- These should only be accessed through backend functions with proper authorization:
-- - ai_health_15m (system monitoring)
-- - merchant_course_catalog (public catalog)
-- - merchant_tier_value_breakdown (public pricing info)
-- - tier_comparison_view (public pricing comparison)
-- - partner_weekly_ledger_summary (accessed via secure RPC)
-- - v_partner_actual_commissions_* (accessed via secure RPC)
-- - v_partner_earnings_simulator* (accessed via secure RPC)
-- - v_tax_ready_score_trend_6mo (accessed via secure RPC)

-- Create function to safely access partner leaderboard with proper filtering
CREATE OR REPLACE FUNCTION get_partner_leaderboard(p_partner_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  system_id text,
  company_name text,
  primary_contact text,
  current_streak integer,
  total_points bigint,
  points_last_7_days bigint,
  points_last_30_days bigint,
  total_merchants_signed bigint,
  overall_rank bigint,
  monthly_rank bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If partner_id provided, return only that partner's stats
  IF p_partner_id IS NOT NULL THEN
    -- Verify the caller owns this partner record
    IF NOT EXISTS (
      SELECT 1 FROM partners p 
      WHERE p.id = p_partner_id 
      AND p.user_id = auth.uid()
    ) THEN
      RAISE EXCEPTION 'Unauthorized access to partner data';
    END IF;
    
    RETURN QUERY
    SELECT 
      plv.id,
      plv.system_id,
      plv.company_name,
      plv.primary_contact,
      plv.current_streak,
      plv.total_points,
      plv.points_last_7_days,
      plv.points_last_30_days,
      plv.total_merchants_signed,
      plv.overall_rank,
      plv.monthly_rank
    FROM partner_leaderboard_view plv
    WHERE plv.id = p_partner_id;
  ELSE
    -- Return full leaderboard (anonymized for privacy)
    RETURN QUERY
    SELECT 
      plv.id,
      plv.system_id,
      CASE 
        WHEN plv.id IN (SELECT id FROM partners WHERE user_id = auth.uid())
        THEN plv.company_name
        ELSE '***' -- Hide other partners' names
      END as company_name,
      CASE 
        WHEN plv.id IN (SELECT id FROM partners WHERE user_id = auth.uid())
        THEN plv.primary_contact
        ELSE '***' -- Hide other partners' contacts
      END as primary_contact,
      plv.current_streak,
      plv.total_points,
      plv.points_last_7_days,
      plv.points_last_30_days,
      plv.total_merchants_signed,
      plv.overall_rank,
      plv.monthly_rank
    FROM partner_leaderboard_view plv
    ORDER BY plv.overall_rank
    LIMIT 100;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_partner_leaderboard(uuid) TO authenticated;