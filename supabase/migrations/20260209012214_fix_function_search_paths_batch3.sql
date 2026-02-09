/*
  # Fix Function Search Paths - Batch 3
  
  Continues fixing functions with mutable search_path.
  
  ## Functions Fixed (Batch 3)
  - More SECURITY DEFINER functions
  - Sets search_path to empty string
  
  ## Security Impact
  - Prevents privilege escalation attacks
*/

ALTER FUNCTION create_nudge(p_user_id uuid, p_title text, p_message text, p_cta_text text, p_cta_action jsonb) SET search_path = '';
ALTER FUNCTION create_nudge(p_user_id uuid, p_key text, p_title text, p_body text, p_cta_label text, p_cta_url text, p_priority integer) SET search_path = '';
ALTER FUNCTION create_quarterly_tax_estimates(p_partner_id uuid, p_year integer) SET search_path = '';
ALTER FUNCTION creator_has_signed_agreement(p_creator_id uuid) SET search_path = '';
ALTER FUNCTION deduct_communications_usage(p_merchant_id uuid, p_transaction_type text, p_amount_cents integer, p_description text, p_call_log_id uuid, p_sms_log_id uuid) SET search_path = '';
ALTER FUNCTION deliver_swipe_assets_to_partner(p_partner_id uuid, p_product_sku text) SET search_path = '';
ALTER FUNCTION detect_inactive_srr_enrollments() SET search_path = '';
ALTER FUNCTION dev_complete_course(p_user_id uuid, p_course_slug text) SET search_path = '';
ALTER FUNCTION dev_complete_lesson(p_user_id uuid, p_lesson_slug text, p_course_slug text) SET search_path = '';
ALTER FUNCTION dev_enroll_course(p_user_id uuid, p_course_slug text) SET search_path = '';
ALTER FUNCTION dev_grant_certification(p_user_id uuid, p_course_slug text) SET search_path = '';
ALTER FUNCTION dev_pass_quiz(p_user_id uuid, p_module_id uuid, p_course_id uuid) SET search_path = '';
ALTER FUNCTION dev_reset_course_progress(p_user_id uuid, p_course_slug text) SET search_path = '';
ALTER FUNCTION enroll_in_profit_network(p_partner_id uuid, p_business_id uuid) SET search_path = '';
ALTER FUNCTION find_or_create_unified_customer(p_email text, p_full_name text, p_business_unit_id uuid, p_customer_type text, p_metadata jsonb) SET search_path = '';
ALTER FUNCTION generate_api_key() SET search_path = '';
ALTER FUNCTION generate_api_secret() SET search_path = '';
ALTER FUNCTION generate_lead_csv_export(p_merchant_id uuid, p_target_crm crm_system_type, p_start_date timestamp with time zone, p_end_date timestamp with time zone) SET search_path = '';
ALTER FUNCTION generate_ll_crm_invoice_number(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION generate_partner_referral_code() SET search_path = '';
ALTER FUNCTION generate_profit_network_link_code(p_partner_id uuid, p_business_id uuid) SET search_path = '';
ALTER FUNCTION generate_system_id() SET search_path = '';
ALTER FUNCTION generate_ticket_number() SET search_path = '';
ALTER FUNCTION get_accounting_dashboard_stats() SET search_path = '';
ALTER FUNCTION get_admin_crm_dashboard_stats() SET search_path = '';
ALTER FUNCTION get_allowed_tier_changes(current_tier_name text) SET search_path = '';
ALTER FUNCTION get_budget_buster_margins_by_mode() SET search_path = '';
ALTER FUNCTION get_budget_buster_mrr_by_mode() SET search_path = '';
ALTER FUNCTION get_combined_overview_stats() SET search_path = '';
ALTER FUNCTION get_commission_payout_stats() SET search_path = '';
ALTER FUNCTION get_commission_rate_for_sale(p_partner_id uuid, p_sale_type text, p_item_id uuid) SET search_path = '';
ALTER FUNCTION get_commissionable_products() SET search_path = '';
ALTER FUNCTION get_communications_usage_summary(p_subscription_id uuid, p_period_start timestamp with time zone, p_period_end timestamp with time zone) SET search_path = '';
ALTER FUNCTION get_eligible_partners_for_payout() SET search_path = '';
ALTER FUNCTION get_enrollment_commission_statement(p_enrollment_id uuid, p_start_date date, p_end_date date) SET search_path = '';
ALTER FUNCTION get_enrollment_payback_status(p_enrollment_id uuid) SET search_path = '';
ALTER FUNCTION get_ll_crm_contact_details(contact_id_input uuid) SET search_path = '';
ALTER FUNCTION get_ll_crm_dashboard_stats(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION get_ll_crm_pipeline_summary(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION get_ll_crm_recent_activities(merchant_id_input uuid, limit_count integer) SET search_path = '';
ALTER FUNCTION get_ll_crm_subscription_status(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION get_manager_team_stats(p_manager_id uuid) SET search_path = '';
ALTER FUNCTION get_merchant_active_assistant(p_merchant_id uuid) SET search_path = '';
ALTER FUNCTION get_merchant_crm_tier(merchant_id_input uuid) SET search_path = '';
ALTER FUNCTION get_multi_business_accounting(p_start_date date, p_end_date date) SET search_path = '';
ALTER FUNCTION get_my_credit_balance() SET search_path = '';
ALTER FUNCTION get_next_partner_id_num() SET search_path = '';
ALTER FUNCTION get_or_create_short_link(p_merchant_id uuid, p_destination_url text) SET search_path = '';
