/*
  # Drop Unused Indexes - Batch 8: Invoices, Jobs, Loyalty

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Invoice and billing tables
    - Job board and hiring tables
    - Loyalty and rewards tables
    - Gift cards and memberships

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- Invoice indexes
DROP INDEX IF EXISTS idx_invoices_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_created_at;
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_items_product_id;
DROP INDEX IF EXISTS idx_accounting_invoices_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_status;

-- Job board indexes
DROP INDEX IF EXISTS idx_jobs_merchant_id;
DROP INDEX IF EXISTS idx_jobs_partner_id;
DROP INDEX IF EXISTS idx_jobs_status;
DROP INDEX IF EXISTS idx_jobs_category;
DROP INDEX IF EXISTS idx_jobs_created_at;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_applicant_id;
DROP INDEX IF EXISTS idx_job_applications_status;
DROP INDEX IF EXISTS idx_hire_jobs_merchant_id;
DROP INDEX IF EXISTS idx_hire_jobs_status;

-- Loyalty program indexes
DROP INDEX IF EXISTS idx_loyalty_programs_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_programs_active;
DROP INDEX IF EXISTS idx_loyalty_members_program_id;
DROP INDEX IF EXISTS idx_loyalty_members_customer_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_member_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_type;
DROP INDEX IF EXISTS idx_loyalty_transactions_created_at;
DROP INDEX IF EXISTS idx_loyalty_contract_uploads_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_contract_uploads_created_at;

-- Gift card and membership indexes
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;
DROP INDEX IF EXISTS idx_gift_cards_customer_id;
DROP INDEX IF EXISTS idx_gift_cards_status;
DROP INDEX IF EXISTS idx_gift_cards_created_at;
DROP INDEX IF EXISTS idx_memberships_merchant_id;
DROP INDEX IF EXISTS idx_memberships_customer_id;
DROP INDEX IF EXISTS idx_memberships_status;
DROP INDEX IF EXISTS idx_memberships_expires_at;