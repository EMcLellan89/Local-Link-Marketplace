/*
  # Partner Accelerator Course System - Complete Implementation
  
  1. New Tables
    - `partner_agreement_acceptances` - Track signed partner agreements
    - `certificates_issued` - Track issued certificates with codes
    - `badge_awards` - Track earned badges (certification, levels)
    - `partner_bonuses` - Track quarterly bonuses
    
  2. Updates to Existing Tables
    - Add columns to partners for Stripe Connect
    - Add payout_id to affiliate_commissions
    
  3. Views
    - `partner_leaderboard` - Revenue ranking
    
  4. RPC Functions
    - Quarter bonus generation
    - Payout candidate selection
    
  5. Security
    - RLS policies for all new tables
*/

-- Partner Agreement Acceptances
CREATE TABLE IF NOT EXISTS partner_agreement_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_version text NOT NULL DEFAULT 'v1',
  accepted_at timestamptz DEFAULT now(),
  ip_hash text,
  user_agent text,
  typed_name text NOT NULL,
  pdf_path text
);

CREATE INDEX IF NOT EXISTS partner_agreement_user_idx ON partner_agreement_acceptances(user_id);

ALTER TABLE partner_agreement_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agreement acceptances"
  ON partner_agreement_acceptances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agreement acceptances"
  ON partner_agreement_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Certificates Issued
CREATE TABLE IF NOT EXISTS certificates_issued (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  certificate_name text NOT NULL,
  certificate_code text NOT NULL UNIQUE,
  recipient_name text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  pdf_path text
);

CREATE INDEX IF NOT EXISTS cert_user_idx ON certificates_issued(user_id);
CREATE INDEX IF NOT EXISTS cert_course_idx ON certificates_issued(course_slug);
CREATE INDEX IF NOT EXISTS cert_code_idx ON certificates_issued(certificate_code);

ALTER TABLE certificates_issued ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates_issued FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can verify certificates by code"
  ON certificates_issued FOR SELECT
  TO anon, authenticated
  USING (certificate_code IS NOT NULL);

-- Badge Awards
CREATE TABLE IF NOT EXISTS badge_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug text NOT NULL,
  course_slug text,
  awarded_at timestamptz DEFAULT now(),
  notified_at timestamptz
);

CREATE INDEX IF NOT EXISTS badge_user_idx ON badge_awards(user_id);
CREATE INDEX IF NOT EXISTS badge_slug_idx ON badge_awards(badge_slug);

ALTER TABLE badge_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON badge_awards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Partner Bonuses
CREATE TABLE IF NOT EXISTS partner_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  quarter text NOT NULL,
  bonus_cents int NOT NULL,
  status text DEFAULT 'pending',
  stripe_transfer_id text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  notes text
);

CREATE INDEX IF NOT EXISTS bonus_affiliate_idx ON partner_bonuses(affiliate_id);
CREATE INDEX IF NOT EXISTS bonus_quarter_idx ON partner_bonuses(quarter);
CREATE INDEX IF NOT EXISTS bonus_status_idx ON partner_bonuses(status);

ALTER TABLE partner_bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own bonuses"
  ON partner_bonuses FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Update affiliate_commissions to track payouts
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_commissions' AND column_name = 'payout_id') THEN
    ALTER TABLE affiliate_commissions ADD COLUMN payout_id uuid;
    CREATE INDEX commission_payout_idx ON affiliate_commissions(payout_id);
  END IF;
END $$;

-- Update partners table for Stripe Connect
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'stripe_account_id') THEN
    ALTER TABLE partners ADD COLUMN stripe_account_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'payout_status') THEN
    ALTER TABLE partners ADD COLUMN payout_status text DEFAULT 'not_connected';
  END IF;
END $$;

-- Partner Leaderboard View
CREATE OR REPLACE VIEW partner_leaderboard AS
SELECT 
  row_number() OVER (ORDER BY COALESCE(SUM(ac.commission_cents), 0) DESC) AS rank,
  p.id AS partner_id,
  p.company_name,
  p.referral_code AS code,
  COALESCE(SUM(ac.order_total_cents), 0) AS total_revenue_cents,
  COALESCE(SUM(ac.commission_cents), 0) AS total_commission_cents,
  COUNT(ac.id) AS total_sales
FROM partners p
LEFT JOIN affiliate_commissions ac ON ac.partner_id = p.id AND ac.status IN ('approved', 'paid')
WHERE p.affiliate_enabled = true
GROUP BY p.id, p.company_name, p.referral_code
ORDER BY total_commission_cents DESC;

-- Helper: is_admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role::text = 'admin' FROM profiles WHERE id = auth.uid()), false);
$$;

-- Helper: quarter_date_range
CREATE OR REPLACE FUNCTION quarter_date_range(p_quarter text)
RETURNS TABLE (start_date date, end_date date)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  y int;
  q int;
