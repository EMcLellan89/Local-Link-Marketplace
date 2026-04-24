/*
  # Relationship Engine Tables

  ## Purpose
  Adds the full relationship/engagement layer for Local-Link:
  - user_follows: users following businesses, categories, towns
  - saved_items: bookmarked events/offers/businesses
  - user_activity: behavioral tracking
  - business_follows: business-specific follower list
  - business_insider_clubs: VIP/loyalty clubs per merchant
  - insider_club_members: club memberships
  - business_feed_posts: merchant content feed
  - customer_business_history: interaction log
  - customer_messages: 2-way messaging
  - reengagement_triggers: merchant re-engagement rules

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Merchants can only access their own business data
*/

-- user_follows: follow businesses, categories, towns, event_types
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  follow_type text NOT NULL, -- business, category, town, event_type, food, kids, giveaways, jobs
  follow_id uuid,
  follow_slug text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own follows"
  ON user_follows FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own follows"
  ON user_follows FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own follows"
  ON user_follows FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_user_follows_user_id ON user_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_type ON user_follows(follow_type);
CREATE INDEX IF NOT EXISTS idx_user_follows_follow_id ON user_follows(follow_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_follows_unique ON user_follows(user_id, follow_type, follow_id) WHERE follow_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_follows_unique_slug ON user_follows(user_id, follow_type, follow_slug) WHERE follow_slug IS NOT NULL AND follow_id IS NULL;

-- saved_items: bookmarks for events, offers, businesses
CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL, -- event, offer, business, job, giveaway
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved items"
  ON saved_items FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own saved items"
  ON saved_items FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own saved items"
  ON saved_items FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_type ON saved_items(item_type);

-- user_activity: behavioral tracking (views, clicks, etc.)
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  activity_type text NOT NULL, -- view, click, save, follow, rsvp, book, claim
  item_type text,
  item_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_item ON user_activity(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);

-- business_follows: per-merchant follower list (includes non-auth email/phone)
CREATE TABLE IF NOT EXISTS business_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email text,
  customer_phone text,
  source text DEFAULT 'profile',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view their followers"
  ON business_follows FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_follows.merchant_id AND m.user_id = (select auth.uid())
    )
    OR (select auth.uid()) = user_id
  );

CREATE POLICY "Authenticated users can follow businesses"
  ON business_follows FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can unfollow businesses"
  ON business_follows FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_business_follows_merchant_id ON business_follows(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_follows_user_id ON business_follows(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_follows_unique ON business_follows(merchant_id, user_id) WHERE user_id IS NOT NULL;

-- business_insider_clubs: VIP loyalty clubs per merchant
CREATE TABLE IF NOT EXISTS business_insider_clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Insider Club',
  description text,
  perks jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_insider_clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can manage own clubs"
  ON business_insider_clubs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_insider_clubs.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Public can view active clubs"
  ON business_insider_clubs FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Merchants can insert clubs"
  ON business_insider_clubs FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_insider_clubs.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update clubs"
  ON business_insider_clubs FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_insider_clubs.merchant_id AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_insider_clubs.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_business_insider_clubs_merchant_id ON business_insider_clubs(merchant_id);

-- insider_club_members: club memberships
CREATE TABLE IF NOT EXISTS insider_club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES business_insider_clubs(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email text,
  customer_phone text,
  joined_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

ALTER TABLE insider_club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own memberships"
  ON insider_club_members FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can view club members"
  ON insider_club_members FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = insider_club_members.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can join clubs"
  ON insider_club_members FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can leave clubs"
  ON insider_club_members FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_insider_club_members_club_id ON insider_club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_insider_club_members_user_id ON insider_club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_insider_club_members_merchant_id ON insider_club_members(merchant_id);

-- business_feed_posts: merchant content feed
CREATE TABLE IF NOT EXISTS business_feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  image_url text,
  post_type text DEFAULT 'update', -- update, offer, event, announcement, behind_the_scenes
  linked_offer_id uuid,
  linked_event_id uuid,
  status text DEFAULT 'draft', -- draft, published
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_feed_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can manage own feed posts"
  ON business_feed_posts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_feed_posts.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Public can view published posts"
  ON business_feed_posts FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated can view published posts"
  ON business_feed_posts FOR SELECT TO authenticated
  USING (status = 'published');

CREATE POLICY "Merchants can insert posts"
  ON business_feed_posts FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_feed_posts.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own posts"
  ON business_feed_posts FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_feed_posts.merchant_id AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = business_feed_posts.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_business_feed_posts_merchant_id ON business_feed_posts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_feed_posts_published ON business_feed_posts(published_at DESC) WHERE status = 'published';

-- customer_business_history: interaction log
CREATE TABLE IF NOT EXISTS customer_business_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email text,
  customer_phone text,
  interaction_type text NOT NULL, -- viewed, saved, followed, messaged, booked, claimed, reviewed, joined_club
  source text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customer_business_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON customer_business_history FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can view their customer history"
  ON customer_business_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = customer_business_history.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own history"
  ON customer_business_history FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_customer_business_history_merchant_id ON customer_business_history(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_business_history_user_id ON customer_business_history(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_business_history_created_at ON customer_business_history(created_at DESC);

-- customer_messages: 2-way messaging
CREATE TABLE IF NOT EXISTS customer_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text,
  customer_email text,
  customer_phone text,
  channel text DEFAULT 'chat', -- sms, email, chat
  direction text NOT NULL DEFAULT 'inbound', -- inbound, outbound
  message_body text NOT NULL,
  ai_generated boolean DEFAULT false,
  status text DEFAULT 'sent', -- sent, delivered, read
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customer_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON customer_messages FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Merchants can view their messages"
  ON customer_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = customer_messages.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON customer_messages FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_customer_messages_merchant_id ON customer_messages(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_messages_user_id ON customer_messages(user_id);

-- reengagement_triggers: merchant re-engagement rules
CREATE TABLE IF NOT EXISTS reengagement_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  trigger_type text NOT NULL, -- no_visit_30_days, offer_view_no_booking, service_cycle_due, birthday, event_followup
  days_after int DEFAULT 30,
  message_template text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reengagement_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can manage own triggers"
  ON reengagement_triggers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = reengagement_triggers.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can insert triggers"
  ON reengagement_triggers FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = reengagement_triggers.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update triggers"
  ON reengagement_triggers FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = reengagement_triggers.merchant_id AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m WHERE m.id = reengagement_triggers.merchant_id AND m.user_id = (select auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_reengagement_triggers_merchant_id ON reengagement_triggers(merchant_id);
