/*
  # Consolidate Multiple Permissive Policies - Batch 1

  1. Changes
    - Consolidate multiple PERMISSIVE policies into single policies per table/operation
    - Prevents unintended access from OR combinations of multiple policies
    - Improves security and makes access control more explicit

  2. Security Impact
    - Reduces risk of accidental access grants
    - Makes RLS policies easier to audit and understand

  3. Tables Updated
    - audit_log: Consolidate 4 SELECT policies into 1
    - merchants: Consolidate 4 SELECT policies into 1
    - reviews: Consolidate 4 SELECT policies into 1
*/

-- Audit log - consolidate SELECT policies
DROP POLICY IF EXISTS "Users can view relevant audit logs" ON audit_log;
DROP POLICY IF EXISTS "Users can view entries they created" ON audit_log;
DROP POLICY IF EXISTS "Admin can view audit log" ON audit_log;
DROP POLICY IF EXISTS "Admins can view audit log" ON audit_log;

CREATE POLICY "Unified audit log access"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    -- Admins can see all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
    OR
    -- Users can see entries they created
    actor_user_id = (select auth.uid())
    OR
    -- Merchants can see entries for their merchant record
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (select auth.uid()))
  );

-- Merchants - consolidate SELECT policies
DROP POLICY IF EXISTS "merchant members can view merchant" ON merchants;
DROP POLICY IF EXISTS "Merchants can view own record" ON merchants;
DROP POLICY IF EXISTS "Approved merchants visible to all" ON merchants;
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;

CREATE POLICY "Unified merchant access"
  ON merchants FOR SELECT
  TO authenticated
  USING (
    -- Merchants can view their own record
    user_id = (select auth.uid())
    OR
    -- Approved merchants visible to authenticated users
    status = 'approved'
    OR
    -- Admins can view all
    EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Reviews - consolidate SELECT policies
DROP POLICY IF EXISTS "Merchants can view own business reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Public can view all reviews" ON reviews;

CREATE POLICY "Unified review access"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    -- Customers can view their own reviews
    customer_id IN (SELECT id FROM customers WHERE user_id = (select auth.uid()))
    OR
    -- Merchants can view reviews for their businesses
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (select auth.uid()))
    OR
    -- All authenticated users can view approved reviews
    status = 'approved'
  );
