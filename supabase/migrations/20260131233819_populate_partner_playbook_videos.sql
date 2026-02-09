/*
  # Populate Partner Playbook Video URLs
  
  1. Updates
    - Add placeholder video URLs for all partner playbook lessons
    - Set video duration to 10 minutes (600 seconds) as default
  
  2. Notes
    - Video URLs use YouTube embed format (placeholder)
    - Duration set to realistic 10 min default
*/

UPDATE partner_playbook_lessons
SET 
  video_url = 'https://www.youtube.com/embed/' || 
    SUBSTRING(MD5(id::text) FROM 1 FOR 11),
  video_duration_seconds = 600,
  updated_at = NOW()
WHERE video_url IS NULL OR video_url = '';
