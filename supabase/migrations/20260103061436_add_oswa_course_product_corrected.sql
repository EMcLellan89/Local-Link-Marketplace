/*
  # Online Sales Without Ads™ Product and Course

  1. New Products
    - `oswa-course` - Online Sales Without Ads™ course ($97)

  2. New Entitlements
    - Course access for oswa-course

  3. New Courses
    - `online-sales-without-ads` - Full course definition

  4. Product-Course Mapping
    - Helper table for clean webhook integration
*/

-- Product (using correct table name: products_catalog)
INSERT INTO public.products_catalog (
  slug, title, description, product_type,
  stripe_price_id, price_cents, is_active
) VALUES (
  'oswa-course',
  'Online Sales Without Ads™',
  'Sell offers using organic content + DMs + simple funnels (no paid ads).',
  'one_time',
  'PRICE_ID_OSWA_97',
  9700,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  product_type = excluded.product_type,
  price_cents = excluded.price_cents,
  is_active = excluded.is_active;

-- Entitlements
INSERT INTO public.product_entitlements (product_slug, entitlement)
VALUES ('oswa-course', 'course_access')
ON CONFLICT (product_slug, entitlement) DO NOTHING;

-- Course definition
INSERT INTO public.courses (slug, title, subtitle, description)
VALUES (
  'online-sales-without-ads',
  'Online Sales Without Ads™',
  'Get sales through organic content + DMs + simple funnels.',
  'A step-by-step system to sell courses/services without paid ads using content pillars, DM closing scripts, and a simple checkout funnel.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description;

-- Product-Course Mapping Helper Table
CREATE TABLE IF NOT EXISTS public.product_course_map (
  product_slug text PRIMARY KEY,
  course_slug text NOT NULL REFERENCES public.courses(slug) ON DELETE CASCADE
);

ALTER TABLE public.product_course_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_course_map_read" 
  ON public.product_course_map 
  FOR SELECT 
  USING (true);

-- Map the product to course
INSERT INTO public.product_course_map(product_slug, course_slug)
VALUES ('oswa-course','online-sales-without-ads')
ON CONFLICT (product_slug) DO UPDATE SET course_slug = excluded.course_slug;
