/*
  # Fix Function Search Paths - Batch 1
  
  This migration fixes functions with SECURITY DEFINER that have mutable search_path.
  A mutable search_path in SECURITY DEFINER functions is a security risk as it can
  allow privilege escalation attacks.
  
  ## Functions Fixed
  - Set search_path to empty string for all SECURITY DEFINER functions
  - This forces functions to use fully qualified names (schema.table)
  
  ## Security Impact
  - Prevents privilege escalation attacks
  - Makes functions more explicit and maintainable
*/

-- Fix search_path for functions (Batch 1)
ALTER FUNCTION activate_crm_trial_for_merchant(uuid) SET search_path = '';
ALTER FUNCTION admin_affiliate_payout_candidates(integer) SET search_path = '';
ALTER FUNCTION admin_generate_quarterly_bonuses(text) SET search_path = '';
ALTER FUNCTION admin_quarter_revenue_summary(text) SET search_path = '';
ALTER FUNCTION ai_emit_event(text, text, uuid, uuid, jsonb) SET search_path = '';
ALTER FUNCTION ai_route_event_to_jobs() SET search_path = '';
ALTER FUNCTION approve_affiliate_commissions(uuid[]) SET search_path = '';
ALTER FUNCTION auto_create_lead_from_purchase() SET search_path = '';
ALTER FUNCTION auto_deliver_swipes_on_partner_activation() SET search_path = '';
ALTER FUNCTION auto_deliver_swipes_on_partner_approval() SET search_path = '';
ALTER FUNCTION auto_generate_merchant_system_id() SET search_path = '';
ALTER FUNCTION auto_generate_partner_system_id() SET search_path = '';
ALTER FUNCTION automated_daily_commission_payout() SET search_path = '';
ALTER FUNCTION award_affiliate_points(uuid, integer, text) SET search_path = '';
ALTER FUNCTION calculate_affiliate_stats(uuid) SET search_path = '';
ALTER FUNCTION calculate_budget_buster_commission(uuid, timestamptz, timestamptz) SET search_path = '';
ALTER FUNCTION calculate_commission_for_sale(uuid, uuid, integer, integer) SET search_path = '';
ALTER FUNCTION calculate_communications_monthly_cost(uuid, timestamptz, timestamptz) SET search_path = '';
ALTER FUNCTION calculate_deal_commission(uuid) SET search_path = '';
ALTER FUNCTION calculate_deal_performance(uuid) SET search_path = '';
