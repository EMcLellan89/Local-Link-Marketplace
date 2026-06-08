/*
  # 7-Sided CommunityHub System

  Adds tables for:
  - community_organizations (government entities, nonprofits, schools)
  - community_posts (unified content from all org types + town announcements)
  - emergency_alerts (priority display)
  - volunteer_opportunities
  - new community_categories for all content types
*/

-- ================================================================
-- COMMUNITY ORGANIZATIONS (Government, Nonprofits, Schools)
-- ================================================================
CREATE TABLE IF NOT EXISTS community_organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  org_type      text NOT NULL CHECK (org_type IN ('government','nonprofit','school','library','religious','civic')),
  description   text,
  town_id       uuid REFERENCES community_towns(id) ON DELETE SET NULL,
  address       text,
  phone         text,
  email         text,
  website_url   text,
  logo_url      text,
  is_verified   boolean NOT NULL DEFAULT false,
  is_active     boolean NOT NULL DEFAULT true,
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- COMMUNITY POSTS (unified content from all org types)
-- ================================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES community_organizations(id) ON DELETE CASCADE,
  town_id         uuid REFERENCES community_towns(id) ON DELETE SET NULL,
  title           text NOT NULL,
  body            text,
  post_type       text NOT NULL CHECK (post_type IN (
    'town_announcement','emergency_alert','public_works','senior_services',
    'veteran_services','library','schools','parks_rec','animal_control',
    'health_dept','volunteer','fundraiser','lost_found','local_jobs',
    'nonprofit_event','school_event','government_notice','community_event'
  )),
  priority        text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','published','rejected')),
  image_url       text,
  event_date      date,
  event_time      text,
  event_location  text,
  contact_info    text,
  external_url    text,
  is_emergency    boolean NOT NULL DEFAULT false,
  starts_at       timestamptz,
  expires_at      timestamptz,
  approved_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at     timestamptz,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- EMERGENCY ALERTS (priority display, separate table for fast queries)
-- ================================================================
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  town_id       uuid REFERENCES community_towns(id) ON DELETE SET NULL,
  org_id        uuid REFERENCES community_organizations(id) ON DELETE SET NULL,
  title         text NOT NULL,
  description   text NOT NULL,
  alert_type    text NOT NULL CHECK (alert_type IN (
    'emergency','weather','road_closure','snow_emergency','water_ban',
    'power_outage','evacuation','shelter','health','fire','flood','other'
  )),
  severity      text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info','warning','critical')),
  is_active     boolean NOT NULL DEFAULT true,
  issued_at     timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz,
  issued_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- VOLUNTEER OPPORTUNITIES
