/*
  # Drop Unused Indexes - Batch 5: Customer and Deal Tables

  1. Changes
    - Drop unused indexes from customer_* tables
    - Drop unused indexes from deal_* tables
    - Drop unused indexes from dashboard tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves database write performance
*/

-- Customer activity and assets
DROP INDEX IF EXISTS idx_customer_activity_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_activity_log_customer_id;
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;
DROP INDEX IF EXISTS idx_customer_asset_grants_asset_id;
DROP INDEX IF EXISTS idx_customer_business_relationships_business_unit_id;
DROP INDEX IF EXISTS idx_customer_business_relationships_customer_id;

-- Customer email and impersonation
DROP INDEX IF EXISTS idx_customer_email_segments_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_created_by;
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_customer_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_team_member_id;

-- Customer memberships and preferences
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;

-- Customer referral tables
DROP INDEX IF EXISTS idx_customer_referral_links_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_links_merchant_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_merchant_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_referrer_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_merchant_id;
DROP INDEX IF EXISTS idx_customer_referrals_referee_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_referrer_customer_id;

-- Customer rewards
DROP INDEX IF EXISTS idx_customer_reward_rules_merchant_org_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_customer_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_merchant_org_id;

-- Customer support
DROP INDEX IF EXISTS idx_customer_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_customer_support_tickets_business_unit_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_customer_id;

-- Customers and dashboard
DROP INDEX IF EXISTS idx_customers_referred_by_partner_id;
DROP INDEX IF EXISTS idx_customers_user_id;
DROP INDEX IF EXISTS idx_dashboard_metrics_merchant_id;

-- Deal tables
DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_locations_location_id;
DROP INDEX IF EXISTS idx_deal_performance_stats_deal_id;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;
DROP INDEX IF EXISTS idx_deal_transactions_bundle;
DROP INDEX IF EXISTS idx_deal_transactions_campaign_id;
DROP INDEX IF EXISTS idx_deal_transactions_created;
DROP INDEX IF EXISTS idx_deal_transactions_customer_id;
DROP INDEX IF EXISTS idx_deal_transactions_deal;
DROP INDEX IF EXISTS idx_deal_transactions_deal_id;
DROP INDEX IF EXISTS idx_deal_transactions_merchant;
DROP INDEX IF EXISTS idx_deal_transactions_merchant_id;
DROP INDEX IF EXISTS idx_deal_transactions_partner;
DROP INDEX IF EXISTS idx_deal_transactions_partner_id;
DROP INDEX IF EXISTS idx_deal_transactions_status;
DROP INDEX IF EXISTS idx_deal_transactions_vendor;
DROP INDEX IF EXISTS idx_deal_transactions_vendor_id;
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;
