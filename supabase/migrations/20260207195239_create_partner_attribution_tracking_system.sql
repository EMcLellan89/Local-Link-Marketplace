/*
  # Partner Attribution and External Sales Tracking System

  1. Purpose
    - Track sales from external businesses with partner slug IDs
    - Show sales in business dashboards
    - Show commission owed in admin CRM
    - Push sales to partner CRM with running totals

  2. New Tables
    - `external_business_sales` - Sales from external businesses
    - `partner_sales_dashboard` - Aggregated partner sales view

  3. Views
    - `partner_weekly_sales` - Week-to-date sales by partner
    - `partner_monthly_sales` - Month-to-date sales by partner
    - `partner_yearly_sales` - Year-to-date sales by partner
*/

-- External business sales (from Gemini, LocalPawsPassport, MyBudgetBuster, etc.)
CREATE TABLE IF NOT EXISTS external_business_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Business identification
  business_id text NOT NULL, -- 'gemini', 'localpawspassport', 'mybudgetbuster', etc.
  business_name text NOT NULL,
  
  -- Sale details
  external_order_id text NOT NULL, -- Order ID from external system
  sale_date timestamptz NOT NULL DEFAULT now(),
  
  -- Product/service sold
  product_sku text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  
  -- Amounts
  sale_amount_cents integer NOT NULL CHECK (sale_amount_cents >= 0),
  cost_amount_cents integer NOT NULL DEFAULT 0 CHECK (cost_amount_cents >= 0),
  profit_cents integer GENERATED ALWAYS AS (sale_amount_cents - cost_amount_cents) STORED,
  
  -- Partner attribution
  partner_slug text NOT NULL, -- Partner ID/slug from sale
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  
  -- Commission calculation
  commission_type text NOT NULL DEFAULT 'tier' CHECK (commission_type IN ('tier', 'flat_rate', 'profit_based', 'recurring_tier', 'none')),
  commission_rate_bps integer CHECK (commission_rate_bps >= 0 AND commission_rate_bps <= 10000),
  commission_amount_cents integer NOT NULL DEFAULT 0 CHECK (commission_amount_cents >= 0),
  commission_status text NOT NULL DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'void')),
  
  -- Metadata
  sale_metadata jsonb DEFAULT '{}'::jsonb,
  webhook_received_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate sales from same business
  UNIQUE (business_id, external_order_id)
);

-- Partner sales dashboard (real-time aggregation)
CREATE TABLE IF NOT EXISTS partner_sales_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Time periods
  week_start date NOT NULL,
  week_end date NOT NULL,
  month_start date NOT NULL,
  year_start date NOT NULL,
  
  -- Week totals
  week_sales_count integer NOT NULL DEFAULT 0,
  week_sales_amount_cents integer NOT NULL DEFAULT 0,
  week_commission_cents integer NOT NULL DEFAULT 0,
  
  -- Month totals
  month_sales_count integer NOT NULL DEFAULT 0,
  month_sales_amount_cents integer NOT NULL DEFAULT 0,
  month_commission_cents integer NOT NULL DEFAULT 0,
  
  -- Year totals
  year_sales_count integer NOT NULL DEFAULT 0,
  year_sales_amount_cents integer NOT NULL DEFAULT 0,
  year_commission_cents integer NOT NULL DEFAULT 0,
  
  -- Lifetime totals
  lifetime_sales_count integer NOT NULL DEFAULT 0,
  lifetime_sales_amount_cents integer NOT NULL DEFAULT 0,
  lifetime_commission_cents integer NOT NULL DEFAULT 0,
  
  last_sale_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE (partner_id, week_start)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_external_sales_business ON external_business_sales(business_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_partner ON external_business_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_slug ON external_business_sales(partner_slug);
CREATE INDEX IF NOT EXISTS idx_external_sales_date ON external_business_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_external_sales_status ON external_business_sales(commission_status);
CREATE INDEX IF NOT EXISTS idx_partner_dashboard_week ON partner_sales_dashboard(week_start);
CREATE INDEX IF NOT EXISTS idx_partner_dashboard_partner ON partner_sales_dashboard(partner_id);

-- Enable RLS
ALTER TABLE external_business_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_sales_dashboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access to external sales"
  ON external_business_sales FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Partners can view their own external sales"
  ON external_business_sales FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = auth.uid()
      AND partners.id = external_business_sales.partner_id
    )
  );

