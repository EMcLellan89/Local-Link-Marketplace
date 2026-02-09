/*
  # Add Subscription, Postcard, and Loyalty System

  1. New Tables
    - `subscription_tiers`
      - `id` (uuid, primary key)
      - `name` (text) - Founders, Standard, Premium
      - `monthly_price` (numeric)
      - `postcard_placement` (text) - value, standard, premium
      - `features` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
    
    - `merchant_subscriptions`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, foreign key to merchants)
      - `tier_id` (uuid, foreign key to subscription_tiers)
      - `status` (text) - active, cancelled, suspended
      - `billing_cycle_start` (timestamptz)
      - `billing_cycle_end` (timestamptz)
      - `stripe_subscription_id` (text)
      - `created_at` (timestamptz)
      - `cancelled_at` (timestamptz)
    
    - `postcard_mailings`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., "January 2025 Mailing"
      - `mail_date` (date)
      - `print_deadline` (date)
      - `total_spots` (integer)
      - `spots_filled` (integer)
      - `circulation` (integer) - number of homes
      - `status` (text) - planning, design, printing, mailed
      - `cost` (numeric)
      - `created_at` (timestamptz)
    
    - `postcard_placements`
      - `id` (uuid, primary key)
      - `mailing_id` (uuid, foreign key to postcard_mailings)
      - `merchant_id` (uuid, foreign key to merchants)
      - `deal_id` (uuid, foreign key to deals)
      - `spot_number` (integer)
      - `placement_type` (text) - premium, standard, value
      - `created_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `loyalty_eligible` to deals
    - Add `points_value` to deals (how many points this deal earns)
    - Add `postcard_featured` to deals
    - Add `current_subscription_id` to merchants

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to read subscription tiers
    - Add policies for merchants to manage their subscriptions
    - Add policies for customers to view their loyalty points
    - Add admin policies for postcard management
*/

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  monthly_price numeric NOT NULL,
  postcard_placement text NOT NULL CHECK (postcard_placement IN ('value', 'standard', 'premium')),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription tiers"
  ON subscription_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create merchant_subscriptions table
CREATE TABLE IF NOT EXISTS merchant_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'suspended')),
  billing_cycle_start timestamptz DEFAULT now(),
  billing_cycle_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  cancelled_at timestamptz
);

ALTER TABLE merchant_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own subscriptions"
  ON merchant_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all subscriptions"
  ON merchant_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Merchants can insert own subscriptions"
  ON merchant_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own subscriptions"
  ON merchant_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants WHERE id = merchant_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

-- Create postcard_mailings table
CREATE TABLE IF NOT EXISTS postcard_mailings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  mail_date date NOT NULL,
  print_deadline date NOT NULL,
  total_spots integer NOT NULL DEFAULT 16,
  spots_filled integer DEFAULT 0,
  circulation integer DEFAULT 5000,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'design', 'printing', 'mailed')),
  cost numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE postcard_mailings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view postcard mailings"
  ON postcard_mailings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage postcard mailings"
  ON postcard_mailings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create postcard_placements table
CREATE TABLE IF NOT EXISTS postcard_placements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mailing_id uuid REFERENCES postcard_mailings(id) ON DELETE CASCADE NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  spot_number integer NOT NULL,
  placement_type text NOT NULL CHECK (placement_type IN ('premium', 'standard', 'value')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(mailing_id, spot_number)
);

ALTER TABLE postcard_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view postcard placements"
  ON postcard_placements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage postcard placements"
  ON postcard_placements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add columns to deals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'loyalty_eligible'
  ) THEN
    ALTER TABLE deals ADD COLUMN loyalty_eligible boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'points_value'
  ) THEN
    ALTER TABLE deals ADD COLUMN points_value integer DEFAULT 10;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'postcard_featured'
  ) THEN
    ALTER TABLE deals ADD COLUMN postcard_featured boolean DEFAULT false;
  END IF;
END $$;

-- Add current_subscription_id to merchants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'current_subscription_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN current_subscription_id uuid REFERENCES merchant_subscriptions(id);
  END IF;
END $$;

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, monthly_price, postcard_placement, features)
VALUES 
  ('Founders', 199, 'value', '["1 postcard spot", "Marketplace listing", "Business directory", "QR redemption", "Basic analytics", "Email promotion", "Founders rate locked for life"]'::jsonb),
  ('Standard', 249, 'standard', '["1 postcard spot", "Marketplace listing", "Business directory", "QR redemption", "Enhanced analytics", "Priority placement", "Featured in 1 email blast"]'::jsonb),
  ('Premium', 299, 'premium', '["Top-row postcard placement", "Featured deal badge", "Marketplace listing", "Business directory", "QR redemption", "Enhanced analytics", "Boosted social media", "Priority email placement", "Early feature access"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_status ON merchant_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_postcard_placements_mailing_id ON postcard_placements(mailing_id);
CREATE INDEX IF NOT EXISTS idx_postcard_placements_merchant_id ON postcard_placements(merchant_id);
