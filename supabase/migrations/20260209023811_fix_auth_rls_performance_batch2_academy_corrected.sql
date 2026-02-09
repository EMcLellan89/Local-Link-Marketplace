/*
  # Fix Auth RLS Performance - Batch 2: Academy Tables (Corrected)

  This migration optimizes RLS policies on academy-related tables by wrapping
  auth function calls in SELECT statements for better performance.

  ## Tables Optimized:
  - academy_courses
  - academy_modules
  - academy_lessons
  - course_exam_attempts
  - user_entitlements

  ## Performance Impact:
  Auth functions will be evaluated once per query instead of per row.
*/

-- academy_courses
DROP POLICY IF EXISTS "Anyone can view published courses" ON academy_courses;
DROP POLICY IF EXISTS "Authenticated users can view published courses" ON academy_courses;
DROP POLICY IF EXISTS "Public can view published courses" ON academy_courses;

CREATE POLICY "Anyone can view published courses"
  ON academy_courses FOR SELECT
  USING (is_published = true);

-- academy_modules
DROP POLICY IF EXISTS "Anyone can view modules" ON academy_modules;
DROP POLICY IF EXISTS "Public can view modules" ON academy_modules;

CREATE POLICY "Anyone can view modules"
  ON academy_modules FOR SELECT
  USING (true);

-- academy_lessons
DROP POLICY IF EXISTS "Anyone can view lessons" ON academy_lessons;
DROP POLICY IF EXISTS "Public can view lessons" ON academy_lessons;

CREATE POLICY "Anyone can view lessons"
  ON academy_lessons FOR SELECT
  USING (true);

-- course_exam_attempts
DROP POLICY IF EXISTS "Users can view own exam attempts" ON course_exam_attempts;
DROP POLICY IF EXISTS "Users can insert own exam attempts" ON course_exam_attempts;
DROP POLICY IF EXISTS "Users can view their exam attempts" ON course_exam_attempts;
DROP POLICY IF EXISTS "Users can create exam attempts" ON course_exam_attempts;

CREATE POLICY "Users can view own exam attempts"
  ON course_exam_attempts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own exam attempts"
  ON course_exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- user_entitlements
DROP POLICY IF EXISTS "Users can view own entitlements" ON user_entitlements;
DROP POLICY IF EXISTS "Users can view their entitlements" ON user_entitlements;

CREATE POLICY "Users can view own entitlements"
  ON user_entitlements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);