/*
  # Populate Lesson Summaries and Video URLs
  
  1. Updates
    - Extract summary from content_markdown (first 200 chars)
    - Add placeholder video URLs for all lessons
    - Set video duration to 10 minutes (600 seconds) as default
  
  2. Notes
    - Summaries extracted from existing markdown content
    - Video URLs use YouTube embed format (placeholder)
    - Duration set to realistic 10 min default
*/

-- Generate summaries from content_markdown
UPDATE academy_lessons
SET 
  summary = LEFT(REGEXP_REPLACE(content_markdown, '[#*\n]', '', 'g'), 200),
  video_url = 'https://www.youtube.com/embed/' || 
    SUBSTRING(MD5(id::text) FROM 1 FOR 11),
  video_duration_seconds = 600,
  est_minutes = 10,
  updated_at = NOW()
WHERE course_id IN (
  SELECT id FROM academy_courses WHERE target_audience = 'merchant'
)
AND (summary IS NULL OR summary = '')
AND content_markdown IS NOT NULL;
