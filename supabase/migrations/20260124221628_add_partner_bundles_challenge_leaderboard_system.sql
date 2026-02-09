/*
  # Partner Bundles, 7-Day Challenge, Leaderboard & Industry Ad Packs

  1. New Tables
    - `partner_challenge_enrollments` - Tracks partner participation in 7-day challenge
    - `partner_challenge_progress` - Daily completion tracking
    - `partner_activity_log` - Activity tracking for leaderboard
    - `partner_streaks` - Consecutive day posting streaks
    - `industry_ad_packs` - Industry-specific ad copy templates
    
  2. DFY Bundle Products
    - Bundle A: Faceless Growth + AI Funnels ($997 setup, $197/mo)
    - Bundle B: Faceless Growth + AI DM ($897 setup, $187/mo)
    - Bundle C: Full Stack ($1,297 setup, $247/mo)
    
  3. Views
    - `partner_leaderboard_view` - Real-time leaderboard with stats
    
  4. Functions
    - `start_partner_challenge()` - Enrolls partner in challenge
    - `complete_challenge_day()` - Marks day complete
    - `log_partner_activity()` - Tracks activity for leaderboard
    - `update_partner_streak()` - Maintains posting streaks
    
  5. Security
    - RLS policies for all new tables
    - Partner-only access to their own data
*/

-- =====================================================
-- ADD METADATA COLUMN TO DFY_PRODUCTS IF NOT EXISTS
-- =====================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dfy_products' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.dfy_products ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- =====================================================
-- BUNDLE PRODUCTS
-- =====================================================

INSERT INTO public.dfy_products
(slug, name, category, short_value_prop, long_description, outcomes, includes, setup_sla_hours, setup_price_cents, monthly_price_cents, is_active, metadata)
VALUES
(
  'bundle-faceless-ai-funnel',
  'Faceless Growth + AI Funnel Bundle',
  'bundles',
  'Consistent faceless content paired with an automated lead funnel',
  'This bundle combines DFY faceless content with a complete AI-powered marketing funnel so attention turns into captured leads automatically. Post consistently without being on camera while your funnel works 24/7.',
  '["Post consistently without camera","Capture leads automatically","Reduce manual follow-up","Professional content system"]'::jsonb,
  '["Faceless Growth Engine™","AI Marketing Funnel (DFY)","30 faceless posts/month","Lead capture system","Automated follow-up"]'::jsonb,
  120,
  99700,
  19700,
  true,
  '{"bundle_items":["faceless-growth-engine","ai-marketing-funnels"],"popular":true,"commission_tier":"bundle_a"}'::jsonb
),
(
  'bundle-faceless-dm',
  'Faceless Growth + AI DM Bundle',
  'bundles',
  'Faceless content plus instant AI DM replies',
  'This bundle pairs faceless content with an AI DM responder that replies instantly and routes conversations toward booking. Never miss a message while maintaining consistent visibility.',
  '["Consistent posting","Instant DM replies","More conversations","Higher engagement"]'::jsonb,
  '["Faceless Growth Engine™","AI DM Auto-Responder","30 faceless posts/month","24/7 DM handling","Smart conversation routing"]'::jsonb,
  120,
  89700,
  18700,
  true,
  '{"bundle_items":["faceless-growth-engine","ai-dm-responder"],"commission_tier":"bundle_b"}'::jsonb
),
(
  'bundle-faceless-full',
  'Faceless Growth Full Stack',
  'bundles',
  'Complete visibility + conversion system',
  'This is the complete DFY stack: faceless content, AI DMs, lead funnels, and automation — all built and managed for you. The ultimate hands-off growth system.',
  '["Hands-off growth system","Higher conversions","All systems connected","Maximum ROI"]'::jsonb,
  '["Faceless Growth Engine™","AI Marketing Funnel","AI DM Auto-Responder","30 faceless posts/month","Lead capture + nurture","24/7 conversation handling"]'::jsonb,
  120,
  129700,
  24700,
  true,
  '{"bundle_items":["faceless-growth-engine","ai-marketing-funnels","ai-dm-responder"],"featured":true,"best_value":true,"commission_tier":"bundle_c"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  setup_price_cents = EXCLUDED.setup_price_cents,
  monthly_price_cents = EXCLUDED.monthly_price_cents,
  metadata = EXCLUDED.metadata,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- PARTNER 7-DAY CHALLENGE SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.partner_challenge_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  challenge_type text NOT NULL DEFAULT '7-day-faceless',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  days_completed int NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.partner_challenge_enrollments(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  day_number int NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  post_content text,
  clicks_generated int DEFAULT 0,
  engagement_count int DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id, day_number)
);

