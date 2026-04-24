/*
  # Community Platform Expansion Tables

  ## Summary
  Adds the full community platform data layer: weekend guides, dining specials,
  job listings, giveaways, seasonal guides, recommendations, and user preferences.
  These tables power the new community-first customer experience.

  ## New Tables
  - `weekend_guides` — curated "This Weekend" guide records
  - `guide_items` — events/offers/businesses linked to a guide
  - `dining_specials` — merchant daily/weekly food specials
  - `job_listings` — local job and gig listings from merchants
  - `giveaways` — community giveaways and contests
  - `seasonal_guides` — holiday and seasonal content guides
  - `recommendations` — "Best Of" curated lists
  - `user_preferences` — personalized feed preferences per user

  ## Security
  - RLS enabled on all tables
  - Public read on approved/active content
  - Merchant write scoped to own records
  - User write scoped to own preferences
*/

-- Weekend Guides
CREATE TABLE IF NOT EXISTS weekend_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekend_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active weekend guides"
  ON weekend_guides FOR SELECT
  USING (status = 'active');

-- Guide Items (links events/offers/businesses to a guide)
CREATE TABLE IF NOT EXISTS guide_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid REFERENCES weekend_guides(id) ON DELETE CASCADE,
  item_type text, -- 'event', 'offer', 'business'
  item_id uuid,
  placement_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guide_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view guide items"
  ON guide_items FOR SELECT
  USING (true);

-- Dining Specials
CREATE TABLE IF NOT EXISTS dining_specials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  valid_day text DEFAULT 'daily', -- 'monday', 'tuesday', ..., 'daily', 'weekend'
  start_time time,
  end_time time,
  price_cents int DEFAULT 0,
  featured boolean DEFAULT false,
  status text DEFAULT 'active',
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dining_specials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active dining specials"
  ON dining_specials FOR SELECT
  USING (status = 'active');

CREATE POLICY "Merchants can manage own dining specials"
  ON dining_specials FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own dining specials"
  ON dining_specials FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Job Listings
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  job_type text DEFAULT 'full-time', -- 'full-time', 'part-time', 'gig', 'remote-local'
  pay_range text DEFAULT '',
  location text DEFAULT '',
  status text DEFAULT 'active',
  featured boolean DEFAULT false,
  apply_url text,
  apply_email text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active job listings"
  ON job_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Merchants can manage own job listings"
  ON job_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own job listings"
  ON job_listings FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Giveaways
CREATE TABLE IF NOT EXISTS giveaways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  prize text NOT NULL,
  prize_value_cents int DEFAULT 0,
  end_date date NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  status text DEFAULT 'active', -- 'active', 'ended', 'draft'
  image_url text,
  entry_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE giveaways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active giveaways"
  ON giveaways FOR SELECT
  USING (status = 'active');

-- Giveaway Entries
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id uuid REFERENCES giveaways(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(giveaway_id, user_id)
);

ALTER TABLE giveaway_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own giveaway entries"
  ON giveaway_entries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can enter giveaways"
  ON giveaway_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Seasonal Guides
CREATE TABLE IF NOT EXISTS seasonal_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  season text NOT NULL, -- 'spring', 'summer', 'fall', 'winter', 'holiday', 'back-to-school'
  description text DEFAULT '',
  image_url text,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seasonal_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active seasonal guides"
  ON seasonal_guides FOR SELECT
  USING (status = 'active');

-- Recommendations ("Best Of" lists)
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL, -- 'coffee', 'family', 'date-night', 'breakfast', etc.
  content jsonb DEFAULT '[]',
  featured boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active recommendations"
  ON recommendations FOR SELECT
  USING (status = 'active');

-- User Preferences (personalized feed)
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  followed_categories text[] DEFAULT '{}',
  followed_towns text[] DEFAULT '{}',
  followed_merchant_ids uuid[] DEFAULT '{}',
  digest_opt_in boolean DEFAULT true,
  digest_frequency text DEFAULT 'weekly', -- 'daily', 'weekly'
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dining_specials_merchant_id ON dining_specials(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dining_specials_featured ON dining_specials(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_job_listings_merchant_id ON job_listings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_featured ON job_listings(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_giveaways_featured ON giveaways(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_giveaways_end_date ON giveaways(end_date);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_giveaway_id ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_user_id ON giveaway_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_items_guide_id ON guide_items(guide_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Seed mock dining specials (requires merchant records to exist, so we use DO block)
DO $$
BEGIN
  -- Only seed if dining_specials is empty
  IF NOT EXISTS (SELECT 1 FROM dining_specials LIMIT 1) THEN
    NULL; -- merchants may not exist yet; seed via app
  END IF;
END $$;

-- Seed a current giveaway
INSERT INTO giveaways (title, description, prize, prize_value_cents, end_date, featured, status)
VALUES (
  'Local Business Bundle Giveaway',
  'Win a curated bundle of gift cards and experiences from top local businesses in your community.',
  '$500 Local Business Bundle',
  50000,
  (CURRENT_DATE + interval '14 days')::date,
  true,
  'active'
) ON CONFLICT DO NOTHING;
