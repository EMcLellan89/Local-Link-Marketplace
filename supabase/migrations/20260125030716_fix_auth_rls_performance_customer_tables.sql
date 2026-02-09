/*
  # Optimize Auth RLS Performance - Customer Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery to prevent per-row evaluation
    - Apply to customer_referral_links, customer_referrals, customer_rewards_ledger

  2. Security
    - Maintains existing security model
    - Improves query performance by caching auth.uid() result
*/

-- customer_referral_links policies
DROP POLICY IF EXISTS "Customers can view their own customer referral links" ON customer_referral_links;
CREATE POLICY "Customers can view their own customer referral links"
  ON customer_referral_links
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = customer_id 
    OR (SELECT auth.uid()) = merchant_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Merchants can create customer referral links" ON customer_referral_links;
CREATE POLICY "Merchants can create customer referral links"
  ON customer_referral_links
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = merchant_id);

-- customer_referrals policies
DROP POLICY IF EXISTS "Users can view their own customer referrals" ON customer_referrals;
CREATE POLICY "Users can view their own customer referrals"
  ON customer_referrals
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = referrer_customer_id 
    OR (SELECT auth.uid()) = referee_customer_id 
    OR (SELECT auth.uid()) = merchant_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Merchants can update their customer referrals" ON customer_referrals;
CREATE POLICY "Merchants can update their customer referrals"
  ON customer_referrals
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = merchant_id);

-- customer_rewards_ledger policies
DROP POLICY IF EXISTS "Merchant can view own org rewards" ON customer_rewards_ledger;
CREATE POLICY "Merchant can view own org rewards"
  ON customer_rewards_ledger
  FOR SELECT
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchant can insert rewards" ON customer_rewards_ledger;
CREATE POLICY "Merchant can insert rewards"
  ON customer_rewards_ledger
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_org_id IN (
      SELECT org_id FROM org_members 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchant can update rewards" ON customer_rewards_ledger;
CREATE POLICY "Merchant can update rewards"
  ON customer_rewards_ledger
  FOR UPDATE
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members 
      WHERE profile_id = (SELECT auth.uid())
    )
  );
