/*
  # Local Link Marketplace - Complete Database Schema
  
  ## Overview
  This migration creates the complete database structure for the Local Link Marketplace platform,
  a local-first deals and loyalty ecosystem that connects merchants with customers.
  
  ## New Tables
  
  ### 1. profiles
  - Extends auth.users with additional user information
  - Links to either customer or merchant profile based on role
  - Fields: id (references auth.users), role, first_name, last_name, phone, avatar_url
  
  ### 2. categories
  - Business categories (Restaurants, Salons, Home Services, etc.)
  - Fields: id, name, slug, description, icon
  
  ### 3. merchants
  - Business profiles and information
  - Fields: business_name, description, category, location, contact info, subscription_plan, status
  
  ### 4. customers
  - Customer profiles and loyalty information
  - Fields: user_id, loyalty_points, default_location preferences
  
  ### 5. deals
  - Deal offerings created by merchants
  - Fields: title, description, pricing, quantity, dates, status, commission_rate
  
  ### 6. purchases
  - Customer purchases of deals
  - Fields: customer, deal, payment info, amounts, commission breakdown
  
  ### 7. redemptions
  - Tracking when deals are redeemed
  - Fields: purchase_id, redeemed_at, redeemed_by
  
  ### 8. payouts
  - Merchant payout tracking
  - Fields: merchant, amount, status, payment details
  
  ### 9. loyalty_events
  - Loyalty points transaction history
  - Fields: customer, points, source, description
  
  ## Security
  - Enable RLS on all tables
  - Policies restrict access based on user role and ownership
  - Admins have full access, merchants see their data, customers see their data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'merchant', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE merchant_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'expired', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE purchase_status AS ENUM ('pending', 'paid', 'refunded', 'partially_refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  website_url TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  status merchant_status NOT NULL DEFAULT 'pending',
  subscription_plan TEXT DEFAULT 'free',
  stripe_connect_id TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 30.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  default_city TEXT,
  default_postal_code TEXT,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  original_value_cents INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 30.00,
  max_quantity INTEGER,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  per_customer_limit INTEGER,
  start_at TIMESTAMPTZ DEFAULT now(),
  end_at TIMESTAMPTZ,
  status deal_status NOT NULL DEFAULT 'draft',
  redemption_instructions TEXT,
  image_url TEXT,
  featured_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  deal_id UUID NOT NULL REFERENCES deals(id),
  stripe_payment_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount_paid_cents INTEGER NOT NULL,
  commission_cents INTEGER NOT NULL,
  merchant_payout_cents INTEGER NOT NULL,
  status purchase_status NOT NULL DEFAULT 'paid',
  purchased_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL REFERENCES purchases(id),
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  redeemed_by UUID REFERENCES merchants(id),
  channel TEXT DEFAULT 'qr',
  notes TEXT
);

-- 8. Payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  amount_cents INTEGER NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  stripe_payout_id TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Loyalty events table
CREATE TABLE IF NOT EXISTS loyalty_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  source TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_category ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_dates ON deals(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_payouts_merchant_id ON payouts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Restaurants', 'restaurants', 'Dining and food establishments', 'utensils'),
  ('Salons & Spas', 'salons-spas', 'Beauty and wellness services', 'scissors'),
  ('Home Services', 'home-services', 'HVAC, plumbing, cleaning, and more', 'home'),
  ('Retail', 'retail', 'Local shops and stores', 'shopping-bag'),
  ('Health & Wellness', 'health-wellness', 'Fitness, medical, and wellness', 'heart'),
  ('Activities', 'activities', 'Entertainment and events', 'ticket')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Merchants policies
CREATE POLICY "Merchants can view own profile"
  ON merchants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Approved merchants visible to all"
  ON merchants FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Merchants can update own profile"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create merchant profile"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all merchants"
  ON merchants FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customers policies
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create customer profile"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Deals policies
CREATE POLICY "Active deals visible to all"
  ON deals FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    OR
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = deals.merchant_id AND m.user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Merchants can create deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all deals"
  ON deals FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Purchases policies
CREATE POLICY "Customers can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = customer_id AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON d.merchant_id = m.id
      WHERE d.id = deal_id AND m.user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can create purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Redemptions policies
CREATE POLICY "Merchants can view redemptions for their deals"
  ON redemptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN deals d ON p.deal_id = d.id
      JOIN merchants m ON d.merchant_id = m.id
      WHERE p.id = purchase_id AND m.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = purchase_id AND c.user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Merchants can create redemptions"
  ON redemptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchases p
      JOIN deals d ON p.deal_id = d.id
      JOIN merchants m ON d.merchant_id = m.id
      WHERE p.id = purchase_id AND m.user_id = auth.uid()
    )
  );

-- Payouts policies
CREATE POLICY "Merchants can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = merchant_id AND user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage payouts"
  ON payouts FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Loyalty events policies
CREATE POLICY "Customers can view own loyalty events"
  ON loyalty_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = customer_id AND user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can create loyalty events"
  ON loyalty_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, created_at, updated_at)
  VALUES (NEW.id, 'customer', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update loyalty points
CREATE OR REPLACE FUNCTION public.update_customer_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET loyalty_points = loyalty_points + NEW.points
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for loyalty events
DROP TRIGGER IF EXISTS on_loyalty_event_created ON loyalty_events;
CREATE TRIGGER on_loyalty_event_created
  AFTER INSERT ON loyalty_events
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_loyalty_points();