/*
  # Drop Duplicate Indexes - Batch 1

  1. Changes
    - Drop duplicate indexes identified by Supabase security analysis
    - Keeps one index per unique column set
    - Improves database performance by reducing maintenance overhead
    
  2. Indexes Being Dropped
    - idx_academy_quiz_attempts_module (duplicate of idx_academy_quiz_attempts_module_id)
    - idx_creative_events_created (duplicate of idx_creative_events_created_at)
    - idx_merchants_user (duplicate of idx_merchants_user_id)
    - idx_customers_user (duplicate of idx_customers_user_id)
    - idx_deals_merchant (duplicate of idx_deals_merchant_id)
    - idx_partners_user (duplicate of idx_partners_user_id)
    - idx_partner_earnings_partner (duplicate of idx_partner_earnings_partner_id)
    - idx_affiliate_clicks_partner (duplicate of idx_affiliate_clicks_affiliate_id)
    - idx_marketplace_orders_user (duplicate of idx_marketplace_orders_user_id)
    - idx_marketplace_orders_partner (duplicate of idx_marketplace_orders_partner_id)
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_quiz_attempts_module;

-- Creative tracking indexes
DROP INDEX IF EXISTS idx_creative_events_created;

-- Core user-related indexes
DROP INDEX IF EXISTS idx_merchants_user;
DROP INDEX IF EXISTS idx_customers_user;
DROP INDEX IF EXISTS idx_partners_user;

-- Deal and earnings indexes
DROP INDEX IF EXISTS idx_deals_merchant;
DROP INDEX IF EXISTS idx_partner_earnings_partner;

-- Affiliate and marketplace indexes
DROP INDEX IF EXISTS idx_affiliate_clicks_partner;
DROP INDEX IF EXISTS idx_marketplace_orders_user;
DROP INDEX IF EXISTS idx_marketplace_orders_partner;