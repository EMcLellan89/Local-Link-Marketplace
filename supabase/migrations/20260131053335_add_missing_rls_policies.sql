/*
  # Add Missing RLS Policies

  ## Tables Fixed
  Adds secure RLS policies to 5 tables that had RLS enabled but no policies:
  1. dfy_disputes - DFY job dispute management
  2. dfy_job_submissions - Partner job submissions
  3. milestone_badge_audit_log - Badge award audit trail
  4. milestone_badge_rules - Badge earning rules
  5. milestone_system_events - System events for milestone tracking

  ## Security Approach
  - Partners can only access their own data
  - Merchants can access disputes for their jobs
  - Admins have full access
  - System events are read-only for authenticated users
*/

-- =====================================================
-- dfy_disputes: DFY job disputes
-- =====================================================

-- Merchants can view disputes for their jobs
CREATE POLICY "Merchants can view own job disputes"
  ON dfy_disputes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dfy_jobs dj
      JOIN merchants m ON m.id = dj.merchant_id
      WHERE dj.id = dfy_disputes.job_id
      AND m.user_id = auth.uid()
    )
  );

-- Partners can view disputes for jobs they're assigned to
CREATE POLICY "Partners can view assigned job disputes"
  ON dfy_disputes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dfy_jobs dj
      JOIN partners p ON p.id = dj.selected_partner_id
      WHERE dj.id = dfy_disputes.job_id
      AND p.user_id = auth.uid()
    )
  );

-- Merchants can create disputes for their jobs
CREATE POLICY "Merchants can create job disputes"
  ON dfy_disputes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dfy_jobs dj
      JOIN merchants m ON m.id = dj.merchant_id
      WHERE dj.id = dfy_disputes.job_id
      AND m.user_id = auth.uid()
    )
  );

-- Partners can create disputes for their jobs
CREATE POLICY "Partners can create assigned job disputes"
  ON dfy_disputes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dfy_jobs dj
      JOIN partners p ON p.id = dj.selected_partner_id
      WHERE dj.id = dfy_disputes.job_id
      AND p.user_id = auth.uid()
    )
  );

-- Admins can manage all disputes
CREATE POLICY "Admins can manage disputes"
  ON dfy_disputes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =====================================================
-- dfy_job_submissions: Partner work submissions
-- =====================================================

-- Partners can view their own submissions
CREATE POLICY "Partners can view own submissions"
  ON dfy_job_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = dfy_job_submissions.partner_id
      AND p.user_id = auth.uid()
    )
  );

-- Partners can create submissions for their assigned jobs
CREATE POLICY "Partners can create submissions"
  ON dfy_job_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners p
      JOIN dfy_jobs dj ON dj.selected_partner_id = p.id
      WHERE p.id = dfy_job_submissions.partner_id
      AND dj.id = dfy_job_submissions.job_id
      AND p.user_id = auth.uid()
    )
  );

-- Merchants can view submissions for their jobs
CREATE POLICY "Merchants can view job submissions"
  ON dfy_job_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dfy_jobs dj
      JOIN merchants m ON m.id = dj.merchant_id
      WHERE dj.id = dfy_job_submissions.job_id
      AND m.user_id = auth.uid()
    )
  );

-- Admins can manage all submissions
CREATE POLICY "Admins can manage submissions"
  ON dfy_job_submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =====================================================
-- milestone_badge_audit_log: Badge award audit trail
-- =====================================================

-- Partners can view their own badge audit logs
CREATE POLICY "Partners can view own badge audit"
  ON milestone_badge_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = milestone_badge_audit_log.partner_id
      AND p.user_id = auth.uid()
    )
  );

-- Admins can view and insert audit logs
CREATE POLICY "Admins can manage badge audit"
  ON milestone_badge_audit_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =====================================================
-- milestone_badge_rules: Badge earning rules (config)
-- =====================================================

-- Everyone can view active badge rules
CREATE POLICY "All authenticated users can view badge rules"
  ON milestone_badge_rules
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Only admins can manage badge rules
CREATE POLICY "Admins can manage badge rules"
  ON milestone_badge_rules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =====================================================
-- milestone_system_events: System events (read-only)
-- =====================================================

-- Partners can view events where they are the actor
CREATE POLICY "Partners can view own system events"
  ON milestone_system_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = milestone_system_events.actor_id
      AND p.user_id = auth.uid()
    )
  );

-- Admins can view and insert all events
CREATE POLICY "Admins can manage system events"
  ON milestone_system_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );