/*
  # Add Merchant Auto Creation

  1. Changes
    - Update trigger to also create merchant record when profile with role 'merchant' is created
    - Merchant records need minimal required fields: business_name and slug
    - Set default values for new merchant records

  2. Security
    - No changes to existing RLS policies
*/

-- Update function to also create merchant records for new merchant profiles
CREATE OR REPLACE FUNCTION create_customer_or_merchant_for_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO customers (user_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
  ELSIF NEW.role = 'merchant' THEN
    -- Create merchant record with placeholder values that user will complete during onboarding
    INSERT INTO merchants (
      user_id,
      business_name,
      slug,
      status
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.first_name || '''s Business', 'New Business'),
      'merchant-' || NEW.id,
      'pending'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to use the new function name
DROP TRIGGER IF EXISTS trigger_create_customer_for_profile ON profiles;
CREATE TRIGGER trigger_create_customer_or_merchant_for_profile
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW
  WHEN (NEW.role IN ('customer', 'merchant'))
  EXECUTE FUNCTION create_customer_or_merchant_for_profile();

-- Backfill: Create merchant records for existing merchant profiles that don't have them
INSERT INTO merchants (user_id, business_name, slug, status)
SELECT 
  p.id,
  COALESCE(p.first_name || '''s Business', 'New Business'),
  'merchant-' || p.id,
  'pending'
FROM profiles p
LEFT JOIN merchants m ON m.user_id = p.id
WHERE p.role = 'merchant' AND m.id IS NULL
ON CONFLICT DO NOTHING;