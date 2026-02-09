/*
  # Optimize RLS Policies - Remaining Tables

  1. Tables Fixed
    - qr_codes (uses created_by_partner_id)
    - transactions
    - payout_batches  
    - batch_transactions
    - audit_logs
    - user_2fa
    - territories (2 policies)
    - merchant_settings (2 policies)
    - partner_settings (2 policies)
    - notification_queue
*/

-- qr_codes (uses created_by_partner_id not partner_id)
DROP POLICY IF EXISTS "Partners can manage own QR codes" ON qr_codes;
CREATE POLICY "Partners can manage own QR codes"
  ON qr_codes FOR ALL
  TO authenticated
  USING (
    created_by_partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

-- transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own transactions" ON transactions;
CREATE POLICY "Partners can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- payout_batches
DROP POLICY IF EXISTS "Admins can manage payout batches" ON payout_batches;
CREATE POLICY "Admins can manage payout batches"
  ON payout_batches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own payouts" ON payout_batches;
CREATE POLICY "Partners can view own payouts"
  ON payout_batches FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- batch_transactions
DROP POLICY IF EXISTS "Admins can manage batch transactions" ON batch_transactions;
CREATE POLICY "Admins can manage batch transactions"
  ON batch_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- user_2fa
DROP POLICY IF EXISTS "Users can manage own 2FA" ON user_2fa;
CREATE POLICY "Users can manage own 2FA"
  ON user_2fa FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

-- territories
DROP POLICY IF EXISTS "Admins can manage territories" ON territories;
CREATE POLICY "Admins can manage territories"
  ON territories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view assigned territories" ON territories;
CREATE POLICY "Partners can view assigned territories"
  ON territories FOR SELECT
  TO authenticated
  USING (
    assigned_partner_id IN (
      SELECT partner_id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- merchant_settings
DROP POLICY IF EXISTS "Merchants can view own settings" ON merchant_settings;
CREATE POLICY "Merchants can view own settings"
  ON merchant_settings FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own settings" ON merchant_settings;
CREATE POLICY "Merchants can update own settings"
  ON merchant_settings FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())
    )
  );

-- partner_settings
DROP POLICY IF EXISTS "Partners can view own settings" ON partner_settings;
CREATE POLICY "Partners can view own settings"
  ON partner_settings FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can update own settings" ON partner_settings;
CREATE POLICY "Partners can update own settings"
  ON partner_settings FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );

-- notification_queue
DROP POLICY IF EXISTS "Users can view own notifications" ON notification_queue;
CREATE POLICY "Users can view own notifications"
  ON notification_queue FOR SELECT
  TO authenticated
  USING (
    (recipient_type = 'merchant' AND recipient_id IN (SELECT m.id FROM merchants m WHERE m.user_id = (select auth.uid())))
    OR (recipient_type = 'partner' AND recipient_id IN (SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())))
    OR (recipient_type = 'customer' AND recipient_id IN (SELECT c.id FROM customers c WHERE c.user_id = (select auth.uid())))
  );
