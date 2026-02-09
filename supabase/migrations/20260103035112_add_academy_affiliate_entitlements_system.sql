/*
  # Add Local-Link Academy Affiliate & Entitlements System

  1. New Tables
    - `product_entitlements`
      - Maps products to entitlements (course_access, exam_access, badge, templates, etc.)
    - `user_entitlements`
      - Tracks what entitlements each user has for each course
    - `affiliate_partners`
      - Partner/affiliate accounts with commission rates
    - `affiliate_referrals`
      - Tracks referrals and commissions
    - `affiliate_payouts`
      - Monthly payout batches
    - `app_settings`
      - Global settings (launch window, etc.)

  2. Security
    - Enable RLS on all tables
    - Public read for products/entitlements
    - Users read their own enrollments/entitlements
    - Partners read their own referrals/payouts
*/

-- Product Entitlements (what you get when you buy a product)
CREATE TABLE IF NOT EXISTS public.product_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  entitlement text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_slug, entitlement)
);

-- User Entitlements (explicit tracking of what users have)
CREATE TABLE IF NOT EXISTS public.user_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  entitlement text NOT NULL,
  source_product_slug text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, entitlement)
);

-- Affiliate Partners
CREATE TABLE IF NOT EXISTS public.affiliate_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  display_name text,
  launch_rate numeric NOT NULL DEFAULT 0.40,
  evergreen_rate numeric NOT NULL DEFAULT 0.30,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Affiliate Referrals
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_slug text,
  order_amount_cents int NOT NULL DEFAULT 0,
  commission_cents int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Affiliate Payouts
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  amount_cents int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'queued',
  period_start date,
  period_end date,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- App Settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public reads for catalog
CREATE POLICY "Product entitlements are publicly readable"
  ON public.product_entitlements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "App settings are publicly readable"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies: Users read their own entitlements
CREATE POLICY "Users can read their own entitlements"
  ON public.user_entitlements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies: Partners read their own data
CREATE POLICY "Partners can read their own profile"
  ON public.affiliate_partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can read their own referrals"
  ON public.affiliate_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners ap 
      WHERE ap.id = partner_id AND ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can read their own payouts"
  ON public.affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_partners ap 
      WHERE ap.id = partner_id AND ap.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_entitlements_slug ON public.product_entitlements(product_slug);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user ON public.user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_course ON public.user_entitlements(course_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_code ON public.affiliate_partners(code);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner ON public.affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner ON public.affiliate_payouts(partner_id);

-- Initial app settings
INSERT INTO public.app_settings(key, value) VALUES
  ('affiliate_launch_days', '60'),
  ('affiliate_launch_rate', '0.40'),
  ('affiliate_evergreen_rate', '0.30'),
  ('affiliate_payout_threshold_cents', '5000')
ON CONFLICT (key) DO NOTHING;
