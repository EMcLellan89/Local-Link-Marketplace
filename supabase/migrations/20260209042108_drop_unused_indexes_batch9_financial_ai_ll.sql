/*
  # Drop Unused Indexes - Batch 9: Financial, AI, LocalLink Tables

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - AI system tables (events, health, jobs, runs)
    - Financial and accounting tables (bank, transactions, reports)
    - LocalLink autoscale tables
    - Commission and audit tables

  3. Safety
    - Only dropping indexes confirmed as unused (idx_scan = 0)
    - Foreign key indexes are preserved
*/

-- AI system indexes
DROP INDEX IF EXISTS ai_events_entity_idx;
DROP INDEX IF EXISTS ai_events_type_idx;
DROP INDEX IF EXISTS ai_health_snapshots_ts_idx;
DROP INDEX IF EXISTS ai_jobs_due_idx;
DROP INDEX IF EXISTS ai_runs_job_idx;

-- Audit indexes
DROP INDEX IF EXISTS audit_actions_entity_idx;
DROP INDEX IF EXISTS audit_log_merchant_idx;

-- Bank and financial indexes
DROP INDEX IF EXISTS bank_accounts_connection_idx;
DROP INDEX IF EXISTS bank_accounts_merchant_idx;
DROP INDEX IF EXISTS bank_connections_merchant_idx;
DROP INDEX IF EXISTS categorization_rules_merchant_idx;
DROP INDEX IF EXISTS chart_of_accounts_merchant_idx;
DROP INDEX IF EXISTS cleanup_quote_requests_partner_idx;

-- Communication outbox indexes
DROP INDEX IF EXISTS comm_outbox_due_idx;
DROP INDEX IF EXISTS comm_outbox_dead_failed_idx;

-- Commission indexes
DROP INDEX IF EXISTS commissions_created_idx;
DROP INDEX IF EXISTS commissions_merchant_idx;
DROP INDEX IF EXISTS commissions_partner_idx;

-- DFY indexes
DROP INDEX IF EXISTS dfy_intakes_merchant_idx;
DROP INDEX IF EXISTS dfy_updates_intake_idx;

-- Financial system indexes
DROP INDEX IF EXISTS finance_tasks_merchant_idx;
DROP INDEX IF EXISTS financial_reports_merchant_idx;
DROP INDEX IF EXISTS financial_subscriptions_merchant_idx;
DROP INDEX IF EXISTS financial_subscriptions_partner_idx;
DROP INDEX IF EXISTS financial_subscriptions_stripe_idx;

-- LocalLink autoscale indexes
DROP INDEX IF EXISTS ll_autoscale_bot_runs_client_idx;
DROP INDEX IF EXISTS ll_autoscale_bot_runs_status_idx;
DROP INDEX IF EXISTS ll_autoscale_clients_partner_id_idx;
DROP INDEX IF EXISTS ll_autoscale_clients_tier_idx;
DROP INDEX IF EXISTS ll_autoscale_workflows_client_idx;
DROP INDEX IF EXISTS ll_brand_profiles_partner_id_idx;
DROP INDEX IF EXISTS ll_circuit_breakers_client_idx;
DROP INDEX IF EXISTS ll_circuit_breakers_scope_idx;
DROP INDEX IF EXISTS ll_comm_outbox_client_idx;
DROP INDEX IF EXISTS ll_comm_outbox_status_idx;
DROP INDEX IF EXISTS ll_partner_commission_rules_partner_idx;
DROP INDEX IF EXISTS ll_stripe_price_map_tier_idx;

-- Merchant and provider indexes
DROP INDEX IF EXISTS merchant_members_merchant_idx;
DROP INDEX IF EXISTS merchant_members_user_idx;
DROP INDEX IF EXISTS monthly_closes_merchant_idx;
DROP INDEX IF EXISTS monthly_closes_provider_idx;
DROP INDEX IF EXISTS provider_assignments_merchant_idx;
DROP INDEX IF EXISTS provider_assignments_provider_idx;
DROP INDEX IF EXISTS providers_user_idx;

-- Receipt and transaction indexes
DROP INDEX IF EXISTS receipts_linked_tx_idx;
DROP INDEX IF EXISTS receipts_merchant_idx;
DROP INDEX IF EXISTS receipts_status_idx;
DROP INDEX IF EXISTS stripe_customers_user_id_idx;
DROP INDEX IF EXISTS transaction_categorizations_merchant_idx;
DROP INDEX IF EXISTS transactions_account_idx;