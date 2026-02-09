/*
  # Drop Unused Indexes - Batch 1

  1. Purpose
    - Remove indexes that are not being used by queries
    - Reduces database size and improves write performance
    - Speeds up INSERT/UPDATE/DELETE operations

  2. Impact
    - Frees up storage space
    - Reduces index maintenance overhead
    - Improves write performance

  3. Safety
    - Only dropping duplicate or truly unused indexes
    - Foreign key indexes are preserved
*/

-- Drop duplicate indexes (keeping the better-named ones)
DROP INDEX IF EXISTS idx_purchases_paybright_transaction;  -- Duplicate of idx_purchases_paybright_transaction_id

-- Drop unused timestamp indexes
DROP INDEX IF EXISTS idx_deals_created_at;
DROP INDEX IF EXISTS idx_purchases_purchased_at;
DROP INDEX IF EXISTS idx_customers_created_at;
DROP INDEX IF EXISTS idx_merchants_created_at;
DROP INDEX IF EXISTS idx_partners_created_at;

-- Drop unused composite indexes that are covered by better indexes
DROP INDEX IF EXISTS idx_academy_enrollments_composite;
DROP INDEX IF EXISTS idx_academy_progress_composite;
