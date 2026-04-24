/*
  # Universal CRM: New Tables for Local-Link

  ## Summary
  Adds the missing tables to make the existing CRM business-agnostic.
  Existing tables (crm_contacts, crm_leads, crm_activities, crm_tasks, crm_notes) are kept as-is.
  
  ## New Tables Added

  ### CRM Layer
  - `crm_customers` — confirmed buyers with lifetime value tracking
  - `crm_opportunities` — universal pipeline: service, product, event, subscription
  - `crm_offers` — universal pricebook (services, products, events, bundles)
  - `crm_transactions` — any revenue event
  - `crm_invoices` — formal invoices with line items

  ### Financial / CPA Export Layer
  - `financial_categories` — revenue/expense/tax categories (with system defaults)
  - `financial_records` — individual revenue or expense entries
  - `financial_monthly_summaries` — monthly P&L snapshots
  - `cpa_export_batches` — CPA export jobs
  - `cpa_delivery_logs` — delivery tracking

  ## Security
  - RLS enabled on all new tables
  - Merchants only access their own data
*/

-- ============================================================
-- CRM CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  phone text,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  lifetime_value_cents bigint DEFAULT 0,
  total_transactions int DEFAULT 0,
  last_transaction_at timestamptz,
  first_transaction_at timestamptz,
  status text DEFAULT 'active',
  tags text[] DEFAULT '{}',
  source text DEFAULT 'direct',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE crm_customers ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_crm_customers_merchant ON crm_customers(merchant_id);

