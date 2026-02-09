/*
  # Migrate Partner Courses from courses to academy_courses
  
  1. Data Migration
    - Copy all partner courses from courses table to academy_courses table
    - Map columns correctly between the two schemas
    - Set all partner courses as is_free = true
    - Migrate associated modules and lessons with generated slugs and defaults
*/

-- Step 1: Migrate partner courses from courses to academy_courses
INSERT INTO academy_courses (
  slug,
  title,
  subtitle,
  description,
  target_audience,
  audience,
  thumbnail_url,
  is_published,
  is_free,
  is_featured,
  created_at,
  updated_at
)
SELECT 
  c.slug,
  c.title,
  c.subtitle,
  c.description,
  'partner'::academy_audience,
  'partner'::academy_audience,
  COALESCE(c.image_url, 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'),
  c.is_published,
  true,
  false,
  c.created_at,
  c.updated_at
FROM courses c
WHERE c.target_audience = 'partner'
  AND NOT EXISTS (
    SELECT 1 FROM academy_courses ac WHERE ac.slug = c.slug
  );

-- Step 2: Migrate course modules from course_modules to academy_modules
INSERT INTO academy_modules (
  course_id,
  title,
  description,
  display_order,
  created_at,
  updated_at
)
SELECT 
  ac.id,
  cm.title,
  cm.description,
  cm.module_index,
  cm.created_at,
  cm.updated_at
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
JOIN academy_courses ac ON ac.slug = c.slug
WHERE c.target_audience = 'partner'
  AND NOT EXISTS (
    SELECT 1 FROM academy_modules am 
    WHERE am.course_id = ac.id 
      AND am.title = cm.title
      AND am.display_order = cm.module_index
  );

-- Step 3: Migrate course lessons from course_lessons to academy_lessons
-- Generate slugs and provide defaults for missing required fields
INSERT INTO academy_lessons (
  module_id,
  course_id,
  slug,
  title,
  display_order,
  content_markdown,
  video_url,
  est_minutes,
  is_preview,
  created_at,
  updated_at
)
SELECT 
  am.id,
  ac.id,
  LOWER(REGEXP_REPLACE(REGEXP_REPLACE(cl.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')),
  cl.title,
  cl.lesson_index,
  COALESCE(cl.content_md, '# ' || cl.title || '\n\nLesson content coming soon.'),
  cl.video_url,
  COALESCE(cl.video_duration_minutes, 10),
  COALESCE(cl.is_preview, false),
  cl.created_at,
  cl.updated_at
FROM course_lessons cl
JOIN course_modules cm ON cl.module_id = cm.id
JOIN courses c ON cm.course_id = c.id
JOIN academy_courses ac ON ac.slug = c.slug
JOIN academy_modules am ON am.course_id = ac.id AND am.title = cm.title AND am.display_order = cm.module_index
WHERE c.target_audience = 'partner'
  AND NOT EXISTS (
    SELECT 1 FROM academy_lessons al 
    WHERE al.module_id = am.id 
      AND al.title = cl.title
      AND al.display_order = cl.lesson_index
  );
