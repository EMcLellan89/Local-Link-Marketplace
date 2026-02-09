/*
  # Add Missing Foreign Key Indexes - Batch 7: Marketplace, Merchant & Order Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for marketplace, merchant, and order systems
  
  2. Tables Covered
    - marketplace_subscriptions (user_id)
    - merchant_orders (merchant_id)
    - merchant_team_members (user_id)
    - order_items (order_id, product_id)
    - outreach_logs (partner_id)
*/

DO $$
BEGIN
  -- Marketplace
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_subscriptions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_marketplace_subscriptions_user_id ON marketplace_subscriptions(user_id);
  END IF;
  
  -- Merchant
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchant_orders' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merchant_team_members' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_merchant_team_members_user_id ON merchant_team_members(user_id);
  END IF;
  
  -- Orders
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'order_id') THEN
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
  END IF;
  
  -- Outreach
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'outreach_logs' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_outreach_logs_partner_id ON outreach_logs(partner_id);
  END IF;
END $$;