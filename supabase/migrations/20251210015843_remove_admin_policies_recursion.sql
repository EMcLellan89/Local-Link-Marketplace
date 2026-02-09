/*
  # Remove Admin Policy Recursion from All Tables

  ## Problem
  Many policies check admin role by querying the profiles table, which can
  cause performance issues and potential recursion problems.

  ## Solution
  Remove all admin-checking policies that query profiles table.
  Admin access will be handled via:
  1. Service role key for backend operations
  2. Security definer functions for specific admin operations
  3. Application-level checks

  ## Security Note
  This doesn't reduce security - admins will use service role for admin operations,
  which is the recommended Supabase pattern for admin functionality.
*/

-- Drop all admin policies that reference profiles table

-- Merchants
DROP POLICY IF EXISTS "Admins can manage all merchants" ON merchants;

-- Deals
DROP POLICY IF EXISTS "Admins can manage all deals" ON deals;

-- Customers  
-- (No separate admin policy exists, admin check is part of view policy)

-- Purchases
-- (Admin check is part of the purchases view policy, need to recreate without it)
DROP POLICY IF EXISTS "Customers can view own purchases" ON purchases;
CREATE POLICY "Customers can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = customer_id AND user_id = (select auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON d.merchant_id = m.id
      WHERE d.id = deal_id AND m.user_id = (select auth.uid())
    )
  );

-- Redemptions
DROP POLICY IF EXISTS "Merchants can view redemptions for their deals" ON redemptions;
CREATE POLICY "Merchants can view redemptions for their deals"
  ON redemptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN deals d ON p.deal_id = d.id
      JOIN merchants m ON d.merchant_id = m.id
      WHERE p.id = purchase_id AND m.user_id = (select auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = purchase_id AND c.user_id = (select auth.uid())
    )
  );

-- Payouts
DROP POLICY IF EXISTS "Admins can manage payouts" ON payouts;
DROP POLICY IF EXISTS "Merchants can view own payouts" ON payouts;
CREATE POLICY "Merchants can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = (select auth.uid())
    )
  );

-- Loyalty events
DROP POLICY IF EXISTS "Customers can view own loyalty events" ON loyalty_events;
CREATE POLICY "Customers can view own loyalty events"
  ON loyalty_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = customer_id AND user_id = (select auth.uid())
    )
  );

-- Update merchant and customer policies
DROP POLICY IF EXISTS "Merchants can view own profile" ON merchants;
CREATE POLICY "Merchants can view own profile"
  ON merchants FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

COMMENT ON POLICY "Customers can view own purchases" ON purchases IS 'RLS policy without admin recursion - admin access via service role';
COMMENT ON POLICY "Merchants can view redemptions for their deals" ON redemptions IS 'RLS policy without admin recursion - admin access via service role';
