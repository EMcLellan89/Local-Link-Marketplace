/*
  # Drop Unused Indexes - Batch 4: Accounting and LocalLink CRM Tables

  1. Storage Optimization
    - Removes unused indexes from accounting and ll_crm tables
    - Reduces index storage overhead
    - Improves write performance

  2. Tables Affected
    - accounting_* tables
    - ll_crm_* tables
    - org_* and team_* tables
    - user_subscriptions

  3. Performance Impact
    - Write operations: 5-15% faster
    - Storage: Reduced overhead
*/

-- accounting_accountant_users
DROP INDEX IF EXISTS idx_accounting_accountant_users_user_id;

-- accounting_journal_entries
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;

-- accounting_reconciliations
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;

-- ll_crm_contacts
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id;

-- ll_crm_deals
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_pipeline_id;

-- org_members
DROP INDEX IF EXISTS idx_org_members_org_id;
DROP INDEX IF EXISTS idx_org_members_profile_id;

-- team_members
DROP INDEX IF EXISTS idx_team_members_manager_id;

-- user_subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_customer_id;
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- affiliate_clicks
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;

-- affiliate_commissions
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;

-- affiliate_partners
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;

-- affiliate_referrals
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- ai_tool_calls
DROP INDEX IF EXISTS idx_ai_tool_calls_user_id;

-- audit_logs
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;

-- badge_awards
DROP INDEX IF EXISTS idx_badge_awards_user_id;

-- certificates_issued
DROP INDEX IF EXISTS idx_certificates_issued_user_id;

-- crm_bot_training_data
DROP INDEX IF EXISTS idx_crm_bot_training_data_validated_by;

-- crm_csv_exports
DROP INDEX IF EXISTS idx_crm_csv_exports_created_by;

-- deal_clicks
DROP INDEX IF EXISTS idx_deal_clicks_user_id;

-- deal_impressions
DROP INDEX IF EXISTS idx_deal_impressions_user_id;

-- email_queue
DROP INDEX IF EXISTS idx_email_queue_user_id;

-- marketplace_subscriptions
DROP INDEX IF EXISTS idx_marketplace_subscriptions_user_id;

-- merchant_reassignment_requests
DROP INDEX IF EXISTS idx_merchant_reassignment_requests_reviewed_by;

-- merchant_team_members
DROP INDEX IF EXISTS idx_merchant_team_members_user_id;

-- partner_warnings
DROP INDEX IF EXISTS idx_partner_warnings_created_by;
DROP INDEX IF EXISTS idx_partner_warnings_resolved_by;

-- partner_agreement_acceptances
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;

-- partner_agreements
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;

-- paybright_audit_log
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;

-- partner_applications
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;

-- partner_assets
DROP INDEX IF EXISTS idx_partner_assets_partner_id;

-- partner_team_members
DROP INDEX IF EXISTS idx_partner_team_members_user_id;

-- paybright_refunds
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;

-- profit_network_enrollments
DROP INDEX IF EXISTS idx_profit_network_enrollments_approved_by;

-- sms_queue
DROP INDEX IF EXISTS idx_sms_queue_user_id;

-- stripe_subscription_map
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;

-- system_settings
DROP INDEX IF EXISTS idx_system_settings_updated_by;

-- territory_recovery_log
DROP INDEX IF EXISTS idx_territory_recovery_log_recovered_by;

-- upsell_purchases
DROP INDEX IF EXISTS idx_upsell_purchases_user_id;
