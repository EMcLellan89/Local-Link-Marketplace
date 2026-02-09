/*
  # Drop Unused Indexes - Batch 1
  
  1. Purpose
    - Drop indexes with idx_scan = 0 (never used by queries)
    - Reduces database maintenance overhead
    - Improves write performance
    - Addresses security audit findings
  
  2. Indexes Dropped
    - bot_conversations: merchant_id, customer_id
    - bot_deployments: merchant_id, bot_id
    - bot_knowledge_links: bot_id, parent_id
    - budget_buster tables: various indexes
    - business_coaching tables: booking_id, session_id
    - partner tables: bank_account indexes
  
  3. Security
    - No security impact
    - Performance improvement for writes
*/

-- Bot Tables
DROP INDEX IF EXISTS idx_bot_conversations_merchant_id;
DROP INDEX IF EXISTS idx_bot_conversations_customer_id;
DROP INDEX IF EXISTS idx_bot_deployments_merchant_id;
DROP INDEX IF EXISTS idx_bot_deployments_bot_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_bot_id;
DROP INDEX IF EXISTS idx_bot_knowledge_links_parent_id;

-- Budget Buster Tables
DROP INDEX IF EXISTS idx_budget_buster_bills_user_id;
DROP INDEX IF EXISTS idx_budget_buster_bills_business_id;
DROP INDEX IF EXISTS idx_budget_buster_debts_user_id;
DROP INDEX IF EXISTS idx_budget_buster_debts_business_id;
DROP INDEX IF EXISTS idx_budget_buster_income_user_id;
DROP INDEX IF EXISTS idx_budget_buster_income_business_id;
DROP INDEX IF EXISTS idx_budget_buster_mode_switches_user_id;

-- Business Coaching Tables
DROP INDEX IF EXISTS idx_business_coaching_bookings_booking_id;
DROP INDEX IF EXISTS idx_business_coaching_sessions_session_id;

-- Partner Bank Accounts
DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id;
DROP INDEX IF EXISTS idx_partner_bank_accounts_plaid_account_id;