/*
  # Business Hub Comprehensive Services Schema
  
  ## Overview
  Adds all Business Hub service tables for the all-in-one business operating system.
  
  ## New Tables Created
  
  1. **crm_migrations** - Done-For-You CRM migration orders ($399-$999)
  2. **ai_bot_setups** - AI bot setup services (Messenger, Website, SMS, Suite)
  3. **swipe_file_access** - Ad Swipe File Library access tracking
  4. **website_orders** - Website design service orders
  5. **lead_list_orders** - Lead list purchases (20¢ per lead)
  6. **appointment_setting_bookings** - Appointment setting service ($15/hr)
  7. **merchant_services_applications** - 0% processing applications
  8. **business_capital_applications** - Business funding applications ($20k-$500k)
  9. **recruiting_services** - Recruiting tool orders
  10. **dashboard_metrics** - Aggregated performance metrics
  
  ## Security
  All tables have RLS enabled with merchant-only access policies
*/

-- CRM Migrations Table
CREATE TABLE IF NOT EXISTS crm_migrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_platform text NOT NULL,
  business_size text NOT NULL CHECK (business_size IN ('small', 'medium', 'large')),
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  migration_data jsonb DEFAULT '{}',
  completion_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Bot Setups Table
CREATE TABLE IF NOT EXISTS ai_bot_setups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bot_type text NOT NULL CHECK (bot_type IN ('messenger', 'website', 'sms', 'suite')),
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'setup', 'active', 'cancelled')),
  bot_config jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{"conversations": 0, "bookings": 0, "response_rate": 0}',
  activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Swipe File Access Table
CREATE TABLE IF NOT EXISTS swipe_file_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  access_type text NOT NULL CHECK (access_type IN ('purchased', 'bundled', 'trial')),
  price_paid numeric DEFAULT 0,
  access_granted_at timestamptz DEFAULT now(),
  access_expires_at timestamptz,
  usage_stats jsonb DEFAULT '{"downloads": 0, "views": 0, "favorites": []}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website Orders Table
CREATE TABLE IF NOT EXISTS website_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  website_type text NOT NULL CHECK (website_type IN ('landing', 'standard', 'complex')),
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'in_design', 'review', 'completed', 'cancelled')),
  requirements jsonb DEFAULT '{}',
  revision_count integer DEFAULT 0,
  website_url text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lead List Orders Table
CREATE TABLE IF NOT EXISTS lead_list_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_count integer NOT NULL,
  price_paid numeric NOT NULL,
  criteria jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'delivered', 'imported_to_crm')),
  delivered_at timestamptz,
  crm_import_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointment Setting Bookings Table
CREATE TABLE IF NOT EXISTS appointment_setting_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hours_booked numeric NOT NULL,
  hours_used numeric DEFAULT 0,
  hourly_rate numeric DEFAULT 15.00,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  appointments_set integer DEFAULT 0,
  conversation_logs jsonb DEFAULT '[]',
  performance_metrics jsonb DEFAULT '{"contact_rate": 0, "booking_rate": 0, "revenue_generated": 0}',
  booking_period_start date NOT NULL DEFAULT CURRENT_DATE,
  booking_period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Merchant Services Applications Table
CREATE TABLE IF NOT EXISTS merchant_services_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_status text NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'declined', 'active')),
  current_processor text,
  monthly_volume numeric,
  estimated_savings numeric,
  terminal_requested boolean DEFAULT false,
  terminal_shipped_at timestamptz,
  approval_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business Capital Applications Table
CREATE TABLE IF NOT EXISTS business_capital_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_amount numeric NOT NULL,
  approved_amount numeric,
  status text NOT NULL DEFAULT 'pre_approved' CHECK (status IN ('pre_approved', 'applied', 'under_review', 'approved', 'declined', 'funded')),
  application_data jsonb DEFAULT '{}',
  documents jsonb DEFAULT '[]',
  offers jsonb DEFAULT '[]',
  approved_at date,
  funded_at date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recruiting Services Table
CREATE TABLE IF NOT EXISTS recruiting_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('resume_writing', 'job_description', 'hiring_funnel', 'onboarding')),
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'in_progress', 'completed')),
  requirements jsonb DEFAULT '{}',
  deliverables jsonb DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Dashboard Metrics Table
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  deals_active integer DEFAULT 0,
  deals_sold integer DEFAULT 0,
  marketplace_revenue numeric DEFAULT 0,
  payouts_pending numeric DEFAULT 0,
  loyalty_subscribers integer DEFAULT 0,
  ai_bot_conversations integer DEFAULT 0,
  appointments_set integer DEFAULT 0,
  leads_delivered integer DEFAULT 0,
  merchant_services_savings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, metric_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant ON crm_migrations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_migrations_status ON crm_migrations(status);
CREATE INDEX IF NOT EXISTS idx_ai_bot_setups_merchant ON ai_bot_setups(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ai_bot_setups_status ON ai_bot_setups(status);
CREATE INDEX IF NOT EXISTS idx_swipe_file_access_merchant ON swipe_file_access(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant ON website_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_status ON website_orders(status);
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant ON lead_list_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_appointment_setting_merchant ON appointment_setting_bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_services_merchant ON merchant_services_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_capital_merchant ON business_capital_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant ON recruiting_services(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_merchant_date ON dashboard_metrics(merchant_id, metric_date DESC);

-- Enable RLS
ALTER TABLE crm_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_bot_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_file_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_list_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_setting_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_services_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_capital_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_migrations
CREATE POLICY "Merchants can view own CRM migrations"
  ON crm_migrations FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create CRM migration orders"
  ON crm_migrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own CRM migrations"
  ON crm_migrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for ai_bot_setups
CREATE POLICY "Merchants can view own AI bot setups"
  ON ai_bot_setups FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create AI bot orders"
  ON ai_bot_setups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own AI bot setups"
  ON ai_bot_setups FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for swipe_file_access
CREATE POLICY "Merchants can view own swipe file access"
  ON swipe_file_access FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create swipe file access"
  ON swipe_file_access FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for website_orders
CREATE POLICY "Merchants can view own website orders"
  ON website_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create website orders"
  ON website_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own website orders"
  ON website_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for lead_list_orders
CREATE POLICY "Merchants can view own lead orders"
  ON lead_list_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create lead orders"
  ON lead_list_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for appointment_setting_bookings
CREATE POLICY "Merchants can view own appointment bookings"
  ON appointment_setting_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create appointment bookings"
  ON appointment_setting_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own appointment bookings"
  ON appointment_setting_bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for merchant_services_applications
CREATE POLICY "Merchants can view own merchant services"
  ON merchant_services_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can apply for merchant services"
  ON merchant_services_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own applications"
  ON merchant_services_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for business_capital_applications
CREATE POLICY "Merchants can view own capital applications"
  ON business_capital_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create capital applications"
  ON business_capital_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own capital applications"
  ON business_capital_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for recruiting_services
CREATE POLICY "Merchants can view own recruiting services"
  ON recruiting_services FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can order recruiting services"
  ON recruiting_services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

-- RLS Policies for dashboard_metrics
CREATE POLICY "Merchants can view own dashboard metrics"
  ON dashboard_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can insert own metrics"
  ON dashboard_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own metrics"
  ON dashboard_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);