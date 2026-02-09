/*
  # Drop Unused Indexes - Batch 1: Academy & Accounting Tables

  This migration drops unused indexes identified by Supabase security scan.
  Removing unused indexes improves write performance and reduces storage overhead.

  ## Tables Affected:
  - Academy tables (courses, modules, lessons)
  - Accounting tables (transactions, invoices)
  - Admin tables

  ## Safety:
  Only dropping indexes that are confirmed unused and not supporting any constraints.
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_courses_slug;
DROP INDEX IF EXISTS idx_academy_courses_target_audience;
DROP INDEX IF EXISTS idx_academy_courses_difficulty_level;
DROP INDEX IF EXISTS idx_academy_courses_is_published;
DROP INDEX IF EXISTS idx_academy_courses_is_featured;
DROP INDEX IF EXISTS idx_academy_courses_created_at;
DROP INDEX IF EXISTS idx_academy_modules_course_id;
DROP INDEX IF EXISTS idx_academy_modules_display_order;
DROP INDEX IF EXISTS idx_academy_lessons_module_id;
DROP INDEX IF EXISTS idx_academy_lessons_course_id;
DROP INDEX IF EXISTS idx_academy_lessons_content_type;
DROP INDEX IF EXISTS idx_academy_lessons_is_preview;

-- Accounting indexes
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_transaction_date;
DROP INDEX IF EXISTS idx_accounting_transactions_transaction_type;
DROP INDEX IF EXISTS idx_accounting_transactions_category;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_is_reconciled;

-- Admin indexes
DROP INDEX IF EXISTS idx_admin_users_email;
DROP INDEX IF EXISTS idx_admin_appointments_admin_id;
DROP INDEX IF EXISTS idx_admin_appointments_scheduled_at;
DROP INDEX IF EXISTS idx_admin_appointments_status;