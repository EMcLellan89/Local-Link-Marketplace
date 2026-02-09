/*
  # Fix Auth RLS Performance - Batch 10: Appointments & Badges (Corrected)

  1. Purpose
    - Optimize RLS policies for appointment and badge systems
    - Wrap auth.uid() in subquery for performance
  
  2. Tables Affected
    - appointment_setting_bookings (merchant_id)
    - appointments (customer_id)
    - badge_audit_log (partner_id)
    - badge_awards (user_id)
    - badge_rules (public)
    - badges (public)
  
  3. Performance Impact
    - Reduces auth function overhead in appointment scheduling
    - Improves badge system query performance
*/

-- appointment_setting_bookings policies
DROP POLICY IF EXISTS "Merchants can view own bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can view own bookings"
  ON appointment_setting_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = appointment_setting_bookings.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- appointments policies (uses customer_id)
DROP POLICY IF EXISTS "Customers can view own appointments" ON appointments;
CREATE POLICY "Customers can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = appointments.customer_id
        AND c.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can manage own appointments" ON appointments;
CREATE POLICY "Customers can manage own appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = appointments.customer_id
        AND c.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = appointments.customer_id
        AND c.user_id = (select auth.uid())
    )
  );

-- badge_audit_log policies
DROP POLICY IF EXISTS "Partners can view own badge audit" ON badge_audit_log;
CREATE POLICY "Partners can view own badge audit"
  ON badge_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = badge_audit_log.partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- badge_awards policies (uses user_id directly)
DROP POLICY IF EXISTS "Users can view own badge awards" ON badge_awards;
CREATE POLICY "Users can view own badge awards"
  ON badge_awards FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- badge_rules policies (public read for all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view badge rules" ON badge_rules;
CREATE POLICY "Authenticated users can view badge rules"
  ON badge_rules FOR SELECT
  TO authenticated
  USING (true);

-- badges policies (public read for all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view badges" ON badges;
CREATE POLICY "Authenticated users can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);
