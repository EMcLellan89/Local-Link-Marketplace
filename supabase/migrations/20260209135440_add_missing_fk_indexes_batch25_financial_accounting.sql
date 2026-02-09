/*
  # Add Missing Foreign Key Indexes - Batch 25: Financial Subscriptions & Accounting

  1. Changes
    - Add indexes for provider_assignments (provider_id)
    - Add indexes for financial_subscriptions (merchant_id, partner_id, plan_id)
    - Add indexes for receipts (merchant_id)
    - Add indexes for bank_connections (merchant_id)
    - Add indexes for bank_accounts (connection_id, merchant_id)
    - Add indexes for transactions (account_id, merchant_id)
    - Add indexes for chart_of_accounts (merchant_id)
    - Add indexes for transaction_categorizations (coa_id, merchant_id)
    - Add indexes for monthly_closes (provider_id)
    - Add indexes for finance_tasks (merchant_id)
    - Add indexes for categorization_rules (coa_id, merchant_id)
    - Add indexes for rule_suggestions (suggested_coa_id)
    
  2. Rationale
    - Financial operations require fast merchant lookups
    - Bank connections need efficient account queries
    - Transaction categorization needs chart of accounts indexing
    
  3. Performance Impact
    - Faster financial dashboard loading
    - Better transaction categorization
    - Improved accounting reports
*/

-- Provider Assignments
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider_id ON provider_assignments(provider_id);

-- Financial Subscriptions
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_merchant_id ON financial_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_partner_id ON financial_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_plan_id ON financial_subscriptions(plan_id);

-- Receipts
CREATE INDEX IF NOT EXISTS idx_receipts_merchant_id ON receipts(merchant_id);

-- Bank Connections
CREATE INDEX IF NOT EXISTS idx_bank_connections_merchant_id ON bank_connections(merchant_id);

-- Bank Accounts
CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_id ON bank_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_merchant_id ON bank_accounts(merchant_id);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);

-- Chart of Accounts
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_merchant_id ON chart_of_accounts(merchant_id);

-- Transaction Categorizations
CREATE INDEX IF NOT EXISTS idx_transaction_categorizations_coa_id ON transaction_categorizations(coa_id);
CREATE INDEX IF NOT EXISTS idx_transaction_categorizations_merchant_id ON transaction_categorizations(merchant_id);

-- Monthly Closes
CREATE INDEX IF NOT EXISTS idx_monthly_closes_provider_id ON monthly_closes(provider_id);

-- Finance Tasks
CREATE INDEX IF NOT EXISTS idx_finance_tasks_merchant_id ON finance_tasks(merchant_id);

-- Categorization Rules
CREATE INDEX IF NOT EXISTS idx_categorization_rules_coa_id ON categorization_rules(coa_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_merchant_id ON categorization_rules(merchant_id);

-- Rule Suggestions
CREATE INDEX IF NOT EXISTS idx_rule_suggestions_suggested_coa_id ON rule_suggestions(suggested_coa_id);
