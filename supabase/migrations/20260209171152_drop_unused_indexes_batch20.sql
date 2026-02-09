/*
  # Drop Unused Indexes - Batch 20
*/

DROP INDEX IF EXISTS idx_accounting_fiscal_periods_merchant_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_fiscal_period_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_account_id;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_tax_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payments_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payments_customer_id;
DROP INDEX IF EXISTS idx_accounting_payments_invoice_id;
DROP INDEX IF EXISTS idx_accounting_payments_bill_id;
DROP INDEX IF EXISTS idx_accounting_payments_deposit_account_id;
DROP INDEX IF EXISTS idx_accounting_payments_journal_entry_id;
