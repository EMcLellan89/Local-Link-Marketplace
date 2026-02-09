/*
  # Optimize Auth RLS Performance - Affiliate and Partner Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for affiliate and partner tables
    - Affects affiliate_clicks, affiliate_commissions, affiliate_partners, affiliate_payouts, affiliate_referrals

  2. Security
    - Maintains existing security model
    - Improves query performance by caching auth.uid() result
*/

-- affiliate_clicks
DROP POLICY IF EXISTS "Partners can view own clicks" ON affiliate_clicks;
CREATE POLICY "Partners can view own clicks"
  ON affiliate_clicks
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM affiliate_partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- affiliate_commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM affiliate_partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- affiliate_partners
DROP POLICY IF EXISTS "Partners can read their own profile" ON affiliate_partners;
CREATE POLICY "Partners can read their own profile"
  ON affiliate_partners
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- affiliate_payouts
DROP POLICY IF EXISTS "Partners can view own payouts" ON affiliate_payouts;
CREATE POLICY "Partners can view own payouts"
  ON affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM affiliate_partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can request payouts" ON affiliate_payouts;
CREATE POLICY "Partners can request payouts"
  ON affiliate_payouts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM affiliate_partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- affiliate_referrals
DROP POLICY IF EXISTS "Partners can read their own referrals" ON affiliate_referrals;
CREATE POLICY "Partners can read their own referrals"
  ON affiliate_referrals
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM affiliate_partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );
