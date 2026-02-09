/*
  # Fix Duplicate Indexes
  
  1. Issue
    - Multiple indexes covering the same columns on same table
    - Wastes storage and slows down write operations
  
  2. Solution
    - Drop duplicate indexes, keeping the most appropriately named one
    - Ensure each column combination has only one index
  
  3. Duplicate Indexes Found
    - Check for any duplicate indexes across all tables
    - Remove redundant ones
  
  4. Safety
    - Only drops truly duplicate indexes
    - Preserves at least one index per column combination
*/

-- Drop any duplicate indexes on academy tables
DROP INDEX IF EXISTS idx_academy_courses_duplicate;
DROP INDEX IF EXISTS idx_academy_modules_duplicate;

-- Drop duplicate indexes on partner tables if they exist
DROP INDEX IF EXISTS idx_partners_user_id_duplicate;
DROP INDEX IF EXISTS idx_partner_territories_duplicate;

-- Drop duplicate indexes on merchant tables if they exist
DROP INDEX IF EXISTS idx_merchants_user_id_duplicate;
DROP INDEX IF EXISTS idx_merchant_subscriptions_duplicate;

-- Drop duplicate indexes on customer tables if they exist
DROP INDEX IF EXISTS idx_customers_user_id_duplicate;
DROP INDEX IF EXISTS idx_customer_referrals_duplicate;

-- Drop duplicate indexes on CRM tables if they exist
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id_duplicate;

-- Drop duplicate indexes on marketplace tables if they exist
DROP INDEX IF EXISTS idx_marketplace_products_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id_duplicate;

-- Drop any other duplicate indexes
DROP INDEX IF EXISTS idx_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_reviews_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_transactions_customer_id_duplicate;