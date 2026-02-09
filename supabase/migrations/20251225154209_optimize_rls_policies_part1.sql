/*
  # Optimize RLS Policies - Part 1 (Merchant & Partner Subscriptions)

  1. Performance Issue
    - auth.uid() re-evaluated for each row in queries
    - Can be 5-50x slower on large datasets
    - Especially bad for tables with millions of rows

  2. Solution
    - Wrap auth.uid() in SELECT subquery: (select auth.uid())
    - PostgreSQL evaluates once per query instead of per row
    - Major performance improvement at scale

  3. Tables Fixed
    - partner_subscriptions
    - territory_licenses
    - merchant_addon_subscriptions
    - service_bookings
    - usage_tracking
*/

-- partner_subscriptions
DROP POLICY IF EXISTS "Partners can view own subscriptions" ON partner_subscriptions;
CREATE POLICY "Partners can view own subscriptions"
  ON partner_subscriptions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

-- territory_licenses
DROP POLICY IF EXISTS "Partners can view own territory licenses" ON territory_licenses;
CREATE POLICY "Partners can view own territory licenses"
  ON territory_licenses FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

-- merchant_addon_subscriptions
DROP POLICY IF EXISTS "Merchants can view own addon subscriptions" ON merchant_addon_subscriptions;
CREATE POLICY "Merchants can view own addon subscriptions"
  ON merchant_addon_subscriptions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())
    )
  );

-- service_bookings
DROP POLICY IF EXISTS "Users can view own service bookings" ON service_bookings;
CREATE POLICY "Users can view own service bookings"
  ON service_bookings FOR SELECT
  TO authenticated
  USING (
    (customer_type = 'merchant' AND customer_id IN (SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())))
    OR (customer_type = 'partner' AND customer_id IN (SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())))
  );

-- usage_tracking
DROP POLICY IF EXISTS "Users can view own usage tracking" ON usage_tracking;
CREATE POLICY "Users can view own usage tracking"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (
    (user_type = 'merchant' AND user_id IN (SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())))
    OR (user_type = 'partner' AND user_id IN (SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())))
  );
