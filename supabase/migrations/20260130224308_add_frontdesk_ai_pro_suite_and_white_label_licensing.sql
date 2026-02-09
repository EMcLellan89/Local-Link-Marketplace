/*
  # Add FrontDesk AI Pro Suite and White-Label Licensing System
  
  1. New AI Bot Products - FrontDesk AI Pro Suite
    - 11 vertical-specific AI receptionist products
    - Pricing from $197-$297/month
  
  2. White-Label Licensing System
    - License management for Enterprise+ partners
    - Revenue tracking with hybrid pricing
    - $997/month floor + 30% revenue share above threshold
    - White-label configuration options
  
  3. Security
    - Enable RLS on all new tables
    - Policies for admin and partner access
*/

-- Add new AI bot products for FrontDesk AI Pro Suite
INSERT INTO ai_bot_products (name, slug, description, bot_type, setup_price_cents, features, price_monthly_cents, price_yearly_cents, icon, demo_url, is_active, sort_order) VALUES
(
  'FrontDesk AI Pro - Base Platform',
  'frontdesk_ai_pro',
  'Complete AI receptionist platform for any business. Handles calls, appointments, FAQs, and customer service 24/7 with natural conversation.',
  'voip',
  29700,
  ARRAY['24/7 AI phone answering', 'Appointment scheduling', 'Call routing & transfers', 'Voicemail transcription', 'Custom greetings', 'CRM integration', 'Multi-language support', 'Call analytics'],
  29700,
  297000,
  'phone',
  '',
  true,
  200
),
(
  'CleanDesk AI - Cleaning Services',
  'cleandesk_ai',
  'AI receptionist trained specifically for cleaning companies. Handles estimates, scheduling, and customer questions about services.',
  'voip',
  19700,
  ARRAY['Cleaning service quotes', 'Recurring appointment booking', 'Service area verification', 'Custom pricing by service type', 'Follow-up scheduling', 'Review requests'],
  19700,
  197000,
  'sparkles',
  '',
  true,
  201
),
(
  'VetDesk AI - Veterinary Clinics',
  'vetdesk_ai',
  'Specialized AI for veterinary practices. Handles appointment booking, emergency triage, prescription refills, and pet owner questions.',
  'voip',
  19700,
  ARRAY['Appointment scheduling', 'Emergency assessment', 'Prescription refill requests', 'Pet health questions', 'Vaccination reminders', 'Multi-pet profiles'],
  24700,
  247000,
  'heart',
  '',
  true,
  202
),
(
  'HomeDesk AI - Home Services',
  'homedesk_ai',
  'Perfect for plumbers, electricians, HVAC, and contractors. Books jobs, provides quotes, and handles emergency calls.',
  'voip',
  19700,
  ARRAY['Emergency job routing', 'Service estimates', 'Technician availability', 'Warranty questions', 'Parts ordering', 'Follow-up scheduling'],
  19700,
  197000,
  'home',
  '',
  true,
  203
),
(
  'RepairDesk AI - Repair Shops',
  'repairdesk_ai',
  'Built for auto repair, phone repair, appliance repair, and more. Handles diagnostic questions, quotes, and service tracking.',
  'voip',
  19700,
  ARRAY['Repair estimates', 'Diagnostic questions', 'Parts availability', 'Service status updates', 'Warranty verification', 'Pickup notifications'],
  19700,
  197000,
  'wrench',
  '',
  true,
  204
),
(
  'FitnessDesk AI - Gyms & Fitness',
  'fitnessdesk_ai',
  'AI receptionist for gyms, yoga studios, and fitness centers. Handles class bookings, membership questions, and facility info.',
  'voip',
  19700,
  ARRAY['Class scheduling', 'Membership inquiries', 'Personal training booking', 'Facility hours', 'Equipment questions', 'Trial class booking'],
  19700,
  197000,
  'dumbbell',
  '',
  true,
  205
),
(
  'BeautyDesk AI - Salons & Spas',
  'beautydesk_ai',
  'Perfect for hair salons, nail salons, spas, and barbershops. Books appointments, answers service questions, and handles rescheduling.',
  'voip',
  19700,
  ARRAY['Service booking', 'Stylist availability', 'Pricing information', 'Package deals', 'Product questions', 'Cancellation handling'],
  19700,
  197000,
  'scissors',
  '',
  true,
  206
),
(
  'FoodDesk AI - Restaurants',
  'fooddesk_ai',
  'AI phone system for restaurants. Takes reservations, answers menu questions, and handles takeout orders.',
  'voip',
  19700,
  ARRAY['Table reservations', 'Menu questions', 'Dietary restrictions', 'Special events', 'Hours & location', 'Waitlist management'],
  19700,
  197000,
  'utensils',
  '',
  true,
  207
),
(
  'HealthDesk AI - Healthcare',
  'healthdesk_ai',
  'HIPAA-compliant AI for medical offices. Handles appointment scheduling, insurance questions, and patient inquiries.',
  'voip',
  24700,
  ARRAY['Appointment booking', 'Insurance verification', 'Prescription refills', 'Test results inquiries', 'Referral coordination', 'HIPAA compliant'],
  24700,
  247000,
  'stethoscope',
  '',
  true,
  208
),
(
  'LegalDesk AI - Law Firms',
  'legaldesk_ai',
  'AI receptionist for law firms. Screens potential clients, schedules consultations, and provides basic firm information.',
  'voip',
  29700,
  ARRAY['Client intake screening', 'Consultation booking', 'Practice area routing', 'Confidential handling', 'Retainer information', 'Case type qualification'],
  29700,
  297000,
  'gavel',
  '',
  true,
  209
),
(
  'RealDesk AI - Real Estate',
  'realdesk_ai',
  'AI assistant for real estate agents and brokerages. Qualifies leads, schedules showings, and answers property questions.',
  'voip',
  24700,
  ARRAY['Showing scheduling', 'Lead qualification', 'Property information', 'Mortgage pre-qualification', 'Open house booking', 'Agent availability'],
  24700,
  247000,
  'building',
  '',
  true,
  210
)
ON CONFLICT (slug) DO NOTHING;

