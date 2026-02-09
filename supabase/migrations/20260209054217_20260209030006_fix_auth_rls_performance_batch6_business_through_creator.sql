/*
  # Optimize Auth RLS Performance - Batch 6 (Business, Campaigns, CRM)

  1. Changes
    - Wraps all auth.uid() calls in subqueries
    - Applies to: commissions, communications_transactions, crm_activities, crm_leads, crm_tasks

  2. Performance Impact
    - Improves commission calculation queries
    - Speeds up CRM data access
    - Optimizes communications tracking

  3. Security Notes
    - Maintains merchant and partner-specific access
    - No functional security changes
*/

-- Commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON commissions;
CREATE POLICY "Partners can view own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- Communications transactions
DROP POLICY IF EXISTS "Merchants can view own communications" ON communications_transactions;
CREATE POLICY "Merchants can view own communications"
  ON communications_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- CRM activities
DROP POLICY IF EXISTS "Merchants can view own CRM activities" ON crm_activities;
CREATE POLICY "Merchants can view own CRM activities"
  ON crm_activities FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own CRM activities" ON crm_activities;
CREATE POLICY "Merchants can manage own CRM activities"
  ON crm_activities FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- CRM leads
DROP POLICY IF EXISTS "Merchants can view own leads" ON crm_leads;
CREATE POLICY "Merchants can view own leads"
  ON crm_leads FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own leads" ON crm_leads;
CREATE POLICY "Merchants can manage own leads"
  ON crm_leads FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- CRM tasks
DROP POLICY IF EXISTS "Merchants can view own tasks" ON crm_tasks;
CREATE POLICY "Merchants can view own tasks"
  ON crm_tasks FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own tasks" ON crm_tasks;
CREATE POLICY "Merchants can manage own tasks"
  ON crm_tasks FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );
