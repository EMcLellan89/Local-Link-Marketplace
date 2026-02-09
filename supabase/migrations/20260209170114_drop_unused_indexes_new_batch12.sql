/*
  # Drop Unused Indexes - New Batch 12
  
  1. Indexes to Drop (Specialized Tables)
    - Blog system indexes
    - Badge and gamification
    - Bot system advanced
    - Budget Buster app
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Blog indexes
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_published_at;
DROP INDEX IF EXISTS idx_blog_posts_status;
DROP INDEX IF EXISTS idx_blog_categories_slug;

-- Badge indexes
DROP INDEX IF EXISTS idx_partner_badges_awarded_at;
DROP INDEX IF EXISTS idx_partner_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_badges_partner_id;

-- Bot indexes
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_status;
DROP INDEX IF EXISTS idx_bot_audit_logs_bot_id;
DROP INDEX IF EXISTS idx_bot_audit_logs_created_at;

-- Budget Buster indexes
DROP INDEX IF EXISTS idx_budget_buster_accounts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_budgets_category;
DROP INDEX IF EXISTS idx_budget_buster_budgets_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_account_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_category;
DROP INDEX IF EXISTS idx_budget_buster_transactions_date;
DROP INDEX IF EXISTS idx_budget_buster_users_email;