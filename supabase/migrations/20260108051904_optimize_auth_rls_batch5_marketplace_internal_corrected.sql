/*
  # Optimize Auth RLS Performance - Batch 5: Marketplace & System Tables (Corrected)
  
  1. Performance Optimization
    - Optimize remaining high-impact auth function calls
    - 15 policies optimized in this batch
  
  2. Affected Tables & Policies
    - payment_events, swipe_templates, system_email_templates
    - internal_team_members, business_units, unified_customers
    - marketplace_affiliate_commissions, marketplace_affiliate_training_progress
    - marketplace_affiliate_payouts, marketplace_affiliate_badges
    - marketplace_affiliate_product_assets
*/

-- payment_events
DROP POLICY IF EXISTS "Admin can manage payment events" ON payment_events;
CREATE POLICY "Admin can manage payment events"
  ON payment_events
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

-- swipe_templates
DROP POLICY IF EXISTS "swipe_templates_manage_admin" ON swipe_templates;
CREATE POLICY "swipe_templates_manage_admin"
  ON swipe_templates
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

-- system_email_templates
DROP POLICY IF EXISTS "system_email_templates_manage_admin" ON system_email_templates;
CREATE POLICY "system_email_templates_manage_admin"
  ON system_email_templates
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

-- internal_team_members
DROP POLICY IF EXISTS "Internal team can view team members" ON internal_team_members;
CREATE POLICY "Internal team can view team members"
  ON internal_team_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = (select auth.jwt() ->> 'email')
        AND itm.is_active = true
    )
  );

-- business_units
DROP POLICY IF EXISTS "Internal team can manage business units" ON business_units;
CREATE POLICY "Internal team can manage business units"
  ON business_units
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- unified_customers
DROP POLICY IF EXISTS "Internal team can manage customers" ON unified_customers;
CREATE POLICY "Internal team can manage customers"
  ON unified_customers
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- marketplace_affiliate_commissions
DROP POLICY IF EXISTS "Marketplace affiliates can view own commissions" ON marketplace_affiliate_commissions;
CREATE POLICY "Marketplace affiliates can view own commissions"
  ON marketplace_affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

-- marketplace_affiliate_training_progress
DROP POLICY IF EXISTS "marketplace_affiliate_training_progress_insert_own" ON marketplace_affiliate_training_progress;
CREATE POLICY "marketplace_affiliate_training_progress_insert_own"
  ON marketplace_affiliate_training_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "marketplace_affiliate_training_progress_select_own" ON marketplace_affiliate_training_progress;
CREATE POLICY "marketplace_affiliate_training_progress_select_own"
  ON marketplace_affiliate_training_progress
  FOR SELECT
  TO authenticated
  USING (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "marketplace_affiliate_training_progress_update_own" ON marketplace_affiliate_training_progress;
CREATE POLICY "marketplace_affiliate_training_progress_update_own"
  ON marketplace_affiliate_training_progress
  FOR UPDATE
  TO authenticated
  USING (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

-- marketplace_affiliate_payouts
DROP POLICY IF EXISTS "Marketplace affiliates can view own payouts" ON marketplace_affiliate_payouts;
CREATE POLICY "Marketplace affiliates can view own payouts"
  ON marketplace_affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

-- marketplace_affiliate_badges
DROP POLICY IF EXISTS "marketplace_affiliate_badges_select_admin" ON marketplace_affiliate_badges;
CREATE POLICY "marketplace_affiliate_badges_select_admin"
  ON marketplace_affiliate_badges
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "marketplace_affiliate_badges_select_own" ON marketplace_affiliate_badges;
CREATE POLICY "marketplace_affiliate_badges_select_own"
  ON marketplace_affiliate_badges
  FOR SELECT
  TO authenticated
  USING (
    marketplace_affiliate_id IN (
      SELECT marketplace_affiliates.id FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
    )
  );

-- marketplace_affiliate_product_assets
DROP POLICY IF EXISTS "marketplace_affiliate_product_assets_manage_admin" ON marketplace_affiliate_product_assets;
CREATE POLICY "marketplace_affiliate_product_assets_manage_admin"
  ON marketplace_affiliate_product_assets
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "marketplace_affiliate_product_assets_select_active_affiliates" ON marketplace_affiliate_product_assets;
CREATE POLICY "marketplace_affiliate_product_assets_select_active_affiliates"
  ON marketplace_affiliate_product_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_affiliates
      WHERE marketplace_affiliates.user_id = (select auth.uid())
        AND marketplace_affiliates.status = 'active'
    )
  );
