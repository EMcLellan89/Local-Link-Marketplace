/*
  # Phase 2: Partner Scoring & CRM Auto-Install System

  1. New Tables
    - `partner_scores`
      - Tracks partner performance metrics
      - Used for auto-assignment of jobs
      - Scores based on certifications, activity, quality, availability
    
    - `crm_install_queue`
      - Queues CRM installations for merchants
      - Triggered when merchant upgrades tier
      - Processed by background workers

  2. Enhancements to Existing Tables
    - Add `auto_assigned` boolean to job_assignments
    - Add `score_at_assignment` to job_assignments for audit trail

  3. Security
    - Partner scores are publicly readable (for transparency)
    - Only system functions can update scores
    - CRM queue visible to admins and relevant merchants

  4. Functions
    - `calculate_partner_score(partner_id)`: Calculates performance score
    - `auto_assign_job(job_id)`: Auto-assigns to best available partner
    - `enqueue_crm_install(merchant_id, tier)`: Queues CRM setup
*/

-- Create partner_scores table
CREATE TABLE IF NOT EXISTS partner_scores (
  partner_id uuid PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  certifications_score int DEFAULT 0 CHECK (certifications_score >= 0 AND certifications_score <= 100),
  activity_score int DEFAULT 0 CHECK (activity_score >= 0 AND activity_score <= 100),
  quality_score int DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  availability_score int DEFAULT 0 CHECK (availability_score >= 0 AND availability_score <= 100),
  total_score int GENERATED ALWAYS AS (
    (certifications_score + activity_score + quality_score + availability_score) / 4
  ) STORED,
  active_job_count int DEFAULT 0,
  max_concurrent_jobs int DEFAULT 3,
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create crm_install_queue table
CREATE TABLE IF NOT EXISTS crm_install_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('starter', 'growth', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'installing', 'completed', 'failed')),
  error_message text,
  install_config jsonb DEFAULT '{}'::jsonb,
  objects_to_install text[] DEFAULT ARRAY[]::text[],
  objects_installed text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Add columns to job_assignments for auto-assignment tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_assignments' AND column_name = 'auto_assigned'
  ) THEN
    ALTER TABLE job_assignments ADD COLUMN auto_assigned boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_assignments' AND column_name = 'score_at_assignment'
  ) THEN
    ALTER TABLE job_assignments ADD COLUMN score_at_assignment int;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partner_scores_total_score ON partner_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_partner_scores_active_job_count ON partner_scores(active_job_count);
CREATE INDEX IF NOT EXISTS idx_partner_scores_last_calculated ON partner_scores(last_calculated_at);

CREATE INDEX IF NOT EXISTS idx_crm_install_queue_merchant_id ON crm_install_queue(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_install_queue_status ON crm_install_queue(status);
CREATE INDEX IF NOT EXISTS idx_crm_install_queue_created_at ON crm_install_queue(created_at);

CREATE INDEX IF NOT EXISTS idx_job_assignments_auto_assigned ON job_assignments(auto_assigned) WHERE auto_assigned = true;

-- Enable RLS
ALTER TABLE partner_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_install_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_scores
CREATE POLICY "Partner scores are publicly readable"
  ON partner_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage partner scores"
  ON partner_scores FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- RLS Policies for crm_install_queue
CREATE POLICY "Merchants can view own CRM install queue"
  ON crm_install_queue FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can manage CRM install queue"
  ON crm_install_queue FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- Function: Calculate partner score
CREATE OR REPLACE FUNCTION calculate_partner_score(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cert_score int;
  v_activity_score int;
  v_quality_score int;
  v_availability_score int;
  v_active_jobs int;
  v_total_score int;
BEGIN
  -- Calculate certifications score (based on completed courses and badges)
  SELECT COALESCE(
    (
      SELECT COUNT(DISTINCT c.course_id)::int * 10
      FROM partner_certifications c
      WHERE c.partner_id = p_partner_id
    ) +
    (
      SELECT COUNT(*)::int * 5
      FROM partner_badges b
      WHERE b.partner_id = p_partner_id
    ),
    0
  ) INTO v_cert_score;

  v_cert_score := LEAST(v_cert_score, 100);

  -- Calculate activity score (based on recent job completions)
  SELECT COALESCE(
    CASE
      WHEN COUNT(*) >= 10 THEN 100
      WHEN COUNT(*) >= 5 THEN 75
      WHEN COUNT(*) >= 2 THEN 50
      WHEN COUNT(*) >= 1 THEN 25
      ELSE 0
    END, 0
  )::int INTO v_activity_score
  FROM job_assignments ja
  WHERE ja.partner_id = p_partner_id
  AND ja.status = 'completed'
  AND ja.created_at > now() - interval '30 days';

  -- Calculate quality score (based on approved deliverables vs rejected)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'approved')::float / NULLIF(COUNT(*)::float, 0) * 100)::int,
    75  -- Default score for new partners
  ) INTO v_quality_score
  FROM job_deliverables
  WHERE partner_id = p_partner_id
  AND status IN ('approved', 'rejected');

  -- Count active jobs
  SELECT COALESCE(COUNT(*), 0)::int INTO v_active_jobs
  FROM job_assignments
  WHERE partner_id = p_partner_id
  AND status IN ('assigned', 'in_progress', 'submitted');

  -- Calculate availability score (decreases with more active jobs)
  v_availability_score := CASE
    WHEN v_active_jobs >= 5 THEN 20
    WHEN v_active_jobs >= 3 THEN 60
    WHEN v_active_jobs >= 2 THEN 80
    ELSE 100
  END;

  -- Calculate total score (average of all components)
  v_total_score := (v_cert_score + v_activity_score + v_quality_score + v_availability_score) / 4;

  -- Upsert partner score
  INSERT INTO partner_scores (
    partner_id,
    certifications_score,
    activity_score,
    quality_score,
    availability_score,
    active_job_count,
    last_calculated_at
  )
  VALUES (
    p_partner_id,
    v_cert_score,
    v_activity_score,
    v_quality_score,
    v_availability_score,
    v_active_jobs,
    now()
  )
  ON CONFLICT (partner_id)
  DO UPDATE SET
    certifications_score = v_cert_score,
    activity_score = v_activity_score,
    quality_score = v_quality_score,
    availability_score = v_availability_score,
    active_job_count = v_active_jobs,
    last_calculated_at = now();

  RETURN jsonb_build_object(
    'partner_id', p_partner_id,
    'certifications_score', v_cert_score,
    'activity_score', v_activity_score,
    'quality_score', v_quality_score,
    'availability_score', v_availability_score,
    'total_score', v_total_score,
    'active_job_count', v_active_jobs
  );
