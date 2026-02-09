/*
  # Fix Auth RLS Performance - Batch 2: Merchants & Partners
  
  This migration optimizes RLS policies by wrapping auth function calls in SELECT statements.
  
  ## Tables Updated
  - merchants
  - partners
  
  ## Security Impact
  - Maintains existing security model
  - Improves query performance
*/

-- merchants table
DROP POLICY IF EXISTS "Merchants can view own profile" ON merchants;
CREATE POLICY "Merchants can view own profile"
  ON merchants FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Merchants can update own profile" ON merchants;
CREATE POLICY "Merchants can update own profile"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create merchant profile" ON merchants;
CREATE POLICY "Users can create merchant profile"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- partners table
DROP POLICY IF EXISTS "Partners can view own record" ON partners;
CREATE POLICY "Partners can view own record"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Restrict partner updates to own data" ON partners;
CREATE POLICY "Restrict partner updates to own data"
  ON partners FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Partners can insert own record" ON partners;
CREATE POLICY "Partners can insert own record"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
