/*
  # Local-Link Profit Network™ System

  1. New Tables
    - `profit_network_businesses`
      - Approved businesses that partners can promote
      - Each business has its own tracking and commission structure
    
    - `profit_network_enrollments`
      - Partner enrollments in specific businesses
      - Unique tracking links per partner per business
      - Ad spend tracking and payback status
    
    - `profit_network_sales`
      - Individual sales tracked from each business
      - Links to partner, business, and commission
    
    - `profit_network_ad_costs`
      - Tracks daily ad spend for each partner enrollment
      - 8-week startup period tracking
      - Payback tracking
    
    - `profit_network_deductions`
      - Tracks all deductions from partner commissions
      - Ad payback, subscription fees, ad costs
    
    - `profit_network_statements`
      - Monthly statements for partners
      - Shows earnings, deductions, net pay

  2. Security
    - RLS enabled on all tables
    - Partners can view their own data
    - Admin can view/manage all data

  3. Features
    - Unique link generation per partner per business
    - Automatic ad cost tracking
    - Payback calculation and tracking
    - Commission calculation with deductions
    - Monthly statement generation
*/

-- Profit Network Businesses
CREATE TABLE IF NOT EXISTS profit_network_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  website_url text NOT NULL,
  logo_url text,
  category text,
  base_commission_rate numeric(5,2) NOT NULL DEFAULT 25.00, -- 25% flat rate
  bonus_commission_rate numeric(5,2) DEFAULT 0.00, -- Optional bonus up to 10%
  bonus_active boolean DEFAULT false,
  bonus_expires_at timestamptz,
  is_active boolean DEFAULT true,
  approval_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profit_network_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active profit network businesses"
  ON profit_network_businesses
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage profit network businesses"
  ON profit_network_businesses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profit Network Enrollments
CREATE TABLE IF NOT EXISTS profit_network_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES profit_network_businesses(id) ON DELETE CASCADE,
  unique_link_code text NOT NULL UNIQUE,
  tracking_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended', 'cancelled')),
  
  -- Ad Cost Tracking
  startup_ad_budget_cents bigint DEFAULT 0, -- 8 weeks * 7 days * $20 = $1,120 * 100 = 112000 cents
  startup_weeks_remaining integer DEFAULT 8,
  startup_start_date timestamptz,
  startup_end_date timestamptz,
  
  -- Payback Tracking
  payback_owed_cents bigint DEFAULT 0,
  payback_paid_cents bigint DEFAULT 0,
  weekly_payback_cents bigint DEFAULT 5000, -- $50 per week default
  payback_complete boolean DEFAULT false,
  
  -- Current Ad Spend Settings
  daily_ad_spend_cents bigint DEFAULT 2000, -- $20 per day default, min $20
  partner_pays_ads boolean DEFAULT false, -- After startup, partner pays from commission
  
  -- Stats
  total_sales bigint DEFAULT 0,
  total_revenue_cents bigint DEFAULT 0,
  total_commission_earned_cents bigint DEFAULT 0,
  total_commission_paid_cents bigint DEFAULT 0,
  
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(partner_id, business_id)
);

ALTER TABLE profit_network_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own enrollments"
  ON profit_network_enrollments
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all enrollments"
  ON profit_network_enrollments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profit Network Sales
CREATE TABLE IF NOT EXISTS profit_network_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES profit_network_enrollments(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES profit_network_businesses(id) ON DELETE CASCADE,
  
  -- Sale Details
  sale_amount_cents bigint NOT NULL,
  product_name text,
  customer_email text,
  order_reference text,
  
  -- Commission
  commission_rate numeric(5,2) NOT NULL,
  bonus_commission_rate numeric(5,2) DEFAULT 0.00,
  total_commission_rate numeric(5,2) NOT NULL,
  commission_amount_cents bigint NOT NULL,
  
  -- Deductions
  ad_cost_deduction_cents bigint DEFAULT 0,
  payback_deduction_cents bigint DEFAULT 0,
  subscription_deduction_cents bigint DEFAULT 0,
  total_deductions_cents bigint DEFAULT 0,
  net_commission_cents bigint NOT NULL,
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'refunded')),
  paid_at timestamptz,
  
  sale_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profit_network_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own sales"
  ON profit_network_sales
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all sales"
  ON profit_network_sales
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profit Network Ad Costs
CREATE TABLE IF NOT EXISTS profit_network_ad_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES profit_network_enrollments(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  
  date date NOT NULL,
  daily_spend_cents bigint NOT NULL,
  is_startup_period boolean DEFAULT true,
  partner_paid boolean DEFAULT false, -- If false, Local-Link covering
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(enrollment_id, date)
);

