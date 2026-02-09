/*
  # Fix Auth RLS Performance - Batch 2: Academy Tables

  Optimizes RLS policies for academy tables to use (SELECT auth.<function>()) pattern.

  ## Tables Modified
  - academy_certifications (2 policies)
  - academy_courses (1 policy)
  - academy_enrollments (3 policies)
  - academy_lesson_assets (1 policy)
  - academy_lessons (1 policy)
  - academy_modules (1 policy)
  - academy_progress (3 policies)
  - academy_quiz_attempts (3 policies)
  - academy_quizzes (1 policy)

  Total: 16 policies optimized
*/

-- academy_certifications
DROP POLICY IF EXISTS "Admin full access to certifications" ON academy_certifications;
CREATE POLICY "Admin full access to certifications"
  ON academy_certifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications"
  ON academy_certifications
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- academy_courses
DROP POLICY IF EXISTS "Admin full access to courses" ON academy_courses;
CREATE POLICY "Admin full access to courses"
  ON academy_courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- academy_enrollments
DROP POLICY IF EXISTS "Admin full access to enrollments" ON academy_enrollments;
CREATE POLICY "Admin full access to enrollments"
  ON academy_enrollments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users can update own enrollments" ON academy_enrollments;
CREATE POLICY "Users can update own enrollments"
  ON academy_enrollments
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON academy_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- academy_lesson_assets
DROP POLICY IF EXISTS "Admin full access to lesson assets" ON academy_lesson_assets;
CREATE POLICY "Admin full access to lesson assets"
  ON academy_lesson_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- academy_lessons
DROP POLICY IF EXISTS "Admin full access to lessons" ON academy_lessons;
CREATE POLICY "Admin full access to lessons"
  ON academy_lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- academy_modules
DROP POLICY IF EXISTS "Admin full access to modules" ON academy_modules;
CREATE POLICY "Admin full access to modules"
  ON academy_modules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- academy_progress
DROP POLICY IF EXISTS "Admin full access to progress" ON academy_progress;
CREATE POLICY "Admin full access to progress"
  ON academy_progress
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress"
  ON academy_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress"
  ON academy_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- academy_quiz_attempts
DROP POLICY IF EXISTS "Admin full access to quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Admin full access to quiz attempts"
  ON academy_quiz_attempts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users can update own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can update own quiz attempts"
  ON academy_quiz_attempts
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- academy_quizzes
DROP POLICY IF EXISTS "Admin full access to quizzes" ON academy_quizzes;
CREATE POLICY "Admin full access to quizzes"
  ON academy_quizzes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );