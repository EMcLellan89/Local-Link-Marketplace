/*
  # Fix Missing Foreign Key Indexes - Batch 9 (Merchant, Notification, Order Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - merchant tables
    - notification tables
    - order tables
*/

CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id ON merchant_addon_subscriptions(addon_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id ON merchant_addon_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id ON merchant_application_equipment(application_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_services_applications_merchant_id ON merchant_services_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id ON merchant_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_merchants_category_id ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id ON merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_merchants_territory_id ON merchants(territory_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id ON orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
