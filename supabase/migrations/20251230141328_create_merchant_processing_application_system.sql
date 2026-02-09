/*
  # Create Merchant Processing Application System

  1. New Tables
    - `merchant_applications`
      - Stores complete merchant processing applications (MPA)
      - Includes business info, contacts, ownership, banking, processing details
      - Equipment and pricing structure information
      - Risk assessment and compliance data
    
    - `merchant_application_equipment`
      - Stores equipment selections per application
      - Tracks quantities, pricing, and equipment types

  2. Security
    - Enable RLS on all tables
    - Users can view/edit their own applications
    - Admins (from admin_users table) can view/manage all applications
*/

-- Create merchant applications table
CREATE TABLE IF NOT EXISTS merchant_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number text UNIQUE NOT NULL,
  
  -- Business Information
  legal_business_name text NOT NULL,
  dba_name text,
  business_type text NOT NULL,
  tax_id text NOT NULL,
  business_start_date date,
  industry_category text,
  business_model text,
  
  -- Business Address
  business_address text NOT NULL,
  business_city text NOT NULL,
  business_state text NOT NULL,
  business_zip text NOT NULL,
  business_phone text NOT NULL,
  business_email text NOT NULL,
  website_url text,
  
  -- Primary Contact
  contact_first_name text NOT NULL,
  contact_last_name text NOT NULL,
  contact_title text,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  
  -- Ownership (stored as JSONB array)
  owners jsonb DEFAULT '[]'::jsonb,
  
  -- Banking Information
  bank_name text NOT NULL,
  bank_routing_number text NOT NULL,
  bank_account_number text NOT NULL,
  bank_account_type text NOT NULL,
  
  -- Processing Information
  monthly_volume decimal(12,2),
  average_ticket decimal(10,2),
  highest_ticket decimal(10,2),
  credit_card_sales_percentage integer,
  ecommerce_percentage integer,
  card_present_percentage integer,
  accepts_amex boolean DEFAULT false,
  accepts_discover boolean DEFAULT false,
  accepts_pin_debit boolean DEFAULT false,
  accepts_ebt boolean DEFAULT false,
  
  -- Pricing Structure
  pricing_structure text,
  processor text,
  rate_percentage decimal(5,2),
  transaction_fee decimal(10,2),
  gateway text,
  online_access_fee decimal(10,2),
  upgrade_fee decimal(10,2),
  equipment_total decimal(10,2),
  
  -- Processing History
  years_processing integer,
  current_processor text,
  previous_processor text,
  previous_account_terminated boolean DEFAULT false,
  termination_reason text,
  
  -- Risk Assessment
  is_high_risk boolean DEFAULT false,
  average_chargeback_rate decimal(5,2),
  average_refund_rate decimal(5,2),
  fulfillment_timeframe text,
  delivery_timeframe text,
  recurring_billing boolean DEFAULT false,
  seasonal_business boolean DEFAULT false,
  accepts_international_payments boolean DEFAULT false,
  advance_deposits boolean DEFAULT false,
  inventory_source text,
  delivery_method text,
  
  -- Compliance
  business_license_number text,
  professional_license_number text,
  mcc_code text,
  privacy_policy_url text,
  terms_of_service_url text,
  
  -- Terms & Signature
  terms_accepted boolean DEFAULT false,
  signature_name text,
  signature_date date,
  ip_address text,
  
  -- Status & Admin
  status text DEFAULT 'pending',
  var_info text,
  gateway_info text,
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  
  -- Tracking
  email text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create equipment selections table
CREATE TABLE IF NOT EXISTS merchant_application_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES merchant_applications(id) ON DELETE CASCADE,
  equipment_type text NOT NULL,
  equipment_model text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE merchant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_application_equipment ENABLE ROW LEVEL SECURITY;

-- Policies for merchant_applications (regular users)
CREATE POLICY "Users can view own applications"
  ON merchant_applications FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own applications"
  ON merchant_applications FOR INSERT
  TO authenticated
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own pending applications"
  ON merchant_applications FOR UPDATE
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'pending'
  )
  WITH CHECK (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'pending'
  );

-- Policies for merchant_application_equipment (regular users)
CREATE POLICY "Users can view own equipment selections"
  ON merchant_application_equipment FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_applications
      WHERE merchant_applications.id = merchant_application_equipment.application_id
      AND merchant_applications.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own equipment selections"
  ON merchant_application_equipment FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchant_applications
      WHERE merchant_applications.id = merchant_application_equipment.application_id
      AND merchant_applications.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchant_applications_email ON merchant_applications(email);
CREATE INDEX IF NOT EXISTS idx_merchant_applications_status ON merchant_applications(status);
CREATE INDEX IF NOT EXISTS idx_merchant_applications_application_number ON merchant_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_merchant_applications_is_high_risk ON merchant_applications(is_high_risk);
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id ON merchant_application_equipment(application_id);