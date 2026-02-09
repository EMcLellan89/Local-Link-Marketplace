/*
  # Drop Unused Indexes - Part 9: Accounting System
  
  1. Removes unused indexes from accounting tables
  2. Tables affected:
     - accounting_journal_entries, accounting_journal_entry_lines
     - accounting_chart_of_accounts, accounting_fiscal_periods
     - accounting_transactions, accounting_tax_categories
     - accounting_invoices, accounting_bills, accounting_payments
     - accounting_assets, accounting_inventory, accounting_inventory_transactions
     - accounting_payroll, accounting_reconciliations, accounting_tax_reports
     - merchant_comprehensive_stats
*/

-- Drop unused indexes on accounting_journal_entries
DROP INDEX IF EXISTS idx_journal_entries_merchant;
DROP INDEX IF EXISTS idx_journal_entries_date;
DROP INDEX IF EXISTS idx_journal_entries_period;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;

-- Drop unused indexes on accounting_journal_entry_lines
DROP INDEX IF EXISTS idx_journal_entry_lines_entry;
DROP INDEX IF EXISTS idx_journal_entry_lines_account;

-- Drop unused indexes on accounting_chart_of_accounts
DROP INDEX IF EXISTS idx_chart_of_accounts_merchant;
DROP INDEX IF EXISTS idx_chart_of_accounts_type;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;

-- Drop unused indexes on accounting_fiscal_periods
DROP INDEX IF EXISTS idx_fiscal_periods_merchant;
DROP INDEX IF EXISTS idx_fiscal_periods_dates;

-- Drop unused indexes on accounting_transactions
DROP INDEX IF EXISTS idx_transactions_merchant;
DROP INDEX IF EXISTS idx_transactions_date;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_category;
DROP INDEX IF EXISTS idx_transactions_customer;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;

-- Drop unused indexes on accounting_tax_categories
DROP INDEX IF EXISTS idx_tax_categories_merchant;

-- Drop unused indexes on accounting_invoices
DROP INDEX IF EXISTS idx_invoices_merchant;
DROP INDEX IF EXISTS idx_invoices_customer;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;

-- Drop unused indexes on accounting_bills
DROP INDEX IF EXISTS idx_bills_merchant;
DROP INDEX IF EXISTS idx_bills_status;
DROP INDEX IF EXISTS idx_bills_due_date;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;

-- Drop unused indexes on accounting_payments
DROP INDEX IF EXISTS idx_payments_merchant;
DROP INDEX IF EXISTS idx_payments_type;
DROP INDEX IF EXISTS idx_payments_date;
DROP INDEX IF EXISTS idx_payments_invoice;
DROP INDEX IF EXISTS idx_payments_bill;
DROP INDEX IF EXISTS idx_accounting_payments_customer_id;
DROP INDEX IF EXISTS idx_accounting_payments_deposit_account_id;
DROP INDEX IF EXISTS idx_accounting_payments_journal_entry_id;

-- Drop unused indexes on accounting_assets
DROP INDEX IF EXISTS idx_assets_merchant;
DROP INDEX IF EXISTS idx_assets_is_active;

-- Drop unused indexes on accounting_inventory
DROP INDEX IF EXISTS idx_inventory_merchant;
DROP INDEX IF EXISTS idx_inventory_sku;
DROP INDEX IF EXISTS idx_inventory_is_active;

-- Drop unused indexes on accounting_inventory_transactions
DROP INDEX IF EXISTS idx_inventory_transactions_inventory;
DROP INDEX IF EXISTS idx_inventory_transactions_date;

-- Drop unused indexes on accounting_payroll
DROP INDEX IF EXISTS idx_payroll_merchant;
DROP INDEX IF EXISTS idx_payroll_pay_date;
DROP INDEX IF EXISTS idx_payroll_status;
DROP INDEX IF EXISTS idx_accounting_payroll_journal_entry_id;

-- Drop unused indexes on accounting_reconciliations
DROP INDEX IF EXISTS idx_reconciliations_merchant;
DROP INDEX IF EXISTS idx_reconciliations_account;
DROP INDEX IF EXISTS idx_reconciliations_date;
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;

-- Drop unused indexes on accounting_tax_reports
DROP INDEX IF EXISTS idx_tax_reports_merchant;
DROP INDEX IF EXISTS idx_tax_reports_year;
DROP INDEX IF EXISTS idx_tax_reports_type;

-- Drop unused indexes on merchant_comprehensive_stats
DROP INDEX IF EXISTS idx_merchant_stats_merchant;
DROP INDEX IF EXISTS idx_merchant_stats_date;
