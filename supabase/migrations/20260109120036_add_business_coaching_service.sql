/*
  # Business Coaching Service System

  1. New Tables
    - `business_coaching_packages`
      - Different coaching packages with pricing
      - One-time sessions, monthly packages, etc.
    - `business_coaching_bookings`
      - Track coaching session bookings
      - Merchant or Partner can book sessions
    - `business_coaching_sessions`
      - Track actual coaching sessions held
      - Notes and outcomes

  2. Security
    - Enable RLS on all tables
    - Users can view own bookings and sessions
    - Admin/Internal team can view all

  3. Pricing Structure
    - Single Session: $297
    - 4-Session Package: $997 (monthly)
    - 12-Session Package: $2,497 (quarterly)
    - Startup Launch Package: $4,997
*/

-- Business Coaching Packages
CREATE TABLE IF NOT EXISTS business_coaching_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  session_count integer NOT NULL,
  duration_weeks integer,
  price_cents integer NOT NULL,
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Business Coaching Bookings
CREATE TABLE IF NOT EXISTS business_coaching_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('merchant', 'partner')),
  entity_id uuid NOT NULL,
  package_id uuid REFERENCES business_coaching_packages(id),
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  sessions_remaining integer DEFAULT 0,
  sessions_completed integer DEFAULT 0,
  
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_amount_cents integer,
  stripe_payment_id text,
  
  start_date timestamptz,
  end_date timestamptz,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business Coaching Sessions
CREATE TABLE IF NOT EXISTS business_coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES business_coaching_bookings(id) ON DELETE CASCADE,
  
  session_number integer NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  
  session_type text CHECK (session_type IN ('strategy', 'problem_solving', 'planning', 'review', 'startup_guidance')),
  topics_covered text[],
  coach_notes text,
  action_items text[],
  
  meeting_link text,
  recording_link text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_entity ON business_coaching_bookings(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_status ON business_coaching_bookings(status);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_booking ON business_coaching_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_scheduled ON business_coaching_sessions(scheduled_at);

-- RLS Policies
ALTER TABLE business_coaching_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_coaching_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Packages: Anyone can view active packages
CREATE POLICY "Anyone can view active coaching packages"
  ON business_coaching_packages FOR SELECT
  USING (is_active = true);

-- Bookings: Merchants can manage own
CREATE POLICY "Merchants can view own coaching bookings"
  ON business_coaching_bookings FOR SELECT
  TO authenticated
  USING (
    entity_type = 'merchant' AND
    entity_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own coaching bookings"
  ON business_coaching_bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    entity_type = 'merchant' AND
    entity_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Bookings: Partners can manage own
CREATE POLICY "Partners can view own coaching bookings"
  ON business_coaching_bookings FOR SELECT
  TO authenticated
  USING (
    entity_type = 'partner' AND
    entity_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can insert own coaching bookings"
  ON business_coaching_bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    entity_type = 'partner' AND
    entity_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Bookings: Internal team can view all
CREATE POLICY "Internal team can view all coaching bookings"
  ON business_coaching_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Sessions: Users can view own sessions
CREATE POLICY "Users can view own coaching sessions"
  ON business_coaching_sessions FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM business_coaching_bookings
      WHERE (
        entity_type = 'merchant' AND
        entity_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
      ) OR (
        entity_type = 'partner' AND
        entity_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
      )
    )
  );

-- Sessions: Internal team can view all
CREATE POLICY "Internal team can view all coaching sessions"
  ON business_coaching_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Seed Business Coaching Packages
INSERT INTO business_coaching_packages (name, description, session_count, duration_weeks, price_cents, features)
VALUES
  (
    'Single Strategy Session',
    'One-on-one 60-minute coaching session to tackle your most pressing business challenge',
    1,
    1,
    29700,
    '[
      "60-minute private consultation",
      "Personalized business assessment",
      "Actionable strategy recommendations",
      "Follow-up action plan document",
      "Email support for 7 days post-session"
    ]'::jsonb
  ),
  (
    'Monthly Growth Package',
    'Four weekly coaching sessions to build momentum and drive consistent growth',
    4,
    4,
    99700,
    '[
      "4 weekly 60-minute sessions",
      "Comprehensive business analysis",
      "Custom growth strategy development",
      "Weekly accountability check-ins",
      "Unlimited email support",
      "Access to business planning templates",
      "Progress tracking dashboard"
    ]'::jsonb
  ),
  (
    'Quarterly Transformation',
    'Twelve sessions over 12 weeks for complete business transformation',
    12,
    12,
    249700,
    '[
      "12 weekly 60-minute sessions",
      "Complete business audit and analysis",
      "Custom strategic business plan",
      "Marketing and sales optimization",
      "Financial planning and forecasting",
      "Operations streamlining",
      "Leadership development",
      "Unlimited email and text support",
      "Access to all business resources",
      "Quarterly business review"
    ]'::jsonb
  ),
  (
    'Startup Launch Package',
    'Comprehensive support for launching or pivoting your business',
    16,
    16,
    499700,
    '[
      "16 weekly 90-minute intensive sessions",
      "Complete business model development",
      "Market research and competitive analysis",
      "Business plan creation",
      "Financial projections and funding strategy",
      "Marketing and branding strategy",
      "Launch roadmap and timeline",
      "Vendor and partner identification",
      "Legal and compliance guidance",
      "Team building and hiring strategy",
      "First 90-day action plan",
      "Unlimited support via email, phone, and text",
      "6-month post-launch support"
    ]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Function to create coaching booking
CREATE OR REPLACE FUNCTION create_business_coaching_booking(
  p_entity_type text,
  p_entity_id uuid,
  p_package_id uuid,
  p_payment_amount_cents integer,
  p_stripe_payment_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id uuid;
  v_session_count integer;
  v_duration_weeks integer;
BEGIN
  -- Get package details
  SELECT session_count, duration_weeks INTO v_session_count, v_duration_weeks
  FROM business_coaching_packages
  WHERE id = p_package_id;

  -- Create booking
  INSERT INTO business_coaching_bookings (
    entity_type,
    entity_id,
    package_id,
    status,
    sessions_remaining,
    sessions_completed,
    payment_status,
    payment_amount_cents,
    stripe_payment_id,
    start_date,
    end_date
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_package_id,
    'active',
    v_session_count,
    0,
    'paid',
    p_payment_amount_cents,
    p_stripe_payment_id,
    now(),
    now() + (v_duration_weeks || ' weeks')::interval
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$;