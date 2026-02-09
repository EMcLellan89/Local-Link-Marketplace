/*
  # Drop Unused Indexes - New Batch 6
  
  1. Indexes to Drop (Invoices, Jobs, Loyalty, Marketplace, Merchants)
    - Invoice system indexes
    - Job board indexes
    - Loyalty program
    - Marketplace
    - Merchant data
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Invoice indexes
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_merchant_id;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- Job indexes
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_partner_id;
DROP INDEX IF EXISTS idx_job_applications_status;
DROP INDEX IF EXISTS idx_jobs_merchant_id;
DROP INDEX IF EXISTS idx_jobs_status;
DROP INDEX IF EXISTS idx_jobs_type;

-- Loyalty indexes
DROP INDEX IF EXISTS idx_loyalty_programs_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_customer_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_program_id;

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id;
DROP INDEX IF EXISTS idx_marketplace_orders_product_id;
DROP INDEX IF EXISTS idx_marketplace_orders_status;
DROP INDEX IF EXISTS idx_marketplace_products_category;
DROP INDEX IF EXISTS idx_marketplace_products_status;

-- Merchant indexes
DROP INDEX IF EXISTS idx_merchants_email;
DROP INDEX IF EXISTS idx_merchants_status;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_status;