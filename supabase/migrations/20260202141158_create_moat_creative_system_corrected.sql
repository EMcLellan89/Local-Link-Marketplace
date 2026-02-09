/*
  # Moat Creative System - Weekly Winners Feed

  1. New Tables
    - `ad_creatives` - Approved creative assets
    - `creative_events` - Performance tracking
    - `creative_tests` - A/B testing
    - `partner_ad_budgets` - Partner daily budgets
    - `weekly_creative_winners` - Weekly leaderboard (THE KILLER FEATURE)

  2. Security
    - RLS enabled on all tables
    - Public can view approved creatives + weekly winners
    - Partners can track their own events
    - Admins have full access
*/

-- Ad Creatives
CREATE TABLE IF NOT EXISTS ad_creatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_key text NOT NULL DEFAULT 'storylab_kids',
  vertical_key text NOT NULL DEFAULT 'kids',
  creative_key text NOT NULL,
  format text NOT NULL DEFAULT 'image',
  headline text DEFAULT '',
  primary_text text DEFAULT '',
  cta text DEFAULT 'Learn More',
  asset_path text,
  landing_path text NOT NULL DEFAULT '/storylab/kids/checkout',
  is_approved boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  tags jsonb DEFAULT '[]'::jsonb,
  lifetime_impressions bigint DEFAULT 0,
  lifetime_clicks bigint DEFAULT 0,
  lifetime_purchases bigint DEFAULT 0,
  lifetime_revenue_cents bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_key, vertical_key, creative_key)
);

CREATE INDEX IF NOT EXISTS idx_ad_creatives_business_vertical ON ad_creatives(business_key, vertical_key);
CREATE INDEX IF NOT EXISTS idx_ad_creatives_approved ON ad_creatives(is_approved, is_active) WHERE is_approved = true AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_ad_creatives_performance ON ad_creatives(lifetime_purchases DESC);

