/*
  # Optimize Auth RLS Initialization - Batch 38 (Academy)

  1. Problem
    - RLS policies call auth.uid() directly for each row
    - Should wrap in (SELECT auth.uid()) to evaluate once per query

  2. Tables Fixed
    - academy_quiz_attempts
    - academy_certifications
    - academy_enrollments
    - academy_progress

  3. Performance Impact
    - Reduces auth overhead for academy queries
    - Improves performance for student progress tracking
*/

-- Academy Quiz Attempts
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
DROP POLICY IF EXISTS "Users can create own quiz attempts" ON academy_quiz_attempts;

CREATE POLICY "Users can view own quiz attempts"
ON academy_quiz_attempts FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own quiz attempts"
ON academy_quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Academy Certifications
DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;

CREATE POLICY "Users can view own certifications"
ON academy_certifications FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Academy Enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
DROP POLICY IF EXISTS "Users can create own enrollments" ON academy_enrollments;

CREATE POLICY "Users can view own enrollments"
ON academy_enrollments FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own enrollments"
ON academy_enrollments FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Academy Progress
DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;

CREATE POLICY "Users can view own progress"
ON academy_progress FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own progress"
ON academy_progress FOR ALL
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));