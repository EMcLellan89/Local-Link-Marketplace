/*
  # Fix Customer Creation and Referral Function

  1. Changes
    - Fix check_referral_completion function to get email from auth.users instead of profiles
    - Add trigger to automatically create customer record when profile with role 'customer' is created
    - Create customer records for any existing profiles that are customers but don't have customer records

  2. Security
    - No changes to existing RLS policies
*/

-- Fix the referral completion function to use auth.users for email
CREATE OR REPLACE FUNCTION check_referral_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new customer is created, check if they were referred
  UPDATE referrals
  SET 
    referred_customer_id = NEW.id,
    status = 'completed',
    completed_at = now()
  WHERE 
    referred_email = (SELECT email FROM auth.users WHERE id = NEW.user_id)
    AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create customer record for new customer profiles
CREATE OR REPLACE FUNCTION create_customer_for_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO customers (user_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create customer records automatically
DROP TRIGGER IF EXISTS trigger_create_customer_for_profile ON profiles;
CREATE TRIGGER trigger_create_customer_for_profile
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'customer')
  EXECUTE FUNCTION create_customer_for_profile();

-- Backfill: Create customer records for existing customer profiles that don't have them
INSERT INTO customers (user_id)
SELECT p.id
FROM profiles p
LEFT JOIN customers c ON c.user_id = p.id
WHERE p.role = 'customer' AND c.id IS NULL
ON CONFLICT DO NOTHING;