-- Creative Events
CREATE TABLE IF NOT EXISTS creative_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_key text NOT NULL,
  vertical_key text NOT NULL,
  creative_id uuid REFERENCES ad_creatives(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  ref_code text,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  revenue_cents bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creative_events_creative ON creative_events(creative_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creative_events_business ON creative_events(business_key, vertical_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creative_events_partner ON creative_events(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_creative_events_created ON creative_events(created_at DESC);

-- Creative Tests
CREATE TABLE IF NOT EXISTS creative_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  business_key text NOT NULL DEFAULT 'storylab_kids',
  vertical_key text NOT NULL DEFAULT 'kids',
  status text NOT NULL DEFAULT 'running',
  creatives uuid[] NOT NULL,
  winner_creative_id uuid REFERENCES ad_creatives(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creative_tests_partner ON creative_tests(partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creative_tests_status ON creative_tests(status) WHERE status = 'running';

-- Partner Ad Budgets
CREATE TABLE IF NOT EXISTS partner_ad_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  business_key text NOT NULL DEFAULT 'storylab_kids',
  daily_cents bigint NOT NULL DEFAULT 2000,
  status text NOT NULL DEFAULT 'active',
  spent_today_cents bigint DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, business_key),
  CONSTRAINT min_daily_budget CHECK (daily_cents >= 2000)
);

CREATE INDEX IF NOT EXISTS idx_partner_ad_budgets_partner ON partner_ad_budgets(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ad_budgets_status ON partner_ad_budgets(status) WHERE status = 'active';

-- Weekly Creative Winners (THE KILLER FEATURE)
CREATE TABLE IF NOT EXISTS weekly_creative_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_key text NOT NULL,
  vertical_key text NOT NULL,
  week_start_date date NOT NULL,
  creative_id uuid REFERENCES ad_creatives(id) ON DELETE CASCADE,
  creative_key text NOT NULL,
  headline text,
  primary_text text,
  cta text,
  landing_path text,
  impressions bigint DEFAULT 0,
  clicks bigint DEFAULT 0,
  purchases bigint DEFAULT 0,
  revenue_cents bigint DEFAULT 0,
  ctr numeric(10,4) DEFAULT 0,
  cvr numeric(10,4) DEFAULT 0,
  recommended_budget_daily_cents bigint,
  targeting_notes text,
  rank int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_key, vertical_key, week_start_date, rank)
);

CREATE INDEX IF NOT EXISTS idx_weekly_winners_business ON weekly_creative_winners(business_key, vertical_key, week_start_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_winners_rank ON weekly_creative_winners(rank) WHERE rank <= 10;

-- Enable RLS
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_ad_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_creative_winners ENABLE ROW LEVEL SECURITY;

-- RLS: ad_creatives
CREATE POLICY "Public view approved" ON ad_creatives FOR SELECT USING (is_approved = true AND is_active = true);
CREATE POLICY "Admins full access" ON ad_creatives FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS: creative_events
CREATE POLICY "Anyone create events" ON creative_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all" ON creative_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Partners view own" ON creative_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM partners WHERE id = partner_id AND user_id = auth.uid()));

-- RLS: creative_tests
CREATE POLICY "Partners manage own" ON creative_tests FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM partners WHERE id = partner_id AND user_id = auth.uid()));
CREATE POLICY "Admins view tests" ON creative_tests FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS: partner_ad_budgets
CREATE POLICY "Partners view budget" ON partner_ad_budgets FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM partners WHERE id = partner_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage budgets" ON partner_ad_budgets FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS: weekly_creative_winners (PUBLIC - this is the feed!)
CREATE POLICY "Public view winners" ON weekly_creative_winners FOR SELECT USING (true);
CREATE POLICY "Admins manage winners" ON weekly_creative_winners FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Calculate weekly winners function
CREATE OR REPLACE FUNCTION calculate_weekly_winners(
  p_business_key text DEFAULT 'storylab_kids',
  p_vertical_key text DEFAULT 'kids',
  p_week_start_date date DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start date;
  v_week_end date;
BEGIN
  v_week_start := COALESCE(p_week_start_date, date_trunc('week', CURRENT_DATE)::date);
  v_week_end := v_week_start + interval '7 days';

  DELETE FROM weekly_creative_winners
  WHERE business_key = p_business_key AND vertical_key = p_vertical_key AND week_start_date = v_week_start;

  INSERT INTO weekly_creative_winners (
    business_key, vertical_key, week_start_date, creative_id, creative_key,
    headline, primary_text, cta, landing_path,
    impressions, clicks, purchases, revenue_cents, ctr, cvr,
    recommended_budget_daily_cents, targeting_notes, rank
  )
  SELECT
    p_business_key, p_vertical_key, v_week_start,
    c.id, c.creative_key, c.headline, c.primary_text, c.cta, c.landing_path,
    COALESCE(s.imp, 0), COALESCE(s.clk, 0), COALESCE(s.pur, 0), COALESCE(s.rev, 0),
    CASE WHEN COALESCE(s.imp, 0) > 0 THEN COALESCE(s.clk, 0)::numeric / s.imp ELSE 0 END,
    CASE WHEN COALESCE(s.clk, 0) > 0 THEN COALESCE(s.pur, 0)::numeric / s.clk ELSE 0 END,
    CASE WHEN COALESCE(s.pur, 0) >= 10 THEN 7500 WHEN COALESCE(s.pur, 0) >= 5 THEN 5000 WHEN COALESCE(s.pur, 0) >= 2 THEN 4000 ELSE 2000 END,
    CASE WHEN COALESCE(s.pur, 0) >= 10 THEN 'Hot! Scale immediately. Test broad + lookalike.' WHEN COALESCE(s.pur, 0) >= 5 THEN 'Strong. Increase budget gradually.' WHEN COALESCE(s.pur, 0) >= 2 THEN 'Promising. Keep testing.' ELSE 'New/low volume. Needs more data.' END,
    ROW_NUMBER() OVER (ORDER BY COALESCE(s.pur, 0) DESC, COALESCE(s.rev, 0) DESC)::int
  FROM ad_creatives c
  LEFT JOIN (
    SELECT creative_id,
      COUNT(*) FILTER (WHERE event_type = 'impression') as imp,
      COUNT(*) FILTER (WHERE event_type = 'click') as clk,
      COUNT(*) FILTER (WHERE event_type = 'purchase') as pur,
      SUM(revenue_cents) FILTER (WHERE event_type = 'purchase') as rev
    FROM creative_events
    WHERE business_key = p_business_key AND vertical_key = p_vertical_key
      AND created_at >= v_week_start AND created_at < v_week_end AND creative_id IS NOT NULL
    GROUP BY creative_id
  ) s ON c.id = s.creative_id
  WHERE c.business_key = p_business_key AND c.vertical_key = p_vertical_key
    AND c.is_approved = true AND c.is_active = true AND COALESCE(s.imp, 0) >= 100
  LIMIT 10;
END;
$$;