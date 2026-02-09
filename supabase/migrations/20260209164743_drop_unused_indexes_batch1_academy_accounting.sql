/*
  # Drop Unused Indexes - Batch 1: Academy and Accounting
  
  Removes indexes that have never been scanned (idx_scan = 0) according to pg_stat_user_indexes.
  These indexes consume storage and slow down write operations without providing query benefits.
  
  ## Tables Covered:
  - academy_* tables
  - accounting_* tables
  
  ## Safety:
  - All drops use IF EXISTS
  - Indexes can be recreated if needed
  - Only dropping indexes with 0 scans
*/

-- Academy tables
DROP INDEX IF EXISTS idx_academy_courses_created_at;
DROP INDEX IF EXISTS idx_academy_courses_updated_at;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id;
DROP INDEX IF EXISTS idx_academy_lesson_progress_completed_at;
DROP INDEX IF EXISTS idx_academy_lesson_progress_user_id;
DROP INDEX IF EXISTS idx_academy_lessons_created_at;
DROP INDEX IF EXISTS idx_academy_lessons_updated_at;
DROP INDEX IF EXISTS idx_academy_modules_created_at;
DROP INDEX IF EXISTS idx_academy_modules_updated_at;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;
DROP INDEX IF EXISTS idx_academy_quiz_questions_created_at;

-- Accounting tables
DROP INDEX IF EXISTS idx_accounting_accounts_merchant_id;
DROP INDEX IF EXISTS idx_accounting_assets_created_at;
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_created_at;