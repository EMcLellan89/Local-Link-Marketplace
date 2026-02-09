/*
  # Comprehensive Accounting System

  1. New Tables
    - accounting_tax_obligations - Track federal and state tax obligations
    - accounting_tax_payments - Track tax payments made
    - accounting_partner_1099_data - Partner commission tracking for 1099s
    - accounting_employees - Employee records
    - accounting_employee_payroll - Payroll history
    - accounting_accountant_users - Accountant access accounts
    
  2. Features
    - Federal and state tax tracking
    - Quarterly tax calculations
    - Partner 1099 generation
    - Employee payroll management (hourly, weekly, or % of sales)
    - Accountant read-only access
    - Payment link generation
    
  3. Security
    - RLS enabled on all tables
    - Admin-only write access
    - Accountant read-only access
    - Strict data isolation
*/

-- Add accountant role to user_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'accountant'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'accountant';
  END IF;
END $$;

-- Accounting Tax Obligations Table
CREATE TABLE IF NOT EXISTS accounting_tax_obligations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_type text NOT NULL,
  tax_authority text NOT NULL,
  tax_period text NOT NULL,
  quarter integer,
  year integer NOT NULL,
  due_date date NOT NULL,
  estimated_amount_cents bigint DEFAULT 0,
  actual_amount_cents bigint,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accounting Tax Payments Table
CREATE TABLE IF NOT EXISTS accounting_tax_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id uuid REFERENCES accounting_tax_obligations(id) ON DELETE CASCADE,
  payment_date date NOT NULL,
  amount_cents bigint NOT NULL,
  payment_method text,
  confirmation_number text,
  payment_link text,
  notes text,
  created_by_admin_id text,
  created_at timestamptz DEFAULT now()
);

-- Partner 1099 Data Tracking
CREATE TABLE IF NOT EXISTS accounting_partner_1099_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  tax_year integer NOT NULL,
  total_commissions_cents bigint DEFAULT 0,
  total_bonuses_cents bigint DEFAULT 0,
  total_adjustments_cents bigint DEFAULT 0,
  total_1099_amount_cents bigint GENERATED ALWAYS AS (total_commissions_cents + total_bonuses_cents + total_adjustments_cents) STORED,
  form_generated boolean DEFAULT false,
  form_sent_date date,
  partner_ein text,
  partner_ssn_last4 text,
  partner_address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, tax_year)
);

-- Employee Records
CREATE TABLE IF NOT EXISTS accounting_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  hire_date date NOT NULL,
  termination_date date,
  employment_status text DEFAULT 'active',
  payment_type text NOT NULL,
  hourly_rate_cents bigint,
  weekly_rate_cents bigint,
  sales_commission_percent numeric(5,2),
  ssn_last4 text,
  tax_filing_status text,
  w4_allowances integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employee Payroll History
CREATE TABLE IF NOT EXISTS accounting_employee_payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES accounting_employees(id) ON DELETE CASCADE NOT NULL,
  pay_period_start date NOT NULL,
  pay_period_end date NOT NULL,
  payment_date date NOT NULL,
  hours_worked numeric(10,2),
  total_sales_cents bigint,
  gross_pay_cents bigint NOT NULL,
  federal_tax_cents bigint DEFAULT 0,
  state_tax_cents bigint DEFAULT 0,
  social_security_cents bigint DEFAULT 0,
  medicare_cents bigint DEFAULT 0,
  other_deductions_cents bigint DEFAULT 0,
  net_pay_cents bigint NOT NULL,
  payment_method text,
  payment_status text DEFAULT 'pending',
  notes text,
  created_by_admin_id text,
  created_at timestamptz DEFAULT now()
);

-- Accountant Users Table
CREATE TABLE IF NOT EXISTS accounting_accountant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  firm_name text,
  phone text,
  access_level text DEFAULT 'read_only',
  can_view_payroll boolean DEFAULT true,
  can_view_taxes boolean DEFAULT true,
  can_view_1099s boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_by_admin_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounting_tax_obligations_year ON accounting_tax_obligations(year, quarter);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_obligations_status ON accounting_tax_obligations(status);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_obligations_due_date ON accounting_tax_obligations(due_date);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_payments_obligation ON accounting_tax_payments(obligation_id);
CREATE INDEX IF NOT EXISTS idx_accounting_partner_1099_partner ON accounting_partner_1099_data(partner_id);
CREATE INDEX IF NOT EXISTS idx_accounting_partner_1099_year ON accounting_partner_1099_data(tax_year);
CREATE INDEX IF NOT EXISTS idx_accounting_employees_status ON accounting_employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_employee ON accounting_employee_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_date ON accounting_employee_payroll(payment_date);
CREATE INDEX IF NOT EXISTS idx_accounting_accountant_users_active ON accounting_accountant_users(is_active);

-- Enable RLS
ALTER TABLE accounting_tax_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_tax_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_partner_1099_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_employee_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_accountant_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin
CREATE POLICY "Admins can manage tax obligations"
  ON accounting_tax_obligations FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage tax payments"
  ON accounting_tax_payments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage partner 1099 data"
  ON accounting_partner_1099_data FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage employees"
  ON accounting_employees FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage payroll"
  ON accounting_employee_payroll FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage accountant users"
  ON accounting_accountant_users FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for Accountants (Read-Only)
CREATE POLICY "Accountants can view tax obligations"
  ON accounting_tax_obligations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = auth.uid() AND is_active = true AND can_view_taxes = true
    )
  );

CREATE POLICY "Accountants can view tax payments"
  ON accounting_tax_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = auth.uid() AND is_active = true AND can_view_taxes = true
    )
  );

CREATE POLICY "Accountants can view partner 1099 data"
  ON accounting_partner_1099_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = auth.uid() AND is_active = true AND can_view_1099s = true
    )
  );

CREATE POLICY "Accountants can view employees"
  ON accounting_employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Accountants can view payroll"
  ON accounting_employee_payroll FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = auth.uid() AND is_active = true AND can_view_payroll = true
    )
  );

-- Function to sync partner commissions to 1099 data
CREATE OR REPLACE FUNCTION sync_partner_commissions_to_1099(
  p_partner_id uuid,
  p_tax_year integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_commissions bigint;
BEGIN
  SELECT COALESCE(SUM(commission_amount_cents), 0)
  INTO v_total_commissions
  FROM marketplace_affiliate_commissions
  WHERE affiliate_partner_id = p_partner_id
    AND status = 'approved'
    AND EXTRACT(YEAR FROM created_at) = p_tax_year;

  INSERT INTO accounting_partner_1099_data (
    partner_id,
    tax_year,
    total_commissions_cents
  ) VALUES (
    p_partner_id,
    p_tax_year,
    v_total_commissions
  )
  ON CONFLICT (partner_id, tax_year) DO UPDATE SET
    total_commissions_cents = EXCLUDED.total_commissions_cents,
    updated_at = now();
END;
$$;

-- Function to calculate quarterly taxes
CREATE OR REPLACE FUNCTION calculate_quarterly_taxes(
  p_year integer,
  p_quarter integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_revenue bigint;
  v_federal_tax bigint;
  v_state_tax bigint;
  v_quarter_start date;
  v_quarter_end date;
BEGIN
  CASE p_quarter
    WHEN 1 THEN
      v_quarter_start := make_date(p_year, 1, 1);
      v_quarter_end := make_date(p_year, 3, 31);
    WHEN 2 THEN
      v_quarter_start := make_date(p_year, 4, 1);
      v_quarter_end := make_date(p_year, 6, 30);
    WHEN 3 THEN
      v_quarter_start := make_date(p_year, 7, 1);
      v_quarter_end := make_date(p_year, 9, 30);
    WHEN 4 THEN
      v_quarter_start := make_date(p_year, 10, 1);
      v_quarter_end := make_date(p_year, 12, 31);
  END CASE;

  SELECT COALESCE(SUM(total_amount_cents), 0)
  INTO v_total_revenue
  FROM purchases
  WHERE created_at BETWEEN v_quarter_start AND v_quarter_end;

  v_federal_tax := (v_total_revenue * 21) / 100;
  v_state_tax := (v_total_revenue * 7) / 100;

  v_result := jsonb_build_object(
    'quarter', p_quarter,
    'year', p_year,
    'total_revenue_cents', v_total_revenue,
    'federal_tax_cents', v_federal_tax,
    'state_tax_cents', v_state_tax,
    'total_tax_cents', v_federal_tax + v_state_tax,
    'quarter_start', v_quarter_start,
    'quarter_end', v_quarter_end
  );

  RETURN v_result;
END;
$$;

-- Function to get accounting dashboard stats
CREATE OR REPLACE FUNCTION get_accounting_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_pending_tax_obligations integer;
  v_total_tax_due_cents bigint;
  v_active_employees integer;
  v_partners_for_1099 integer;
  v_ytd_payroll_cents bigint;
BEGIN
  SELECT COUNT(*) INTO v_pending_tax_obligations
  FROM accounting_tax_obligations
  WHERE status = 'pending' AND due_date >= CURRENT_DATE;

  SELECT COALESCE(SUM(estimated_amount_cents), 0) INTO v_total_tax_due_cents
  FROM accounting_tax_obligations
  WHERE status = 'pending';

  SELECT COUNT(*) INTO v_active_employees
  FROM accounting_employees
  WHERE employment_status = 'active';

  SELECT COUNT(*) INTO v_partners_for_1099
  FROM accounting_partner_1099_data
  WHERE tax_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND total_1099_amount_cents >= 60000;

  SELECT COALESCE(SUM(gross_pay_cents), 0) INTO v_ytd_payroll_cents
  FROM accounting_employee_payroll
  WHERE EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE);

  v_result := jsonb_build_object(
    'pending_tax_obligations', v_pending_tax_obligations,
    'total_tax_due_cents', v_total_tax_due_cents,
    'active_employees', v_active_employees,
    'partners_for_1099', v_partners_for_1099,
    'ytd_payroll_cents', v_ytd_payroll_cents
  );

  RETURN v_result;
END;
$$;
