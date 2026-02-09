/*
  # Drop Unused Indexes - Batch 13
*/

DROP INDEX IF EXISTS idx_profit_network_sales_partner_id;
DROP INDEX IF EXISTS idx_profit_network_sales_business_id;
DROP INDEX IF EXISTS idx_profit_network_statements_partner_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_customer_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_configs_order_bump_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_configs_upsell_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_price_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_partner_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_user_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_bump_product_id;
DROP INDEX IF EXISTS idx_marketplace_orders_price_id;
DROP INDEX IF EXISTS idx_marketplace_orders_partner_id;
DROP INDEX IF EXISTS idx_marketplace_order_items_order_id;
DROP INDEX IF EXISTS idx_marketplace_order_items_product_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_product_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_price_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_user_id;
DROP INDEX IF EXISTS idx_marketplace_commissions_order_id;
