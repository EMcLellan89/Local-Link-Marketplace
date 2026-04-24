/*
  # International Contractors Payroll System

  ## Purpose
  Manages payments to overseas contractors (primarily Philippines-based) who are
  NOT US employees, NOT 1099 recipients. These are international freelancers/contractors
  paid via wire transfer, Wise, PayPal, GCash, etc. Payments are deductible as a business expense.

  ## New Tables

  ### `intl_contractors`
  Profile, country, payment method, hourly/monthly rate, status.

  ### `intl_contractor_pay_periods`
  A pay run/batch (weekly, bi-weekly, monthly) with approval + payment tracking.

  ### `intl_contractor_payments`
  Individual payment line items within a pay period per contractor.

  ### `intl_contractor_time_logs`
  Optional hour-tracking per contractor per day.

  ## Security
  - RLS enabled on all tables
  - Admin-only access (profiles.id = auth.uid() AND role = 'admin')

  ## Notes
  - No 1099 generated (non-US contractors)
  - Payments recorded as business expenses (tax deductible)
  - Multi-currency support via exchange_rate field
*/

-- Contractors master list
CREATE TABLE IF NOT EXISTS intl_contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL DEFAULT 'Philippines',
  timezone text NOT NULL DEFAULT 'Asia/Manila',
  role text NOT NULL,
  specialties text[] DEFAULT '{}',
  hourly_rate_cents integer,
  monthly_rate_cents integer,
  currency text NOT NULL DEFAULT 'PHP',
  payment_method text NOT NULL DEFAULT 'wise' CHECK (payment_method IN ('wise', 'paypal', 'bank_wire', 'gcash', 'remitly', 'western_union', 'other')),
  payment_details jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  start_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pay period batches
CREATE TABLE IF NOT EXISTS intl_contractor_pay_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_label text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'custom')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid', 'cancelled')),
  total_amount_usd_cents bigint DEFAULT 0,
  contractor_count integer DEFAULT 0,
  notes text,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual payment line items
CREATE TABLE IF NOT EXISTS intl_contractor_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid NOT NULL REFERENCES intl_contractors(id) ON DELETE CASCADE,
  pay_period_id uuid NOT NULL REFERENCES intl_contractor_pay_periods(id) ON DELETE CASCADE,
  hours_worked numeric(6,2),
  amount_usd_cents bigint NOT NULL DEFAULT 0,
  local_currency_amount numeric(12,2),
  local_currency text,
  exchange_rate numeric(10,6),
  payment_method_used text,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'failed')),
  notes text,
  sent_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(contractor_id, pay_period_id)
);

-- Time logs (optional per-day hour tracking)
CREATE TABLE IF NOT EXISTS intl_contractor_time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid NOT NULL REFERENCES intl_contractors(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  hours_worked numeric(5,2) NOT NULL DEFAULT 0 CHECK (hours_worked >= 0 AND hours_worked <= 24),
  task_description text,
  project text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intl_contractors_status ON intl_contractors(status);
CREATE INDEX IF NOT EXISTS idx_intl_contractors_country ON intl_contractors(country);
CREATE INDEX IF NOT EXISTS idx_intl_pay_periods_status ON intl_contractor_pay_periods(status);
CREATE INDEX IF NOT EXISTS idx_intl_pay_periods_dates ON intl_contractor_pay_periods(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_intl_payments_contractor ON intl_contractor_payments(contractor_id);
CREATE INDEX IF NOT EXISTS idx_intl_payments_period ON intl_contractor_payments(pay_period_id);
CREATE INDEX IF NOT EXISTS idx_intl_payments_status ON intl_contractor_payments(status);
CREATE INDEX IF NOT EXISTS idx_intl_time_logs_contractor ON intl_contractor_time_logs(contractor_id);
CREATE INDEX IF NOT EXISTS idx_intl_time_logs_date ON intl_contractor_time_logs(log_date);

-- Enable RLS
ALTER TABLE intl_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE intl_contractor_pay_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE intl_contractor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intl_contractor_time_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only RLS policies
CREATE POLICY "Admins can manage contractors"
  ON intl_contractors FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage pay periods"
  ON intl_contractor_pay_periods FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage contractor payments"
  ON intl_contractor_payments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage time logs"
  ON intl_contractor_time_logs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Seed sample contractors
INSERT INTO intl_contractors (full_name, email, country, timezone, role, specialties, hourly_rate_cents, currency, payment_method, status, start_date)
VALUES
  ('Maria Santos', 'maria.santos@example.com', 'Philippines', 'Asia/Manila', 'Virtual Assistant', ARRAY['Customer Support', 'Data Entry', 'Email Management'], 500, 'PHP', 'wise', 'active', '2025-06-01'),
  ('Jose Reyes', 'jose.reyes@example.com', 'Philippines', 'Asia/Manila', 'Graphic Designer', ARRAY['Social Media Graphics', 'Flyer Design', 'Branding'], 800, 'PHP', 'gcash', 'active', '2025-08-15'),
  ('Ana Cruz', 'ana.cruz@example.com', 'Philippines', 'Asia/Manila', 'Content Writer', ARRAY['Blog Posts', 'SEO Content', 'Copywriting'], 700, 'PHP', 'paypal', 'active', '2025-09-01'),
  ('Carlo Mendoza', 'carlo.mendoza@example.com', 'Philippines', 'Asia/Manila', 'Video Editor', ARRAY['Short-Form Video', 'YouTube Editing', 'Reels'], 1000, 'PHP', 'wise', 'active', '2025-10-01')
ON CONFLICT DO NOTHING;
