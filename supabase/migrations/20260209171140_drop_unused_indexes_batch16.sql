/*
  # Drop Unused Indexes - Batch 16
*/

DROP INDEX IF EXISTS idx_external_sale_commissions_external_system_id;
DROP INDEX IF EXISTS idx_business_deals_vendor_id;
DROP INDEX IF EXISTS idx_bundle_items_deal_id;
DROP INDEX IF EXISTS idx_deal_transactions_bundle_id;
DROP INDEX IF EXISTS idx_deal_transactions_campaign_id;
DROP INDEX IF EXISTS idx_deal_transactions_customer_id;
DROP INDEX IF EXISTS idx_deal_transactions_deal_id;
DROP INDEX IF EXISTS idx_deal_transactions_merchant_id;
DROP INDEX IF EXISTS idx_deal_transactions_partner_id;
DROP INDEX IF EXISTS idx_deal_transactions_vendor_id;
DROP INDEX IF EXISTS idx_partner_deal_links_bundle_id;
DROP INDEX IF EXISTS idx_partner_deal_links_deal_id;
DROP INDEX IF EXISTS idx_admin_crm_companies_source_id;
DROP INDEX IF EXISTS idx_team_member_commissions_team_member_id;
DROP INDEX IF EXISTS idx_team_member_goals_team_member_id;
DROP INDEX IF EXISTS idx_provider_assignments_provider_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_receipts_merchant_id;
DROP INDEX IF EXISTS idx_bank_connections_merchant_id;
