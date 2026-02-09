/*
  # Add Missing Foreign Key Indexes - Batch 20: Marketplace Checkout & Orders

  1. Changes
    - Add indexes for marketplace_checkout_configs (order_bump_product_id, upsell_product_id)
    - Add indexes for marketplace_checkout_sessions (product_id, price_id, partner_id, user_id, bump_product_id)
    - Add indexes for marketplace_orders (product_id, price_id, partner_id)
    - Add indexes for marketplace_order_items (order_id, product_id)
    - Add indexes for marketplace_subscriptions (product_id, price_id, user_id)
    - Add indexes for marketplace_commissions (order_id, partner_id)
    
  2. Rationale
    - Checkout flow requires fast product and pricing lookups
    - Order tracking needs efficient queries
    - Commission calculations need order and partner filtering
    
  3. Performance Impact
    - Faster checkout processing
    - Better order history queries
    - Improved commission calculations
*/

-- Marketplace Checkout Configs
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_order_bump_product_id ON marketplace_checkout_configs(order_bump_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_upsell_product_id ON marketplace_checkout_configs(upsell_product_id);

-- Marketplace Checkout Sessions
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_product_id ON marketplace_checkout_sessions(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_price_id ON marketplace_checkout_sessions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_partner_id ON marketplace_checkout_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_user_id ON marketplace_checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_bump_product_id ON marketplace_checkout_sessions(bump_product_id);

-- Marketplace Orders
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON marketplace_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_price_id ON marketplace_orders(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id ON marketplace_orders(partner_id);

-- Marketplace Order Items
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_order_id ON marketplace_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_product_id ON marketplace_order_items(product_id);

-- Marketplace Subscriptions
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_product_id ON marketplace_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_price_id ON marketplace_subscriptions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_user_id ON marketplace_subscriptions(user_id);

-- Marketplace Commissions
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_order_id ON marketplace_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_partner_id ON marketplace_commissions(partner_id);
