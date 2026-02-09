/*
  # Drop Unused Indexes - Batch 21
*/

DROP INDEX IF EXISTS idx_budget_buster_users_profile_id;
DROP INDEX IF EXISTS idx_budget_buster_users_referred_by_partner_id;
DROP INDEX IF EXISTS idx_commission_payout_batches_created_by;
DROP INDEX IF EXISTS idx_commission_payout_queue_batch_id;
DROP INDEX IF EXISTS idx_commission_payout_queue_partner_id;
DROP INDEX IF EXISTS idx_creator_agreement_signatures_agreement_id;
DROP INDEX IF EXISTS idx_crm_bot_training_data_migration_request_id;
DROP INDEX IF EXISTS idx_crm_bot_training_data_validated_by;
DROP INDEX IF EXISTS idx_crm_csv_exports_created_by;
DROP INDEX IF EXISTS idx_crm_deals_company_id;
DROP INDEX IF EXISTS idx_accounting_inventory_transactions_inventory_id;
DROP INDEX IF EXISTS idx_accounting_payroll_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payroll_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_account_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;
DROP INDEX IF EXISTS idx_accounting_tax_reports_merchant_id;
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;
DROP INDEX IF EXISTS idx_expenses_merchant_id;
DROP INDEX IF EXISTS idx_crm_notes_company_id;
