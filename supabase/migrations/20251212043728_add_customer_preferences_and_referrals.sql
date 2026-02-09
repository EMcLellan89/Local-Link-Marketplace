/*
  # Add Customer Preferences and Referral Program

  1. New Tables
    - `customer_preferences`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers, unique)
      - `dietary_preferences` (jsonb) - array of dietary preferences
      - `favorite_categories` (jsonb) - array of category IDs
      - `preferred_locations` (jsonb) - array of cities/areas
      - `price_range_min_cents` (integer)
      - `price_range_max_cents` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_customer_id` (uuid, references customers)
      - `referred_customer_id` (uuid, references customers, nullable)
      - `referral_code` (text, unique)
      - `referred_email` (text)
      - `status` (text: pending, completed, rewarded)
      - `referrer_reward_points` (integer)
      - `referred_reward_points` (integer)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `social_shares`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `deal_id` (uuid, references deals)
      - `platform` (text: facebook, twitter, email, whatsapp)
      - `shared_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Customers can manage their own preferences
    - Customers can create and view their own referrals
    - Customers can create social shares
*/

-- Create customer preferences table
CREATE TABLE IF NOT EXISTS customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  dietary_preferences JSONB DEFAULT '[]'::jsonb,
  favorite_categories JSONB DEFAULT '[]'::jsonb,
  preferred_locations JSONB DEFAULT '[]'::jsonb,
  price_range_min_cents INTEGER DEFAULT 0,
  price_range_max_cents INTEGER DEFAULT 10000000,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  referred_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  referrer_reward_points INTEGER DEFAULT 500,
  referred_reward_points INTEGER DEFAULT 250,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create social shares table
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'email', 'whatsapp', 'linkedin', 'other')),
  shared_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id ON social_shares(customer_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_deal_id ON social_shares(deal_id);

-- Enable RLS
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

-- Customer preferences policies
CREATE POLICY "Customers can view their own preferences"
  ON customer_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can insert their own preferences"
  ON customer_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update their own preferences"
  ON customer_preferences FOR UPDATE
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

-- Referrals policies
CREATE POLICY "Customers can view their own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = referrer_customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = referrer_customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Social shares policies
CREATE POLICY "Customers can view their own social shares"
  ON social_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create social shares"
  ON social_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM referrals WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to create default customer preferences
CREATE OR REPLACE FUNCTION create_default_customer_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_preferences (customer_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default customer preferences
DROP TRIGGER IF EXISTS trigger_create_default_customer_preferences ON customers;
CREATE TRIGGER trigger_create_default_customer_preferences
  AFTER INSERT ON customers
  FOR EACH ROW EXECUTE FUNCTION create_default_customer_preferences();

-- Function to handle referral completion
CREATE OR REPLACE FUNCTION check_referral_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new customer is created, check if they were referred
  UPDATE referrals
  SET 
    referred_customer_id = NEW.id,
    status = 'completed',
    completed_at = now()
  WHERE 
    referred_email = (SELECT email FROM profiles WHERE user_id = NEW.user_id)
    AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check referral completion
DROP TRIGGER IF EXISTS trigger_check_referral_completion ON customers;
CREATE TRIGGER trigger_check_referral_completion
  AFTER INSERT ON customers
  FOR EACH ROW EXECUTE FUNCTION check_referral_completion();
