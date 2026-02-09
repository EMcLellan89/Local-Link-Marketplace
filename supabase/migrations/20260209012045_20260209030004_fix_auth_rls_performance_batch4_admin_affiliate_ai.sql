/*
  # Fix Auth RLS Performance - Batch 4: Admin CRM, Affiliate, and AI Tables

  Optimizes RLS policies to use (SELECT auth.<function>()) pattern.

  ## Tables Modified
  - ad_creatives (1 policy)
  - admin_crm_activities (1 policy)
  - admin_crm_companies (1 policy)
  - admin_crm_contacts (1 policy)
  - admin_crm_goals (1 policy)
  - admin_crm_list_members (1 policy)
  - admin_crm_lists (1 policy)
  - admin_crm_project_assignments (1 policy)
  - admin_crm_projects (1 policy)
  - admin_sessions (2 policies)
  - admin_users (2 policies)
  - affiliate_clicks (1 policy)
  - affiliate_commissions (1 policy)
  - affiliate_partners (3 policies)
  - affiliate_payouts (1 policy)
  - affiliate_referrals (2 policies)
  - ai_agents (1 policy)
  - ai_assistant_conversations (8 policies)
  - ai_bot_setups (2 policies)
  - ai_bot_subscriptions (3 policies)
  - ai_circuit_breaker (1 policy)
  - ai_events (1 policy)
  - ai_health_snapshots (1 policy)
  - ai_jobs (1 policy)
  - ai_prompt_templates (1 policy)
  - ai_runs (1 policy)
  - ai_system_settings (1 policy)
  - ai_tool_calls (2 policies)
  - ai_tools (1 policy)
  - appointment_setting_bookings (2 policies)
  - appointments (1 policy)
  - audit_actions_log (1 policy)
  - audit_logs (1 policy)
  - badge_audit_log (1 policy)
  - badge_awards (1 policy)

  Total: 50 policies optimized
*/

-- ad_creatives
DROP POLICY IF EXISTS "Admins full access" ON ad_creatives;
CREATE POLICY "Admins full access"
  ON ad_creatives
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_activities
DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;
CREATE POLICY "Admins can manage activities"
  ON admin_crm_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_companies
DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;
CREATE POLICY "Admins can manage companies"
  ON admin_crm_companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_contacts
DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;
CREATE POLICY "Admins can manage contacts"
  ON admin_crm_contacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_goals
DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;
CREATE POLICY "Admins can manage goals"
  ON admin_crm_goals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_list_members
DROP POLICY IF EXISTS "Admins can manage list members" ON admin_crm_list_members;
CREATE POLICY "Admins can manage list members"
  ON admin_crm_list_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_lists
DROP POLICY IF EXISTS "Admins can manage lists" ON admin_crm_lists;
CREATE POLICY "Admins can manage lists"
  ON admin_crm_lists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_project_assignments
DROP POLICY IF EXISTS "Admins can manage project assignments" ON admin_crm_project_assignments;
CREATE POLICY "Admins can manage project assignments"
  ON admin_crm_project_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_crm_projects
DROP POLICY IF EXISTS "Admins can manage projects" ON admin_crm_projects;
CREATE POLICY "Admins can manage projects"
  ON admin_crm_projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- admin_sessions
DROP POLICY IF EXISTS "Admin users can delete own sessions" ON admin_sessions;
CREATE POLICY "Admin users can delete own sessions"
  ON admin_sessions
  FOR DELETE
  TO authenticated
  USING (admin_user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin users can view own sessions" ON admin_sessions;
CREATE POLICY "Admin users can view own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (admin_user_id = (SELECT auth.uid()));

-- admin_users
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- affiliate_clicks
DROP POLICY IF EXISTS "Partners can view own clicks" ON affiliate_clicks;
CREATE POLICY "Partners can view own clicks"
  ON affiliate_clicks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_clicks.partner_id
      AND affiliate_partners.user_id = (SELECT auth.uid())
    )
  );

-- affiliate_commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_commissions.partner_id
      AND affiliate_partners.user_id = (SELECT auth.uid())
    )
  );

-- affiliate_partners
DROP POLICY IF EXISTS "Partners can read their own profile" ON affiliate_partners;
CREATE POLICY "Partners can read their own profile"
  ON affiliate_partners
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Partners can update own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can update own affiliate data"
  ON affiliate_partners
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Partners can view own affiliate data" ON affiliate_partners;
CREATE POLICY "Partners can view own affiliate data"
  ON affiliate_partners
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- affiliate_payouts
DROP POLICY IF EXISTS "Partners can view own payouts" ON affiliate_payouts;
CREATE POLICY "Partners can view own payouts"
  ON affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_payouts.partner_id
      AND affiliate_partners.user_id = (SELECT auth.uid())
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
      SELECT affiliate_partners.id FROM affiliate_partners
      WHERE affiliate_partners.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can view own referrals" ON affiliate_referrals;
