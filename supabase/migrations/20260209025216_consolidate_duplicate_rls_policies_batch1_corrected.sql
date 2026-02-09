/*
  # Consolidate Multiple Permissive RLS Policies - Batch 1 (Corrected)

  1. Purpose
    - Merge multiple permissive policies into single policies
    - Reduces policy evaluation overhead
  
  2. Pattern
    - Multiple SELECT policies → Single policy with OR conditions
    - Multiple ALL policies → Single comprehensive policy
  
  3. Performance Impact
    - Reduces number of policy checks per query
    - Improves query planning time
  
  4. Note
    - Skipping notifications (already consolidated)
    - Skipping deal_transactions (already consolidated)
*/

-- Check and consolidate purchases policies if they exist separately
DROP POLICY IF EXISTS "Customers can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Merchants can view purchases" ON purchases;
DROP POLICY IF EXISTS "Users can view related purchases" ON purchases;
CREATE POLICY "Users can view related purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c WHERE c.id = purchases.customer_id AND c.user_id = (select auth.uid())
    )
  );

-- Consolidate reviews policies if separate
DROP POLICY IF EXISTS "Customers can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Merchants can view reviews for their deals" ON reviews;
DROP POLICY IF EXISTS "Users can view related reviews" ON reviews;
CREATE POLICY "Users can view related reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c WHERE c.id = reviews.customer_id AND c.user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = reviews.merchant_id AND m.user_id = (select auth.uid())
    )
  );
