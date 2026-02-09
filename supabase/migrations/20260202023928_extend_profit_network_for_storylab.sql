/*
  # Extend Profit Network for StoryLab

  1. Extend profit_network_businesses
    - Add business_key (unique identifier)
    - Add ad funding parameters
    - Add weekly repayment settings
    
  2. Create partner_ad_advances tracking
    - Track ad spend advanced during startup period
    - Track repayment progress
    - Weekly repayment status
    
  3. Seed StoryLab Businesses
    - storylab_kids
    - storylab_teen
    - storylab_adult
*/

-- ============ EXTEND PROFIT NETWORK BUSINESSES ============
DO $$
BEGIN
  -- Add business_key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_businesses' AND column_name = 'business_key'
  ) THEN
    ALTER TABLE public.profit_network_businesses 
    ADD COLUMN business_key text UNIQUE NULL;
  END IF;

  -- Add ad funding fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_businesses' AND column_name = 'ad_start_daily_cents'
  ) THEN
    ALTER TABLE public.profit_network_businesses 
    ADD COLUMN ad_start_daily_cents int NOT NULL DEFAULT 2000;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_businesses' AND column_name = 'ad_start_weeks'
  ) THEN
    ALTER TABLE public.profit_network_businesses 
    ADD COLUMN ad_start_weeks int NOT NULL DEFAULT 8;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_businesses' AND column_name = 'min_ad_daily_cents'
  ) THEN
    ALTER TABLE public.profit_network_businesses 
    ADD COLUMN min_ad_daily_cents int NOT NULL DEFAULT 2000;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_businesses' AND column_name = 'weekly_repayment_cents'
  ) THEN
    ALTER TABLE public.profit_network_businesses 
    ADD COLUMN weekly_repayment_cents int NOT NULL DEFAULT 5000;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS profit_network_businesses_business_key_idx 
  ON public.profit_network_businesses(business_key);

-- ============ PARTNER AD ADVANCES TRACKING ============
CREATE TABLE IF NOT EXISTS public.partner_ad_advances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  business_key text NOT NULL,
  enrollment_id uuid NULL,
  total_advanced_cents int NOT NULL DEFAULT 0,
  amount_repaid_cents int NOT NULL DEFAULT 0,
  weekly_repayment_cents int NOT NULL DEFAULT 5000,
  status text NOT NULL DEFAULT 'advancing' CHECK (status IN ('advancing','repayment','paid')),
  started_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, business_key)
);

CREATE INDEX IF NOT EXISTS partner_ad_advances_partner_idx ON public.partner_ad_advances(partner_id);
CREATE INDEX IF NOT EXISTS partner_ad_advances_business_idx ON public.partner_ad_advances(business_key);
CREATE INDEX IF NOT EXISTS partner_ad_advances_enrollment_idx ON public.partner_ad_advances(enrollment_id);

DROP TRIGGER IF EXISTS trg_partner_ad_advances_updated_at ON public.partner_ad_advances;
CREATE TRIGGER trg_partner_ad_advances_updated_at 
  BEFORE UPDATE ON public.partner_ad_advances 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.partner_ad_advances ENABLE ROW LEVEL SECURITY;

-- Partners can view their own ad advances
DROP POLICY IF EXISTS partner_ad_advances_own ON public.partner_ad_advances;
CREATE POLICY partner_ad_advances_own ON public.partner_ad_advances
  FOR SELECT
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE id = auth.uid()
    )
  );

-- ============ SEED STORYLAB BUSINESSES ============
INSERT INTO public.profit_network_businesses (
  business_key,
  name,
  description,
  website_url,
  logo_url,
  category,
  base_commission_rate,
  bonus_commission_rate,
  bonus_active,
  is_active,
  approval_required,
  ad_start_daily_cents,
  ad_start_weeks,
  min_ad_daily_cents,
  weekly_repayment_cents
) VALUES
(
  'storylab_kids',
  'StoryLab Kids',
  'AI-powered children''s storybook creation platform. Parents create personalized bedtime stories with custom characters and safe, age-appropriate content.',
  'https://storylab.ai/kids',
  '/images/storylab-kids-logo.png',
  'Digital Products',
  0.25,
  0.00,
  false,
  true,
  true,
  2000, -- $20/day
  8,    -- 8 weeks
  2000, -- $20/day minimum
  5000  -- $50/week repayment
),
(
  'storylab_teen',
  'StoryLab Teen',
  'Creative writing platform for teens. Generate YA novels, fanfiction, and creative writing projects with AI assistance and age-appropriate content filters.',
  'https://storylab.ai/teen',
  '/images/storylab-teen-logo.png',
  'Digital Products',
  0.25,
  0.00,
  false,
  true,
  true,
  2000,
  8,
  2000,
  5000
),
(
  'storylab_adult',
  'StoryLab Adult',
  'Professional-grade AI book creation for authors, marketers, and entrepreneurs. Create novels, lead magnets, course materials, and business content.',
  'https://storylab.ai/adult',
  '/images/storylab-adult-logo.png',
  'Digital Products',
  0.25,
  0.00,
  false,
  true,
  true,
  2000,
  8,
  2000,
  5000
)
ON CONFLICT (business_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url,
  category = EXCLUDED.category,
  base_commission_rate = EXCLUDED.base_commission_rate,
  ad_start_daily_cents = EXCLUDED.ad_start_daily_cents,
  ad_start_weeks = EXCLUDED.ad_start_weeks,
  min_ad_daily_cents = EXCLUDED.min_ad_daily_cents,
  weekly_repayment_cents = EXCLUDED.weekly_repayment_cents;

-- Comments
COMMENT ON TABLE public.partner_ad_advances IS 
'Tracks ad spend advanced to partners during startup period (weeks 1-8) and repayment progress (week 9+). 
Repayment deductions are $50/week until fully repaid.';

COMMENT ON COLUMN public.profit_network_businesses.business_key IS 
'Unique identifier for business used in routing and tracking (e.g., storylab_kids, storylab_teen, storylab_adult)';

COMMENT ON COLUMN public.profit_network_businesses.ad_start_daily_cents IS 
'Daily ad spend covered by Local-Link during startup period (default $20/day = 2000 cents)';

COMMENT ON COLUMN public.profit_network_businesses.ad_start_weeks IS 
'Number of weeks Local-Link covers ad costs (default 8 weeks = $1,120 total)';

COMMENT ON COLUMN public.profit_network_businesses.weekly_repayment_cents IS 
'Weekly repayment amount deducted from commissions starting week 9 (default $50/week = 5000 cents)';
