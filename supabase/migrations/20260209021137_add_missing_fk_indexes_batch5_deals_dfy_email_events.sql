/*
  # Add Missing Foreign Key Indexes - Batch 5: Deals, DFY, Email, Events & Expansion Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for deals, DFY orders, email, events, and expansion systems
  
  2. Tables Covered
    - deal_clicks (user_id)
    - deal_impressions (user_id)
    - deals (merchant_id)
    - dfy_fulfillment_tasks (order_id)
    - dfy_orders (product_id, user_id)
    - email_campaigns (merchant_id)
    - email_queue (user_id)
    - email_templates (merchant_id)
    - event_registrations (customer_id, event_id)
    - events (merchant_id)
    - expansion_requests (partner_id)
*/

DO $$
BEGIN
  -- Deal analytics
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deal_clicks' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON deal_clicks(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deal_impressions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON deal_impressions(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);
  END IF;
  
  -- DFY system
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dfy_fulfillment_tasks' AND column_name = 'order_id') THEN
    CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dfy_orders' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id ON dfy_orders(product_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dfy_orders' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_dfy_orders_user_id ON dfy_orders(user_id);
  END IF;
  
  -- Email system
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_campaigns' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_queue' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON email_queue(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_email_templates_merchant_id ON email_templates(merchant_id);
  END IF;
  
  -- Events
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'event_id') THEN
    CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
  END IF;
  
  -- Expansion requests
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expansion_requests' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);
  END IF;
END $$;