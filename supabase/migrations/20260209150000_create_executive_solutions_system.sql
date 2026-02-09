/*
  # Executive Solutions System - Core Schema

  1. New Tables
    - exec_products: Product catalog for executive solutions
    - exec_cases: Customer cases/projects
    - exec_case_timeline: Activity log for cases
    - job_tickets: Partner job board
    - payout_requests: Partner payout queue
    - bot_run_telemetry: LLM performance tracking
    - event_outbox: Async event processing queue

  2. Security
    - RLS enabled on all tables
    - Merchants access own cases
    - Partners access jobs + own payouts
    - Admins have full access
*/

-- Executive Products Catalog
CREATE TABLE IF NOT EXISTS exec_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  unit_label text,
  active boolean DEFAULT true,
  job_board_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exec_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON exec_products FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins manage products"
  ON exec_products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Executive Cases
CREATE TABLE IF NOT EXISTS exec_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  exec_product_id uuid REFERENCES exec_products(id),
  status text DEFAULT 'applied',
  created_by uuid REFERENCES auth.users(id),
  intake_json jsonb DEFAULT '{}'::jsonb,
  score_json jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exec_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants view own cases"
  ON exec_cases FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins manage all cases"
  ON exec_cases FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Case Timeline
CREATE TABLE IF NOT EXISTS exec_case_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exec_case_id uuid NOT NULL REFERENCES exec_cases(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id),
  event text NOT NULL,
  detail jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exec_case_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view timeline for accessible cases"
  ON exec_case_timeline FOR SELECT
  TO authenticated
  USING (
    exec_case_id IN (
      SELECT id FROM exec_cases WHERE 
        org_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- Job Tickets (Partner Job Board)
CREATE TABLE IF NOT EXISTS job_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  exec_case_id uuid REFERENCES exec_cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  deliverables text,
  payout_cents integer NOT NULL DEFAULT 0,
  status text DEFAULT 'open',
  claimed_by uuid REFERENCES auth.users(id),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  submission_notes text,
  proof_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners view open and own jobs"
  ON job_tickets FOR SELECT
  TO authenticated
  USING (
    status = 'open'
    OR claimed_by = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Partners claim open jobs"
  ON job_tickets FOR UPDATE
  TO authenticated
  USING (status = 'open' OR claimed_by = (SELECT auth.uid()))
  WITH CHECK (claimed_by = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "Admins manage all jobs"
  ON job_tickets FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Payout Requests
CREATE TABLE IF NOT EXISTS payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_ticket_id uuid NOT NULL REFERENCES job_tickets(id) ON DELETE CASCADE,
  partner_user_id uuid NOT NULL REFERENCES auth.users(id),
  payout_cents integer NOT NULL,
  status text DEFAULT 'requested',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners view own payouts"
  ON payout_requests FOR SELECT
  TO authenticated
  USING (
    partner_user_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Admins manage payouts"
  ON payout_requests FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Bot Run Telemetry
CREATE TABLE IF NOT EXISTS bot_run_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exec_case_id uuid REFERENCES exec_cases(id) ON DELETE SET NULL,
  product_key text,
  ok boolean NOT NULL,
  failure_reason text,
  used_fallback boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 1,
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bot_run_telemetry_time_idx ON bot_run_telemetry(created_at);
CREATE INDEX IF NOT EXISTS bot_run_telemetry_ok_time_idx ON bot_run_telemetry(ok, created_at);

ALTER TABLE bot_run_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read telemetry"
  ON bot_run_telemetry FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Event Outbox
CREATE TABLE IF NOT EXISTS event_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  locked_at timestamptz,
  locked_by text,
  next_run_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_outbox_pick_idx ON event_outbox(status, next_run_at);
CREATE INDEX IF NOT EXISTS event_outbox_locked_idx ON event_outbox(locked_at);

ALTER TABLE event_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read outbox"
  ON event_outbox FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS exec_cases_org_id_idx ON exec_cases(org_id);
CREATE INDEX IF NOT EXISTS exec_cases_status_idx ON exec_cases(status);
CREATE INDEX IF NOT EXISTS exec_case_timeline_case_id_idx ON exec_case_timeline(exec_case_id);
CREATE INDEX IF NOT EXISTS job_tickets_case_id_idx ON job_tickets(exec_case_id);
CREATE INDEX IF NOT EXISTS job_tickets_status_idx ON job_tickets(status);
CREATE INDEX IF NOT EXISTS job_tickets_claimed_by_idx ON job_tickets(claimed_by);
CREATE INDEX IF NOT EXISTS payout_requests_job_id_idx ON payout_requests(job_ticket_id);
CREATE INDEX IF NOT EXISTS payout_requests_partner_idx ON payout_requests(partner_user_id);
