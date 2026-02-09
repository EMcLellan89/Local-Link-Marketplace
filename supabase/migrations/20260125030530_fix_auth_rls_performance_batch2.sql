/*
  # Fix Auth RLS Performance Issues - Batch 2
  
  Continues fixing auth function calls in RLS policies
*/

-- referral_short_links
DROP POLICY IF EXISTS "Merchants can create own short links" ON referral_short_links;
CREATE POLICY "Merchants can create own short links"
  ON referral_short_links FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (
    SELECT merchants.id FROM merchants WHERE merchants.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can view own short links" ON referral_short_links;
CREATE POLICY "Merchants can view own short links"
  ON referral_short_links FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants WHERE merchants.user_id = (SELECT auth.uid())
  ));

-- partner_challenge_enrollments
DROP POLICY IF EXISTS "Admins can manage all challenge data" ON partner_challenge_enrollments;
CREATE POLICY "Admins can manage all challenge data"
  ON partner_challenge_enrollments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can create own challenge enrollments" ON partner_challenge_enrollments;
CREATE POLICY "Partners can create own challenge enrollments"
  ON partner_challenge_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can view own challenge enrollments" ON partner_challenge_enrollments;
CREATE POLICY "Partners can view own challenge enrollments"
  ON partner_challenge_enrollments FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

-- partner_activity_log
DROP POLICY IF EXISTS "Admins can manage all activity logs" ON partner_activity_log;
CREATE POLICY "Admins can manage all activity logs"
  ON partner_activity_log FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own activity log" ON partner_activity_log;
CREATE POLICY "Partners can view own activity log"
  ON partner_activity_log FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

-- partner_streaks
DROP POLICY IF EXISTS "Partners can view own streaks" ON partner_streaks;
CREATE POLICY "Partners can view own streaks"
  ON partner_streaks FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

-- partner_challenge_progress
DROP POLICY IF EXISTS "Partners can update own challenge progress" ON partner_challenge_progress;
CREATE POLICY "Partners can update own challenge progress"
  ON partner_challenge_progress FOR UPDATE
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can view own challenge progress" ON partner_challenge_progress;
CREATE POLICY "Partners can view own challenge progress"
  ON partner_challenge_progress FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

-- partner_badge_awards
DROP POLICY IF EXISTS "Partners can view their own badge awards" ON partner_badge_awards;
CREATE POLICY "Partners can view their own badge awards"
  ON partner_badge_awards FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

-- partner_tracking_links
DROP POLICY IF EXISTS "Admins can manage all tracking links" ON partner_tracking_links;
CREATE POLICY "Admins can manage all tracking links"
  ON partner_tracking_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can create their own tracking links" ON partner_tracking_links;
CREATE POLICY "Partners can create their own tracking links"
  ON partner_tracking_links FOR INSERT
  TO authenticated
  WITH CHECK (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can view their own tracking links" ON partner_tracking_links;
CREATE POLICY "Partners can view their own tracking links"
  ON partner_tracking_links FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners WHERE partners.user_id = (SELECT auth.uid())
  ));
