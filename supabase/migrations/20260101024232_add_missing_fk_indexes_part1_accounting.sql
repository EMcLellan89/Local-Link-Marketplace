/*
  # Add Missing Foreign Key Indexes - Part 1: Accounting System
  
  1. Adds indexes for all foreign keys in accounting tables
  2. Critical for JOIN performance and DELETE cascades
  3. Tables affected: All accounting_* tables (30+ foreign keys)
*/

-- Accounting Assets
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id 
  ON accounting_assets(merchant_id);

-- Accounting Bills
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id 
  ON accounting_bills(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id 
  ON accounting_bills(journal_entry_id);

-- Accounting Chart of Accounts
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_merchant_id 
  ON accounting_chart_of_accounts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id 
  ON accounting_chart_of_accounts(parent_account_id);

-- Accounting Fiscal Periods
CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id 
  ON accounting_fiscal_periods(merchant_id);

-- Accounting Inventory Transactions
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id 
  ON accounting_inventory_transactions(inventory_id);

-- Accounting Invoices
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_merchant_id 
  ON accounting_invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id 
  ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id 
  ON accounting_invoices(journal_entry_id);

-- Accounting Journal Entries
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_merchant_id 
  ON accounting_journal_entries(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id 
  ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by 
  ON accounting_journal_entries(created_by);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by 
  ON accounting_journal_entries(posted_by);

-- Accounting Journal Entry Lines
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id 
  ON accounting_journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id 
  ON accounting_journal_entry_lines(account_id);

-- Accounting Payments
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id 
  ON accounting_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id 
  ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id 
  ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id 
  ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id 
  ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id 
  ON accounting_payments(journal_entry_id);

-- Accounting Payroll
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id 
  ON accounting_payroll(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id 
  ON accounting_payroll(journal_entry_id);

-- Accounting Reconciliations
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id 
  ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id 
  ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by 
  ON accounting_reconciliations(reconciled_by);

-- Accounting Tax Categories
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id 
  ON accounting_tax_categories(merchant_id);

-- Accounting Tax Reports
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id 
  ON accounting_tax_reports(merchant_id);

-- Accounting Transactions
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id 
  ON accounting_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id 
  ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id 
  ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id 
  ON accounting_transactions(journal_entry_id);
