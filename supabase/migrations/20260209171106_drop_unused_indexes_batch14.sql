/*
  # Drop Unused Indexes - Batch 14
*/

DROP INDEX IF EXISTS idx_marketplace_commissions_partner_id;
DROP INDEX IF EXISTS idx_org_members_profile_id;
DROP INDEX IF EXISTS idx_partner_relationships_merchant_org_id;
DROP INDEX IF EXISTS idx_subscription_items_plan_id;
DROP INDEX IF EXISTS idx_dfy_content_items_pack_id;
DROP INDEX IF EXISTS idx_merchant_campaign_installs_dfy_campaign_id;
DROP INDEX IF EXISTS idx_merchant_campaign_installs_org_id;
DROP INDEX IF EXISTS idx_merchant_content_installs_dfy_content_item_id;
DROP INDEX IF EXISTS idx_merchant_content_installs_org_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_merchant_org_id;
DROP INDEX IF EXISTS idx_reward_redemptions_customer_id;
DROP INDEX IF EXISTS idx_reward_redemptions_merchant_org_id;
DROP INDEX IF EXISTS idx_product_asset_access_asset_id;
DROP INDEX IF EXISTS idx_customer_asset_grants_asset_id;
DROP INDEX IF EXISTS idx_profit_network_ad_costs_partner_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_enrollment_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_partner_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_sale_id;
DROP INDEX IF EXISTS idx_profit_network_statements_enrollment_id;
DROP INDEX IF EXISTS idx_story_books_project_id;
