/*
  # Drop Unused Indexes - Batch 5: Marketplace, Payments, Products

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Marketplace products and orders
    - Payment and transaction tables
    - Product catalogs and commissions

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_products_category;
DROP INDEX IF EXISTS idx_marketplace_products_creator_id;
DROP INDEX IF EXISTS idx_marketplace_products_active;
DROP INDEX IF EXISTS idx_marketplace_products_created_at;
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id;
DROP INDEX IF EXISTS idx_marketplace_orders_product_id;
DROP INDEX IF EXISTS idx_marketplace_orders_status;
DROP INDEX IF EXISTS idx_marketplace_orders_created_at;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_product_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_created_at;

-- Payment indexes
DROP INDEX IF EXISTS idx_payments_customer_id;
DROP INDEX IF EXISTS idx_payments_merchant_id;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_payments_created_at;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_status;
DROP INDEX IF EXISTS idx_stripe_webhook_events_type;
DROP INDEX IF EXISTS idx_stripe_webhook_events_processed;
DROP INDEX IF EXISTS idx_stripe_webhook_events_created_at;

-- Product indexes
DROP INDEX IF EXISTS idx_products_merchant_id;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_active;
DROP INDEX IF EXISTS idx_product_commission_rules_product_id;
DROP INDEX IF EXISTS idx_product_commission_rules_partner_tier;
DROP INDEX IF EXISTS idx_printing_products_category;
DROP INDEX IF EXISTS idx_printing_products_active;

-- Purchase and order indexes
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;
DROP INDEX IF EXISTS idx_purchases_created_at;
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;