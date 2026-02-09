/*
  # Add Job Board System
  
  Complete job board system for Partner/Admin/Merchant workflows:
  
  1. **Jobs Table**
     - Admin-created jobs from merchant "Have Local-Link do it" requests
     - Service product key links to marketplace products
     - Status tracking: open, assigned, in_progress, submitted, approved, cancelled
  
  2. **Job Assignments Table**
     - Links jobs to assigned partners
     - Admin assigns specific partner to complete job
  
  3. **Job Applications Table**
     - Partners apply to open jobs
     - Admin reviews applications before assigning
  
  4. **Job Deliverables Table**
     - Partners submit completed work
     - Links to files/URLs with completion notes
  
  5. **Job Payouts Table**
     - Tracks commission calculations after job approval
     - Worker commission, sourcing partner commission, upline bonus, platform profit
  
  Security:
  - Admin-only write access to jobs
  - Partners can apply and submit deliverables for assigned jobs
  - Merchants can view their own job requests
*/

-- Jobs table (merchant requests for "Have Local-Link do it")
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_admin_id uuid REFERENCES profiles(id) NOT NULL,
  merchant_id uuid REFERENCES merchants(id) NOT NULL,
  service_product_key text NOT NULL,
  title text NOT NULL,
  description text,
  budget numeric(10,2),
  due_at timestamptz,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'submitted', 'approved', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job assignments (admin assigns partner to job)
CREATE TABLE IF NOT EXISTS job_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES partners(id) NOT NULL,
  assigned_by_admin_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, partner_id)
);

-- Job applications (partners apply to open jobs)
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES partners(id) NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, partner_id)
);

-- Job deliverables (partners submit completed work)
CREATE TABLE IF NOT EXISTS job_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES partners(id) NOT NULL,
  file_url text NOT NULL,
  note text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_by_admin_id uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Job payouts (commission calculations after approval)
CREATE TABLE IF NOT EXISTS job_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  merchant_id uuid REFERENCES merchants(id) NOT NULL,
  sourcing_partner_id uuid REFERENCES partners(id),
  worker_partner_id uuid REFERENCES partners(id),
  gross_amount numeric(10,2) NOT NULL,
  worker_commission_rate numeric(5,4),
  worker_amount numeric(10,2) DEFAULT 0,
  sourcing_amount numeric(10,2) DEFAULT 0,
  upline_amount numeric(10,2) DEFAULT 0,
  platform_amount numeric(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_merchant_id ON jobs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_assignments_job_id ON job_assignments(job_id);
CREATE INDEX IF NOT EXISTS idx_job_assignments_partner_id ON job_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id ON job_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_job_id ON job_deliverables(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_job_id ON job_payouts(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_sourcing_partner_id ON job_payouts(sourcing_partner_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_worker_partner_id ON job_payouts(worker_partner_id);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
-- Admin: full access
CREATE POLICY "jobs: admin full access"
  ON jobs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Partners: read open jobs
CREATE POLICY "jobs: partner read open only"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.id = auth.uid() AND partners.status = 'Active')
    AND jobs.status = 'open'
  );

-- Partners: read assigned jobs (only if assigned to them)
CREATE POLICY "jobs: partner read assigned if assigned"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.id = auth.uid() AND partners.status = 'Active')
    AND jobs.status IN ('assigned', 'in_progress', 'submitted')
    AND EXISTS (
      SELECT 1 FROM job_assignments
      WHERE job_assignments.job_id = jobs.id
        AND job_assignments.partner_id = auth.uid()
    )
  );

-- Merchants: read their own jobs
CREATE POLICY "jobs: merchant read own"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = jobs.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- RLS Policies for job_assignments
-- Admin: full access
CREATE POLICY "job_assignments: admin full access"
  ON job_assignments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Partners: read their own assignments
CREATE POLICY "job_assignments: partner read own"
  ON job_assignments FOR SELECT
  TO authenticated
  USING (job_assignments.partner_id = auth.uid());

-- Partners: update their own assignment status
CREATE POLICY "job_assignments: partner update own status"
  ON job_assignments FOR UPDATE
  TO authenticated
  USING (job_assignments.partner_id = auth.uid())
  WITH CHECK (job_assignments.partner_id = auth.uid());

-- RLS Policies for job_applications
-- Admin: read all
CREATE POLICY "job_applications: admin read all"
  ON job_applications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Partners: insert own applications
CREATE POLICY "job_applications: partner insert own"
  ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id = auth.uid()
    AND EXISTS (SELECT 1 FROM partners WHERE partners.id = auth.uid() AND partners.status = 'Active')
  );

-- Partners: read own applications
CREATE POLICY "job_applications: partner read own"
  ON job_applications FOR SELECT
  TO authenticated
  USING (job_applications.partner_id = auth.uid());

-- Admin: update application status
CREATE POLICY "job_applications: admin update"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for job_deliverables
-- Admin: read all
CREATE POLICY "job_deliverables: admin read all"
  ON job_deliverables FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Partners: insert own deliverables for assigned jobs
CREATE POLICY "job_deliverables: partner insert own"
  ON job_deliverables FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM job_assignments
      WHERE job_assignments.job_id = job_deliverables.job_id
        AND job_assignments.partner_id = auth.uid()
    )
  );

-- Partners: read own deliverables
CREATE POLICY "job_deliverables: partner read own"
  ON job_deliverables FOR SELECT
  TO authenticated
  USING (job_deliverables.partner_id = auth.uid());

-- Admin: update deliverable status
CREATE POLICY "job_deliverables: admin update"
  ON job_deliverables FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for job_payouts
-- Admin: full access
CREATE POLICY "job_payouts: admin full access"
  ON job_payouts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Partners: read payouts where they are worker or sourcing partner
CREATE POLICY "job_payouts: partner read own"
  ON job_payouts FOR SELECT
  TO authenticated
  USING (
    job_payouts.worker_partner_id = auth.uid()
    OR job_payouts.sourcing_partner_id = auth.uid()
  );
