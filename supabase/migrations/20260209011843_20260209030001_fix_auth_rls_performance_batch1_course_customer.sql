/*
  # Fix Auth RLS Performance - Batch 1: Course and Customer Tables

  This migration optimizes RLS policies to use (SELECT auth.<function>()) pattern
  instead of direct auth.<function>() calls. This ensures the auth function is
  evaluated once at query start rather than for each row, significantly improving
  performance at scale.

  ## Tables Modified
  - course_pricing (2 policies)
  - course_webinar_content (2 policies)
  - customer_referral_programs (3 policies)
  - customer_referral_rewards (2 policies)
  - customer_referrals (3 policies - partial optimization)
  - partner_uplines (2 policies)

  ## Changes
  Policies are dropped and recreated with optimized auth function calls wrapped in SELECT.
*/

-- course_pricing: Optimize admin check
DROP POLICY IF EXISTS "Only admins can modify course pricing" ON course_pricing;
CREATE POLICY "Only admins can modify course pricing"
  ON course_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- course_webinar_content: Optimize admin check
DROP POLICY IF EXISTS "Only admins can modify webinar content" ON course_webinar_content;
CREATE POLICY "Only admins can modify webinar content"
  ON course_webinar_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- customer_referral_programs: Optimize merchant_id check
DROP POLICY IF EXISTS "Merchants can manage their own customer referral program" ON customer_referral_programs;
CREATE POLICY "Merchants can manage their own customer referral program"
  ON customer_referral_programs
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = merchant_id);

DROP POLICY IF EXISTS "Merchants can view their own customer referral program" ON customer_referral_programs;
CREATE POLICY "Merchants can view their own customer referral program"
  ON customer_referral_programs
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = merchant_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- customer_referral_rewards: Optimize auth.uid() calls
DROP POLICY IF EXISTS "Merchants can manage customer referral rewards" ON customer_referral_rewards;
CREATE POLICY "Merchants can manage customer referral rewards"
  ON customer_referral_rewards
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = merchant_id);

DROP POLICY IF EXISTS "Users can view their own customer referral rewards" ON customer_referral_rewards;
CREATE POLICY "Users can view their own customer referral rewards"
  ON customer_referral_rewards
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = referrer_customer_id
    OR
    (SELECT auth.uid()) = merchant_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- customer_referrals: These are already partially optimized, but fix consistency
DROP POLICY IF EXISTS "Merchants can update their customer referrals" ON customer_referrals;
CREATE POLICY "Merchants can update their customer referrals"
  ON customer_referrals
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = merchant_id);

DROP POLICY IF EXISTS "Users can view their own customer referrals" ON customer_referrals;
CREATE POLICY "Users can view their own customer referrals"
  ON customer_referrals
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = referrer_customer_id
    OR
    (SELECT auth.uid()) = referee_customer_id
    OR
    (SELECT auth.uid()) = merchant_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- partner_uplines: Optimize auth.uid() checks
DROP POLICY IF EXISTS "Admins can manage all upline relationships" ON partner_uplines;
CREATE POLICY "Admins can manage all upline relationships"
  ON partner_uplines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners can view their upline relationships" ON partner_uplines;
CREATE POLICY "Partners can view their upline relationships"
  ON partner_uplines
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_uplines.partner_id
      AND partners.user_id = (SELECT auth.uid())
    )
  );