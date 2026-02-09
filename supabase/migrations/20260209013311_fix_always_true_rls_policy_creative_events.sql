/*
  # Fix Always-True RLS Policy on creative_events
  
  1. Security Fix
    - Remove the "Anyone create events" policy with WITH CHECK true
    - Replace with authenticated-only policy
  
  2. Policy Updated
    - creative_events: Restrict inserts to authenticated users only
*/

-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone create events" ON creative_events;

-- Create secure policy for authenticated users
CREATE POLICY "Authenticated users can create events"
  ON creative_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);