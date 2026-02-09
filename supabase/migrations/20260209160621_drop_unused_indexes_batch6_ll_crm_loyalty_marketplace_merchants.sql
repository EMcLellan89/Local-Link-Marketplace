/*
  # Drop Unused Indexes - Batch 6: LocalLink CRM, Loyalty, Marketplace & Merchant Tables
  
  1. Tables Affected
    - ll_crm_* tables (LocalLink CRM system)
    - loyalty_* tables
    - marketplace_* tables
    - merchants and merchant_* tables
  
  2. Performance Impact
    - Drops indexes with zero usage per database statistics
    - Improves write performance on frequently updated tables
  
  3. Safety
    - All indexes have idx_scan = 0 indicating no query usage
*/

-- LocalLink CRM
DROP INDEX IF EXISTS idx_ll_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_company_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_company_id;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_invoice_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_deal_id;

-- Loyalty
DROP INDEX IF EXISTS idx_loyalty_programs_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_enrollments_program_id;
DROP INDEX IF EXISTS idx_loyalty_enrollments_customer_id;
DROP INDEX IF EXISTS idx_loyalty_points_transactions_customer_id;

-- Marketplace
DROP INDEX IF EXISTS idx_marketplace_products_merchant_id;
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id;
DROP INDEX IF EXISTS idx_marketplace_orders_merchant_id;
DROP INDEX IF EXISTS idx_marketplace_cart_items_customer_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_customer_id;

-- Merchants
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_applications_submitted_by;
DROP INDEX IF EXISTS idx_merchant_team_members_merchant_id;
DROP INDEX IF EXISTS idx_merchant_team_members_user_id;