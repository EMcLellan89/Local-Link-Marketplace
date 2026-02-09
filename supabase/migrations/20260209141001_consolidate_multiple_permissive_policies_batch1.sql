/*
  # Consolidate Multiple Permissive Policies - Batch 1

  This migration consolidates tables that have multiple permissive policies for the same
  role and action, which can cause performance issues.
  
  ## Tables Fixed:
  - academy_certifications (consolidate SELECT policies)
  - academy_enrollments (consolidate SELECT and INSERT policies)
  - academy_lesson_assets (consolidate SELECT policies)
  - academy_progress (consolidate SELECT and UPDATE policies)
  - academy_quiz_attempts (consolidate SELECT and INSERT policies)
  - academy_quizzes (consolidate SELECT policies)
*/

-- Academy Certifications - Consolidate SELECT policies
DO $$
BEGIN
  -- Drop old policies
  DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
  DROP POLICY IF EXISTS "Users view own certificates" ON academy_certifications;
  
  -- Create consolidated policy
  CREATE POLICY "Users can view own certifications"
    ON academy_certifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Academy Enrollments - Consolidate SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
  DROP POLICY IF EXISTS "Users view own enrollments" ON academy_enrollments;
  
  CREATE POLICY "Users can view own enrollments"
    ON academy_enrollments FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Academy Enrollments - Consolidate INSERT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can enroll in courses" ON academy_enrollments;
  DROP POLICY IF EXISTS "Users can create own enrollments" ON academy_enrollments;
  
  CREATE POLICY "Users can create own enrollments"
    ON academy_enrollments FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
END $$;

-- Academy Lesson Assets - Consolidate SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view lesson assets" ON academy_lesson_assets;
  DROP POLICY IF EXISTS "Anyone can view lesson assets" ON academy_lesson_assets;
  
  CREATE POLICY "Users can view lesson assets"
    ON academy_lesson_assets FOR SELECT
    TO authenticated
    USING (true);
END $$;

-- Academy Progress - Consolidate SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;
  DROP POLICY IF EXISTS "Users view own progress" ON academy_progress;
  
  CREATE POLICY "Users can view own progress"
    ON academy_progress FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Academy Progress - Consolidate UPDATE policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
  DROP POLICY IF EXISTS "Users update own progress" ON academy_progress;
  
  CREATE POLICY "Users can update own progress"
    ON academy_progress FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;

-- Academy Quiz Attempts - Consolidate SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
  DROP POLICY IF EXISTS "Users view own attempts" ON academy_quiz_attempts;
  
  CREATE POLICY "Users can view own quiz attempts"
    ON academy_quiz_attempts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Academy Quiz Attempts - Consolidate INSERT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can create quiz attempts" ON academy_quiz_attempts;
  DROP POLICY IF EXISTS "Users can submit quiz attempts" ON academy_quiz_attempts;
  
  CREATE POLICY "Users can create quiz attempts"
    ON academy_quiz_attempts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
END $$;

-- Academy Quizzes - Consolidate SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view quizzes" ON academy_quizzes;
  DROP POLICY IF EXISTS "Anyone can view quizzes" ON academy_quizzes;
  
  CREATE POLICY "Users can view quizzes"
    ON academy_quizzes FOR SELECT
    TO authenticated
    USING (true);
END $$;
