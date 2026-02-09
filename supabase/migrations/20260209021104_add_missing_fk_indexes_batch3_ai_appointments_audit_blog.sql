/*
  # Add Missing Foreign Key Indexes - Batch 3: AI, Appointments, Audit, Badges, Blog & Bot Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns
    - Covers AI assistants, appointments, audit logs, badges, blog, and bot systems
  
  2. Tables Covered
    - ai_assistant_conversations (user_id)
    - ai_bot_setups (merchant_id)
    - appointments (customer_id)
    - audit_logs (actor_user_id)
    - badge_awards (user_id)
    - blog_posts (author_id, category_id)
    - bot_conversations (user_id)
    - budget_buster_subscriptions (user_id)
    - business_capital_applications (merchant_id)
    - business_coaching_sessions (booking_id)
*/

DO $$
BEGIN
  -- AI tables
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_assistant_conversations' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_bot_setups' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_ai_bot_setups_merchant_id ON ai_bot_setups(merchant_id);
  END IF;
  
  -- Appointments
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
  END IF;
  
  -- Audit logs
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'actor_user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
  END IF;
  
  -- Badges
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'badge_awards' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards(user_id);
  END IF;
  
  -- Blog
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') THEN
    CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category_id') THEN
    CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
  END IF;
  
  -- Bot conversations
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bot_conversations' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_bot_conversations_user_id ON bot_conversations(user_id);
  END IF;
  
  -- Budget Buster
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_buster_subscriptions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
  END IF;
  
  -- Business services
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'business_capital_applications' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'business_coaching_sessions' AND column_name = 'booking_id') THEN
    CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);
  END IF;
END $$;