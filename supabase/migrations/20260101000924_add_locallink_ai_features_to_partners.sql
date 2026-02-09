/*
  # Local-Link AI™ Features for Partners

  1. Updates to Existing Tables
    - Add AI-related columns to `partners` table
    - Add commission tracking columns

  2. New Tables
    - `partner_referrals` - Attribution of merchants to partners
    - `partner_commissions` - Commission tracking and payouts (distinct from existing partner_commissions)
    - `prompt_categories` - AI prompt organization
    - `prompts` - AI prompt library with templates
    - `credit_ledger` - AI credit tracking (debit/credit system)
    - `prompt_runs` - AI prompt execution history
    - `training_modules` - Partner training content
    - `onboarding_progress` - Partner onboarding tracking

  3. Security
    - Enable RLS on all new tables
    - Partners can only access their own data
    - Prompt library readable by authenticated users
    - Credit/prompt insertions restricted to service role

  4. Functions
    - `generate_partner_referral_code()` - Unique partner referral codes
    - `get_my_credit_balance()` - Security definer for credit balance
*/

-- =========================
-- 1) Update partners table with AI/earnings features
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE partners ADD COLUMN referral_code TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'ai_credits_remaining'
  ) THEN
    ALTER TABLE partners ADD COLUMN ai_credits_remaining INTEGER DEFAULT 100;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'ai_credits_used'
  ) THEN
    ALTER TABLE partners ADD COLUMN ai_credits_used INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'total_commission_earned'
  ) THEN
    ALTER TABLE partners ADD COLUMN total_commission_earned DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'monthly_recurring_revenue'
  ) THEN
    ALTER TABLE partners ADD COLUMN monthly_recurring_revenue DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'payout_method'
  ) THEN
    ALTER TABLE partners ADD COLUMN payout_method TEXT DEFAULT 'bank_transfer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'payout_details'
  ) THEN
    ALTER TABLE partners ADD COLUMN payout_details JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index on referral_code
CREATE INDEX IF NOT EXISTS idx_partners_referral_code ON partners(referral_code);

-- =========================
-- 2) Partner referrals (partner -> merchant)
-- =========================
CREATE TABLE IF NOT EXISTS public.partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  source TEXT DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(partner_id, merchant_id)
);

ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_referrals_select_own" ON public.partner_referrals;
CREATE POLICY "partner_referrals_select_own"
ON public.partner_referrals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = partner_referrals.partner_id
      AND p.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "partner_referrals_insert_own" ON public.partner_referrals;
CREATE POLICY "partner_referrals_insert_own"
ON public.partner_referrals FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = partner_referrals.partner_id
      AND p.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_partner_referrals_partner_id ON public.partner_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON public.partner_referrals(merchant_id);

-- =========================
-- 3) Partner commission tracking (separate from existing partner_commissions)
-- =========================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_commission_status') THEN
    CREATE TYPE public.ai_commission_status AS ENUM ('pending','approved','paid','reversed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.partner_ai_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status public.ai_commission_status DEFAULT 'pending',
  reason TEXT,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

ALTER TABLE public.partner_ai_commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_ai_commissions_select_own" ON public.partner_ai_commissions;
CREATE POLICY "partner_ai_commissions_select_own"
ON public.partner_ai_commissions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = partner_ai_commissions.partner_id
      AND p.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON public.partner_ai_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_status ON public.partner_ai_commissions(status);

-- =========================
-- 4) AI Prompt Library
-- =========================
CREATE TABLE IF NOT EXISTS public.prompt_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prompt_categories_select_authenticated" ON public.prompt_categories;
CREATE POLICY "prompt_categories_select_authenticated"
ON public.prompt_categories FOR SELECT
TO authenticated
USING (true);

CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.prompt_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  intent TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  example_input JSONB DEFAULT '{}'::jsonb,
  example_output TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prompts_select_authenticated" ON public.prompts;
CREATE POLICY "prompts_select_authenticated"
ON public.prompts FOR SELECT
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON public.prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_intent ON public.prompts(intent);

-- =========================
-- 5) AI credits & runs
-- =========================
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_ledger_select_own" ON public.credit_ledger;
CREATE POLICY "credit_ledger_select_own"
ON public.credit_ledger FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON public.credit_ledger(user_id);

CREATE TABLE IF NOT EXISTS public.prompt_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  input JSONB NOT NULL,
  output TEXT,
  tokens_used INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prompt_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prompt_runs_select_own" ON public.prompt_runs;
CREATE POLICY "prompt_runs_select_own"
ON public.prompt_runs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON public.prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON public.prompt_runs(prompt_id);

-- =========================
-- 6) Onboarding / training progress
-- =========================
CREATE TABLE IF NOT EXISTS public.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "training_modules_select_authenticated" ON public.training_modules;
CREATE POLICY "training_modules_select_authenticated"
ON public.training_modules FOR SELECT
TO authenticated
USING (true);

CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, step)
);

ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "onboarding_select_own" ON public.onboarding_progress;
CREATE POLICY "onboarding_select_own"
ON public.onboarding_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "onboarding_insert_own" ON public.onboarding_progress;
CREATE POLICY "onboarding_insert_own"
ON public.onboarding_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "onboarding_update_own" ON public.onboarding_progress;
CREATE POLICY "onboarding_update_own"
ON public.onboarding_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON public.onboarding_progress(user_id);

-- =========================
-- FUNCTIONS
-- =========================

-- Generate a short referral code (safe uniqueness)
CREATE OR REPLACE FUNCTION public.generate_partner_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  LOOP
    code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM partners WHERE referral_code = code);
  END LOOP;
  RETURN code;
END;
$$;

-- Update existing partners with referral codes
DO $$
DECLARE
  partner_record RECORD;
BEGIN
  FOR partner_record IN SELECT id FROM partners WHERE referral_code IS NULL
  LOOP
    UPDATE partners 
    SET referral_code = public.generate_partner_referral_code()
    WHERE id = partner_record.id;
  END LOOP;
END $$;

-- Credits balance function
CREATE OR REPLACE FUNCTION public.get_my_credit_balance()
RETURNS INT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(delta), 0)::int
  FROM public.credit_ledger
  WHERE user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_credit_balance() FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_credit_balance() TO authenticated;