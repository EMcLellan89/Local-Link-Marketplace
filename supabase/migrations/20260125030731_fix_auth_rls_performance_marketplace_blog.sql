/*
  # Optimize Auth RLS Performance - Marketplace and Blog Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for marketplace_partners
    - Wrap auth.uid() in SELECT subquery for blog_posts

  2. Security
    - Uses correct column names (user_id for marketplace_partners)
    - Maintains existing security model
*/

-- marketplace_partners policies
DROP POLICY IF EXISTS "Partners can view own profile" ON marketplace_partners;
CREATE POLICY "Partners can view own profile"
  ON marketplace_partners
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- blog_posts policies (if any auth-based policies exist)
-- Check for existing auth-based policies on blog_posts
DO $$
BEGIN
  -- Drop and recreate any blog_posts policies with auth.uid() optimization
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
      AND policyname = 'Authors can view own posts'
  ) THEN
    DROP POLICY "Authors can view own posts" ON blog_posts;
    CREATE POLICY "Authors can view own posts"
      ON blog_posts
      FOR SELECT
      TO authenticated
      USING ((SELECT auth.uid()) = author_id);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
      AND policyname = 'Authors can update own posts'
  ) THEN
    DROP POLICY "Authors can update own posts" ON blog_posts;
    CREATE POLICY "Authors can update own posts"
      ON blog_posts
      FOR UPDATE
      TO authenticated
      USING ((SELECT auth.uid()) = author_id);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
      AND policyname = 'Authors can create posts'
  ) THEN
    DROP POLICY "Authors can create posts" ON blog_posts;
    CREATE POLICY "Authors can create posts"
      ON blog_posts
      FOR INSERT
      TO authenticated
      WITH CHECK ((SELECT auth.uid()) = author_id);
  END IF;
END $$;
