/*
  # Add Missing Foreign Key Indexes - Batch 4: Budget Buster Tables

  This migration adds B-tree indexes for foreign key columns that lack covering indexes.
  
  ## Tables Updated:
  - budget_buster_users (profile_id, referred_by_partner_id, subscription_id)
  - budget_buster_accounts (user_id)
  - budget_buster_transactions (user_id, account_id)
  - budget_buster_bills (user_id)
  - budget_buster_debts (user_id)
  - budget_buster_debt_settings (user_id)
  - budget_buster_savings_goals (user_id)
  - budget_buster_momentum (user_id)
  - budget_buster_ai_insights (user_id)

  Note: Many indexes already exist, adding only missing ones.
*/

-- Budget Buster Tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_debt_settings_user_id ON budget_buster_debt_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_savings_goals_user_id ON budget_buster_savings_goals(user_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_momentum_user_id ON budget_buster_momentum(user_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_ai_insights_user_id ON budget_buster_ai_insights(user_id);
