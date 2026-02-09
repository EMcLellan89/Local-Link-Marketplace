/*
  # Fix Auth RLS Performance - Budget Buster Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - budget_buster_subscriptions
    - budget_buster_mode_switches
    - budget_buster_usage_metrics
    - budget_buster_users
    - budget_buster_accounts
    - budget_buster_transactions
*/

-- budget_buster_subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON budget_buster_subscriptions;
DROP POLICY IF EXISTS "Partners can view their customer subscriptions" ON budget_buster_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON budget_buster_subscriptions;

CREATE POLICY "Admins can view all subscriptions" ON budget_buster_subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view their customer subscriptions" ON budget_buster_subscriptions
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can view own subscriptions" ON budget_buster_subscriptions
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
  );

-- budget_buster_mode_switches
DROP POLICY IF EXISTS "Admins view all switches" ON budget_buster_mode_switches;
DROP POLICY IF EXISTS "Users view own mode switches" ON budget_buster_mode_switches;

CREATE POLICY "Admins view all switches" ON budget_buster_mode_switches
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users view own mode switches" ON budget_buster_mode_switches
  FOR SELECT TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM budget_buster_subscriptions 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- budget_buster_usage_metrics
DROP POLICY IF EXISTS "Admins view all usage" ON budget_buster_usage_metrics;
DROP POLICY IF EXISTS "Users view own usage" ON budget_buster_usage_metrics;

CREATE POLICY "Admins view all usage" ON budget_buster_usage_metrics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users view own usage" ON budget_buster_usage_metrics
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
  );

-- budget_buster_users
DROP POLICY IF EXISTS "Users can update own account" ON budget_buster_users;
DROP POLICY IF EXISTS "Users can view own account" ON budget_buster_users;

CREATE POLICY "Users can view own account" ON budget_buster_users
  FOR SELECT TO authenticated
  USING (profile_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own account" ON budget_buster_users
  FOR UPDATE TO authenticated
  USING (profile_id = (SELECT auth.uid()))
  WITH CHECK (profile_id = (SELECT auth.uid()));

-- budget_buster_accounts
DROP POLICY IF EXISTS "Users manage own accounts" ON budget_buster_accounts;
DROP POLICY IF EXISTS "Users view own accounts" ON budget_buster_accounts;

CREATE POLICY "Users view own accounts" ON budget_buster_accounts
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own accounts" ON budget_buster_accounts
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_transactions
DROP POLICY IF EXISTS "Users manage own transactions" ON budget_buster_transactions;
DROP POLICY IF EXISTS "Users view own transactions" ON budget_buster_transactions;

CREATE POLICY "Users view own transactions" ON budget_buster_transactions
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own transactions" ON budget_buster_transactions
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );
