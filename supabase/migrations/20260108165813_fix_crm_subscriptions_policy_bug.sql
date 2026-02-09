/*
  # Fix CRM Subscriptions Policy Bug
  
  1. Issue
    - The UPDATE policy references wrong table in WITH CHECK
    - References: customer_segments.merchant_id
    - Should be: crm_subscriptions.merchant_id
    
  2. Fix
    - Drop and recreate with correct table reference
*/

-- Drop the buggy policy
DROP POLICY IF EXISTS "Merchants can update their subscription" ON crm_subscriptions;

-- Recreate with correct logic
CREATE POLICY "Merchants can update their subscription"
  ON crm_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_subscriptions.merchant_id
        AND merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_subscriptions.merchant_id
        AND merchants.user_id = (select auth.uid())
    )
  );
