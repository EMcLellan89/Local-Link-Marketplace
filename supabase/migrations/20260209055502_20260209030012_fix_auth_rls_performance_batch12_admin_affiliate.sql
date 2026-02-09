/*
  # Fix Auth RLS Performance - Batch 12: Admin CRM & Affiliate Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on admin CRM and affiliate tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - admin_crm_lists (2 policies)
    - admin_crm_project_assignments (1 policy)
    - admin_crm_projects (2 policies)
    - admin_sessions (3 policies)
    - affiliate_clicks (1 policy)
    - affiliate_commissions (1 policy)
    - affiliate_partners (3 policies)
    - affiliate_payouts (1 policy)
    - affiliate_referrals (1 policy)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- admin_crm_lists policies
DROP POLICY IF EXISTS "Admins can manage lists" ON admin_crm_lists;
CREATE POLICY "Admins can manage lists"
  ON admin_crm_lists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view lists" ON admin_crm_lists;
CREATE POLICY "Internal team can view lists"
  ON admin_crm_lists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_project_assignments policies
DROP POLICY IF EXISTS "Admins can manage project assignments" ON admin_crm_project_assignments;
CREATE POLICY "Admins can manage project assignments"
  ON admin_crm_project_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- admin_crm_projects policies
DROP POLICY IF EXISTS "Admins can manage projects" ON admin_crm_projects;
CREATE POLICY "Admins can manage projects"
  ON admin_crm_projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view projects" ON admin_crm_projects;
CREATE POLICY "Internal team can view projects"
  ON admin_crm_projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_sessions policies
DROP POLICY IF EXISTS "Admin users can delete own sessions" ON admin_sessions;
CREATE POLICY "Admin users can delete own sessions"
  ON admin_sessions FOR DELETE
  TO authenticated
  USING (admin_user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admin users can view own sessions" ON admin_sessions;
CREATE POLICY "Admin users can view own sessions"
  ON admin_sessions FOR SELECT
  TO authenticated
  USING (admin_user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can view own sessions" ON admin_sessions;
CREATE POLICY "Admins can view own sessions"
  ON admin_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = admin_sessions.admin_user_id
        AND au.id = (select auth.uid())
    )
  );

-- affiliate_clicks policies
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

-- affiliate_commissions policies
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- affiliate_partners policies
DROP POLICY IF EXISTS "Partners can update own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can update own affiliate data"
  ON affiliate_partners FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Partners can view own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can view own affiliate data"
  ON affiliate_partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own affiliate record" ON affiliate_partners;
CREATE POLICY "Users can view own affiliate record"
  ON affiliate_partners FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- affiliate_payouts policies
DROP POLICY IF EXISTS "Partners can view own payouts" ON affiliate_payouts;
CREATE POLICY "Partners can view own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = affiliate_payouts.partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- affiliate_referrals policies
DROP POLICY IF EXISTS "Partners can view own referrals" ON affiliate_referrals;
CREATE POLICY "Partners can view own referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );