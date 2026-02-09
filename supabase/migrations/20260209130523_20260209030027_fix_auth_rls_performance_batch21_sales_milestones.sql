/*
  # Optimize Auth RLS Performance - Batch 21: Sales & Milestone Tables
  
  1. Tables Optimized
    - sales_events (2 policies)
    - referral_attribution (2 policies)
    - ll_crm_invoices (1 policy)
    - story_assets (1 policy)
    - external_business_sales (2 policies)
    - partner_sales_dashboard (2 policies)
    - ll_crm_payments (1 policy)
    - partner_milestone_badges (1 policy)
    - partner_milestone_certs (1 policy)
    - milestone_system_events (2 policies)
    - milestone_badge_audit_log (2 policies)
    - ll_crm_ai_usage (2 policies)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid()) for performance
    - Maintain exact same access control logic
*/

-- sales_events
DROP POLICY IF EXISTS "Admins have full access to sales events" ON sales_events;
DROP POLICY IF EXISTS "Partners can view own sales events" ON sales_events;

CREATE POLICY "Admins have full access to sales events"
  ON sales_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own sales events"
  ON sales_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = sales_events.attributed_partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- referral_attribution
DROP POLICY IF EXISTS "Admins have full access to attribution" ON referral_attribution;
DROP POLICY IF EXISTS "Partners can view own attribution" ON referral_attribution;

CREATE POLICY "Admins have full access to attribution"
  ON referral_attribution FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own attribution"
  ON referral_attribution FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = referral_attribution.attributed_partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- ll_crm_invoices
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON ll_crm_invoices;

CREATE POLICY "Merchants can manage own invoices"
  ON ll_crm_invoices FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- story_assets
DROP POLICY IF EXISTS "story_assets_own" ON story_assets;

CREATE POLICY "story_assets_own"
  ON story_assets FOR SELECT
  TO authenticated
  USING (
    book_id IS NULL
    OR EXISTS (
      SELECT 1 FROM story_books b
      WHERE b.id = story_assets.book_id
        AND b.profile_id = (select auth.uid())
    )
  );

-- external_business_sales
DROP POLICY IF EXISTS "Admin full access to external sales" ON external_business_sales;
DROP POLICY IF EXISTS "Partners can view their own external sales" ON external_business_sales;

CREATE POLICY "Admin full access to external sales"
  ON external_business_sales FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own external sales"
  ON external_business_sales FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = (select auth.uid())
        AND id = external_business_sales.partner_id
    )
  );

-- partner_sales_dashboard
DROP POLICY IF EXISTS "Admin full access to partner sales dashboard" ON partner_sales_dashboard;
DROP POLICY IF EXISTS "Partners can view their own sales dashboard" ON partner_sales_dashboard;

CREATE POLICY "Admin full access to partner sales dashboard"
  ON partner_sales_dashboard FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own sales dashboard"
  ON partner_sales_dashboard FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = (select auth.uid())
        AND id = partner_sales_dashboard.partner_id
    )
  );

-- ll_crm_payments
DROP POLICY IF EXISTS "Merchants can manage own payments" ON ll_crm_payments;

CREATE POLICY "Merchants can manage own payments"
  ON ll_crm_payments FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_milestone_badges
DROP POLICY IF EXISTS "Partners can view own milestone badges" ON partner_milestone_badges;

CREATE POLICY "Partners can view own milestone badges"
  ON partner_milestone_badges FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_milestone_certs
DROP POLICY IF EXISTS "Partners can view own milestone certifications" ON partner_milestone_certs;

CREATE POLICY "Partners can view own milestone certifications"
  ON partner_milestone_certs FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- milestone_system_events
DROP POLICY IF EXISTS "Admins can manage system events" ON milestone_system_events;
DROP POLICY IF EXISTS "Partners can view own system events" ON milestone_system_events;

CREATE POLICY "Admins can manage system events"
  ON milestone_system_events FOR ALL
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

CREATE POLICY "Partners can view own system events"
  ON milestone_system_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = milestone_system_events.actor_id
        AND p.user_id = (select auth.uid())
    )
  );

-- milestone_badge_audit_log
DROP POLICY IF EXISTS "Admins can manage badge audit" ON milestone_badge_audit_log;
DROP POLICY IF EXISTS "Partners can view own badge audit" ON milestone_badge_audit_log;

CREATE POLICY "Admins can manage badge audit"
  ON milestone_badge_audit_log FOR ALL
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

CREATE POLICY "Partners can view own badge audit"
  ON milestone_badge_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = milestone_badge_audit_log.partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- ll_crm_ai_usage
DROP POLICY IF EXISTS "Merchants can insert own AI usage" ON ll_crm_ai_usage;
DROP POLICY IF EXISTS "Merchants can view own AI usage" ON ll_crm_ai_usage;

CREATE POLICY "Merchants can insert own AI usage"
  ON ll_crm_ai_usage FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own AI usage"
  ON ll_crm_ai_usage FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );
