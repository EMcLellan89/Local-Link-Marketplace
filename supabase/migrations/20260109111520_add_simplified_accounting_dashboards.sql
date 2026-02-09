/*
  # Simplified Accounting Dashboards

  1. Tables
    - `merchant_accounting_lite` - Dashboard for Tier 1 merchants (simplified)
    - `merchant_accounting_pro` - Dashboard for Tier 2-3 merchants (advanced with tax tracking)
    - `partner_accounting_pro` - Dashboard for partners (advanced with commission tracking)

  2. Security
    - Enable RLS on all tables
    - Users can only see their own data
*/

-- Merchant Accounting Lite (Tier 1)
CREATE TABLE IF NOT EXISTS merchant_accounting_lite (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  month date NOT NULL,
  total_revenue_cents bigint DEFAULT 0,
  total_expenses_cents bigint DEFAULT 0,
  net_income_cents bigint DEFAULT 0,
  customers_count int DEFAULT 0,
  invoices_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, month)
);

CREATE INDEX IF NOT EXISTS idx_merchant_accounting_lite_merchant_id ON merchant_accounting_lite(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_accounting_lite_month ON merchant_accounting_lite(month);

-- Merchant Accounting Pro (Tiers 2-3)
CREATE TABLE IF NOT EXISTS merchant_accounting_pro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  month date NOT NULL,
  total_revenue_cents bigint DEFAULT 0,
  total_expenses_cents bigint DEFAULT 0,
  net_income_cents bigint DEFAULT 0,
  taxable_sales_cents bigint DEFAULT 0,
  state_sales_tax_cents bigint DEFAULT 0,
  federal_income_tax_cents bigint DEFAULT 0,
  total_tax_owed_cents bigint DEFAULT 0,
  customers_count int DEFAULT 0,
  invoices_count int DEFAULT 0,
  pending_invoices_count int DEFAULT 0,
  open_tickets_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, month)
);

CREATE INDEX IF NOT EXISTS idx_merchant_accounting_pro_merchant_id ON merchant_accounting_pro(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_accounting_pro_month ON merchant_accounting_pro(month);

-- Partner Accounting Pro
CREATE TABLE IF NOT EXISTS partner_accounting_pro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  month date NOT NULL,
  total_revenue_cents bigint DEFAULT 0,
  total_commissions_earned_cents bigint DEFAULT 0,
  total_expenses_cents bigint DEFAULT 0,
  net_income_cents bigint DEFAULT 0,
  taxable_income_cents bigint DEFAULT 0,
  state_sales_tax_cents bigint DEFAULT 0,
  federal_income_tax_cents bigint DEFAULT 0,
  total_tax_owed_cents bigint DEFAULT 0,
  merchants_count int DEFAULT 0,
  active_territories_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, month)
);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_pro_partner_id ON partner_accounting_pro(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_pro_month ON partner_accounting_pro(month);

-- Tax Obligations Quarterly
CREATE TABLE IF NOT EXISTS tax_obligations_quarterly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('merchant', 'partner', 'admin')),
  quarter text NOT NULL,
  year int NOT NULL,
  state text NOT NULL,
  taxable_sales_cents bigint DEFAULT 0,
  state_sales_tax_cents bigint DEFAULT 0,
  federal_income_tax_cents bigint DEFAULT 0,
  total_tax_owed_cents bigint DEFAULT 0,
  due_date date NOT NULL,
  paid boolean DEFAULT false,
  paid_at timestamptz,
  payment_method text,
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_obligations_quarterly_entity_id ON tax_obligations_quarterly(entity_id);
CREATE INDEX IF NOT EXISTS idx_tax_obligations_quarterly_entity_type ON tax_obligations_quarterly(entity_type);
CREATE INDEX IF NOT EXISTS idx_tax_obligations_quarterly_due_date ON tax_obligations_quarterly(due_date);

-- Enable RLS
ALTER TABLE merchant_accounting_lite ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounting_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_accounting_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_obligations_quarterly ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Merchants can manage their lite accounting"
  ON merchant_accounting_lite FOR ALL
  TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can manage their pro accounting"
  ON merchant_accounting_pro FOR ALL
  TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage their accounting"
  ON partner_accounting_pro FOR ALL
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their tax obligations"
  ON tax_obligations_quarterly FOR SELECT
  TO authenticated
  USING (
    (entity_type = 'merchant' AND entity_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
    OR
    (entity_type = 'partner' AND entity_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can manage their tax obligations"
  ON tax_obligations_quarterly FOR INSERT
  TO authenticated
  WITH CHECK (
    (entity_type = 'merchant' AND entity_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
    OR
    (entity_type = 'partner' AND entity_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can update their tax obligations"
  ON tax_obligations_quarterly FOR UPDATE
  TO authenticated
  USING (
    (entity_type = 'merchant' AND entity_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
    OR
    (entity_type = 'partner' AND entity_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
  );