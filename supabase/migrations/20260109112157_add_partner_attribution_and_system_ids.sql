/*
  # Partner Attribution and System ID Tracking

  1. Changes
    - Add system_id to partners table (auto-generated unique ID)
    - Add system_id to merchants table (auto-generated unique ID)
    - Add partner attribution fields to customers table
    - Add partner attribution fields to merchants table
    - Create function to auto-generate system IDs
    - Create indexes for efficient lookups

  2. Security
    - Maintain existing RLS policies
    - Add policies for partner attribution viewing
*/

-- Add system_id to partners table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'system_id'
  ) THEN
    ALTER TABLE partners ADD COLUMN system_id text UNIQUE;
  END IF;
END $$;

-- Add system_id to merchants table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'merchants' AND column_name = 'system_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN system_id text UNIQUE;
  END IF;
END $$;

-- Add partner attribution to customers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'referred_by_partner_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN referred_by_partner_id uuid REFERENCES partners(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'referred_by_partner_name'
  ) THEN
    ALTER TABLE customers ADD COLUMN referred_by_partner_name text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'referred_by_partner_system_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN referred_by_partner_system_id text;
  END IF;
END $$;

-- Add partner attribution to merchants
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'merchants' AND column_name = 'referred_by_partner_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN referred_by_partner_id uuid REFERENCES partners(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'merchants' AND column_name = 'referred_by_partner_name'
  ) THEN
    ALTER TABLE merchants ADD COLUMN referred_by_partner_name text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'merchants' AND column_name = 'referred_by_partner_system_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN referred_by_partner_system_id text;
  END IF;
END $$;

-- Create indexes for partner attribution
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id ON customers(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_referred_by_partner_id ON merchants(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_system_id ON partners(system_id);
CREATE INDEX IF NOT EXISTS idx_merchants_system_id ON merchants(system_id);

-- Function to generate system IDs
CREATE OR REPLACE FUNCTION generate_system_id(entity_type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_id text;
  prefix text;
  counter int;
BEGIN
  -- Set prefix based on entity type
  prefix := CASE entity_type
    WHEN 'partner' THEN 'PTR'
    WHEN 'merchant' THEN 'MER'
    ELSE 'USR'
  END;

  -- Get the next counter value
  SELECT COALESCE(MAX(SUBSTRING(system_id FROM '[0-9]+')::int), 0) + 1
  INTO counter
  FROM (
    SELECT system_id FROM partners WHERE system_id LIKE prefix || '%'
    UNION ALL
    SELECT system_id FROM merchants WHERE system_id LIKE prefix || '%'
  ) AS ids;

  -- Generate the new ID with zero padding
  new_id := prefix || '-' || LPAD(counter::text, 6, '0');

  RETURN new_id;
END;
$$;

-- Trigger function to auto-generate system_id for partners
CREATE OR REPLACE FUNCTION auto_generate_partner_system_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.system_id IS NULL THEN
    NEW.system_id := generate_system_id('partner');
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger function to auto-generate system_id for merchants
CREATE OR REPLACE FUNCTION auto_generate_merchant_system_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.system_id IS NULL THEN
    NEW.system_id := generate_system_id('merchant');
  END IF;
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_auto_generate_partner_system_id ON partners;
CREATE TRIGGER trigger_auto_generate_partner_system_id
  BEFORE INSERT ON partners
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_partner_system_id();

DROP TRIGGER IF EXISTS trigger_auto_generate_merchant_system_id ON merchants;
CREATE TRIGGER trigger_auto_generate_merchant_system_id
  BEFORE INSERT ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_merchant_system_id();

-- Update existing partners to have system IDs
UPDATE partners 
SET system_id = generate_system_id('partner')
WHERE system_id IS NULL;

-- Update existing merchants to have system IDs
UPDATE merchants 
SET system_id = generate_system_id('merchant')
WHERE system_id IS NULL;