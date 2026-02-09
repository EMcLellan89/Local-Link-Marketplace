/*
  # Partner CRM Subscription & Commission System

  1. New Tables
    - `customer_accounts` - Unified customer record for all businesses
    - `partner_customer_links` - Attribution source of truth
    - `partner_crm_subscriptions` - Partner CRM product subscriptions
    - `commissions` - Commission ledger
    - `commission_rules` - Configurable commission rates

  2. Updates to existing tables
    - `orders` - Add columns for Stripe webhooks and attribution

  3. Security
    - Enable RLS on all tables
    - Partners can read own data
    - Admin can manage all records
*/

-- Add missing columns to existing orders table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_event_id') THEN
    ALTER TABLE public.orders ADD COLUMN stripe_event_id text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_invoice_id') THEN
    ALTER TABLE public.orders ADD COLUMN stripe_invoice_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_subscription_id') THEN
    ALTER TABLE public.orders ADD COLUMN stripe_subscription_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE public.orders ADD COLUMN stripe_customer_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_type') THEN
    ALTER TABLE public.orders ADD COLUMN order_type text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'sku') THEN
    ALTER TABLE public.orders ADD COLUMN sku text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'description') THEN
    ALTER TABLE public.orders ADD COLUMN description text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'partner_id') THEN
    ALTER TABLE public.orders ADD COLUMN partner_id uuid REFERENCES public.affiliate_partners(id);
  END IF;
END $$;

-- Customer Accounts
CREATE TABLE IF NOT EXISTS public.customer_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text,
  owner_name text,
  email text,
  phone text,
  stripe_customer_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Add customer_account_id to orders
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_account_id') THEN
    ALTER TABLE public.orders ADD COLUMN customer_account_id uuid REFERENCES public.customer_accounts(id);
  END IF;
END $$;

-- Partner Customer Links
CREATE TABLE IF NOT EXISTS public.partner_customer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  customer_account_id uuid NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
  attribution_source text NOT NULL,
  first_attributed_at timestamptz DEFAULT now(),
  UNIQUE (partner_id, customer_account_id)
);

-- Partner CRM Subscriptions
CREATE TABLE IF NOT EXISTS public.partner_crm_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  status text NOT NULL,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Commissions
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  commission_cents int NOT NULL,
  rate_bps int NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE (partner_id, order_id)
);

-- Commission Rules
CREATE TABLE IF NOT EXISTS public.commission_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type text NOT NULL,
  rate_bps int NOT NULL,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_accounts_stripe_customer_id ON public.customer_accounts(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_accounts_email ON public.customer_accounts(email);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_partner_id ON public.partner_customer_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON public.partner_customer_links(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON public.partner_crm_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_stripe_subscription_id ON public.partner_crm_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_status ON public.partner_crm_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_event_id ON public.orders(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_customer_id ON public.orders(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_subscription_id ON public.orders(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON public.orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id ON public.orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON public.orders(order_type);
CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON public.commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON public.commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_commission_rules_order_type ON public.commission_rules(order_type);

-- Enable RLS
ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_customer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_crm_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_accounts
DROP POLICY IF EXISTS "Admin can manage customer accounts" ON public.customer_accounts;
CREATE POLICY "Admin can manage customer accounts"
  ON public.customer_accounts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view their customers" ON public.customer_accounts;
CREATE POLICY "Partners can view their customers"
  ON public.customer_accounts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_customer_links
      JOIN public.affiliate_partners ON partner_customer_links.partner_id = affiliate_partners.id
      WHERE partner_customer_links.customer_account_id = customer_accounts.id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

-- RLS Policies for partner_customer_links
DROP POLICY IF EXISTS "Admin can manage partner customer links" ON public.partner_customer_links;
CREATE POLICY "Admin can manage partner customer links"
  ON public.partner_customer_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view their customer links" ON public.partner_customer_links;
CREATE POLICY "Partners can view their customer links"
  ON public.partner_customer_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners
      WHERE affiliate_partners.id = partner_customer_links.partner_id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Partners can create their customer links" ON public.partner_customer_links;
CREATE POLICY "Partners can create their customer links"
  ON public.partner_customer_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners
      WHERE affiliate_partners.id = partner_customer_links.partner_id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

-- RLS Policies for partner_crm_subscriptions
DROP POLICY IF EXISTS "Admin can manage partner CRM subscriptions" ON public.partner_crm_subscriptions;
CREATE POLICY "Admin can manage partner CRM subscriptions"
  ON public.partner_crm_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own CRM subscription" ON public.partner_crm_subscriptions;
CREATE POLICY "Partners can view own CRM subscription"
  ON public.partner_crm_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners
      WHERE affiliate_partners.id = partner_crm_subscriptions.partner_id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

-- RLS Policies for orders (add partner view policy)
DROP POLICY IF EXISTS "Partners can view their orders" ON public.orders;
CREATE POLICY "Partners can view their orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners
      WHERE affiliate_partners.id = orders.partner_id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

-- RLS Policies for commissions
DROP POLICY IF EXISTS "Admin can manage commissions" ON public.commissions;
CREATE POLICY "Admin can manage commissions"
  ON public.commissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own commissions" ON public.commissions;
CREATE POLICY "Partners can view own commissions"
  ON public.commissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners
      WHERE affiliate_partners.id = commissions.partner_id
      AND affiliate_partners.user_id = auth.uid()
    )
  );

-- RLS Policies for commission_rules
DROP POLICY IF EXISTS "Admin can manage commission rules" ON public.commission_rules;
CREATE POLICY "Admin can manage commission rules"
  ON public.commission_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can view commission rules" ON public.commission_rules;
CREATE POLICY "Anyone can view commission rules"
  ON public.commission_rules FOR SELECT
  TO authenticated
  USING (true);

-- Seed default commission rules
INSERT INTO public.commission_rules (order_type, rate_bps) VALUES
  ('course', 3000),
  ('marketplace', 2000),
  ('local_link_crm', 3000),
  ('tradehive_crm', 3000),
  ('adsuite_crm', 3000),
  ('laundry_saas', 2500),
  ('budget_buster', 2500),
  ('carecompanion', 2500),
  ('pawconnect_town', 2000),
  ('addon', 2000),
  ('partner_crm', 0)
ON CONFLICT DO NOTHING;
