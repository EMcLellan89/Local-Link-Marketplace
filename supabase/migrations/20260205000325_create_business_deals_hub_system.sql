/*
  # Business Deals & Tools Hub - Complete System

  1. New Tables
    - `vendors`
      - SaaS and service providers with affiliate programs
      - Tracks commission rates, payout terms, contact info

    - `business_deals`
      - Individual deals for tools and services
      - Links to vendors, tracks pricing, commissions, expiry
      - Supports multiple deal types (affiliate, revshare, bundle, internal)

    - `deal_bundles`
      - Bundled packages of services and deals
      - High-ticket offerings with custom pricing

    - `bundle_items`
      - Junction table linking bundles to deals/services

    - `growth_guides`
      - Educational content library
      - Links to related deals for cross-selling

    - `seasonal_campaigns`
      - Automated seasonal promotion campaigns
      - Featured deals and banners

    - `deal_transactions`
      - Tracks all purchases and referrals
      - Revenue attribution to partners and vendors

    - `partner_deal_links`
      - Unique tracking links for partners
      - Performance metrics per partner per deal

  2. Security
    - Enable RLS on all tables
    - Admin full access
    - Partners read access to active deals and their own transactions
    - Merchants read access to active deals
    - Public read access to active deals only

  3. Indexes
    - Foreign key indexes for performance
    - Status and active flags for filtering
    - Date ranges for campaigns and deals
*/

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  website text,
  logo_url text,
  description text,
  affiliate_program text,
  commission_rate numeric(5,2) DEFAULT 0,
  commission_type text DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed', 'tiered')),
  payout_terms text,
  payout_frequency text DEFAULT 'monthly' CHECK (payout_frequency IN ('weekly', 'monthly', 'quarterly')),
  contact_email text,
  contact_name text,
  api_key text,
  active boolean DEFAULT true,
  featured boolean DEFAULT false,
  total_revenue_cents integer DEFAULT 0,
  total_referrals integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business deals table
CREATE TABLE IF NOT EXISTS business_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN (
    'marketing_ads', 'ai_automation', 'crm_sms', 'web_hosting',
    'reviews_reputation', 'analytics', 'design_video', 'operations',
    'accounting', 'hr_payroll', 'ecommerce', 'other'
  )),
  description text,
  features text[],
  deal_type text DEFAULT 'affiliate' CHECK (deal_type IN ('affiliate', 'revshare', 'bundle', 'internal')),
  regular_price_cents integer NOT NULL,
  deal_price_cents integer NOT NULL,
  savings_cents integer GENERATED ALWAYS AS (regular_price_cents - deal_price_cents) STORED,
  discount_percent integer GENERATED ALWAYS AS (
    CASE
      WHEN regular_price_cents > 0
      THEN ((regular_price_cents - deal_price_cents)::numeric / regular_price_cents * 100)::integer
      ELSE 0
    END
  ) STORED,
  commission_percent numeric(5,2) DEFAULT 0,
  commission_fixed_cents integer DEFAULT 0,
  partner_commission_percent numeric(5,2) DEFAULT 30,
  referral_link text,
  cta_text text DEFAULT 'Get This Deal',
  image_url text,
  video_url text,
  expiry_date timestamptz,
  start_date timestamptz DEFAULT now(),
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'draft')),
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  purchase_count integer DEFAULT 0,
  conversion_rate numeric(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN click_count > 0
      THEN (purchase_count::numeric / click_count * 100)
      ELSE 0
    END
  ) STORED,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deal bundles table
CREATE TABLE IF NOT EXISTS deal_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  retail_price_cents integer NOT NULL,
  bundle_price_cents integer NOT NULL,
  savings_cents integer GENERATED ALWAYS AS (retail_price_cents - bundle_price_cents) STORED,
  margin_cents integer DEFAULT 0,
  commission_split jsonb DEFAULT '{}'::jsonb,
  image_url text,
  features text[],
  included_services text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  featured boolean DEFAULT false,
  purchase_count integer DEFAULT 0,
  stripe_product_id text,
  stripe_price_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bundle items junction table
