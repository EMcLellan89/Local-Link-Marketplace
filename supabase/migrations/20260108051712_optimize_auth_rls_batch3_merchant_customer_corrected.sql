/*
  # Optimize Auth RLS Performance - Batch 3: Merchant & Customer Tables (Corrected)
  
  1. Performance Optimization
    - Optimize auth function calls preserving existing logic
    - 14 policies optimized in this batch
  
  2. Affected Tables & Policies
    - bi_predictions, bi_metrics, referral_links, referral_conversions
    - referral_rewards, winback_triggers, winback_outreach, winback_conversions
    - marketplace_affiliates, marketplace_affiliate_products, event_registrations
*/

-- bi_predictions
DROP POLICY IF EXISTS "Merchants view their BI predictions" ON bi_predictions;
CREATE POLICY "Merchants view their BI predictions"
  ON bi_predictions
  FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ));

-- bi_metrics
DROP POLICY IF EXISTS "Merchants view their BI metrics" ON bi_metrics;
CREATE POLICY "Merchants view their BI metrics"
  ON bi_metrics
  FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ));

-- referral_links
DROP POLICY IF EXISTS "Customers view their referral links" ON referral_links;
CREATE POLICY "Customers view their referral links"
  ON referral_links
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customers.id FROM customers
    WHERE customers.user_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants view all referral links" ON referral_links;
CREATE POLICY "Merchants view all referral links"
  ON referral_links
  FOR SELECT
  TO authenticated
  USING (program_id IN (
    SELECT referral_programs.id FROM referral_programs
    WHERE referral_programs.merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  ));

-- referral_conversions
DROP POLICY IF EXISTS "Customers view their referral conversions" ON referral_conversions;
CREATE POLICY "Customers view their referral conversions"
  ON referral_conversions
  FOR SELECT
  TO authenticated
  USING (referral_link_id IN (
    SELECT referral_links.id FROM referral_links
    WHERE referral_links.customer_id IN (
      SELECT customers.id FROM customers
      WHERE customers.user_id = (select auth.uid())
    )
  ));

DROP POLICY IF EXISTS "Merchants view all referral conversions" ON referral_conversions;
CREATE POLICY "Merchants view all referral conversions"
  ON referral_conversions
  FOR SELECT
  TO authenticated
  USING (referral_link_id IN (
    SELECT referral_links.id FROM referral_links
    WHERE referral_links.program_id IN (
      SELECT referral_programs.id FROM referral_programs
      WHERE referral_programs.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  ));

-- referral_rewards
DROP POLICY IF EXISTS "Customers view their referral rewards" ON referral_rewards;
CREATE POLICY "Customers view their referral rewards"
  ON referral_rewards
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customers.id FROM customers
    WHERE customers.user_id = (select auth.uid())
  ));

-- winback_triggers
DROP POLICY IF EXISTS "Merchants view their winback triggers" ON winback_triggers;
CREATE POLICY "Merchants view their winback triggers"
  ON winback_triggers
  FOR SELECT
  TO authenticated
  USING (campaign_id IN (
    SELECT winback_campaigns.id FROM winback_campaigns
    WHERE winback_campaigns.merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  ));

-- winback_outreach
DROP POLICY IF EXISTS "Merchants view their winback outreach" ON winback_outreach;
CREATE POLICY "Merchants view their winback outreach"
  ON winback_outreach
  FOR SELECT
  TO authenticated
  USING (campaign_id IN (
    SELECT winback_campaigns.id FROM winback_campaigns
    WHERE winback_campaigns.merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  ));

-- winback_conversions
DROP POLICY IF EXISTS "Merchants view their winback conversions" ON winback_conversions;
CREATE POLICY "Merchants view their winback conversions"
  ON winback_conversions
  FOR SELECT
  TO authenticated
  USING (outreach_id IN (
    SELECT winback_outreach.id FROM winback_outreach
    WHERE winback_outreach.campaign_id IN (
      SELECT winback_campaigns.id FROM winback_campaigns
      WHERE winback_campaigns.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  ));

-- marketplace_affiliates
DROP POLICY IF EXISTS "Marketplace affiliates can view own profile" ON marketplace_affiliates;
CREATE POLICY "Marketplace affiliates can view own profile"
  ON marketplace_affiliates
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) 
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- marketplace_affiliate_products
DROP POLICY IF EXISTS "Anyone authenticated can view active marketplace products" ON marketplace_affiliate_products;
CREATE POLICY "Anyone authenticated can view active marketplace products"
  ON marketplace_affiliate_products
  FOR SELECT
  TO authenticated
  USING (
    active = true 
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- event_registrations
DROP POLICY IF EXISTS "Customers view their event registrations" ON event_registrations;
CREATE POLICY "Customers view their event registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customers.id FROM customers
    WHERE customers.user_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants view their event registrations" ON event_registrations;
CREATE POLICY "Merchants view their event registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events
    WHERE events.merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  ));
