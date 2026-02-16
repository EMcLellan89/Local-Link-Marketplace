/*
  # Consolidate Multiple Permissive RLS Policies - Batch 1
  
  Consolidates multiple permissive policies on core tables into single policies.
  
  Multiple permissive policies can create security vulnerabilities. This migration
  consolidates duplicate policies into single, comprehensive policies.
  
  Tables affected:
  - profiles
  - customers
  - merchants
  - partners
*/

-- Profiles table: Consolidate SELECT policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own data" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Profiles table: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can modify own data" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Customers table: Consolidate SELECT policies
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Allow customers to read own data" ON customers;
DROP POLICY IF EXISTS "Customers can read profile" ON customers;

CREATE POLICY "Customers can read own data"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Customers table: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Customers can update own data" ON customers;
DROP POLICY IF EXISTS "Allow customers to update own data" ON customers;
DROP POLICY IF EXISTS "Customers can modify profile" ON customers;

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Merchants table: Consolidate SELECT policies
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Allow merchants to read own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can read profile" ON merchants;

CREATE POLICY "Merchants can read own data"
  ON merchants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Merchants table: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;
DROP POLICY IF EXISTS "Allow merchants to update own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can modify profile" ON merchants;

CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Partners table: Consolidate SELECT policies
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Allow partners to read own data" ON partners;
DROP POLICY IF EXISTS "Partners can read profile" ON partners;

CREATE POLICY "Partners can read own data"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Partners table: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Partners can update own data" ON partners;
DROP POLICY IF EXISTS "Allow partners to update own data" ON partners;
DROP POLICY IF EXISTS "Partners can modify profile" ON partners;

CREATE POLICY "Partners can update own data"
  ON partners FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());