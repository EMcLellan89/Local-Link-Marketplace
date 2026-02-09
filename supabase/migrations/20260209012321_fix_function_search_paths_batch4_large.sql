/*
  # Fix Function Search Paths - Batch 4 (Large)
  
  Fixes a large batch of SECURITY DEFINER functions with mutable search_path.
  
  ## Security Impact
  - Prevents privilege escalation attacks
  - Sets search_path to empty string for all functions
*/

ALTER FUNCTION get_or_create_tracking_link(p_partner_id uuid, p_product_slug text) SET search_path = '';
ALTER FUNCTION get_partner_accounting_tier(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_commission_rate_bps(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_commission_summary(partner_user_id uuid, start_date date, end_date date) SET search_path = '';
ALTER FUNCTION get_partner_commission_summary(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_external_sales_stats(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_onboarding_completion(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_profit_network_summary(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_profit_network_weekly_summary(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_progress_summary(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_quarterly_revenue(p_partner_id uuid, p_quarter text) SET search_path = '';
ALTER FUNCTION get_partner_subscription_fee_usd(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION get_partner_tier(partner_uuid uuid) SET search_path = '';
ALTER FUNCTION get_partner_totals_stats() SET search_path = '';
ALTER FUNCTION get_partners_joined_by_month() SET search_path = '';
ALTER FUNCTION get_pending_commissions_by_partner() SET search_path = '';
ALTER FUNCTION get_pending_partner_payouts() SET search_path = '';
ALTER FUNCTION get_platform_sales_stats() SET search_path = '';
ALTER FUNCTION get_platform_vapi_credentials() SET search_path = '';
ALTER FUNCTION get_revenue_by_month() SET search_path = '';
ALTER FUNCTION get_segment_customers(segment_id_param uuid) SET search_path = '';
ALTER FUNCTION get_tax_destinations_summary() SET search_path = '';
ALTER FUNCTION get_team_dashboard_stats(p_team_member_id uuid) SET search_path = '';
ALTER FUNCTION get_team_dashboard_stats_admin() SET search_path = '';
ALTER FUNCTION get_team_member_id(p_user_id uuid) SET search_path = '';
ALTER FUNCTION get_team_member_stats(p_team_member_id uuid) SET search_path = '';
ALTER FUNCTION get_user_blog_course_tier(user_uuid uuid) SET search_path = '';
ALTER FUNCTION get_user_profile(user_id uuid) SET search_path = '';
ALTER FUNCTION grant_course_access_from_order() SET search_path = '';
ALTER FUNCTION handle_lesson_completion_nudge() SET search_path = '';
ALTER FUNCTION handle_new_user() SET search_path = '';
ALTER FUNCTION handle_srr_exam_pass() SET search_path = '';
ALTER FUNCTION has_active_pro_subscription(p_user_id uuid) SET search_path = '';
ALTER FUNCTION has_enterprise_tier(partner_uuid uuid) SET search_path = '';
ALTER FUNCTION increment_blog_post_views(p_slug text) SET search_path = '';
ALTER FUNCTION increment_customer_ltv(p_customer_id uuid, p_amount numeric) SET search_path = '';
ALTER FUNCTION is_admin() SET search_path = '';
ALTER FUNCTION is_approved_partner(p_user_id uuid) SET search_path = '';
ALTER FUNCTION is_assigned_provider(m_id uuid) SET search_path = '';
ALTER FUNCTION is_locked_founders_tier(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION is_merchant_member(m_id uuid) SET search_path = '';
ALTER FUNCTION is_partner_crm_active(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION lock_partner_identity_fields() SET search_path = '';
ALTER FUNCTION log_customer_activity(p_customer_id uuid, p_business_unit_id uuid, p_activity_type text, p_activity_description text, p_performed_by uuid, p_metadata jsonb) SET search_path = '';
ALTER FUNCTION log_partner_activity(p_partner_id uuid, p_activity_type text, p_points integer) SET search_path = '';
ALTER FUNCTION log_vapi_tool_call(p_merchant_id uuid, p_call_id text, p_tool_name text, p_parameters jsonb, p_result jsonb) SET search_path = '';
ALTER FUNCTION next_partner_referral_id() SET search_path = '';
ALTER FUNCTION partner_has_active_crm_subscription(p_partner_id uuid) SET search_path = '';
ALTER FUNCTION partner_has_badge(p_partner_id uuid, p_badge_slug text) SET search_path = '';
ALTER FUNCTION partner_has_certification(p_partner_id uuid, p_cert_slug text) SET search_path = '';
ALTER FUNCTION pnl_monthly(p_merchant_id uuid, p_year integer, p_month integer) SET search_path = '';
ALTER FUNCTION pnl_monthly_totals(p_merchant_id uuid, p_year integer, p_month integer) SET search_path = '';
ALTER FUNCTION process_affiliate_payout(p_commission_ids uuid[], p_payout_method text, p_transaction_id text, p_notes text) SET search_path = '';
ALTER FUNCTION process_commission_payouts() SET search_path = '';
ALTER FUNCTION process_daily_commission_payouts() SET search_path = '';
ALTER FUNCTION process_external_sale(p_external_system_id uuid, p_external_order_id text, p_idempotency_key text, p_product_key text, p_product_name text, p_amount_cents integer, p_partner_ref_code text, p_customer_email text, p_customer_name text, p_metadata jsonb, p_raw_payload jsonb) SET search_path = '';
ALTER FUNCTION process_partner_commission_payout(p_commission_ids uuid[], p_payout_method text, p_transaction_id text, p_notes text) SET search_path = '';
ALTER FUNCTION process_profit_network_commission_payout(p_sale_id uuid) SET search_path = '';
ALTER FUNCTION process_weekly_partner_payouts(p_week_ending_date date) SET search_path = '';
ALTER FUNCTION project_next_week_deductions(p_enrollment_id uuid) SET search_path = '';