CREATE POLICY "Admin full access to partner sales dashboard"
  ON partner_sales_dashboard FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Partners can view their own sales dashboard"
  ON partner_sales_dashboard FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = auth.uid()
      AND partners.id = partner_sales_dashboard.partner_id
    )
  );

-- View: Partner weekly sales
CREATE OR REPLACE VIEW partner_weekly_sales AS
SELECT
  p.id as partner_id,
  COALESCE(p.referral_slug, p.partner_id_num::text) as partner_slug,
  COALESCE(p.company_name, p.primary_contact) as partner_name,
  DATE_TRUNC('week', es.sale_date)::date as week_start,
  COUNT(*) as sales_count,
  SUM(es.sale_amount_cents) as total_sales_cents,
  SUM(es.commission_amount_cents) as total_commission_cents,
  ARRAY_AGG(
    jsonb_build_object(
      'sale_id', es.id,
      'business', es.business_name,
      'product', es.product_name,
      'amount', es.sale_amount_cents,
      'commission', es.commission_amount_cents,
      'date', es.sale_date
    ) ORDER BY es.sale_date DESC
  ) as sales_details
FROM external_business_sales es
JOIN partners p ON p.id = es.partner_id
WHERE es.commission_status != 'void'
GROUP BY p.id, p.referral_slug, p.partner_id_num, p.company_name, p.primary_contact, DATE_TRUNC('week', es.sale_date)::date;

-- View: Partner monthly sales
CREATE OR REPLACE VIEW partner_monthly_sales AS
SELECT
  p.id as partner_id,
  COALESCE(p.referral_slug, p.partner_id_num::text) as partner_slug,
  COALESCE(p.company_name, p.primary_contact) as partner_name,
  DATE_TRUNC('month', es.sale_date)::date as month_start,
  COUNT(*) as sales_count,
  SUM(es.sale_amount_cents) as total_sales_cents,
  SUM(es.commission_amount_cents) as total_commission_cents
FROM external_business_sales es
JOIN partners p ON p.id = es.partner_id
WHERE es.commission_status != 'void'
GROUP BY p.id, p.referral_slug, p.partner_id_num, p.company_name, p.primary_contact, DATE_TRUNC('month', es.sale_date)::date;

-- View: Partner yearly sales
CREATE OR REPLACE VIEW partner_yearly_sales AS
SELECT
  p.id as partner_id,
  COALESCE(p.referral_slug, p.partner_id_num::text) as partner_slug,
  COALESCE(p.company_name, p.primary_contact) as partner_name,
  DATE_TRUNC('year', es.sale_date)::date as year_start,
  COUNT(*) as sales_count,
  SUM(es.sale_amount_cents) as total_sales_cents,
  SUM(es.commission_amount_cents) as total_commission_cents
FROM external_business_sales es
JOIN partners p ON p.id = es.partner_id
WHERE es.commission_status != 'void'
GROUP BY p.id, p.referral_slug, p.partner_id_num, p.company_name, p.primary_contact, DATE_TRUNC('year', es.sale_date)::date;

-- Function: Update partner sales dashboard
CREATE OR REPLACE FUNCTION update_partner_sales_dashboard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start date;
  v_week_end date;
  v_month_start date;
  v_year_start date;
