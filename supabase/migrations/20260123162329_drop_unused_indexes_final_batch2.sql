/*
  # Drop Unused Indexes - Final Batch 2 (Accounting Tables)

  This migration removes unused indexes from accounting-related tables.

  Tables covered:
  - accounting_accountant_users
  - accounting_assets
  - accounting_bills
  - accounting_chart_of_accounts
  - accounting_employees
  - accounting_fiscal_periods
  - accounting_inventory_transactions
  - accounting_invoices
  - accounting_journal_entries
  - accounting_journal_entry_lines
  - accounting_payments
  - accounting_payroll
  - accounting_reconciliations
  - accounting_tax_categories
  - accounting_tax_reports
  - accounting_transactions
*/

-- Accounting Tables
DROP INDEX IF EXISTS idx_accounting_accountant_users_user_id;
DROP INDEX IF EXISTS idx_accounting_assets_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;
DROP INDEX IF EXISTS idx_accounting_employees_team_member_id;
DROP INDEX IF EXISTS idx_accounting_fiscal_periods_merchant_id;
DROP INDEX IF EXISTS idx_accounting_inventory_transactions_inventory_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_fiscal_period_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_account_id;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payments_bill_id;
DROP INDEX IF EXISTS idx_accounting_payments_customer_id;
DROP INDEX IF EXISTS idx_accounting_payments_deposit_account_id;
DROP INDEX IF EXISTS idx_accounting_payments_invoice_id;
DROP INDEX IF EXISTS idx_accounting_payments_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payments_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payroll_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payroll_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_account_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;
DROP INDEX IF EXISTS idx_accounting_tax_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_tax_reports_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;