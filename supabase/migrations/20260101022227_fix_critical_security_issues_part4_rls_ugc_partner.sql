/*
  # Fix Critical Security Issues - Part 4: Optimize RLS Policies (UGC & Partner Systems)
  
  1. Updates UGC, partner, and other RLS policies to use (select auth.uid()) pattern
  2. Affects tables:
     - merchant_comprehensive_stats
     - ugc_packages, ugc_orders, ugc_creators, ugc_assets, ugc_payouts
     - partner_referrals, partner_ai_commissions
     - credit_ledger, prompt_runs, onboarding_progress
*/

-- merchant_comprehensive_stats
DROP POLICY IF EXISTS "Merchants can view own comprehensive stats" ON merchant_comprehensive_stats;
DROP POLICY IF EXISTS "System can update merchant comprehensive stats" ON merchant_comprehensive_stats;

CREATE POLICY "Merchants can view own comprehensive stats" 
  ON merchant_comprehensive_stats FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "System can update merchant comprehensive stats" 
  ON merchant_comprehensive_stats FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- ugc_packages
DROP POLICY IF EXISTS "Admins can manage packages" ON ugc_packages;

CREATE POLICY "Admins can manage packages" 
  ON ugc_packages FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  );

-- ugc_orders
DROP POLICY IF EXISTS "Admins can manage all orders" ON ugc_orders;
DROP POLICY IF EXISTS "Creators can update assigned orders" ON ugc_orders;
DROP POLICY IF EXISTS "Creators can view assigned orders" ON ugc_orders;
DROP POLICY IF EXISTS "Merchants can view own orders" ON ugc_orders;

CREATE POLICY "Admins can manage all orders" 
  ON ugc_orders FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Creators can update assigned orders" 
  ON ugc_orders FOR UPDATE 
  TO authenticated 
  USING (
    creator_id IN (
      SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    creator_id IN (
      SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Creators can view assigned orders" 
  ON ugc_orders FOR SELECT 
  TO authenticated 
  USING (
    creator_id IN (
      SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own orders" 
  ON ugc_orders FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- ugc_creators
DROP POLICY IF EXISTS "Admins can manage all creators" ON ugc_creators;
DROP POLICY IF EXISTS "Creators can update own profile" ON ugc_creators;
DROP POLICY IF EXISTS "Creators can view own profile" ON ugc_creators;

CREATE POLICY "Admins can manage all creators" 
  ON ugc_creators FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Creators can update own profile" 
  ON ugc_creators FOR UPDATE 
  TO authenticated 
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Creators can view own profile" 
  ON ugc_creators FOR SELECT 
  TO authenticated 
  USING (user_id = (select auth.uid()));

-- ugc_assets
DROP POLICY IF EXISTS "Admins can manage all assets" ON ugc_assets;
DROP POLICY IF EXISTS "Creators can upload to their orders" ON ugc_assets;
DROP POLICY IF EXISTS "Order participants can view assets" ON ugc_assets;

CREATE POLICY "Admins can manage all assets" 
  ON ugc_assets FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Creators can upload to their orders" 
  ON ugc_assets FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ugc_orders 
      WHERE ugc_orders.id = order_id 
      AND ugc_orders.creator_id IN (
        SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Order participants can view assets" 
  ON ugc_assets FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM ugc_orders 
      WHERE ugc_orders.id = order_id 
      AND (
        ugc_orders.creator_id IN (
          SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
        )
        OR ugc_orders.merchant_id IN (
          SELECT id FROM merchants WHERE user_id = (select auth.uid())
        )
      )
    )
  );

-- ugc_payouts
DROP POLICY IF EXISTS "Admins can manage all payouts" ON ugc_payouts;
DROP POLICY IF EXISTS "Creators can view own payouts" ON ugc_payouts;

CREATE POLICY "Admins can manage all payouts" 
  ON ugc_payouts FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Creators can view own payouts" 
  ON ugc_payouts FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM ugc_orders 
      WHERE ugc_orders.id = order_id 
      AND ugc_orders.creator_id IN (
        SELECT id FROM ugc_creators WHERE user_id = (select auth.uid())
      )
    )
  );

-- partner_referrals
DROP POLICY IF EXISTS "partner_referrals_insert_own" ON partner_referrals;
DROP POLICY IF EXISTS "partner_referrals_select_own" ON partner_referrals;

CREATE POLICY "partner_referrals_insert_own" 
  ON partner_referrals FOR INSERT 
  TO authenticated 
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "partner_referrals_select_own" 
  ON partner_referrals FOR SELECT 
  TO authenticated 
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- partner_ai_commissions
DROP POLICY IF EXISTS "partner_ai_commissions_select_own" ON partner_ai_commissions;

CREATE POLICY "partner_ai_commissions_select_own" 
  ON partner_ai_commissions FOR SELECT 
  TO authenticated 
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- credit_ledger
DROP POLICY IF EXISTS "credit_ledger_select_own" ON credit_ledger;

CREATE POLICY "credit_ledger_select_own" 
  ON credit_ledger FOR SELECT 
  TO authenticated 
  USING (user_id = (select auth.uid()));

-- prompt_runs
DROP POLICY IF EXISTS "prompt_runs_select_own" ON prompt_runs;

CREATE POLICY "prompt_runs_select_own" 
  ON prompt_runs FOR SELECT 
  TO authenticated 
  USING (user_id = (select auth.uid()));

-- onboarding_progress
DROP POLICY IF EXISTS "onboarding_insert_own" ON onboarding_progress;
DROP POLICY IF EXISTS "onboarding_select_own" ON onboarding_progress;
DROP POLICY IF EXISTS "onboarding_update_own" ON onboarding_progress;

CREATE POLICY "onboarding_insert_own" 
  ON onboarding_progress FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "onboarding_select_own" 
  ON onboarding_progress FOR SELECT 
  TO authenticated 
  USING (user_id = (select auth.uid()));

CREATE POLICY "onboarding_update_own" 
  ON onboarding_progress FOR UPDATE 
  TO authenticated 
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