CREATE TABLE IF NOT EXISTS bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES deal_bundles(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES business_deals(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Growth guides table
CREATE TABLE IF NOT EXISTS growth_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  description text,
  content text,
  related_deal_ids uuid[],
  video_url text,
  pdf_url text,
  thumbnail_url text,
  author text,
  read_time_minutes integer,
  view_count integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seasonal campaigns table
CREATE TABLE IF NOT EXISTS seasonal_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  season text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  featured_deal_ids uuid[],
  banner_url text,
  banner_mobile_url text,
  landing_page_url text,
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'cancelled')),
  total_revenue_cents integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deal transactions table
CREATE TABLE IF NOT EXISTS deal_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL CHECK (transaction_type IN ('deal', 'bundle', 'affiliate_click', 'guide_view')),
  deal_id uuid REFERENCES business_deals(id) ON DELETE SET NULL,
  bundle_id uuid REFERENCES deal_bundles(id) ON DELETE SET NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  vendor_commission_cents integer DEFAULT 0,
  partner_commission_cents integer DEFAULT 0,
  platform_revenue_cents integer DEFAULT 0,
  stripe_session_id text,
  stripe_payment_intent_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  referral_link text,
  campaign_id uuid REFERENCES seasonal_campaigns(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Partner deal links table
CREATE TABLE IF NOT EXISTS partner_deal_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES business_deals(id) ON DELETE CASCADE,
  bundle_id uuid REFERENCES deal_bundles(id) ON DELETE SET NULL,
  tracking_code text UNIQUE NOT NULL,
  custom_url text,
  click_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  total_revenue_cents integer DEFAULT 0,
  total_commission_cents integer DEFAULT 0,
  last_click_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, deal_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON vendors(slug);

CREATE INDEX IF NOT EXISTS idx_business_deals_vendor ON business_deals(vendor_id);
CREATE INDEX IF NOT EXISTS idx_business_deals_status ON business_deals(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_business_deals_category ON business_deals(category);
CREATE INDEX IF NOT EXISTS idx_business_deals_featured ON business_deals(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_business_deals_expiry ON business_deals(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_deal_bundles_status ON deal_bundles(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_deal_bundles_featured ON deal_bundles(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_deal ON bundle_items(deal_id);

CREATE INDEX IF NOT EXISTS idx_growth_guides_status ON growth_guides(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_growth_guides_category ON growth_guides(category);

CREATE INDEX IF NOT EXISTS idx_seasonal_campaigns_dates ON seasonal_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_seasonal_campaigns_status ON seasonal_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_deal_transactions_partner ON deal_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_merchant ON deal_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_vendor ON deal_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_deal ON deal_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_bundle ON deal_transactions(bundle_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_status ON deal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_created ON deal_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_partner_deal_links_partner ON partner_deal_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_deal ON partner_deal_links(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_tracking ON partner_deal_links(tracking_code);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_deal_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Vendors: Admin full access, others read active
CREATE POLICY "Admin full access to vendors"
  ON vendors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read active vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (active = true);

-- Business deals: Admin full access, others read active
CREATE POLICY "Admin full access to business_deals"
  ON business_deals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read active deals"
  ON business_deals FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Deal bundles: Admin full access, others read active
CREATE POLICY "Admin full access to deal_bundles"
  ON deal_bundles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read active bundles"
  ON deal_bundles FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Bundle items: Admin full access, others read
CREATE POLICY "Admin full access to bundle_items"
  ON bundle_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read bundle_items"
  ON bundle_items FOR SELECT
  TO authenticated
  USING (true);

-- Growth guides: Admin full access, others read published
CREATE POLICY "Admin full access to growth_guides"
  ON growth_guides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read published guides"
  ON growth_guides FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Seasonal campaigns: Admin full access, others read active
CREATE POLICY "Admin full access to seasonal_campaigns"
  ON seasonal_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public read active campaigns"
  ON seasonal_campaigns FOR SELECT
  TO authenticated
  USING (status IN ('active', 'scheduled'));

-- Deal transactions: Admin and involved parties can read
CREATE POLICY "Admin full access to deal_transactions"
  ON deal_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners view own deal_transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants view own deal_transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Partner deal links: Admin and partner access
CREATE POLICY "Admin full access to partner_deal_links"
  ON partner_deal_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners manage own deal_links"
  ON partner_deal_links FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_deals_updated_at BEFORE UPDATE ON business_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deal_bundles_updated_at BEFORE UPDATE ON deal_bundles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_growth_guides_updated_at BEFORE UPDATE ON growth_guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seasonal_campaigns_updated_at BEFORE UPDATE ON seasonal_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();