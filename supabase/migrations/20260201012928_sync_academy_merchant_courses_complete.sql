/*
  # Sync Academy Merchant Courses - Complete
  
  1. Insert modules
  2. Insert lessons
*/

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
WHERE ac.target_audience = 'merchant' 
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
WHERE ac.target_audience = 'merchant' 
AND ac.is_published = true
ORDER BY cm.id, al.display_order;
