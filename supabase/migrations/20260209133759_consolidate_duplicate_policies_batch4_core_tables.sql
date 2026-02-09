/*
  # Consolidate Duplicate Policies - Batch 4: Core Tables

  1. Changes
    - Consolidate duplicate policies on profiles
    - Consolidate duplicate policies on customers
    - Consolidate duplicate policies on merchants
    - Consolidate duplicate policies on partners

  2. Security
    - Remove redundant permissive policies that create OR-based access
    - Keep single, comprehensive policy per role/action combination
*/

-- profiles: Check for duplicate policies
DO $$
BEGIN
  -- Drop duplicate SELECT policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Users can view own profile data'
    AND cmd = 'SELECT'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Enable read access for users'
    AND cmd = 'SELECT'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own profile data" ON profiles;
  END IF;

  -- Drop duplicate UPDATE policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Users can update own profile data'
    AND cmd = 'UPDATE'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Enable update for users'
    AND cmd = 'UPDATE'
  ) THEN
    DROP POLICY IF EXISTS "Users can update own profile data" ON profiles;
  END IF;
END $$;

-- customers: Check for duplicate policies
DO $$
BEGIN
  -- Drop duplicate SELECT policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'customers'
    AND policyname = 'Customers can view own data'
    AND cmd = 'SELECT'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'customers'
    AND policyname = 'Enable read for customers'
    AND cmd = 'SELECT'
  ) THEN
    DROP POLICY IF EXISTS "Customers can view own data" ON customers;
  END IF;
END $$;

-- merchants: Check for duplicate policies
DO $$
BEGIN
  -- Drop duplicate SELECT policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'merchants'
    AND policyname = 'Merchants can view own business'
    AND cmd = 'SELECT'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'merchants'
    AND policyname = 'Enable read for merchants'
    AND cmd = 'SELECT'
  ) THEN
    DROP POLICY IF EXISTS "Merchants can view own business" ON merchants;
  END IF;

  -- Drop duplicate UPDATE policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'merchants'
    AND policyname = 'Merchants can update own business'
    AND cmd = 'UPDATE'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'merchants'
    AND policyname = 'Enable update for merchants'
    AND cmd = 'UPDATE'
  ) THEN
    DROP POLICY IF EXISTS "Merchants can update own business" ON merchants;
  END IF;
END $$;

-- partners: Check for duplicate policies
DO $$
BEGIN
  -- Drop duplicate SELECT policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'partners'
    AND policyname = 'Partners can view own data'
    AND cmd = 'SELECT'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'partners'
    AND policyname = 'Enable read for partners'
    AND cmd = 'SELECT'
  ) THEN
    DROP POLICY IF EXISTS "Partners can view own data" ON partners;
  END IF;

  -- Drop duplicate UPDATE policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'partners'
    AND policyname = 'Partners can update own data'
    AND cmd = 'UPDATE'
  ) AND EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'partners'
    AND policyname = 'Enable update for partners'
    AND cmd = 'UPDATE'
  ) THEN
    DROP POLICY IF EXISTS "Partners can update own data" ON partners;
  END IF;
END $$;