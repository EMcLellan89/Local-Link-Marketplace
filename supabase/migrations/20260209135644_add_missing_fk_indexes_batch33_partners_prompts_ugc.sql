/*
  # Add Missing Foreign Key Indexes - Batch 33: Partners, Prompts & UGC

  1. Changes
    - Add indexes for partner_referrals (merchant_id)
    - Add indexes for partner_ai_commissions (merchant_id, partner_id)
    - Add indexes for prompts (category_id)
    - Add indexes for credit_ledger (user_id)
    - Add indexes for prompt_runs (prompt_id, user_id)
    - Add indexes for ugc_orders (merchant_id, creator_id, package_id)
    - Add indexes for ugc_assets (order_id)
    - Add indexes for ugc_payouts (creator_id, order_id)
    - Add indexes for social_ugc_subscriptions (merchant_id, package_id)
    - Add indexes for community_sponsorships (merchant_id)
    
  2. Rationale
    - Partner AI tracking needs merchant and partner queries
    - Prompt system requires category and user lookups
    - UGC orders need merchant, creator, and package filtering
    
  3. Performance Impact
    - Faster partner commission calculations
    - Better prompt execution tracking
    - Improved UGC order management
*/

-- Partner Referrals
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON partner_referrals(merchant_id);

-- Partner AI Commissions
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON partner_ai_commissions(partner_id);

-- Prompts
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);

-- Credit Ledger
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);

-- Prompt Runs
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);

-- UGC Orders
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id ON ugc_orders(package_id);

-- UGC Assets
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id ON ugc_assets(order_id);

-- UGC Payouts
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id ON ugc_payouts(order_id);

-- Social UGC Subscriptions
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id ON social_ugc_subscriptions(package_id);

-- Community Sponsorships
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id ON community_sponsorships(merchant_id);
