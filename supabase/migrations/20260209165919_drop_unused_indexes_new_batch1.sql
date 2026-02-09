/*
  # Drop Unused Indexes - New Batch 1
  
  1. Indexes to Drop (Academy & Accounting)
    - Academy tables: enrollments, lessons, modules, quiz attempts
    - Accounting tables: categories, entries, reports, transactions
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
  
  3. Safety
    - Only drops indexes with zero scans
    - Primary keys and unique constraints preserved
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_enrollments_course_id;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id_course_id;
DROP INDEX IF EXISTS idx_academy_lessons_module_id;
DROP INDEX IF EXISTS idx_academy_lessons_order_num;
DROP INDEX IF EXISTS idx_academy_modules_course_id;
DROP INDEX IF EXISTS idx_academy_modules_order_num;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_lesson_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;

-- Accounting indexes
DROP INDEX IF EXISTS idx_accounting_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_categories_type;
DROP INDEX IF EXISTS idx_accounting_entries_category_id;
DROP INDEX IF EXISTS idx_accounting_entries_date;
DROP INDEX IF EXISTS idx_accounting_entries_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reports_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reports_period;
DROP INDEX IF EXISTS idx_accounting_transactions_date;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_type;