END;
$$;

-- Function: Auto-assign job to highest-scoring available partner
CREATE OR REPLACE FUNCTION auto_assign_job(p_job_id uuid, p_admin_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_best_partner_id uuid;
  v_partner_score int;
  v_assignment_id uuid;
  v_admin_id uuid;
BEGIN
  -- Use provided admin_id or try to get from current user
  v_admin_id := COALESCE(
    p_admin_id,
    (SELECT id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  IF v_admin_id IS NULL THEN
    -- Use a system admin if none provided
    SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  END IF;

  -- Refresh scores for all partners before assignment
  PERFORM calculate_partner_score(id) FROM partners WHERE status = 'active';

  -- Find highest-scoring partner with capacity
  SELECT ps.partner_id, ps.total_score
  INTO v_best_partner_id, v_partner_score
  FROM partner_scores ps
  JOIN partners p ON p.id = ps.partner_id
  WHERE ps.active_job_count < ps.max_concurrent_jobs
  AND p.status = 'active'
  ORDER BY ps.total_score DESC, ps.last_calculated_at ASC
  LIMIT 1;

  IF v_best_partner_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No available partners found with capacity'
    );
  END IF;

  -- Create job assignment
  INSERT INTO job_assignments (
    job_id,
    partner_id,
    assigned_by_admin_id,
    auto_assigned,
    score_at_assignment,
    status
  )
  VALUES (
    p_job_id,
    v_best_partner_id,
    v_admin_id,
    true,
    v_partner_score,
    'assigned'
  )
  RETURNING id INTO v_assignment_id;

  -- Update job status
  UPDATE jobs
  SET
    status = 'assigned',
    updated_at = now()
  WHERE id = p_job_id;

  -- Recalculate partner score
  PERFORM calculate_partner_score(v_best_partner_id);

  RETURN jsonb_build_object(
    'success', true,
    'assignment_id', v_assignment_id,
    'partner_id', v_best_partner_id,
    'partner_score', v_partner_score
  );
END;
$$;

-- Function: Enqueue CRM installation
CREATE OR REPLACE FUNCTION enqueue_crm_install(p_merchant_id uuid, p_tier text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_queue_id uuid;
  v_objects text[];
BEGIN
  -- Validate tier
  IF p_tier NOT IN ('starter', 'growth', 'pro', 'enterprise') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid tier');
  END IF;

  -- Check if already queued
  IF EXISTS (
    SELECT 1 FROM crm_install_queue
    WHERE merchant_id = p_merchant_id
    AND status IN ('pending', 'installing')
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'CRM installation already in progress'
    );
  END IF;

  -- Determine objects to install based on tier
  v_objects := CASE p_tier
    WHEN 'starter' THEN ARRAY['contacts', 'tasks', 'notes']
    WHEN 'growth' THEN ARRAY['contacts', 'tasks', 'notes', 'companies', 'deals']
    WHEN 'pro' THEN ARRAY['contacts', 'tasks', 'notes', 'companies', 'deals', 'activities', 'pipeline']
    WHEN 'enterprise' THEN ARRAY['contacts', 'tasks', 'notes', 'companies', 'deals', 'activities', 'pipeline', 'automation', 'reports']
  END;

  -- Insert queue entry
  INSERT INTO crm_install_queue (
    merchant_id,
    tier,
    objects_to_install
  )
  VALUES (
    p_merchant_id,
    p_tier,
    v_objects
  )
  RETURNING id INTO v_queue_id;

  RETURN jsonb_build_object(
    'success', true,
    'queue_id', v_queue_id,
    'objects_to_install', v_objects
  );
END;
$$;