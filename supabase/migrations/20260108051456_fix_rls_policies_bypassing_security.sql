/*
  # Fix RLS Policies That Bypass Security
  
  1. Security Fixes
    - Remove 8 RLS policies that use USING (true) and WITH CHECK (true)
    - These policies effectively bypass row-level security
    - Service role already bypasses RLS by default, so these policies are redundant
  
  2. Affected Tables
    - merchant_addon_subscriptions
    - notification_queue
    - partner_subscriptions
    - service_bookings
    - system_settings
    - territory_licenses
    - usage_tracking
    - webhook_events
  
  3. Important Notes
    - Service role in Supabase automatically bypasses RLS
    - Explicit "always true" policies are redundant and create security confusion
    - Other existing policies on these tables remain intact for proper access control
*/

-- Drop redundant service role policies that bypass security
DROP POLICY IF EXISTS "Service role can manage addon subscriptions" ON merchant_addon_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all notifications" ON notification_queue;
DROP POLICY IF EXISTS "Service role can manage partner subscriptions" ON partner_subscriptions;
DROP POLICY IF EXISTS "Service role can manage service bookings" ON service_bookings;
DROP POLICY IF EXISTS "Service role can manage all settings" ON system_settings;
DROP POLICY IF EXISTS "Service role can manage territory licenses" ON territory_licenses;
DROP POLICY IF EXISTS "Service role can manage usage tracking" ON usage_tracking;
DROP POLICY IF EXISTS "Service role can manage webhook events" ON webhook_events;
