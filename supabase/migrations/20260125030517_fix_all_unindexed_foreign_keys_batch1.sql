/*
  # Fix Unindexed Foreign Keys - Batch 1 (A-C)
  
  Creates indexes for all unindexed foreign keys starting with A-C
  to improve query performance on joins and foreign key constraints.
*/

-- blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

-- commission_ledger
CREATE INDEX IF NOT EXISTS idx_commission_ledger_order_id ON commission_ledger(order_id);

-- customer_rewards_ledger
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_customer_id ON customer_rewards_ledger(customer_id);

-- marketplace_checkout_configs
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_order_bump_product_id 
  ON marketplace_checkout_configs(order_bump_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_upsell_product_id 
  ON marketplace_checkout_configs(upsell_product_id);

-- marketplace_checkout_sessions
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_bump_product_id 
  ON marketplace_checkout_sessions(bump_product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_partner_id 
  ON marketplace_checkout_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_price_id 
  ON marketplace_checkout_sessions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_product_id 
  ON marketplace_checkout_sessions(product_id);

-- marketplace_commissions
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_order_id 
  ON marketplace_commissions(order_id);

-- marketplace_order_items
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_order_id 
  ON marketplace_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_product_id 
  ON marketplace_order_items(product_id);

-- marketplace_orders
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_price_id ON marketplace_orders(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON marketplace_orders(product_id);

-- marketplace_subscriptions
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_price_id 
  ON marketplace_subscriptions(price_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_product_id 
  ON marketplace_subscriptions(product_id);

-- merchant_campaign_installs
CREATE INDEX IF NOT EXISTS idx_merchant_campaign_installs_dfy_campaign_id 
  ON merchant_campaign_installs(dfy_campaign_id);

-- merchant_content_installs
CREATE INDEX IF NOT EXISTS idx_merchant_content_installs_dfy_content_item_id 
  ON merchant_content_installs(dfy_content_item_id);

-- org_members
CREATE INDEX IF NOT EXISTS idx_org_members_profile_id ON org_members(profile_id);
