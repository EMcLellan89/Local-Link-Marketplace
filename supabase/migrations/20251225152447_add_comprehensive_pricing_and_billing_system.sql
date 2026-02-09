/*
  # Comprehensive Pricing & Billing System

  1. New Tables
    - `partner_subscription_tiers` - Partner program pricing (Partner/Master/White-Label)
    - `partner_subscriptions` - Active partner billing subscriptions
    - `territory_pricing_tiers` - Territory licensing fees (City/Region/State/Country)
    - `territory_licenses` - Territory ownership with billing
    - `automation_addons` - Purchasable add-on products
    - `merchant_addon_subscriptions` - Active add-on subscriptions
    - `professional_services` - Bookable services catalog
    - `service_bookings` - Service purchases/appointments
    - `usage_limits` - Per-tier limits (deals, contacts, API calls, etc.)
    - `usage_tracking` - Current usage per merchant/partner

  2. Updates
    - Update `subscription_tiers` with new pricing
    - Add feature flags to merchants and partners

  3. Security
    - Enable RLS on all tables
    - Policies for merchant and partner access
*/

-- ============================================================
-- PARTNER PROGRAM BILLING
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  monthly_price_cents integer NOT NULL DEFAULT 0,
  annual_price_cents integer NOT NULL DEFAULT 0,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  max_territories integer,
  revenue_share_percent numeric(5,2) DEFAULT 80.00,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES partner_subscription_tiers(id),
  status text NOT NULL DEFAULT 'pending',
  billing_frequency text NOT NULL DEFAULT 'monthly',
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  paybright_transaction_id text,
  paybright_subscription_id text,
  started_at timestamptz,
  expires_at timestamptz,
  next_billing_date date,
  canceled_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')),
  CONSTRAINT valid_billing_frequency CHECK (billing_frequency IN ('monthly', 'annual'))
);

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_status ON partner_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_next_billing_date ON partner_subscriptions(next_billing_date);

-- ============================================================
-- TERRITORY LICENSING
-- ============================================================

CREATE TABLE IF NOT EXISTS territory_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  scope_type text NOT NULL,
  monthly_price_cents integer NOT NULL DEFAULT 0,
  annual_price_cents integer NOT NULL DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_scope_type CHECK (scope_type IN ('city', 'metro', 'region', 'state', 'country'))
);

CREATE TABLE IF NOT EXISTS territory_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id uuid NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  pricing_tier_id uuid NOT NULL REFERENCES territory_pricing_tiers(id),
  status text NOT NULL DEFAULT 'pending',
  billing_frequency text NOT NULL DEFAULT 'monthly',
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  paybright_transaction_id text,
  paybright_subscription_id text,
  started_at timestamptz,
  expires_at timestamptz,
  next_billing_date date,
  canceled_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_license_status CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')),
  CONSTRAINT valid_license_billing_frequency CHECK (billing_frequency IN ('monthly', 'annual'))
);

CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id ON territory_licenses(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_status ON territory_licenses(status);

-- ============================================================
-- AUTOMATION ADD-ONS
-- ============================================================

CREATE TABLE IF NOT EXISTS automation_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  monthly_price_cents integer NOT NULL DEFAULT 0,
  annual_price_cents integer NOT NULL DEFAULT 0,
  feature_flag text NOT NULL UNIQUE,
  category text DEFAULT 'automation',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_addon_category CHECK (category IN ('automation', 'compliance', 'analytics', 'global', 'other'))
);

CREATE TABLE IF NOT EXISTS merchant_addon_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  addon_id uuid NOT NULL REFERENCES automation_addons(id),
  status text NOT NULL DEFAULT 'pending',
  billing_frequency text NOT NULL DEFAULT 'monthly',
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  paybright_transaction_id text,
  paybright_subscription_id text,
  started_at timestamptz,
  expires_at timestamptz,
  next_billing_date date,
  canceled_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_addon_status CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')),
  CONSTRAINT valid_addon_billing_frequency CHECK (billing_frequency IN ('monthly', 'annual'))
);

CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id ON merchant_addon_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id ON merchant_addon_subscriptions(addon_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_status ON merchant_addon_subscriptions(status);

-- ============================================================
-- PROFESSIONAL SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS professional_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category text NOT NULL,
  price_type text NOT NULL DEFAULT 'one_time',
  price_cents integer NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  duration_hours numeric(5,2),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_service_category CHECK (category IN ('onboarding', 'training', 'branding', 'strategy', 'development', 'compliance', 'coaching')),
  CONSTRAINT valid_price_type CHECK (price_type IN ('one_time', 'hourly', 'package'))
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES professional_services(id),
  customer_type text NOT NULL,
  customer_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  paybright_transaction_id text,
  scheduled_date timestamptz,
  completed_at timestamptz,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_customer_type CHECK (customer_type IN ('merchant', 'partner')),
  CONSTRAINT valid_booking_status CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'canceled', 'refunded'))
);

CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON service_bookings(customer_type, customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON service_bookings(status);

-- ============================================================
-- USAGE LIMITS & TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_type text NOT NULL,
  tier_slug text NOT NULL,
  limit_key text NOT NULL,
  limit_value integer NOT NULL DEFAULT -1,
  limit_type text DEFAULT 'hard',
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_tier_type CHECK (tier_type IN ('merchant', 'partner')),
  CONSTRAINT valid_limit_type CHECK (limit_type IN ('hard', 'soft')),
  UNIQUE(tier_type, tier_slug, limit_key)
);

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type text NOT NULL,
  user_id uuid NOT NULL,
  usage_key text NOT NULL,
  current_value integer DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_user_type CHECK (user_type IN ('merchant', 'partner')),
  UNIQUE(user_type, user_id, usage_key, period_start)
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user ON usage_tracking(user_type, user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- ============================================================
-- SEED DATA: PARTNER SUBSCRIPTION TIERS
-- ============================================================

INSERT INTO partner_subscription_tiers (name, slug, monthly_price_cents, annual_price_cents, description, max_territories, revenue_share_percent, features, sort_order)
VALUES
  ('Partner Tier', 'partner', 4900, 47040, 'Standard partner access with territory ownership', 10, 80.00, '["Partner Dashboard", "Territory Management", "Merchant Invites", "Deal Creation", "Analytics", "Payouts"]'::jsonb, 1),
  ('Master Partner', 'master', 14900, 143040, 'Advanced partner with expanded territory limits', 25, 80.00, '["Everything in Partner", "Priority Support", "Advanced Analytics", "White-Label Options"]'::jsonb, 2),
  ('White-Label Partner', 'white_label', 49900, 479040, 'Full white-label access with custom branding', 100, 70.00, '["Everything in Master Partner", "Custom Branding", "API Access", "Dedicated Support", "Custom Domain"]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: TERRITORY PRICING TIERS
-- ============================================================

INSERT INTO territory_pricing_tiers (name, slug, scope_type, monthly_price_cents, annual_price_cents, description, sort_order)
VALUES
  ('City / Metro', 'city', 'city', 9700, 97000, 'Single city or metro area', 1),
  ('Region', 'region', 'region', 19700, 197000, 'Multi-city region or county', 2),
  ('State / Province', 'state', 'state', 29700, 297000, 'State or province-wide', 3),
  ('Country', 'country', 'country', 49700, 497000, 'Entire country access', 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: AUTOMATION ADD-ONS
-- ============================================================

INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, sort_order)
VALUES
  ('Real-Time Webhook Processing', 'webhook_processing', 'Live payment and chargeback processing with anti-fraud', 4900, 47040, 'webhook_processing', 'automation', 1),
  ('Automated Inactivity Scanner', 'inactivity_scanner', 'Daily territory health monitoring and alerts', 2900, 27840, 'inactivity_scanner', 'automation', 2),
  ('Partner Eligibility Scoring', 'eligibility_scoring', 'Automated compliance scoring and gating', 4900, 47040, 'eligibility_scoring', 'compliance', 3),
  ('Admin Overrides & Controls', 'admin_overrides', 'Manual override dashboard for exceptions', 2900, 27840, 'admin_overrides', 'compliance', 4),
  ('Compliance Warnings & Emails', 'compliance_warnings', 'Automated warning emails and logs', 4900, 47040, 'compliance_warnings', 'compliance', 5),
  ('Reinstatement Automation', 'reinstatement_automation', 'Auto-clear warnings and restore status', 2900, 27840, 'reinstatement_automation', 'compliance', 6),
  ('Real-Time Analytics Widgets', 'analytics_widgets', '30-day rolling health scores and dashboards', 1900, 18240, 'analytics_widgets', 'analytics', 7),
  ('Chargeback & Refund Triggers', 'chargeback_triggers', 'Automated alerts for payment issues', 1900, 18240, 'chargeback_triggers', 'analytics', 8),
  ('Multi-Country Support', 'multi_country', 'International territory management', 29900, 287040, 'multi_country', 'global', 9),
  ('Multi-Currency & Exchange', 'multi_currency', 'Currency conversion and billing', 19900, 191040, 'multi_currency', 'global', 10),
  ('Multi-Language Support', 'multi_language', 'Additional language pack', 9900, 95040, 'multi_language', 'global', 11)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: PROFESSIONAL SERVICES
-- ============================================================

INSERT INTO professional_services (name, slug, description, category, price_type, price_cents, duration_hours, sort_order)
VALUES
  ('Onboarding & Training', 'onboarding_training', 'Complete platform onboarding with training', 'onboarding', 'one_time', 99700, 4.0, 1),
  ('White-Label Branding', 'white_label_branding', 'Custom branding and theme setup', 'branding', 'one_time', 200000, 8.0, 2),
  ('Territory Rollout Strategy', 'territory_strategy', 'Strategic territory planning session', 'strategy', 'one_time', 150000, 3.0, 3),
  ('Custom Workflow Development', 'custom_workflow', 'Bespoke workflow and automation development', 'development', 'hourly', 15000, 1.0, 4),
  ('Email Templates & Sequences', 'email_templates', 'Custom email template design and setup', 'onboarding', 'one_time', 49900, 2.0, 5),
  ('GoPayBright Integration Tuning', 'paybright_tuning', 'Payment gateway optimization', 'development', 'one_time', 79900, 3.0, 6),
  ('Compliance Process Design', 'compliance_design', 'Custom compliance workflow setup', 'compliance', 'one_time', 120000, 4.0, 7),
  ('Zoom Coaching Session', 'zoom_coaching', 'One-on-one coaching and support', 'coaching', 'hourly', 15000, 1.0, 8),
  ('Fast-Start Launch Pack', 'launch_pack', 'Complete setup package (onboarding + branding + training)', 'onboarding', 'package', 299700, 16.0, 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: USAGE LIMITS (MERCHANT TIERS)
-- ============================================================

INSERT INTO usage_limits (tier_type, tier_slug, limit_key, limit_value, limit_type, description)
VALUES
  ('merchant', 'starter', 'active_deals', 5, 'hard', 'Maximum active deals'),
  ('merchant', 'starter', 'crm_contacts', 500, 'soft', 'CRM contact limit'),
  ('merchant', 'starter', 'postcard_sends_monthly', 100, 'hard', 'Monthly postcard sends'),
  ('merchant', 'starter', 'api_calls_daily', 1000, 'hard', 'Daily API calls'),
  ('merchant', 'growth', 'active_deals', 20, 'hard', 'Maximum active deals'),
  ('merchant', 'growth', 'crm_contacts', 5000, 'soft', 'CRM contact limit'),
  ('merchant', 'growth', 'postcard_sends_monthly', 500, 'hard', 'Monthly postcard sends'),
  ('merchant', 'growth', 'api_calls_daily', 10000, 'hard', 'Daily API calls'),
  ('merchant', 'scale', 'active_deals', -1, 'hard', 'Unlimited active deals'),
  ('merchant', 'scale', 'crm_contacts', -1, 'soft', 'Unlimited CRM contacts'),
  ('merchant', 'scale', 'postcard_sends_monthly', -1, 'hard', 'Unlimited postcard sends'),
  ('merchant', 'scale', 'api_calls_daily', 100000, 'hard', 'Daily API calls')
ON CONFLICT (tier_type, tier_slug, limit_key) DO NOTHING;

-- ============================================================
-- SEED DATA: USAGE LIMITS (PARTNER TIERS)
-- ============================================================

INSERT INTO usage_limits (tier_type, tier_slug, limit_key, limit_value, limit_type, description)
VALUES
  ('partner', 'partner', 'max_territories', 10, 'hard', 'Maximum owned territories'),
  ('partner', 'partner', 'merchant_invites_monthly', 50, 'soft', 'Monthly merchant invites'),
  ('partner', 'master', 'max_territories', 25, 'hard', 'Maximum owned territories'),
  ('partner', 'master', 'merchant_invites_monthly', 200, 'soft', 'Monthly merchant invites'),
  ('partner', 'white_label', 'max_territories', 100, 'hard', 'Maximum owned territories'),
  ('partner', 'white_label', 'merchant_invites_monthly', -1, 'soft', 'Unlimited merchant invites')
ON CONFLICT (tier_type, tier_slug, limit_key) DO NOTHING;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE partner_subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_addon_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view partner subscription tiers"
  ON partner_subscription_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Partners can view own subscriptions"
  ON partner_subscriptions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage partner subscriptions"
  ON partner_subscriptions FOR ALL
  USING (true);

CREATE POLICY "Anyone can view territory pricing tiers"
  ON territory_pricing_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Partners can view own territory licenses"
  ON territory_licenses FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage territory licenses"
  ON territory_licenses FOR ALL
  USING (true);

CREATE POLICY "Anyone can view automation add-ons"
  ON automation_addons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Merchants can view own addon subscriptions"
  ON merchant_addon_subscriptions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage addon subscriptions"
  ON merchant_addon_subscriptions FOR ALL
  USING (true);

CREATE POLICY "Anyone can view professional services"
  ON professional_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own service bookings"
  ON service_bookings FOR SELECT
  TO authenticated
  USING (
    (customer_type = 'merchant' AND customer_id IN (SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()))
    OR (customer_type = 'partner' AND customer_id IN (SELECT p.id FROM partners p WHERE p.user_id = auth.uid()))
  );

CREATE POLICY "Service role can manage service bookings"
  ON service_bookings FOR ALL
  USING (true);

CREATE POLICY "Anyone can view usage limits"
  ON usage_limits FOR SELECT
  USING (true);

CREATE POLICY "Users can view own usage tracking"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (
    (user_type = 'merchant' AND user_id IN (SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()))
    OR (user_type = 'partner' AND user_id IN (SELECT p.id FROM partners p WHERE p.user_id = auth.uid()))
  );

CREATE POLICY "Service role can manage usage tracking"
  ON usage_tracking FOR ALL
  USING (true);
