/*
  # Fix Auth RLS Performance - Batch 9: Admin, Affiliate, and AI Tables (Schema Corrected)

  1. Purpose
    - Optimize RLS policies for admin CRM, affiliate, and AI systems
    - Wrap auth.uid() in subquery for performance
  
  2. Tables Affected
    - ad_creatives (business-level, public read for approved)
    - admin_crm_* tables (use internal_team_members.id directly)
    - admin_sessions, admin_users
    - affiliate_* tables (partners uses user_id, payouts, referrals)
    - ai_assistant_conversations (uses user_id)
    - ai_bot_setups (uses merchant_id)
    - ai_bot_subscriptions (uses user_id and entity_id)
    - ai_tool_calls (uses user_id)
  
  3. Performance Impact
    - Improves admin dashboard and affiliate system performance
*/

-- ad_creatives policies (business-level, no partner_id)
DROP POLICY IF EXISTS "Public can view approved creatives" ON ad_creatives;
CREATE POLICY "Public can view approved creatives"
  ON ad_creatives FOR SELECT
  TO authenticated
  USING (is_approved = true AND is_active = true);

-- admin_crm_activities policies (internal_team_members uses id as auth id)
DROP POLICY IF EXISTS "Internal team can view CRM activities" ON admin_crm_activities;
CREATE POLICY "Internal team can view CRM activities"
  ON admin_crm_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_companies policies
DROP POLICY IF EXISTS "Internal team can view companies" ON admin_crm_companies;
CREATE POLICY "Internal team can view companies"
  ON admin_crm_companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_contacts policies
DROP POLICY IF EXISTS "Internal team can view contacts" ON admin_crm_contacts;
CREATE POLICY "Internal team can view contacts"
  ON admin_crm_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_goals policies
DROP POLICY IF EXISTS "Internal team can view goals" ON admin_crm_goals;
CREATE POLICY "Internal team can view goals"
  ON admin_crm_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_lists policies
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

-- admin_crm_projects policies
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

-- admin_users policies
DROP POLICY IF EXISTS "Admins can view own record" ON admin_users;
CREATE POLICY "Admins can view own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- affiliate_partners policies (uses user_id, not partner_id)
DROP POLICY IF EXISTS "Users can view own affiliate record" ON affiliate_partners;
CREATE POLICY "Users can view own affiliate record"
  ON affiliate_partners FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

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
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = affiliate_referrals.partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- ai_assistant_conversations policies
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own conversations"
  ON ai_assistant_conversations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can manage own conversations"
  ON ai_assistant_conversations FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ai_bot_setups policies (uses merchant_id)
DROP POLICY IF EXISTS "Merchants can view own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can view own bot setups"
  ON ai_bot_setups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = ai_bot_setups.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- ai_bot_subscriptions policies (uses user_id directly)
DROP POLICY IF EXISTS "Users can view own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can view own bot subscriptions"
  ON ai_bot_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can manage own bot subscriptions"
  ON ai_bot_subscriptions FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ai_tool_calls policies (uses user_id directly)
DROP POLICY IF EXISTS "Users can view own tool calls" ON ai_tool_calls;
CREATE POLICY "Users can view own tool calls"
  ON ai_tool_calls FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);
