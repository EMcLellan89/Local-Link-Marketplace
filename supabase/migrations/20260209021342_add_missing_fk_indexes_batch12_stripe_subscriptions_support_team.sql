/*
  # Add Missing Foreign Key Indexes - Batch 12: Stripe, Subscriptions, Support, Surveys & Team Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns
  
  2. Tables Covered
    - stripe_subscription_map (user_id)
    - subscription_items (plan_id)
    - subscriptions (plan_id)
    - support_tickets (customer_id, merchant_id)
    - survey_responses (customer_id, survey_id)
    - surveys (merchant_id)
    - system_settings (updated_by)
    - team_members (user_id)
*/

DO $$
BEGIN
  -- Stripe
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stripe_subscription_map' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id ON stripe_subscription_map(user_id);
  END IF;
  
  -- Subscriptions
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscription_items' AND column_name = 'plan_id') THEN
    CREATE INDEX IF NOT EXISTS idx_subscription_items_plan_id ON subscription_items(plan_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'plan_id') THEN
    CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
  END IF;
  
  -- Support
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_tickets' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_tickets' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);
  END IF;
  
  -- Surveys
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'survey_id') THEN
    CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_surveys_merchant_id ON surveys(merchant_id);
  END IF;
  
  -- System settings
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_settings' AND column_name = 'updated_by') THEN
    CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON system_settings(updated_by);
  END IF;
  
  -- Team
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
  END IF;
END $$;