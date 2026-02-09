/*
  # Fix Auth RLS Performance - Batch 15: LocalLink CRM & Subscription Tables

  1. Changes
    - Optimize Auth RLS policies by wrapping auth.uid() in subqueries
    - Prevents re-evaluation of auth.uid() for each row
    - Maintains exact same access control logic
    
  2. Tables Covered
    - ll_crm_contacts (consolidate 3 policies, optimize)
    - ll_crm_pipelines (1 policy)
    - ll_crm_deals (consolidate 3 policies, optimize)
    - ll_crm_activities (1 policy)
    - ll_crm_subscriptions (consolidate 4 policies, optimize)
    - subscription_items (2 policies)
    - subscriptions (2 policies)
    - feature_flags (2 policies)
    
  3. Note
    - ll_crm tables use merchant_id (not partner_id)
    - subscriptions use org_id with org_members join
*/

-- ll_crm_contacts (consolidate and optimize 3 policies)
DROP POLICY IF EXISTS "Merchants can manage own CRM contacts" ON ll_crm_contacts;
DROP POLICY IF EXISTS "Merchants can manage own contacts" ON ll_crm_contacts;
DROP POLICY IF EXISTS "Merchants can view own contacts" ON ll_crm_contacts;

CREATE POLICY "Merchants can manage own CRM contacts"
  ON ll_crm_contacts FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_pipelines
DROP POLICY IF EXISTS "Merchants can manage own CRM pipelines" ON ll_crm_pipelines;
CREATE POLICY "Merchants can manage own CRM pipelines"
  ON ll_crm_pipelines FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_deals (consolidate and optimize 3 policies)
DROP POLICY IF EXISTS "Merchants can manage own CRM deals" ON ll_crm_deals;
DROP POLICY IF EXISTS "Merchants can manage own deals" ON ll_crm_deals;
DROP POLICY IF EXISTS "Merchants can view own deals" ON ll_crm_deals;

CREATE POLICY "Merchants can manage own CRM deals"
  ON ll_crm_deals FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_activities
DROP POLICY IF EXISTS "Merchants can manage own CRM activities" ON ll_crm_activities;
CREATE POLICY "Merchants can manage own CRM activities"
  ON ll_crm_activities FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_crm_subscriptions (consolidate and optimize 4 policies)
DROP POLICY IF EXISTS "Merchants can manage own CRM subscriptions" ON ll_crm_subscriptions;
DROP POLICY IF EXISTS "Merchants can update own CRM subscription" ON ll_crm_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own CRM subscription" ON ll_crm_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own CRM subscriptions" ON ll_crm_subscriptions;

CREATE POLICY "Merchants can manage own CRM subscriptions"
  ON ll_crm_subscriptions FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- subscription_items
DROP POLICY IF EXISTS "subscription_items_admin" ON subscription_items;
CREATE POLICY "subscription_items_admin"
  ON subscription_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "subscription_items_select" ON subscription_items;
CREATE POLICY "subscription_items_select"
  ON subscription_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_id = subscription_items.org_id
        AND profile_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_admin" ON subscriptions;
CREATE POLICY "subscriptions_admin"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_id = subscriptions.org_id
        AND profile_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- feature_flags
DROP POLICY IF EXISTS "feature_flags_admin" ON feature_flags;
CREATE POLICY "feature_flags_admin"
  ON feature_flags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- feature_flags_select already allows all SELECT (true), no need to change