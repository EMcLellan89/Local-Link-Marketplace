/*
  # Fix Auth RLS Performance - Batch 5: Business Logic Tables (Final)

  This migration optimizes RLS policies on business logic tables by wrapping
  auth function calls in SELECT statements for better performance.

  ## Tables Optimized:
  - deals
  - deal_transactions
  - merchant_orders
  - favorites
  - reviews
  - notifications
  - purchases
  - referrals

  ## Performance Impact:
  Auth functions will be evaluated once per query instead of per row.
*/

-- deals
DROP POLICY IF EXISTS "Merchants can view own deals" ON deals;
DROP POLICY IF EXISTS "Merchants can manage own deals" ON deals;
DROP POLICY IF EXISTS "Customers can view active deals" ON deals;
DROP POLICY IF EXISTS "Customers can view published deals" ON deals;
DROP POLICY IF EXISTS "Public can view active deals" ON deals;

CREATE POLICY "Merchants can view own deals"
  ON deals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Merchants can manage own deals"
  ON deals FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Public can view active deals"
  ON deals FOR SELECT
  USING (status = 'active');

-- deal_transactions
DROP POLICY IF EXISTS "Customers can view own transactions" ON deal_transactions;
DROP POLICY IF EXISTS "Merchants can view deal transactions" ON deal_transactions;

CREATE POLICY "Customers can view own transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Merchants can view deal transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT m.user_id FROM merchants m
    JOIN deals d ON d.merchant_id = m.id
    WHERE d.id = deal_id
  ));

-- merchant_orders
DROP POLICY IF EXISTS "Merchants can view own orders" ON merchant_orders;
DROP POLICY IF EXISTS "Merchants can manage own orders" ON merchant_orders;

CREATE POLICY "Merchants can view own orders"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Merchants can manage own orders"
  ON merchant_orders FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

-- favorites
DROP POLICY IF EXISTS "Customers can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Customers can manage own favorites" ON favorites;

CREATE POLICY "Customers can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Customers can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

-- reviews
DROP POLICY IF EXISTS "Public can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can manage own reviews" ON reviews;

CREATE POLICY "Public can view all reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can manage own reviews"
  ON reviews FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

-- notifications (has customer_id and merchant_id)
DROP POLICY IF EXISTS "Customers can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Merchants can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Customers can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Merchants can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

-- purchases
DROP POLICY IF EXISTS "Customers can view own purchases" ON purchases;

CREATE POLICY "Customers can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = customer_id
  ));

-- referrals
DROP POLICY IF EXISTS "Customers can view referrals they made" ON referrals;
DROP POLICY IF EXISTS "Customers can view referrals to them" ON referrals;
DROP POLICY IF EXISTS "Users can view referrals they made" ON referrals;
DROP POLICY IF EXISTS "Users can view referrals to them" ON referrals;

CREATE POLICY "Customers can view referrals they made"
  ON referrals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = referrer_customer_id
  ));

CREATE POLICY "Customers can view referrals to them"
  ON referrals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM customers WHERE id = referred_customer_id
  ));