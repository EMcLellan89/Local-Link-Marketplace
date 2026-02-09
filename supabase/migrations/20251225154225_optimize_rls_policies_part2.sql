/*
  # Optimize RLS Policies - Part 2 (Expansion & Partner Management)

  1. Tables Fixed
    - expansion_requests (3 policies)
    - partner_overrides
    - partner_warning_logs (2 policies)
    - partners (2 policies)
    - partner_applications

  2. Performance Improvement
    - Wraps auth.uid() in SELECT for single evaluation
    - Uses correct join paths for each table
*/

-- expansion_requests - Partners can view own requests
DROP POLICY IF EXISTS "Partners can view own expansion requests" ON expansion_requests;
CREATE POLICY "Partners can view own expansion requests"
  ON expansion_requests FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- expansion_requests - Partners can create requests
DROP POLICY IF EXISTS "Partners can create expansion requests" ON expansion_requests;
CREATE POLICY "Partners can create expansion requests"
  ON expansion_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- expansion_requests - Admins can manage
DROP POLICY IF EXISTS "Admins can manage expansion requests" ON expansion_requests;
CREATE POLICY "Admins can manage expansion requests"
  ON expansion_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- partner_overrides
DROP POLICY IF EXISTS "Admins can manage partner overrides" ON partner_overrides;
CREATE POLICY "Admins can manage partner overrides"
  ON partner_overrides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- partner_warning_logs - Admins can manage
DROP POLICY IF EXISTS "Admins can manage warning logs" ON partner_warning_logs;
CREATE POLICY "Admins can manage warning logs"
  ON partner_warning_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- partner_warning_logs - Partners can view own
DROP POLICY IF EXISTS "Partners can view own warning logs" ON partner_warning_logs;
CREATE POLICY "Partners can view own warning logs"
  ON partner_warning_logs FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

-- partners - Admins can manage all
DROP POLICY IF EXISTS "Admins can manage all partners" ON partners;
CREATE POLICY "Admins can manage all partners"
  ON partners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- partners - Partners can view own record
DROP POLICY IF EXISTS "Partners can view own record" ON partners;
CREATE POLICY "Partners can view own record"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- partner_applications
DROP POLICY IF EXISTS "Admins can manage applications" ON partner_applications;
CREATE POLICY "Admins can manage applications"
  ON partner_applications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );
