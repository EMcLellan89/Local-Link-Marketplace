/*
  # Create Done For You AI Tools System

  1. New Tables
    - dfy_products: Catalog of DFY AI tools (merchant-facing)
    - dfy_product_stripe: Stripe product/price mappings
    - dfy_addons: Optional add-ons for each product
    - dfy_orders: Purchase records with partner tracking
    - dfy_onboarding: Intake form answers after checkout
    - dfy_fulfillment_tasks: Ops team task management
    - partner_dfy_tracking_links: Partner referral tracking

  2. Key Features
    - Complete product catalog with pricing
    - Partner referral tracking (no prices shown to partners)
    - Automatic commission calculation
    - Fulfillment pipeline management
    - Onboarding workflow

  3. Security
    - RLS enabled on all tables
    - Merchants can only see their orders
    - Partners can only see their tracking links
    - Admin can see all fulfillment tasks
*/

-- DFY product catalog (merchant-facing with prices)
CREATE TABLE IF NOT EXISTS dfy_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  short_value_prop text NOT NULL,
  long_description text NOT NULL,
  outcomes jsonb NOT NULL DEFAULT '[]',
  includes jsonb NOT NULL DEFAULT '[]',
  faq jsonb NOT NULL DEFAULT '[]',
  setup_price_cents int NOT NULL,
  monthly_price_cents int NOT NULL,
  setup_sla_hours int NOT NULL DEFAULT 72,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Stripe product/price mappings
CREATE TABLE IF NOT EXISTS dfy_product_stripe (
  product_id uuid PRIMARY KEY REFERENCES dfy_products(id) ON DELETE CASCADE,
  stripe_product_id text NOT NULL,
  stripe_price_setup_id text NOT NULL,
  stripe_price_monthly_id text NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Optional add-ons for products
CREATE TABLE IF NOT EXISTS dfy_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES dfy_products(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price_cents int NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  stripe_price_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Purchase records with partner tracking
CREATE TABLE IF NOT EXISTS dfy_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  product_id uuid REFERENCES dfy_products(id),
  status text NOT NULL DEFAULT 'new',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  referral_partner_id uuid,
  referral_source text,
  setup_paid boolean NOT NULL DEFAULT false,
  total_setup_cents int NOT NULL DEFAULT 0,
  total_monthly_cents int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Onboarding intake answers
CREATE TABLE IF NOT EXISTS dfy_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid UNIQUE REFERENCES dfy_orders(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Fulfillment task management
CREATE TABLE IF NOT EXISTS dfy_fulfillment_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES dfy_orders(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  assignee_email text,
  due_at timestamptz,
  completed_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Partner tracking links (no prices stored here)
CREATE TABLE IF NOT EXISTS partner_dfy_tracking_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  product_id uuid REFERENCES dfy_products(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  clicks int NOT NULL DEFAULT 0,
  conversions int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Commission tracking for DFY sales
CREATE TABLE IF NOT EXISTS dfy_commission_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  order_id uuid REFERENCES dfy_orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  amount_gross_cents int NOT NULL,
  commission_rate_bps int NOT NULL,
  commission_owed_cents int NOT NULL,
  stripe_invoice_id text,
  stripe_charge_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dfy_products_slug ON dfy_products(slug);
CREATE INDEX IF NOT EXISTS idx_dfy_products_category ON dfy_products(category);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_user_id ON dfy_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_status ON dfy_orders(status);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_referral_partner ON dfy_orders(referral_partner_id);
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order ON dfy_fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_status ON dfy_fulfillment_tasks(status);
CREATE INDEX IF NOT EXISTS idx_partner_tracking_partner ON partner_dfy_tracking_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_dfy_commission_partner ON dfy_commission_ledger(partner_id);

-- Enable RLS
ALTER TABLE dfy_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_product_stripe ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_fulfillment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_dfy_tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE dfy_commission_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- dfy_products: Public can read active products
CREATE POLICY "Anyone can view active DFY products"
  ON dfy_products FOR SELECT
  USING (is_active = true);

-- dfy_product_stripe: Public can read (for checkout)
CREATE POLICY "Anyone can view Stripe mappings"
  ON dfy_product_stripe FOR SELECT
  USING (true);

-- dfy_addons: Public can read active addons
CREATE POLICY "Anyone can view active addons"
  ON dfy_addons FOR SELECT
  USING (is_active = true);

-- dfy_orders: Users can view their own orders
CREATE POLICY "Users can view own DFY orders"
  ON dfy_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own DFY orders"
  ON dfy_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- dfy_onboarding: Users can view/update their own onboarding
CREATE POLICY "Users can view own onboarding"
  ON dfy_onboarding FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dfy_orders
      WHERE dfy_orders.id = order_id
      AND dfy_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can submit own onboarding"
  ON dfy_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dfy_orders
      WHERE dfy_orders.id = order_id
      AND dfy_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own onboarding"
  ON dfy_onboarding FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dfy_orders
      WHERE dfy_orders.id = order_id
      AND dfy_orders.user_id = auth.uid()
    )
  );

-- dfy_fulfillment_tasks: Admins can manage all tasks
CREATE POLICY "Admins can manage fulfillment tasks"
  ON dfy_fulfillment_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- partner_dfy_tracking_links: Partners can view their own links
CREATE POLICY "Partners can view own tracking links"
  ON partner_dfy_tracking_links FOR SELECT
  TO authenticated
  USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can create own tracking links"
  ON partner_dfy_tracking_links FOR INSERT
  TO authenticated
  WITH CHECK (partner_id = auth.uid());

-- dfy_commission_ledger: Partners can view their own commissions
CREATE POLICY "Partners can view own commissions"
  ON dfy_commission_ledger FOR SELECT
  TO authenticated
  USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
