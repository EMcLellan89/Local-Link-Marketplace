/*
  # Drop Unused Indexes - Final Batch 4 (Cart, Certificates, Communications, Course)

  This migration removes unused indexes from cart, certificate, communication, and course tables.

  Tables covered:
  - campaign_recipients
  - cart_items
  - certificates
  - certificates_issued
  - commissions
  - communications_subscriptions
  - communications_transactions
  - community_sponsorships
  - course_affiliate_payouts
  - course_affiliate_referrals
  - course_exam_attempts
  - credit_ledger
  - crm_activities
  - crm_deals
  - crm_leads
  - crm_migrations
  - crm_notes
  - crm_tasks
*/

-- Campaign and Cart
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;

-- Certificates
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_certificates_issued_user_id;

-- Commissions and Communications
DROP INDEX IF EXISTS idx_commissions_order_id;
DROP INDEX IF EXISTS idx_communications_subscriptions_product_id;
DROP INDEX IF EXISTS idx_communications_transactions_call_log_id;
DROP INDEX IF EXISTS idx_communications_transactions_sms_log_id;
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;

-- Course Tables
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;

-- CRM Tables
DROP INDEX IF EXISTS idx_credit_ledger_user_id;
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;
DROP INDEX IF EXISTS idx_crm_notes_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;