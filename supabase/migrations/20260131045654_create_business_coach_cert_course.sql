/*
  # Create Business Coach Certification Course
  
  Comprehensive certification course for partners who want to provide business coaching services.
  Partners must pass exam to receive certification and accept coaching jobs.
*/

-- Create the Business Coach Certification course
INSERT INTO academy_courses (
  title,
  slug,
  subtitle,
  description,
  thumbnail_url,
  difficulty_level,
  est_minutes,
  target_audience,
  is_published,
  certification_badge_name,
  is_free
) VALUES (
  'Certified Business Coach',
  'certified-business-coach',
  'Master business rescue and transformation strategies',
  'Become a certified business coach and help struggling businesses turn around. Learn financial rescue strategies, marketing systems, operations optimization, and crisis management. Only certified coaches can accept paid coaching jobs from merchants.',
  '/business-coach-cert.jpg',
  'advanced',
  2400,
  'partner',
  true,
  'Certified Business Coach',
  true
);

-- Create 10 comprehensive modules
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach')
INSERT INTO academy_modules (course_id, title, description, display_order, estimated_minutes)
SELECT 
  course.id,
  title,
  description,
  order_num,
  hours * 60
FROM course,
(VALUES
  ('Business Assessment & Diagnosis', 'Learn to quickly assess business health and identify critical issues', 1, 4),
  ('Financial Rescue Strategies', 'Master cash flow management and financial turnaround tactics', 2, 5),
  ('Marketing Systems That Work', 'Build customer acquisition engines for struggling businesses', 3, 4),
  ('Operations Optimization', 'Streamline operations and eliminate waste', 4, 4),
  ('Sales System Development', 'Create predictable revenue systems', 5, 4),
  ('Leadership & Team Building', 'Develop strong leadership in crisis situations', 6, 3),
  ('Crisis Management & Turnarounds', 'Navigate business emergencies and execute turnarounds', 7, 5),
  ('Pricing & Profitability', 'Fix pricing strategies and boost margins', 8, 3),
  ('Customer Retention & Loyalty', 'Build systems to keep customers coming back', 9, 3),
  ('Scaling & Growth Strategies', 'Help businesses scale after stabilization', 10, 5)
) AS modules(title, description, order_num, hours);
