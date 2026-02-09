/*
  # Add Missing Foreign Key Indexes - Batch 14: External Sales & Financial Engine

  1. New Indexes
    - external_sales.merchant_id
    - external_sales.partner_id
    - external_sales.product_id
    - financial_accounts.merchant_id
    - financial_accounts.provider_id
    - financial_ai_categorization.merchant_id
    - financial_ai_categorization.transaction_id
    - financial_bank_transactions.account_id
    - financial_bank_transactions.merchant_id
    - financial_business_plans.merchant_id
    - financial_documents.merchant_id
    - financial_monthly_close.merchant_id
    - financial_pnl_snapshots.merchant_id
    - financial_receipts.merchant_id
    - financial_receipts.transaction_id
    - financial_rule_assignments.merchant_id
    - financial_rule_assignments.rule_id
    - financial_subscriptions.merchant_id
    - financial_subscriptions.plan_id

  2. Performance Impact
    - Improves external sales tracking and commission calculations
    - Optimizes financial transaction and accounting queries
*/

-- External Sales Indexes
CREATE INDEX IF NOT EXISTS idx_external_sales_merchant_id ON external_sales(merchant_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_partner_id ON external_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_product_id ON external_sales(product_id);

-- Financial Engine Indexes
CREATE INDEX IF NOT EXISTS idx_financial_accounts_merchant_id ON financial_accounts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_provider_id ON financial_accounts(provider_id);
CREATE INDEX IF NOT EXISTS idx_financial_ai_categorization_merchant_id ON financial_ai_categorization(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_ai_categorization_transaction_id ON financial_ai_categorization(transaction_id);
CREATE INDEX IF NOT EXISTS idx_financial_bank_transactions_account_id ON financial_bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_bank_transactions_merchant_id ON financial_bank_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_business_plans_merchant_id ON financial_business_plans(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_documents_merchant_id ON financial_documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_monthly_close_merchant_id ON financial_monthly_close(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_pnl_snapshots_merchant_id ON financial_pnl_snapshots(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_receipts_merchant_id ON financial_receipts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_receipts_transaction_id ON financial_receipts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_financial_rule_assignments_merchant_id ON financial_rule_assignments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_rule_assignments_rule_id ON financial_rule_assignments(rule_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_merchant_id ON financial_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_plan_id ON financial_subscriptions(plan_id);
