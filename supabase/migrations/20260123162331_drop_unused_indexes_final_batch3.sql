/*
  # Drop Unused Indexes - Final Batch 3 (Admin, Affiliate, AI, Appointments)

  This migration removes unused indexes from admin, affiliate, AI, and appointment tables.

  Tables covered:
  - admin_crm_activities
  - admin_crm_contacts
  - admin_crm_list_members
  - admin_sessions
  - affiliate_clicks
  - affiliate_commissions
  - affiliate_partners
  - affiliate_payouts
  - affiliate_referrals
  - ai_package_items
  - appointment_setting_bookings
  - appointments
  - ai_assistant_conversations
  - audit_logs
  - badge_awards
  - batch_transactions
  - bi_competitor_tracking
  - bi_reports
  - budget_buster_subscriptions
  - budget_buster_usage_metrics
  - budget_buster_users
  - business_api_keys
  - business_capital_applications
  - business_coaching_bookings
*/

-- Admin CRM
DROP INDEX IF EXISTS idx_admin_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_project_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_list_members_company_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_contact_id;
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- Affiliate Tables
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- AI and Appointments
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;

-- Other Tables
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;
DROP INDEX IF EXISTS idx_batch_transactions_transaction_id;
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_order_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_user_id;
DROP INDEX IF EXISTS idx_budget_buster_users_subscription_id;
DROP INDEX IF EXISTS idx_business_api_keys_business_unit_id;
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
DROP INDEX IF EXISTS idx_business_coaching_bookings_package_id;