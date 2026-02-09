/*
  # Drop Unused Indexes - Batch 2 (Admin to Customer tables)
  
  1. Changes
    - Drop unused indexes on admin, AI, appointments, audit, badges, BI, business, and customer tables
    
  2. Indexes Dropped
    - admin_sessions, ai_*, appointment_*, audit_logs, badge_awards
    - batch_transactions, bi_*, business_*, campaign_*, cart_*, certificates_*
    - commission_*, community_*, course_*, credit_ledger, crm_*
    - customer_* tables
*/

DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;
DROP INDEX IF EXISTS idx_batch_transactions_transaction_id;
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;
DROP INDEX IF EXISTS idx_business_api_keys_business_unit_id;
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_certificates_issued_user_id;
DROP INDEX IF EXISTS idx_commissions_order_id;
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;
DROP INDEX IF EXISTS idx_credit_ledger_user_id;
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;
DROP INDEX IF EXISTS idx_customer_activity_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_activity_log_customer_id;
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;
DROP INDEX IF EXISTS idx_customer_business_relationships_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_created_by;
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_customer_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_team_member_id;
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_customer_support_tickets_business_unit_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_customer_id;
