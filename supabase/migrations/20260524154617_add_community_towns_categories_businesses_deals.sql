/*
  # Add Community Directory Core Tables

  Adds the remaining tables needed for the Local-Link Community Directory:
  - community_towns: State/town listings with tier pricing
  - community_categories: Business categories  
  - community_businesses: Directory listings
  - community_business_towns: Business <-> town junction
  - community_deals: Local deals from businesses

  The community_events table already exists and will be enhanced with a town_id FK.
*/

-- -------------------------------------------------------
-- TOWNS
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_towns (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  state         text NOT NULL DEFAULT 'MA',
  slug          text UNIQUE NOT NULL,
  county        text,
  population_estimate int DEFAULT 0,
  tier          text NOT NULL DEFAULT 'small',
  base_price_monthly_cents     int NOT NULL DEFAULT 4900,
  featured_price_monthly_cents int NOT NULL DEFAULT 14900,
  exclusive_price_monthly_cents int NOT NULL DEFAULT 29900,
  hero_image_url text,
  description   text,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE community_towns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_towns"
  ON community_towns FOR SELECT USING (is_active = true);
CREATE POLICY "Admin insert community_towns"
  ON community_towns FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin update community_towns"
  ON community_towns FOR UPDATE TO authenticated
  USING  ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- -------------------------------------------------------
-- CATEGORIES
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  parent_id   uuid REFERENCES community_categories(id),
  icon        text,
  description text,
  sort_order  int DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE community_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_categories"
  ON community_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin insert community_categories"
  ON community_categories FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin update community_categories"
  ON community_categories FOR UPDATE TO authenticated
  USING  ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- -------------------------------------------------------
-- BUSINESSES
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_businesses (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id          uuid REFERENCES merchants(id),
  user_id              uuid REFERENCES auth.users(id),
  business_name        text NOT NULL,
  slug                 text UNIQUE NOT NULL,
  category_id          uuid REFERENCES community_categories(id),
  tagline              text,
  description          text,
  phone                text,
  email                text,
  website_url          text,
  logo_url             text,
  cover_image_url      text,
  city                 text,
  state                text DEFAULT 'MA',
  zip                  text,
  ad_tier              text NOT NULL DEFAULT 'free',
  is_featured          boolean NOT NULL DEFAULT false,
  is_verified          boolean NOT NULL DEFAULT false,
  is_active            boolean NOT NULL DEFAULT true,
  average_rating       numeric(3,2) DEFAULT 0,
  review_count         int DEFAULT 0,
  accepts_new_clients  boolean DEFAULT true,
  subscription_expires_at timestamptz,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE community_businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_businesses"
  ON community_businesses FOR SELECT USING (is_active = true);
CREATE POLICY "Owner insert community_businesses"
  ON community_businesses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update community_businesses"
  ON community_businesses FOR UPDATE TO authenticated
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- BUSINESS <-> TOWNS
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_business_towns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     uuid NOT NULL REFERENCES community_businesses(id) ON DELETE CASCADE,
  town_id         uuid NOT NULL REFERENCES community_towns(id) ON DELETE CASCADE,
  placement_level text NOT NULL DEFAULT 'basic',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  UNIQUE(business_id, town_id)
);

ALTER TABLE community_business_towns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_business_towns"
  ON community_business_towns FOR SELECT USING (is_active = true);
CREATE POLICY "Owner insert community_business_towns"
  ON community_business_towns FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()
  ));
CREATE POLICY "Owner update community_business_towns"
  ON community_business_towns FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()));

-- -------------------------------------------------------
-- COMMUNITY DEALS
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_deals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         uuid REFERENCES community_businesses(id) ON DELETE CASCADE,
  town_id             uuid REFERENCES community_towns(id),
  title               text NOT NULL,
  description         text,
  discount_label      text,
  original_price_cents int,
  deal_price_cents    int,
  savings_percent     int,
  image_url           text,
  coupon_code         text,
  category            text,
  is_featured         boolean DEFAULT false,
  expires_at          timestamptz,
  is_active           boolean DEFAULT true,
  claim_count         int DEFAULT 0,
  created_at          timestamptz DEFAULT now()
);

ALTER TABLE community_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read community_deals"
  ON community_deals FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Owner insert community_deals"
  ON community_deals FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()
  ));
CREATE POLICY "Owner update community_deals"
  ON community_deals FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM community_businesses WHERE id = business_id AND user_id = auth.uid()));

-- -------------------------------------------------------
-- Add town_id to existing community_events if missing
-- -------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_events' AND column_name = 'town_id'
  ) THEN
    ALTER TABLE community_events ADD COLUMN town_id uuid REFERENCES community_towns(id);
  END IF;
END $$;

-- -------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_comm_towns_slug  ON community_towns(slug);
CREATE INDEX IF NOT EXISTS idx_comm_towns_state ON community_towns(state);
CREATE INDEX IF NOT EXISTS idx_comm_cats_slug   ON community_categories(slug);
CREATE INDEX IF NOT EXISTS idx_comm_biz_slug    ON community_businesses(slug);
CREATE INDEX IF NOT EXISTS idx_comm_biz_cat     ON community_businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_comm_biz_tier    ON community_businesses(ad_tier);
CREATE INDEX IF NOT EXISTS idx_comm_bt_biz      ON community_business_towns(business_id);
CREATE INDEX IF NOT EXISTS idx_comm_bt_town     ON community_business_towns(town_id);
CREATE INDEX IF NOT EXISTS idx_comm_deals_town  ON community_deals(town_id);
CREATE INDEX IF NOT EXISTS idx_comm_deals_biz   ON community_deals(business_id);
CREATE INDEX IF NOT EXISTS idx_comm_events_town ON community_events(town_id);
CREATE INDEX IF NOT EXISTS idx_comm_events_date ON community_events(event_date);