CREATE POLICY "Partners can view own referrals"
  ON affiliate_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_partners
      WHERE affiliate_partners.id = affiliate_referrals.partner_id
      AND affiliate_partners.user_id = (SELECT auth.uid())
    )
  );

-- ai_agents
DROP POLICY IF EXISTS "Admin full access to agents" ON ai_agents;
CREATE POLICY "Admin full access to agents"
  ON ai_agents
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_assistant_conversations
DROP POLICY IF EXISTS "Users can delete own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can delete own AI conversations"
  ON ai_assistant_conversations
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can manage own conversations"
  ON ai_assistant_conversations
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can update own AI conversations"
  ON ai_assistant_conversations
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can update own conversations"
  ON ai_assistant_conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own AI conversations"
  ON ai_assistant_conversations
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own conversations"
  ON ai_assistant_conversations
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ai_bot_setups
DROP POLICY IF EXISTS "Merchants can update own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can update own bot setups"
  ON ai_bot_setups
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can view own bot setups"
  ON ai_bot_setups
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- ai_bot_subscriptions
DROP POLICY IF EXISTS "Admins can manage all bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Admins can manage all bot subscriptions"
  ON ai_bot_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can update own bot subscriptions"
  ON ai_bot_subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can view own bot subscriptions"
  ON ai_bot_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ai_circuit_breaker
DROP POLICY IF EXISTS "Admin access to circuit breaker" ON ai_circuit_breaker;
CREATE POLICY "Admin access to circuit breaker"
  ON ai_circuit_breaker
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_events
DROP POLICY IF EXISTS "Admin full access to ai_events" ON ai_events;
CREATE POLICY "Admin full access to ai_events"
  ON ai_events
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_health_snapshots
DROP POLICY IF EXISTS "Admin access to health snapshots" ON ai_health_snapshots;
CREATE POLICY "Admin access to health snapshots"
  ON ai_health_snapshots
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_jobs
DROP POLICY IF EXISTS "Admin full access to ai_jobs" ON ai_jobs;
CREATE POLICY "Admin full access to ai_jobs"
  ON ai_jobs
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_prompt_templates
DROP POLICY IF EXISTS "Admin full access to templates" ON ai_prompt_templates;
CREATE POLICY "Admin full access to templates"
  ON ai_prompt_templates
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_runs
DROP POLICY IF EXISTS "Admin full access to ai_runs" ON ai_runs;
CREATE POLICY "Admin full access to ai_runs"
  ON ai_runs
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_system_settings
DROP POLICY IF EXISTS "Admin access to system settings" ON ai_system_settings;
CREATE POLICY "Admin access to system settings"
  ON ai_system_settings
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- ai_tool_calls
DROP POLICY IF EXISTS "Admins can view all tool calls" ON ai_tool_calls;
CREATE POLICY "Admins can view all tool calls"
  ON ai_tool_calls
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view own tool calls" ON ai_tool_calls;
CREATE POLICY "Users can view own tool calls"
  ON ai_tool_calls
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_assistant_conversations
      WHERE ai_assistant_conversations.id = ai_tool_calls.conversation_id
      AND ai_assistant_conversations.user_id = (SELECT auth.uid())
    )
  );

-- ai_tools
DROP POLICY IF EXISTS "Admins can manage tools" ON ai_tools;
CREATE POLICY "Admins can manage tools"
  ON ai_tools
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- appointment_setting_bookings
DROP POLICY IF EXISTS "Merchants can update own appointment bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can update own appointment bookings"
  ON appointment_setting_bookings
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own appointment bookings" ON appointment_setting_bookings;
CREATE POLICY "Merchants can view own appointment bookings"
  ON appointment_setting_bookings
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- appointments
DROP POLICY IF EXISTS "Customers can view own appointments" ON appointments;
CREATE POLICY "Customers can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = customer_id);

-- audit_actions_log
DROP POLICY IF EXISTS "Admin full access to audit log" ON audit_actions_log;
CREATE POLICY "Admin full access to audit log"
  ON audit_actions_log
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- badge_audit_log
DROP POLICY IF EXISTS "badge_audit_log_admin_view" ON badge_audit_log;
CREATE POLICY "badge_audit_log_admin_view"
  ON badge_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- badge_awards
DROP POLICY IF EXISTS "Users can view own badges" ON badge_awards;
CREATE POLICY "Users can view own badges"
  ON badge_awards
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);