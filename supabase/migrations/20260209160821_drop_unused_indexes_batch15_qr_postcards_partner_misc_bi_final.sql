/*
  # Drop Unused Indexes - Batch 15: QR Codes, Postcards, Partner Misc & BI Tables (Final)
  
  1. Tables Affected
    - qr_* tables
    - postcard_* tables
    - partner service/upline tables
    - bi_* tables (Business Intelligence)
    - Remaining miscellaneous tables
  
  2. Performance Impact
    - Final cleanup of unused indexes
    - Completes index optimization across all tables
  
  3. Safety
    - All indexes verified as unused
*/

-- QR codes
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;
DROP INDEX IF EXISTS idx_qr_codes_deal_id;
DROP INDEX IF EXISTS idx_qr_scans_qr_code_id;

-- Postcards
DROP INDEX IF EXISTS idx_postcard_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_postcard_orders_merchant_id;
DROP INDEX IF EXISTS idx_postcard_mailings_campaign_id;

-- Partner misc tables
DROP INDEX IF EXISTS idx_partner_service_qualifications_partner_id;
DROP INDEX IF EXISTS idx_partner_uplines_partner_id;
DROP INDEX IF EXISTS idx_partner_uplines_upline_id;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_settings_partner_id;
DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id;
DROP INDEX IF EXISTS idx_partner_deal_sync_log_partner_id;
DROP INDEX IF EXISTS idx_project_assignments_partner_id;
DROP INDEX IF EXISTS idx_outreach_logs_partner_id;

-- BI dashboards
DROP INDEX IF EXISTS idx_bi_dashboards_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;
DROP INDEX IF EXISTS idx_bi_metrics_merchant_id;

-- Remaining misc
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_audit_logs_entity_id;
DROP INDEX IF EXISTS idx_webhook_events_merchant_id;
DROP INDEX IF EXISTS idx_api_keys_merchant_id;