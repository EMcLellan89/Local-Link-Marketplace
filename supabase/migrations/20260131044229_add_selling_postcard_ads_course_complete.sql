/*
  # Add "Selling Postcard Ads" Partner Course
  
  Complete course teaching partners how to sell postcard advertising.
  50/50 commission structure on all sales.
*/

-- Insert the course
INSERT INTO academy_courses (
  slug,
  title,
  subtitle,
  description,
  target_audience,
  thumbnail_url,
  est_minutes,
  difficulty_level,
  is_published,
  is_free,
  created_at,
  updated_at
) VALUES (
  'selling-postcard-ads',
  'Selling Postcard Ads',
  'Earn $150-$1,250 commission per sale',
  'Master the art of selling high-value postcard advertising to local businesses. Learn proven sales techniques, overcome objections, and close deals worth $299-$2,500 with 50% commission on every sale.',
  'partner',
  'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg',
  240,
  'beginner',
  true,
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();
