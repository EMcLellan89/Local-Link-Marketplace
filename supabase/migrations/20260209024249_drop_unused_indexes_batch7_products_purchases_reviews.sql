/*
  # Drop Unused Indexes - Batch 7: Products, Purchases, Referrals & Review Tables

  This migration drops unused indexes from product, purchase, referral,
  and review-related tables.

  ## Tables Affected:
  - Product tables
  - Purchase tables
  - Referral tables
  - Review and reputation tables

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Product indexes
DROP INDEX IF EXISTS idx_products_merchant_id;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_is_active;
DROP INDEX IF EXISTS idx_products_created_at;

-- Purchase indexes
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;
DROP INDEX IF EXISTS idx_purchases_status;
DROP INDEX IF EXISTS idx_purchases_purchased_at;
DROP INDEX IF EXISTS idx_purchase_history_customer_id;
DROP INDEX IF EXISTS idx_purchase_history_merchant_id;
DROP INDEX IF EXISTS idx_purchase_history_created_at;

-- Referral indexes
DROP INDEX IF EXISTS idx_referrals_referrer_customer_id;
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_referrals_status;
DROP INDEX IF EXISTS idx_referrals_created_at;
DROP INDEX IF EXISTS idx_customer_referrals_referrer_id;
DROP INDEX IF EXISTS idx_customer_referrals_referee_id;
DROP INDEX IF EXISTS idx_customer_referrals_status;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referral_rewards_earned_at;

-- Review and reputation indexes
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reputation_scores_merchant_id;
DROP INDEX IF EXISTS idx_reputation_scores_score_date;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_review_responses_merchant_id;