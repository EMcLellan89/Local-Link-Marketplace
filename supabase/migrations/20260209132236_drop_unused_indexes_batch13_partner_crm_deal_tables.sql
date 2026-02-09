/*
  # Drop Unused Indexes - Batch 13: Partner CRM and Deal Tables

  1. Changes
    - Drop unused indexes from partner_crm_* tables
    - Drop unused indexes from partner_deal_* tables
    - Drop unused indexes from partner_customer_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves database performance
*/

-- Partner CRM tables
DROP INDEX IF EXISTS idx_partner_crm_companies_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_deal_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_deal_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_company_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;

-- Partner customer links
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;
DROP INDEX IF EXISTS idx_partner_customer_links_partner_id;

-- Partner deal links
DROP INDEX IF EXISTS idx_partner_deal_links_bundle_id;
DROP INDEX IF EXISTS idx_partner_deal_links_deal;
DROP INDEX IF EXISTS idx_partner_deal_links_deal_id;
DROP INDEX IF EXISTS idx_partner_deal_links_partner;
DROP INDEX IF EXISTS idx_partner_deal_links_partner_id;
DROP INDEX IF EXISTS idx_partner_deal_links_tracking;
DROP INDEX IF EXISTS idx_partner_deal_sync_log_partner_deal_id;

-- Partner DFY and earnings
DROP INDEX IF EXISTS idx_partner_dfy_tracking_links_product_id;
DROP INDEX IF EXISTS idx_partner_earnings_simulator_partner_id;
DROP INDEX IF EXISTS idx_partner_earnings_simulator_plan_code;

-- Partner ledger and milestones
DROP INDEX IF EXISTS idx_partner_ledger_campaign_id;
DROP INDEX IF EXISTS idx_partner_ledger_partner_id;
DROP INDEX IF EXISTS idx_partner_milestone_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_milestone_certs_cert_id;

-- Partner notifications and onboarding
DROP INDEX IF EXISTS idx_partner_notifications_partner_id;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;

-- Partner outreach logs
DROP INDEX IF EXISTS idx_partner_outreach_logs_partner_id;