BEGIN
  y := split_part(p_quarter, '-', 1)::int;
  q := replace(split_part(p_quarter, '-', 2), 'Q', '')::int;

  IF q = 1 THEN
    start_date := make_date(y,1,1);  end_date := make_date(y,4,1);
  ELSIF q = 2 THEN
    start_date := make_date(y,4,1);  end_date := make_date(y,7,1);
  ELSIF q = 3 THEN
    start_date := make_date(y,7,1);  end_date := make_date(y,10,1);
  ELSE
    start_date := make_date(y,10,1); end_date := make_date(y+1,1,1);
  END IF;

  RETURN NEXT;
END;
$$;

-- RPC: Admin Quarter Revenue Summary
CREATE OR REPLACE FUNCTION admin_quarter_revenue_summary(p_quarter text)
RETURNS TABLE (
  affiliate_id uuid,
  code text,
  total_revenue_cents bigint,
  total_commission_cents bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dr record;
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'not authorized'; END IF;

  SELECT * INTO dr FROM quarter_date_range(p_quarter);

  RETURN QUERY
  SELECT
    p.id,
    p.referral_code,
    COALESCE(SUM(ac.order_total_cents),0)::bigint AS total_revenue_cents,
    COALESCE(SUM(ac.commission_cents),0)::bigint AS total_commission_cents
  FROM partners p
  LEFT JOIN affiliate_commissions ac
    ON ac.partner_id = p.id
   AND ac.status IN ('approved','paid')
   AND ac.created_at >= dr.start_date::timestamptz
   AND ac.created_at <  dr.end_date::timestamptz
  WHERE p.affiliate_enabled = true
  GROUP BY p.id, p.referral_code
  ORDER BY total_revenue_cents DESC;
END;
$$;

-- RPC: Generate Quarterly Bonuses
CREATE OR REPLACE FUNCTION admin_generate_quarterly_bonuses(p_quarter text)
RETURNS TABLE (
  affiliate_id uuid,
  code text,
  quarter text,
  bonus_cents int,
  created_bonus_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dr record;
  rec record;
  tier_bonus int;
  bonus_id uuid;
  rank_counter int := 0;
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'not authorized'; END IF;

  SELECT * INTO dr FROM quarter_date_range(p_quarter);

  FOR rec IN
    SELECT
      p.id AS affiliate_id,
      p.referral_code AS code,
      COALESCE(SUM(ac.order_total_cents),0)::bigint AS revenue_cents
    FROM partners p
    LEFT JOIN affiliate_commissions ac
      ON ac.partner_id = p.id
     AND ac.status IN ('approved','paid')
     AND ac.created_at >= dr.start_date::timestamptz
     AND ac.created_at <  dr.end_date::timestamptz
    WHERE p.affiliate_enabled = true
    GROUP BY p.id, p.referral_code
    ORDER BY revenue_cents DESC
  LOOP
    tier_bonus := 0;

    IF rec.revenue_cents >= 2500000 THEN
      tier_bonus := 150000;
    ELSIF rec.revenue_cents >= 1000000 THEN
      tier_bonus := 50000;
    END IF;

    IF tier_bonus > 0 THEN
      IF NOT EXISTS (
        SELECT 1 FROM partner_bonuses
        WHERE affiliate_id = rec.affiliate_id AND quarter = p_quarter
      ) THEN
        INSERT INTO partner_bonuses(affiliate_id, quarter, bonus_cents, status)
        VALUES (rec.affiliate_id, p_quarter, tier_bonus, 'pending')
        RETURNING id INTO bonus_id;
      ELSE
        SELECT id INTO bonus_id FROM partner_bonuses
        WHERE affiliate_id = rec.affiliate_id AND quarter = p_quarter
        LIMIT 1;
      END IF;

      affiliate_id := rec.affiliate_id;
      code := rec.code;
      quarter := p_quarter;
      bonus_cents := tier_bonus;
      created_bonus_id := bonus_id;
      RETURN NEXT;
    END IF;

    rank_counter := rank_counter + 1;
    IF rank_counter <= 3 THEN
      INSERT INTO badge_awards(user_id, badge_slug, course_slug)
      SELECT p.user_id, 'top_partner_' || p_quarter, null
      FROM partners p
      WHERE p.id = rec.affiliate_id
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

-- RPC: Payout Candidates
CREATE OR REPLACE FUNCTION admin_affiliate_payout_candidates(min_payout_cents int)
RETURNS TABLE (
  affiliate_id uuid,
  code text,
  stripe_account_id text,
  eligible_commission_cents bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'not authorized'; END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.referral_code,
    p.stripe_account_id,
    SUM(ac.commission_cents)::bigint AS eligible_commission_cents
  FROM partners p
  JOIN affiliate_commissions ac
    ON ac.partner_id = p.id
   AND ac.status = 'approved'
  WHERE p.stripe_account_id IS NOT NULL
  GROUP BY p.id, p.referral_code, p.stripe_account_id
  HAVING SUM(ac.commission_cents) >= min_payout_cents
  ORDER BY eligible_commission_cents DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION quarter_date_range TO authenticated;
GRANT EXECUTE ON FUNCTION admin_quarter_revenue_summary TO authenticated;
GRANT EXECUTE ON FUNCTION admin_generate_quarterly_bonuses TO authenticated;
GRANT EXECUTE ON FUNCTION admin_affiliate_payout_candidates TO authenticated;
