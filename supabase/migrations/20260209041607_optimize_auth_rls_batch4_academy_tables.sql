/*
  # Optimize Auth RLS Policies - Batch 4: Academy Tables

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized (20 policies)
    - academy_certifications
    - academy_courses
    - academy_enrollments
    - academy_lesson_assets
    - academy_lessons
    - academy_modules
    - academy_progress
    - academy_quiz_attempts
    - academy_quizzes

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- academy_certifications
DROP POLICY IF EXISTS "Admin full access to certifications" ON academy_certifications;
CREATE POLICY "Admin full access to certifications" ON academy_certifications
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Users can read own certifications" ON academy_certifications;
CREATE POLICY "Users can read own certifications" ON academy_certifications
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
CREATE POLICY "Users can view own certifications" ON academy_certifications
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

-- academy_courses
DROP POLICY IF EXISTS "Admin full access to courses" ON academy_courses;
CREATE POLICY "Admin full access to courses" ON academy_courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- academy_enrollments
DROP POLICY IF EXISTS "Admin full access to enrollments" ON academy_enrollments;
CREATE POLICY "Admin full access to enrollments" ON academy_enrollments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
CREATE POLICY "Users can view own enrollments" ON academy_enrollments
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own enrollments" ON academy_enrollments;
CREATE POLICY "Users can update own enrollments" ON academy_enrollments
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- academy_lesson_assets
DROP POLICY IF EXISTS "Admin full access to lesson assets" ON academy_lesson_assets;
CREATE POLICY "Admin full access to lesson assets" ON academy_lesson_assets
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Enrolled users can view lesson assets" ON academy_lesson_assets;
CREATE POLICY "Enrolled users can view lesson assets" ON academy_lesson_assets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM academy_lessons al
            JOIN academy_modules am ON am.id = al.module_id
            JOIN academy_enrollments ae ON ae.course_id = am.course_id
            WHERE al.id = academy_lesson_assets.lesson_id
                AND ae.user_id = (SELECT auth.uid())
        )
    );

-- academy_lessons
DROP POLICY IF EXISTS "Admin full access to lessons" ON academy_lessons;
CREATE POLICY "Admin full access to lessons" ON academy_lessons
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- academy_modules
DROP POLICY IF EXISTS "Admin full access to modules" ON academy_modules;
CREATE POLICY "Admin full access to modules" ON academy_modules
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- academy_progress
DROP POLICY IF EXISTS "Admin full access to progress" ON academy_progress;
CREATE POLICY "Admin full access to progress" ON academy_progress
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
CREATE POLICY "Users can view own progress" ON academy_progress
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
CREATE POLICY "Users can update own progress" ON academy_progress
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- academy_quiz_attempts
DROP POLICY IF EXISTS "Admin full access to quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Admin full access to quiz attempts" ON academy_quiz_attempts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Users can read own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can read own quiz attempts" ON academy_quiz_attempts
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON academy_quiz_attempts
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own quiz attempts" ON academy_quiz_attempts;
CREATE POLICY "Users can update own quiz attempts" ON academy_quiz_attempts
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- academy_quizzes
DROP POLICY IF EXISTS "Admin full access to quizzes" ON academy_quizzes;
CREATE POLICY "Admin full access to quizzes" ON academy_quizzes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Enrolled users can view quizzes" ON academy_quizzes;
CREATE POLICY "Enrolled users can view quizzes" ON academy_quizzes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM academy_enrollments ae
            WHERE ae.course_id = academy_quizzes.course_id
                AND ae.user_id = (SELECT auth.uid())
        )
    );