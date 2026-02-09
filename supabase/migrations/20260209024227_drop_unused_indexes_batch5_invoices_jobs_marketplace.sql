/*
  # Drop Unused Indexes - Batch 5: Invoices, Jobs, Marketplace & Merchant Tables

  This migration drops unused indexes from invoicing, job board, marketplace,
  and merchant-related tables.

  ## Tables Affected:
  - Invoice tables
  - Job board tables
  - Marketplace tables
  - Merchant tables

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Invoice indexes
DROP INDEX IF EXISTS idx_invoices_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoices_invoice_date;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_created_at;
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- Job board indexes
DROP INDEX IF EXISTS idx_jobs_partner_id;
DROP INDEX IF EXISTS idx_jobs_status;
DROP INDEX IF EXISTS idx_jobs_job_type;
DROP INDEX IF EXISTS idx_jobs_created_at;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_status;
DROP INDEX IF EXISTS idx_job_applications_submitted_at;

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_products_category;
DROP INDEX IF EXISTS idx_marketplace_products_is_active;
DROP INDEX IF EXISTS idx_marketplace_products_created_at;
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id;
DROP INDEX IF EXISTS idx_marketplace_orders_status;
DROP INDEX IF EXISTS idx_marketplace_orders_created_at;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_product_slug;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_clicked_at;

-- Merchant indexes
DROP INDEX IF EXISTS idx_merchants_user_id;
DROP INDEX IF EXISTS idx_merchants_status;
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_city;
DROP INDEX IF EXISTS idx_merchants_state;
DROP INDEX IF EXISTS idx_merchants_postal_code;
DROP INDEX IF EXISTS idx_merchants_created_at;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_merchant_orders_created_at;