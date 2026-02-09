/*
  # Consolidate Multiple Permissive Policies - New Batch 2 (Corrected)
  
  1. Policy Consolidation (Transaction Tables)
    - deals: Multiple SELECT policies
    - purchases: Multiple SELECT policies
    - merchant_orders: Multiple SELECT policies (instead of transactions)
  
  2. Security
    - Maintains same security guarantees
    - Uses OR logic to preserve all access patterns
*/

-- Consolidate deals policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_deals" ON deals;
  DROP POLICY IF EXISTS "merchants_select_own_deals" ON deals;
  DROP POLICY IF EXISTS "customers_view_active_deals" ON deals;
END $$;

CREATE POLICY "authenticated_select_deals_consolidated"
  ON deals FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
    OR status = 'active'
  );

-- Consolidate purchases policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_purchases" ON purchases;
  DROP POLICY IF EXISTS "customers_select_own_purchases" ON purchases;
  DROP POLICY IF EXISTS "merchants_view_purchases" ON purchases;
END $$;

CREATE POLICY "authenticated_select_purchases_consolidated"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
    )
    OR deal_id IN (
      SELECT id FROM deals WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
      )
    )
  );

-- Consolidate merchant_orders policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_merchant_orders" ON merchant_orders;
  DROP POLICY IF EXISTS "merchants_select_own_orders" ON merchant_orders;
END $$;

CREATE POLICY "authenticated_select_merchant_orders_consolidated"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );