/*
  # Fix Auth RLS Initialization Plan Issues - Batch 1
  
  1. Performance Optimization
    - Fixes policies that re-evaluate auth.uid() per row
    - Wraps auth.uid() calls with SELECT to evaluate once per query
    - Affects 8 critical policies across core tables
  
  2. Tables Updated
    - deals: authenticated_select_deals policy
    - purchases: authenticated_select_purchases policy
    - customers: authenticated_select_customers policy
    - profiles: authenticated_select_profiles policy
  
  3. Security
    - Maintains exact same security logic
    - Only changes execution plan for performance
*/

-- Fix deals.authenticated_select_deals
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'deals' 
    AND policyname = 'authenticated_select_deals'
  ) THEN
    DROP POLICY authenticated_select_deals ON deals;
  END IF;
END $$;

CREATE POLICY "authenticated_select_deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix purchases.authenticated_select_purchases
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'purchases' 
    AND policyname = 'authenticated_select_purchases'
  ) THEN
    DROP POLICY authenticated_select_purchases ON purchases;
  END IF;
END $$;

CREATE POLICY "authenticated_select_purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix customers.authenticated_select_customers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'customers' 
    AND policyname = 'authenticated_select_customers'
  ) THEN
    DROP POLICY authenticated_select_customers ON customers;
  END IF;
END $$;

CREATE POLICY "authenticated_select_customers"
  ON customers FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Fix profiles.authenticated_select_profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'authenticated_select_profiles'
  ) THEN
    DROP POLICY authenticated_select_profiles ON profiles;
  END IF;
END $$;

CREATE POLICY "authenticated_select_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);