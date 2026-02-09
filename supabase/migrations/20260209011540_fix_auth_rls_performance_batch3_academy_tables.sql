/*
  # Fix Auth RLS Performance - Batch 3: Academy Tables
  
  This migration optimizes RLS policies for academy-related tables.
  
  ## Tables Updated
  - academy_enrollments
  - academy_progress
  - academy_certifications
  - academy_quiz_attempts
  
  ## Security Impact
  - Maintains existing security model
  - Improves query performance
*/

-- academy_enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON academy_enrollments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own enrollments" ON academy_enrollments;
CREATE POLICY "Users can create own enrollments"
  ON academy_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own enrollments" ON academy_enrollments;
CREATE POLICY "Users can update own enrollments"
  ON academy_enrollments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- academy_progress
DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress"
  ON academy_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own progress" ON academy_progress;
CREATE POLICY "Users can create own progress"
  ON academy_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress"
  ON academy_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- academy_certifications
DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications"
  ON academy_certifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own certifications" ON academy_certifications;
CREATE POLICY "Users can create own certifications"
  ON academy_certifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- academy_quiz_attempts
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can create own quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can update own quiz attempts"
  ON academy_quiz_attempts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
