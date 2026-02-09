/*
  # Drop Unused Indexes - Batch 2: Affiliate & AI Tables

  This migration drops unused indexes from affiliate and AI-related tables.

  ## Tables Affected:
  - Affiliate tables (clicks, commissions, payouts, referrals)
  - AI tables (bot subscriptions, assistants, prompts)

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Affiliate indexes
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_product_slug;
DROP INDEX IF EXISTS idx_affiliate_clicks_clicked_at;
DROP INDEX IF EXISTS idx_affiliate_clicks_ip_address;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_affiliate_commissions_created_at;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_status;
DROP INDEX IF EXISTS idx_affiliate_payouts_created_at;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_status;

-- AI Bot indexes
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_status;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_created_at;
DROP INDEX IF EXISTS idx_ai_assistants_merchant_id;
DROP INDEX IF EXISTS idx_ai_assistants_bot_type;
DROP INDEX IF EXISTS idx_ai_assistants_is_active;
DROP INDEX IF EXISTS idx_ai_prompts_category;
DROP INDEX IF EXISTS idx_ai_prompts_difficulty_level;
DROP INDEX IF EXISTS idx_ai_prompts_is_free;