/*
  # Drop Unused Indexes - Part 7: Partner System
  
  1. Removes unused indexes from partner-related tables
  2. Tables affected:
     - partners, partner_applications, territories, certifications
     - qr_codes, transactions, payout_batches, audit_logs
     - expansion_requests, partner_warning_logs, partner_settings
*/

-- Drop unused indexes on partners
DROP INDEX IF EXISTS idx_partners_email;
DROP INDEX IF EXISTS idx_partners_status;
DROP INDEX IF EXISTS idx_partners_user_id_fk;

-- Drop unused indexes on partner_applications
DROP INDEX IF EXISTS idx_applications_status;
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;

-- Drop unused indexes on territories
DROP INDEX IF EXISTS idx_territories_status;
DROP INDEX IF EXISTS idx_territories_partner;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;

-- Drop unused indexes on certifications
DROP INDEX IF EXISTS idx_certifications_partner;
DROP INDEX IF EXISTS idx_certifications_status;

-- Drop unused indexes on qr_codes
DROP INDEX IF EXISTS idx_qr_codes_partner;

-- Drop unused indexes on transactions
DROP INDEX IF EXISTS idx_transactions_partner;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created;
DROP INDEX IF EXISTS idx_transactions_deal_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id_fk;
DROP INDEX IF EXISTS idx_transactions_territory_id;

-- Drop unused indexes on payout_batches
DROP INDEX IF EXISTS idx_payout_batches_partner;
DROP INDEX IF EXISTS idx_payout_batches_status;

-- Drop unused indexes on audit_logs
DROP INDEX IF EXISTS idx_audit_logs_actor;
DROP INDEX IF EXISTS idx_audit_logs_entity;
DROP INDEX IF EXISTS idx_audit_logs_created;

-- Drop unused indexes on expansion_requests
DROP INDEX IF EXISTS idx_expansion_requests_partner;
DROP INDEX IF EXISTS idx_expansion_requests_status;
DROP INDEX IF EXISTS idx_expansion_requests_created;

-- Drop unused indexes on partner_warning_logs
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_code;
DROP INDEX IF EXISTS idx_partner_warning_logs_created_at;

-- Drop unused indexes on partner_settings
DROP INDEX IF EXISTS idx_partner_settings_partner_id;

-- Drop unused indexes on batch_transactions
DROP INDEX IF EXISTS idx_batch_transactions_transaction_id;
