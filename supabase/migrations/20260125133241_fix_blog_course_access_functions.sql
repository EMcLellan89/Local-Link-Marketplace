/*
  # Fix Blog Course Access Functions

  1. Updates
    - Fix get_user_blog_course_tier() to use 'paid' status instead of 'completed'
    - Fix grant_course_access_from_order() trigger to use 'paid' status
    
  2. Details
    - marketplace_orders.status enum values are: pending, paid, refunded, disputed, failed
    - Changed all 'completed' references to 'paid'
*/

-- Update function to get user's highest blog course tier purchased
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
      AND mo.status = 'paid'
  ) THEN
    RETURN 'dfy';
  END IF;

  -- Check for Accelerator tier
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_products mp ON mo.product_id = mp.id
    WHERE mo.user_id = user_uuid
      AND mp.slug = 'blog-growth-accelerator'
      AND mo.status = 'paid'
  ) THEN
    RETURN 'accelerator';
  END IF;

  -- Check for Core tier
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_products mp ON mo.product_id = mp.id
    WHERE mo.user_id = user_uuid
      AND mp.slug = 'blog-growth-self-implement'
      AND mo.status = 'paid'
  ) THEN
    RETURN 'core';
  END IF;

  -- No access
  RETURN NULL;
END;
$$;

-- Update function to grant course enrollment from marketplace order
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
  -- Only process paid orders
  IF NEW.status != 'paid' OR NEW.user_id IS NULL THEN
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