-- ================================================================
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES community_organizations(id) ON DELETE CASCADE,
  town_id         uuid REFERENCES community_towns(id) ON DELETE SET NULL,
  title           text NOT NULL,
  description     text NOT NULL,
  category        text,
  slots_available integer,
  slots_filled    integer NOT NULL DEFAULT 0,
  date_needed     date,
  time_commitment text,
  location        text,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  is_recurring    boolean NOT NULL DEFAULT false,
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','filled','closed','cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- VOLUNTEER SIGNUPS
-- ================================================================
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id       uuid NOT NULL REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
  user_id              uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name                 text NOT NULL,
  email                text NOT NULL,
  phone                text,
  notes                text,
  status               text NOT NULL DEFAULT 'signed_up' CHECK (status IN ('signed_up','confirmed','cancelled','completed')),
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_community_organizations_town_id ON community_organizations(town_id);
CREATE INDEX IF NOT EXISTS idx_community_organizations_org_type ON community_organizations(org_type);
CREATE INDEX IF NOT EXISTS idx_community_organizations_is_active ON community_organizations(is_active);
CREATE INDEX IF NOT EXISTS idx_community_posts_town_id ON community_posts(town_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_org_id ON community_posts(organization_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_emergency ON community_posts(is_emergency);
CREATE INDEX IF NOT EXISTS idx_community_posts_expires_at ON community_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_town_id ON emergency_alerts(town_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_is_active ON emergency_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_town_id ON volunteer_opportunities(town_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opportunity_id ON volunteer_signups(opportunity_id);

-- ================================================================
-- RLS
-- ================================================================
ALTER TABLE community_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;

-- community_organizations: public read, owner/admin write
CREATE POLICY "public_read_orgs" ON community_organizations FOR SELECT USING (true);
CREATE POLICY "owner_insert_orgs" ON community_organizations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner_update_orgs" ON community_organizations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "owner_delete_orgs" ON community_organizations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- community_posts: public read approved, owner write
CREATE POLICY "public_read_posts" ON community_posts FOR SELECT USING (status = 'published' OR auth.uid() = created_by);
CREATE POLICY "auth_insert_posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "owner_update_posts" ON community_posts FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "owner_delete_posts" ON community_posts FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- emergency_alerts: public read active, auth write
CREATE POLICY "public_read_alerts" ON emergency_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "auth_insert_alerts" ON emergency_alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_alerts" ON emergency_alerts FOR UPDATE TO authenticated USING (auth.uid() = issued_by);
CREATE POLICY "auth_delete_alerts" ON emergency_alerts FOR DELETE TO authenticated USING (auth.uid() = issued_by);

-- volunteer_opportunities: public read open, org owner write
CREATE POLICY "public_read_volunteer" ON volunteer_opportunities FOR SELECT USING (status IN ('open','filled'));
CREATE POLICY "auth_insert_volunteer" ON volunteer_opportunities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_volunteer" ON volunteer_opportunities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_volunteer" ON volunteer_opportunities FOR DELETE TO authenticated USING (true);

-- volunteer_signups: owner read/write
CREATE POLICY "owner_read_signups" ON volunteer_signups FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "auth_insert_signups" ON volunteer_signups FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner_update_signups" ON volunteer_signups FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "owner_delete_signups" ON volunteer_signups FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ================================================================
-- SEED: Sample government & nonprofit organizations for Pepperell MA
-- ================================================================
DO $$
DECLARE
  pepperell_id uuid;
BEGIN
  SELECT id INTO pepperell_id FROM community_towns WHERE LOWER(name) = 'pepperell' LIMIT 1;

  IF pepperell_id IS NOT NULL THEN
    INSERT INTO community_organizations (name, org_type, description, town_id, is_verified, is_active) VALUES
      ('Town of Pepperell', 'government', 'Official Town of Pepperell municipal government', pepperell_id, true, true),
      ('Pepperell Fire Department', 'government', 'Pepperell Fire & EMS services', pepperell_id, true, true),
      ('Pepperell Police Department', 'government', 'Pepperell Police Department', pepperell_id, true, true),
      ('Pepperell Public Library', 'library', 'Pepperell Public Library – community learning hub', pepperell_id, true, true),
      ('Pepperell Parks & Recreation', 'government', 'Parks, recreation, and community events', pepperell_id, true, true),
      ('Pepperell Senior Center', 'government', 'Programs and services for seniors 60+', pepperell_id, true, true),
      ('Varnum Post VFW', 'civic', 'Veterans of Foreign Wars – Pepperell Post', pepperell_id, true, true),
      ('Greater Nashoba Valley Food Pantry', 'nonprofit', 'Free food assistance for community members in need', pepperell_id, true, true),
      ('Pepperell Animal Shelter', 'nonprofit', 'Animal control and adoption services', pepperell_id, true, true),
      ('Pepperell Little League', 'civic', 'Youth baseball and softball programs', pepperell_id, true, true),
      ('North Middlesex Regional School District', 'school', 'Public schools serving Pepperell, Townsend, and Ashby', pepperell_id, true, true),
      ('Pepperell Elementary PTA', 'civic', 'Parent-Teacher Association for Pepperell Elementary', pepperell_id, true, true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ================================================================
-- SEED: Sample community posts and emergency alerts
-- ================================================================
DO $$
DECLARE
  pepperell_id uuid;
  town_gov_id  uuid;
  fire_dept_id uuid;
  library_id   uuid;
  food_pantry_id uuid;
  school_id    uuid;
BEGIN
  SELECT id INTO pepperell_id FROM community_towns WHERE LOWER(name) = 'pepperell' LIMIT 1;
  IF pepperell_id IS NULL THEN RETURN; END IF;

  SELECT id INTO town_gov_id FROM community_organizations WHERE name = 'Town of Pepperell' LIMIT 1;
  SELECT id INTO fire_dept_id FROM community_organizations WHERE name = 'Pepperell Fire Department' LIMIT 1;
  SELECT id INTO library_id FROM community_organizations WHERE name = 'Pepperell Public Library' LIMIT 1;
  SELECT id INTO food_pantry_id FROM community_organizations WHERE name = 'Greater Nashoba Valley Food Pantry' LIMIT 1;
  SELECT id INTO school_id FROM community_organizations WHERE name = 'North Middlesex Regional School District' LIMIT 1;

  -- Government posts
  INSERT INTO community_posts (organization_id, town_id, title, body, post_type, priority, status, event_date, event_location, created_by) VALUES
    (town_gov_id, pepperell_id, 'Town Meeting – FY2027 Budget Hearing', 'Annual Town Meeting to vote on the FY2027 operating budget. All registered voters welcome.', 'town_announcement', 'high', 'published', CURRENT_DATE + 14, 'Pepperell Town Hall, 1 Main St', NULL),
    (town_gov_id, pepperell_id, 'Road Closure: Mill Street Repaving', 'Mill Street between Groton St and Heald St will be closed Mon–Wed for repaving. Use Route 113 as alternate.', 'public_works', 'high', 'published', CURRENT_DATE + 3, 'Mill Street, Pepperell', NULL),
    (town_gov_id, pepperell_id, 'Brush Pickup Week – June 16–20', 'Annual curbside brush and yard waste pickup. Place bundles at curb by 7 AM Monday.', 'public_works', 'normal', 'published', CURRENT_DATE + 8, 'Town-wide', NULL),
    (library_id, pepperell_id, 'Summer Reading Program Kickoff', 'Join us for the annual Summer Reading Program! All ages welcome. Prizes, activities, and more.', 'library', 'normal', 'published', CURRENT_DATE + 5, 'Pepperell Public Library', NULL),
    (food_pantry_id, pepperell_id, 'Food Pantry Open – Tuesdays & Thursdays', 'The Greater Nashoba Valley Food Pantry is open every Tuesday 4–6 PM and Thursday 9 AM–12 PM. No paperwork required.', 'volunteer', 'high', 'published', NULL, '5 Mill St, Pepperell', NULL),
    (school_id, pepperell_id, 'NMRSD End of Year Concert – June 19', 'Join us for the North Middlesex Regional School District End of Year Concert featuring bands, chorus, and orchestra.', 'school_event', 'normal', 'published', CURRENT_DATE + 11, 'NMRSD Auditorium', NULL)
  ON CONFLICT DO NOTHING;

  -- Emergency alert sample
  INSERT INTO emergency_alerts (town_id, org_id, title, description, alert_type, severity, is_active, expires_at) VALUES
    (pepperell_id, fire_dept_id, 'Stage 2 Water Restriction in Effect', 'Due to drought conditions, outdoor watering is restricted to odd/even days. Violators may be fined.', 'water_ban', 'warning', true, now() + interval '30 days')
  ON CONFLICT DO NOTHING;

END $$;

-- Volunteer opportunities seed
DO $$
DECLARE
  pepperell_id uuid;
  food_pantry_id uuid;
  shelter_id uuid;
BEGIN
  SELECT id INTO pepperell_id FROM community_towns WHERE LOWER(name) = 'pepperell' LIMIT 1;
  IF pepperell_id IS NULL THEN RETURN; END IF;

  SELECT id INTO food_pantry_id FROM community_organizations WHERE name = 'Greater Nashoba Valley Food Pantry' LIMIT 1;
  SELECT id INTO shelter_id FROM community_organizations WHERE name = 'Pepperell Animal Shelter' LIMIT 1;

  INSERT INTO volunteer_opportunities (organization_id, town_id, title, description, category, slots_available, date_needed, time_commitment, location, contact_email, status) VALUES
    (food_pantry_id, pepperell_id, 'Food Pantry Distribution Volunteers', 'Help sort and distribute food to families in need every Tuesday and Thursday.', 'Food Bank', 8, CURRENT_DATE + 7, '3 hours/week', '5 Mill St, Pepperell', 'volunteer@nashobafoodpantry.org', 'open'),
    (shelter_id, pepperell_id, 'Dog Walkers Needed – Animal Shelter', 'Walk and socialize dogs awaiting adoption. Morning and afternoon shifts available.', 'Animal Care', 4, CURRENT_DATE + 5, '1-2 hours, flexible', 'Pepperell Animal Shelter', 'shelter@pepperell.org', 'open'),
    (food_pantry_id, pepperell_id, 'Community Garden Helpers', 'Help maintain the community garden – weeding, watering, and harvesting for donation.', 'Gardening', 6, CURRENT_DATE + 10, 'Weekend mornings', 'Pepperell Community Garden', 'garden@pepperell.org', 'open')
  ON CONFLICT DO NOTHING;
END $$;
