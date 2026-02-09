/*
  # Fix Missing Foreign Key Indexes - Batch 1 (Accounting Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys in accounting tables
    - Improves JOIN performance and foreign key constraint checking
  
  2. Tables Updated
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

-- Accounting tables foreign key indexes
CREATE INDEX IF NOT EXISTS idx_accounting_accountant_users_user_id ON accounting_accountant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id ON accounting_assets(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id ON accounting_bills(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id ON accounting_chart_of_accounts(parent_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employees_team_member_id ON accounting_employees(team_member_id);
CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id ON accounting_fiscal_periods(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id ON accounting_inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id ON accounting_invoices(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by ON accounting_journal_entries(created_by);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by ON accounting_journal_entries(posted_by);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id ON accounting_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id ON accounting_journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id ON accounting_payments(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id ON accounting_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id ON accounting_payroll(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id ON accounting_payroll(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by ON accounting_reconciliations(reconciled_by);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id ON accounting_tax_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id ON accounting_tax_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);
