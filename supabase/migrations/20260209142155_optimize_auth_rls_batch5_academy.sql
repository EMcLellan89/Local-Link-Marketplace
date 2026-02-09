/*
  # Optimize Auth RLS Performance - Batch 5: Academy Tables

  1. Changes
    - Wrap auth.uid() in (SELECT auth.uid()) for Academy tables
    - Affects: academy_quiz_attempts, academy_certifications, 
               academy_enrollments, academy_progress
  
  2. Performance Impact
    - Reduces auth function calls from N (rows) to 1 per query
    - Improves academy system query performance
*/

-- Academy Quiz Attempts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own quiz attempts" ON academy_quiz_attempts;
  DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON academy_quiz_attempts;
  
  CREATE POLICY "Users can view own quiz attempts"
    ON academy_quiz_attempts FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
  
  CREATE POLICY "Users can insert own quiz attempts"
    ON academy_quiz_attempts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Academy Certifications
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own certifications" ON academy_certifications;
  
  CREATE POLICY "Users can view own certifications"
    ON academy_certifications FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
END $$;

-- Academy Enrollments
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
  DROP POLICY IF EXISTS "Users can insert own enrollments" ON academy_enrollments;
  
  CREATE POLICY "Users can view own enrollments"
    ON academy_enrollments FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
  
  CREATE POLICY "Users can insert own enrollments"
    ON academy_enrollments FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Academy Progress
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own progress" ON academy_progress;
  
  CREATE POLICY "Users can manage own progress"
    ON academy_progress FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;
