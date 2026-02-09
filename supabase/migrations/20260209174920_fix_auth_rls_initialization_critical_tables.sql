/*
  # Fix Auth RLS Initialization Performance Issues
  
  1. Problem
    - Policies using `auth.uid()` directly cause the function to be re-evaluated for each row
    - This significantly degrades query performance on large tables
    
  2. Solution
    - Wrap `auth.uid()` in a subquery: `(select auth.uid())`
    - This evaluates the function once per query instead of once per row
    
  3. Tables Fixed
    - customers: 2 policies
    - profiles: 1 policy  
    - merchants: 1 policy
    - partners: 1 policy
    
  4. Security
    - No change to access control logic
    - Only performance optimization
*/

-- Fix customers table policies
DROP POLICY IF EXISTS "Customers can view own data" ON public.customers;
CREATE POLICY "Customers can view own data"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Customers can update own data" ON public.customers;
CREATE POLICY "Customers can update own data"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Fix profiles table policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

-- Fix merchants table policy
DROP POLICY IF EXISTS "Merchants can view own data" ON public.merchants;
CREATE POLICY "Merchants can view own data"
  ON public.merchants
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix partners table policy
DROP POLICY IF EXISTS "Partners can view own data" ON public.partners;
CREATE POLICY "Partners can view own data"
  ON public.partners
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));