/*
  # Optimize RLS Policies Performance
  
  1. Performance Optimization
    - Replace all `auth.uid()` with `(select auth.uid())` in RLS policies
    - Replace all `auth.jwt()` with `(select auth.jwt())` in RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Critical for query performance at scale
  
  2. Tables Updated
    - All tables with RLS policies using auth functions
    - Policies are dropped and recreated with optimized syntax
    - No functional changes, only performance improvements
  
  3. Notes
    - Wrapping auth functions in SELECT evaluates them once per query
    - Dramatically improves performance on large result sets
    - Recommended best practice by Supabase
*/

-- Drop and recreate policies for postcard_placements
DROP POLICY IF EXISTS "Admins can manage postcard placements" ON postcard_placements;
CREATE POLICY "Admins can manage postcard placements"
  ON postcard_placements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Drop and recreate policies for merchant_subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON merchant_subscriptions;
DROP POLICY IF EXISTS "Merchants can insert own subscriptions" ON merchant_subscriptions;
DROP POLICY IF EXISTS "Merchants can update own subscriptions" ON merchant_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own subscriptions" ON merchant_subscriptions;

CREATE POLICY "Admins can view all subscriptions"
  ON merchant_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Merchants can insert own subscriptions"
  ON merchant_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_subscriptions.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own subscriptions"
  ON merchant_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_subscriptions.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own subscriptions"
  ON merchant_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_subscriptions.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for postcard_mailings
DROP POLICY IF EXISTS "Admins can manage postcard mailings" ON postcard_mailings;
CREATE POLICY "Admins can manage postcard mailings"
  ON postcard_mailings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Drop and recreate policies for printing_orders
DROP POLICY IF EXISTS "Admins can manage all printing orders" ON printing_orders;
DROP POLICY IF EXISTS "Merchants can create printing orders" ON printing_orders;
DROP POLICY IF EXISTS "Merchants can update own printing orders" ON printing_orders;
DROP POLICY IF EXISTS "Merchants can view own printing orders" ON printing_orders;

CREATE POLICY "Admins can manage all printing orders"
  ON printing_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Merchants can create printing orders"
  ON printing_orders FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own printing orders"
  ON printing_orders FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own printing orders"
  ON printing_orders FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for printing_products
DROP POLICY IF EXISTS "Admins can manage products" ON printing_products;
CREATE POLICY "Admins can manage products"
  ON printing_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Drop and recreate policies for customer_preferences
DROP POLICY IF EXISTS "Customers can insert their own preferences" ON customer_preferences;
DROP POLICY IF EXISTS "Customers can update their own preferences" ON customer_preferences;
DROP POLICY IF EXISTS "Customers can view their own preferences" ON customer_preferences;

CREATE POLICY "Customers can insert their own preferences"
  ON customer_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can update their own preferences"
  ON customer_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own preferences"
  ON customer_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for referrals
DROP POLICY IF EXISTS "Customers can create referrals" ON referrals;
DROP POLICY IF EXISTS "Customers can view their own referrals" ON referrals;

CREATE POLICY "Customers can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = referrals.referrer_customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.user_id = (select auth.uid())
      AND (customers.id = referrals.referrer_customer_id OR customers.id = referrals.referred_customer_id)
    )
  );

-- Drop and recreate policies for social_shares
DROP POLICY IF EXISTS "Customers can create social shares" ON social_shares;
DROP POLICY IF EXISTS "Customers can view their own social shares" ON social_shares;

CREATE POLICY "Customers can create social shares"
  ON social_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = social_shares.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own social shares"
  ON social_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = social_shares.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for crm_migrations
DROP POLICY IF EXISTS "Merchants can create CRM migration orders" ON crm_migrations;
DROP POLICY IF EXISTS "Merchants can update own CRM migrations" ON crm_migrations;
DROP POLICY IF EXISTS "Merchants can view own CRM migrations" ON crm_migrations;

CREATE POLICY "Merchants can create CRM migration orders"
  ON crm_migrations FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own CRM migrations"
  ON crm_migrations FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own CRM migrations"
  ON crm_migrations FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for ai_bot_setups
DROP POLICY IF EXISTS "Merchants can create AI bot orders" ON ai_bot_setups;
DROP POLICY IF EXISTS "Merchants can update own AI bot setups" ON ai_bot_setups;
DROP POLICY IF EXISTS "Merchants can view own AI bot setups" ON ai_bot_setups;

CREATE POLICY "Merchants can create AI bot orders"
  ON ai_bot_setups FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own AI bot setups"
  ON ai_bot_setups FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own AI bot setups"
  ON ai_bot_setups FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for swipe_file_access
DROP POLICY IF EXISTS "Merchants can create swipe file access" ON swipe_file_access;
DROP POLICY IF EXISTS "Merchants can view own swipe file access" ON swipe_file_access;

CREATE POLICY "Merchants can create swipe file access"
  ON swipe_file_access FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own swipe file access"
  ON swipe_file_access FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for lead_list_orders
DROP POLICY IF EXISTS "Merchants can create lead orders" ON lead_list_orders;
DROP POLICY IF EXISTS "Merchants can view own lead orders" ON lead_list_orders;

CREATE POLICY "Merchants can create lead orders"
  ON lead_list_orders FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own lead orders"
  ON lead_list_orders FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for appointment_setting_bookings
DROP POLICY IF EXISTS "Merchants can create appointment bookings" ON appointment_setting_bookings;
DROP POLICY IF EXISTS "Merchants can update own appointment bookings" ON appointment_setting_bookings;
DROP POLICY IF EXISTS "Merchants can view own appointment bookings" ON appointment_setting_bookings;

CREATE POLICY "Merchants can create appointment bookings"
  ON appointment_setting_bookings FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own appointment bookings"
  ON appointment_setting_bookings FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own appointment bookings"
  ON appointment_setting_bookings FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for merchant_services_applications
DROP POLICY IF EXISTS "Merchants can apply for merchant services" ON merchant_services_applications;
DROP POLICY IF EXISTS "Merchants can update own applications" ON merchant_services_applications;
DROP POLICY IF EXISTS "Merchants can view own merchant services" ON merchant_services_applications;

CREATE POLICY "Merchants can apply for merchant services"
  ON merchant_services_applications FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own applications"
  ON merchant_services_applications FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own merchant services"
  ON merchant_services_applications FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for business_capital_applications
DROP POLICY IF EXISTS "Merchants can create capital applications" ON business_capital_applications;
DROP POLICY IF EXISTS "Merchants can update own capital applications" ON business_capital_applications;
DROP POLICY IF EXISTS "Merchants can view own capital applications" ON business_capital_applications;

CREATE POLICY "Merchants can create capital applications"
  ON business_capital_applications FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own capital applications"
  ON business_capital_applications FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own capital applications"
  ON business_capital_applications FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for recruiting_services
DROP POLICY IF EXISTS "Merchants can order recruiting services" ON recruiting_services;
DROP POLICY IF EXISTS "Merchants can view own recruiting services" ON recruiting_services;

CREATE POLICY "Merchants can order recruiting services"
  ON recruiting_services FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own recruiting services"
  ON recruiting_services FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for dashboard_metrics
DROP POLICY IF EXISTS "Merchants can insert own metrics" ON dashboard_metrics;
DROP POLICY IF EXISTS "Merchants can update own metrics" ON dashboard_metrics;
DROP POLICY IF EXISTS "Merchants can view own dashboard metrics" ON dashboard_metrics;

CREATE POLICY "Merchants can insert own metrics"
  ON dashboard_metrics FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own metrics"
  ON dashboard_metrics FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own dashboard metrics"
  ON dashboard_metrics FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for website_orders
DROP POLICY IF EXISTS "Merchants can create website orders" ON website_orders;
DROP POLICY IF EXISTS "Merchants can update own website orders" ON website_orders;
DROP POLICY IF EXISTS "Merchants can view own website orders" ON website_orders;

CREATE POLICY "Merchants can create website orders"
  ON website_orders FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can update own website orders"
  ON website_orders FOR UPDATE
  TO authenticated
  USING (merchant_id = (select auth.uid()));

CREATE POLICY "Merchants can view own website orders"
  ON website_orders FOR SELECT
  TO authenticated
  USING (merchant_id = (select auth.uid()));

-- Drop and recreate policies for website_templates
DROP POLICY IF EXISTS "Admins can manage templates" ON website_templates;
CREATE POLICY "Admins can manage templates"
  ON website_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Continue with part 2 in next section due to length...
