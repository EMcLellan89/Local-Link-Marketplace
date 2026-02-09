/*
  # Drop Duplicate Indexes - Batch 4 (Final)

  1. Changes
    - Drop final set of duplicate indexes
    - Completes all 44 duplicate index removals
    
  2. Indexes Being Dropped
    - idx_profit_network_enrollments_partner (duplicate of idx_profit_network_enrollments_partner_id)
    - idx_profit_network_sales_partner (duplicate of idx_profit_network_sales_partner_id)
    - idx_marketplace_commissions_partner (duplicate of idx_marketplace_commissions_partner_id)
    - idx_external_sales_events_partner (duplicate of idx_external_sales_events_partner_id)
    - idx_partner_badges_partner (duplicate of idx_partner_badges_partner_id)
    - idx_partner_certifications_partner (duplicate of idx_partner_certifications_partner_id)
    - idx_partner_training_progress_partner (duplicate of idx_partner_training_progress_partner_id)
    - idx_budget_buster_transactions_user (duplicate of idx_budget_buster_transactions_user_id)
    - idx_budget_buster_accounts_user (duplicate of idx_budget_buster_accounts_user_id)
    - idx_financial_transactions_user (duplicate of idx_financial_transactions_user_id)
    - idx_vapi_calls_merchant (duplicate of idx_vapi_calls_merchant_id)
    - idx_twilio_messages_merchant (duplicate of idx_twilio_messages_merchant_id)
*/

-- Profit Network indexes
DROP INDEX IF EXISTS idx_profit_network_enrollments_partner;
DROP INDEX IF EXISTS idx_profit_network_sales_partner;

-- Marketplace and external sales indexes
DROP INDEX IF EXISTS idx_marketplace_commissions_partner;
DROP INDEX IF EXISTS idx_external_sales_events_partner;

-- Partner training indexes
DROP INDEX IF EXISTS idx_partner_badges_partner;
DROP INDEX IF EXISTS idx_partner_certifications_partner;
DROP INDEX IF EXISTS idx_partner_training_progress_partner;

-- Budget Buster and financial indexes
DROP INDEX IF EXISTS idx_budget_buster_transactions_user;
DROP INDEX IF EXISTS idx_budget_buster_accounts_user;
DROP INDEX IF EXISTS idx_financial_transactions_user;

-- Communication indexes
DROP INDEX IF EXISTS idx_vapi_calls_merchant;
DROP INDEX IF EXISTS idx_twilio_messages_merchant;