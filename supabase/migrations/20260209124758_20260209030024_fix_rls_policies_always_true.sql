/*
  # Fix RLS Policies Always True

  1. Changes
    - Remove or restrict policies that use WITH CHECK (true) which bypass RLS
    - These policies allowed unrestricted inserts, creating security vulnerabilities
    
  2. Affected Tables and Policies
    - audit_log: Remove duplicate "System can insert audit log" policy
    - audit_log: Restrict "System can insert audit entries" to service role
    - creative_events: Consolidate and restrict insert policies
    - ll_autoscale_bot_runs: Restrict "System can manage bot runs" to service role
    
  3. Security Impact
    - Prevents authenticated users from bypassing RLS checks
    - Ensures only system/service role can perform unrestricted operations
*/

-- audit_log: Remove duplicate policy and restrict the remaining one
DROP POLICY IF EXISTS "System can insert audit log" ON audit_log;
DROP POLICY IF EXISTS "System can insert audit entries" ON audit_log;

-- Only service role should be able to insert audit logs without restrictions
CREATE POLICY "Service role can insert audit entries"
  ON audit_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Authenticated users can only insert their own audit entries
CREATE POLICY "Users can insert own audit entries"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    actor_user_id = (select auth.uid())
    OR merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- creative_events: Remove always-true policies and consolidate
DROP POLICY IF EXISTS "Authenticated users can create events" ON creative_events;
DROP POLICY IF EXISTS "System can track creative events" ON creative_events;

-- Service role can track all events
CREATE POLICY "Service role can track creative events"
  ON creative_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Authenticated users can only create events for their own profile or partner
CREATE POLICY "Users can create own creative events"
  ON creative_events FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = (select auth.uid())
    OR partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- ll_autoscale_bot_runs: Restrict system policy to service role only
DROP POLICY IF EXISTS "System can manage bot runs" ON ll_autoscale_bot_runs;

CREATE POLICY "Service role can manage bot runs"
  ON ll_autoscale_bot_runs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);