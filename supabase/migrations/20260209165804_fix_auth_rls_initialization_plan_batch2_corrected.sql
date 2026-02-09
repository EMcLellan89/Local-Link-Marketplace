/*
  # Fix Auth RLS Initialization Plan Issues - Batch 2 (Corrected)
  
  1. Performance Optimization
    - Fixes remaining 4 policies that re-evaluate auth.uid() per row
    - Wraps auth.uid() calls with SELECT to evaluate once per query
  
  2. Tables Updated
    - merchants: authenticated_select_merchants policy
    - budget_buster_transactions: authenticated_select_budget_buster_transactions policy
    - academy_enrollments: authenticated_select_academy_enrollments policy
    - partners: authenticated_select_partners policy
  
  3. Security
    - Maintains exact same security logic
    - Only changes execution plan for performance
*/

-- Fix merchants.authenticated_select_merchants
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'merchants' 
    AND policyname = 'authenticated_select_merchants'
  ) THEN
    DROP POLICY authenticated_select_merchants ON merchants;
  END IF;
END $$;

CREATE POLICY "authenticated_select_merchants"
  ON merchants FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Fix budget_buster_transactions.authenticated_select_budget_buster_transactions
-- Check if user_id column exists, otherwise use id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'budget_buster_transactions' 
    AND policyname = 'authenticated_select_budget_buster_transactions'
  ) THEN
    DROP POLICY authenticated_select_budget_buster_transactions ON budget_buster_transactions;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'budget_buster_transactions' 
    AND column_name = 'user_id'
  ) THEN
    EXECUTE 'CREATE POLICY "authenticated_select_budget_buster_transactions"
      ON budget_buster_transactions FOR SELECT
      TO authenticated
      USING ((SELECT auth.uid()) = user_id)';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'budget_buster_users'
    AND column_name = 'user_id'
  ) THEN
    EXECUTE 'CREATE POLICY "authenticated_select_budget_buster_transactions"
      ON budget_buster_transactions FOR SELECT
      TO authenticated
      USING (
        user_id IN (
          SELECT id FROM budget_buster_users WHERE user_id = (SELECT auth.uid())
        )
      )';
  END IF;
END $$;

-- Fix academy_enrollments.authenticated_select_academy_enrollments
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'academy_enrollments' 
    AND policyname = 'authenticated_select_academy_enrollments'
  ) THEN
    DROP POLICY authenticated_select_academy_enrollments ON academy_enrollments;
  END IF;
END $$;

CREATE POLICY "authenticated_select_academy_enrollments"
  ON academy_enrollments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Fix partners.authenticated_select_partners
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'partners' 
    AND policyname = 'authenticated_select_partners'
  ) THEN
    DROP POLICY authenticated_select_partners ON partners;
  END IF;
END $$;

CREATE POLICY "authenticated_select_partners"
  ON partners FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);