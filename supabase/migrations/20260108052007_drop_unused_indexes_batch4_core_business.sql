/*
  # Drop Unused Indexes - Batch 4: Core Business Tables
  
  1. Performance Optimization
    - Remove 60+ unused indexes from core business tables
  
  2. Affected Tables
    - affiliate_clicks, affiliate_partners, affiliate_referrals
    - business_api_keys, batch_transactions, campaign_recipients
    - certificates, admin_sessions, appointment_setting_bookings
    - appointments, audit_logs, business_capital_applications
    - credit_ledger, crm_activities, crm_leads, crm_tasks
    - crm_migrations, customer_memberships
*/

-- affiliate_clicks
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id_idx;
DROP INDEX IF EXISTS idx_affiliate_clicks_referral_code_idx;
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_idx;

-- affiliate_partners
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_code;

-- affiliate_referrals
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner;

-- batch_transactions
DROP INDEX IF EXISTS idx_batch_transactions_transaction_id;

-- business_api_keys
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_api_keys_business_unit;
DROP INDEX IF EXISTS idx_business_api_keys_active;
DROP INDEX IF EXISTS idx_business_api_keys_key;

-- campaign_recipients
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;

-- certificates
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_certificates_user;
DROP INDEX IF EXISTS idx_certificates_code;

-- admin_sessions
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- appointment_setting_bookings
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;

-- appointments
DROP INDEX IF EXISTS idx_appointments_customer_id;

-- audit_logs
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;

-- business_capital_applications
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;

-- credit_ledger
DROP INDEX IF EXISTS idx_credit_ledger_user_id;

-- crm_activities
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;

-- crm_leads
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;

-- crm_migrations
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;

-- crm_tasks
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;

-- customer_memberships
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
