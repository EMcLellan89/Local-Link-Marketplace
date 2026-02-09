/*
  # Create Marketplace Products for Merchant Courses
  
  Creates marketplace products that link to the merchant courses
  with proper pricing and purchase flow integration.
*/

-- Insert marketplace products for PAID merchant courses
INSERT INTO marketplace_products (
  slug, name, description, product_type, is_active
)
VALUES
  (
    'local-customers-autopilot-course',
    'Local Customers on Autopilot™',
    'Learn how to build predictable customer flow without ads. Complete webinar course with 30 lessons, workbook, and certification.',
    'course',
    true
  ),
  (
    'online-sales-without-ads-course',
    'Online Sales Without Ads™',
    'Generate consistent sales through conversations and systems. Complete webinar course with proven frameworks.',
    'course',
    true
  ),
  (
    'reviews-that-convert-course',
    'Reviews That Bring Customers In™',
    'Turn reviews into your #1 sales tool. Learn to collect, display, and leverage reviews for growth.',
    'course',
    true
  ),
  (
    'selling-without-cold-calling-course',
    'Selling Local Services Without Cold Calling™',
    'Close deals without outbound pressure. Scripts and workflows for calm, confident sales conversations.',
    'course',
    true
  ),
  (
    'canva-for-sales-course',
    'Using Canva to Increase Sales™',
    'Create professional sales assets that convert. No designer needed.',
    'course',
    true
  ),
  (
    'ugc-business-growth-course',
    'UGC for Business Growth™',
    'Create content that builds local authority. Turn customer stories into 24/7 sales assets.',
    'course',
    true
  ),
  (
    'ai-marketing-small-business-course',
    'AI Marketing for Small Business™',
    'Use AI safely to grow your business. Practical systems for emails, posts, pages, and campaigns.',
    'course',
    true
  ),
  (
    'ai-review-reputation-course',
    'AI Review & Reputation Management™',
    'Monitor, respond, and leverage reviews with AI. Turn reputation into revenue.',
    'course',
    true
  ),
  (
    'bundle-services-course',
    'How to Bundle Services for $1,000+ Deals™',
    'Package your services for maximum value. Increase deal size without new leads.',
    'course',
    true
  ),
  (
    'ai-marketing-automation-advanced-course',
    'AI Marketing & Automation™',
    'Advanced AI workflows for business growth. Build systems that scale without adding staff.',
    'course',
    true
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- Link marketplace products to courses via product_course_map
INSERT INTO product_course_map (product_slug, course_slug)
VALUES
  ('local-customers-autopilot-course', 'local-customers-on-autopilot-merchant'),
  ('online-sales-without-ads-course', 'online-sales-without-ads-merchant'),
  ('reviews-that-convert-course', 'reviews-that-bring-customers-merchant'),
  ('selling-without-cold-calling-course', 'selling-local-services-without-cold-calling-merchant'),
  ('canva-for-sales-course', 'using-canva-to-increase-sales-merchant'),
  ('ugc-business-growth-course', 'ugc-for-business-growth-merchant'),
  ('ai-marketing-small-business-course', 'ai-marketing-for-small-business-merchant'),
  ('ai-review-reputation-course', 'ai-review-reputation-management-merchant'),
  ('bundle-services-course', 'bundle-services-thousand-dollar-deals-merchant'),
  ('ai-marketing-automation-advanced-course', 'ai-marketing-automation-merchant')
ON CONFLICT DO NOTHING;

-- Create view for easy course product lookup
CREATE OR REPLACE VIEW merchant_course_catalog AS
SELECT 
  c.id as course_id,
  c.slug as course_slug,
  c.title as course_title,
  c.subtitle,
  c.description,
  c.image_url,
  c.target_audience,
  c.is_published,
  cp.price_usd,
  cp.compare_at_price_usd,
  cp.is_free,
  cp.stripe_price_id,
  cp.stripe_product_id,
  cw.total_duration_minutes,
  cw.includes_workbook,
  cw.includes_templates,
  cw.certification_available,
  mp.id as product_id,
  mp.slug as product_slug,
  mp.name as product_name,
  (SELECT COUNT(*) FROM course_modules WHERE course_id = c.id) as module_count,
  (SELECT COUNT(*) FROM course_lessons cl 
   JOIN course_modules cm ON cl.module_id = cm.id 
   WHERE cm.course_id = c.id) as lesson_count
FROM courses c
LEFT JOIN course_pricing cp ON cp.course_id = c.id
LEFT JOIN course_webinar_content cw ON cw.course_id = c.id
LEFT JOIN product_course_map pcm ON pcm.course_slug = c.slug
LEFT JOIN marketplace_products mp ON mp.slug = pcm.product_slug
WHERE c.target_audience IN ('merchant', 'both')
ORDER BY cp.price_usd DESC, c.title;

-- Create function to check if user has access to course
CREATE OR REPLACE FUNCTION user_has_course_access(p_user_id uuid, p_course_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_access boolean;
  v_course_pricing record;
BEGIN
  -- Get course pricing info
  SELECT is_free INTO v_course_pricing
  FROM course_pricing
  WHERE course_id = p_course_id;
  
  -- If course is free, everyone has access
  IF v_course_pricing.is_free THEN
    RETURN true;
  END IF;
  
  -- Check if user is admin
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id AND role = 'admin'
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user is a merchant with active subscription
  IF EXISTS (
    SELECT 1 FROM merchants m
    JOIN profiles p ON p.id = m.user_id
    WHERE m.user_id = p_user_id 
    AND m.subscription_status = 'active'
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user purchased this course directly
  -- (This would check against marketplace orders/purchases)
  IF EXISTS (
    SELECT 1 FROM marketplace_orders mo
    JOIN marketplace_order_items moi ON moi.order_id = mo.id
    JOIN product_course_map pcm ON pcm.product_slug = moi.product_slug
    JOIN courses c ON c.slug = pcm.course_slug
    WHERE mo.customer_id = p_user_id
    AND c.id = p_course_id
    AND mo.status = 'completed'
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create RLS policy for course access
CREATE POLICY "Users can view courses they have access to"
  ON courses FOR SELECT
  TO authenticated
  USING (
    is_published = true
    AND (
      target_audience = 'merchant'
      OR target_audience = 'both'
    )
  );

CREATE POLICY "Users can view course modules for accessible courses"
  ON course_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_modules.course_id
      AND c.is_published = true
      AND user_has_course_access(auth.uid(), c.id)
    )
  );

CREATE POLICY "Users can view lessons for accessible courses"
  ON course_lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.is_published = true
      AND user_has_course_access(auth.uid(), c.id)
    )
  );
