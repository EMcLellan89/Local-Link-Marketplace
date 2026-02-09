/*
  # Add All Foreign Key Indexes - Batch 6 (Marketplace, Merchant)
  
  1. Foreign Key Indexes for:
    - Marketplace affiliate, Merchant tables
*/

-- marketplace_affiliate_commissions
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_affiliate_id 
  ON marketplace_affiliate_commissions(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id 
  ON marketplace_affiliate_commissions(referral_id);

-- marketplace_affiliate_payouts
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_affiliate_id 
  ON marketplace_affiliate_payouts(marketplace_affiliate_id);

-- marketplace_affiliate_product_assets
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_product_assets_product_sku 
  ON marketplace_affiliate_product_assets(product_sku);

-- marketplace_affiliate_referrals
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_affiliate_id 
  ON marketplace_affiliate_referrals(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id 
  ON marketplace_affiliate_referrals(referred_user_id);

-- marketplace_affiliate_subscription_locks
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_affiliate_id 
  ON marketplace_affiliate_subscription_locks(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id 
  ON marketplace_affiliate_subscription_locks(commission_id);

-- merchant_addon_subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id 
  ON merchant_addon_subscriptions(addon_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id 
  ON merchant_addon_subscriptions(merchant_id);

-- merchant_application_equipment
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id 
  ON merchant_application_equipment(application_id);

-- merchant_orders
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id 
  ON merchant_orders(merchant_id);

-- merchant_services_applications
CREATE INDEX IF NOT EXISTS idx_merchant_services_applications_merchant_id 
  ON merchant_services_applications(merchant_id);

-- merchant_subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id 
  ON merchant_subscriptions(tier_id);

-- merchants
CREATE INDEX IF NOT EXISTS idx_merchants_category_id 
  ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id 
  ON merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
  ON merchants(partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_territory_id 
  ON merchants(territory_id);
