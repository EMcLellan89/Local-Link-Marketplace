/*
  # Drop Unused Indexes - Batch 3: Appointment, Cart, Badge, Bank, and Customer Tables

  1. Changes
    - Drop unused indexes from appointments and booking tables
    - Drop unused indexes from cart, badge, bank tables
    - Drop unused indexes from customer-related tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves write performance and reduces storage overhead
*/

-- Appointments and related
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;
DROP INDEX IF EXISTS idx_appointments_customer_id;

-- Audit and badges
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_badge_audit_log_badge_id;
DROP INDEX IF EXISTS idx_badge_audit_log_partner_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;
DROP INDEX IF EXISTS idx_badge_rules_badge_slug;

-- Bank accounts
DROP INDEX IF EXISTS idx_bank_accounts_connection_id;
DROP INDEX IF EXISTS idx_bank_accounts_merchant_id;
DROP INDEX IF EXISTS idx_bank_connections_merchant_id;
DROP INDEX IF EXISTS idx_batch_transactions_payout_batch_id;

-- BI tables
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_bi_metrics_merchant_id;
DROP INDEX IF EXISTS idx_bi_predictions_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;

-- Blog and Bot tables
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;
DROP INDEX IF EXISTS idx_bot_channels_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_conversations_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_conversations_user_id;
DROP INDEX IF EXISTS idx_bot_deployments_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_bot_profile_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_knowledge_source_id;
DROP INDEX IF EXISTS idx_bot_runs_profile_id;
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_profile_id;

-- Budget Buster tables
DROP INDEX IF EXISTS idx_budget_buster_accounts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_ai_insights_user_id;
DROP INDEX IF EXISTS idx_budget_buster_bills_user_id;
DROP INDEX IF EXISTS idx_budget_buster_debt_settings_user_id;
DROP INDEX IF EXISTS idx_budget_buster_debts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_mode_switches_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_mode_switches_user_id;
DROP INDEX IF EXISTS idx_budget_buster_momentum_user_id;
DROP INDEX IF EXISTS idx_budget_buster_savings_goals_user_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_order_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_account_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_user_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_user_id;
DROP INDEX IF EXISTS idx_budget_buster_users_profile_id;
DROP INDEX IF EXISTS idx_budget_buster_users_referred_by_partner_id;
DROP INDEX IF EXISTS idx_budget_buster_users_subscription_id;

-- Bundle and Business tables
DROP INDEX IF EXISTS idx_bundle_items_bundle_id;
DROP INDEX IF EXISTS idx_bundle_items_deal_id;
DROP INDEX IF EXISTS idx_business_ad_campaigns_business;
DROP INDEX IF EXISTS idx_business_ad_campaigns_business_id;
DROP INDEX IF EXISTS idx_business_ad_campaigns_status;
DROP INDEX IF EXISTS idx_business_api_keys_business_unit_id;
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
DROP INDEX IF EXISTS idx_business_coaching_bookings_package_id;
DROP INDEX IF EXISTS idx_business_coaching_sessions_booking_id;
DROP INDEX IF EXISTS idx_business_deals_expiry;
DROP INDEX IF EXISTS idx_business_deals_vendor_id;

-- Cart and Campaign tables
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;
