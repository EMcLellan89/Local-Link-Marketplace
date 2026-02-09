/*
  # Add Missing Foreign Key Indexes - Batch 32: Accounting Assets & Reconciliation

  1. Changes
    - Add indexes for accounting_assets (merchant_id)
    - Add indexes for accounting_inventory_transactions (inventory_id)
    - Add indexes for accounting_payroll (merchant_id, journal_entry_id)
    - Add indexes for accounting_reconciliations (merchant_id, account_id, reconciled_by)
    - Add indexes for accounting_tax_reports (merchant_id)
    - Add indexes for invoices (customer_id)
    - Add indexes for invoice_items (invoice_id)
    - Add indexes for invoice_payments (invoice_id, merchant_id)
    - Add indexes for expenses (merchant_id)
    
  2. Rationale
    - Asset tracking needs merchant filtering
    - Payroll requires merchant and journal queries
    - Reconciliation needs account and user lookups
    
  3. Performance Impact
    - Faster asset depreciation calculations
    - Better payroll processing
    - Improved reconciliation management
*/

-- Accounting Assets
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id ON accounting_assets(merchant_id);

-- Inventory Transactions
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id ON accounting_inventory_transactions(inventory_id);

-- Payroll
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id ON accounting_payroll(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id ON accounting_payroll(journal_entry_id);

-- Reconciliations
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by ON accounting_reconciliations(reconciled_by);

-- Tax Reports
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id ON accounting_tax_reports(merchant_id);

-- Invoices (non-accounting prefix)
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);

-- Invoice Items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Invoice Payments
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id ON invoice_payments(merchant_id);

-- Expenses
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);
