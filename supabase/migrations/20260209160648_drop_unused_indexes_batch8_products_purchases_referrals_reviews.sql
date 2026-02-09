/*
  # Drop Unused Indexes - Batch 8: Products, Purchases, Referrals & Reviews Tables
  
  1. Tables Affected
    - products and product_* tables
    - purchases
    - referral_* tables
    - reviews and reputation_* tables
  
  2. Performance Impact
    - Drops indexes with zero scans
    - Improves INSERT/UPDATE performance
  
  3. Safety
    - All indexes unused according to database statistics
*/

-- Products
DROP INDEX IF EXISTS idx_products_merchant_id;
DROP INDEX IF EXISTS idx_product_categories_parent_id;
DROP INDEX IF EXISTS idx_printing_products_category;
DROP INDEX IF EXISTS idx_promotional_swag_category;

-- Purchases
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_merchant_id;
DROP INDEX IF EXISTS idx_purchase_history_customer_id;

-- Referrals
DROP INDEX IF EXISTS idx_referrals_referrer_id;
DROP INDEX IF EXISTS idx_referrals_referee_id;
DROP INDEX IF EXISTS idx_referral_codes_partner_id;
DROP INDEX IF EXISTS idx_referral_codes_merchant_id;
DROP INDEX IF EXISTS idx_referral_rewards_referrer_id;
DROP INDEX IF EXISTS idx_referral_links_partner_id;
DROP INDEX IF EXISTS idx_customer_referrals_referred_by;

-- Reviews and reputation
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_review_requests_merchant_id;
DROP INDEX IF EXISTS idx_review_requests_customer_id;
DROP INDEX IF EXISTS idx_reputation_scores_merchant_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;