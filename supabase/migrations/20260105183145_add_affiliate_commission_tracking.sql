-- Affiliate Commission Tracking System
--
-- Leverages existing partners table (which already has referral_code)
-- Adds commission tracking and payout management
--
-- 1. New Tables
--   - affiliate_commissions: Track all commission earnings
--   - affiliate_payouts: Track payout requests and payments
--   - affiliate_clicks: Track referral link clicks
--
-- 2. Updates
--   - Add affiliate-specific columns to partners table
--
-- 3. Security
--   - RLS policies for partner data access

-- Add affiliate tracking columns to partners table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'affiliate_enabled'
  ) THEN
    ALTER TABLE partners ADD COLUMN affiliate_enabled boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'affiliate_tier'
  ) THEN
    ALTER TABLE partners ADD COLUMN affiliate_tier text DEFAULT 'standard' CHECK (affiliate_tier IN ('standard', 'premium', 'vip'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'commission_rate'
  ) THEN
    ALTER TABLE partners ADD COLUMN commission_rate decimal DEFAULT 0.20 CHECK (commission_rate >= 0 AND commission_rate <= 1);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'total_clicks'
  ) THEN
    ALTER TABLE partners ADD COLUMN total_clicks integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'total_conversions'
  ) THEN
    ALTER TABLE partners ADD COLUMN total_conversions integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'pending_commission_cents'
  ) THEN
    ALTER TABLE partners ADD COLUMN pending_commission_cents integer DEFAULT 0;
  END IF;
END $$;

-- Affiliate Commissions (detailed tracking)
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners NOT NULL,
  referred_user_id uuid REFERENCES auth.users,
  order_id uuid,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  order_total_cents integer NOT NULL,
  commission_cents integer NOT NULL,
  commission_rate decimal NOT NULL,
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS affiliate_commissions_partner_id_idx ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS affiliate_commissions_status_idx ON affiliate_commissions(status);
CREATE INDEX IF NOT EXISTS affiliate_commissions_referred_user_idx ON affiliate_commissions(referred_user_id);

ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Affiliate Payouts
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners NOT NULL,
  amount_cents integer NOT NULL,
  payout_method text NOT NULL,
  payout_details jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  transaction_id text,
  notes text
);

CREATE INDEX IF NOT EXISTS affiliate_payouts_partner_id_idx ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS affiliate_payouts_status_idx ON affiliate_payouts(status);

ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can request payouts"
  ON affiliate_payouts FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Affiliate Clicks (track referral traffic)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners NOT NULL,
  referral_code text NOT NULL,
  clicked_url text NOT NULL,
  ip_address text,
  user_agent text,
  referrer text,
  converted boolean DEFAULT false,
  converted_user_id uuid REFERENCES auth.users,
  converted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS affiliate_clicks_partner_id_idx ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS affiliate_clicks_referral_code_idx ON affiliate_clicks(referral_code);
CREATE INDEX IF NOT EXISTS affiliate_clicks_converted_idx ON affiliate_clicks(converted);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Function to calculate affiliate stats
CREATE OR REPLACE FUNCTION calculate_affiliate_stats(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_commissions', COALESCE(SUM(commission_cents), 0),
    'pending_commissions', COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_cents ELSE 0 END), 0),
    'approved_commissions', COALESCE(SUM(CASE WHEN status = 'approved' THEN commission_cents ELSE 0 END), 0),
    'paid_commissions', COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_cents ELSE 0 END), 0),
    'total_conversions', COUNT(*),
    'conversion_rate', CASE 
      WHEN (SELECT total_clicks FROM partners WHERE id = p_partner_id) > 0 
      THEN ROUND((COUNT(*)::decimal / (SELECT total_clicks FROM partners WHERE id = p_partner_id) * 100), 2)
      ELSE 0 
    END
  )
  INTO v_result
  FROM affiliate_commissions
  WHERE partner_id = p_partner_id;
  
  RETURN v_result;
END;
$$;
