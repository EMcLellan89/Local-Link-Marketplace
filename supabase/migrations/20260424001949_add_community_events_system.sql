/*
  # Community Events System

  ## Purpose
  Transforms Local-Link from a deals/Groupon model into a community hub + business growth platform.
  Events are the primary engagement driver — businesses post events, customers discover them,
  and bookings/offers flow from that discovery.

  ## New Tables

  ### community_events
  - Core event records posted by merchants
  - Supports calendar view, featured placement, sponsorship tiers
  - Links to merchant for business discovery flow

  ### event_categories
  - Filterable event types: Family, Business, Food, Fitness, Arts, etc.

  ### event_rsvps
  - Customer interest/attendance tracking per event

  ### event_promotions
  - Offers/deals tied to specific events (e.g., "Coming to Spring Fest? Get 10% off")

  ### partner_event_packages
  - Packages partners can sell to merchants for community visibility
  - Event posting, featured placement, sponsored sections, bundles

  ## Security
  - RLS enabled on all tables
  - Merchants can manage their own events
  - Customers can RSVP and view
  - Partners can view packages they sell
  - Public read on active events and categories
*/

-- Event categories
CREATE TABLE IF NOT EXISTS event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text DEFAULT 'calendar',
  color text DEFAULT '#2BB673',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event categories are publicly readable"
  ON event_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage event categories"
  ON event_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Seed default event categories
INSERT INTO event_categories (name, slug, icon, color, sort_order) VALUES
  ('Family & Kids', 'family', 'users', '#F59E0B', 1),
  ('Business & Networking', 'business', 'briefcase', '#3B82F6', 2),
  ('Food & Drink', 'food', 'utensils', '#EF4444', 3),
  ('Arts & Culture', 'arts', 'palette', '#8B5CF6', 4),
  ('Health & Fitness', 'fitness', 'heart', '#10B981', 5),
  ('Community & Civic', 'community', 'home', '#6B7280', 6),
  ('Shopping & Markets', 'shopping', 'shopping-bag', '#F97316', 7),
  ('Education & Classes', 'education', 'book-open', '#0EA5E9', 8),
  ('Seasonal & Holiday', 'seasonal', 'star', '#EAB308', 9),
  ('Free Events', 'free', 'gift', '#2BB673', 10)
ON CONFLICT (slug) DO NOTHING;

-- Community events
CREATE TABLE IF NOT EXISTS community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES event_categories(id),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  image_url text,
  event_date date NOT NULL,
  start_time text,
  end_time text,
  location_name text,
  location_address text,
  city text,
  state text,
  is_free boolean NOT NULL DEFAULT true,
  ticket_price_cents integer NOT NULL DEFAULT 0,
  ticket_url text,
  max_attendees integer,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'cancelled', 'completed')),
  is_featured boolean NOT NULL DEFAULT false,
  is_sponsored boolean NOT NULL DEFAULT false,
  sponsor_tier text CHECK (sponsor_tier IN ('basic', 'featured', 'premium', 'homepage')),
  homepage_placement boolean NOT NULL DEFAULT false,
  rsvp_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_events_merchant_id ON community_events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_community_events_category_id ON community_events(category_id);
CREATE INDEX IF NOT EXISTS idx_community_events_event_date ON community_events(event_date);
CREATE INDEX IF NOT EXISTS idx_community_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_community_events_is_featured ON community_events(is_featured);

CREATE POLICY "Active events are publicly readable"
  ON community_events FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Merchants can insert their own events"
  ON community_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own events"
  ON community_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own events"
  ON community_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  email text,
  status text NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);

CREATE POLICY "Users can view their own RSVPs"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users can create RSVPs"
  ON event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own RSVPs"
  ON event_rsvps FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Event promotions (offers tied to events)
CREATE TABLE IF NOT EXISTS event_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount_percent integer,
  discount_amount_cents integer,
  promo_code text,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_promotions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_event_promotions_event_id ON event_promotions(event_id);
CREATE INDEX IF NOT EXISTS idx_event_promotions_merchant_id ON event_promotions(merchant_id);

