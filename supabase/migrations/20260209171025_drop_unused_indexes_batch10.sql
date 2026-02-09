/*
  # Drop Unused Indexes - Batch 10
*/

DROP INDEX IF EXISTS idx_customer_business_relationships_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_customer_id;
DROP INDEX IF EXISTS idx_internal_invoices_created_by;
DROP INDEX IF EXISTS idx_unified_sales_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_customer_id;
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_business_unit_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_customer_support_tickets_business_unit_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_ticket_messages_ticket_id;
DROP INDEX IF EXISTS idx_customer_activity_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_activity_log_customer_id;
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_customer_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_team_member_id;
