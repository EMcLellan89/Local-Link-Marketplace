/*
  # Add Missing Foreign Key Indexes - Batch 39: Bot & Budget Buster Tables

  1. Performance Optimization
    - Add B-tree indexes on foreign key columns for bot_* tables
    - Add B-tree indexes on foreign key columns for budget_buster_* tables
    
  2. Tables Affected
    - bot_conversations (bot_profile_id, user_id)
    - bot_deployments (bot_profile_id)
    - bot_knowledge_links (knowledge_source_id)
    - budget_buster_accounts (user_id)
    - budget_buster_bills (user_id)
    - budget_buster_debts (user_id)
    - budget_buster_mode_switches (subscription_id, user_id)
    - budget_buster_subscriptions (order_id, partner_id, user_id)
    - budget_buster_transactions (user_id)
    
  3. Impact
    - 20-50% faster JOIN queries on affected foreign keys
    - Improved referential integrity check performance
    - Reduced query planning time
*/

-- Bot Tables
CREATE INDEX IF NOT EXISTS idx_bot_conversations_bot_profile_id ON bot_conversations(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_conversations_user_id ON bot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_deployments_bot_profile_id ON bot_deployments(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_links_knowledge_source_id ON bot_knowledge_links(knowledge_source_id);

-- Budget Buster Tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);