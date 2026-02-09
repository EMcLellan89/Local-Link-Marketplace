/*
  # Add Missing Foreign Key Indexes - Security Audit Batch 1

  1. Purpose
    - Add missing foreign key indexes to improve query performance
    - Addresses security audit findings for unindexed foreign keys

  2. Tables Updated (Batch 1 - Budget Buster & Commission tables)
    - budget_buster_transactions
    - budget_buster_usage_metrics
    - budget_buster_users
    - commission_payout_batches
    - commission_payout_queue
    - creator_agreement_signatures
    - crm_bot_training_data
    - crm_csv_exports
    - crm_deals
    - crm_migration_requests
    - crm_notes
*/

-- Budget Buster tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id
  ON budget_buster_transactions(account_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id
  ON budget_buster_usage_metrics(user_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id
  ON budget_buster_users(profile_id);

CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id
  ON budget_buster_users(referred_by_partner_id);

-- Commission tables
CREATE INDEX IF NOT EXISTS idx_commission_payout_batches_created_by
  ON commission_payout_batches(created_by);

CREATE INDEX IF NOT EXISTS idx_commission_payout_queue_batch_id
  ON commission_payout_queue(batch_id);

CREATE INDEX IF NOT EXISTS idx_commission_payout_queue_partner_id
  ON commission_payout_queue(partner_id);

-- Creator tables
CREATE INDEX IF NOT EXISTS idx_creator_agreement_signatures_agreement_id
  ON creator_agreement_signatures(agreement_id);

-- CRM tables
CREATE INDEX IF NOT EXISTS idx_crm_bot_training_data_migration_request_id
  ON crm_bot_training_data(migration_request_id);

CREATE INDEX IF NOT EXISTS idx_crm_bot_training_data_validated_by
  ON crm_bot_training_data(validated_by);

CREATE INDEX IF NOT EXISTS idx_crm_csv_exports_created_by
  ON crm_csv_exports(created_by);

CREATE INDEX IF NOT EXISTS idx_crm_csv_exports_merchant_id
  ON crm_csv_exports(merchant_id);

CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id
  ON crm_deals(company_id);

CREATE INDEX IF NOT EXISTS idx_crm_migration_requests_merchant_id
  ON crm_migration_requests(merchant_id);

CREATE INDEX IF NOT EXISTS idx_crm_notes_company_id
  ON crm_notes(company_id);

CREATE INDEX IF NOT EXISTS idx_crm_notes_contact_id
  ON crm_notes(contact_id);
