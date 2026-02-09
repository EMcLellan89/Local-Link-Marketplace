/*
  # Drop Unused Indexes - Batch 4: Certificate, Commission, and CRM Tables

  1. Changes
    - Drop unused indexes from certificate and chart tables
    - Drop unused indexes from commission and communication tables
    - Drop unused indexes from crm and course affiliate tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces index maintenance overhead during writes
*/

-- Certificate and categorization tables
DROP INDEX IF EXISTS idx_categorization_rules_coa_id;
DROP INDEX IF EXISTS idx_categorization_rules_merchant_id;
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_certificates_user_id;
DROP INDEX IF EXISTS idx_certificates_issued_user_id;
DROP INDEX IF EXISTS idx_chart_of_accounts_merchant_id;

-- Cleanup and client vault
DROP INDEX IF EXISTS idx_cleanup_quote_requests_merchant_id;
DROP INDEX IF EXISTS idx_cleanup_quote_requests_partner_id;
DROP INDEX IF EXISTS idx_client_vault_artifacts_merchant_id;

-- Commission tables
DROP INDEX IF EXISTS idx_commission_ledger_batch_id;
DROP INDEX IF EXISTS idx_commission_ledger_order_id;
DROP INDEX IF EXISTS idx_commission_ledger_payout_batch_id;
DROP INDEX IF EXISTS idx_commission_ledger_recipient_partner_id;
DROP INDEX IF EXISTS idx_commission_payout_batches_created_by;
DROP INDEX IF EXISTS idx_commission_payout_queue_batch_id;
DROP INDEX IF EXISTS idx_commission_payout_queue_partner_id;
DROP INDEX IF EXISTS idx_commissions_merchant_id;
DROP INDEX IF EXISTS idx_commissions_partner_id;

-- Communications tables
DROP INDEX IF EXISTS idx_communications_subscriptions_product_id;
DROP INDEX IF EXISTS idx_communications_transactions_call_log_id;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_sms_log_id;
DROP INDEX IF EXISTS idx_communications_usage_subscription_id;
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;

-- Course affiliate tables
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_course_affiliates_user_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_course_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;

-- Creative and credit tables
DROP INDEX IF EXISTS idx_creative_events_business;
DROP INDEX IF EXISTS idx_creative_events_creative;
DROP INDEX IF EXISTS idx_creative_events_creative_id;
DROP INDEX IF EXISTS idx_creative_events_partner;
DROP INDEX IF EXISTS idx_creative_events_partner_id;
DROP INDEX IF EXISTS idx_creative_events_profile_id;
DROP INDEX IF EXISTS idx_creative_tests_partner_id;
DROP INDEX IF EXISTS idx_creative_tests_winner_creative_id;
DROP INDEX IF EXISTS idx_creator_agreement_signatures_agreement_id;
DROP INDEX IF EXISTS idx_credit_ledger_user_id;

-- CRM tables
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;
DROP INDEX IF EXISTS idx_crm_bot_training_data_migration_request_id;
DROP INDEX IF EXISTS idx_crm_bot_training_data_validated_by;
DROP INDEX IF EXISTS idx_crm_companies_assigned_to;
DROP INDEX IF EXISTS idx_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_crm_csv_exports_created_by;
DROP INDEX IF EXISTS idx_crm_csv_exports_merchant_id;
DROP INDEX IF EXISTS idx_crm_deals_assigned_to;
DROP INDEX IF EXISTS idx_crm_deals_company_id;
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_leads_merchant_id;
DROP INDEX IF EXISTS idx_crm_migration_requests_merchant_id;
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;
DROP INDEX IF EXISTS idx_crm_notes_company_id;
DROP INDEX IF EXISTS idx_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_crm_notes_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