-- =====================================================
-- PARTNER ACTIVITY & LEADERBOARD
-- =====================================================

CREATE TABLE IF NOT EXISTS public.partner_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN (
    'post_created','link_clicked','merchant_signed','sale_made',
    'challenge_day_completed','training_completed','referral_sent'
  )),
  points_earned int NOT NULL DEFAULT 0,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_partner_date 
ON public.partner_activity_log(partner_id, activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_activity_log_type 
ON public.partner_activity_log(activity_type);

CREATE TABLE IF NOT EXISTS public.partner_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL UNIQUE REFERENCES public.partners(id) ON DELETE CASCADE,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_activity_date date,
  total_active_days int NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_streaks_partner 
ON public.partner_streaks(partner_id);

-- =====================================================
-- INDUSTRY-SPECIFIC AD VAULT PACKS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.industry_ad_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_key text NOT NULL,
  product_slug text NOT NULL,
  pack_name text NOT NULL,
  description text,
  ad_variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  hook_variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  caption_templates jsonb NOT NULL DEFAULT '[]'::jsonb,
  dm_scripts jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_industry_packs_industry 
ON public.industry_ad_packs(industry_key);

CREATE INDEX IF NOT EXISTS idx_industry_packs_product 
ON public.industry_ad_packs(product_slug);

-- =====================================================
-- SEED INDUSTRY AD PACKS
-- =====================================================

INSERT INTO public.industry_ad_packs (industry_key, product_slug, pack_name, description, ad_variants, hook_variants, caption_templates, dm_scripts) VALUES

-- CLEANING BUSINESSES
('cleaning', 'bundle-faceless-full', 'Cleaning Business - Faceless Growth Pack', 'Ad copy optimized for cleaning businesses',
'[
  "Cleaning companies lose work when they disappear online. This builds your content for you so you stay visible without being on camera.",
  "You don''t need to be an influencer to run a cleaning business. You need consistent visibility. This handles it for you.",
  "Most cleaning businesses stop posting because it''s a pain. This fixes that with done-for-you faceless content."
]'::jsonb,
'[
  "If your cleaning business only posts when things are slow… this is for you.",
  "Posting every week without showing your face is possible.",
  "No camera. No guessing. Just consistent content."
]'::jsonb,
'[
  "Want consistent content but don''t want to be on camera?\n\nFaceless Growth Engine™ is a done-for-you content system built for cleaning businesses.\n\n✔ 30 faceless posts every month\n✔ Captions + hooks written for you\n✔ Simple funnel behind the content\n\nTap \"Learn More\" to see how it works.",
  "Most cleaning businesses don''t fail at marketing — they just stop posting.\n\nThis installs a faceless content system so you can stay visible without showing your face or guessing what to post."
]'::jsonb,
'[
  "Hey! Quick question — do you currently post consistently for your cleaning business, or does it keep falling off?",
  "I help cleaning companies stay visible online without them needing to be on camera. Want me to send details?"
]'::jsonb),

-- TRADES (PLUMBING, HVAC, ELECTRIC, TREE)
('trades', 'bundle-faceless-full', 'Trades - Faceless Growth Pack', 'Ad copy optimized for trade businesses',
'[
  "Trades don''t lose jobs because of skill — they lose jobs because customers forget about them.",
  "This installs a faceless content system so your business stays top-of-mind without social media becoming another job.",
  "The best contractors aren''t the loudest — they''re the most consistent."
]'::jsonb,
'[
  "If your trade business only posts when things are slow… this is for you.",
  "The best contractors stay visible — not loud.",
  "Focus on the work — not Instagram."
]'::jsonb,
'[
  "Trades don''t need viral videos — they need consistent visibility.\n\nThis builds your content calendar + posts so you can focus on the work, not Instagram.\n\n✔ No camera required\n✔ Posts built for you monthly\n✔ Funnel captures leads\n\nLearn more 👇",
  "Most contractors stop posting because it''s time-consuming.\n\nThis fixes that with a DFY faceless content system."
]'::jsonb,
'[
  "Quick question — do you post consistently for your business, or does it keep getting pushed to later?",
  "I help contractors stay visible online without the camera or chaos. Want to see how?"
]'::jsonb),

