/*
  # Fix Auth RLS Performance - Batch 4: Truly unwrapped auth.uid() calls
  
  1. Performance Improvement
    - Fix policies that directly use auth.uid() without any SELECT wrapper
  
  2. Policies Updated
    - customer_asset_grants
    - marketplace_checkout_sessions
    - marketplace_orders
    - marketplace_subscriptions
    - merchant_members
    - partner_certifications (view policy)
    - partner_notifications
    - partner_playbook_completions
    - partner_playbook_progress (view policy)
    - partner_streak_freezes
    - providers
    - story_audit_logs
*/

-- customer_asset_grants
DROP POLICY IF EXISTS "customer_grants_own" ON customer_asset_grants;
CREATE POLICY "customer_grants_own"
  ON customer_asset_grants
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- marketplace_checkout_sessions
DROP POLICY IF EXISTS "Users can view own checkout sessions" ON marketplace_checkout_sessions;
CREATE POLICY "Users can view own checkout sessions"
  ON marketplace_checkout_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- marketplace_orders
DROP POLICY IF EXISTS "Users can view own orders" ON marketplace_orders;
CREATE POLICY "Users can view own orders"
  ON marketplace_orders
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- marketplace_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON marketplace_subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON marketplace_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- merchant_members
DROP POLICY IF EXISTS "merchant members can view memberships" ON merchant_members;
CREATE POLICY "merchant members can view memberships"
  ON merchant_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR is_merchant_member(merchant_id)
  );

-- partner_certifications (view policy)
DROP POLICY IF EXISTS "Partners can view own certifications" ON partner_certifications;
CREATE POLICY "Partners can view own certifications"
  ON partner_certifications
  FOR SELECT
  TO authenticated
  USING (partner_id = (select auth.uid()));

-- partner_notifications (update policy)
DROP POLICY IF EXISTS "Partners can update their own notifications" ON partner_notifications;
CREATE POLICY "Partners can update their own notifications"
  ON partner_notifications
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = partner_id)
  WITH CHECK ((select auth.uid()) = partner_id);

-- partner_notifications (select policy)
DROP POLICY IF EXISTS "Partners can view their own notifications" ON partner_notifications;
CREATE POLICY "Partners can view their own notifications"
  ON partner_notifications
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = partner_id);

-- partner_playbook_completions
DROP POLICY IF EXISTS "Partners can view own completions" ON partner_playbook_completions;
CREATE POLICY "Partners can view own completions"
  ON partner_playbook_completions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- partner_playbook_progress (view policy)
DROP POLICY IF EXISTS "Partners can view own progress" ON partner_playbook_progress;
CREATE POLICY "Partners can view own progress"
  ON partner_playbook_progress
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- partner_streak_freezes
DROP POLICY IF EXISTS "Partners can view their own streak freezes" ON partner_streak_freezes;
CREATE POLICY "Partners can view their own streak freezes"
  ON partner_streak_freezes
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = partner_id);

-- providers
DROP POLICY IF EXISTS "providers can view their profile" ON providers;
CREATE POLICY "providers can view their profile"
  ON providers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- story_audit_logs
DROP POLICY IF EXISTS "story_audit_logs_own" ON story_audit_logs;
CREATE POLICY "story_audit_logs_own"
  ON story_audit_logs
  FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));