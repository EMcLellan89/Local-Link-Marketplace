/*
  # Fix Auth RLS Performance - Batch 4: Affiliate Tables
  
  This migration optimizes RLS policies for affiliate-related tables.
  
  ## Tables Updated
  - affiliate_partners
  - affiliate_commissions
  - affiliate_payouts
  - affiliate_referrals
  - affiliate_clicks
  
  ## Security Impact
  - Maintains existing security model
  - Improves query performance
*/

-- affiliate_partners
DROP POLICY IF EXISTS "Partners can view own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can view own affiliate data"
  ON affiliate_partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Partners can update own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can update own affiliate data"
  ON affiliate_partners FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create affiliate partner" ON affiliate_partners;
CREATE POLICY "Users can create affiliate partner"
  ON affiliate_partners FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- affiliate_commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_commissions.partner_id
      AND affiliate_partners.user_id = (select auth.uid())
    )
  );

-- affiliate_payouts
DROP POLICY IF EXISTS "Partners can view own payouts" ON affiliate_payouts;
CREATE POLICY "Partners can view own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_payouts.partner_id
      AND affiliate_partners.user_id = (select auth.uid())
    )
  );

-- affiliate_referrals
DROP POLICY IF EXISTS "Partners can view own referrals" ON affiliate_referrals;
CREATE POLICY "Partners can view own referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_referrals.partner_id
      AND affiliate_partners.user_id = (select auth.uid())
    )
  );

-- affiliate_clicks
DROP POLICY IF EXISTS "Partners can view own clicks" ON affiliate_clicks;
CREATE POLICY "Partners can view own clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_clicks.partner_id
      AND affiliate_partners.user_id = (select auth.uid())
    )
  );
