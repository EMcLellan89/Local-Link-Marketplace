/*
  # Add Missing Partner Control and Admin Tables

  Creates the tables that don't already exist:
  1. partner_compliance — agreement status and violation tracking per partner
  2. partner_certifications_v2 — new cert track (quiz-based, typed) alongside existing table
  3. partner_leads — lead pipeline / mini CRM
  4. product_access_rules — admin-controlled product unlock matrix
  5. partner_ads — organic content submissions for admin review
  6. partner_quality_scores — risk score tracking
  7. attribution_disputes — admin attribution fix tool
  8. partner_tax_reports — year-end 1099-ready summaries
  9. commission_rule_engine — master per-product commission config (separate from existing commission_rules)

  Note: commission_rules, payout_batches, audit_logs, partner_certifications already exist
  with different schemas — we add new tables alongside them without touching existing ones.
*/

-- 1. Partner Compliance
CREATE TABLE IF NOT EXISTS partner_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  agreed_to_terms boolean DEFAULT false,
  agreed_at timestamptz,
  violations int DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active','warned','restricted','suspended','banned')),
  last_violation_at timestamptz,
  violation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id)
);

ALTER TABLE partner_compliance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_compliance_select"
  ON partner_compliance FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_compliance_insert"
  ON partner_compliance FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_compliance_update"
  ON partner_compliance FOR UPDATE TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_compliance_partner_id ON partner_compliance(partner_id);

-- 2. Partner Certification Tracks (quiz-based, new table alongside existing)
CREATE TABLE IF NOT EXISTS partner_cert_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  track text NOT NULL CHECK (track IN (
    'merchant_sales','visibility_products','ai_tools',
    '1hub_crm','1hub_cpa','organic_sharing','job_board'
  )),
  status text DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','passed','failed','expired')),
  passed boolean DEFAULT false,
  score int,
  attempts int DEFAULT 0,
  last_attempt_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, track)
);

ALTER TABLE partner_cert_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_cert_tracks_select"
  ON partner_cert_tracks FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_cert_tracks_insert"
  ON partner_cert_tracks FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_cert_tracks_update"
  ON partner_cert_tracks FOR UPDATE TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_cert_tracks_partner_id ON partner_cert_tracks(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_cert_tracks_track ON partner_cert_tracks(track);

-- 3. Partner Leads (mini CRM pipeline)
CREATE TABLE IF NOT EXISTS partner_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  business_name text,
  source text DEFAULT 'manual',
  status text DEFAULT 'new' CHECK (status IN (
    'new','contacted','demo_booked','proposal_sent','closed_won','closed_lost'
  )),
  product_interest text,
  estimated_value_cents int DEFAULT 0,
  notes text,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_leads_select"
  ON partner_leads FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_leads_insert"
  ON partner_leads FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_leads_update"
  ON partner_leads FOR UPDATE TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_leads_delete"
  ON partner_leads FOR DELETE TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_id ON partner_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_leads_status ON partner_leads(status);

-- 4. Product Access Rules
CREATE TABLE IF NOT EXISTS product_access_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text NOT NULL UNIQUE,
  product_name text NOT NULL,
  required_tier text DEFAULT 'starter' CHECK (required_tier IN ('starter','growth','pro','enterprise')),
  required_certifications text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_access_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_access_rules_select"
  ON product_access_rules FOR SELECT TO authenticated
  USING (true);

INSERT INTO product_access_rules (product_code, product_name, required_tier, required_certifications) VALUES
  ('merchant_plans', 'Merchant Subscription Plans', 'starter', ARRAY['merchant_sales']),
  ('visibility_products', 'Visibility Products', 'starter', ARRAY['visibility_products']),
  ('ai_tools', 'AI Tools', 'growth', ARRAY['ai_tools']),
  ('1hub_crm', '1Hub Business CRM', 'pro', ARRAY['merchant_sales', '1hub_crm']),
  ('1hub_cpa', '1Hub CPA Firm Plans', 'pro', ARRAY['1hub_cpa']),
  ('organic_sharing', 'Organic Content Sharing', 'starter', ARRAY['organic_sharing']),
  ('job_board', 'Job Board Fulfillment', 'starter', ARRAY['job_board'])
ON CONFLICT (product_code) DO NOTHING;

-- 5. Partner Organic Content Submissions (no paid ads allowed by partners)
CREATE TABLE IF NOT EXISTS partner_content_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('social_post','email_template','direct_message','other')),
  content text NOT NULL,
  media_url text,
  platform text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','archived')),
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_content_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_content_select"
  ON partner_content_submissions FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "partner_content_insert"
  ON partner_content_submissions FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_content_partner_id ON partner_content_submissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_content_status ON partner_content_submissions(status);

-- 6. Partner Quality Scores
CREATE TABLE IF NOT EXISTS partner_quality_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE UNIQUE,
  score int DEFAULT 100,
  refunds int DEFAULT 0,
  chargebacks int DEFAULT 0,
  violations int DEFAULT 0,
  low_quality_leads int DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_quality_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_quality_scores_select"
  ON partner_quality_scores FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_quality_scores_partner_id ON partner_quality_scores(partner_id);

