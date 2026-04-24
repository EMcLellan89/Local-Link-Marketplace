/*
  # Internal Sales Team System

  ## Summary
  Creates a complete internal employee (sales rep) system separate from the partner system.
  Employees use company leads and CRM but cannot see admin dashboards, partner data, or
  other employees' records. Admin/managers see everything.

  ## New Tables

  ### internal_sales_users
  - The employee roster. Each row is one sales rep or manager linked to a Supabase auth user.
  - Columns: auth_user_id, full_name, role (sales_rep | sales_manager | support_rep | fulfillment_rep),
    active, specialties (text[]), salary_cents, commission_rate, created_at

  ### internal_lead_assignments
  - Tracks which employee owns which lead, who assigned it, and why.
  - Columns: lead_id, assigned_to (→ internal_sales_users), assigned_by, assignment_reason, status

  ### internal_call_logs
  - One row per call attempt. Records result, notes, and next follow-up.
  - Columns: lead_id, sales_user_id, call_result (no_answer|interested|not_interested|call_back|
    demo_booked|closed_won|closed_lost), notes, next_follow_up_at

  ### internal_sales_records
  - Closed sales tied to an employee. Drives commission/bonus calculations.
  - Columns: sales_user_id, lead_id, customer_id, product_code, sale_amount, bonus_amount, status

  ### internal_audit_logs
  - Immutable log of sensitive employee actions (lead reassigned, sale edited, payout approved, etc.)
  - Columns: actor_id, action, entity_type, entity_id, before_data (jsonb), after_data (jsonb)

  ## Security
  - RLS enabled on all tables
  - Employees see ONLY their own rows (auth.uid() = auth_user_id via subquery)
  - Managers/admin see all rows (role check via internal_sales_users subquery)
  - Audit logs are insert-only for employees; admin can read all

  ## Indexes
  - FK indexes on lead_id, sales_user_id, assigned_to, auth_user_id for join performance
*/

-- ──────────────────────────────────────────────
-- 1. Internal sales users (employee roster)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_sales_users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id      uuid NOT NULL UNIQUE,
  full_name         text NOT NULL DEFAULT '',
  email             text,
  role              text NOT NULL DEFAULT 'sales_rep'
                    CHECK (role IN ('sales_rep','sales_manager','support_rep','fulfillment_rep','admin')),
  active            boolean NOT NULL DEFAULT true,
  specialties       text[] NOT NULL DEFAULT '{}',
  salary_cents      integer NOT NULL DEFAULT 0,
  commission_rate   numeric(5,4) NOT NULL DEFAULT 0.05,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_sales_users ENABLE ROW LEVEL SECURITY;

-- Employees can read/update their own row
CREATE POLICY "Employee can read own record"
  ON internal_sales_users FOR SELECT
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

CREATE POLICY "Employee can update own record"
  ON internal_sales_users FOR UPDATE
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()))
  WITH CHECK (auth_user_id = (SELECT auth.uid()));

-- Managers/admin can read all
CREATE POLICY "Manager can read all employees"
  ON internal_sales_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin')
        AND isu.active = true
    )
  );

-- Managers can insert new employees
CREATE POLICY "Manager can insert employees"
  ON internal_sales_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin')
        AND isu.active = true
    )
  );

-- Managers can update any employee
CREATE POLICY "Manager can update employees"
  ON internal_sales_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin')
        AND isu.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin')
        AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_sales_users_auth_user_id ON internal_sales_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_internal_sales_users_role ON internal_sales_users(role);
CREATE INDEX IF NOT EXISTS idx_internal_sales_users_active ON internal_sales_users(active);

