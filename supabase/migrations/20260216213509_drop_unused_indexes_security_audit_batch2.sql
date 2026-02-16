/*
  # Security Audit - Drop Unused Indexes (Batch 2)

  Continues dropping unused indexes from security audit.
  This batch covers admin, affiliate, AI, appointment, badge, and other tables.
*/

-- Admin CRM tables
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_project_id;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_company_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_project_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_companies_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_contacts_admin_company_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_goals_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_company_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_list_id;
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- Affiliate tables
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- AI tables
DROP INDEX IF EXISTS idx_ai_package_items_package_addon_id;
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_product_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_bot_setups_merchant_id;
DROP INDEX IF EXISTS idx_ai_runs_job_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_bot_profile_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_tool_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_user_id;

-- Appointment tables
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;

-- Badge tables
DROP INDEX IF EXISTS idx_badge_rules_badge_slug;
DROP INDEX IF EXISTS idx_badge_audit_log_badge_id;
DROP INDEX IF EXISTS idx_badge_audit_log_partner_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;

-- Bank tables
DROP INDEX IF EXISTS idx_bank_accounts_connection_id;
DROP INDEX IF EXISTS idx_bank_accounts_merchant_id;
DROP INDEX IF EXISTS idx_bank_connections_merchant_id;

-- BI tables
DROP INDEX IF EXISTS idx_bi_metrics_merchant_id;
DROP INDEX IF EXISTS idx_bi_predictions_merchant_id;
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;

-- Blog tables
DROP INDEX IF EXISTS idx_blog_post_tags_post_id;
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;

-- Bot tables
DROP INDEX IF EXISTS idx_bot_channels_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_knowledge_source_id;
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_tool_permissions_tool_id;
DROP INDEX IF EXISTS idx_bot_runs_profile_id;
DROP INDEX IF EXISTS idx_bot_conversations_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_conversations_user_id;
DROP INDEX IF EXISTS idx_bot_deployments_bot_profile_id;

-- Budget Buster tables
DROP INDEX IF EXISTS idx_budget_buster_debt_settings_user_id;
DROP INDEX IF EXISTS idx_budget_buster_momentum_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_account_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_user_id;
DROP INDEX IF EXISTS idx_budget_buster_accounts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_ai_insights_user_id;
DROP INDEX IF EXISTS idx_budget_buster_bills_user_id;
DROP INDEX IF EXISTS idx_budget_buster_debts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_mode_switches_user_id;
DROP INDEX IF EXISTS idx_budget_buster_mode_switches_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_savings_goals_user_id;
DROP INDEX IF EXISTS idx_budget_buster_users_profile_id;
DROP INDEX IF EXISTS idx_budget_buster_users_referred_by_partner_id;
DROP INDEX IF EXISTS idx_budget_buster_users_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_order_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_user_id;

-- Business tables
DROP INDEX IF EXISTS idx_bundle_items_bundle_id;
DROP INDEX IF EXISTS idx_bundle_items_deal_id;
DROP INDEX IF EXISTS idx_business_ad_campaigns_business_id;
DROP INDEX IF EXISTS idx_business_api_keys_business_unit_id;
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
DROP INDEX IF EXISTS idx_business_deals_vendor_id;
DROP INDEX IF EXISTS idx_business_coaching_bookings_package_id;
DROP INDEX IF EXISTS idx_business_coaching_sessions_booking_id;
