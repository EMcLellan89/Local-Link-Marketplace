/*
  # Drop Unused Indexes - Batch 10: Marketplace, Merchant, and Notification Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Marketplace and affiliate indexes
  - Merchant-related indexes
  - Notification indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- locallink_crm_tasks
DROP INDEX IF EXISTS idx_locallink_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_locallink_crm_tasks_merchant_id;

-- loyalty_cards
DROP INDEX IF EXISTS idx_loyalty_cards_customer_id;
DROP INDEX IF EXISTS idx_loyalty_cards_merchant_id;

-- loyalty_rewards
DROP INDEX IF EXISTS idx_loyalty_rewards_merchant_id;

-- loyalty_transactions
DROP INDEX IF EXISTS idx_loyalty_transactions_card_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_reward_id;

-- marketplace_affiliate_clicks
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_product_id;

-- marketplace_affiliate_commissions
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_order_id;

-- marketplace_affiliate_partners
DROP INDEX IF EXISTS idx_marketplace_affiliate_partners_user_id;

-- marketplace_affiliate_payouts
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_affiliate_id;

-- marketplace_cart_items
DROP INDEX IF EXISTS idx_marketplace_cart_items_cart_id;
DROP INDEX IF EXISTS idx_marketplace_cart_items_product_id;

-- marketplace_carts
DROP INDEX IF EXISTS idx_marketplace_carts_user_id;

-- marketplace_orders
DROP INDEX IF EXISTS idx_marketplace_orders_user_id;

-- marketplace_products
DROP INDEX IF EXISTS idx_marketplace_products_category;

-- membership_tiers
DROP INDEX IF EXISTS idx_membership_tiers_merchant_id;

-- memberships
DROP INDEX IF EXISTS idx_memberships_customer_id;
DROP INDEX IF EXISTS idx_memberships_tier_id;

-- merchant_applications
DROP INDEX IF EXISTS idx_merchant_applications_user_id;

-- merchant_orders
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;

-- merchant_services
DROP INDEX IF EXISTS idx_merchant_services_merchant_id;

-- merchants
DROP INDEX IF EXISTS idx_merchants_user_id;

-- notifications
DROP INDEX IF EXISTS idx_notifications_user_id;
