/*
  # Optimize Auth RLS Performance - Batch 2 (Academy Tables)

  1. Changes
    - Wraps all auth.uid() calls in subqueries for academy tables
    - Applies to: academy_certifications, academy_enrollments, academy_quiz_attempts, course_exam_attempts

  2. Performance Impact
    - Significantly improves academy-related queries
    - Reduces overhead for student progress tracking
    - Optimizes quiz and exam lookups

  3. Security Notes
    - Maintains exact same access control logic
    - No functional security changes
*/

-- Academy certifications
DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications"
  ON academy_certifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own certifications" ON academy_certifications;
CREATE POLICY "Users can insert own certifications"
  ON academy_certifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Academy enrollments
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

-- Academy quiz attempts
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Course exam attempts
DROP POLICY IF EXISTS "Users can view own exam attempts" ON course_exam_attempts;
CREATE POLICY "Users can view own exam attempts"
  ON course_exam_attempts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own exam attempts" ON course_exam_attempts;
CREATE POLICY "Users can insert own exam attempts"
  ON course_exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