ALTER TABLE profit_network_ad_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own ad costs"
  ON profit_network_ad_costs
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all ad costs"
  ON profit_network_ad_costs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profit Network Deductions
CREATE TABLE IF NOT EXISTS profit_network_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES profit_network_enrollments(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  sale_id uuid REFERENCES profit_network_sales(id) ON DELETE SET NULL,
  
  deduction_type text NOT NULL CHECK (deduction_type IN ('startup_payback', 'ad_costs', 'subscription', 'other')),
  amount_cents bigint NOT NULL,
  description text,
  week_number integer,
  month_number integer,
  year integer,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profit_network_deductions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own deductions"
  ON profit_network_deductions
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all deductions"
  ON profit_network_deductions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profit Network Monthly Statements
CREATE TABLE IF NOT EXISTS profit_network_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES profit_network_enrollments(id) ON DELETE CASCADE,
  
  month integer NOT NULL,
  year integer NOT NULL,
  
  -- Earnings
  total_sales bigint DEFAULT 0,
  gross_commission_cents bigint DEFAULT 0,
  
  -- Deductions
  startup_payback_cents bigint DEFAULT 0,
  ad_costs_cents bigint DEFAULT 0,
  subscription_cents bigint DEFAULT 0,
  other_deductions_cents bigint DEFAULT 0,
  total_deductions_cents bigint DEFAULT 0,
  
  -- Net
  net_commission_cents bigint DEFAULT 0,
  
  -- Payback Status
  payback_remaining_cents bigint DEFAULT 0,
  payback_progress_percent numeric(5,2) DEFAULT 0.00,
  
  -- Ad Spend Info
  current_daily_ad_spend_cents bigint DEFAULT 0,
  total_ad_spend_month_cents bigint DEFAULT 0,
  
  statement_url text,
  generated_at timestamptz DEFAULT now(),
  
  UNIQUE(partner_id, enrollment_id, month, year)
);

ALTER TABLE profit_network_statements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own statements"
  ON profit_network_statements
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all statements"
  ON profit_network_statements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_partner ON profit_network_enrollments(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_business ON profit_network_enrollments(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_link ON profit_network_enrollments(unique_link_code);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_enrollment ON profit_network_sales(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_partner ON profit_network_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_date ON profit_network_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_enrollment ON profit_network_ad_costs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_date ON profit_network_ad_costs(date);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_enrollment ON profit_network_deductions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_statements_partner ON profit_network_statements(partner_id);

-- Function to generate unique link code
CREATE OR REPLACE FUNCTION generate_profit_network_link_code(
  p_partner_id uuid,
  p_business_id uuid
)
RETURNS text
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_link_code text;
  v_partner_code text;
  v_business_code text;
  v_random_suffix text;
BEGIN
  -- Get partner system_id or create short code
  SELECT COALESCE(system_id, 'P' || SUBSTRING(id::text, 1, 8))
  INTO v_partner_code
  FROM partners
  WHERE id = p_partner_id;
  
  -- Get business short code
  SELECT SUBSTRING(REPLACE(LOWER(name), ' ', ''), 1, 8)
  INTO v_business_code
  FROM profit_network_businesses
  WHERE id = p_business_id;
  
  -- Generate random suffix
  v_random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 6));
  
  -- Combine: PN-{partner}-{business}-{random}
  v_link_code := 'PN-' || v_partner_code || '-' || v_business_code || '-' || v_random_suffix;
  
  RETURN v_link_code;
END;
$$;

-- Function to enroll partner in profit network business
CREATE OR REPLACE FUNCTION enroll_in_profit_network(
  p_partner_id uuid,
  p_business_id uuid
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_link_code text;
  v_tracking_url text;
  v_business_url text;
  v_enrollment_id uuid;
BEGIN
  -- Check if already enrolled
  IF EXISTS (
    SELECT 1 FROM profit_network_enrollments
    WHERE partner_id = p_partner_id AND business_id = p_business_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Already enrolled in this business'
    );
  END IF;
  
  -- Generate unique link code
  v_link_code := generate_profit_network_link_code(p_partner_id, p_business_id);
  
  -- Get business website URL
  SELECT website_url INTO v_business_url
  FROM profit_network_businesses
  WHERE id = p_business_id;
  
  -- Create tracking URL
  v_tracking_url := v_business_url || '?ref=' || v_link_code;
  
  -- Create enrollment
  INSERT INTO profit_network_enrollments (
    partner_id,
    business_id,
    unique_link_code,
    tracking_url,
    status,
    startup_ad_budget_cents,
    startup_weeks_remaining,
    payback_owed_cents
  ) VALUES (
    p_partner_id,
    p_business_id,
    v_link_code,
    v_tracking_url,
    'pending',
    112000, -- 8 weeks * 7 days * $20 = $1,120
    8,
    112000  -- Will need to pay back the $1,120
  )
  RETURNING id INTO v_enrollment_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'enrollment_id', v_enrollment_id,
    'link_code', v_link_code,
    'tracking_url', v_tracking_url
  );
END;
$$;

-- Function to record profit network sale
CREATE OR REPLACE FUNCTION record_profit_network_sale(
  p_link_code text,
  p_sale_amount_cents bigint,
  p_product_name text,
  p_customer_email text DEFAULT NULL,
  p_order_reference text DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_enrollment record;
  v_business record;
  v_commission_cents bigint;
  v_total_rate numeric(5,2);
  v_sale_id uuid;
BEGIN
  -- Get enrollment
  SELECT e.*, p.id as partner_id
  INTO v_enrollment
  FROM profit_network_enrollments e
  JOIN partners p ON p.id = e.partner_id
  WHERE e.unique_link_code = p_link_code AND e.status = 'active';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or inactive link code'
    );
  END IF;
  
  -- Get business with commission rates
  SELECT * INTO v_business
  FROM profit_network_businesses
  WHERE id = v_enrollment.business_id;
  
  -- Calculate commission
  v_total_rate := v_business.base_commission_rate;
  IF v_business.bonus_active AND (v_business.bonus_expires_at IS NULL OR v_business.bonus_expires_at > now()) THEN
    v_total_rate := v_total_rate + v_business.bonus_commission_rate;
  END IF;
  
  v_commission_cents := FLOOR(p_sale_amount_cents * (v_total_rate / 100.0));
  
  -- Create sale record
  INSERT INTO profit_network_sales (
    enrollment_id,
    partner_id,
    business_id,
    sale_amount_cents,
    product_name,
    customer_email,
    order_reference,
    commission_rate,
    bonus_commission_rate,
    total_commission_rate,
    commission_amount_cents,
    net_commission_cents,
    status
  ) VALUES (
    v_enrollment.id,
    v_enrollment.partner_id,
    v_enrollment.business_id,
    p_sale_amount_cents,
    p_product_name,
    p_customer_email,
    p_order_reference,
    v_business.base_commission_rate,
    CASE WHEN v_business.bonus_active THEN v_business.bonus_commission_rate ELSE 0 END,
    v_total_rate,
    v_commission_cents,
    v_commission_cents, -- Will be adjusted for deductions later
    'pending'
  )
  RETURNING id INTO v_sale_id;
  
  -- Update enrollment stats
  UPDATE profit_network_enrollments
  SET
    total_sales = total_sales + 1,
    total_revenue_cents = total_revenue_cents + p_sale_amount_cents,
    total_commission_earned_cents = total_commission_earned_cents + v_commission_cents
  WHERE id = v_enrollment.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'sale_id', v_sale_id,
    'commission_cents', v_commission_cents,
    'commission_rate', v_total_rate
  );
END;
$$;
