/*
  # Drop Unused Indexes - Batch 6: Certificate and Communications Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Certificate indexes
  - Communications and coaching indexes
  - Commission indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- certificates
DROP INDEX IF EXISTS idx_certificates_partner_id;

-- certificates_issued
DROP INDEX IF EXISTS idx_certificates_issued_user_id;

-- coaching_bookings
DROP INDEX IF EXISTS idx_coaching_bookings_merchant_id;
DROP INDEX IF EXISTS idx_coaching_bookings_partner_id;

-- coaching_sessions
DROP INDEX IF EXISTS idx_coaching_sessions_booking_id;

-- commissions
DROP INDEX IF EXISTS idx_commissions_order_id;
DROP INDEX IF EXISTS idx_commissions_partner_id;

-- communications_subscriptions
DROP INDEX IF EXISTS idx_communications_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_communications_subscriptions_partner_id;

-- communications_transactions
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;

-- contract_templates
DROP INDEX IF EXISTS idx_contract_templates_partner_id;

-- contracts
DROP INDEX IF EXISTS idx_contracts_merchant_id;
DROP INDEX IF EXISTS idx_contracts_partner_id;

-- course_product_mappings
DROP INDEX IF EXISTS idx_course_product_mappings_course_id;
DROP INDEX IF EXISTS idx_course_product_mappings_product_id;

-- creative_assets
DROP INDEX IF EXISTS idx_creative_assets_partner_id;

-- creative_performance
DROP INDEX IF EXISTS idx_creative_performance_asset_id;

-- crm_activities
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;

-- crm_contacts
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;

-- crm_deals
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;

-- crm_subscriptions
DROP INDEX IF EXISTS idx_crm_subscriptions_partner_id;

-- crm_tasks
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_contact_id;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