-- MED SPA / BEAUTY
('medspa', 'bundle-faceless-full', 'Med Spa & Beauty - Faceless Growth Pack', 'Ad copy optimized for med spas and beauty businesses',
'[
  "Posting consistently matters — but being on camera every day doesn''t.",
  "This gives you faceless content that keeps your brand visible without burnout.",
  "Burnout doesn''t come from clients — it comes from content pressure."
]'::jsonb,
'[
  "Consistent visibility without content burnout.",
  "No filming. No staff time. No burnout.",
  "Stay visible without the camera pressure."
]'::jsonb,
'[
  "Want consistent content but hate being on camera?\n\nFaceless Growth Engine™ keeps your med spa visible without daily filming.\n\n✔ 30 faceless posts/month\n✔ Professional content system\n✔ Zero burnout\n\nTap to learn more 👇",
  "Most beauty businesses stop posting because of pressure.\n\nThis removes the pressure with done-for-you faceless content."
]'::jsonb,
'[
  "Do you post consistently, or does content creation feel like another full-time job?",
  "I help med spas stay visible without daily filming. Want details?"
]'::jsonb),

-- RESTAURANTS / FOOD
('restaurant', 'bundle-faceless-full', 'Restaurant - Faceless Growth Pack', 'Ad copy optimized for restaurants',
'[
  "Restaurants don''t need viral videos — they need consistent visibility.",
  "This builds your content calendar + posts so you can focus on the kitchen, not Instagram.",
  "If posting always gets pushed to \"later\"… this fixes that."
]'::jsonb,
'[
  "Focus on the kitchen — not Instagram.",
  "Posting every week without showing your face is possible.",
  "Consistent visibility without the chaos."
]'::jsonb,
'[
  "Want to stay visible without chasing trends?\n\nFaceless Growth Engine™ builds your monthly content system for you.\n\n✔ 30 faceless posts\n✔ Written + designed\n✔ Lead funnel included\n\nLearn more 👇",
  "Most restaurants stop posting because it''s overwhelming.\n\nThis makes it automatic with DFY faceless content."
]'::jsonb,
'[
  "Quick question — do you post consistently, or does it keep falling off your to-do list?",
  "I help restaurants stay visible online without the daily content grind. Want to see how?"
]'::jsonb)

ON CONFLICT DO NOTHING;

-- =====================================================
-- LEADERBOARD VIEW
-- =====================================================

CREATE OR REPLACE VIEW public.partner_leaderboard_view AS
SELECT
  p.id,
  p.system_id,
  p.company_name,
  p.primary_contact,
  ps.current_streak,
  ps.longest_streak,
  ps.total_active_days,
  COALESCE(SUM(pal.points_earned), 0) as total_points,
  COALESCE(SUM(CASE WHEN pal.created_at >= NOW() - INTERVAL '7 days' THEN pal.points_earned ELSE 0 END), 0) as points_last_7_days,
  COALESCE(SUM(CASE WHEN pal.created_at >= NOW() - INTERVAL '30 days' THEN pal.points_earned ELSE 0 END), 0) as points_last_30_days,
  COUNT(DISTINCT CASE WHEN pal.activity_type = 'merchant_signed' THEN pal.id END) as total_merchants_signed,
  COUNT(DISTINCT CASE WHEN pal.activity_type = 'sale_made' THEN pal.id END) as total_sales,
  pce.status as challenge_status,
  pce.days_completed as challenge_days_completed,
  RANK() OVER (ORDER BY COALESCE(SUM(pal.points_earned), 0) DESC) as overall_rank,
  RANK() OVER (ORDER BY COALESCE(SUM(CASE WHEN pal.created_at >= NOW() - INTERVAL '30 days' THEN pal.points_earned ELSE 0 END), 0) DESC) as monthly_rank
