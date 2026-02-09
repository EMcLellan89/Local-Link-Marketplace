/*
  # Drop Unused Indexes - New Batch 13
  
  1. Indexes to Drop (Business Systems)
    - Business units and bundles
    - Certificates and certifications
    - Coaching services
    - Communications hub
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Business indexes
DROP INDEX IF EXISTS idx_business_units_name;
DROP INDEX IF EXISTS idx_business_units_status;
DROP INDEX IF EXISTS idx_partner_bundles_partner_id;
DROP INDEX IF EXISTS idx_partner_bundles_status;

-- Certificate indexes
DROP INDEX IF EXISTS idx_certificates_issued_at;
DROP INDEX IF EXISTS idx_certificates_user_id;
DROP INDEX IF EXISTS idx_partner_certifications_certification_id;
DROP INDEX IF EXISTS idx_partner_certifications_partner_id;

-- Coaching indexes
DROP INDEX IF EXISTS idx_coaching_sessions_coach_id;
DROP INDEX IF EXISTS idx_coaching_sessions_merchant_id;
DROP INDEX IF EXISTS idx_coaching_sessions_scheduled_at;
DROP INDEX IF EXISTS idx_coaching_sessions_status;

-- Communications indexes
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_type;
DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_email_subscriptions_status;
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_campaigns_status;