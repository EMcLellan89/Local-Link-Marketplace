/*
  # Consolidate Multiple Permissive Policies - Batch 1
  
  1. Security Improvement
    - Consolidate multiple permissive policies into single policies
    - Reduces confusion and potential security gaps
    - Uses OR logic to combine access patterns
  
  2. Affected Tables (Batch 1)
    - affiliate_payouts: Merge 2 duplicate SELECT policies
    - ai_bot_setups: Merge duplicate INSERT, SELECT, UPDATE policies
    - appointments: Remove duplicate INSERT policy
    - campaign_recipients: Merge 2 SELECT policies
    - email_templates: Merge 4 duplicate policies each for DELETE, INSERT, SELECT, UPDATE
  
  3. Important Notes
    - Multiple permissive policies with OR logic can cause confusion
    - Single consolidated policy is clearer and easier to audit
    - No change in actual access control - same users can access same data
*/

-- affiliate_payouts: Remove duplicate "Partners can read their own payouts" (keep "Partners can view own payouts")
DROP POLICY IF EXISTS "Partners can read their own payouts" ON affiliate_payouts;

-- ai_bot_setups: Consolidate duplicate policies
DROP POLICY IF EXISTS "Merchants can create AI bot orders" ON ai_bot_setups;
DROP POLICY IF EXISTS "Merchants can create own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can create own bot setups"
  ON ai_bot_setups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own AI bot setups" ON ai_bot_setups;
DROP POLICY IF EXISTS "Merchants can view own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can view own bot setups"
  ON ai_bot_setups
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own AI bot setups" ON ai_bot_setups;
DROP POLICY IF EXISTS "Merchants can update own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can update own bot setups"
  ON ai_bot_setups
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- appointments: Remove duplicate policy
DROP POLICY IF EXISTS "Customers can create appointments" ON appointments;

-- campaign_recipients: Consolidate 2 SELECT policies
DROP POLICY IF EXISTS "Customers can view campaigns sent to them" ON campaign_recipients;
DROP POLICY IF EXISTS "Merchants can view recipients of their campaigns" ON campaign_recipients;
CREATE POLICY "Users can view relevant campaign recipients"
  ON campaign_recipients
  FOR SELECT
  TO authenticated
  USING (
    -- Customers can view campaigns sent to them
    customer_id IN (
      SELECT customers.id FROM customers
      WHERE customers.user_id = (select auth.uid())
    )
    OR
    -- Merchants can view recipients of their campaigns
    campaign_id IN (
      SELECT email_campaigns.id FROM email_campaigns
      WHERE email_campaigns.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  );

-- email_templates: Consolidate duplicate policies
DROP POLICY IF EXISTS "Merchants can delete their own templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants manage their email templates" ON email_templates;
CREATE POLICY "Merchants manage their email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can create templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants can view their own templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants can update their own templates" ON email_templates;
