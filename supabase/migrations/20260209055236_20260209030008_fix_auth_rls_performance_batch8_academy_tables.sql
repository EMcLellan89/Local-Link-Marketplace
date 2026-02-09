/*
  # Fix Auth RLS Performance - Batch 8: Academy Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on academy tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - academy_courses (1 policy)
    - academy_lesson_assets (2 policies)
    - academy_lessons (1 policy)
    - academy_modules (1 policy)
    - academy_quizzes (2 policies)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- academy_courses policies
DROP POLICY IF EXISTS "Admin full access to courses" ON academy_courses;
CREATE POLICY "Admin full access to courses"
  ON academy_courses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- academy_lesson_assets policies
DROP POLICY IF EXISTS "Admin full access to lesson assets" ON academy_lesson_assets;
CREATE POLICY "Admin full access to lesson assets"
  ON academy_lesson_assets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Enrolled users can view lesson assets" ON academy_lesson_assets;
CREATE POLICY "Enrolled users can view lesson assets"
  ON academy_lesson_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM academy_lessons al
      JOIN academy_modules am ON am.id = al.module_id
      JOIN academy_enrollments ae ON ae.course_id = am.course_id
      WHERE al.id = academy_lesson_assets.lesson_id
        AND ae.user_id = (select auth.uid())
    )
  );

-- academy_lessons policies
DROP POLICY IF EXISTS "Admin full access to lessons" ON academy_lessons;
CREATE POLICY "Admin full access to lessons"
  ON academy_lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- academy_modules policies
DROP POLICY IF EXISTS "Admin full access to modules" ON academy_modules;
CREATE POLICY "Admin full access to modules"
  ON academy_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- academy_quizzes policies
DROP POLICY IF EXISTS "Admin full access to quizzes" ON academy_quizzes;
CREATE POLICY "Admin full access to quizzes"
  ON academy_quizzes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Enrolled users can view quizzes" ON academy_quizzes;
CREATE POLICY "Enrolled users can view quizzes"
  ON academy_quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM academy_enrollments ae
      WHERE ae.course_id = academy_quizzes.course_id
        AND ae.user_id = (select auth.uid())
    )
  );