/*
  # Drop Duplicate Indexes - New Batch
  
  1. Duplicate Indexes to Drop
    - Tables with multiple indexes covering the same columns
    - Keeps the primary index, removes duplicates
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - Maintains query performance with remaining indexes
  
  3. Safety
    - Only drops truly duplicate indexes
    - Primary keys and unique constraints preserved
*/

-- Drop duplicate indexes (keeping the original, dropping duplicates)
DROP INDEX IF EXISTS idx_academy_enrollments_user_id_duplicate;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id_duplicate;
DROP INDEX IF EXISTS idx_blog_posts_category_id_duplicate;
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_customer_referrals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_merchants_user_id_duplicate;
DROP INDEX IF EXISTS idx_notifications_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partners_user_id_duplicate;
DROP INDEX IF EXISTS idx_purchases_customer_id_duplicate;
DROP INDEX IF EXISTS idx_reviews_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id_duplicate;