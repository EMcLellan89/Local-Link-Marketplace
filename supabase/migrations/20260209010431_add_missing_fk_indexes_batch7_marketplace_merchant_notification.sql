/*
  # Add Missing Foreign Key Indexes - Batch 7
  
  1. Tables Covered
    - Marketplace tables (marketplace_abandoned_carts, marketplace_affiliate_*, marketplace_checkout_*, marketplace_commissions, marketplace_order_items, marketplace_orders, marketplace_product_prices, marketplace_subscriptions)
    - Merchant tables (merchant_accounting_*, merchant_ad_costs, merchant_addon_subscriptions, merchant_application_equipment, merchant_campaign_installs, merchant_comprehensive_stats, merchant_content_installs, merchant_crm_preferences, merchant_locations, merchant_members, merchant_orders, merchant_services_applications, merchant_settings, merchant_subscriptions, merchant_team_members, merchants)
    - Notification tables (notification_preferences, notifications)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for marketplace operations and merchant management
    - Critical for checkout flows, affiliate tracking, and merchant dashboards
    
  3. Security
    - No security changes, only performance optimization
*/

-- Marketplace tables
CREATE INDEX IF NOT EXISTS idx_marketplace_abandoned_carts_checkout_session_id ON marketplace_abandoned_carts(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_badges_marketplace_affiliate_id ON marketplace_affiliate_badges(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id ON marketplace_affiliate_commissions(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id ON marketplace_affiliate_commissions(referral_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id ON marketplace_affiliate_payouts(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_product_assets_product_sku ON marketplace_affiliate_product_assets(product_sku);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id ON marketplace_affiliate_referrals(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id ON marketplace_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id ON marketplace_affiliate_subscription_locks(commission_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affiliate_id ON marketplace_affiliate_subscription_locks(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_training_progress_marketplace_affiliate_id ON marketplace_affiliate_training_progress(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliates_user_id ON marketplace_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_order_bump_product_id ON marketplace_checkout_configs(order_bump_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_product_id ON marketplace_checkout_configs(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_upsell_product_id ON marketplace_checkout_configs(upsell_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_bump_product_id ON marketplace_checkout_sessions(bump_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_partner_id ON marketplace_checkout_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_price_id ON marketplace_checkout_sessions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_product_id ON marketplace_checkout_sessions(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_order_id ON marketplace_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_partner_id ON marketplace_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_order_id ON marketplace_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_product_id ON marketplace_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_checkout_session_id ON marketplace_orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id ON marketplace_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_price_id ON marketplace_orders(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON marketplace_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_product_prices_product_id ON marketplace_product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_price_id ON marketplace_subscriptions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_product_id ON marketplace_subscriptions(product_id);

-- Merchant tables
CREATE INDEX IF NOT EXISTS idx_merchant_accounting_lite_merchant_id ON merchant_accounting_lite(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_accounting_pro_merchant_id ON merchant_accounting_pro(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_ad_costs_deal_id ON merchant_ad_costs(deal_id);
CREATE INDEX IF NOT EXISTS idx_merchant_ad_costs_merchant_id ON merchant_ad_costs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id ON merchant_addon_subscriptions(addon_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id ON merchant_addon_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id ON merchant_application_equipment(application_id);
CREATE INDEX IF NOT EXISTS idx_merchant_campaign_installs_dfy_campaign_id ON merchant_campaign_installs(dfy_campaign_id);
CREATE INDEX IF NOT EXISTS idx_merchant_campaign_installs_org_id ON merchant_campaign_installs(org_id);
CREATE INDEX IF NOT EXISTS idx_merchant_comprehensive_stats_merchant_id ON merchant_comprehensive_stats(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_content_installs_dfy_content_item_id ON merchant_content_installs(dfy_content_item_id);
CREATE INDEX IF NOT EXISTS idx_merchant_content_installs_org_id ON merchant_content_installs(org_id);
CREATE INDEX IF NOT EXISTS idx_merchant_crm_preferences_merchant_id ON merchant_crm_preferences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_locations_merchant_id ON merchant_locations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_members_merchant_id ON merchant_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_services_applications_merchant_id ON merchant_services_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_settings_merchant_id ON merchant_settings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id ON merchant_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_merchant_team_members_merchant_id ON merchant_team_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchants_category_id ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id ON merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id ON merchants(partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_referred_by_partner_id ON merchants(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_territory_id ON merchants(territory_id);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);

-- Notification tables
CREATE INDEX IF NOT EXISTS idx_notification_preferences_customer_id ON notification_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id ON notifications(merchant_id);
