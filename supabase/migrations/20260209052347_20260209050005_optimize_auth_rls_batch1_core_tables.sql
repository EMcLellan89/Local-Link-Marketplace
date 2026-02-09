/*
  # Optimize Auth RLS Policies - Batch 1: Core Tables

  1. Changes
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance

  2. Performance Impact
    - Auth functions are evaluated once per query instead of once per row
    - Can improve query performance by 10-100x depending on result set size

  3. Tables Updated
    - profiles, customers, merchants, partners, deals, purchases
*/

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Customers table policies
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Customers can update own data" ON customers;
CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Merchants table policies
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
CREATE POLICY "Merchants can view own data"
  ON merchants FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;
CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Partners table policies
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
CREATE POLICY "Partners can view own data"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Partners can update own data" ON partners;
CREATE POLICY "Partners can update own data"
  ON partners FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Deals table policies
DROP POLICY IF EXISTS "Merchants can manage own deals" ON deals;
CREATE POLICY "Merchants can manage own deals"
  ON deals FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Purchases table policies
DROP POLICY IF EXISTS "Customers can view own purchases" ON purchases;
CREATE POLICY "Customers can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );
