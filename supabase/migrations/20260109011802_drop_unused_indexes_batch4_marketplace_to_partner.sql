/*
  # Drop Unused Indexes - Batch 4 (Marketplace to Partner tables)
  
  1. Changes
    - Drop unused indexes on marketplace_affiliate_*, merchant_*, notification, order, partner_* tables
*/

DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_referral_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_product_assets_product_sku;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_commission_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;
DROP INDEX IF EXISTS idx_partner_assets_partner_id;
DROP INDEX IF EXISTS idx_partner_bonuses_affiliate_id;
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_partners_user_id;
