/*
  # Add Partner Tier Lock Field

  1. Changes
    - Add `tier_locked` column to partners table
    - Prevents automatic tier upgrades when locked

  2. Security
    - Admin-only access enforced by existing RLS policies
*/

-- Add tier_locked column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'tier_locked'
  ) THEN
    ALTER TABLE partners ADD COLUMN tier_locked boolean DEFAULT false;
  END IF;
END $$;

-- Add index for tier management queries
CREATE INDEX IF NOT EXISTS idx_partners_tier_key ON partners(tier_key);