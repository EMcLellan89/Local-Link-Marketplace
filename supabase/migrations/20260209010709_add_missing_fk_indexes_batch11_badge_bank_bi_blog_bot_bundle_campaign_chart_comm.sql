/*
  # Add Missing Foreign Key Indexes - Batch 11 Part 1
  
  1. Tables Covered
    - Badge tables (badge_audit_log, badge_rules)
    - Bank tables (bank_accounts, bank_connections)
    - Batch tables (batch_transactions)
    - BI tables (bi_competitor_tracking, bi_metrics, bi_predictions, bi_reports)
    - Blog tables (blog_post_tags, blog_posts)
    - Bot tables (bot_channels, bot_conversations, bot_deployments, bot_knowledge_links, bot_runs, bot_tool_permissions)
    - Bundle tables (bundle_items)
    - Campaign tables (campaign_recipients)
    - Categorization tables (categorization_rules)
    - Certificates table
    - Chart of accounts table
    - Cleanup quote requests table
    - Client vault table
    - Commission tables (commission_ledger, commission_payout_batches, commission_payout_queue, commissions)
    - Communications tables (communications_subscriptions, communications_transactions, communications_usage, community_sponsorships)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance across diverse system components
    
  3. Security
    - No security changes, only performance optimization
*/

-- Badge tables
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_badge_id ON badge_audit_log(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_partner_id ON badge_audit_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_badge_rules_badge_slug ON badge_rules(badge_slug);

-- Bank tables
CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_id ON bank_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_merchant_id ON bank_accounts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_merchant_id ON bank_connections(merchant_id);

-- Batch tables
CREATE INDEX IF NOT EXISTS idx_batch_transactions_payout_batch_id ON batch_transactions(payout_batch_id);

-- BI tables
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant_id ON bi_competitor_tracking(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_metrics_merchant_id ON bi_metrics(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_predictions_merchant_id ON bi_predictions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant_id ON bi_reports(merchant_id);

-- Blog tables
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);

-- Bot tables
CREATE INDEX IF NOT EXISTS idx_bot_channels_bot_profile_id ON bot_channels(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_conversations_bot_profile_id ON bot_conversations(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_deployments_bot_profile_id ON bot_deployments(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_links_bot_profile_id ON bot_knowledge_links(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_links_knowledge_source_id ON bot_knowledge_links(knowledge_source_id);
CREATE INDEX IF NOT EXISTS idx_bot_runs_profile_id ON bot_runs(profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_tool_permissions_bot_profile_id ON bot_tool_permissions(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_tool_permissions_tool_id ON bot_tool_permissions(tool_id);

-- Bundle tables
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_deal_id ON bundle_items(deal_id);

-- Campaign tables
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);

-- Categorization tables
CREATE INDEX IF NOT EXISTS idx_categorization_rules_coa_id ON categorization_rules(coa_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_merchant_id ON categorization_rules(merchant_id);

-- Certificates table
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- Chart of accounts table
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_merchant_id ON chart_of_accounts(merchant_id);

-- Cleanup quote requests
CREATE INDEX IF NOT EXISTS idx_cleanup_quote_requests_merchant_id ON cleanup_quote_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_cleanup_quote_requests_partner_id ON cleanup_quote_requests(partner_id);

-- Client vault
CREATE INDEX IF NOT EXISTS idx_client_vault_artifacts_merchant_id ON client_vault_artifacts(merchant_id);

-- Commission tables
CREATE INDEX IF NOT EXISTS idx_commission_ledger_batch_id ON commission_ledger(batch_id);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_order_id ON commission_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_payout_batch_id ON commission_ledger(payout_batch_id);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_recipient_partner_id ON commission_ledger(recipient_partner_id);
CREATE INDEX IF NOT EXISTS idx_commission_payout_batches_created_by ON commission_payout_batches(created_by);
CREATE INDEX IF NOT EXISTS idx_commission_payout_queue_batch_id ON commission_payout_queue(batch_id);
CREATE INDEX IF NOT EXISTS idx_commission_payout_queue_partner_id ON commission_payout_queue(partner_id);
CREATE INDEX IF NOT EXISTS idx_commissions_merchant_id ON commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON commissions(partner_id);

-- Communications tables
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_product_id ON communications_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription_id ON communications_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id ON community_sponsorships(merchant_id);
