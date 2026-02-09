/*
  # Unified Partner Job Board System

  1. Purpose
    - Consolidate ALL human-fulfilled service orders into partner job board
    - Auto-create jobs when merchants purchase services requiring human fulfillment
    - Partners see all available work in one place

  2. Tables Modified
    - `dfy_jobs` - extended to handle all service types
    - Add service type mappings

  3. Service Types Requiring Human Fulfillment
    - UGC video requests
    - Website design
    - Landing pages
    - Postcard design
    - Resume writing
    - Social media ad design
    - Appointment setting (human callers)
    - Hiring funnel design
    - Job template creation
    - Business coaching
    - All "hire" services (VA, writer, designer, etc.)
*/

-- Add service_type column to dfy_jobs if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'service_type'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN service_type text;
  END IF;
END $$;

-- Add merchant_order_id to link to merchant_orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'merchant_order_id'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN merchant_order_id uuid REFERENCES merchant_orders(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add stripe_session_id for payment tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN stripe_session_id text;
  END IF;
END $$;

-- Add partner_payout_cents (what partner earns)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'partner_payout_cents'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN partner_payout_cents integer;
  END IF;
END $$;

-- Add description field for job details
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'description'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN description text;
  END IF;
END $$;

-- Add budget field (merchant paid amount)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_jobs' AND column_name = 'budget'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN budget integer;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_dfy_jobs_service_type ON dfy_jobs(service_type);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_merchant_order ON dfy_jobs(merchant_order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_stripe_session ON dfy_jobs(stripe_session_id);

-- Service Product Keys that require human fulfillment
CREATE TABLE IF NOT EXISTS service_fulfillment_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text UNIQUE NOT NULL,
  service_name text NOT NULL,
  service_category text NOT NULL,
  requires_partner boolean NOT NULL DEFAULT true,
  partner_payout_percentage numeric(5,2) NOT NULL DEFAULT 60.00,
  estimated_turnaround_days integer DEFAULT 14,
  job_template text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_fulfillment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service config readable by authenticated"
  ON service_fulfillment_config FOR SELECT
  TO authenticated
  USING (true);

-- Seed fulfillment config for all human-fulfilled services
INSERT INTO service_fulfillment_config (product_key, service_name, service_category, requires_partner, partner_payout_percentage, estimated_turnaround_days, job_template)
VALUES
  ('ugc_video_basic', 'UGC Video - Basic', 'content', true, 60.00, 7, 'Create UGC video content per specifications'),
  ('ugc_video_premium', 'UGC Video - Premium', 'content', true, 60.00, 7, 'Create premium UGC video content'),
  ('ugc_video_bundle', 'UGC Video Bundle', 'content', true, 60.00, 14, 'Create multiple UGC videos'),
  ('website_basic', 'Website Design - Basic', 'design', true, 60.00, 14, 'Design and build basic website'),
  ('website_professional', 'Website Design - Professional', 'design', true, 60.00, 21, 'Design and build professional website'),
  ('website_ecommerce', 'Website Design - E-Commerce', 'design', true, 60.00, 30, 'Design and build e-commerce website'),
  ('landing_page', 'Landing Page Design', 'design', true, 60.00, 7, 'Design high-converting landing page'),
  ('postcard_design', 'Postcard Design', 'design', true, 60.00, 3, 'Design professional postcard'),
  ('social_ad_design', 'Social Media Ad Design', 'design', true, 60.00, 3, 'Design social media advertisements'),
  ('resume_writing', 'Resume Writing', 'hr', true, 60.00, 3, 'Write professional resume'),
  ('hiring_funnel', 'Hiring Funnel Setup', 'hr', true, 60.00, 7, 'Setup complete hiring funnel'),
  ('job_templates', 'Job Template Creation', 'hr', true, 60.00, 2, 'Create job description templates'),
  ('appointment_setting_basic', 'Appointment Setting - Basic', 'sales', true, 60.00, 30, 'Set appointments with prospects (20 hours)'),
  ('appointment_setting_pro', 'Appointment Setting - Pro', 'sales', true, 60.00, 30, 'Set appointments with prospects (40 hours)'),
  ('appointment_setting_enterprise', 'Appointment Setting - Enterprise', 'sales', true, 60.00, 30, 'Set appointments with prospects (80 hours)'),
  ('business_coaching_session', 'Business Coaching Session', 'coaching', true, 70.00, 1, 'Conduct business coaching session'),
  ('business_coaching_package', 'Business Coaching Package', 'coaching', true, 70.00, 30, 'Deliver business coaching package'),
  ('hire_va_20', 'Virtual Assistant (20 hrs)', 'staffing', true, 60.00, 30, 'Provide virtual assistant services (20 hours)'),
  ('hire_va_40', 'Virtual Assistant (40 hrs)', 'staffing', true, 60.00, 30, 'Provide virtual assistant services (40 hours)'),
  ('hire_content_writer', 'Content Writer', 'staffing', true, 60.00, 30, 'Provide content writing services'),
  ('hire_social_media_mgr', 'Social Media Manager', 'staffing', true, 60.00, 30, 'Provide social media management'),
  ('hire_graphic_designer', 'Graphic Designer', 'staffing', true, 60.00, 30, 'Provide graphic design services'),
  ('hire_video_editor', 'Video Editor', 'staffing', true, 60.00, 30, 'Provide video editing services'),
  ('hire_customer_service', 'Customer Service Rep', 'staffing', true, 60.00, 30, 'Provide customer service support'),
  ('hire_bookkeeper', 'Bookkeeper', 'staffing', true, 60.00, 30, 'Provide bookkeeping services'),
  ('hire_data_entry', 'Data Entry Specialist', 'staffing', true, 60.00, 30, 'Provide data entry services'),
  ('hire_lead_gen', 'Lead Generation Specialist', 'staffing', true, 60.00, 30, 'Provide lead generation services'),
  ('hire_sales_closer', 'Sales Closer', 'staffing', true, 60.00, 30, 'Provide sales closing services'),
  ('hire_project_mgr', 'Project Manager', 'staffing', true, 60.00, 30, 'Provide project management services')
ON CONFLICT (product_key) DO UPDATE SET
  service_name = EXCLUDED.service_name,
  service_category = EXCLUDED.service_category,
  requires_partner = EXCLUDED.requires_partner,
  partner_payout_percentage = EXCLUDED.partner_payout_percentage,
  estimated_turnaround_days = EXCLUDED.estimated_turnaround_days,
  job_template = EXCLUDED.job_template;

-- Function to auto-create partner jobs from merchant orders
CREATE OR REPLACE FUNCTION auto_create_partner_job()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_config service_fulfillment_config%ROWTYPE;
  v_partner_payout_cents integer;
  v_job_title text;
BEGIN
  IF NEW.status != 'pending' THEN
    SELECT * INTO v_config
    FROM service_fulfillment_config
    WHERE product_key = NEW.order_type
    LIMIT 1;

    IF FOUND AND v_config.requires_partner THEN
      v_partner_payout_cents := (NEW.amount * v_config.partner_payout_percentage / 100)::integer;
      v_job_title := v_config.service_name || ' - Order #' || substring(NEW.id::text, 1, 8);

      INSERT INTO dfy_jobs (
        service_id,
        service_type,
        merchant_id,
        merchant_order_id,
        status,
        title,
        requirements,
        description,
        merchant_budget_cents,
        budget,
        partner_payout_cents,
        due_date,
        created_at
      )
      VALUES (
        NULL,
        NEW.order_type,
        NEW.merchant_id,
        NEW.id,
        'open',
        v_job_title,
        COALESCE(v_config.job_template, 'Complete service as specified in order details'),
        COALESCE((NEW.details->>'description')::text, v_config.job_template),
        NEW.amount::integer,
        NEW.amount::integer,
        v_partner_payout_cents,
        now() + (v_config.estimated_turnaround_days || ' days')::interval,
        now()
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_create_partner_job ON merchant_orders;
CREATE TRIGGER trigger_auto_create_partner_job
  AFTER INSERT OR UPDATE OF status ON merchant_orders
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_partner_job();

DROP POLICY IF EXISTS "Partners can view open and assigned jobs" ON dfy_jobs;
CREATE POLICY "Partners can view open and assigned jobs"
  ON dfy_jobs FOR SELECT
  TO authenticated
  USING (
    status IN ('open', 'assigned', 'in_progress', 'submitted')
    OR selected_partner_id = auth.uid()
  );

DROP POLICY IF EXISTS "Partners can update their assigned jobs" ON dfy_jobs;
CREATE POLICY "Partners can update their assigned jobs"
  ON dfy_jobs FOR UPDATE
  TO authenticated
  USING (selected_partner_id = auth.uid())
  WITH CHECK (selected_partner_id = auth.uid());

CREATE OR REPLACE FUNCTION claim_partner_job(job_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_result jsonb;
  v_partner_id uuid;
BEGIN
  v_partner_id := auth.uid();

  UPDATE dfy_jobs
  SET
    selected_partner_id = v_partner_id,
    status = 'assigned',
    updated_at = now()
  WHERE id = job_id
    AND status = 'open'
    AND selected_partner_id IS NULL;

  IF FOUND THEN
    v_result := jsonb_build_object('success', true, 'message', 'Job claimed successfully');
  ELSE
    v_result := jsonb_build_object('success', false, 'message', 'Job is no longer available');
  END IF;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION submit_partner_job(
  job_id uuid,
  submission_url text,
  submission_notes text DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_result jsonb;
  v_partner_id uuid;
BEGIN
  v_partner_id := auth.uid();

  UPDATE dfy_jobs
  SET status = 'submitted', updated_at = now()
  WHERE id = job_id
    AND selected_partner_id = v_partner_id
    AND status IN ('assigned', 'in_progress');

  IF FOUND THEN
    INSERT INTO dfy_job_submissions (job_id, partner_id, submission_url, notes)
    VALUES (job_id, v_partner_id, submission_url, submission_notes);

    v_result := jsonb_build_object('success', true, 'message', 'Work submitted successfully');
  ELSE
    v_result := jsonb_build_object('success', false, 'message', 'Could not submit work. Check job status.');
  END IF;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE VIEW partner_job_board AS
SELECT
  j.id,
  j.service_type,
  j.title,
  j.description,
  j.requirements,
  j.status,
  j.budget,
  j.partner_payout_cents,
  j.due_date,
  j.created_at,
  j.merchant_id,
  j.selected_partner_id,
  m.business_name as merchant_business_name,
  c.service_name,
  c.service_category,
  c.estimated_turnaround_days
FROM dfy_jobs j
LEFT JOIN merchants m ON j.merchant_id = m.id
LEFT JOIN service_fulfillment_config c ON j.service_type = c.product_key
WHERE j.status IN ('open', 'assigned', 'in_progress', 'submitted')
ORDER BY j.created_at DESC;

GRANT SELECT ON partner_job_board TO authenticated;
