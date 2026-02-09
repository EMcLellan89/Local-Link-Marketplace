/*
  # Add Partner Referral Attribution Fields (Fixed for existing schema)
  
  Works with existing partners table that has:
  - primary_contact (instead of full_name)
  - referral_code (already exists)
  
  Adds:
  - partner_id_num (sequential ID for accounting)
  - referral_slug (john-smith-8392)
  - is_system_account (for Family-2428)
  - Identity field locks
*/

-- ============================================
-- 1) ADD NEW COLUMNS TO PARTNERS
-- ============================================

DO $$ 
BEGIN
  -- partner_id_num (sequential ID for accounting)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'partner_id_num'
  ) THEN
    ALTER TABLE partners ADD COLUMN partner_id_num int;
  END IF;

  -- referral_slug (john-smith-8392)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'referral_slug'
  ) THEN
    ALTER TABLE partners ADD COLUMN referral_slug text;
  END IF;

  -- is_system_account (for Family-2428)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'is_system_account'
  ) THEN
    ALTER TABLE partners ADD COLUMN is_system_account boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- ============================================
-- 2) BACKFILL EXISTING PARTNERS
-- ============================================

DO $$
DECLARE
  partner_rec RECORD;
  seq_num INT := 2428; -- Start after Family-2428
  slug_base TEXT;
  slug_final TEXT;
  last4_str TEXT;
BEGIN
  FOR partner_rec IN 
    SELECT id, primary_contact, email, referral_code
    FROM partners 
    WHERE partner_id_num IS NULL
    ORDER BY created_at
  LOOP
    -- Generate partner_id_num
    seq_num := seq_num + 1;
    
    -- Generate slug from primary_contact
    slug_base := lower(regexp_replace(
      regexp_replace(
        regexp_replace(partner_rec.primary_contact, '&', 'and', 'g'),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ));
    
    -- Trim any leading/trailing hyphens
    slug_base := trim(both '-' from slug_base);
    
    -- Get last 4 digits
    last4_str := lpad((seq_num % 10000)::text, 4, '0');
    
    -- Final slug
    slug_final := slug_base || '-' || last4_str;
    
    -- Update partner (referral_code already exists, so skip it)
    UPDATE partners SET
      partner_id_num = seq_num,
      referral_slug = slug_final
    WHERE id = partner_rec.id;
  END LOOP;
END $$;

-- ============================================
-- 3) MAKE FIELDS REQUIRED AND ADD CONSTRAINTS
-- ============================================

-- Make partner_id_num and referral_slug required
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM partners WHERE partner_id_num IS NULL LIMIT 1) THEN
    RAISE EXCEPTION 'Cannot make partner_id_num NOT NULL - some rows are still NULL';
  END IF;
  
  ALTER TABLE partners ALTER COLUMN partner_id_num SET NOT NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM partners WHERE referral_slug IS NULL LIMIT 1) THEN
    RAISE EXCEPTION 'Cannot make referral_slug NOT NULL - some rows are still NULL';
  END IF;
  
  ALTER TABLE partners ALTER COLUMN referral_slug SET NOT NULL;
END $$;

-- Add unique constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'partners_partner_id_num_key'
  ) THEN
    ALTER TABLE partners ADD CONSTRAINT partners_partner_id_num_key UNIQUE (partner_id_num);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'partners_referral_slug_key'
  ) THEN
    ALTER TABLE partners ADD CONSTRAINT partners_referral_slug_key UNIQUE (referral_slug);
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partners_referral_slug ON partners(referral_slug);
CREATE INDEX IF NOT EXISTS idx_partners_partner_id_num ON partners(partner_id_num);
CREATE INDEX IF NOT EXISTS idx_partners_system_account ON partners(is_system_account) WHERE is_system_account = true;

-- ============================================
-- 4) LOCK IDENTITY FIELDS (read-only after insert)
-- ============================================

CREATE OR REPLACE FUNCTION lock_partner_identity_fields()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Prevent changes to partner_id_num
  IF (OLD.partner_id_num IS NOT NULL AND NEW.partner_id_num != OLD.partner_id_num) THEN
    RAISE EXCEPTION 'partner_id_num is locked and cannot be changed';
  END IF;

  -- Prevent changes to referral_slug
  IF (OLD.referral_slug IS NOT NULL AND NEW.referral_slug != OLD.referral_slug) THEN
    RAISE EXCEPTION 'referral_slug is locked and cannot be changed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lock_partner_identity ON partners;
CREATE TRIGGER trg_lock_partner_identity
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION lock_partner_identity_fields();

-- ============================================
-- 5) HELPER FUNCTIONS
-- ============================================

-- Generate next partner_id_num
CREATE OR REPLACE FUNCTION get_next_partner_id_num()
RETURNS INT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INT;
BEGIN
  SELECT COALESCE(MAX(partner_id_num), 2427) + 1 INTO next_num FROM partners;
  RETURN next_num;
END;
$$;

-- Calculate week start (Monday)
CREATE OR REPLACE FUNCTION week_start(d timestamptz)
RETURNS date
IMMUTABLE
LANGUAGE sql
AS $$
  SELECT (d::date - ((EXTRACT(DOW FROM d)::int + 6) % 7))::date;
$$;

-- Generate referral slug from name
CREATE OR REPLACE FUNCTION generate_referral_slug(name_input text, id_num int)
RETURNS text
IMMUTABLE
LANGUAGE plpgsql
AS $$
DECLARE
  slug_base text;
  last4_str text;
BEGIN
  -- Slugify name
  slug_base := lower(regexp_replace(
    regexp_replace(
      regexp_replace(name_input, '&', 'and', 'g'),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  ));
  
  -- Trim hyphens
  slug_base := trim(both '-' from slug_base);
  
  -- Get last 4 digits
  last4_str := lpad((id_num % 10000)::text, 4, '0');
  
  RETURN slug_base || '-' || last4_str;
END;
$$;
