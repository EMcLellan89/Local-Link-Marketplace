/*
  # Add Missing Foreign Key Indexes - Batch 11: Rewards, Shopping, SMS, Social & Story Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns
  
  2. Tables Covered
    - reward_redemptions (customer_id)
    - shopping_carts (customer_id, merchant_id)
    - sms_queue (user_id)
    - social_shares (customer_id)
    - social_ugc_subscriptions (merchant_id)
    - story_assets (book_id)
    - story_audit_logs (book_id)
    - story_books (project_id)
    - story_jobs (book_id)
*/

DO $$
BEGIN
  -- Rewards
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reward_redemptions' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer_id ON reward_redemptions(customer_id);
  END IF;
  
  -- Shopping
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shopping_carts' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id ON shopping_carts(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shopping_carts' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id ON shopping_carts(merchant_id);
  END IF;
  
  -- SMS
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_queue' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id ON sms_queue(user_id);
  END IF;
  
  -- Social
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_shares' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id ON social_shares(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_ugc_subscriptions' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id ON social_ugc_subscriptions(merchant_id);
  END IF;
  
  -- Story system
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_assets' AND column_name = 'book_id') THEN
    CREATE INDEX IF NOT EXISTS idx_story_assets_book_id ON story_assets(book_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_audit_logs' AND column_name = 'book_id') THEN
    CREATE INDEX IF NOT EXISTS idx_story_audit_logs_book_id ON story_audit_logs(book_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_books' AND column_name = 'project_id') THEN
    CREATE INDEX IF NOT EXISTS idx_story_books_project_id ON story_books(project_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_jobs' AND column_name = 'book_id') THEN
    CREATE INDEX IF NOT EXISTS idx_story_jobs_book_id ON story_jobs(book_id);
  END IF;
END $$;