/*
  # Drop Remaining Unused Indexes - Final Cleanup

  1. Changes
    - Drop 10 additional unused indexes that were missed in previous cleanup
    - These indexes are never used by the PostgreSQL query planner
    - Improves write performance and reduces storage overhead

  2. Performance Impact
    - Faster INSERT, UPDATE, DELETE operations on affected tables
    - Reduced index maintenance overhead
    - Cleaner database structure

  3. Indexes Dropped
    - idx_merchant_reassignment_merchant (merchant_reassignment_requests)
    - idx_territory_recovery_partner (territory_recovery_log)
    - idx_merchants_residual_end (merchants)
    - idx_w9_docs_partner, idx_w9_docs_envelope, idx_w9_docs_status (partner_w9_documents)
    - idx_docusign_webhooks_processed (docusign_webhooks)
    - idx_partner_1099_partner_id, idx_partner_1099_w9_document_id (partner_1099_documents)
    - idx_security_audit_log_audit_date, idx_security_audit_log_audit_type (security_audit_log)
*/

-- Drop merchant reassignment index
DROP INDEX IF EXISTS idx_merchant_reassignment_merchant;

-- Drop territory recovery index
DROP INDEX IF EXISTS idx_territory_recovery_partner;

-- Drop merchants residual end index
DROP INDEX IF EXISTS idx_merchants_residual_end;

-- Drop W9 documents indexes
DROP INDEX IF EXISTS idx_w9_docs_partner;
DROP INDEX IF EXISTS idx_w9_docs_envelope;
DROP INDEX IF EXISTS idx_w9_docs_status;

-- Drop DocuSign webhook index
DROP INDEX IF EXISTS idx_docusign_webhooks_processed;

-- Drop partner 1099 indexes
DROP INDEX IF EXISTS idx_partner_1099_partner_id;
DROP INDEX IF EXISTS idx_partner_1099_w9_document_id;

-- Drop security audit log indexes
DROP INDEX IF EXISTS idx_security_audit_log_audit_date;
DROP INDEX IF EXISTS idx_security_audit_log_audit_type;
