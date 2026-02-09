/*
  # Add Surveys, Gift Cards, and Customer Memberships

  1. New Tables
    - `surveys`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `title` (text)
      - `description` (text)
      - `questions` (jsonb) - array of question objects
      - `trigger_type` (text: post_purchase, post_redemption, manual)
      - `status` (text: draft, active, closed)
      - `response_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `survey_responses`
      - `id` (uuid, primary key)
      - `survey_id` (uuid, references surveys)
      - `customer_id` (uuid, references customers)
      - `purchase_id` (uuid, references purchases, nullable)
      - `answers` (jsonb) - object with question IDs as keys
      - `nps_score` (integer, nullable)
      - `submitted_at` (timestamptz)
    
    - `gift_cards`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `merchant_id` (uuid, references merchants, nullable)
      - `purchased_by_customer_id` (uuid, references customers, nullable)
      - `recipient_email` (text)
      - `recipient_name` (text)
      - `initial_balance_cents` (integer)
      - `current_balance_cents` (integer)
      - `status` (text: active, redeemed, expired, cancelled)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `gift_card_transactions`
      - `id` (uuid, primary key)
      - `gift_card_id` (uuid, references gift_cards)
      - `purchase_id` (uuid, references purchases, nullable)
      - `amount_cents` (integer)
      - `transaction_type` (text: load, redeem, refund)
      - `created_at` (timestamptz)
    
    - `membership_tiers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price_cents` (integer)
      - `billing_period` (text: monthly, yearly)
      - `benefits` (jsonb)
      - `loyalty_points_multiplier` (numeric)
      - `exclusive_deals` (boolean)
      - `early_access` (boolean)
      - `priority_support` (boolean)
      - `created_at` (timestamptz)
    
    - `customer_memberships`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers, unique)
      - `tier_id` (uuid, references membership_tiers)
      - `status` (text: active, cancelled, expired)
      - `started_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `auto_renew` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Merchants can manage their own surveys
    - Customers can submit survey responses
    - Customers can view and use their gift cards
    - Customers can manage their memberships
*/

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB DEFAULT '[]'::jsonb,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('post_purchase', 'post_redemption', 'manual')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Create gift cards table
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  purchased_by_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  recipient_email TEXT,
  recipient_name TEXT,
  initial_balance_cents INTEGER NOT NULL,
  current_balance_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create gift card transactions table
CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('load', 'redeem', 'refund')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create membership tiers table
CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  benefits JSONB DEFAULT '[]'::jsonb,
  loyalty_points_multiplier NUMERIC(3,2) DEFAULT 1.0,
  exclusive_deals BOOLEAN DEFAULT false,
  early_access BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create customer memberships table
CREATE TABLE IF NOT EXISTS customer_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  tier_id UUID NOT NULL REFERENCES membership_tiers(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_surveys_merchant_id ON surveys(merchant_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_customer_id ON customer_memberships(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id ON customer_memberships(tier_id);

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_memberships ENABLE ROW LEVEL SECURITY;

-- Surveys policies
CREATE POLICY "Merchants can view their own surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create surveys"
  ON surveys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own surveys"
  ON surveys FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Survey responses policies
CREATE POLICY "Customers can view their own survey responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view responses to their surveys"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM surveys s
      JOIN merchants m ON m.id = s.merchant_id
      WHERE s.id = survey_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can submit survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Gift cards policies
CREATE POLICY "Customers can view their own gift cards"
  ON gift_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = purchased_by_customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view gift cards for their business"
  ON gift_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Gift card transactions policies
CREATE POLICY "Customers can view transactions for their gift cards"
  ON gift_card_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM gift_cards gc
      JOIN customers c ON c.id = gc.purchased_by_customer_id
      WHERE gc.id = gift_card_id
      AND c.user_id = auth.uid()
    )
  );

-- Membership tiers policies (public read)
CREATE POLICY "Anyone can view membership tiers"
  ON membership_tiers FOR SELECT
  TO authenticated
  USING (true);

-- Customer memberships policies
CREATE POLICY "Customers can view their own membership"
  ON customer_memberships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update their own membership"
  ON customer_memberships FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Function to update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE surveys SET response_count = response_count + 1 WHERE id = NEW.survey_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update survey response count
DROP TRIGGER IF EXISTS trigger_update_survey_response_count ON survey_responses;
CREATE TRIGGER trigger_update_survey_response_count
  AFTER INSERT ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();

-- Function to generate gift card code
CREATE OR REPLACE FUNCTION generate_gift_card_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 12));
    SELECT EXISTS(SELECT 1 FROM gift_cards WHERE gift_cards.code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Insert default membership tiers
INSERT INTO membership_tiers (name, description, price_cents, billing_period, benefits, loyalty_points_multiplier, exclusive_deals, early_access, priority_support) VALUES
  ('Free', 'Basic access to all deals', 0, 'monthly', '["Browse all deals", "Standard loyalty points"]'::jsonb, 1.0, false, false, false),
  ('Premium', 'Enhanced deal experience', 999, 'monthly', '["2x loyalty points", "Exclusive deals", "Early access to new deals", "Priority support"]'::jsonb, 2.0, true, true, true),
  ('VIP', 'Ultimate deal experience', 9999, 'yearly', '["3x loyalty points", "Exclusive VIP deals", "Early access to all deals", "24/7 priority support", "Monthly bonus points"]'::jsonb, 3.0, true, true, true)
ON CONFLICT DO NOTHING;
