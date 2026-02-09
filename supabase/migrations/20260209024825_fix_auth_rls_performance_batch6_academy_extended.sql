/*
  # Fix Auth RLS Performance - Batch 6: Academy Extended Tables

  1. Purpose
    - Optimize RLS policies to evaluate auth.uid() once per query instead of per row
    - Wrap auth.uid() in subquery: (select auth.uid())
  
  2. Tables Affected
    - academy_certifications
    - academy_enrollments
    - academy_lesson_assets
    - academy_progress
    - academy_quiz_attempts
    - academy_quizzes
  
  3. Performance Impact
    - Reduces repeated auth function calls
    - Improves query performance significantly
*/

-- academy_certifications policies
DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications"
  ON academy_certifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own certifications" ON academy_certifications;
CREATE POLICY "Users can insert own certifications"
  ON academy_certifications FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- academy_enrollments policies
DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON academy_enrollments FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own enrollments" ON academy_enrollments;
CREATE POLICY "Users can insert own enrollments"
  ON academy_enrollments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- academy_lesson_assets policies (public read for enrolled users)
DROP POLICY IF EXISTS "Enrolled users can view lesson assets" ON academy_lesson_assets;
CREATE POLICY "Enrolled users can view lesson assets"
  ON academy_lesson_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM academy_enrollments e
      JOIN academy_lessons l ON l.module_id IN (
        SELECT module_id FROM academy_modules WHERE course_id = e.course_id
      )
      WHERE e.user_id = (select auth.uid())
        AND l.id = academy_lesson_assets.lesson_id
    )
  );

-- academy_progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress"
  ON academy_progress FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON academy_progress;
CREATE POLICY "Users can insert own progress"
  ON academy_progress FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress"
  ON academy_progress FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- academy_quiz_attempts policies
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- academy_quizzes policies (public read for enrolled users)
DROP POLICY IF EXISTS "Enrolled users can view quizzes" ON academy_quizzes;
CREATE POLICY "Enrolled users can view quizzes"
  ON academy_quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM academy_enrollments e
      WHERE e.user_id = (select auth.uid())
        AND e.course_id = academy_quizzes.course_id
    )
  );