CREATE POLICY "Active event promotions are publicly readable"
  ON event_promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Merchants can manage their own event promotions"
  ON event_promotions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own event promotions"
  ON event_promotions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

-- Partner community event packages (what partners sell)
CREATE TABLE IF NOT EXISTS partner_community_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL DEFAULT 0,
  billing_type text NOT NULL DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'monthly', 'annual')),
  partner_commission_percent integer NOT NULL DEFAULT 20,
  features text[] DEFAULT '{}',
  event_posts_included integer NOT NULL DEFAULT 1,
  featured_events_included integer NOT NULL DEFAULT 0,
  homepage_placements_included integer NOT NULL DEFAULT 0,
  email_blast_included boolean NOT NULL DEFAULT false,
  sponsorship_category text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE partner_community_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community packages are publicly readable"
  ON partner_community_packages FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Seed partner community packages
INSERT INTO partner_community_packages (name, slug, description, price_cents, billing_type, partner_commission_percent, features, event_posts_included, featured_events_included, homepage_placements_included, email_blast_included, sort_order)
VALUES
  (
    'Basic Event Listing',
    'basic-event-listing',
    'Get a local business listed on the community calendar. Perfect intro offer.',
    4900,
    'one_time',
    20,
    ARRAY['1 event posted to community calendar', 'Category listing', 'Business profile link', 'RSVP tracking'],
    1, 0, 0, false, 1
  ),
  (
    'Featured Event Package',
    'featured-event',
    'Featured placement at the top of the community calendar with highlighted design.',
    9900,
    'one_time',
    25,
    ARRAY['1 featured event (top of calendar)', 'Highlighted card design', 'Business profile link', 'RSVP + analytics', 'Social share tools'],
    1, 1, 0, false, 2
  ),
  (
    'Community Presence Bundle',
    'community-presence',
    'Full community visibility: listing + events + offers + monthly activity. Best seller.',
    19900,
    'monthly',
    30,
    ARRAY['3 events per month', '1 featured event placement', 'Active offers displayed', 'RSVP management', 'Monthly activity report', 'Email blast to local subscribers'],
    3, 1, 0, true, 3
  ),
  (
    'Homepage Sponsor',
    'homepage-sponsor',
    'Sponsor the homepage community section. Maximum local visibility.',
    49900,
    'monthly',
    20,
    ARRAY['Homepage event placement', 'Logo on community section', '5 event posts per month', '2 featured events', 'Weekly email blast', 'Analytics dashboard'],
    5, 2, 1, true, 4
  ),
  (
    'Category Sponsor',
    'category-sponsor',
    'Sponsor an event category (Kids & Family, Business, Food, etc.) for dominant placement.',
    29900,
    'monthly',
    25,
    ARRAY['Sponsor one event category', 'Top placement in category', '3 event posts per month', '1 featured event', 'Category email blast', 'Sponsor badge on all category events'],
    3, 1, 0, true, 5
  ),
  (
    'Seasonal Campaign',
    'seasonal-campaign',
    'Full seasonal event + promotion campaign. Great for holiday and back-to-school periods.',
    39900,
    'one_time',
    25,
    ARRAY['Full campaign setup', '5 event posts', '2 featured events', 'Tied promotions and offers', 'Email blast to subscribers', 'Social media content pack'],
    5, 2, 0, true, 6
  )
ON CONFLICT (slug) DO NOTHING;

-- Merchant community package purchases
CREATE TABLE IF NOT EXISTS merchant_community_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  package_id uuid NOT NULL REFERENCES partner_community_packages(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  commission_paid boolean NOT NULL DEFAULT false,
  commission_amount_cents integer NOT NULL DEFAULT 0
);

ALTER TABLE merchant_community_purchases ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_merchant_community_purchases_merchant_id ON merchant_community_purchases(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_community_purchases_partner_id ON merchant_community_purchases(partner_id);

CREATE POLICY "Merchants can view their own community purchases"
  ON merchant_community_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Partners can view their referred community purchases"
  ON merchant_community_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_id
      AND partners.user_id = (SELECT auth.uid())
    )
  );
