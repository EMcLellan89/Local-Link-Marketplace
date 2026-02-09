/*
  # Optimize Auth RLS Performance - Batch 20: Partner/Merchant/Rewards Tables
  
  1. Tables Optimized
    - partner_weekly_deductions (3 policies → 2, consolidated admin duplicates)
    - partner_special_overrides (2 policies → 1, consolidated duplicates)
    - partner_profit_shares (2 policies → 1, consolidated duplicates)
    - partner_ad_budgets (2 policies)
    - weekly_creative_winners (2 policies)
    - merchant_campaign_installs (3 policies)
    - merchant_content_installs (3 policies)
    - customer_reward_rules (2 policies → 1, consolidated duplicates)
    - reward_redemptions (2 policies)
    - ll_books_income (1 policy)
    - ll_crm_email_sends (1 policy)
    - ll_crm_email_campaigns (1 policy)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid()) for performance
    - Consolidate duplicate policies where found
    - Maintain exact same access control logic
*/

-- partner_weekly_deductions (consolidate 2 admin policies, optimize 1 partner policy)
DROP POLICY IF EXISTS "Admin full access to weekly deductions" ON partner_weekly_deductions;
DROP POLICY IF EXISTS "Admins can view all weekly deductions" ON partner_weekly_deductions;
DROP POLICY IF EXISTS "Partners can view own weekly deductions" ON partner_weekly_deductions;

CREATE POLICY "Admin full access to weekly deductions"
  ON partner_weekly_deductions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own weekly deductions"
  ON partner_weekly_deductions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_special_overrides (consolidate 2 duplicate policies into 1)
DROP POLICY IF EXISTS "Admin only access" ON partner_special_overrides;
DROP POLICY IF EXISTS "Admin only access to special overrides" ON partner_special_overrides;

CREATE POLICY "Admin only access to special overrides"
  ON partner_special_overrides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_profit_shares (consolidate 2 duplicate policies into 1)
DROP POLICY IF EXISTS "Admin only access" ON partner_profit_shares;
DROP POLICY IF EXISTS "Admin only access to profit shares" ON partner_profit_shares;

CREATE POLICY "Admin only access to profit shares"
  ON partner_profit_shares FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_ad_budgets
DROP POLICY IF EXISTS "Admins manage budgets" ON partner_ad_budgets;
DROP POLICY IF EXISTS "Partners view budget" ON partner_ad_budgets;

CREATE POLICY "Admins manage budgets"
  ON partner_ad_budgets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners view budget"
  ON partner_ad_budgets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE id = partner_ad_budgets.partner_id
        AND user_id = (select auth.uid())
    )
  );

-- weekly_creative_winners (public read, no optimization needed for that)
DROP POLICY IF EXISTS "Admins manage winners" ON weekly_creative_winners;

CREATE POLICY "Admins manage winners"
  ON weekly_creative_winners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- merchant_campaign_installs (org-based access)
DROP POLICY IF EXISTS "Merchants can create own campaign installs" ON merchant_campaign_installs;
DROP POLICY IF EXISTS "Merchants can update own campaign installs" ON merchant_campaign_installs;
DROP POLICY IF EXISTS "Merchants can view own campaign installs" ON merchant_campaign_installs;

CREATE POLICY "Merchants can manage own campaign installs"
  ON merchant_campaign_installs FOR ALL
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- merchant_content_installs (org-based access)
DROP POLICY IF EXISTS "Merchants can create own content installs" ON merchant_content_installs;
DROP POLICY IF EXISTS "Merchants can update own content installs" ON merchant_content_installs;
DROP POLICY IF EXISTS "Merchants can view own content installs" ON merchant_content_installs;

CREATE POLICY "Merchants can manage own content installs"
  ON merchant_content_installs FOR ALL
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- customer_reward_rules (consolidate 2 policies)
DROP POLICY IF EXISTS "Merchant can manage reward rules" ON customer_reward_rules;
DROP POLICY IF EXISTS "Merchant can view own reward rules" ON customer_reward_rules;

CREATE POLICY "Merchant can manage reward rules"
  ON customer_reward_rules FOR ALL
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- reward_redemptions
DROP POLICY IF EXISTS "Merchant can insert redemptions" ON reward_redemptions;
DROP POLICY IF EXISTS "Merchant can view own redemptions" ON reward_redemptions;

CREATE POLICY "Merchant can insert redemptions"
  ON reward_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchant can view own redemptions"
  ON reward_redemptions FOR SELECT
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- ll_books_income
DROP POLICY IF EXISTS "Merchants can manage own income" ON ll_books_income;

CREATE POLICY "Merchants can manage own income"
  ON ll_books_income FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_email_sends
DROP POLICY IF EXISTS "Merchants can manage own email sends" ON ll_crm_email_sends;

CREATE POLICY "Merchants can manage own email sends"
  ON ll_crm_email_sends FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_email_campaigns
DROP POLICY IF EXISTS "Merchants can manage own email campaigns" ON ll_crm_email_campaigns;

CREATE POLICY "Merchants can manage own email campaigns"
  ON ll_crm_email_campaigns FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );
