/*
  # Fix Missing Course Image
  
  1. Updates
    - Add missing image_url to ai-receptionist-missed-call course
*/

UPDATE courses 
SET 
  image_url = 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg',
  updated_at = now()
WHERE slug = 'ai-receptionist-missed-call' AND image_url IS NULL;
