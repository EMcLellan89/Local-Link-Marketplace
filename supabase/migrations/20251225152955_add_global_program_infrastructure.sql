/*
  # Global Program Infrastructure

  1. New Tables
    - `currencies` - Supported currencies with exchange rates
    - `countries` - Supported countries with metadata
    - `timezones` - Timezone information for scheduling
    - `merchant_settings` - Extended merchant settings for global operations
    - `partner_settings` - Extended partner settings for global operations
    - `payment_methods` - Supported payment methods per country
    - `tax_rates` - Tax rates by country/region
    - `notification_queue` - Async notification delivery queue
    - `system_settings` - Global platform configuration

  2. Updates
    - Add currency fields to existing tables
    - Add timezone fields
    - Add country-specific metadata

  3. Security
    - Enable RLS on all tables
    - Policies for appropriate access
*/

-- ============================================================
-- CURRENCIES
-- ============================================================

CREATE TABLE IF NOT EXISTS currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  symbol text NOT NULL,
  decimal_places integer DEFAULT 2,
  exchange_rate_to_usd numeric(10,6) DEFAULT 1.000000,
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active);

-- ============================================================
-- COUNTRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  currency_code text NOT NULL,
  phone_prefix text,
  address_format jsonb DEFAULT '{}'::jsonb,
  tax_id_format text,
  postal_code_format text,
  is_supported boolean DEFAULT true,
  requires_tax_id boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_supported ON countries(is_supported);

-- ============================================================
-- TIMEZONES
-- ============================================================

CREATE TABLE IF NOT EXISTS timezones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  offset_hours numeric(4,2) NOT NULL,
  dst_offset_hours numeric(4,2),
  country_codes text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- MERCHANT SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS merchant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL UNIQUE REFERENCES merchants(id) ON DELETE CASCADE,
  preferred_currency text DEFAULT 'USD',
  timezone text DEFAULT 'America/New_York',
  business_hours jsonb DEFAULT '{}'::jsonb,
  notification_preferences jsonb DEFAULT '{"email": true, "sms": false}'::jsonb,
  auto_approve_deals boolean DEFAULT false,
  allow_refunds boolean DEFAULT true,
  refund_window_days integer DEFAULT 30,
  feature_flags jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merchant_settings_merchant_id ON merchant_settings(merchant_id);

-- ============================================================
-- PARTNER SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL UNIQUE REFERENCES partners(id) ON DELETE CASCADE,
  preferred_currency text DEFAULT 'USD',
  timezone text DEFAULT 'America/New_York',
  payout_schedule text DEFAULT 'weekly',
  minimum_payout_amount numeric(10,2) DEFAULT 50.00,
  notification_preferences jsonb DEFAULT '{"email": true, "sms": false}'::jsonb,
  white_label_config jsonb DEFAULT '{}'::jsonb,
  feature_flags jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_payout_schedule CHECK (payout_schedule IN ('daily', 'weekly', 'biweekly', 'monthly'))
);

CREATE INDEX IF NOT EXISTS idx_partner_settings_partner_id ON partner_settings(partner_id);

-- ============================================================
-- PAYMENT METHODS
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  supported_currencies text[] DEFAULT ARRAY['USD']::text[],
  supported_countries text[] DEFAULT ARRAY['US']::text[],
  processor text NOT NULL,
  processor_config jsonb DEFAULT '{}'::jsonb,
  fees_percentage numeric(5,2) DEFAULT 2.9,
  fees_fixed_cents integer DEFAULT 30,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_slug ON payment_methods(slug);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active);

-- ============================================================
-- TAX RATES
-- ============================================================

CREATE TABLE IF NOT EXISTS tax_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  region_code text,
  tax_type text NOT NULL,
  rate_percentage numeric(5,2) NOT NULL,
  applies_to text[] DEFAULT ARRAY['all']::text[],
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_to date,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_tax_type CHECK (tax_type IN ('vat', 'gst', 'sales', 'service', 'other'))
);

CREATE INDEX IF NOT EXISTS idx_tax_rates_country ON tax_rates(country_code);
CREATE INDEX IF NOT EXISTS idx_tax_rates_effective ON tax_rates(effective_from, effective_to);

-- ============================================================
-- NOTIFICATION QUEUE
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type text NOT NULL,
  recipient_id uuid NOT NULL,
  notification_type text NOT NULL,
  channel text NOT NULL,
  subject text,
  body text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  priority integer DEFAULT 5,
  scheduled_for timestamptz DEFAULT now(),
  sent_at timestamptz,
  failed_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_recipient_type CHECK (recipient_type IN ('merchant', 'partner', 'customer', 'admin')),
  CONSTRAINT valid_channel CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
  CONSTRAINT valid_notification_status CHECK (status IN ('pending', 'sent', 'failed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled ON notification_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_queue_recipient ON notification_queue(recipient_type, recipient_id);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  category text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- ============================================================
-- SEED DATA: CURRENCIES
-- ============================================================

INSERT INTO currencies (code, name, symbol, decimal_places, exchange_rate_to_usd, is_active)
VALUES
  ('USD', 'US Dollar', '$', 2, 1.000000, true),
  ('CAD', 'Canadian Dollar', 'C$', 2, 0.740000, true),
  ('EUR', 'Euro', '€', 2, 1.080000, true),
  ('GBP', 'British Pound', '£', 2, 1.270000, true),
  ('AUD', 'Australian Dollar', 'A$', 2, 0.650000, true),
  ('JPY', 'Japanese Yen', '¥', 0, 0.007000, true),
  ('MXN', 'Mexican Peso', 'MX$', 2, 0.058000, true),
  ('BRL', 'Brazilian Real', 'R$', 2, 0.200000, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DATA: COUNTRIES
-- ============================================================

INSERT INTO countries (code, name, currency_code, phone_prefix, is_supported, requires_tax_id)
VALUES
  ('US', 'United States', 'USD', '+1', true, false),
  ('CA', 'Canada', 'CAD', '+1', true, false),
  ('GB', 'United Kingdom', 'GBP', '+44', true, true),
  ('AU', 'Australia', 'AUD', '+61', true, true),
  ('DE', 'Germany', 'EUR', '+49', true, true),
  ('FR', 'France', 'EUR', '+33', true, true),
  ('ES', 'Spain', 'EUR', '+34', true, true),
  ('IT', 'Italy', 'EUR', '+39', true, true),
  ('NL', 'Netherlands', 'EUR', '+31', true, true),
  ('MX', 'Mexico', 'MXN', '+52', true, true),
  ('BR', 'Brazil', 'BRL', '+55', true, true),
  ('JP', 'Japan', 'JPY', '+81', true, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DATA: PAYMENT METHODS
-- ============================================================

INSERT INTO payment_methods (name, slug, description, supported_currencies, processor, fees_percentage, fees_fixed_cents, is_active)
VALUES
  ('Credit Card', 'credit_card', 'Visa, Mastercard, American Express', ARRAY['USD', 'CAD', 'EUR', 'GBP', 'AUD'], 'gopaybright', 2.9, 30, true),
  ('Debit Card', 'debit_card', 'Bank debit cards', ARRAY['USD', 'CAD', 'EUR', 'GBP'], 'gopaybright', 2.5, 30, true),
  ('Bank Transfer', 'bank_transfer', 'Direct bank transfer', ARRAY['USD', 'CAD', 'EUR', 'GBP'], 'gopaybright', 0.8, 0, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: SYSTEM SETTINGS
-- ============================================================

INSERT INTO system_settings (key, value, category, description, is_public)
VALUES
  ('platform_name', '"Local-Link Marketplace"', 'branding', 'Platform name', true),
  ('support_email', '"support@locallink.com"', 'contact', 'Support email address', true),
  ('default_currency', '"USD"', 'payments', 'Default platform currency', true),
  ('default_timezone', '"America/New_York"', 'general', 'Default platform timezone', false),
  ('maintenance_mode', 'false', 'system', 'Enable maintenance mode', false),
  ('signup_enabled', 'true', 'system', 'Allow new user signups', false),
  ('deal_approval_required', 'true', 'deals', 'Require admin approval for new deals', false),
  ('min_deal_price_cents', '100', 'deals', 'Minimum deal price in cents', false),
  ('max_deal_discount_percent', '90', 'deals', 'Maximum deal discount percentage', false),
  ('partner_application_auto_approve', 'false', 'partners', 'Auto-approve partner applications', false),
  ('commission_rate_default', '20.00', 'payments', 'Default platform commission rate', false),
  ('payout_frequency', '"weekly"', 'payments', 'Default payout frequency', false),
  ('email_notifications_enabled', 'true', 'notifications', 'Enable email notifications', false),
  ('sms_notifications_enabled', 'false', 'notifications', 'Enable SMS notifications', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- UPDATE TERRITORIES FOR GLOBAL SCOPE
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'territories' AND column_name = 'scope_level'
  ) THEN
    ALTER TABLE territories ADD COLUMN scope_level text DEFAULT 'local';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'territories' AND column_name = 'parent_territory_id'
  ) THEN
    ALTER TABLE territories ADD COLUMN parent_territory_id uuid REFERENCES territories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'territories' AND column_name = 'population'
  ) THEN
    ALTER TABLE territories ADD COLUMN population integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'territories' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE territories ADD COLUMN timezone text DEFAULT 'America/New_York';
  END IF;
END $$;

-- ============================================================
-- UPDATE MERCHANTS FOR GLOBAL SUPPORT
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE merchants ADD COLUMN currency_code text DEFAULT 'USD';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE merchants ADD COLUMN timezone text DEFAULT 'America/New_York';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'tax_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN tax_id text;
  END IF;
END $$;

-- ============================================================
-- UPDATE DEALS FOR MULTI-CURRENCY
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE deals ADD COLUMN currency_code text DEFAULT 'USD';
  END IF;
END $$;

-- ============================================================
-- UPDATE PURCHASES FOR MULTI-CURRENCY
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE purchases ADD COLUMN currency_code text DEFAULT 'USD';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'exchange_rate'
  ) THEN
    ALTER TABLE purchases ADD COLUMN exchange_rate numeric(10,6) DEFAULT 1.000000;
  END IF;
END $$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE timezones ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active currencies"
  ON currencies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view supported countries"
  ON countries FOR SELECT
  USING (is_supported = true);

CREATE POLICY "Anyone can view timezones"
  ON timezones FOR SELECT
  USING (is_active = true);

CREATE POLICY "Merchants can view own settings"
  ON merchant_settings FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own settings"
  ON merchant_settings FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view own settings"
  ON partner_settings FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own settings"
  ON partner_settings FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active payment methods"
  ON payment_methods FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view tax rates"
  ON tax_rates FOR SELECT
  USING (
    effective_from <= CURRENT_DATE 
    AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
  );

CREATE POLICY "Users can view own notifications"
  ON notification_queue FOR SELECT
  TO authenticated
  USING (
    (recipient_type = 'merchant' AND recipient_id IN (SELECT m.id FROM merchants m WHERE m.user_id = auth.uid()))
    OR (recipient_type = 'partner' AND recipient_id IN (SELECT p.id FROM partners p WHERE p.user_id = auth.uid()))
    OR (recipient_type = 'customer' AND recipient_id IN (SELECT c.id FROM customers c WHERE c.user_id = auth.uid()))
  );

CREATE POLICY "Anyone can view public system settings"
  ON system_settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Service role can manage all settings"
  ON system_settings FOR ALL
  USING (true);

CREATE POLICY "Service role can manage all notifications"
  ON notification_queue FOR ALL
  USING (true);
