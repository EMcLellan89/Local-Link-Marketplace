/*
  # Drop Unused Indexes - Batch 4: Deals, Customers, Merchants, Partners

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Deals and transactions
    - Customers and profiles
    - Merchants and orders
    - Partners and territories

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- Deal related indexes
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_deals_start_date;
DROP INDEX IF EXISTS idx_deals_end_date;
DROP INDEX IF EXISTS idx_deal_transactions_deal_id;
DROP INDEX IF EXISTS idx_deal_transactions_customer_id;
DROP INDEX IF EXISTS idx_deal_transactions_created_at;
DROP INDEX IF EXISTS idx_deal_bundles_merchant_id;
DROP INDEX IF EXISTS idx_deal_bundles_active;

-- Customer related indexes
DROP INDEX IF EXISTS idx_customers_user_id;
DROP INDEX IF EXISTS idx_customers_created_at;
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
DROP INDEX IF EXISTS idx_favorites_customer_id;
DROP INDEX IF EXISTS idx_favorites_merchant_id;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_read;
DROP INDEX IF EXISTS idx_notifications_created_at;

-- Merchant related indexes
DROP INDEX IF EXISTS idx_merchants_user_id;
DROP INDEX IF EXISTS idx_merchants_business_name;
DROP INDEX IF EXISTS idx_merchants_status;
DROP INDEX IF EXISTS idx_merchants_created_at;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_merchant_orders_created_at;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_status;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier;

-- Partner related indexes
DROP INDEX IF EXISTS idx_partners_user_id;
DROP INDEX IF EXISTS idx_partners_status;
DROP INDEX IF EXISTS idx_partners_created_at;
DROP INDEX IF EXISTS idx_partner_territories_partner_id;
DROP INDEX IF EXISTS idx_partner_territories_state;
DROP INDEX IF EXISTS idx_partner_territories_status;
DROP INDEX IF EXISTS idx_partner_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_commissions_status;