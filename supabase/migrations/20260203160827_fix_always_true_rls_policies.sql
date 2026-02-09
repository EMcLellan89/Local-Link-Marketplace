/*
  # Fix Always-True RLS Policies

  1. Security Improvements
    - Reviews and fixes policies with USING (true) that shouldn't be public
    - Ensures sensitive data isn't accidentally exposed
    - Maintains intentionally public policies for reference data
    
  2. Problem Policies Fixed
    - admin_sessions: Should only be accessible to the session owner
    - admin_users: Should only be accessible to admins via profiles.role
    
  3. Intentional Public Policies (kept as-is)
    - Reference tables: badges, blog_categories, etc.
    - Service role policies: budget_buster_* tables
    - Public content: app_settings, ai_package_items
    
  4. Notes
    - Only fixes policies that are clearly security issues
    - Maintains existing functionality where appropriate
*/

-- Fix admin_sessions policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_sessions'
  ) THEN
    DROP POLICY IF EXISTS "Admin sessions are private" ON admin_sessions;
    
    -- Only allow viewing own admin sessions
    CREATE POLICY "Admin users can view own sessions"
      ON admin_sessions
      FOR SELECT
      TO authenticated
      USING (admin_user_id = (select auth.uid()));
    
    -- Allow admin users to insert their own sessions
    CREATE POLICY "Admin users can create own sessions"
      ON admin_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (admin_user_id = (select auth.uid()));
    
    -- Allow admin users to delete their own sessions
    CREATE POLICY "Admin users can delete own sessions"
      ON admin_sessions
      FOR DELETE
      TO authenticated
      USING (admin_user_id = (select auth.uid()));
      
    RAISE NOTICE 'Fixed admin_sessions policies to restrict access to session owners only';
  END IF;
END $$;

-- Fix admin_users policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_users'
  ) THEN
    DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
    
    -- Only allow admins (via profiles.role) to view admin_users
    CREATE POLICY "Admins can view admin users"
      ON admin_users
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (select auth.uid())
          AND profiles.role = 'admin'
        )
      );
    
    -- Only allow admins to manage admin users
    CREATE POLICY "Admins can manage admin users"
      ON admin_users
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (select auth.uid())
          AND profiles.role = 'admin'
        )
      );
      
    RAISE NOTICE 'Fixed admin_users policies to restrict access to admins only';
  END IF;
END $$;

-- Review and log other always-true policies for manual review
DO $$
DECLARE
  rec RECORD;
  review_count INTEGER := 0;
BEGIN
  RAISE NOTICE '=== Review of Remaining Always-True Policies ===';
  
  FOR rec IN
    SELECT tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual = 'true' OR qual = '(true)')
      AND tablename NOT IN (
        'badges', 'blog_categories', 'ai_package_items', 'app_settings',
        'bot_channels', 'bot_knowledge_links', 'bot_tool_permissions',
        'partner_referral_links'  -- We added a public view policy here
      )
      AND tablename NOT LIKE 'budget_buster_%'
      AND tablename NOT IN ('admin_sessions', 'admin_users')
    ORDER BY tablename, policyname
    LIMIT 20
  LOOP
    review_count := review_count + 1;
    RAISE NOTICE 'Table: %, Policy: %, Command: %', 
      rec.tablename, rec.policyname, rec.cmd;
  END LOOP;
  
  IF review_count = 0 THEN
    RAISE NOTICE 'No additional always-true policies found that need review';
  ELSE
    RAISE NOTICE 'Found % policies for manual review', review_count;
  END IF;
END $$;
