/*
  # Circuit Breaker System

  1. Changes
    - Add circuit breaker config to platform_config
    - Add helper function for admin check
    - Add auto-complete case trigger

  2. Security
    - Admin-only access to platform_config
    - Breaker config readable by authenticated users
*/

-- Ensure platform_config table exists
CREATE TABLE IF NOT EXISTS platform_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read config
CREATE POLICY "platform_config_read_authenticated"
  ON platform_config FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can write
CREATE POLICY "platform_config_write_admin"
  ON platform_config FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Initialize circuit breaker config
INSERT INTO platform_config(key, value)
VALUES (
  'llm_circuit_breaker',
  '{
    "enabled": true,
    "state": "closed",
    "fail_window_minutes": 15,
    "max_failures_in_window": 6,
    "cooldown_minutes": 20,
    "last_opened_at": null,
    "manual_override": null
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Helper: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Helper: Auto-complete exec case when all jobs paid
CREATE OR REPLACE FUNCTION maybe_complete_exec_case(p_exec_case_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_jobs integer;
  paid_jobs integer;
BEGIN
  SELECT count(*) INTO total_jobs
  FROM job_tickets
  WHERE exec_case_id = p_exec_case_id;

  IF total_jobs = 0 THEN
    RETURN;
  END IF;

  SELECT count(*) INTO paid_jobs
  FROM job_tickets
  WHERE exec_case_id = p_exec_case_id
    AND status = 'paid';

  IF paid_jobs = total_jobs THEN
    UPDATE exec_cases
    SET status = 'completed',
        updated_at = now()
    WHERE id = p_exec_case_id
      AND status <> 'completed';

    INSERT INTO exec_case_timeline(exec_case_id, actor_user_id, event, detail)
    VALUES (p_exec_case_id, null, 'Completed', jsonb_build_object('total_jobs', total_jobs));
  END IF;
END $$;

-- Trigger: Auto-complete case when job paid
CREATE OR REPLACE FUNCTION on_job_paid_complete_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM maybe_complete_exec_case(NEW.exec_case_id);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_job_paid_complete_case ON job_tickets;
CREATE TRIGGER trg_job_paid_complete_case
AFTER UPDATE OF status ON job_tickets
FOR EACH ROW EXECUTE FUNCTION on_job_paid_complete_case();
