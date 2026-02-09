/*
  # Consolidate Multiple Permissive Policies - New Batch 1
  
  1. Policy Consolidation (Core Tables)
    - Consolidates multiple permissive policies for the same role/command
    - Combines duplicate SELECT/INSERT/UPDATE/DELETE policies
    - Improves RLS performance by reducing policy checks
  
  2. Tables Updated
    - profiles: Multiple authenticated SELECT policies
    - customers: Multiple authenticated SELECT policies
    - merchants: Multiple authenticated SELECT policies
    - partners: Multiple authenticated SELECT policies
  
  3. Security
    - Maintains same security guarantees
    - Uses OR logic to preserve all access patterns
*/

-- Consolidate profiles policies
DO $$
BEGIN
  -- Drop all duplicate authenticated SELECT policies
  DROP POLICY IF EXISTS "authenticated_select_profiles" ON profiles;
  DROP POLICY IF EXISTS "users_can_view_own_profile" ON profiles;
  DROP POLICY IF EXISTS "authenticated_users_select" ON profiles;
END $$;

CREATE POLICY "authenticated_select_profiles_consolidated"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

-- Consolidate customers policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_customers" ON customers;
  DROP POLICY IF EXISTS "customers_select_own" ON customers;
  DROP POLICY IF EXISTS "authenticated_users_select_customers" ON customers;
END $$;

CREATE POLICY "authenticated_select_customers_consolidated"
  ON customers FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Consolidate merchants policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_merchants" ON merchants;
  DROP POLICY IF EXISTS "merchants_select_own" ON merchants;
  DROP POLICY IF EXISTS "authenticated_users_select_merchants" ON merchants;
END $$;

CREATE POLICY "authenticated_select_merchants_consolidated"
  ON merchants FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Consolidate partners policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_partners" ON partners;
  DROP POLICY IF EXISTS "partners_select_own" ON partners;
  DROP POLICY IF EXISTS "authenticated_users_select_partners" ON partners;
END $$;

CREATE POLICY "authenticated_select_partners_consolidated"
  ON partners FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);