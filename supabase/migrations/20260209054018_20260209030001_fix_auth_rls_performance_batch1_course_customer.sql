/*
  # Optimize Auth RLS Performance - Batch 1 (Core Tables)

  1. Changes
    - Wraps all auth.uid() calls in subqueries: (select auth.uid())
    - Prevents auth function re-evaluation for each row
    - Applies to: courses, academy_progress, customers

  2. Performance Impact
    - Reduces query planning overhead significantly
    - Prevents repeated auth lookups during row filtering
    - Can improve query performance by 10-100x on large tables

  3. Security Notes
    - Maintains exact same security logic
    - Only optimization technique changes
    - No functional changes to access control
*/

-- Courses table
DROP POLICY IF EXISTS "Users can view courses they have access to" ON courses;
CREATE POLICY "Users can view courses they have access to"
  ON courses FOR SELECT
  TO authenticated
  USING (
    target_audience = 'public'
    OR EXISTS (
      SELECT 1 FROM user_entitlements
      WHERE user_entitlements.user_id = (select auth.uid())
      AND user_entitlements.course_id = courses.id
    )
  );

-- Academy progress
DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress"
  ON academy_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress"
  ON academy_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own progress" ON academy_progress;
CREATE POLICY "Users can insert own progress"
  ON academy_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Customers table
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Customers can update own data" ON customers;
CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
