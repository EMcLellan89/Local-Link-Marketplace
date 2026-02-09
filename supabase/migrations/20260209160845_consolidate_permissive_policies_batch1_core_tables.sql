/*
  # Consolidate Multiple Permissive Policies - Batch 1: Core Tables
  
  1. Issue
    - Multiple permissive policies on same table create performance overhead
    - Each policy is evaluated separately, causing unnecessary computation
  
  2. Solution
    - Consolidate multiple permissive SELECT/INSERT/UPDATE/DELETE policies
    - Combine conditions using OR logic where appropriate
  
  3. Tables Affected
    - profiles
    - customers
    - merchants
    - partners
  
  4. Safety
    - Preserves all existing access patterns
    - No change to security model, only optimization
*/

-- Profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can edit own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Customers table
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Customers can read own record" ON customers;

CREATE POLICY "Customers can view own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Merchants table
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can read own record" ON merchants;

CREATE POLICY "Merchants can view own data"
  ON merchants
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Partners table
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Partners can read own record" ON partners;

CREATE POLICY "Partners can view own data"
  ON partners
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);