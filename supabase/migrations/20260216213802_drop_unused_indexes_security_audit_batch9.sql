/*
  # Drop Unused Indexes - Security Audit Batch 9
  
  Drops unused indexes from referral, reputation, review, rewards, and sales milestone tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - referral_short_links, referral_tracking, referrals
  - reputation_alerts, reputation_scans
  - review_requests, reviews
  - rewards_redemptions
  - sales_milestones
*/

-- Referral tables
DROP INDEX IF EXISTS idx_referral_short_links_customer_id;
DROP INDEX IF EXISTS idx_referral_short_links_merchant_id;
DROP INDEX IF EXISTS idx_referral_tracking_referral_id;
DROP INDEX IF EXISTS idx_referral_tracking_customer_id;
DROP INDEX IF EXISTS idx_referrals_referrer_id;
DROP INDEX IF EXISTS idx_referrals_referee_id;
DROP INDEX IF EXISTS idx_referrals_merchant_id;

-- Reputation tables
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_reputation_scans_merchant_id;

-- Review tables
DROP INDEX IF EXISTS idx_review_requests_merchant_id;
DROP INDEX IF EXISTS idx_review_requests_customer_id;
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;

-- Rewards tables
DROP INDEX IF EXISTS idx_rewards_redemptions_customer_id;
DROP INDEX IF EXISTS idx_rewards_redemptions_merchant_id;

-- Sales milestone tables
DROP INDEX IF EXISTS idx_sales_milestones_partner_id;