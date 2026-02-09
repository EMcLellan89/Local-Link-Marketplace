/*
  # Add DFY Job Board & White-Label System
  
  1. DFY Services catalog
  2. Partner service qualifications & samples
  3. Job board and fulfillment tracking
  4. Dispute resolution
  5. White-label organization settings
  6. Hybrid selling (in-house + white-label) attribution
*/

-- DFY Services Catalog
CREATE TABLE IF NOT EXISTS dfy_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('content', 'operations', 'visibility', 'automation', 'strategic')),
  merchant_price_cents integer NOT NULL,
  billing_type text NOT NULL CHECK (billing_type IN ('one_time', 'monthly', 'usage')),
  requires_sample boolean NOT NULL DEFAULT true,
  requires_certification boolean NOT NULL DEFAULT false,
  estimated_turnaround_days integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dfy_services_active ON dfy_services(is_active);
CREATE INDEX IF NOT EXISTS idx_dfy_services_category ON dfy_services(category);

-- Partner Service Qualifications
CREATE TABLE IF NOT EXISTS partner_service_qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  service_id uuid NOT NULL REFERENCES dfy_services(id) ON DELETE CASCADE,
  sample_url text NOT NULL,
  sample_description text,
  proof_text text,
  portfolio_url text,
  approved boolean NOT NULL DEFAULT false,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(partner_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_quals_partner ON partner_service_qualifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_quals_service ON partner_service_qualifications(service_id);
CREATE INDEX IF NOT EXISTS idx_partner_quals_approved ON partner_service_qualifications(approved) WHERE approved = true;

-- DFY Jobs
CREATE TABLE IF NOT EXISTS dfy_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES dfy_services(id),
  merchant_id uuid,
  selected_partner_id uuid,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'submitted', 'completed', 'disputed', 'canceled')),
  title text NOT NULL,
  requirements text NOT NULL,
  merchant_budget_cents integer,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dfy_jobs_service ON dfy_jobs(service_id);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_merchant ON dfy_jobs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_partner ON dfy_jobs(selected_partner_id);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_status ON dfy_jobs(status);

-- Job Submissions
CREATE TABLE IF NOT EXISTS dfy_job_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES dfy_jobs(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL,
  submission_url text NOT NULL,
  notes text,
  revision_number integer NOT NULL DEFAULT 1,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dfy_submissions_job ON dfy_job_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_dfy_submissions_partner ON dfy_job_submissions(partner_id);

-- Disputes
CREATE TABLE IF NOT EXISTS dfy_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES dfy_jobs(id) ON DELETE CASCADE,
  opened_by text NOT NULL CHECK (opened_by IN ('merchant', 'partner', 'admin')),
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'refunded', 'denied')),
  resolution_notes text,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_dfy_disputes_job ON dfy_disputes(job_id);
CREATE INDEX IF NOT EXISTS idx_dfy_disputes_status ON dfy_disputes(status);

-- White-Label Settings
CREATE TABLE IF NOT EXISTS white_label_settings (
  org_id uuid PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  brand_name text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#3b82f6',
  accent_color text DEFAULT '#10b981',
  custom_domain text,
  custom_email_from text,
  allow_partner_network boolean NOT NULL DEFAULT false,
  commission_split_percent integer CHECK (commission_split_percent >= 0 AND commission_split_percent <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_white_label_enabled ON white_label_settings(enabled) WHERE enabled = true;

-- Sales Channel Attribution (Hybrid Selling)
DO $$
BEGIN
  -- Add sales channel tracking to orders if not exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS sales_channel text DEFAULT 'direct' CHECK (sales_channel IN ('direct', 'in_house', 'white_label', 'partner_referral')),
    ADD COLUMN IF NOT EXISTS attributed_org_id uuid,
    ADD COLUMN IF NOT EXISTS sales_rep_id uuid;
    
    CREATE INDEX IF NOT EXISTS idx_orders_sales_channel ON orders(sales_channel);
    CREATE INDEX IF NOT EXISTS idx_orders_org_attribution ON orders(attributed_org_id);
  END IF;
END $$;

-- RLS Policies
ALTER TABLE dfy_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_service_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_job_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active DFY services
DROP POLICY IF EXISTS dfy_services_view_active ON dfy_services;
CREATE POLICY dfy_services_view_active ON dfy_services
  FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Partners can view/manage their qualifications
DROP POLICY IF EXISTS partner_quals_own ON partner_service_qualifications;
CREATE POLICY partner_quals_own ON partner_service_qualifications
  FOR ALL
  USING (
    partner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Merchants see their own jobs, partners see jobs they're assigned to or can bid on
DROP POLICY IF EXISTS dfy_jobs_merchant_partner ON dfy_jobs;
CREATE POLICY dfy_jobs_merchant_partner ON dfy_jobs
  FOR SELECT
  USING (
    merchant_id = auth.uid()
    OR selected_partner_id = auth.uid()
    OR (status = 'open' AND EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'partner'
    ))
    OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin full access to all tables
DROP POLICY IF EXISTS admin_dfy_all ON dfy_services;
CREATE POLICY admin_dfy_all ON dfy_services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS admin_dfy_jobs_all ON dfy_jobs;
CREATE POLICY admin_dfy_jobs_all ON dfy_jobs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS admin_white_label_all ON white_label_settings;
CREATE POLICY admin_white_label_all ON white_label_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE dfy_services IS 'Catalog of Done-For-You services available through partner marketplace';
COMMENT ON TABLE partner_service_qualifications IS 'Partner samples and qualifications for each DFY service';
COMMENT ON TABLE dfy_jobs IS 'Job board for DFY service fulfillment';
COMMENT ON TABLE dfy_disputes IS 'Dispute resolution for DFY jobs';
COMMENT ON TABLE white_label_settings IS 'White-label configuration for hybrid in-house + partner selling model';
