/*
  # Fix Auth RLS Performance - Batch 1: Core Tables (Corrected)

  This migration optimizes RLS policies by wrapping auth function calls in SELECT statements.
  This ensures auth functions are evaluated once per query rather than once per row.

  ## Tables Optimized:
  - profiles (id column)
  - customers (user_id column)
  - merchants (user_id column)
  - partners (user_id column)

  ## Pattern:
  Change: auth.uid() = user_id
  To: (select auth.uid()) = user_id

  This improves query performance significantly when scanning multiple rows.
*/

-- profiles table (id is the auth user id)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- customers table
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Customers can update own data" ON customers;
DROP POLICY IF EXISTS "Customers can insert own data" ON customers;

CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Customers can insert own data"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- merchants table
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can insert own data" ON merchants;

CREATE POLICY "Merchants can view own data"
  ON merchants FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can insert own data"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- partners table
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Partners can update own data" ON partners;
DROP POLICY IF EXISTS "Partners can insert own data" ON partners;

CREATE POLICY "Partners can view own data"
  ON partners FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Partners can update own data"
  ON partners FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Partners can insert own data"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);