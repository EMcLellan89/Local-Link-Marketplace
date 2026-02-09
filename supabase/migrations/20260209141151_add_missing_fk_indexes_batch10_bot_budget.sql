/*
  # Add Missing Foreign Key Indexes - Batch 10: Bot System & Budget Buster

  1. New Indexes
    - bot_conversations.bot_profile_id
    - bot_conversations.user_id
    - bot_deployments.bot_profile_id
    - bot_knowledge_links.knowledge_source_id
    - budget_buster_accounts.user_id
    - budget_buster_bills.user_id
    - budget_buster_debts.user_id
    - budget_buster_mode_switches.subscription_id
    - budget_buster_mode_switches.user_id
    - budget_buster_subscriptions.order_id
    - budget_buster_subscriptions.partner_id
    - budget_buster_subscriptions.user_id
    - budget_buster_transactions.account_id
    - budget_buster_transactions.user_id
    - budget_buster_usage_metrics.user_id
    - budget_buster_users.profile_id
    - budget_buster_users.referred_by_partner_id

  2. Performance Impact
    - Improves JOIN performance for bot conversation tracking
    - Optimizes Budget Buster user and transaction queries
*/

-- Bot System Indexes
CREATE INDEX IF NOT EXISTS idx_bot_conversations_bot_profile_id ON bot_conversations(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_conversations_user_id ON bot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_deployments_bot_profile_id ON bot_deployments(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_links_knowledge_source_id ON bot_knowledge_links(knowledge_source_id);

-- Budget Buster Indexes
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id ON budget_buster_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id ON budget_buster_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id ON budget_buster_users(referred_by_partner_id);
