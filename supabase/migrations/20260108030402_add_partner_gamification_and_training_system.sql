/*
  # Partner Gamification, Training & Nudge System

  1. Schema Changes
    - Add gamification fields to `marketplace_affiliates`
    - Create `marketplace_affiliate_badges` table
    - Create `marketplace_affiliate_training_progress` table
    - Create `product_assets` table for training materials
    - Add nudge tracking fields

  2. Features
    - Points system (referrals, sales, commission-based)
    - Badge achievements (Starter Seller → Legend)
    - Training module progress tracking
    - Email nudge tracking (approved_at, last_nudged_at)

  3. Security
    - RLS policies for affiliates to see own data
    - Admin full access
*/

-- Add gamification & nudge fields to marketplace_affiliates
ALTER TABLE public.marketplace_affiliates
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_nudged_at timestamptz,
  ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_badge text DEFAULT 'starter';

-- Badges table (achievements)
CREATE TABLE IF NOT EXISTS public.marketplace_affiliate_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_affiliate_id uuid NOT NULL REFERENCES public.marketplace_affiliates(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(marketplace_affiliate_id, badge_type)
);

ALTER TABLE public.marketplace_affiliate_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_affiliate_badges_select_own"
  ON public.marketplace_affiliate_badges
  FOR SELECT
  USING (
    marketplace_affiliate_id IN (
      SELECT id FROM public.marketplace_affiliates
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "marketplace_affiliate_badges_select_admin"
  ON public.marketplace_affiliate_badges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Training progress tracking
CREATE TABLE IF NOT EXISTS public.marketplace_affiliate_training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_affiliate_id uuid NOT NULL REFERENCES public.marketplace_affiliates(id) ON DELETE CASCADE,
  module_slug text NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(marketplace_affiliate_id, module_slug)
);

ALTER TABLE public.marketplace_affiliate_training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_affiliate_training_progress_select_own"
  ON public.marketplace_affiliate_training_progress
  FOR SELECT
  USING (
    marketplace_affiliate_id IN (
      SELECT id FROM public.marketplace_affiliates
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "marketplace_affiliate_training_progress_insert_own"
  ON public.marketplace_affiliate_training_progress
  FOR INSERT
  WITH CHECK (
    marketplace_affiliate_id IN (
      SELECT id FROM public.marketplace_affiliates
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "marketplace_affiliate_training_progress_update_own"
  ON public.marketplace_affiliate_training_progress
  FOR UPDATE
  USING (
    marketplace_affiliate_id IN (
      SELECT id FROM public.marketplace_affiliates
      WHERE user_id = auth.uid()
    )
  );

-- Product assets (training materials, decks, one-sheets)
CREATE TABLE IF NOT EXISTS public.marketplace_affiliate_product_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_sku text NOT NULL REFERENCES public.marketplace_affiliate_products(sku) ON DELETE CASCADE,
  asset_type text NOT NULL,
  asset_url text,
  asset_content text,
  title text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_affiliate_product_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_affiliate_product_assets_select_active_affiliates"
  ON public.marketplace_affiliate_product_assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_affiliates
      WHERE marketplace_affiliates.user_id = auth.uid()
      AND marketplace_affiliates.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "marketplace_affiliate_product_assets_manage_admin"
  ON public.marketplace_affiliate_product_assets
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS marketplace_affiliate_badges_affiliate_idx
  ON public.marketplace_affiliate_badges(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS marketplace_affiliate_training_progress_affiliate_idx
  ON public.marketplace_affiliate_training_progress(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS marketplace_affiliate_product_assets_sku_idx
  ON public.marketplace_affiliate_product_assets(product_sku);

CREATE INDEX IF NOT EXISTS marketplace_affiliates_points_idx
  ON public.marketplace_affiliates(points DESC);

-- Function: Award points and badges
CREATE OR REPLACE FUNCTION public.award_affiliate_points(
  p_affiliate_id uuid,
  p_points integer,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_points integer;
  v_new_badge text;
  v_sales_count integer;
BEGIN
  UPDATE marketplace_affiliates
  SET points = points + p_points
  WHERE id = p_affiliate_id
  RETURNING points INTO v_new_points;

  SELECT COUNT(*)
  INTO v_sales_count
  FROM marketplace_affiliate_commissions
  WHERE marketplace_affiliate_id = p_affiliate_id
    AND status IN ('approved', 'paid');

  IF v_sales_count >= 50 THEN
    v_new_badge := 'legend';
  ELSIF v_sales_count >= 25 THEN
    v_new_badge := 'elite';
  ELSIF v_sales_count >= 10 THEN
    v_new_badge := 'closer';
  ELSIF v_sales_count >= 5 THEN
    v_new_badge := 'momentum';
  ELSIF v_sales_count >= 1 THEN
    v_new_badge := 'starter_seller';
  ELSE
    v_new_badge := 'starter';
  END IF;

  UPDATE marketplace_affiliates
  SET current_badge = v_new_badge
  WHERE id = p_affiliate_id;

  IF v_new_badge != 'starter' THEN
    INSERT INTO marketplace_affiliate_badges (marketplace_affiliate_id, badge_type, badge_name)
    VALUES (p_affiliate_id, v_new_badge, v_new_badge)
    ON CONFLICT (marketplace_affiliate_id, badge_type) DO NOTHING;
  END IF;
END;
$$;

-- Update approved_at when status changes to active
CREATE OR REPLACE FUNCTION public.set_affiliate_approved_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status != 'active' AND NEW.approved_at IS NULL THEN
    NEW.approved_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_affiliate_approved_at_trigger ON public.marketplace_affiliates;

CREATE TRIGGER set_affiliate_approved_at_trigger
  BEFORE UPDATE ON public.marketplace_affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_affiliate_approved_at();
