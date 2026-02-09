/*
  # Fix Always-True RLS Policy (Security Vulnerability)

  1. Security Fix
    - Replace always-true policy on customer_referrals table
    - The INSERT policy currently allows anyone to create referrals with no verification
    - Replace with restrictive policy requiring valid share_code lookup

  2. Changes
    - Drop insecure "Public can create customer referral clicks and leads" policy
    - Create new policy that validates share_code exists before allowing insert
*/

-- Drop the insecure policy that allows any insert
DROP POLICY IF EXISTS "Public can create customer referral clicks and leads" ON customer_referrals;

-- Create secure policy that requires valid share_code
CREATE POLICY "Public can create referrals with valid share code"
  ON customer_referrals
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customer_referral_links
      WHERE customer_referral_links.share_code = customer_referrals.share_code
    )
  );
