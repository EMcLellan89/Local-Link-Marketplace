/*
  # Add AI Bots, Reviews, Social/UGC, SEO, and Community Sponsorships

  ## New Features Added

  1. **AI Bot Products** - One-time setup fees
     - Messenger Bot: $149
     - Website Bot: $299
     - SMS Bot: $499
     - VoIP AI Assistant: $799
     - Full Suite: $1,097

  2. **AI Runtime Maintenance** - Monthly recurring add-ons
     - Basic AI Runtime: $49/mo
     - Pro AI Runtime: $99/mo
     - Enterprise AI Runtime: $149/mo

  3. **Reviews Automation** - $29/mo addon

  4. **Social/UGC Packages** - Monthly content creation
     - 4 posts/mo: $99
     - 8 posts/mo: $179
     - 12 posts/mo: $249

  5. **Local SEO Booster** - $99/mo addon

  6. **Community Sponsorships** - High-value recurring
     - Town Sponsor: $500-$1,000/mo
     - School/Team: $250-$500/mo

  ## Security
  All tables have RLS enabled with proper merchant access policies
*/

-- ============================================================
-- AI BOT PRODUCTS TABLE (One-time purchases)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_bot_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  bot_type text NOT NULL,
  setup_price_cents integer NOT NULL,
  features text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_bot_type CHECK (bot_type IN ('messenger', 'website', 'sms', 'voip', 'full_suite'))
);

ALTER TABLE ai_bot_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active AI bot products"
  ON ai_bot_products FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================
-- SOCIAL/UGC PACKAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS social_ugc_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  posts_per_month integer NOT NULL,
  monthly_price_cents integer NOT NULL,
  features text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_ugc_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active social packages"
  ON social_ugc_packages FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================
-- SOCIAL/UGC SUBSCRIPTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS social_ugc_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES social_ugc_packages(id),
  status text NOT NULL DEFAULT 'active',
  posts_remaining integer NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  next_billing_date date,
  canceled_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_social_status CHECK (status IN ('active', 'past_due', 'canceled', 'expired'))
);

ALTER TABLE social_ugc_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own social subscriptions"
  ON social_ugc_subscriptions FOR SELECT
  TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_status ON social_ugc_subscriptions(status);

-- ============================================================
-- COMMUNITY SPONSORSHIPS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS community_sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  sponsorship_type text NOT NULL,
  organization_name text NOT NULL,
  organization_type text NOT NULL,
  monthly_amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  location_details jsonb DEFAULT '{}'::jsonb,
  benefits text[] DEFAULT ARRAY[]::text[],
  started_at timestamptz DEFAULT now(),
  next_billing_date date,
  ended_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_sponsorship_type CHECK (sponsorship_type IN ('town', 'school', 'team', 'other')),
  CONSTRAINT valid_org_type CHECK (organization_type IN ('municipality', 'school', 'sports_team', 'community_group', 'other')),
  CONSTRAINT valid_sponsorship_status CHECK (status IN ('active', 'past_due', 'ended'))
);

ALTER TABLE community_sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own sponsorships"
  ON community_sponsorships FOR SELECT
  TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can create own sponsorships"
  ON community_sponsorships FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can update own sponsorships"
  ON community_sponsorships FOR UPDATE
  TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id ON community_sponsorships(merchant_id);
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_status ON community_sponsorships(status);
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_type ON community_sponsorships(sponsorship_type);

-- ============================================================
-- SEED DATA: AI BOT PRODUCTS
-- ============================================================

