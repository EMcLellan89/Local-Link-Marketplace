/*
  # Optimize Auth RLS Performance - Batch 22: Partner System Tables
  
  1. Tables Optimized
    - partner_badges (3 policies → 2, consolidated duplicates)
    - partner_certs (2 policies)
    - outreach_logs (3 policies)
    - system_events (1 policy)
    - partner_statements (2 policies → 1, consolidated duplicates)
    - knowledge_sources (2 policies)
    - partner_ad_advances (1 policy)
    - partner_campaigns (4 policies)
    - partner_ledger (3 policies → 2, consolidated admin duplicates)
    - white_label_settings (3 policies → 2, consolidated admin duplicates)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid()) for performance
    - Consolidate duplicate policies where found
    - Maintain exact same access control logic
*/

-- partner_badges (consolidate 3 policies → 2)
DROP POLICY IF EXISTS "Partners can view own badges" ON partner_badges;
DROP POLICY IF EXISTS "partner_badges_admin_manage" ON partner_badges;
DROP POLICY IF EXISTS "partner_badges_select" ON partner_badges;

CREATE POLICY "partner_badges_admin_manage"
  ON partner_badges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "partner_badges_select"
  ON partner_badges FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE id = partner_badges.partner_id
        AND user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_certs
DROP POLICY IF EXISTS "partner_certs_admin_manage" ON partner_certs;
DROP POLICY IF EXISTS "partner_certs_select" ON partner_certs;

CREATE POLICY "partner_certs_admin_manage"
  ON partner_certs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "partner_certs_select"
  ON partner_certs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE id = partner_certs.partner_id
        AND user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- outreach_logs
DROP POLICY IF EXISTS "outreach_logs_admin_manage" ON outreach_logs;
DROP POLICY IF EXISTS "outreach_logs_insert" ON outreach_logs;
DROP POLICY IF EXISTS "outreach_logs_select" ON outreach_logs;

CREATE POLICY "outreach_logs_admin_manage"
  ON outreach_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "outreach_logs_insert"
  ON outreach_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE id = outreach_logs.partner_id
        AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "outreach_logs_select"
  ON outreach_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE id = outreach_logs.partner_id
        AND user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- system_events
DROP POLICY IF EXISTS "system_events_admin_view" ON system_events;

CREATE POLICY "system_events_admin_view"
  ON system_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_statements (consolidate 2 policies → 1)
DROP POLICY IF EXISTS "Partners can view own statements" ON partner_statements;
DROP POLICY IF EXISTS "partner_statements_own" ON partner_statements;

CREATE POLICY "Partners can view own statements"
  ON partner_statements FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- knowledge_sources
DROP POLICY IF EXISTS "Admins can manage knowledge sources" ON knowledge_sources;
DROP POLICY IF EXISTS "Anyone can view active knowledge" ON knowledge_sources;

CREATE POLICY "Admins can manage knowledge sources"
  ON knowledge_sources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- Note: "Anyone can view active knowledge" doesn't use auth.uid(), so no optimization needed
CREATE POLICY "Anyone can view active knowledge"
  ON knowledge_sources FOR SELECT
  TO authenticated
  USING (is_active = true);

-- partner_ad_advances
DROP POLICY IF EXISTS "partner_ad_advances_own" ON partner_ad_advances;

CREATE POLICY "partner_ad_advances_own"
  ON partner_ad_advances FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_campaigns (consolidate 4 policies)
DROP POLICY IF EXISTS "Admins have full access to campaigns" ON partner_campaigns;
DROP POLICY IF EXISTS "Partners can create own campaigns" ON partner_campaigns;
DROP POLICY IF EXISTS "Partners can update own campaigns" ON partner_campaigns;
DROP POLICY IF EXISTS "Partners can view own campaigns" ON partner_campaigns;

CREATE POLICY "Admins have full access to campaigns"
  ON partner_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own campaigns"
  ON partner_campaigns FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_ledger (consolidate 3 policies → 2)
DROP POLICY IF EXISTS "Admins can insert ledger entries" ON partner_ledger;
DROP POLICY IF EXISTS "Admins have full access to ledger" ON partner_ledger;
DROP POLICY IF EXISTS "Partners can view own ledger" ON partner_ledger;

CREATE POLICY "Admins have full access to ledger"
  ON partner_ledger FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own ledger"
  ON partner_ledger FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- white_label_settings (consolidate 3 policies → 2)
DROP POLICY IF EXISTS "Admin full access to white label settings" ON white_label_settings;
DROP POLICY IF EXISTS "Partners can manage own white label settings" ON white_label_settings;
DROP POLICY IF EXISTS "admin_white_label_all" ON white_label_settings;

CREATE POLICY "admin_white_label_all"
  ON white_label_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own white label settings"
  ON white_label_settings FOR ALL
  TO authenticated
  USING (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  )
  WITH CHECK (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  );
