/*
  # Add RLS Policies for webhook_events Table
  
  1. Security
    - Enables RLS on webhook_events table (already enabled)
    - Adds policies to allow only service role and admin users to access webhook events
    - Webhook events contain sensitive payment provider data
    
  2. Policies
    - Service role can do everything (for edge functions)
    - Admin users can view webhook events for debugging
    - No access for regular authenticated users
*/

-- Policy: Service role can manage all webhook events
CREATE POLICY "Service role can manage webhook events"
  ON webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Admin users can view webhook events
CREATE POLICY "Admin users can view webhook events"
  ON webhook_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = (select auth.uid())
    )
  );