INSERT INTO ai_bot_products (name, slug, description, bot_type, setup_price_cents, features, sort_order)
VALUES
  (
    'Messenger Bot',
    'messenger_bot',
    'AI-powered Facebook Messenger bot for customer engagement',
    'messenger',
    14900,
    ARRAY[
      'Automated responses',
      'Lead capture',
      'FAQ handling',
      '24/7 availability',
      'Integration with CRM'
    ],
    1
  ),
  (
    'Website Chat Bot',
    'website_bot',
    'Intelligent website chatbot for visitor engagement',
    'website',
    29900,
    ARRAY[
      'Live chat widget',
      'Appointment booking',
      'Product recommendations',
      'Lead qualification',
      'Custom branding'
    ],
    2
  ),
  (
    'SMS Bot',
    'sms_bot',
    'Two-way SMS automation for customer communication',
    'sms',
    49900,
    ARRAY[
      'Automated SMS responses',
      'Appointment reminders',
      'Follow-up sequences',
      'Customer support',
      'Bulk messaging'
    ],
    3
  ),
  (
    'VoIP AI Assistant',
    'voip_assistant',
    'AI phone receptionist that never misses a call',
    'voip',
    79900,
    ARRAY[
      'Inbound call handling',
      'Call routing',
      'Appointment scheduling',
      'Natural voice conversations',
      'Call transcription'
    ],
    4
  ),
  (
    'Full AI Suite',
    'full_suite',
    'Complete AI automation across all channels',
    'full_suite',
    109700,
    ARRAY[
      'All bot types included',
      'Unified inbox',
      'Cross-channel campaigns',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ],
    5
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: AI RUNTIME MAINTENANCE ADD-ONS
-- ============================================================

INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, sort_order)
VALUES
  (
    'Basic AI Runtime',
    'ai_runtime_basic',
    'Essential AI bot hosting and basic usage - Includes updates, basic SMS/voice logic, and prompt tuning',
    4900,
    47040,
    'ai_runtime_basic',
    'automation',
    10
  ),
  (
    'Pro AI Runtime',
    'ai_runtime_pro',
    'Professional AI bot hosting with enhanced capabilities - Includes higher usage limits, advanced prompt tuning, and priority updates',
    9900,
    95040,
    'ai_runtime_pro',
    'automation',
    11
  ),
  (
    'Enterprise AI Runtime',
    'ai_runtime_enterprise',
    'Enterprise-grade AI hosting with unlimited usage - Includes dedicated resources, custom integrations, and white-glove support',
    14900,
    143040,
    'ai_runtime_enterprise',
    'automation',
    12
  ),
  (
    'Reviews on Autopilot',
    'reviews_automation',
    'Automated review request system with SMS and email campaigns - Includes review monitoring, response templates, and reputation dashboard',
    2900,
    27840,
    'reviews_automation',
    'automation',
    13
  ),
  (
    'Local SEO Booster',
    'local_seo_lite',
    'Automated local SEO optimization - Includes citation building, GMB optimization, and local keyword tracking',
    9900,
    95040,
    'local_seo_lite',
    'analytics',
    14
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: SOCIAL/UGC PACKAGES
-- ============================================================

INSERT INTO social_ugc_packages (name, slug, description, posts_per_month, monthly_price_cents, features, sort_order)
VALUES
  (
    'Social Starter',
    'social_starter',
    'Professional social media content delivered monthly',
    4,
    9900,
    ARRAY[
      '4 custom posts per month',
      'Platform scheduling',
      'Content calendar',
      'Basic analytics',
      'UGC creator network'
    ],
    1
  ),
  (
    'Social Growth',
    'social_growth',
    'Comprehensive social media management for growing businesses',
    8,
    17900,
    ARRAY[
      '8 custom posts per month',
      'Platform scheduling',
      'Content calendar',
      'Advanced analytics',
      'Hashtag research',
      'Engagement monitoring'
    ],
    2
  ),
  (
    'Social Pro',
    'social_pro',
    'Full-scale social media presence with maximum content',
    12,
    24900,
    ARRAY[
      '12 custom posts per month',
      'Multi-platform scheduling',
      'Content strategy',
      'Detailed analytics',
      'Community management',
      'Influencer coordination',
      'Paid ad suggestions'
    ],
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RLS POLICIES FOR UPDATED TABLES
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'ai_bot_setups'
    AND policyname = 'Merchants can view own bot setups'
  ) THEN
    ALTER TABLE ai_bot_setups ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Merchants can view own bot setups"
      ON ai_bot_setups FOR SELECT
      TO authenticated
      USING (merchant_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

    CREATE POLICY "Merchants can create own bot setups"
      ON ai_bot_setups FOR INSERT
      TO authenticated
      WITH CHECK (merchant_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

    CREATE POLICY "Merchants can update own bot setups"
      ON ai_bot_setups FOR UPDATE
      TO authenticated
      USING (merchant_id IN (SELECT id FROM profiles WHERE id = auth.uid()))
      WITH CHECK (merchant_id IN (SELECT id FROM profiles WHERE id = auth.uid()));
  END IF;
END $$;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ai_bot_products_bot_type ON ai_bot_products(bot_type);
CREATE INDEX IF NOT EXISTS idx_ai_bot_products_active ON ai_bot_products(is_active);
CREATE INDEX IF NOT EXISTS idx_social_ugc_packages_active ON social_ugc_packages(is_active);