BEGIN
  -- Calculate time periods
  v_week_start := DATE_TRUNC('week', NEW.sale_date)::date;
  v_week_end := (v_week_start + INTERVAL '6 days')::date;
  v_month_start := DATE_TRUNC('month', NEW.sale_date)::date;
  v_year_start := DATE_TRUNC('year', NEW.sale_date)::date;

  -- Insert or update dashboard record
  INSERT INTO partner_sales_dashboard (
    partner_id,
    week_start,
    week_end,
    month_start,
    year_start,
    week_sales_count,
    week_sales_amount_cents,
    week_commission_cents,
    last_sale_at
  )
  VALUES (
    NEW.partner_id,
    v_week_start,
    v_week_end,
    v_month_start,
    v_year_start,
    1,
    NEW.sale_amount_cents,
    NEW.commission_amount_cents,
    NEW.sale_date
  )
  ON CONFLICT (partner_id, week_start)
  DO UPDATE SET
    week_sales_count = partner_sales_dashboard.week_sales_count + 1,
    week_sales_amount_cents = partner_sales_dashboard.week_sales_amount_cents + NEW.sale_amount_cents,
    week_commission_cents = partner_sales_dashboard.week_commission_cents + NEW.commission_amount_cents,
    last_sale_at = NEW.sale_date,
    updated_at = now();

  -- Update monthly totals
  UPDATE partner_sales_dashboard
  SET
    month_sales_count = (
      SELECT COUNT(*) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_month_start
      AND commission_status != 'void'
    ),
    month_sales_amount_cents = (
      SELECT COALESCE(SUM(sale_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_month_start
      AND commission_status != 'void'
    ),
    month_commission_cents = (
      SELECT COALESCE(SUM(commission_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_month_start
      AND commission_status != 'void'
    )
  WHERE partner_id = NEW.partner_id
  AND week_start = v_week_start;

  -- Update yearly totals
  UPDATE partner_sales_dashboard
  SET
    year_sales_count = (
      SELECT COUNT(*) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_year_start
      AND commission_status != 'void'
    ),
    year_sales_amount_cents = (
      SELECT COALESCE(SUM(sale_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_year_start
      AND commission_status != 'void'
    ),
    year_commission_cents = (
      SELECT COALESCE(SUM(commission_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND sale_date >= v_year_start
      AND commission_status != 'void'
    )
  WHERE partner_id = NEW.partner_id
  AND week_start = v_week_start;

  -- Update lifetime totals
  UPDATE partner_sales_dashboard
  SET
    lifetime_sales_count = (
      SELECT COUNT(*) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND commission_status != 'void'
    ),
    lifetime_sales_amount_cents = (
      SELECT COALESCE(SUM(sale_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND commission_status != 'void'
    ),
    lifetime_commission_cents = (
      SELECT COALESCE(SUM(commission_amount_cents), 0) FROM external_business_sales
      WHERE partner_id = NEW.partner_id
      AND commission_status != 'void'
    )
  WHERE partner_id = NEW.partner_id
  AND week_start = v_week_start;

  RETURN NEW;
END;
$$;

-- Trigger: Update dashboard on new external sale
DROP TRIGGER IF EXISTS update_partner_dashboard_on_sale ON external_business_sales;
CREATE TRIGGER update_partner_dashboard_on_sale
AFTER INSERT ON external_business_sales
FOR EACH ROW
WHEN (NEW.partner_id IS NOT NULL AND NEW.commission_status != 'void')
EXECUTE FUNCTION update_partner_sales_dashboard();

COMMENT ON TABLE external_business_sales IS 'Sales from external businesses (Gemini, LocalPawsPassport, etc.) with partner attribution';
COMMENT ON TABLE partner_sales_dashboard IS 'Real-time aggregated sales dashboard for partners showing weekly, monthly, yearly, and lifetime totals';
COMMENT ON VIEW partner_weekly_sales IS 'Partner sales grouped by week with detailed breakdown';
COMMENT ON VIEW partner_monthly_sales IS 'Partner sales grouped by month';
COMMENT ON VIEW partner_yearly_sales IS 'Partner sales grouped by year';
