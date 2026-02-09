/*
  # Drop Unused Indexes - Batch 11: Websites, Winback, Badges, Blog, Bot & Budget Tables
  
  1. Tables Affected
    - website_* tables
    - winback_* tables
    - badge_* tables
    - blog_* tables
    - bot_* tables
    - budget_buster_* tables
  
  2. Performance Impact
    - Removes indexes with no query usage
    - Reduces storage overhead
  
  3. Safety
    - All indexes unused per database statistics
*/

-- Websites
DROP INDEX IF EXISTS idx_websites_merchant_id;
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_website_pages_website_id;

-- Winback campaigns
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_targets_campaign_id;
DROP INDEX IF EXISTS idx_winback_targets_customer_id;

-- Badges
DROP INDEX IF EXISTS idx_badges_partner_id;
DROP INDEX IF EXISTS idx_badge_awards_partner_id;
DROP INDEX IF EXISTS idx_badge_awards_badge_id;
DROP INDEX IF EXISTS idx_milestone_badge_audit_log_partner_id;

-- Blog
DROP INDEX IF EXISTS idx_blog_posts_merchant_id;
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_categories_merchant_id;
DROP INDEX IF EXISTS idx_blog_comments_post_id;
DROP INDEX IF EXISTS idx_blog_comments_user_id;

-- Bot tables
DROP INDEX IF EXISTS idx_bot_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_id;
DROP INDEX IF EXISTS idx_bot_packages_bot_id;

-- Budget Buster
DROP INDEX IF EXISTS idx_budget_buster_users_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_user_id;
DROP INDEX IF EXISTS idx_budget_buster_accounts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_goals_user_id;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_user_id;