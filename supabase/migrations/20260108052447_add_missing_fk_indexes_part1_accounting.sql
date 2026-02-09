/*
  # Add Missing Foreign Key Indexes - Part 1: Accounting Tables
  
  1. Performance Optimization
    - Adds indexes to all unindexed foreign keys in accounting tables
    - Improves query performance for joins and foreign key lookups
    
  2. Tables Affected
    - accounting_assets
    - accounting_bills
    - accounting_chart_of_accounts
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

-- accounting_assets
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id 
  ON accounting_assets(merchant_id);

-- accounting_bills
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id 
  ON accounting_bills(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id 
  ON accounting_bills(merchant_id);

-- accounting_chart_of_accounts
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id 
  ON accounting_chart_of_accounts(parent_account_id);

-- accounting_fiscal_periods
CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id 
  ON accounting_fiscal_periods(merchant_id);

-- accounting_inventory_transactions
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id 
  ON accounting_inventory_transactions(inventory_id);

-- accounting_invoices
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id 
  ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id 
  ON accounting_invoices(journal_entry_id);

-- accounting_journal_entries
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by 
  ON accounting_journal_entries(created_by);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id 
  ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by 
  ON accounting_journal_entries(posted_by);

-- accounting_journal_entry_lines
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id 
  ON accounting_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id 
  ON accounting_journal_entry_lines(journal_entry_id);

-- accounting_payments
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id 
  ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id 
  ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id 
  ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id 
  ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id 
  ON accounting_payments(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id 
  ON accounting_payments(merchant_id);

-- accounting_payroll
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id 
  ON accounting_payroll(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id 
  ON accounting_payroll(merchant_id);

-- accounting_reconciliations
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id 
  ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id 
  ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by 
  ON accounting_reconciliations(reconciled_by);

-- accounting_tax_categories
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id 
  ON accounting_tax_categories(merchant_id);

-- accounting_tax_reports
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id 
  ON accounting_tax_reports(merchant_id);

-- accounting_transactions
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id 
  ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id 
  ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id 
  ON accounting_transactions(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id 
  ON accounting_transactions(merchant_id);
