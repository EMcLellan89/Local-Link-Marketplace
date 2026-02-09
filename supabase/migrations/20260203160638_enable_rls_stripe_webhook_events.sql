/*
  # Enable RLS on stripe_webhook_events

  1. Security Improvements
    - Enables Row Level Security on stripe_webhook_events table
    - Adds policies to control access to webhook event data
    - Ensures only authorized users can view webhook events
    
  2. New Policies
    - Admins can view all webhook events
    - Service role can insert webhook events (for Stripe webhooks)
    
  3. Notes
    - RLS is enabled by default (no access unless explicitly granted)
    - Webhook events are sensitive and should only be accessible to admins
    - Service role needs insert access for processing Stripe webhooks
*/

-- Enable RLS on stripe_webhook_events table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'stripe_webhook_events'
  ) THEN
    -- Enable RLS
    ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Admins can view all webhook events" ON stripe_webhook_events;
    DROP POLICY IF EXISTS "Service role can insert webhook events" ON stripe_webhook_events;
    DROP POLICY IF EXISTS "Service role can update webhook events" ON stripe_webhook_events;
    
    -- Policy: Admins can view all webhook events
    CREATE POLICY "Admins can view all webhook events"
      ON stripe_webhook_events
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (select auth.uid())
          AND profiles.role = 'admin'
        )
      );
    
    -- Policy: Service role can insert webhook events
    CREATE POLICY "Service role can insert webhook events"
      ON stripe_webhook_events
      FOR INSERT
      TO service_role
      WITH CHECK (true);
    
    -- Policy: Service role can update webhook events
    CREATE POLICY "Service role can update webhook events"
      ON stripe_webhook_events
      FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
      
    RAISE NOTICE 'RLS enabled on stripe_webhook_events with admin and service_role policies';
  ELSE
    RAISE NOTICE 'Table stripe_webhook_events does not exist, skipping RLS setup';
  END IF;
END $$;
