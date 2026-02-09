/*
  # Optimize Auth RLS Policies - Batch 3: Merchant Operations

  1. Changes
    - Optimize auth.uid() calls in RLS policies for merchant operations
    - Improves performance for payouts and redemptions

  2. Tables Updated
    - payouts, redemptions, customer_preferences
*/

-- Payouts table policies
DROP POLICY IF EXISTS "Merchants can view own payouts" ON payouts;
CREATE POLICY "Merchants can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Redemptions table policies
DROP POLICY IF EXISTS "Merchants can view redemptions for own deals" ON redemptions;
CREATE POLICY "Merchants can view redemptions for own deals"
  ON redemptions FOR SELECT
  TO authenticated
  USING (
    purchase_id IN (
      SELECT p.id FROM purchases p
      JOIN deals d ON p.deal_id = d.id
      JOIN merchants m ON d.merchant_id = m.id
      WHERE m.user_id = (select auth.uid())
    )
  );

-- Customer preferences table policies
DROP POLICY IF EXISTS "Customers can manage own preferences" ON customer_preferences;
CREATE POLICY "Customers can manage own preferences"
  ON customer_preferences FOR ALL
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );
