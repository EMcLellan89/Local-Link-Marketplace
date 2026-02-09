/*
  # Drop Unused Indexes - Batch 1: Accounting Tables
  
  1. Performance Optimization
    - Remove 33 unused indexes from accounting tables
    - These indexes consume storage and slow down write operations
    - No queries are using these indexes
  
  2. Affected Tables
    - accounting_assets, accounting_bills, accounting_chart_of_accounts
    - accounting_fiscal_periods, accounting_inventory_transactions
    - accounting_invoices, accounting_journal_entries, accounting_journal_entry_lines
    - accounting_payments, accounting_payroll, accounting_reconciliations
    - accounting_tax_categories, accounting_tax_reports, accounting_transactions
  
  3. Important Notes
    - These indexes have not been used according to Supabase analysis
    - Foreign key constraints will still enforce referential integrity
    - Primary key indexes are NOT being dropped
*/

-- accounting_assets
DROP INDEX IF EXISTS idx_accounting_assets_merchant_id;

-- accounting_bills
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;

-- accounting_chart_of_accounts
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_merchant_id;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;

-- accounting_fiscal_periods
DROP INDEX IF EXISTS idx_accounting_fiscal_periods_merchant_id;

-- accounting_inventory_transactions
DROP INDEX IF EXISTS idx_accounting_inventory_transactions_inventory_id;

-- accounting_invoices
DROP INDEX IF EXISTS idx_accounting_invoices_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;

-- accounting_journal_entries
DROP INDEX IF EXISTS idx_accounting_journal_entries_merchant_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_fiscal_period_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;

-- accounting_journal_entry_lines
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_account_id;

-- accounting_payments
DROP INDEX IF EXISTS idx_accounting_payments_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payments_customer_id;
DROP INDEX IF EXISTS idx_accounting_payments_invoice_id;
DROP INDEX IF EXISTS idx_accounting_payments_bill_id;
DROP INDEX IF EXISTS idx_accounting_payments_deposit_account_id;
DROP INDEX IF EXISTS idx_accounting_payments_journal_entry_id;

-- accounting_payroll
DROP INDEX IF EXISTS idx_accounting_payroll_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payroll_journal_entry_id;

-- accounting_reconciliations
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_account_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;

-- accounting_tax_categories
DROP INDEX IF EXISTS idx_accounting_tax_categories_merchant_id;

-- accounting_tax_reports
DROP INDEX IF EXISTS idx_accounting_tax_reports_merchant_id;

-- accounting_transactions
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;