-- Create white_label_licenses table
CREATE TABLE IF NOT EXISTS white_label_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  vertical_name text NOT NULL,
  vertical_product_id uuid REFERENCES ai_bot_products(id),
  license_status text NOT NULL DEFAULT 'active' CHECK (license_status IN ('active', 'suspended', 'cancelled')),
  
  -- Pricing
  monthly_license_fee_cents integer NOT NULL DEFAULT 99700, -- $997/month
  revenue_share_percentage decimal NOT NULL DEFAULT 30.0, -- 30%
  revenue_threshold_cents integer NOT NULL DEFAULT 99700, -- $997 threshold
  
  -- White-label settings
  white_label_enabled boolean DEFAULT false,
  custom_logo_url text,
  custom_domain text,
  custom_brand_colors jsonb,
  
  -- Tracking
  current_month_revenue_cents integer DEFAULT 0,
  current_month_profit_cents integer DEFAULT 0,
  revenue_share_owed_cents integer DEFAULT 0,
  last_invoice_date timestamptz,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_white_label_licenses_partner ON white_label_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_white_label_licenses_status ON white_label_licenses(license_status);
CREATE INDEX IF NOT EXISTS idx_white_label_licenses_vertical ON white_label_licenses(vertical_product_id);

-- Create white_label_revenue_tracking table
CREATE TABLE IF NOT EXISTS white_label_revenue_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid NOT NULL REFERENCES white_label_licenses(id) ON DELETE CASCADE,
  
  -- Revenue data
  month_year text NOT NULL, -- Format: YYYY-MM
  total_revenue_cents integer NOT NULL DEFAULT 0,
  total_refunds_cents integer NOT NULL DEFAULT 0,
  net_revenue_cents integer NOT NULL DEFAULT 0,
  profit_above_threshold_cents integer DEFAULT 0,
  revenue_share_owed_cents integer DEFAULT 0,
  
  -- Invoice tracking
  license_fee_invoice_id text,
  revenue_share_invoice_id text,
  license_fee_paid boolean DEFAULT false,
  revenue_share_paid boolean DEFAULT false,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(license_id, month_year)
);

