/*
  # Fix Always-True RLS Policies (Corrected)
  
  1. Security Enhancement
    - Fixes policies that allow unrestricted access (USING true)
    - Adds proper access controls based on user roles and ownership
  
  2. Tables Fixed
    - audit_log: Restrict to admins and actors (actor_user_id)
    - creative_events: Restrict to partners tracking their own creatives
*/

-- Fix audit_log policies
DO $$
BEGIN
  -- Drop existing overly permissive policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON audit_log;
  DROP POLICY IF EXISTS "Public can view audit log" ON audit_log;
  DROP POLICY IF EXISTS "allow_public_select" ON audit_log;
  
  -- Create restrictive policies
  CREATE POLICY "Admins can view audit log"
    ON audit_log
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
      )
    );
    
  CREATE POLICY "Users can view entries they created"
    ON audit_log
    FOR SELECT
    TO authenticated
    USING (actor_user_id = (SELECT auth.uid()));
    
  CREATE POLICY "System can insert audit entries"
    ON audit_log
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
END $$;

-- Fix creative_events policies  
DO $$
BEGIN
  -- Drop existing overly permissive policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON creative_events;
  DROP POLICY IF EXISTS "Public can view creative events" ON creative_events;
  DROP POLICY IF EXISTS "allow_public_select" ON creative_events;
  
  -- Create restrictive policies based on partner ownership
  CREATE POLICY "Partners can view own creative events"
    ON creative_events
    FOR SELECT
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
      )
    );
    
  CREATE POLICY "Users can view creative events for their profile"
    ON creative_events
    FOR SELECT
    TO authenticated
    USING (profile_id = (SELECT auth.uid()));
    
  CREATE POLICY "System can track creative events"
    ON creative_events
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
    
  CREATE POLICY "Admins can view all creative events"
    ON creative_events
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
      )
    );
END $$;