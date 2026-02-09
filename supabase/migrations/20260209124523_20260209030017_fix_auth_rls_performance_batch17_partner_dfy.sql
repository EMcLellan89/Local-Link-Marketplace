/*
  # Fix Auth RLS Performance - Batch 17: Partner & DFY Tables

  1. Changes
    - Optimize Auth RLS policies by wrapping auth.uid() in subqueries
    - Prevents re-evaluation of auth.uid() for each row
    - Maintains exact same access control logic
    
  2. Tables Covered
    - recurring_commission_schedule (2 policies)
    - profit_based_commission_costs (2 policies)
    - ll_crm_workflows (1 policy)
    - ll_crm_workflow_executions (1 policy)
    - ll_crm_documents (1 policy)
    - digital_assets (2 policies)
    - product_asset_access (1 policy)
    - post_purchase_pages (1 policy)
    - fulfillment_email_templates (1 policy)
    - partner_service_qualifications (1 policy)
    - dfy_disputes (3 policies)
    - partner_campaigns (3 policies)
*/

-- recurring_commission_schedule
DROP POLICY IF EXISTS "Admin full access to recurring commission schedule" ON recurring_commission_schedule;
CREATE POLICY "Admin full access to recurring commission schedule"
  ON recurring_commission_schedule FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view their recurring commission schedule" ON recurring_commission_schedule;
CREATE POLICY "Partners can view their recurring commission schedule"
  ON recurring_commission_schedule FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = (select auth.uid())
        AND id = recurring_commission_schedule.partner_id
    )
  );

-- profit_based_commission_costs
DROP POLICY IF EXISTS "Admin full access to profit based commissions" ON profit_based_commission_costs;
CREATE POLICY "Admin full access to profit based commissions"
  ON profit_based_commission_costs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view their profit based commissions" ON profit_based_commission_costs;
CREATE POLICY "Partners can view their profit based commissions"
  ON profit_based_commission_costs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM marketplace_orders mo
      JOIN partners p ON p.id = mo.partner_id
      WHERE p.user_id = (select auth.uid())
        AND mo.id = profit_based_commission_costs.order_id
    )
  );

-- ll_crm_workflows
DROP POLICY IF EXISTS "Merchants can manage own workflows" ON ll_crm_workflows;
CREATE POLICY "Merchants can manage own workflows"
  ON ll_crm_workflows FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_workflow_executions (has merchant_id directly)
DROP POLICY IF EXISTS "Merchants can view own workflow executions" ON ll_crm_workflow_executions;
CREATE POLICY "Merchants can view own workflow executions"
  ON ll_crm_workflow_executions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_documents
DROP POLICY IF EXISTS "Merchants can manage own documents" ON ll_crm_documents;
CREATE POLICY "Merchants can manage own documents"
  ON ll_crm_documents FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- digital_assets (org-based, not creator-based)
DROP POLICY IF EXISTS "admin_digital_assets_all" ON digital_assets;
CREATE POLICY "admin_digital_assets_all"
  ON digital_assets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "customer_assets_granted" ON digital_assets;
CREATE POLICY "customer_assets_granted"
  ON digital_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customer_asset_grants
      WHERE asset_id = digital_assets.id
        AND user_id = (select auth.uid())
    )
  );

-- product_asset_access
DROP POLICY IF EXISTS "admin_product_asset_all" ON product_asset_access;
CREATE POLICY "admin_product_asset_all"
  ON product_asset_access FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- post_purchase_pages
DROP POLICY IF EXISTS "admin_post_purchase_all" ON post_purchase_pages;
CREATE POLICY "admin_post_purchase_all"
  ON post_purchase_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- fulfillment_email_templates
DROP POLICY IF EXISTS "admin_fulfillment_templates_all" ON fulfillment_email_templates;
CREATE POLICY "admin_fulfillment_templates_all"
  ON fulfillment_email_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_service_qualifications (partner_id used directly as user_id in existing policy)
DROP POLICY IF EXISTS "partner_quals_own" ON partner_service_qualifications;
CREATE POLICY "partner_quals_own"
  ON partner_service_qualifications FOR ALL
  TO authenticated
  USING (
    partner_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- dfy_disputes (uses job_id to join to dfy_jobs)
DROP POLICY IF EXISTS "Merchants can view own job disputes" ON dfy_disputes;
CREATE POLICY "Merchants can view own job disputes"
  ON dfy_disputes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM dfy_jobs dj
      JOIN merchants m ON m.id = dj.merchant_id
      WHERE dj.id = dfy_disputes.job_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can view assigned job disputes" ON dfy_disputes;
CREATE POLICY "Partners can view assigned job disputes"
  ON dfy_disputes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM dfy_jobs dj
      JOIN partners p ON p.id = dj.selected_partner_id
      WHERE dj.id = dfy_disputes.job_id
        AND p.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can manage disputes" ON dfy_disputes;
CREATE POLICY "Admins can manage disputes"
  ON dfy_disputes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_campaigns
DROP POLICY IF EXISTS "Partners can view own campaigns" ON partner_campaigns;
CREATE POLICY "Partners can view own campaigns"
  ON partner_campaigns FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can update own campaigns" ON partner_campaigns;
CREATE POLICY "Partners can update own campaigns"
  ON partner_campaigns FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins have full access to campaigns" ON partner_campaigns;
CREATE POLICY "Admins have full access to campaigns"
  ON partner_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );