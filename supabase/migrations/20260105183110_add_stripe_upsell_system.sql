-- Stripe One-Click Upsells System
--
-- 1. New Tables
--   - stripe_customers: Maps auth users to Stripe customer IDs for one-click upsells
--   - upsell_offers: Defines available upsell products
--   - upsell_purchases: Tracks upsell conversions
--   - partner_contracts: Contract documents for partners
--
-- 2. Security
--   - Enable RLS on all tables
--   - Users can view their own data
--
-- 3. Indexes
--   - Foreign keys for performance
--   - Lookup fields for stripe_customer_id

-- Stripe Customers (maps users to Stripe for one-click upsells)
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_customer_id text UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS stripe_customers_user_id_idx ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS stripe_customers_stripe_id_idx ON stripe_customers(stripe_customer_id);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stripe customer data"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Upsell Offers
CREATE TABLE IF NOT EXISTS upsell_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  stripe_price_id text NOT NULL,
  trigger_after_product text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE upsell_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active upsell offers"
  ON upsell_offers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Upsell Purchases
CREATE TABLE IF NOT EXISTS upsell_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  upsell_offer_id uuid REFERENCES upsell_offers NOT NULL,
  stripe_payment_intent_id text,
  amount_cents integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  purchased_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS upsell_purchases_user_id_idx ON upsell_purchases(user_id);
CREATE INDEX IF NOT EXISTS upsell_purchases_offer_id_idx ON upsell_purchases(upsell_offer_id);
CREATE INDEX IF NOT EXISTS upsell_purchases_stripe_pi_idx ON upsell_purchases(stripe_payment_intent_id);

ALTER TABLE upsell_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own upsell purchases"
  ON upsell_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Partner Contracts
CREATE TABLE IF NOT EXISTS partner_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners NOT NULL,
  contract_type text NOT NULL CHECK (contract_type IN ('territory', 'white_label', 'reseller', 'affiliate')),
  contract_url text,
  signed_at timestamptz,
  signed_by_name text,
  ip_address text,
  terms_version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_contracts_partner_id_idx ON partner_contracts(partner_id);

ALTER TABLE partner_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own contracts"
  ON partner_contracts FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Seed initial upsell offers
INSERT INTO upsell_offers (product_slug, name, description, price_cents, stripe_price_id, trigger_after_product, display_order, is_active)
VALUES
  ('ai-receptionist-script-pack-trades', 'AI Receptionist Scripts - Trades', 'Pre-written scripts for HVAC, plumbing, electrical, and tree services. Save hours of setup time.', 3900, 'price_trades_scripts', 'ai-receptionist-missed-call', 1, true),
  ('ai-receptionist-script-pack-restaurants', 'AI Receptionist Scripts - Restaurants', 'Pre-written scripts for restaurants and food service businesses.', 3900, 'price_restaurant_scripts', 'ai-receptionist-missed-call', 2, true),
  ('ai-receptionist-script-pack-pet', 'AI Receptionist Scripts - Pet Services', 'Pre-written scripts for groomers, vets, and pet trainers.', 3900, 'price_pet_scripts', 'ai-receptionist-missed-call', 3, true),
  ('ai-receptionist-script-pack-care', 'AI Receptionist Scripts - Care Services', 'Pre-written scripts for home care and health services.', 3900, 'price_care_scripts', 'ai-receptionist-missed-call', 4, true),
  ('ai-receptionist-script-pack-retail', 'AI Receptionist Scripts - Retail', 'Pre-written scripts for retail stores and general services.', 3900, 'price_retail_scripts', 'ai-receptionist-missed-call', 5, true),
  ('ai-receptionist-script-pack-mega', 'AI Receptionist Scripts - Mega Pack', 'ALL industry scripts plus future updates free. Best value!', 14900, 'price_mega_pack_scripts', 'ai-receptionist-missed-call', 6, true)
ON CONFLICT (product_slug) DO NOTHING;