FROM public.partners p
LEFT JOIN public.partner_streaks ps ON ps.partner_id = p.id
LEFT JOIN public.partner_activity_log pal ON pal.partner_id = p.id
LEFT JOIN public.partner_challenge_enrollments pce ON pce.partner_id = p.id AND pce.status = 'active'
WHERE p.status = 'Active'
GROUP BY p.id, p.system_id, p.company_name, p.primary_contact, ps.current_streak, ps.longest_streak, ps.total_active_days, pce.status, pce.days_completed;

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.start_partner_challenge(p_partner_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment_id uuid;
  v_day int;
BEGIN
  -- Check if partner already has active challenge
  SELECT id INTO v_enrollment_id
  FROM partner_challenge_enrollments
  WHERE partner_id = p_partner_id AND status = 'active';

  IF v_enrollment_id IS NOT NULL THEN
    RETURN v_enrollment_id;
  END IF;

  -- Create new enrollment
  INSERT INTO partner_challenge_enrollments (partner_id, challenge_type, status)
  VALUES (p_partner_id, '7-day-faceless', 'active')
  RETURNING id INTO v_enrollment_id;

  -- Create progress records for all 7 days
  FOR v_day IN 1..7 LOOP
    INSERT INTO partner_challenge_progress (enrollment_id, partner_id, day_number)
    VALUES (v_enrollment_id, p_partner_id, v_day);
  END LOOP;

  RETURN v_enrollment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_challenge_day(
  p_enrollment_id uuid,
  p_day_number int,
  p_post_content text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_already_completed boolean;
BEGIN
  -- Get partner_id and check if already completed
  SELECT partner_id, completed INTO v_partner_id, v_already_completed
  FROM partner_challenge_progress
  WHERE enrollment_id = p_enrollment_id AND day_number = p_day_number;

  IF v_already_completed THEN
    RETURN true;
  END IF;

  -- Mark day as completed
  UPDATE partner_challenge_progress
  SET
    completed = true,
    completed_at = now(),
    post_content = p_post_content
  WHERE enrollment_id = p_enrollment_id AND day_number = p_day_number;

  -- Update enrollment days completed count
  UPDATE partner_challenge_enrollments
  SET
    days_completed = days_completed + 1,
    completed_at = CASE WHEN days_completed + 1 >= 7 THEN now() ELSE NULL END,
    status = CASE WHEN days_completed + 1 >= 7 THEN 'completed' ELSE status END,
    updated_at = now()
  WHERE id = p_enrollment_id;

  -- Log activity
  PERFORM log_partner_activity(v_partner_id, 'challenge_day_completed', 10);

  -- Update streak
  PERFORM update_partner_streak(v_partner_id);

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_partner_activity(
  p_partner_id uuid,
  p_activity_type text,
  p_points int DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO partner_activity_log (partner_id, activity_type, points_earned)
  VALUES (p_partner_id, p_activity_type, p_points)
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_partner_streak(p_partner_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_activity_date date;
  v_current_streak int;
  v_longest_streak int;
  v_today date := CURRENT_DATE;
BEGIN
  -- Get or create streak record
  INSERT INTO partner_streaks (partner_id, current_streak, longest_streak, last_activity_date)
  VALUES (p_partner_id, 0, 0, NULL)
  ON CONFLICT (partner_id) DO NOTHING;

  -- Get current streak info
  SELECT current_streak, longest_streak, last_activity_date
  INTO v_current_streak, v_longest_streak, v_last_activity_date
  FROM partner_streaks
  WHERE partner_id = p_partner_id;

  -- Calculate new streak
  IF v_last_activity_date IS NULL THEN
    -- First activity ever
    v_current_streak := 1;
  ELSIF v_last_activity_date = v_today THEN
    -- Already logged today, no change
    RETURN;
  ELSIF v_last_activity_date = v_today - INTERVAL '1 day' THEN
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;

  -- Update longest streak if needed
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  -- Update record
  UPDATE partner_streaks
  SET
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_activity_date = v_today,
    total_active_days = total_active_days + 1,
    updated_at = now()
  WHERE partner_id = p_partner_id;
END;
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.partner_challenge_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_ad_packs ENABLE ROW LEVEL SECURITY;

-- Challenge enrollments
CREATE POLICY "Partners can view own challenge enrollments"
  ON public.partner_challenge_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_challenge_enrollments.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create own challenge enrollments"
  ON public.partner_challenge_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_challenge_enrollments.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Challenge progress
CREATE POLICY "Partners can view own challenge progress"
  ON public.partner_challenge_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_challenge_progress.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own challenge progress"
  ON public.partner_challenge_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_challenge_progress.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Activity log
CREATE POLICY "Partners can view own activity log"
  ON public.partner_activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_activity_log.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Streaks
CREATE POLICY "Partners can view own streaks"
  ON public.partner_streaks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_streaks.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Industry ad packs - all authenticated users can view
CREATE POLICY "Authenticated users can view industry ad packs"
  ON public.industry_ad_packs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can manage all challenge data"
  ON public.partner_challenge_enrollments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all activity logs"
  ON public.partner_activity_log FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenge_enrollments_partner 
ON public.partner_challenge_enrollments(partner_id, status);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_enrollment 
ON public.partner_challenge_progress(enrollment_id, day_number);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_partner 
ON public.partner_challenge_progress(partner_id);
