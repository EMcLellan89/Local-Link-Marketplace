/*
  # Add UGC Network System

  Complete user-generated content marketplace for Local-Link.

  1. New Tables
    - `ugc_creators` - Creator profiles and status
    - `ugc_packages` - Predefined UGC product packages
    - `ugc_orders` - Business orders for UGC content
    - `ugc_assets` - Delivered content files
    - `ugc_payouts` - Creator payment tracking

  2. Security
    - Enable RLS on all tables
    - Creators can view their own profiles and orders
    - Businesses can view their own orders
    - Admins have full access

  3. Features
    - Three-tier pricing (Starter, Growth, Retainer)
    - Creator matching by industry
    - Content approval workflow
    - Payout tracking
*/

-- =========================
-- UGC Creators Table
-- =========================
CREATE TYPE ugc_creator_status AS ENUM ('pending', 'approved', 'paused', 'rejected');

CREATE TABLE IF NOT EXISTS ugc_creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  portfolio_url text,
  industries text[] DEFAULT '{}',
  sample_video_urls text[] DEFAULT '{}',
  status ugc_creator_status DEFAULT 'pending',
  rejection_reason text,
  rating numeric(3,2) DEFAULT 0,
  total_videos_delivered int DEFAULT 0,
  monthly_capacity int DEFAULT 20,
  price_per_video_cents int DEFAULT 10000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE ugc_creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own profile"
  ON ugc_creators FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Creators can update own profile"
  ON ugc_creators FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all creators"
  ON ugc_creators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================
-- UGC Packages Table
-- =========================
CREATE TABLE IF NOT EXISTS ugc_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price_cents int NOT NULL,
  video_count int NOT NULL,
  hook_variations int DEFAULT 1,
  turnaround_days int DEFAULT 7,
  ad_usage_days int DEFAULT 30,
  includes_raw_footage boolean DEFAULT false,
  is_monthly boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ugc_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON ugc_packages FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON ugc_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================
-- UGC Orders Table
-- =========================
CREATE TYPE ugc_order_status AS ENUM (
  'pending_payment',
  'paid',
  'assigned',
  'in_progress',
  'submitted',
  'revision_requested',
  'approved',
  'completed',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS ugc_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  package_id uuid REFERENCES ugc_packages(id),
  creator_id uuid REFERENCES ugc_creators(id),
  status ugc_order_status DEFAULT 'pending_payment',

  -- Order details
  industry text,
  business_name text,
  business_description text,
  content_goal text,
  target_audience text,
  key_messages text,
  brand_guidelines_url text,

  -- Pricing
  total_price_cents int NOT NULL,
  creator_payout_cents int,
  platform_fee_cents int,

  -- Dates
  due_date timestamptz,
  submitted_at timestamptz,
  approved_at timestamptz,
  completed_at timestamptz,

  -- Additional
  admin_notes text,
  revision_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ugc_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own orders"
  ON ugc_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = ugc_orders.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view assigned orders"
  ON ugc_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ugc_creators
      WHERE ugc_creators.id = ugc_orders.creator_id
      AND ugc_creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update assigned orders"
  ON ugc_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ugc_creators
      WHERE ugc_creators.id = ugc_orders.creator_id
      AND ugc_creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON ugc_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================
-- UGC Assets Table
-- =========================
CREATE TABLE IF NOT EXISTS ugc_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES ugc_orders(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  file_type text,
  file_size_bytes bigint,
  thumbnail_url text,
  duration_seconds int,
  is_raw_footage boolean DEFAULT false,
  hook_number int,
  approved boolean DEFAULT false,
  rejection_reason text,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE ugc_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view assets"
  ON ugc_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ugc_orders
      WHERE ugc_orders.id = ugc_assets.order_id
      AND (
        EXISTS (
          SELECT 1 FROM merchants
          WHERE merchants.id = ugc_orders.merchant_id
          AND merchants.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM ugc_creators
          WHERE ugc_creators.id = ugc_orders.creator_id
          AND ugc_creators.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Creators can upload to their orders"
  ON ugc_assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ugc_orders
      JOIN ugc_creators ON ugc_creators.id = ugc_orders.creator_id
      WHERE ugc_orders.id = ugc_assets.order_id
      AND ugc_creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all assets"
  ON ugc_assets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================
-- UGC Payouts Table
-- =========================
CREATE TYPE ugc_payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');

CREATE TABLE IF NOT EXISTS ugc_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES ugc_creators(id) ON DELETE CASCADE,
  order_id uuid REFERENCES ugc_orders(id),
  amount_cents int NOT NULL,
  status ugc_payout_status DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  processed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ugc_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own payouts"
  ON ugc_payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ugc_creators
      WHERE ugc_creators.id = ugc_payouts.creator_id
      AND ugc_creators.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payouts"
  ON ugc_payouts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================
-- Indexes for Performance
-- =========================
CREATE INDEX IF NOT EXISTS idx_ugc_creators_status ON ugc_creators(status);
CREATE INDEX IF NOT EXISTS idx_ugc_creators_user_id ON ugc_creators(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_status ON ugc_orders(status);
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order ON ugc_assets(order_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator ON ugc_payouts(creator_id);