/*
  # Consolidate Multiple Permissive Policies

  This migration consolidates multiple permissive RLS policies into single policies
  with OR conditions. This improves query planning performance.

  ## Pattern:
  Instead of:
    Policy 1: Users can view own data
    Policy 2: Admins can view all data
  
  Consolidate to:
    Single Policy: Users can view own data OR admin can view all

  ## Tables Affected:
  Tables with multiple permissive policies for the same operation.

  ## Performance Impact:
  Reduces the number of policy evaluations per query.
*/

-- Consolidate notifications policies (customers OR merchants can view)
DROP POLICY IF EXISTS "Customers can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Merchants can view own notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) IN (SELECT user_id FROM customers WHERE id = customer_id)
    OR
    (select auth.uid()) IN (SELECT user_id FROM merchants WHERE id = merchant_id)
  );

-- Consolidate deal_transactions policies (customers OR merchants can view)
DROP POLICY IF EXISTS "Customers can view own transactions" ON deal_transactions;
DROP POLICY IF EXISTS "Merchants can view deal transactions" ON deal_transactions;

CREATE POLICY "Users can view deal transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) IN (SELECT user_id FROM customers WHERE id = customer_id)
    OR
    (select auth.uid()) IN (
      SELECT m.user_id FROM merchants m
      JOIN deals d ON d.merchant_id = m.id
      WHERE d.id = deal_id
    )
  );

-- Consolidate deals view policies (merchants own OR public active)
DROP POLICY IF EXISTS "Merchants can view own deals" ON deals;
DROP POLICY IF EXISTS "Public can view active deals" ON deals;

CREATE POLICY "Users can view deals"
  ON deals FOR SELECT
  USING (
    status = 'active'
    OR
    (select auth.uid()) IN (SELECT user_id FROM merchants WHERE id = merchant_id)
  );

-- Keep manage policy separate as it's restrictive
-- (Merchants can manage own deals policy remains unchanged)