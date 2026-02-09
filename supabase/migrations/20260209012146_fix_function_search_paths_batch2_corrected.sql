/*
  # Fix Function Search Paths - Batch 2 (Corrected)
  
  Continues fixing functions with mutable search_path.
  
  ## Functions Fixed (Batch 2)
  - Additional SECURITY DEFINER functions
  - Sets search_path to empty string
  
  ## Security Impact
  - Prevents privilege escalation attacks
*/

-- Fix search_path for functions (Batch 2)
ALTER FUNCTION calculate_partner_commission(uuid, text, boolean) SET search_path = '';
ALTER FUNCTION calculate_partner_weekly_payout(uuid, date, integer) SET search_path = '';
ALTER FUNCTION calculate_profit_network_net_payout(uuid, bigint, date, date) SET search_path = '';
ALTER FUNCTION calculate_profit_network_weekly_deductions(uuid, date, date) SET search_path = '';
ALTER FUNCTION calculate_quarterly_taxes(integer, integer) SET search_path = '';
ALTER FUNCTION calculate_revenue_share(uuid, text) SET search_path = '';
ALTER FUNCTION calculate_weekly_winners(text, text, date) SET search_path = '';
ALTER FUNCTION can_merchant_upgrade_to_tier(uuid, text) SET search_path = '';
ALTER FUNCTION can_use_ll_crm_ai_feature(uuid, text) SET search_path = '';
ALTER FUNCTION cancel_affiliate_commission(uuid, text) SET search_path = '';
ALTER FUNCTION check_and_award_badges(uuid) SET search_path = '';
ALTER FUNCTION check_crm_feature_access(uuid, integer) SET search_path = '';
ALTER FUNCTION check_email_send_limit(uuid, integer) SET search_path = '';
ALTER FUNCTION check_inactive_streaks() SET search_path = '';
ALTER FUNCTION check_partner_payout_eligibility(uuid) SET search_path = '';
ALTER FUNCTION check_partner_white_label_access(uuid) SET search_path = '';
ALTER FUNCTION check_referral_completion() SET search_path = '';
ALTER FUNCTION check_webhook_duplicate() SET search_path = '';
ALTER FUNCTION check_white_label_tier() SET search_path = '';
ALTER FUNCTION cleanup_old_rate_limits() SET search_path = '';
ALTER FUNCTION complete_challenge_day(uuid, integer, text) SET search_path = '';
ALTER FUNCTION create_business_coaching_booking(text, uuid, uuid, integer, text) SET search_path = '';
ALTER FUNCTION create_coaching_commission(uuid, uuid, integer) SET search_path = '';
ALTER FUNCTION create_customer_for_profile() SET search_path = '';
ALTER FUNCTION create_customer_or_merchant_for_profile() SET search_path = '';
ALTER FUNCTION create_default_crm_preference() SET search_path = '';
