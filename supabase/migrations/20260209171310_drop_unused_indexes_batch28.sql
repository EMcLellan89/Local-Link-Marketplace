/*
  # Drop Unused Indexes - Batch 28
*/

DROP INDEX IF EXISTS idx_merchant_members_user_id;
DROP INDEX IF EXISTS idx_provider_assignments_merchant_id;
DROP INDEX IF EXISTS idx_providers_user_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id_fk;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id_fk;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id_fk;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id_fk;
DROP INDEX IF EXISTS idx_blog_posts_author_id_fk;
DROP INDEX IF EXISTS idx_budget_buster_accounts_user_id_fk;
DROP INDEX IF EXISTS idx_budget_buster_transactions_account_id_fk;
DROP INDEX IF EXISTS idx_budget_buster_usage_metrics_user_id_fk;
DROP INDEX IF EXISTS idx_bundle_items_bundle_id_fk;
DROP INDEX IF EXISTS idx_certificates_user_id_fk;
DROP INDEX IF EXISTS idx_chart_of_accounts_merchant_id_fk;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id_fk;
DROP INDEX IF EXISTS idx_creative_events_partner_id_fk;
DROP INDEX IF EXISTS idx_crm_csv_exports_merchant_id_fk;
DROP INDEX IF EXISTS idx_crm_migration_requests_merchant_id_fk;
DROP INDEX IF EXISTS idx_crm_notes_contact_id_fk;
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant_id_fk;