-- -------------------------------------------------------
-- SEED: MA TOWNS
-- -------------------------------------------------------
INSERT INTO community_towns (name, state, slug, county, tier, base_price_monthly_cents, featured_price_monthly_cents, exclusive_price_monthly_cents, population_estimate) VALUES
  ('Boston',       'MA','boston',      'Suffolk',    'metro', 39900,99900,299900,675000),
  ('Worcester',    'MA','worcester',   'Worcester',  'large', 19900,49900, 99900,206000),
  ('Cambridge',    'MA','cambridge',   'Middlesex',  'metro', 39900,99900,199900,118000),
  ('Lowell',       'MA','lowell',      'Middlesex',  'large', 19900,49900, 99900,115000),
  ('Springfield',  'MA','springfield', 'Hampden',    'large', 19900,49900, 99900,155000),
  ('Brockton',     'MA','brockton',    'Plymouth',   'large', 14900,39900, 79900,105000),
  ('Newton',       'MA','newton',      'Middlesex',  'metro', 29900,79900,149900, 88000),
  ('Framingham',   'MA','framingham',  'Middlesex',  'large',  9900,24900, 49900, 73000),
  ('Waltham',      'MA','waltham',     'Middlesex',  'large',  9900,24900, 49900, 62000),
  ('Haverhill',    'MA','haverhill',   'Essex',      'mid',    7900,19900, 39900, 63000),
  ('Plymouth',     'MA','plymouth',    'Plymouth',   'mid',    7900,19900, 39900, 62000),
  ('Leominster',   'MA','leominster',  'Worcester',  'mid',    7900,19900, 39900, 41000),
  ('Fitchburg',    'MA','fitchburg',   'Worcester',  'mid',    7900,19900, 39900, 40000),
  ('Marlborough',  'MA','marlborough', 'Middlesex',  'mid',    7900,19900, 39900, 39000),
  ('Taunton',      'MA','taunton',     'Bristol',    'mid',    7900,19900, 39900, 57000),
  ('Peabody',      'MA','peabody',     'Essex',      'mid',    7900,19900, 39900, 54000),
  ('Attleboro',    'MA','attleboro',   'Bristol',    'mid',    7900,19900, 39900, 45000),
  ('Barnstable',   'MA','barnstable',  'Barnstable', 'mid',    7900,19900, 39900, 45000),
  ('Pittsfield',   'MA','pittsfield',  'Berkshire',  'mid',    7900,19900, 39900, 43000),
  ('Gardner',      'MA','gardner',     'Worcester',  'small',  4900, 9900, 29900, 21000),
  ('Pepperell',    'MA','pepperell',   'Middlesex',  'small',  4900, 9900, 29900, 12000),
  ('Townsend',     'MA','townsend',    'Middlesex',  'small',  4900, 9900, 29900,  9500),
  ('Groton',       'MA','groton',      'Middlesex',  'small',  4900, 9900, 29900, 11000),
  ('Ashby',        'MA','ashby',       'Middlesex',  'small',  4900, 9900, 29900,  3000),
  ('Shirley',      'MA','shirley',     'Middlesex',  'small',  4900, 9900, 29900,  7500),
  ('Ayer',         'MA','ayer',        'Middlesex',  'small',  4900, 9900, 29900,  8000),
  ('Lunenburg',    'MA','lunenburg',   'Worcester',  'small',  4900, 9900, 29900, 11000),
  ('Westminster',  'MA','westminster', 'Worcester',  'small',  4900, 9900, 29900,  7500),
  ('Winchendon',   'MA','winchendon',  'Worcester',  'small',  4900, 9900, 29900, 10000),
  ('Billerica',    'MA','billerica',   'Middlesex',  'mid',    7900,19900, 39900, 43000)
ON CONFLICT (slug) DO NOTHING;

-- -------------------------------------------------------
-- SEED: CATEGORIES
-- -------------------------------------------------------
INSERT INTO community_categories (name, slug, icon, sort_order) VALUES
  ('Home Services',         'home-services',         'Home',           1),
  ('Restaurants & Food',    'restaurants-food',      'UtensilsCrossed',2),
  ('Health & Wellness',     'health-wellness',       'Heart',          3),
  ('Auto Services',         'auto-services',         'Car',            4),
  ('Professional Services', 'professional-services', 'Briefcase',      5),
  ('Retail & Shopping',     'retail-shopping',       'ShoppingBag',    6),
  ('Beauty & Salon',        'beauty-salon',          'Scissors',       7),
  ('Contractors',           'contractors',           'HardHat',        8),
  ('Real Estate',           'real-estate',           'Building2',      9),
  ('Kids & Family',         'kids-family',           'Baby',          10),
  ('Pets',                  'pets',                  'PawPrint',      11),
  ('Events & Entertainment','events-entertainment',  'Music',         12),
  ('Fitness',               'fitness',               'Dumbbell',      13),
  ('Legal & Financial',     'legal-financial',       'Scale',         14),
  ('Technology',            'technology',            'Monitor',       15)
ON CONFLICT (slug) DO NOTHING;
