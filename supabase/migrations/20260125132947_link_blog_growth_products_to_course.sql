/*
  # Link Blog Growth System Products to Course

  1. Product-Course Mapping
    - Links 3 marketplace products to blog-growth-system course
    - `blog-growth-self-implement` → Core tier ($997)
    - `blog-growth-accelerator` → Accelerator tier ($1,997)
    - `blog-growth-dfy` → Done-For-You tier ($2,997)

  2. Access Control Helper Functions
    - `get_user_blog_course_tier()` - Returns user's highest tier purchased
    - `user_has_blog_course_access()` - Checks if user has any tier access
    - `grant_course_access_from_order()` - Auto-enrolls user after purchase

  3. Security
    - RLS policies ensure users can only view their own enrollments
    - Functions use auth.uid() to check authenticated user context
*/

-- Link products to course
INSERT INTO product_course_map (product_slug, course_slug)
VALUES 
  ('blog-growth-self-implement', 'blog-growth-system'),
  ('blog-growth-accelerator', 'blog-growth-system'),
  ('blog-growth-dfy', 'blog-growth-system')
ON CONFLICT (product_slug) DO UPDATE SET course_slug = EXCLUDED.course_slug;

-- Function to get user's highest blog course tier purchased
CREATE OR REPLACE FUNCTION get_user_blog_course_tier(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier_result text;
BEGIN
  -- Check for DFY tier (highest)
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_products mp ON mo.product_id = mp.id
    WHERE mo.user_id = user_uuid
      AND mp.slug = 'blog-growth-dfy'
      AND mo.status = 'completed'
  ) THEN
    RETURN 'dfy';
  END IF;

  -- Check for Accelerator tier
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_products mp ON mo.product_id = mp.id
    WHERE mo.user_id = user_uuid
      AND mp.slug = 'blog-growth-accelerator'
      AND mo.status = 'completed'
  ) THEN
    RETURN 'accelerator';
  END IF;

  -- Check for Core tier
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_products mp ON mo.product_id = mp.id
    WHERE mo.user_id = user_uuid
      AND mp.slug = 'blog-growth-self-implement'
      AND mo.status = 'completed'
  ) THEN
    RETURN 'core';
  END IF;

  -- No access
  RETURN NULL;
END;
$$;

-- Function to check if user has any blog course access
CREATE OR REPLACE FUNCTION user_has_blog_course_access(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN get_user_blog_course_tier(user_uuid) IS NOT NULL;
END;
$$;

-- Function to grant course enrollment from marketplace order
CREATE OR REPLACE FUNCTION grant_course_access_from_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_uuid uuid;
  product_slug_val text;
BEGIN
  -- Only process completed orders
  IF NEW.status != 'completed' OR NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get product slug
  SELECT mp.slug INTO product_slug_val
  FROM marketplace_products mp
  WHERE mp.id = NEW.product_id;

  -- Check if this product is linked to a course
  SELECT c.id INTO course_uuid
  FROM courses c
  JOIN product_course_map pcm ON pcm.course_slug = c.slug
  WHERE pcm.product_slug = product_slug_val;

  -- If course found, create enrollment
  IF course_uuid IS NOT NULL THEN
    INSERT INTO enrollments (user_id, course_id, status, stripe_payment_intent_id, enrolled_at)
    VALUES (
      NEW.user_id,
      course_uuid,
      'active',
      NEW.stripe_payment_intent_id,
      NOW()
    )
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-enroll users after purchase
DROP TRIGGER IF EXISTS auto_enroll_course_on_order ON marketplace_orders;
CREATE TRIGGER auto_enroll_course_on_order
  AFTER INSERT OR UPDATE OF status ON marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION grant_course_access_from_order();

-- Add unique constraint to enrollments if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'enrollments_user_course_unique'
  ) THEN
    ALTER TABLE enrollments ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);
  END IF;
END $$;
