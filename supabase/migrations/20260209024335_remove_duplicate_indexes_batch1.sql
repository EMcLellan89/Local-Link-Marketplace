/*
  # Remove Duplicate Indexes - Batch 1

  This migration removes duplicate indexes identified by Supabase security scan.
  When multiple indexes cover the same columns, only the most useful one is kept.

  ## Strategy:
  - Keep B-tree indexes over other types when equivalent
  - Keep more specific indexes over general ones
  - Remove redundant covering indexes

  ## Impact:
  Reduces index maintenance overhead and storage while maintaining query performance.
*/

-- Remove duplicate indexes on foreign keys (keeping the _fkey constraint indexes)
DROP INDEX IF EXISTS idx_customers_user_id_duplicate;
DROP INDEX IF EXISTS idx_merchants_user_id_duplicate;
DROP INDEX IF EXISTS idx_partners_user_id_duplicate;
DROP INDEX IF EXISTS idx_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_invoices_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_academy_modules_course_id_duplicate;
DROP INDEX IF EXISTS idx_academy_lessons_module_id_duplicate;
DROP INDEX IF EXISTS idx_reviews_merchant_id_duplicate;

-- Remove duplicate composite indexes (keeping the most useful combination)
DROP INDEX IF EXISTS idx_deals_merchant_status_duplicate;
DROP INDEX IF EXISTS idx_subscriptions_merchant_status_duplicate;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_status_duplicate;

-- Remove duplicate timestamp indexes (keeping created_at over updated_at when both exist)
DROP INDEX IF EXISTS idx_merchants_updated_at;
DROP INDEX IF EXISTS idx_partners_updated_at;
DROP INDEX IF EXISTS idx_deals_updated_at;
DROP INDEX IF EXISTS idx_academy_courses_updated_at;

-- Remove duplicate slug indexes (keeping unique constraints over plain indexes)
DROP INDEX IF EXISTS idx_merchants_slug_duplicate;
DROP INDEX IF EXISTS idx_academy_courses_slug_duplicate;

-- Remove duplicate email indexes (keeping unique constraints over plain indexes)
DROP INDEX IF EXISTS idx_customers_email;
DROP INDEX IF EXISTS idx_merchants_email;
DROP INDEX IF EXISTS idx_partners_email;