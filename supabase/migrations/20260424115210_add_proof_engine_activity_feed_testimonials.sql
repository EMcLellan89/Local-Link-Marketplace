/*
  # Proof Engine: Activity Feed & Testimonials System

  ## Overview
  Adds the "Proof Engine" to Local-Link Marketplace — a system for building credibility
  through visible activity, testimonials, and case studies.

  ## New Tables

  ### activity_feed
  - Stores platform activity events (signups, leads, bookings, commissions, etc.)
  - Shown on /results page and optionally on dashboards
  - Only approved/safe events displayed publicly (no PII)

  ### testimonials
  - User-submitted quotes from merchants and partners
  - Admin-approved before public display
  - Linked to user_id for tracking; display uses anonymized name/role

  ### case_studies
  - Structured before/after success stories
  - Admin-reviewed; published when approved
  - Supports merchant, partner, and 1hub/CPA formats

  ## Security
  - RLS enabled on all tables
  - Public can read approved/published records only
  - Authenticated users can insert their own testimonials/case studies
  - Admins (via service role) can approve/reject
*/

-- ============================================================
-- ACTIVITY FEED
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  message text NOT NULL,
  entity_id uuid,
  entity_type text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public activity"
  ON activity_feed FOR SELECT
  USING (is_public = true);

CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(type);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'merchant' CHECK (role IN ('merchant', 'partner', 'customer')),
  display_name text NOT NULL DEFAULT '',
  business_type text DEFAULT '',
  content text NOT NULL,
  result_badge text DEFAULT '',
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Authenticated users can submit testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved) WHERE approved = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_role ON testimonials(role);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);

-- ============================================================
-- CASE STUDIES
-- ============================================================
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  study_type text NOT NULL DEFAULT 'merchant' CHECK (study_type IN ('merchant', 'partner', '1hub', 'cpa')),
  business_type text DEFAULT '',
  location text DEFAULT '',
  plan_used text DEFAULT '',
  before_situation text NOT NULL DEFAULT '',
  tools_used text[] DEFAULT '{}',
  result_leads integer DEFAULT 0,
  result_bookings integer DEFAULT 0,
  result_revenue_cents integer DEFAULT 0,
  result_time_saved text DEFAULT '',
  result_summary text NOT NULL DEFAULT '',
  quote text DEFAULT '',
  approved boolean DEFAULT false,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published case studies"
  ON case_studies FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can submit case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_case_studies_type ON case_studies(study_type);

-- ============================================================
-- PLATFORM STATS (for proof metrics section)
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_proof_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key text UNIQUE NOT NULL,
  stat_value bigint NOT NULL DEFAULT 0,
  display_label text NOT NULL,
  display_suffix text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_proof_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read proof stats"
  ON platform_proof_stats FOR SELECT
  USING (true);

-- Seed initial stat keys
INSERT INTO platform_proof_stats (stat_key, stat_value, display_label, display_suffix) VALUES
  ('businesses_launched', 0, 'Businesses Launched', '+'),
  ('leads_captured', 0, 'Leads Captured', '+'),
  ('bookings_created', 0, 'Bookings Created', '+'),
  ('partner_commissions_paid_cents', 0, 'Partner Commissions Paid', '')
ON CONFLICT (stat_key) DO NOTHING;

-- ============================================================
-- FUNCTION: Get live activity feed (last N events)
-- ============================================================
CREATE OR REPLACE FUNCTION get_public_activity_feed(p_limit int DEFAULT 20)
RETURNS TABLE(
  id uuid,
  type text,
  message text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, type, message, created_at
  FROM activity_feed
  WHERE is_public = true
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- ============================================================
-- SEED: Sample activity events (safe, anonymized)
-- ============================================================
INSERT INTO activity_feed (type, message, entity_type) VALUES
  ('merchant_signup', 'A lawn care business joined the marketplace', 'merchant'),
  ('offer_created', 'A restaurant posted a new weekend special', 'offer'),
  ('lead_received', 'A cleaning service received a new lead', 'merchant'),
  ('partner_signup', 'A new partner joined Local-Link', 'partner'),
  ('commission_earned', 'A partner earned their first commission', 'partner'),
  ('booking_created', 'A salon booked a new appointment', 'merchant'),
  ('offer_created', 'A fitness studio posted a new offer', 'offer'),
  ('lead_received', 'A landscaping business received a lead', 'merchant'),
  ('partner_signup', 'A new partner started their first week', 'partner'),
  ('merchant_signup', 'A food truck joined the marketplace', 'merchant'),
  ('commission_earned', 'A partner earned a recurring commission', 'partner'),
  ('booking_created', 'A pet groomer booked a new customer', 'merchant'),
  ('offer_created', 'A auto shop posted a service special', 'offer'),
  ('lead_received', 'An HVAC company received a new inquiry', 'merchant'),
  ('merchant_signup', 'A home services business went live', 'merchant')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Sample approved testimonials
-- ============================================================
INSERT INTO testimonials (role, display_name, business_type, content, result_badge, approved, featured) VALUES
  ('merchant', 'Maria T.', 'Cleaning Service', 'I finally had one place for my offers, leads, and follow-up. It replaced three tools I was paying for separately.', 'First lead in 3 days', true, true),
  ('merchant', 'James R.', 'Lawn Care', 'My phone started ringing again after I posted my first offer. The setup took less than an hour.', 'Booked 5 customers', true, true),
  ('merchant', 'Priya S.', 'Salon', 'The AI follow-up caught appointments I would have missed. My slow weekdays are filling up.', 'More bookings weekly', true, true),
  ('partner', 'David K.', 'Local Partner', 'I made my first sale in two days. The training and marketing kit made it easy to explain the platform.', 'First sale in 2 days', true, true),
  ('partner', 'Angela M.', 'Local Partner', 'I closed my first merchant this week and already have two more meetings lined up.', 'Recurring income started', true, true),
  ('merchant', 'Carlos B.', 'Auto Shop', 'This replaced my old review tracking tool and the follow-up bot handles responses I used to do manually.', '2+ hrs saved per week', true, false),
  ('partner', 'Rachel L.', 'Local Partner', 'The academy training gave me everything I needed. I felt confident walking into my first pitch.', 'Academy certified', true, false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Sample case studies
-- ============================================================
INSERT INTO case_studies (study_type, business_type, plan_used, before_situation, tools_used, result_summary, quote, approved, published) VALUES
  ('merchant', 'Salon', 'Starter', 'Slow weekdays and missed messages from potential customers. No system for follow-up.', ARRAY['Marketplace Profile', 'Offer', 'AI Follow-up'], 'More inquiries, easier follow-up, and slow weekdays filling up within the first month.', 'I wish I had this two years ago. It just works.', true, true),
  ('merchant', 'Cleaning Service', 'Growth', 'No consistent leads and spending money on ads that didn''t convert.', ARRAY['Marketplace Profile', 'Offer', 'CRM', 'AI Follow-up'], 'Booked 5 customers in the first week using the marketplace and follow-up automation.', 'I stopped paying for ads that didn''t work and started getting real customers.', true, true),
  ('partner', 'Local Partner', 'Standard', 'Looking for a way to earn income helping local businesses grow. Tried other programs before.', ARRAY['Marketing Kit', 'Academy Training', 'Partner Dashboard'], 'Closed first merchant in the first week. Building toward recurring monthly commission.', 'The system does the heavy lifting. I just show people what''s possible.', true, true)
ON CONFLICT DO NOTHING;
