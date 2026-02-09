/*
  # Fix Auth RLS Initialization - academy_quiz_attempts

  1. Purpose
    - Fix RLS policy that re-evaluates auth.uid() for each row
    - Improve query performance by using (select auth.uid())
    
  2. Changes
    - Drop and recreate "Users can create quiz attempts" policy with optimized auth call
*/

-- Drop the policy
DROP POLICY IF EXISTS "Users can create quiz attempts" ON academy_quiz_attempts;

-- Recreate with optimized auth call
CREATE POLICY "Users can create quiz attempts"
  ON academy_quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