-- 7. Attribution Disputes
CREATE TABLE IF NOT EXISTS attribution_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid,
  transaction_type text DEFAULT 'commission',
  original_partner_id uuid REFERENCES partners(id),
  requested_partner_id uuid REFERENCES partners(id),
  reason text NOT NULL,
  evidence text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','under_review','resolved_original','resolved_reassigned','dismissed')),
  resolved_by uuid,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE attribution_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attribution_disputes_select"
  ON attribution_disputes FOR SELECT TO authenticated
  USING (
    original_partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    OR requested_partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "attribution_disputes_insert"
  ON attribution_disputes FOR INSERT TO authenticated
  WITH CHECK (
    requested_partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
  );

CREATE INDEX IF NOT EXISTS idx_attribution_disputes_status ON attribution_disputes(status);
CREATE INDEX IF NOT EXISTS idx_attribution_disputes_original ON attribution_disputes(original_partner_id);
CREATE INDEX IF NOT EXISTS idx_attribution_disputes_requested ON attribution_disputes(requested_partner_id);

-- 8. Partner Tax Reports
CREATE TABLE IF NOT EXISTS partner_tax_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  tax_year int NOT NULL,
  total_earned_cents bigint DEFAULT 0,
  total_paid_cents bigint DEFAULT 0,
  total_withheld_cents bigint DEFAULT 0,
  report_url text,
  form_1099_url text,
  generated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, tax_year)
);

ALTER TABLE partner_tax_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_tax_reports_select"
  ON partner_tax_reports FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS idx_partner_tax_reports_partner_id ON partner_tax_reports(partner_id);

-- 9. Commission Rule Engine (new, separate from existing commission_rules which has different schema)
CREATE TABLE IF NOT EXISTS commission_rule_engine (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text NOT NULL UNIQUE,
  product_name text NOT NULL,
  commission_type text NOT NULL CHECK (commission_type IN (
    'percentage','flat','recurring_percentage','first_month_only'
  )),
  rate numeric(6,4) NOT NULL DEFAULT 0.10,
  recurring boolean DEFAULT false,
  first_month_only boolean DEFAULT false,
  override_allowed boolean DEFAULT true,
  override_rate numeric(6,4) DEFAULT 0.07,
  refund_hold_days int DEFAULT 30,
  active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE commission_rule_engine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commission_rule_engine_select"
  ON commission_rule_engine FOR SELECT TO authenticated
  USING (true);

INSERT INTO commission_rule_engine (product_code, product_name, commission_type, rate, recurring, first_month_only, override_allowed, override_rate, refund_hold_days, notes) VALUES
  ('merchant_starter', 'Merchant Starter Plan', 'first_month_only', 0.10, false, true, true, 0.07, 30, 'Tier rate applies: 10-25% based on partner tier'),
  ('merchant_growth', 'Merchant Growth Plan', 'first_month_only', 0.10, false, true, true, 0.07, 30, 'Tier rate applies'),
  ('merchant_pro', 'Merchant Pro Plan', 'first_month_only', 0.10, false, true, true, 0.07, 30, 'Tier rate applies'),
  ('merchant_enterprise', 'Merchant Enterprise Plan', 'first_month_only', 0.10, false, true, true, 0.07, 30, 'Tier rate applies'),
  ('1hub_crm_any', '1Hub Business CRM', 'recurring_percentage', 0.30, true, false, true, 0.07, 30, '30% recurring regardless of tier'),
  ('1hub_cpa_any', '1Hub CPA Firm Plans', 'recurring_percentage', 0.30, true, false, true, 0.07, 30, '30% recurring regardless of tier'),
  ('dfy_services', 'Done-For-You Services', 'percentage', 0.10, false, false, true, 0.07, 30, 'Tier rate applies'),
  ('ai_tools', 'AI Tools', 'percentage', 0.10, false, false, true, 0.07, 30, 'Tier rate applies'),
  ('visibility_products', 'Visibility Products', 'percentage', 0.10, false, false, true, 0.07, 30, 'Tier rate applies'),
  ('job_board', 'Job Board Services', 'percentage', 0.10, false, false, false, 0.00, 30, 'No override on job board'),
  ('partner_recruit', 'Partner Recruitment (subscription)', 'first_month_only', 0.10, false, true, false, 0.00, 30, 'First month of recruits subscription')
ON CONFLICT (product_code) DO NOTHING;

-- Add refund/hold columns to partner_commissions if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_commissions') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_commissions' AND column_name = 'refund_flag') THEN
      ALTER TABLE partner_commissions ADD COLUMN refund_flag boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_commissions' AND column_name = 'chargeback_flag') THEN
      ALTER TABLE partner_commissions ADD COLUMN chargeback_flag boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_commissions' AND column_name = 'hold_until') THEN
      ALTER TABLE partner_commissions ADD COLUMN hold_until timestamptz;
    END IF;
  END IF;
END $$;
