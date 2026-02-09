/*
  # Fix Auth RLS Performance - Batch 1: Direct auth.uid() calls
  
  1. Performance Improvement
    - Wrap auth.uid() calls in SELECT to prevent re-evaluation for each row
    - Pattern: auth.uid() → (select auth.uid())
  
  2. Policies Updated
    - dev_mode_config: Admin full access
    - dfy_disputes: Admins can manage disputes
    - dfy_job_submissions: Admins can manage submissions
    - milestone_badge_audit_log: Admins can manage badge audit
    - milestone_badge_rules: Admins can manage badge rules
    - milestone_system_events: Admins can manage system events
    - outreach_logs: Admin manage
    - crm_migration_requests: Merchants can update own
    - merchant_crm_preferences: Merchants can update own CRM preferences
*/

-- dev_mode_config
DROP POLICY IF EXISTS "Admin full access to dev mode config" ON dev_mode_config;
CREATE POLICY "Admin full access to dev mode config"
  ON dev_mode_config
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

-- dfy_disputes
DROP POLICY IF EXISTS "Admins can manage disputes" ON dfy_disputes;
CREATE POLICY "Admins can manage disputes"
  ON dfy_disputes
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- dfy_job_submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON dfy_job_submissions;
CREATE POLICY "Admins can manage submissions"
  ON dfy_job_submissions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- milestone_badge_audit_log
DROP POLICY IF EXISTS "Admins can manage badge audit" ON milestone_badge_audit_log;
CREATE POLICY "Admins can manage badge audit"
  ON milestone_badge_audit_log
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- milestone_badge_rules
DROP POLICY IF EXISTS "Admins can manage badge rules" ON milestone_badge_rules;
CREATE POLICY "Admins can manage badge rules"
  ON milestone_badge_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- milestone_system_events
DROP POLICY IF EXISTS "Admins can manage system events" ON milestone_system_events;
CREATE POLICY "Admins can manage system events"
  ON milestone_system_events
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- outreach_logs
DROP POLICY IF EXISTS "outreach_logs_admin_manage" ON outreach_logs;
CREATE POLICY "outreach_logs_admin_manage"
  ON outreach_logs
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- crm_migration_requests
DROP POLICY IF EXISTS "Merchants can update own migration requests" ON crm_migration_requests;
CREATE POLICY "Merchants can update own migration requests"
  ON crm_migration_requests
  FOR UPDATE
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ))
  WITH CHECK (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ));

-- merchant_crm_preferences
DROP POLICY IF EXISTS "Merchants can update own CRM preferences" ON merchant_crm_preferences;
CREATE POLICY "Merchants can update own CRM preferences"
  ON merchant_crm_preferences
  FOR UPDATE
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ))
  WITH CHECK (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ));