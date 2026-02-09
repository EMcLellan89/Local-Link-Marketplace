/*
  # Optimize Auth RLS Performance - Batch 1: Core Tables

  1. Changes
    - Wrap auth.uid() in (SELECT auth.uid()) to prevent re-evaluation per row
    - Affects policies on: customers, merchants, partners
  
  2. Performance Impact
    - Reduces auth function calls from N (rows) to 1 per query
    - Improves query planning and execution time
*/

-- Customers table
DO $$
BEGIN
  DROP POLICY IF EXISTS "Customers can view own data" ON customers;
  DROP POLICY IF EXISTS "Customers can update own data" ON customers;
  
  CREATE POLICY "Customers can view own data"
    ON customers FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
  
  CREATE POLICY "Customers can update own data"
    ON customers FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Merchants table
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants manage own data" ON merchants;
  
  CREATE POLICY "Merchants manage own data"
    ON merchants FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Partners table
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners can view own profile" ON partners;
  DROP POLICY IF EXISTS "Partners can update own profile" ON partners;
  
  CREATE POLICY "Partners can view own profile"
    ON partners FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
  
  CREATE POLICY "Partners can update own profile"
    ON partners FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;
