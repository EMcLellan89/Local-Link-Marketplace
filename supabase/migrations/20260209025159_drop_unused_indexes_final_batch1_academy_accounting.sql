/*
  # Drop Unused Indexes - Final Batch 1: Academy & Accounting

  1. Purpose
    - Remove indexes that are not being used by query planner
    - Keep only essential indexes for foreign keys and frequently queried columns
  
  2. Impact
    - Reduces storage overhead
    - Improves write performance (fewer indexes to maintain)
    - Reduces WAL overhead
  
  3. Safety
    - Using DROP INDEX IF EXISTS for safe execution
    - Keeping all foreign key indexes that were just added
*/

-- Drop redundant academy indexes (keeping FK indexes we just added)
DROP INDEX IF EXISTS idx_academy_certifications_created_at;
DROP INDEX IF EXISTS idx_academy_enrollments_created_at;
DROP INDEX IF EXISTS idx_academy_progress_created_at;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_created_at;

-- Drop redundant accounting indexes (keeping FK indexes)
DROP INDEX IF EXISTS idx_accounting_transactions_created_at;
DROP INDEX IF EXISTS idx_accounting_invoices_created_at;
DROP INDEX IF EXISTS idx_accounting_bills_created_at;
DROP INDEX IF EXISTS idx_accounting_payments_created_at;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_at;
