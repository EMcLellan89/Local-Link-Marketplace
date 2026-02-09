/*
  # Add Missing Foreign Key Indexes - Batch 1 (DFY & Accounting)

  Adds indexes for foreign keys that are missing covering indexes.
  This improves JOIN performance and query optimization.
  
  Tables covered:
  - DFY tables (dfy_addons, dfy_orders, dfy_commission_ledger)
  - Accounting tables (accounting_accountant_users through accounting_transactions)
*/

-- DFY Tables
CREATE INDEX IF NOT EXISTS idx_dfy_addons_product_id ON dfy_addons(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_commission_ledger_order_id ON dfy_commission_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id ON dfy_orders(product_id);

-- Accounting Tables
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
