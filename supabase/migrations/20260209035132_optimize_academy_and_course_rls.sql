/*
  # Optimize Academy and Course Related RLS Policies

  1. Purpose
    - Optimize RLS policies for academy/course tables
    - Improve performance for educational content access

  2. Tables Fixed
    - academy_certifications
    - academy_quiz_attempts
    - course_exam_attempts
    - user_subscriptions
    - user_entitlements
*/

-- Optimize academy_certifications policies
DROP POLICY IF EXISTS "Users can read own certifications" ON academy_certifications;

CREATE POLICY "Users can read own certifications"
  ON academy_certifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Optimize academy_quiz_attempts policies
DROP POLICY IF EXISTS "Users can read own quiz attempts" ON academy_quiz_attempts;
DROP POLICY IF EXISTS "Users can create quiz attempts" ON academy_quiz_attempts;

CREATE POLICY "Users can read own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Optimize course_exam_attempts policies
DROP POLICY IF EXISTS "Users can read own exam attempts" ON course_exam_attempts;
DROP POLICY IF EXISTS "Users can create exam attempts" ON course_exam_attempts;

CREATE POLICY "Users can read own exam attempts"
  ON course_exam_attempts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create exam attempts"
  ON course_exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Optimize user_subscriptions policies
DROP POLICY IF EXISTS "Users can read own subscriptions" ON user_subscriptions;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Optimize user_entitlements policies
DROP POLICY IF EXISTS "Users can read own entitlements" ON user_entitlements;

CREATE POLICY "Users can read own entitlements"
  ON user_entitlements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);
