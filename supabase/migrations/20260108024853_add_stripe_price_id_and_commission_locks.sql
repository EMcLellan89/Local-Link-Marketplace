/*
  # Production Upgrades for Partner Commission System

  1. Schema Changes
    - Add `stripe_price_id` column to `marketplace_affiliate_products`
    - Add index for efficient lookups
    - Create `marketplace_affiliate_subscription_locks` table

  2. Purpose
    - Store Stripe Price IDs to avoid dynamic price creation
    - Prevent paying commission more than once per subscription
    - Enable one-time commission model for recurring products

  3. Security
    - Enable RLS on lock table
    - Admin-only access to locks
*/

-- Add stripe_price_id to products
ALTER TABLE public.marketplace_affiliate_products
  ADD COLUMN IF NOT EXISTS stripe_price_id text;

CREATE INDEX IF NOT EXISTS marketplace_affiliate_products_stripe_price_id_idx
  ON public.marketplace_affiliate_products(stripe_price_id);

-- Create commission lock table (prevents duplicate subscription commissions)
CREATE TABLE IF NOT EXISTS public.marketplace_affiliate_subscription_locks (
  subscription_id text PRIMARY KEY,
  marketplace_affiliate_id uuid REFERENCES public.marketplace_affiliates(id) ON DELETE CASCADE,
  product_sku text NOT NULL,
  commission_id uuid REFERENCES public.marketplace_affiliate_commissions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_affiliate_subscription_locks ENABLE ROW LEVEL SECURITY;

-- Admin-only access to locks
CREATE POLICY "marketplace_affiliate_subscription_locks_select_admin"
  ON public.marketplace_affiliate_subscription_locks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS marketplace_affiliate_subscription_locks_subscription_idx
  ON public.marketplace_affiliate_subscription_locks(subscription_id);
