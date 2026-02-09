/*
  # Consolidate Multiple Permissive Policies - Batch 1

  1. Purpose
    - Consolidate duplicate RLS policies for the same role/action combinations
    - Improve policy evaluation performance
    - Reduce policy management complexity

  2. Changes
    - Drop duplicate policies and consolidate into single policies
    - Maintain same access control logic using OR conditions where needed
    - Core tables: profiles, customers, merchants, partners

  3. Security
    - No change to access control logic
    - Policies combined using OR where multiple conditions existed
*/

-- Profiles table: Consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Customers table: Consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Customers can read own data" ON customers;
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Customers table: Consolidate multiple UPDATE policies
DROP POLICY IF EXISTS "Customers can update own data" ON customers;
DROP POLICY IF EXISTS "Customers can modify own data" ON customers;
CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Merchants table: Consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can read own data" ON merchants;
CREATE POLICY "Merchants can view own data"
  ON merchants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Partners table: Consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Partners can read own data" ON partners;
CREATE POLICY "Partners can view own data"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
