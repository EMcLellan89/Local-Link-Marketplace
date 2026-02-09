/*
  # Fix Auth RLS Performance - Remaining Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - All remaining tables with auth RLS issues
*/

-- jobs
DROP POLICY IF EXISTS "jobs: admin full access" ON jobs;
DROP POLICY IF EXISTS "jobs: merchant read own" ON jobs;
DROP POLICY IF EXISTS "jobs: partner read assigned if assigned" ON jobs;
DROP POLICY IF EXISTS "jobs: partner read open only" ON jobs;

CREATE POLICY "jobs: admin full access" ON jobs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "jobs: merchant read own" ON jobs
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "jobs: partner read assigned if assigned" ON jobs
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT job_id FROM job_assignments
      WHERE partner_id IN (
        SELECT id FROM partners 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "jobs: partner read open only" ON jobs
  FOR SELECT TO authenticated
  USING (
    status = 'open'
    AND EXISTS (
      SELECT 1 FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- job_assignments
DROP POLICY IF EXISTS "job_assignments: admin full access" ON job_assignments;
DROP POLICY IF EXISTS "job_assignments: partner read own" ON job_assignments;
DROP POLICY IF EXISTS "job_assignments: partner update own status" ON job_assignments;

CREATE POLICY "job_assignments: admin full access" ON job_assignments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_assignments: partner read own" ON job_assignments
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "job_assignments: partner update own status" ON job_assignments
  FOR UPDATE TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- job_applications
DROP POLICY IF EXISTS "job_applications: admin read all" ON job_applications;
DROP POLICY IF EXISTS "job_applications: admin update" ON job_applications;
DROP POLICY IF EXISTS "job_applications: partner insert own" ON job_applications;
DROP POLICY IF EXISTS "job_applications: partner read own" ON job_applications;

CREATE POLICY "job_applications: admin read all" ON job_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_applications: admin update" ON job_applications
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_applications: partner insert own" ON job_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "job_applications: partner read own" ON job_applications
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- job_deliverables
DROP POLICY IF EXISTS "job_deliverables: admin read all" ON job_deliverables;
DROP POLICY IF EXISTS "job_deliverables: admin update" ON job_deliverables;
DROP POLICY IF EXISTS "job_deliverables: partner insert own" ON job_deliverables;
DROP POLICY IF EXISTS "job_deliverables: partner read own" ON job_deliverables;

CREATE POLICY "job_deliverables: admin read all" ON job_deliverables
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_deliverables: admin update" ON job_deliverables
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_deliverables: partner insert own" ON job_deliverables
  FOR INSERT TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "job_deliverables: partner read own" ON job_deliverables
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- job_payouts
DROP POLICY IF EXISTS "job_payouts: admin full access" ON job_payouts;
DROP POLICY IF EXISTS "job_payouts: partner read own" ON job_payouts;

CREATE POLICY "job_payouts: admin full access" ON job_payouts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "job_payouts: partner read own" ON job_payouts
  FOR SELECT TO authenticated
  USING (
    sourcing_partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
    OR worker_partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );
