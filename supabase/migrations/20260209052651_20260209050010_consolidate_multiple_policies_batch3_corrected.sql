/*
  # Consolidate Multiple Permissive Policies - Batch 3

  1. Changes
    - Continue consolidating multiple PERMISSIVE policies
    - Use correct column names from actual schema

  2. Tables Updated
    - budget_buster_subscriptions: Consolidate 3 SELECT policies
    - referrals: Consolidate 3 SELECT policies
*/

-- Budget buster subscriptions - consolidate SELECT policies
DROP POLICY IF EXISTS "Partners can view their customer subscriptions" ON budget_buster_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON budget_buster_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON budget_buster_subscriptions;

CREATE POLICY "Unified budget buster subscription access"
  ON budget_buster_subscriptions FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own subscriptions
    user_id = (select auth.uid())
    OR
    -- Partners can view subscriptions they're associated with
    partner_id IN (SELECT id FROM partners WHERE user_id = (select auth.uid()))
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Referrals - consolidate SELECT policies
DROP POLICY IF EXISTS "Customers can view their own referrals" ON referrals;
DROP POLICY IF EXISTS "Customers can view referrals they made" ON referrals;
DROP POLICY IF EXISTS "Customers can view referrals to them" ON referrals;

CREATE POLICY "Unified referral access"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    -- Customers can view referrals they made
    referrer_customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Customers can view referrals where they were referred
    referred_customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );
