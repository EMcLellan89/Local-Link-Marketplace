/*
  # Add Missing Foreign Key Indexes - Batch 10: Projects, Purchases, Reputation & Reviews Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for projects, purchases, reputation, and review systems
  
  2. Tables Covered
    - project_assignments (project_id)
    - prompt_runs (user_id)
    - purchases (customer_id, deal_id)
    - recruiting_services (merchant_id)
    - recurring_commission_schedule (product_id)
    - reputation_alerts (merchant_id)
    - reputation_campaigns (merchant_id)
    - reputation_responses (merchant_id, review_id)
    - reputation_reviews (merchant_id)
    - review_responses (merchant_id, review_id)
    - reviews (customer_id)
*/

DO $$
BEGIN
  -- Projects
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_assignments' AND column_name = 'project_id') THEN
    CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);
  END IF;
  
  -- Prompts
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompt_runs' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);
  END IF;
  
  -- Purchases
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'deal_id') THEN
    CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
  END IF;
  
  -- Recruiting
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recruiting_services' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id ON recruiting_services(merchant_id);
  END IF;
  
  -- Recurring commissions
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recurring_commission_schedule' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_recurring_commission_schedule_product_id ON recurring_commission_schedule(product_id);
  END IF;
  
  -- Reputation system
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reputation_alerts' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id ON reputation_alerts(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reputation_campaigns' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id ON reputation_campaigns(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reputation_responses' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id ON reputation_responses(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reputation_responses' AND column_name = 'review_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id ON reputation_responses(review_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reputation_reviews' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id ON reputation_reviews(merchant_id);
  END IF;
  
  -- Reviews
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'review_responses' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_review_responses_merchant_id ON review_responses(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'review_responses' AND column_name = 'review_id') THEN
    CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
  END IF;
END $$;