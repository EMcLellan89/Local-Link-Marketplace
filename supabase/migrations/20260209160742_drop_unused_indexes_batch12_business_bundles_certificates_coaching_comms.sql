/*
  # Drop Unused Indexes - Batch 12: Business, Bundles, Certificates, Coaching & Communications Tables
  
  1. Tables Affected
    - business_* tables
    - bundle_* tables
    - certificate_* tables
    - coaching_* tables
    - communications_* tables
  
  2. Performance Impact
    - Drops unused indexes to improve write performance
    - Reduces storage requirements
  
  3. Safety
    - All indexes have zero usage count
*/

-- Business tables
DROP INDEX IF EXISTS idx_business_deals_merchant_id;
DROP INDEX IF EXISTS idx_business_deals_partner_id;
DROP INDEX IF EXISTS idx_business_ad_flat_commissions_partner_id;
DROP INDEX IF EXISTS idx_business_recurring_ad_commissions_partner_id;

-- Bundles
DROP INDEX IF EXISTS idx_bundles_merchant_id;
DROP INDEX IF EXISTS idx_bundle_items_bundle_id;
DROP INDEX IF EXISTS idx_bundle_purchases_customer_id;
DROP INDEX IF EXISTS idx_partner_bundles_partner_id;

-- Certificates
DROP INDEX IF EXISTS idx_certificates_user_id;
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_academy_certificates_course_id;
DROP INDEX IF EXISTS idx_partner_certs_partner_id;

-- Coaching
DROP INDEX IF EXISTS idx_coaching_sessions_coach_id;
DROP INDEX IF EXISTS idx_coaching_sessions_client_id;
DROP INDEX IF EXISTS idx_coaching_packages_coach_id;
DROP INDEX IF EXISTS idx_business_coaching_sessions_client_id;

-- Communications
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;
DROP INDEX IF EXISTS idx_communications_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_communications_usage_merchant_id;
DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;