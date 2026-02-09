/*
  # Optimize Auth RLS Policies - Batch 2: Customer Engagement

  1. Changes
    - Optimize auth.uid() calls in RLS policies for customer engagement features
    - Wraps auth calls in subqueries for better performance

  2. Tables Updated
    - favorites, reviews, loyalty_events, customer_referrals, notifications
*/

-- Favorites table policies
DROP POLICY IF EXISTS "Customers can manage own favorites" ON favorites;
CREATE POLICY "Customers can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

-- Reviews table policies
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can view own reviews" ON reviews;
CREATE POLICY "Customers can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

-- Loyalty events table policies
DROP POLICY IF EXISTS "Customers can view own loyalty events" ON loyalty_events;
CREATE POLICY "Customers can view own loyalty events"
  ON loyalty_events FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

-- Customer referrals table policies  
DROP POLICY IF EXISTS "Customers can view own referrals" ON customer_referrals;
CREATE POLICY "Customers can view own referrals"
  ON customer_referrals FOR SELECT
  TO authenticated
  USING (
    referrer_customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
    OR referee_customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

-- Notifications table policies
DROP POLICY IF EXISTS "Customers can view own notifications" ON notifications;
CREATE POLICY "Customers can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can update own notifications" ON notifications;
CREATE POLICY "Customers can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (select auth.uid())
    )
  );
