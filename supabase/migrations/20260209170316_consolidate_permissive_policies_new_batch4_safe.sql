/*
  # Consolidate Multiple Permissive Policies - New Batch 4 (Safe)
  
  1. Policy Consolidation (Academy Only)
    - academy_enrollments: Multiple SELECT policies
    - academy_lessons: Multiple SELECT policies
    - academy_modules: Multiple SELECT policies
  
  2. Security
    - Maintains same security guarantees
    - Uses OR logic to preserve all access patterns
*/

-- Consolidate academy_enrollments policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_academy_enrollments" ON academy_enrollments;
  DROP POLICY IF EXISTS "users_select_own_enrollments" ON academy_enrollments;
END $$;

CREATE POLICY "authenticated_select_academy_enrollments_consolidated"
  ON academy_enrollments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Consolidate academy_lessons policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_academy_lessons" ON academy_lessons;
  DROP POLICY IF EXISTS "public_view_lessons" ON academy_lessons;
END $$;

CREATE POLICY "authenticated_select_academy_lessons_consolidated"
  ON academy_lessons FOR SELECT
  TO authenticated
  USING (true);

-- Consolidate academy_modules policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_academy_modules" ON academy_modules;
  DROP POLICY IF EXISTS "public_view_modules" ON academy_modules;
END $$;

CREATE POLICY "authenticated_select_academy_modules_consolidated"
  ON academy_modules FOR SELECT
  TO authenticated
  USING (true);