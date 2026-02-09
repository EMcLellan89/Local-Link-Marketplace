/*
  # Drop Unused Indexes - Batch 11: Merchant Tables

  1. Changes
    - Drop unused indexes from merchant_* tables
    - Drop unused indexes from milestone and monthly tables
    - Drop unused indexes from notification tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves write performance
*/

-- Merchant accounting
DROP INDEX IF EXISTS idx_merchant_accounting_lite_merchant_id;
DROP INDEX IF EXISTS idx_merchant_accounting_pro_merchant_id;

-- Merchant addons and applications
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;

-- Merchant campaigns and content
DROP INDEX IF EXISTS idx_merchant_campaign_installs_dfy_campaign_id;
DROP INDEX IF EXISTS idx_merchant_campaign_installs_org_id;
DROP INDEX IF EXISTS idx_merchant_comprehensive_stats_merchant_id;
DROP INDEX IF EXISTS idx_merchant_content_installs_dfy_content_item_id;
DROP INDEX IF EXISTS idx_merchant_content_installs_org_id;

-- Merchant members and orders
DROP INDEX IF EXISTS idx_merchant_members_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;

-- Merchant services and subscriptions
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;

-- Merchant team members
DROP INDEX IF EXISTS idx_merchant_team_members_merchant_id;
DROP INDEX IF EXISTS idx_merchant_team_members_user_id;

-- Merchants main table
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_referred_by_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;
DROP INDEX IF EXISTS idx_merchants_user_id;

-- Milestone and monthly
DROP INDEX IF EXISTS idx_milestone_badge_audit_log_badge_id;
DROP INDEX IF EXISTS idx_monthly_closes_merchant_id;
DROP INDEX IF EXISTS idx_monthly_closes_provider_id;

-- Notifications
DROP INDEX IF EXISTS idx_notification_preferences_customer_id;
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_notifications_merchant_id;
