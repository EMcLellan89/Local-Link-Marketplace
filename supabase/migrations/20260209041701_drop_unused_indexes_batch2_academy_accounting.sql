/*
  # Drop Unused Indexes - Batch 2: Academy and Accounting Tables

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Academy tables (certifications, courses, enrollments, lessons, modules, progress, quizzes)
    - Accounting tables (assets, bills, categories, employees, invoices, transactions)

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
    - Unique constraint indexes are preserved
*/

-- Academy table indexes
DROP INDEX IF EXISTS idx_academy_certifications_course_id;
DROP INDEX IF EXISTS idx_academy_certifications_user_id;
DROP INDEX IF EXISTS idx_academy_courses_target_audience;
DROP INDEX IF EXISTS idx_academy_courses_created_at;
DROP INDEX IF EXISTS idx_academy_enrollments_course_id;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id;
DROP INDEX IF EXISTS idx_academy_enrollments_enrolled_at;
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id;
DROP INDEX IF EXISTS idx_academy_lessons_module_id;
DROP INDEX IF EXISTS idx_academy_lessons_order_index;
DROP INDEX IF EXISTS idx_academy_modules_course_id;
DROP INDEX IF EXISTS idx_academy_modules_order_index;
DROP INDEX IF EXISTS idx_academy_progress_user_id;
DROP INDEX IF EXISTS idx_academy_progress_lesson_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_quiz_id;
DROP INDEX IF EXISTS idx_academy_quizzes_course_id;

-- Accounting table indexes
DROP INDEX IF EXISTS idx_accounting_assets_merchant_id;
DROP INDEX IF EXISTS idx_accounting_assets_purchase_date;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_due_date;
DROP INDEX IF EXISTS idx_accounting_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_categories_type;
DROP INDEX IF EXISTS idx_accounting_employees_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_due_date;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_category_id;
DROP INDEX IF EXISTS idx_accounting_transactions_date;