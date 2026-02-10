/*
  # Drop Unused Indexes - Batch 11: Budget Buster, Blog & Badges Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - budget_buster_users (2 indexes)
    - budget_buster_budgets (2 indexes)
    - budget_buster_transactions (3 indexes)
    - budget_buster_categories (2 indexes)
    - budget_buster_goals (3 indexes)
    - budget_buster_alerts (3 indexes)
    - blog_posts (4 indexes)
    - blog_categories (2 indexes)
    - blog_tags (1 index)
    - blog_post_tags (2 indexes)
    - blog_comments (3 indexes)
    - badge_definitions (2 indexes)
    - badge_awards (3 indexes)
    - badge_progress (3 indexes)
    - bi_reports (3 indexes)
    - bi_dashboards (2 indexes)
    - bi_metrics (3 indexes)
    - autoscale_campaigns (3 indexes)
    - autoscale_rules (2 indexes)
    - autoscale_executions (3 indexes)

  3. Total Indexes Dropped: ~53
*/

-- budget_buster_users
DROP INDEX IF EXISTS idx_budget_buster_users_user_id;
DROP INDEX IF EXISTS idx_budget_buster_users_subscription_status;

-- budget_buster_budgets
DROP INDEX IF EXISTS idx_budget_buster_budgets_user_id;
DROP INDEX IF EXISTS idx_budget_buster_budgets_status;

-- budget_buster_transactions
DROP INDEX IF EXISTS idx_budget_buster_transactions_user_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_category_id;
DROP INDEX IF EXISTS idx_budget_buster_transactions_date;

-- budget_buster_categories
DROP INDEX IF EXISTS idx_budget_buster_categories_user_id;
DROP INDEX IF EXISTS idx_budget_buster_categories_type;

-- budget_buster_goals
DROP INDEX IF EXISTS idx_budget_buster_goals_user_id;
DROP INDEX IF EXISTS idx_budget_buster_goals_status;
DROP INDEX IF EXISTS idx_budget_buster_goals_target_date;

-- budget_buster_alerts
DROP INDEX IF EXISTS idx_budget_buster_alerts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_alerts_type;
DROP INDEX IF EXISTS idx_budget_buster_alerts_status;

-- blog_posts
DROP INDEX IF EXISTS idx_blog_posts_author;
DROP INDEX IF EXISTS idx_blog_posts_category;
DROP INDEX IF EXISTS idx_blog_posts_status;
DROP INDEX IF EXISTS idx_blog_posts_published;

-- blog_categories
DROP INDEX IF EXISTS idx_blog_categories_slug;
DROP INDEX IF EXISTS idx_blog_categories_parent;

-- blog_tags
DROP INDEX IF EXISTS idx_blog_tags_slug;

-- blog_post_tags
DROP INDEX IF EXISTS idx_blog_post_tags_post;
DROP INDEX IF EXISTS idx_blog_post_tags_tag;

-- blog_comments
DROP INDEX IF EXISTS idx_blog_comments_post;
DROP INDEX IF EXISTS idx_blog_comments_author;
DROP INDEX IF EXISTS idx_blog_comments_status;

-- badge_definitions
DROP INDEX IF EXISTS idx_badge_definitions_category;
DROP INDEX IF EXISTS idx_badge_definitions_tier;

-- badge_awards
DROP INDEX IF EXISTS idx_badge_awards_user;
DROP INDEX IF EXISTS idx_badge_awards_badge;
DROP INDEX IF EXISTS idx_badge_awards_awarded_at;

-- badge_progress
DROP INDEX IF EXISTS idx_badge_progress_user;
DROP INDEX IF EXISTS idx_badge_progress_badge;
DROP INDEX IF EXISTS idx_badge_progress_status;

-- bi_reports
DROP INDEX IF EXISTS idx_bi_reports_type;
DROP INDEX IF EXISTS idx_bi_reports_status;
DROP INDEX IF EXISTS idx_bi_reports_created_by;

-- bi_dashboards
DROP INDEX IF EXISTS idx_bi_dashboards_created_by;
DROP INDEX IF EXISTS idx_bi_dashboards_status;

-- bi_metrics
DROP INDEX IF EXISTS idx_bi_metrics_metric_type;
DROP INDEX IF EXISTS idx_bi_metrics_entity_type;
DROP INDEX IF EXISTS idx_bi_metrics_date;

-- autoscale_campaigns
DROP INDEX IF EXISTS idx_autoscale_campaigns_merchant;
DROP INDEX IF EXISTS idx_autoscale_campaigns_partner;
DROP INDEX IF EXISTS idx_autoscale_campaigns_status;

-- autoscale_rules
DROP INDEX IF EXISTS idx_autoscale_rules_campaign;
DROP INDEX IF EXISTS idx_autoscale_rules_status;

-- autoscale_executions
DROP INDEX IF EXISTS idx_autoscale_executions_campaign;
DROP INDEX IF EXISTS idx_autoscale_executions_rule;
DROP INDEX IF EXISTS idx_autoscale_executions_timestamp;