/*
  # Drop Unused Indexes - Batch 1: Academy & Accounting Tables
  
  1. Tables Affected
    - academy_* tables (courses, modules, lessons, quiz attempts, enrollments, etc.)
    - accounting_* tables (categories, transactions, reconciliations, etc.)
  
  2. Performance Impact
    - Removes indexes that have never been used according to pg_stat_user_indexes
    - Reduces storage overhead and improves write performance
    - No impact on query performance as these indexes are not being utilized
  
  3. Safety
    - All indexes listed have 0 idx_scan count in pg_stat_user_indexes
    - Can be recreated if needed in future
*/

-- Academy tables
DROP INDEX IF EXISTS idx_course_modules_course_id;
DROP INDEX IF EXISTS idx_course_lessons_module_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id;
DROP INDEX IF EXISTS idx_academy_enrollments_course_id;
DROP INDEX IF EXISTS idx_academy_lesson_completions_user_id;
DROP INDEX IF EXISTS idx_academy_lesson_completions_lesson_id;
DROP INDEX IF EXISTS idx_academy_certificates_user_id;
DROP INDEX IF EXISTS idx_academy_exam_questions_course_id;
DROP INDEX IF EXISTS idx_course_progress_user_id;
DROP INDEX IF EXISTS idx_course_progress_course_id;

-- Accounting tables
DROP INDEX IF EXISTS idx_accounting_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_category_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_partner_id;
DROP INDEX IF EXISTS idx_partner_accounting_categories_partner_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_merchant_id;
DROP INDEX IF EXISTS idx_accounting_accounts_merchant_id;
DROP INDEX IF EXISTS idx_accounting_tax_records_merchant_id;
DROP INDEX IF EXISTS idx_chart_of_accounts_merchant_id;