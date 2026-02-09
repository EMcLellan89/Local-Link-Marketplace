/*
  # Add Missing Foreign Key Indexes - Batch 21: Orgs, Subscriptions & DFY (Final)

  1. Changes
    - Add indexes for org_members (profile_id)
    - Add indexes for partner_relationships (merchant_org_id)
    - Add indexes for subscriptions (plan_id)
    - Add indexes for subscription_items (plan_id)
    - Add indexes for dfy_content_items (pack_id)
    - Add indexes for merchant_campaign_installs (dfy_campaign_id, org_id)
    - Add indexes for merchant_content_installs (dfy_content_item_id, org_id)
    - Add indexes for customer_rewards_ledger (customer_id, merchant_org_id)
    - Add indexes for reward_redemptions (customer_id, merchant_org_id)
    - Add indexes for blog_posts (author_id, category_id)
    - Add indexes for product_asset_access (asset_id)
    - Add indexes for customer_asset_grants (asset_id)
    
  2. Rationale
    - Organization management requires member lookups
    - Subscription tracking needs plan queries
    - DFY content installation needs campaign and org filtering
    - Rewards system needs customer and merchant queries
    
  3. Performance Impact
    - Faster org member queries
    - Better subscription management
    - Improved DFY content tracking
    - Enhanced rewards calculations
*/

-- Org Members
CREATE INDEX IF NOT EXISTS idx_org_members_profile_id ON org_members(profile_id);

-- Partner Relationships
CREATE INDEX IF NOT EXISTS idx_partner_relationships_merchant_org_id ON partner_relationships(merchant_org_id);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- Subscription Items
CREATE INDEX IF NOT EXISTS idx_subscription_items_plan_id ON subscription_items(plan_id);

-- DFY Content Items
CREATE INDEX IF NOT EXISTS idx_dfy_content_items_pack_id ON dfy_content_items(pack_id);

-- Merchant Campaign Installs
CREATE INDEX IF NOT EXISTS idx_merchant_campaign_installs_dfy_campaign_id ON merchant_campaign_installs(dfy_campaign_id);
CREATE INDEX IF NOT EXISTS idx_merchant_campaign_installs_org_id ON merchant_campaign_installs(org_id);

-- Merchant Content Installs
CREATE INDEX IF NOT EXISTS idx_merchant_content_installs_dfy_content_item_id ON merchant_content_installs(dfy_content_item_id);
CREATE INDEX IF NOT EXISTS idx_merchant_content_installs_org_id ON merchant_content_installs(org_id);

-- Customer Rewards Ledger
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_customer_id ON customer_rewards_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_merchant_org_id ON customer_rewards_ledger(merchant_org_id);

-- Reward Redemptions
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer_id ON reward_redemptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_merchant_org_id ON reward_redemptions(merchant_org_id);

-- Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);

-- Product Asset Access
CREATE INDEX IF NOT EXISTS idx_product_asset_access_asset_id ON product_asset_access(asset_id);

-- Customer Asset Grants
CREATE INDEX IF NOT EXISTS idx_customer_asset_grants_asset_id ON customer_asset_grants(asset_id);
