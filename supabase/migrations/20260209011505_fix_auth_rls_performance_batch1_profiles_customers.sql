/*
  # Fix Auth RLS Performance - Batch 1: Profiles & Customers
  
  This migration optimizes RLS policies by wrapping auth function calls in SELECT statements.
  This prevents the auth functions from being called multiple times per row during policy evaluation.
  
  Pattern: auth.uid() → (select auth.uid())
  
  ## Tables Updated
  - profiles
  - customers
  
  ## Security Impact
  - Maintains existing security model
  - Improves query performance
  - Reduces database load
*/

-- profiles table
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

DROP POLICY IF EXISTS "Restrict profile updates to own data" ON profiles;
CREATE POLICY "Restrict profile updates to own data"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- customers table
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

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
