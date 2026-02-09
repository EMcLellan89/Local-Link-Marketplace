/*
  # Drop Unused Indexes - Batch 17
*/

DROP INDEX IF EXISTS idx_bank_accounts_connection_id;
DROP INDEX IF EXISTS idx_bank_accounts_merchant_id;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP INDEX IF EXISTS idx_transaction_categorizations_coa_id;
DROP INDEX IF EXISTS idx_transaction_categorizations_merchant_id;
DROP INDEX IF EXISTS idx_monthly_closes_provider_id;
DROP INDEX IF EXISTS idx_finance_tasks_merchant_id;
DROP INDEX IF EXISTS idx_categorization_rules_coa_id;
DROP INDEX IF EXISTS idx_categorization_rules_merchant_id;
DROP INDEX IF EXISTS idx_rule_suggestions_suggested_coa_id;
DROP INDEX IF EXISTS idx_dfy_intakes_merchant_id;
DROP INDEX IF EXISTS idx_dfy_intakes_provider_id;
DROP INDEX IF EXISTS idx_dfy_updates_intake_id;
DROP INDEX IF EXISTS idx_cleanup_quote_requests_merchant_id;
DROP INDEX IF EXISTS idx_cleanup_quote_requests_partner_id;
DROP INDEX IF EXISTS idx_commissions_merchant_id;
DROP INDEX IF EXISTS idx_commissions_partner_id;
DROP INDEX IF EXISTS idx_client_vault_artifacts_merchant_id;
DROP INDEX IF EXISTS idx_partner_earnings_simulator_plan_code;
DROP INDEX IF EXISTS idx_ai_runs_job_id;
