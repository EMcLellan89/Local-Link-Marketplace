/*
  # Drop Unused Indexes - Batch 8: Purchases, QR, Referrals, Reputation, Reviews, Scheduled
  
  ## Tables Covered:
  - purchases
  - qr_* tables
  - referral_* tables
  - reputation_* tables
  - reviews
  - rewards_* tables
  - scheduled_* tables
*/

-- Purchases
DROP INDEX IF EXISTS idx_purchases_created_at;
DROP INDEX IF EXISTS idx_purchases_merchant_id;

-- QR codes
DROP INDEX IF EXISTS idx_qr_codes_created_at;
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;

-- Referral tables
DROP INDEX IF EXISTS idx_referral_rewards_created_at;
DROP INDEX IF EXISTS idx_referral_rewards_merchant_id;
DROP INDEX IF EXISTS idx_referral_short_links_created_at;
DROP INDEX IF EXISTS idx_referral_short_links_merchant_id;
DROP INDEX IF EXISTS idx_referral_tracking_created_at;
DROP INDEX IF EXISTS idx_referral_tracking_merchant_id;
DROP INDEX IF EXISTS idx_referrals_created_at;
DROP INDEX IF EXISTS idx_referrals_merchant_id;
DROP INDEX IF EXISTS idx_referrals_referrer_id;

-- Reputation tables
DROP INDEX IF EXISTS idx_reputation_monitoring_created_at;
DROP INDEX IF EXISTS idx_reputation_monitoring_merchant_id;

-- Reviews
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_rating;

-- Rewards tables
DROP INDEX IF EXISTS idx_rewards_balance_customer_id;
DROP INDEX IF EXISTS idx_rewards_balance_merchant_id;
DROP INDEX IF EXISTS idx_rewards_ledger_created_at;
DROP INDEX IF EXISTS idx_rewards_ledger_customer_id;
DROP INDEX IF EXISTS idx_rewards_redemptions_created_at;
DROP INDEX IF EXISTS idx_rewards_redemptions_customer_id;

-- Scheduled tables
DROP INDEX IF EXISTS idx_scheduled_deals_created_at;
DROP INDEX IF EXISTS idx_scheduled_deals_scheduled_for;
DROP INDEX IF EXISTS idx_scheduled_sms_created_at;
DROP INDEX IF EXISTS idx_scheduled_sms_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_sms_scheduled_for;