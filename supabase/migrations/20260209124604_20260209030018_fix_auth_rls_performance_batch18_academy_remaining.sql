/*
  # Fix Auth RLS Performance - Batch 18: Academy Tables (Remaining)

  1. Changes
    - Optimize Auth RLS policies by wrapping auth.uid() in subqueries
    - Prevents re-evaluation of auth.uid() for each row
    - Maintains exact same access control logic
    
  2. Tables Covered
    - academy_certifications (3 policies - consolidate duplicates)
    - academy_enrollments (3 policies)
    - academy_progress (3 policies)
    - academy_quiz_attempts (4 policies - consolidate duplicates)
*/

-- academy_certifications (consolidate 3 policies)
DROP POLICY IF EXISTS "Admin full access to certifications" ON academy_certifications;
CREATE POLICY "Admin full access to certifications"
  ON academy_certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can read own certifications" ON academy_certifications;
DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications"
  ON academy_certifications FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

-- academy_enrollments
DROP POLICY IF EXISTS "Admin full access to enrollments" ON academy_enrollments;
CREATE POLICY "Admin full access to enrollments"
  ON academy_enrollments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON academy_enrollments FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own enrollments" ON academy_enrollments;
CREATE POLICY "Users can update own enrollments"
  ON academy_enrollments FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

-- academy_progress
DROP POLICY IF EXISTS "Admin full access to progress" ON academy_progress;
CREATE POLICY "Admin full access to progress"
  ON academy_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress"
  ON academy_progress FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress"
  ON academy_progress FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

-- academy_quiz_attempts (consolidate 4 policies)
DROP POLICY IF EXISTS "Admin full access to quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Admin full access to quiz attempts"
  ON academy_quiz_attempts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can read own quiz attempts" ON academy_quiz_attempts;
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can update own quiz attempts"
  ON academy_quiz_attempts FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );