/*
  # Fix Security and Performance Issues
  
  This migration addresses critical security and performance issues identified in the database audit:
  
  1. **Missing Foreign Key Indexes**
     - Add index on admin_sessions(admin_user_id)
     - Add index on paybright_refunds(requested_by)
  
  2. **RLS Policy Performance Optimization**
     - Fix 25+ policies to use (SELECT auth.uid()) pattern instead of auth.uid()
     - This prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale
     
  3. **Function Security**
     - Set secure search_path on all trigger functions
     - Prevents SQL injection via search_path manipulation
  
  4. **Tables Affected by RLS Fixes**
     - paybright_config
     - paybright_transactions
     - paybright_subscriptions
     - paybright_refunds
     - paybright_audit_log
     - appointments
     - swipe_file_favorites
     - merchant_orders
     - loyalty_contract_uploads
*/

-- =====================================================
-- PART 1: Add Missing Foreign Key Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id 
  ON admin_sessions(admin_user_id);

CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by 
  ON paybright_refunds(requested_by);

-- =====================================================
-- PART 2: Fix RLS Policies - PayBright Config
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own PayBright config" ON paybright_config;
CREATE POLICY "Merchants can view own PayBright config"
  ON paybright_config FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can insert own PayBright config" ON paybright_config;
CREATE POLICY "Merchants can insert own PayBright config"
  ON paybright_config FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can update own PayBright config" ON paybright_config;
CREATE POLICY "Merchants can update own PayBright config"
  ON paybright_config FOR UPDATE
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ))
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

-- =====================================================
-- PART 3: Fix RLS Policies - PayBright Transactions
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own transactions" ON paybright_transactions;
CREATE POLICY "Merchants can view own transactions"
  ON paybright_transactions FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Customers can view own transactions" ON paybright_transactions;
CREATE POLICY "Customers can view own transactions"
  ON paybright_transactions FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
  ));

-- =====================================================
-- PART 4: Fix RLS Policies - PayBright Subscriptions
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own subscriptions" ON paybright_subscriptions;
CREATE POLICY "Merchants can view own subscriptions"
  ON paybright_subscriptions FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Customers can view own subscriptions" ON paybright_subscriptions;
CREATE POLICY "Customers can view own subscriptions"
  ON paybright_subscriptions FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
  ));

-- =====================================================
-- PART 5: Fix RLS Policies - PayBright Refunds
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own refunds" ON paybright_refunds;
CREATE POLICY "Merchants can view own refunds"
  ON paybright_refunds FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can create refunds" ON paybright_refunds;
CREATE POLICY "Merchants can create refunds"
  ON paybright_refunds FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
    AND requested_by = (SELECT auth.uid())
  );

-- =====================================================
-- PART 6: Fix RLS Policies - PayBright Audit Log
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own audit log" ON paybright_audit_log;
CREATE POLICY "Merchants can view own audit log"
  ON paybright_audit_log FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can view own audit log" ON paybright_audit_log;
CREATE POLICY "Users can view own audit log"
  ON paybright_audit_log FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- PART 7: Fix RLS Policies - Appointments
-- =====================================================

DROP POLICY IF EXISTS "Customers can view own appointments" ON appointments;
CREATE POLICY "Customers can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Customers can create appointments" ON appointments;
CREATE POLICY "Customers can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
  ));

-- =====================================================
-- PART 8: Fix RLS Policies - Swipe File Favorites
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own favorites" ON swipe_file_favorites;
CREATE POLICY "Merchants can view own favorites"
  ON swipe_file_favorites FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can add favorites" ON swipe_file_favorites;
CREATE POLICY "Merchants can add favorites"
  ON swipe_file_favorites FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can remove favorites" ON swipe_file_favorites;
CREATE POLICY "Merchants can remove favorites"
  ON swipe_file_favorites FOR DELETE
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

-- =====================================================
-- PART 9: Fix RLS Policies - Merchant Orders
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own orders" ON merchant_orders;
CREATE POLICY "Merchants can view own orders"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can create own orders" ON merchant_orders;
CREATE POLICY "Merchants can create own orders"
  ON merchant_orders FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Admins can view all orders" ON merchant_orders;
CREATE POLICY "Admins can view all orders"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all orders" ON merchant_orders;
CREATE POLICY "Admins can update all orders"
  ON merchant_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- =====================================================
-- PART 10: Fix RLS Policies - Loyalty Contract Uploads
-- =====================================================

DROP POLICY IF EXISTS "Merchants can view own contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Merchants can view own contract uploads"
  ON loyalty_contract_uploads FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can insert own contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Merchants can insert own contract uploads"
  ON loyalty_contract_uploads FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Merchants can update own contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Merchants can update own contract uploads"
  ON loyalty_contract_uploads FOR UPDATE
  TO authenticated
  USING (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ))
  WITH CHECK (merchant_id IN (
    SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Admins can view all contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Admins can view all contract uploads"
  ON loyalty_contract_uploads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Admins can update all contract uploads"
  ON loyalty_contract_uploads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- =====================================================
-- PART 11: Fix Function Security - Set Secure Search Path
-- =====================================================

ALTER FUNCTION update_paybright_updated_at() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION update_updated_at_column() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION check_webhook_duplicate() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION validate_refund_amount() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION cleanup_old_rate_limits() SECURITY DEFINER SET search_path = public, pg_temp;