CREATE INDEX IF NOT EXISTS idx_white_label_revenue_license ON white_label_revenue_tracking(license_id);
CREATE INDEX IF NOT EXISTS idx_white_label_revenue_month ON white_label_revenue_tracking(month_year);
CREATE INDEX IF NOT EXISTS idx_white_label_revenue_unpaid ON white_label_revenue_tracking(license_fee_paid, revenue_share_paid);

-- Create white_label_eligible_products table
CREATE TABLE IF NOT EXISTS white_label_eligible_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES ai_bot_products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  is_eligible boolean DEFAULT false,
  minimum_tier text NOT NULL DEFAULT 'enterprise_plus',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(product_id)
);

-- Mark FrontDesk AI Pro products as white-label eligible
INSERT INTO white_label_eligible_products (product_id, product_name, is_eligible, minimum_tier, notes)
SELECT 
  id,
  name,
  true,
  'enterprise_plus',
  'Vertical-specific AI receptionist - white-label enabled for Enterprise+ partners'
FROM ai_bot_products
WHERE slug IN (
  'cleandesk_ai', 'vetdesk_ai', 'homedesk_ai', 'repairdesk_ai',
  'fitnessdesk_ai', 'beautydesk_ai', 'fooddesk_ai', 'healthdesk_ai',
  'legaldesk_ai', 'realdesk_ai'
)
ON CONFLICT (product_id) DO NOTHING;

-- Enable RLS
ALTER TABLE white_label_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_eligible_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for white_label_licenses
CREATE POLICY "Partners can view own licenses"
  ON white_label_licenses FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all licenses"
  ON white_label_licenses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for white_label_revenue_tracking
CREATE POLICY "Partners can view own revenue tracking"
  ON white_label_revenue_tracking FOR SELECT
  TO authenticated
  USING (
    license_id IN (
      SELECT id FROM white_label_licenses
      WHERE partner_id IN (
        SELECT id FROM partners WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all revenue tracking"
  ON white_label_revenue_tracking FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for white_label_eligible_products
CREATE POLICY "Anyone can view eligible products"
  ON white_label_eligible_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage eligible products"
  ON white_label_eligible_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to calculate revenue share
CREATE OR REPLACE FUNCTION calculate_revenue_share(
  license_id_param uuid,
  month_year_param text
) RETURNS TABLE (
  license_fee_cents integer,
  revenue_share_cents integer,
  total_owed_cents integer
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_license white_label_licenses%ROWTYPE;
  v_revenue white_label_revenue_tracking%ROWTYPE;
  v_profit_above_threshold integer;
  v_revenue_share integer;
BEGIN
  SELECT * INTO v_license FROM white_label_licenses WHERE id = license_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'License not found';
  END IF;
  
  SELECT * INTO v_revenue 
  FROM white_label_revenue_tracking 
  WHERE license_id = license_id_param AND month_year = month_year_param;
  
  v_profit_above_threshold := GREATEST(0, COALESCE(v_revenue.net_revenue_cents, 0) - v_license.revenue_threshold_cents);
  v_revenue_share := FLOOR(v_profit_above_threshold * (v_license.revenue_share_percentage / 100.0));
  
  RETURN QUERY SELECT
    v_license.monthly_license_fee_cents,
    v_revenue_share,
    v_license.monthly_license_fee_cents + v_revenue_share;
END;
$$;
