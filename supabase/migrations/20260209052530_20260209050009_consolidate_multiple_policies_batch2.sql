/*
  # Consolidate Multiple Permissive Policies - Batch 2

  1. Changes
    - Continue consolidating multiple PERMISSIVE policies
    - Focus on customer-facing tables

  2. Tables Updated
    - customers: Consolidate 3 SELECT policies into 1
    - customer_referrals: Consolidate 3 SELECT policies into 1
    - notifications: Consolidate 3 UPDATE policies into 1
    - user_entitlements: Consolidate 3 SELECT policies into 1
*/

-- Customers - consolidate SELECT policies
DROP POLICY IF EXISTS "Merchants can view own customers" ON customers;
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Customers can view own record" ON customers;

CREATE POLICY "Unified customer access"
  ON customers FOR SELECT
  TO authenticated
  USING (
    -- Customers can view their own record
    user_id = (select auth.uid())
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Customer referrals - consolidate SELECT policies  
DROP POLICY IF EXISTS "Customers can view own referrals" ON customer_referrals;
DROP POLICY IF EXISTS "Users can view their own customer referrals" ON customer_referrals;
DROP POLICY IF EXISTS "Customers can read own referrals" ON customer_referrals;

CREATE POLICY "Unified customer referral access"
  ON customer_referrals FOR SELECT
  TO authenticated
  USING (
    -- Customers can view referrals they made
    referrer_customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Customers can view referrals where they are the referee
    referee_customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Merchants can view referrals for their business
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (select auth.uid()))
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Notifications - consolidate UPDATE policies
DROP POLICY IF EXISTS "Merchants can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Customers can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Customers can update their own notifications" ON notifications;

CREATE POLICY "Unified notification update"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    -- Customers can update their own notifications
    customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Merchants can update their own notifications
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (select auth.uid()))
  )
  WITH CHECK (
    -- Same conditions for WITH CHECK
    customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (select auth.uid()))
  );

-- User entitlements - consolidate SELECT policies
DROP POLICY IF EXISTS "Users can read their own entitlements" ON user_entitlements;
DROP POLICY IF EXISTS "Users can view own entitlements" ON user_entitlements;
DROP POLICY IF EXISTS "Users can read own entitlements" ON user_entitlements;

CREATE POLICY "Unified user entitlement access"
  ON user_entitlements FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own entitlements
    user_id = (select auth.uid())
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );
