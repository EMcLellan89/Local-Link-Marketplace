/*
  # Drop Unused Indexes - Batch 4: Audit, Badge, and Blog Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Audit log indexes
  - Badge and automation indexes
  - Blog-related indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- audit_logs
DROP INDEX IF EXISTS idx_audit_logs_merchant_id;
DROP INDEX IF EXISTS idx_audit_logs_user_id;

-- automation_addons
DROP INDEX IF EXISTS idx_automation_addons_merchant_id;

-- badge_awards
DROP INDEX IF EXISTS idx_badge_awards_badge_partner;
DROP INDEX IF EXISTS idx_badge_awards_partner_id;

-- badges
DROP INDEX IF EXISTS idx_badges_category;

-- bank_accounts
DROP INDEX IF EXISTS idx_bank_accounts_entity_id;

-- bank_transactions
DROP INDEX IF EXISTS idx_bank_transactions_account_id;
DROP INDEX IF EXISTS idx_bank_transactions_merchant_id;

-- bi_chart_config
DROP INDEX IF EXISTS idx_bi_chart_config_merchant_id;

-- blog_categories
DROP INDEX IF EXISTS idx_blog_categories_slug;

-- blog_post_tags
DROP INDEX IF EXISTS idx_blog_post_tags_post_id;
DROP INDEX IF EXISTS idx_blog_post_tags_tag_id;

-- blog_posts
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;
DROP INDEX IF EXISTS idx_blog_posts_slug;

-- blog_tags
DROP INDEX IF EXISTS idx_blog_tags_slug;

-- bot_channels
DROP INDEX IF EXISTS idx_bot_channels_merchant_id;

-- bot_conversations
DROP INDEX IF EXISTS idx_bot_conversations_channel_id;
DROP INDEX IF EXISTS idx_bot_conversations_customer_id;

-- bot_deployments
DROP INDEX IF EXISTS idx_bot_deployments_merchant_id;

-- bot_knowledge_links
DROP INDEX IF EXISTS idx_bot_knowledge_links_deployment_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_source_id;

-- bot_messages
DROP INDEX IF EXISTS idx_bot_messages_conversation_id;

-- bot_profiles
DROP INDEX IF EXISTS idx_bot_profiles_merchant_id;

-- bot_tool_permissions
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_product_id;
DROP INDEX IF EXISTS idx_bot_tool_permissions_tool_id;