-- ──────────────────────────────────────────────
-- 2. Lead assignments
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_lead_assignments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           uuid NOT NULL,
  assigned_to       uuid NOT NULL REFERENCES internal_sales_users(id) ON DELETE CASCADE,
  assigned_by       uuid REFERENCES internal_sales_users(id),
  assignment_reason text,
  status            text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','reassigned','closed','released')),
  reassigned_at     timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_lead_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employee sees own assignments"
  ON internal_lead_assignments FOR SELECT
  TO authenticated
  USING (
    assigned_to = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Manager sees all assignments"
  ON internal_lead_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE POLICY "Manager can insert assignments"
  ON internal_lead_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE POLICY "Manager can update assignments"
  ON internal_lead_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_lead_assignments_lead_id ON internal_lead_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_internal_lead_assignments_assigned_to ON internal_lead_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_internal_lead_assignments_status ON internal_lead_assignments(status);

-- ──────────────────────────────────────────────
-- 3. Call logs
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_call_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           uuid NOT NULL,
  sales_user_id     uuid NOT NULL REFERENCES internal_sales_users(id) ON DELETE CASCADE,
  call_result       text CHECK (call_result IN (
                      'no_answer','interested','not_interested','call_back',
                      'demo_booked','closed_won','closed_lost','left_voicemail','text_sent'
                    )),
  notes             text,
  next_follow_up_at timestamptz,
  duration_seconds  integer,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employee sees own call logs"
  ON internal_call_logs FOR SELECT
  TO authenticated
  USING (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Employee can insert own call logs"
  ON internal_call_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Manager sees all call logs"
  ON internal_call_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_call_logs_lead_id ON internal_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_internal_call_logs_sales_user_id ON internal_call_logs(sales_user_id);
CREATE INDEX IF NOT EXISTS idx_internal_call_logs_created_at ON internal_call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internal_call_logs_next_follow_up ON internal_call_logs(next_follow_up_at);

-- ──────────────────────────────────────────────
-- 4. Internal sales records (closed deals)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_sales_records (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_user_id  uuid NOT NULL REFERENCES internal_sales_users(id) ON DELETE CASCADE,
  lead_id        uuid,
  customer_id    uuid,
  product_code   text,
  product_name   text,
  sale_amount    numeric(12,2) NOT NULL DEFAULT 0,
  bonus_amount   numeric(12,2) NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','confirmed','paid','reversed','cancelled')),
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_sales_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employee sees own sales records"
  ON internal_sales_records FOR SELECT
  TO authenticated
  USING (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Employee can insert own sales records"
  ON internal_sales_records FOR INSERT
  TO authenticated
  WITH CHECK (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Manager sees all sales records"
  ON internal_sales_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE POLICY "Manager can update sales records"
  ON internal_sales_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_sales_records_sales_user_id ON internal_sales_records(sales_user_id);
CREATE INDEX IF NOT EXISTS idx_internal_sales_records_lead_id ON internal_sales_records(lead_id);
CREATE INDEX IF NOT EXISTS idx_internal_sales_records_created_at ON internal_sales_records(created_at DESC);

-- ──────────────────────────────────────────────
-- 5. Internal audit logs (immutable)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid,
  action      text NOT NULL,
  entity_type text,
  entity_id   uuid,
  before_data jsonb,
  after_data  jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only managers/admin can read audit logs
CREATE POLICY "Manager can read audit logs"
  ON internal_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

-- Any authenticated employee can insert (for logging their own actions)
CREATE POLICY "Employee can insert audit log"
  ON internal_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_internal_audit_logs_actor_id ON internal_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_internal_audit_logs_entity ON internal_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_internal_audit_logs_created_at ON internal_audit_logs(created_at DESC);

-- ──────────────────────────────────────────────
-- 6. Internal tasks (daily work queue items)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_user_id  uuid NOT NULL REFERENCES internal_sales_users(id) ON DELETE CASCADE,
  lead_id        uuid,
  title          text NOT NULL,
  description    text,
  task_type      text DEFAULT 'call'
                 CHECK (task_type IN ('call','text','email','demo','follow_up','admin','other')),
  due_at         timestamptz,
  completed      boolean NOT NULL DEFAULT false,
  completed_at   timestamptz,
  priority       text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employee sees own tasks"
  ON internal_tasks FOR SELECT
  TO authenticated
  USING (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Employee can insert own tasks"
  ON internal_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Employee can update own tasks"
  ON internal_tasks FOR UPDATE
  TO authenticated
  USING (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  )
  WITH CHECK (
    sales_user_id = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Manager sees all tasks"
  ON internal_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_tasks_sales_user_id ON internal_tasks(sales_user_id);
CREATE INDEX IF NOT EXISTS idx_internal_tasks_due_at ON internal_tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_internal_tasks_completed ON internal_tasks(completed);

-- ──────────────────────────────────────────────
-- 7. Fulfillment jobs (DFY work queue)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internal_fulfillment_jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid,
  merchant_id     uuid,
  assigned_to     uuid REFERENCES internal_sales_users(id),
  job_type        text NOT NULL
                  CHECK (job_type IN (
                    'crm_setup','ai_setup','canva_design','ad_creative',
                    'website_build','seo_setup','copywriting','onboarding','other'
                  )),
  title           text NOT NULL,
  description     text,
  priority        text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status          text NOT NULL DEFAULT 'queued'
                  CHECK (status IN ('queued','in_progress','review','completed','cancelled')),
  due_at          timestamptz,
  completed_at    timestamptz,
  notes           text,
  deliverable_url text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internal_fulfillment_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfillment rep sees assigned jobs"
  ON internal_fulfillment_jobs FOR SELECT
  TO authenticated
  USING (
    assigned_to = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Fulfillment rep can update assigned jobs"
  ON internal_fulfillment_jobs FOR UPDATE
  TO authenticated
  USING (
    assigned_to = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  )
  WITH CHECK (
    assigned_to = (
      SELECT id FROM internal_sales_users
      WHERE auth_user_id = (SELECT auth.uid()) LIMIT 1
    )
  );

CREATE POLICY "Manager sees all fulfillment jobs"
  ON internal_fulfillment_jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE POLICY "Manager can insert fulfillment jobs"
  ON internal_fulfillment_jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE POLICY "Manager can update fulfillment jobs"
  ON internal_fulfillment_jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM internal_sales_users isu
      WHERE isu.auth_user_id = (SELECT auth.uid())
        AND isu.role IN ('sales_manager','admin') AND isu.active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_internal_fulfillment_jobs_assigned_to ON internal_fulfillment_jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_internal_fulfillment_jobs_status ON internal_fulfillment_jobs(status);
CREATE INDEX IF NOT EXISTS idx_internal_fulfillment_jobs_merchant_id ON internal_fulfillment_jobs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_internal_fulfillment_jobs_due_at ON internal_fulfillment_jobs(due_at);
