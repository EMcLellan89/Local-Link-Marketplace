/*
  # Optimize More Critical RLS Policies

  1. Purpose
    - Continue optimizing RLS policies with auth function wrapping
    - Focus on tables with complex policies

  2. Tables Fixed
    - marketplace_orders (correct column names)
    - marketplace_commissions (correct column names)
    - customer_referrals (correct column names)
*/

-- Optimize marketplace_orders policies (using correct column names)
DROP POLICY IF EXISTS "Users can read own marketplace orders" ON marketplace_orders;

CREATE POLICY "Users can read own marketplace orders"
  ON marketplace_orders FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Optimize marketplace_commissions policies (using correct column names)
DROP POLICY IF EXISTS "Partners can read own marketplace commissions" ON marketplace_commissions;

CREATE POLICY "Partners can read own marketplace commissions"
  ON marketplace_commissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p 
      WHERE p.id = marketplace_commissions.partner_id 
      AND p.user_id = (select auth.uid())
    )
  );

-- Optimize customer_referrals policies (using correct column names)
DROP POLICY IF EXISTS "Customers can read own referrals" ON customer_referrals;
DROP POLICY IF EXISTS "Customers can create referrals" ON customer_referrals;

CREATE POLICY "Customers can read own referrals"
  ON customer_referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c 
      WHERE c.id IN (customer_referrals.referrer_customer_id, customer_referrals.referee_customer_id)
      AND c.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can create referrals"
  ON customer_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c 
      WHERE c.id = customer_referrals.referrer_customer_id 
      AND c.user_id = (select auth.uid())
    )
  );
