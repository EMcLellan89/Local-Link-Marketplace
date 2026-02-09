/*
  # Drop Unused Indexes - Final Batch 8 (Marketing and Marketplace)

  This migration removes unused indexes from marketing and marketplace tables.

  Tables covered:
  - marketing_campaigns
  - marketing_email_campaigns
  - marketplace_affiliate_commissions
  - marketplace_affiliate_payouts
  - marketplace_affiliate_product_assets
  - marketplace_affiliate_referrals
  - marketplace_affiliate_subscription_locks
  - merchant_addon_subscriptions
  - merchant_application_equipment
  - merchant_orders
  - merchant_services_applications
  - merchant_subscriptions
  - merchants
*/

-- Marketing Tables
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_business_unit_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_segment_id;

-- Marketplace Affiliate Tables
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_referral_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_product_assets_product_sku;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affili;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_commission_id;

-- Merchant Tables
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;