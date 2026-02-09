/*
  # Fix Always-True RLS Policies (Corrected)

  1. Purpose
    - Replace policies with USING (true) with proper access controls
    - Ensure data security by implementing appropriate restrictions
  
  2. Tables Affected
    - audit_log (uses actor_user_id and merchant_id)
    - creative_events (uses partner_id and profile_id)
    - ll_autoscale_bot_runs (uses client_id)
  
  3. Security Impact
    - CRITICAL: Removes overly permissive policies
    - Implements proper access controls
*/

-- Fix audit_log policies (actor or merchant can view)
DROP POLICY IF EXISTS "Anyone can view audit logs" ON audit_log;
DROP POLICY IF EXISTS "Public read audit logs" ON audit_log;
DROP POLICY IF EXISTS "Audit logs are readable" ON audit_log;
CREATE POLICY "Users can view relevant audit logs"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    ((select auth.uid()) = actor_user_id) OR
    (merchant_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM merchants m 
      WHERE m.id = audit_log.merchant_id AND m.user_id = (select auth.uid())
    )) OR
    EXISTS (
      SELECT 1 FROM admin_users au WHERE au.id = (select auth.uid())
    )
  );

-- Fix creative_events policies (partner ownership or profile ownership)
DROP POLICY IF EXISTS "Anyone can view creative events" ON creative_events;
DROP POLICY IF EXISTS "Public read creative events" ON creative_events;
DROP POLICY IF EXISTS "Creative events are readable" ON creative_events;
CREATE POLICY "Users can view relevant creative events"
  ON creative_events FOR SELECT
  TO authenticated
  USING (
    (partner_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = creative_events.partner_id AND p.user_id = (select auth.uid())
    )) OR
    (profile_id IS NOT NULL AND (select auth.uid()) = profile_id)
  );

-- Fix ll_autoscale_bot_runs policies (client ownership)
DROP POLICY IF EXISTS "Anyone can view bot runs" ON ll_autoscale_bot_runs;
DROP POLICY IF EXISTS "Public read bot runs" ON ll_autoscale_bot_runs;
DROP POLICY IF EXISTS "Bot runs are readable" ON ll_autoscale_bot_runs;
CREATE POLICY "Clients can view own bot runs"
  ON ll_autoscale_bot_runs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = ll_autoscale_bot_runs.client_id AND m.user_id = (select auth.uid())
    )
  );
