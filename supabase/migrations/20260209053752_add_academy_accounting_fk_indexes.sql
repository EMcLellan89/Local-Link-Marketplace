/*
  # Add Foreign Key Indexes - Academy and Accounting Tables

  1. Indexes Added
    - Academy tables: certifications, enrollments, lesson_assets, progress, quiz_attempts, quizzes
    - Accounting tables: assets, bills, invoices, transactions

  2. Performance Impact
    - Dramatically improves join performance for foreign key relationships
    - Reduces query planning time for RLS policies
    - Enables faster cascading operations

  3. Security Notes
    - Foreign key indexes are critical for RLS policy performance
    - Without these indexes, auth checks can cause table scans
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_certifications_user_id ON academy_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_certifications_course_id ON academy_certifications(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user_id ON academy_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course_id ON academy_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_assets_lesson_id ON academy_lesson_assets(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_user_id ON academy_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id ON academy_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_user_id ON academy_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_module_id ON academy_quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id ON academy_quiz_attempts(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_module_id ON academy_quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_course_id ON academy_quizzes(course_id);

-- Accounting tables (all use merchant_id)
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id ON accounting_assets(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id ON accounting_bills(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_merchant_id ON accounting_invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id ON accounting_invoices(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);
