/*
  # Fix Security and Performance Issues
  
  This migration addresses critical performance and security issues:
  
  1. **Missing Index**
     - Add index for `redemptions.redeemed_by` foreign key
  
  2. **RLS Performance Optimization**
     - Replace all `auth.uid()` with `(select auth.uid())` to prevent re-evaluation per row
     - This provides significant performance improvement at scale
  
  3. **Function Search Path Security**
     - Set explicit search_path on security definer functions
     - Prevents search_path hijacking attacks
  
  ## Performance Impact
  - RLS policies will now evaluate auth functions once per query instead of per row
  - Foreign key lookups will be significantly faster with proper indexing
*/

-- 1. Add missing index for redemptions.redeemed_by foreign key
CREATE INDEX IF NOT EXISTS idx_redemptions_redeemed_by ON redemptions(redeemed_by);

-- 2. Drop and recreate all RLS policies with optimized auth.uid() calls

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Merchants policies
DROP POLICY IF EXISTS "Merchants can view own profile" ON merchants;
CREATE POLICY "Merchants can view own profile"
  ON merchants FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

DROP POLICY IF EXISTS "Merchants can update own profile" ON merchants;
CREATE POLICY "Merchants can update own profile"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create merchant profile" ON merchants;
CREATE POLICY "Users can create merchant profile"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all merchants" ON merchants;
CREATE POLICY "Admins can manage all merchants"
  ON merchants FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Customers policies
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create customer profile" ON customers;
CREATE POLICY "Users can create customer profile"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Deals policies
DROP POLICY IF EXISTS "Active deals visible to all" ON deals;
CREATE POLICY "Active deals visible to all"
  ON deals FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    OR
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = deals.merchant_id AND m.user_id = (select auth.uid())
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

DROP POLICY IF EXISTS "Merchants can create deals" ON deals;
CREATE POLICY "Merchants can create deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own deals" ON deals;
CREATE POLICY "Merchants can update own deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can manage all deals" ON deals;
CREATE POLICY "Admins can manage all deals"
  ON deals FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Purchases policies
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
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Redemptions policies
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
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

DROP POLICY IF EXISTS "Merchants can create redemptions" ON redemptions;
CREATE POLICY "Merchants can create redemptions"
  ON redemptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN deals d ON p.deal_id = d.id
      JOIN merchants m ON d.merchant_id = m.id
      WHERE p.id = purchase_id AND m.user_id = (select auth.uid())
    )
  );

-- Payouts policies
DROP POLICY IF EXISTS "Merchants can view own payouts" ON payouts;
CREATE POLICY "Merchants can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = (select auth.uid())
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage payouts" ON payouts;
CREATE POLICY "Admins can manage payouts"
  ON payouts FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Loyalty events policies
DROP POLICY IF EXISTS "Customers can view own loyalty events" ON loyalty_events;
CREATE POLICY "Customers can view own loyalty events"
  ON loyalty_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = customer_id AND user_id = (select auth.uid())
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- 3. Fix function search paths for security
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_customer_loyalty_points() SET search_path = public, pg_temp;

-- 4. Add comments documenting the security improvements
COMMENT ON INDEX idx_redemptions_redeemed_by IS 'Index to improve foreign key lookup performance for redemptions.redeemed_by';
COMMENT ON POLICY "Users can view own profile" ON profiles IS 'Optimized RLS policy using (select auth.uid()) for better performance at scale';
COMMENT ON FUNCTION public.handle_new_user() IS 'Secure function with explicit search_path to prevent search_path hijacking';
COMMENT ON FUNCTION public.update_customer_loyalty_points() IS 'Secure function with explicit search_path to prevent search_path hijacking';