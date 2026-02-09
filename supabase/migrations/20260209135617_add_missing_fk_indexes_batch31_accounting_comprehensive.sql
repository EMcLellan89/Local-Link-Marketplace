/*
  # Add Missing Foreign Key Indexes - Batch 31: Comprehensive Accounting System

  1. Changes
    - Add indexes for accounting_chart_of_accounts (parent_account_id)
    - Add indexes for accounting_fiscal_periods (merchant_id)
    - Add indexes for accounting_journal_entries (fiscal_period_id, created_by, posted_by)
    - Add indexes for accounting_journal_entry_lines (account_id, journal_entry_id)
    - Add indexes for accounting_transactions (all foreign keys)
    - Add indexes for accounting_tax_categories (merchant_id)
    - Add indexes for accounting_invoices (customer_id, journal_entry_id)
    - Add indexes for accounting_bills (merchant_id, journal_entry_id)
    - Add indexes for accounting_payments (all foreign keys)
    
  2. Rationale
    - Comprehensive accounting requires extensive indexing
    - Journal entries need period and user lookups
    - Transaction queries are high volume
    
  3. Performance Impact
    - Faster financial reporting
    - Better journal entry queries
    - Improved payment tracking
*/

-- Chart of Accounts
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id ON accounting_chart_of_accounts(parent_account_id);

-- Fiscal Periods
CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id ON accounting_fiscal_periods(merchant_id);

-- Journal Entries
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by ON accounting_journal_entries(created_by);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by ON accounting_journal_entries(posted_by);

-- Journal Entry Lines
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id ON accounting_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id ON accounting_journal_entry_lines(journal_entry_id);

-- Accounting Transactions
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);

-- Tax Categories
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id ON accounting_tax_categories(merchant_id);

-- Accounting Invoices
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id ON accounting_invoices(journal_entry_id);

-- Accounting Bills
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id ON accounting_bills(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);

-- Accounting Payments
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id ON accounting_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id ON accounting_payments(journal_entry_id);
