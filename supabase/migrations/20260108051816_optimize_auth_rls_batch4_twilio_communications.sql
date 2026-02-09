/*
  # Optimize Auth RLS Performance - Batch 4: Twilio & Communications
  
  1. Performance Optimization
    - Optimize auth function calls in Twilio and communications tables
    - 10 policies optimized in this batch
  
  2. Affected Tables & Policies
    - twilio_configurations: 2 policies
    - twilio_phone_numbers: 1 policy
    - twilio_call_logs: 2 policies
    - twilio_sms_logs: 2 policies
    - twilio_email_logs: 2 policies
    - twilio_voicemails: 1 policy
    - twilio_call_queues: 1 policy
*/

-- twilio_configurations
DROP POLICY IF EXISTS "Merchants can insert own Twilio config" ON twilio_configurations;
CREATE POLICY "Merchants can insert own Twilio config"
  ON twilio_configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own Twilio config" ON twilio_configurations;
CREATE POLICY "Merchants can view own Twilio config"
  ON twilio_configurations
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_phone_numbers
DROP POLICY IF EXISTS "Merchants can view own phone numbers" ON twilio_phone_numbers;
CREATE POLICY "Merchants can view own phone numbers"
  ON twilio_phone_numbers
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_call_logs
DROP POLICY IF EXISTS "Merchants can insert call logs" ON twilio_call_logs;
CREATE POLICY "Merchants can insert call logs"
  ON twilio_call_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own call logs" ON twilio_call_logs;
CREATE POLICY "Merchants can view own call logs"
  ON twilio_call_logs
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_sms_logs
DROP POLICY IF EXISTS "Merchants can insert SMS logs" ON twilio_sms_logs;
CREATE POLICY "Merchants can insert SMS logs"
  ON twilio_sms_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own SMS logs" ON twilio_sms_logs;
CREATE POLICY "Merchants can view own SMS logs"
  ON twilio_sms_logs
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_email_logs
DROP POLICY IF EXISTS "Merchants can insert email logs" ON twilio_email_logs;
CREATE POLICY "Merchants can insert email logs"
  ON twilio_email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own email logs" ON twilio_email_logs;
CREATE POLICY "Merchants can view own email logs"
  ON twilio_email_logs
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_voicemails
DROP POLICY IF EXISTS "Merchants can view own voicemails" ON twilio_voicemails;
CREATE POLICY "Merchants can view own voicemails"
  ON twilio_voicemails
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- twilio_call_queues
DROP POLICY IF EXISTS "Merchants can view own call queue" ON twilio_call_queues;
CREATE POLICY "Merchants can view own call queue"
  ON twilio_call_queues
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );
