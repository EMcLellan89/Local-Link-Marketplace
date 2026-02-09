/*
  # Sync Missing Blog Growth Merchant Course
  
  1. Purpose
    - Add blog-growth-system-merchant to courses table
    - Sync its modules and lessons
    - Add pricing
*/

-- Insert missing course
INSERT INTO courses (slug, title, subtitle, description, image_url, is_published, target_audience, created_at, updated_at)
SELECT 
  slug,
  title,
  subtitle,
  description,
  thumbnail_url,
  is_published,
  target_audience::text,
  created_at,
  updated_at
FROM academy_courses
WHERE slug = 'blog-growth-system-merchant'
AND target_audience = 'merchant' 
AND is_published = true;

-- Insert modules
INSERT INTO course_modules (course_id, module_index, title, description, created_at)
SELECT 
  c.id,
  am.display_order,
  am.title,
  am.description,
  am.created_at
FROM academy_modules am
JOIN academy_courses ac ON am.course_id = ac.id
JOIN courses c ON c.slug = ac.slug
WHERE ac.slug = 'blog-growth-system-merchant'
AND ac.target_audience = 'merchant' 
AND ac.is_published = true
ORDER BY c.id, am.display_order;

-- Insert lessons
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview, created_at)
SELECT 
  cm.id,
  al.display_order,
  al.title,
  al.content_markdown,
  al.video_url,
  CASE 
    WHEN al.video_duration_seconds IS NOT NULL 
    THEN ROUND(al.video_duration_seconds / 60.0)
    ELSE 10
  END,
  COALESCE(al.is_preview, false),
  al.created_at
FROM academy_lessons al
JOIN academy_modules am ON al.module_id = am.id
JOIN academy_courses ac ON al.course_id = ac.id
JOIN courses c ON c.slug = ac.slug
JOIN course_modules cm ON cm.course_id = c.id AND cm.module_index = am.display_order
WHERE ac.slug = 'blog-growth-system-merchant'
AND ac.target_audience = 'merchant' 
AND ac.is_published = true
ORDER BY cm.id, al.display_order;

-- Add pricing
INSERT INTO course_pricing (course_id, price_usd, compare_at_price_usd, is_free, payment_type)
SELECT 
  c.id,
  0 as price_usd,
  0 as compare_at_price_usd,
  true as is_free,
  'one_time' as payment_type
FROM courses c
WHERE c.slug = 'blog-growth-system-merchant'
AND c.id NOT IN (SELECT course_id FROM course_pricing WHERE course_id IS NOT NULL);
