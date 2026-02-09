/*
  # Drop Duplicate Indexes
  
  Removes 9 duplicate indexes identified by the audit.
  These are indexes that have identical definitions to other existing indexes.
  
  ## Safety:
  - Uses IF EXISTS for safe dropping
  - Only the duplicate is dropped, primary index remains
  - Can be recreated if needed
*/

-- Drop duplicate indexes (keeping the primary/original index)
DROP INDEX IF EXISTS idx_academy_courses_target_audience_duplicate;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id_duplicate;
DROP INDEX IF EXISTS idx_academy_lessons_module_id_duplicate;
DROP INDEX IF EXISTS idx_academy_modules_course_id_duplicate;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id_duplicate;
DROP INDEX IF EXISTS idx_marketplace_products_creator_id_duplicate;
DROP INDEX IF EXISTS idx_merchants_user_id_duplicate;
DROP INDEX IF EXISTS idx_partners_user_id_duplicate;
DROP INDEX IF EXISTS idx_reviews_merchant_id_duplicate;