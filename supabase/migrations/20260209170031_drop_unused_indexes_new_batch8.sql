/*
  # Drop Unused Indexes - New Batch 8
  
  1. Indexes to Drop (Products, Purchases, Referrals, Reviews)
    - Product catalog
    - Purchase history
    - Referral system
    - Review management
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Product indexes
DROP INDEX IF EXISTS idx_printing_products_category;
DROP INDEX IF EXISTS idx_printing_products_type;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_merchant_id;
DROP INDEX IF EXISTS idx_products_status;

-- Purchase indexes
DROP INDEX IF EXISTS idx_purchase_items_product_id;
DROP INDEX IF EXISTS idx_purchase_items_purchase_id;
DROP INDEX IF EXISTS idx_purchases_created_at;
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_status;

-- Referral indexes
DROP INDEX IF EXISTS idx_customer_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_referrer_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_status;
DROP INDEX IF EXISTS idx_referral_codes_code;
DROP INDEX IF EXISTS idx_referral_codes_merchant_id;

-- Review indexes
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_status;