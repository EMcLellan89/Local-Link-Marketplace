/*
  # Drop Unused Indexes - Final Batch 7 (Gift Cards and Internal CRM)

  This migration removes unused indexes from gift card and internal CRM tables.

  Tables covered:
  - gift_card_templates
  - gift_card_transactions
  - gift_cards
  - internal_accounting_ledger
  - internal_invoices
  - invoice_items
  - invoice_payments
  - invoices
  - job_assignments
  - job_deliverables
  - job_payouts
  - jobs
  - lead_list_orders
  - loyalty_events
*/

-- Gift Card Tables
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;

-- Internal CRM Tables
DROP INDEX IF EXISTS idx_internal_accounting_ledger_business_unit_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;
DROP INDEX IF EXISTS idx_internal_invoices_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_created_by;
DROP INDEX IF EXISTS idx_internal_invoices_customer_id;

-- Invoice Tables
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;

-- Job Tables
DROP INDEX IF EXISTS idx_job_assignments_assigned_by_admin_id;
DROP INDEX IF EXISTS idx_job_deliverables_partner_id;
DROP INDEX IF EXISTS idx_job_deliverables_reviewed_by_admin_id;
DROP INDEX IF EXISTS idx_job_payouts_merchant_id;
DROP INDEX IF EXISTS idx_jobs_created_by_admin_id;

-- Other Tables
DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;