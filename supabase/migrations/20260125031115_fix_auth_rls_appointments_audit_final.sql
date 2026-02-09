/*
  # Optimize Auth RLS Performance - Appointments and Audit Tables (Final)

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery
    - Uses correct column names: customer_id for appointments, user_id for badge_awards

  2. Security
    - Maintains existing security model
    - Improves query performance
*/

-- appointment_setting_bookings
DROP POLICY IF EXISTS "Merchants can view own appointment bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can view own appointment bookings"
  ON appointment_setting_bookings
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can create appointment bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can create appointment bookings"
  ON appointment_setting_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own appointment bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can update own appointment bookings"
  ON appointment_setting_bookings
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- appointments (uses customer_id)
DROP POLICY IF EXISTS "Customers can view own appointments" ON appointments;
CREATE POLICY "Customers can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = customer_id);

-- audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- badge_awards (uses user_id)
DROP POLICY IF EXISTS "Users can view own badges" ON badge_awards;
CREATE POLICY "Users can view own badges"
  ON badge_awards
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- batch_transactions
DROP POLICY IF EXISTS "Admins can manage batch transactions" ON batch_transactions;
CREATE POLICY "Admins can manage batch transactions"
  ON batch_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );
