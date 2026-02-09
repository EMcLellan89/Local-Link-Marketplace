/*
  # Fix Auth RLS Performance - Batch 2: More direct auth.uid() calls
  
  1. Performance Improvement
    - Wrap more auth.uid() calls in SELECT to prevent re-evaluation
  
  2. Policies Updated
    - partner_badges: Admin manage
    - partner_certifications: Admin full access
    - partner_certs: Admin manage
    - partner_playbook_progress: Partners can modify own progress
    - story_books: Own books access
    - story_jobs: Own jobs access
    - story_pages: Own pages access
    - story_projects: Own projects access
*/

-- partner_badges
DROP POLICY IF EXISTS "partner_badges_admin_manage" ON partner_badges;
CREATE POLICY "partner_badges_admin_manage"
  ON partner_badges
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- partner_certifications
DROP POLICY IF EXISTS "Admin full access to partner certifications" ON partner_certifications;
CREATE POLICY "Admin full access to partner certifications"
  ON partner_certifications
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

-- partner_certs
DROP POLICY IF EXISTS "partner_certs_admin_manage" ON partner_certs;
CREATE POLICY "partner_certs_admin_manage"
  ON partner_certs
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = (select auth.uid())
  ));

-- partner_playbook_progress
DROP POLICY IF EXISTS "Partners can modify own progress" ON partner_playbook_progress;
CREATE POLICY "Partners can modify own progress"
  ON partner_playbook_progress
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- story_books
DROP POLICY IF EXISTS "story_books_own" ON story_books;
CREATE POLICY "story_books_own"
  ON story_books
  FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- story_jobs
DROP POLICY IF EXISTS "story_jobs_own" ON story_jobs;
CREATE POLICY "story_jobs_own"
  ON story_jobs
  FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- story_pages
DROP POLICY IF EXISTS "story_pages_own" ON story_pages;
CREATE POLICY "story_pages_own"
  ON story_pages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM story_books b
    WHERE b.id = story_pages.book_id
      AND b.profile_id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM story_books b
    WHERE b.id = story_pages.book_id
      AND b.profile_id = (select auth.uid())
  ));

-- story_projects
DROP POLICY IF EXISTS "story_projects_own" ON story_projects;
CREATE POLICY "story_projects_own"
  ON story_projects
  FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));