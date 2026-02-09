/*
  # Optimize RLS Auth Function Calls - Batch 1

  1. Purpose
    - Wrap auth.uid() and auth.jwt() calls in SELECT statements
    - Significantly improves RLS policy performance
    - Prevents repeated function calls during query execution

  2. Impact
    - Reduces query execution time by caching auth function results
    - Critical for tables with high query volume

  3. Tables Fixed (Batch 1)
    - profiles
    - customers
    - merchants
    - partners
*/

-- Drop and recreate profiles policies with optimized auth calls
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Drop and recreate customers policies
DROP POLICY IF EXISTS "Customers can read own data" ON customers;
DROP POLICY IF EXISTS "Customers can update own data" ON customers;

CREATE POLICY "Customers can read own data"
  ON customers FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Drop and recreate merchants policies
DROP POLICY IF EXISTS "Merchants can read own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;

CREATE POLICY "Merchants can read own data"
  ON merchants FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Drop and recreate partners policies
DROP POLICY IF EXISTS "Partners can read own data" ON partners;
DROP POLICY IF EXISTS "Partners can update own data" ON partners;

CREATE POLICY "Partners can read own data"
  ON partners FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Partners can update own data"
  ON partners FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