CREATE POLICY "Merchants manage own customers"
  ON crm_customers FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own customers"
  ON crm_customers FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own customers"
  ON crm_customers FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CRM OPPORTUNITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES crm_customers(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'New Opportunity',
  opp_type text DEFAULT 'service',
  stage text DEFAULT 'new',
  value_cents bigint DEFAULT 0,
  probability int DEFAULT 50,
  expected_close_date date,
  source text DEFAULT 'direct',
  notes text,
  won_at timestamptz,
  lost_at timestamptz,
  lost_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_merchant ON crm_opportunities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON crm_opportunities(merchant_id, stage);

CREATE POLICY "Merchants manage own opportunities"
  ON crm_opportunities FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own opportunities"
  ON crm_opportunities FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own opportunities"
  ON crm_opportunities FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CRM OFFERS (universal pricebook)
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  offer_type text DEFAULT 'service',
  price_cents bigint NOT NULL DEFAULT 0,
  cost_cents bigint DEFAULT 0,
  duration_minutes int,
  is_active boolean DEFAULT true,
  sku text,
  image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE crm_offers ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_crm_offers_merchant ON crm_offers(merchant_id);

CREATE POLICY "Merchants manage own offers"
  ON crm_offers FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own offers"
  ON crm_offers FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own offers"
  ON crm_offers FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CRM TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES crm_customers(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES crm_opportunities(id) ON DELETE SET NULL,
  offer_id uuid REFERENCES crm_offers(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Transaction',
  transaction_type text DEFAULT 'sale',
  amount_cents bigint NOT NULL DEFAULT 0,
  tax_cents bigint DEFAULT 0,
  discount_cents bigint DEFAULT 0,
  status text DEFAULT 'pending',
  payment_method text,
  stripe_payment_intent_id text,
  notes text,
  transacted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE crm_transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_crm_transactions_merchant ON crm_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_transactions_date ON crm_transactions(merchant_id, transacted_at);

CREATE POLICY "Merchants manage own transactions"
  ON crm_transactions FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own transactions"
  ON crm_transactions FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own transactions"
  ON crm_transactions FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CRM INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES crm_customers(id) ON DELETE SET NULL,
  invoice_number text,
  status text DEFAULT 'draft',
  subtotal_cents bigint DEFAULT 0,
  tax_cents bigint DEFAULT 0,
  discount_cents bigint DEFAULT 0,
  total_cents bigint DEFAULT 0,
  amount_paid_cents bigint DEFAULT 0,
  due_date date,
  paid_at timestamptz,
  sent_at timestamptz,
  notes text,
  line_items jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE crm_invoices ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_crm_invoices_merchant ON crm_invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_status ON crm_invoices(merchant_id, status);

CREATE POLICY "Merchants manage own invoices"
  ON crm_invoices FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own invoices"
  ON crm_invoices FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own invoices"
  ON crm_invoices FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- FINANCIAL CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_type text NOT NULL DEFAULT 'revenue',
  is_system boolean DEFAULT false,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_financial_categories_merchant ON financial_categories(merchant_id);

CREATE POLICY "Merchants view own or system categories"
  ON financial_categories FOR SELECT TO authenticated
  USING (
    is_system = true OR
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Merchants insert own categories"
  ON financial_categories FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own categories"
  ON financial_categories FOR UPDATE TO authenticated
  USING (is_system = false AND merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

INSERT INTO financial_categories (name, category_type, is_system) VALUES
  ('Services Revenue', 'revenue', true),
  ('Product Sales', 'revenue', true),
  ('Event Revenue', 'revenue', true),
  ('Subscription Revenue', 'revenue', true),
  ('Refunds', 'revenue', true),
  ('Advertising & Marketing', 'expense', true),
  ('Software & Tools', 'expense', true),
  ('Supplies & Materials', 'expense', true),
  ('Payroll & Labor', 'expense', true),
  ('Rent & Utilities', 'expense', true),
  ('Professional Services', 'expense', true),
  ('Equipment', 'expense', true),
  ('Sales Tax Collected', 'tax', true),
  ('Sales Tax Due', 'tax', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FINANCIAL RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES crm_transactions(id) ON DELETE SET NULL,
  category_id uuid REFERENCES financial_categories(id) ON DELETE SET NULL,
  record_type text NOT NULL DEFAULT 'revenue',
  amount_cents bigint NOT NULL DEFAULT 0,
  description text,
  vendor text,
  reference text,
  is_auto_categorized boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  period_month int,
  period_year int,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_financial_records_merchant ON financial_records(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_period ON financial_records(merchant_id, period_year, period_month);

CREATE POLICY "Merchants manage own financial records"
  ON financial_records FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own financial records"
  ON financial_records FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own financial records"
  ON financial_records FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- FINANCIAL MONTHLY SUMMARIES
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_monthly_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  period_year int NOT NULL,
  period_month int NOT NULL,
  gross_revenue_cents bigint DEFAULT 0,
  refunds_cents bigint DEFAULT 0,
  net_revenue_cents bigint DEFAULT 0,
  total_expenses_cents bigint DEFAULT 0,
  estimated_profit_cents bigint DEFAULT 0,
  tax_collected_cents bigint DEFAULT 0,
  transaction_count int DEFAULT 0,
  is_finalized boolean DEFAULT false,
  finalized_at timestamptz,
  generated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, period_year, period_month)
);
ALTER TABLE financial_monthly_summaries ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_financial_summaries_merchant ON financial_monthly_summaries(merchant_id);

CREATE POLICY "Merchants view own summaries"
  ON financial_monthly_summaries FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own summaries"
  ON financial_monthly_summaries FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own summaries"
  ON financial_monthly_summaries FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CPA EXPORT BATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS cpa_export_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  export_type text NOT NULL DEFAULT 'monthly_summary',
  period_start date NOT NULL,
  period_end date NOT NULL,
  tax_year int,
  status text DEFAULT 'pending',
  payload jsonb,
  file_url text,
  file_format text DEFAULT 'json',
  total_revenue_cents bigint DEFAULT 0,
  total_expenses_cents bigint DEFAULT 0,
  transaction_count int DEFAULT 0,
  generated_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE cpa_export_batches ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_cpa_export_merchant ON cpa_export_batches(merchant_id);

CREATE POLICY "Merchants view own exports"
  ON cpa_export_batches FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants create own exports"
  ON cpa_export_batches FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants update own exports"
  ON cpa_export_batches FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));

-- ============================================================
-- CPA DELIVERY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS cpa_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  export_id uuid NOT NULL REFERENCES cpa_export_batches(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  delivery_method text NOT NULL DEFAULT 'download',
  destination text,
  status text DEFAULT 'pending',
  response_code int,
  response_body text,
  attempted_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);
ALTER TABLE cpa_delivery_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_cpa_delivery_export ON cpa_delivery_logs(export_id);
CREATE INDEX IF NOT EXISTS idx_cpa_delivery_merchant ON cpa_delivery_logs(merchant_id);

CREATE POLICY "Merchants view own delivery logs"
  ON cpa_delivery_logs FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Merchants insert own delivery logs"
  ON cpa_delivery_logs FOR INSERT TO authenticated
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())));
