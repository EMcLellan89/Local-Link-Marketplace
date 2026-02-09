/*
  # Optimize Auth RLS Initialization - Batch 34 (Core Tables)

  1. Problem
    - RLS policies call auth.uid() directly, causing it to be evaluated N times (once per row)
    - Should wrap auth.uid() in (SELECT auth.uid()) to evaluate only once per query

  2. Tables Fixed
    - customers
    - merchants  
    - partners

  3. Performance Impact
    - Reduces database CPU usage
    - Improves query performance for user-scoped queries
    - Prevents N+1 auth calls
*/

-- Drop existing policies and recreate with optimized auth checks

-- Customers table
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

-- Merchants table
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;

CREATE POLICY "Merchants can view own data"
ON merchants FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Merchants can update own data"
ON merchants FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Partners table
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Partners can update own data" ON partners;

CREATE POLICY "Partners can view own data"
ON partners FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Partners can update own data"
ON partners FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));