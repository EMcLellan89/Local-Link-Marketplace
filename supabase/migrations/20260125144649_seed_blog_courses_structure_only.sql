/*
  # Seed Blog Course Structure

  1. New Courses
    - Blog Growth System (Merchant) - 5 modules
    - Blog Profit System (Partner) - 5 modules
    
  2. Module Structure
    - Each course has 5 modules
    - Lessons can be added through admin interface or subsequent migrations
    
  3. Access Rules
    - All courses FREE (is_free = true)
    - Gated by role (merchant vs partner)
*/

-- Insert Blog Growth System (Merchant)
WITH course_insert AS (
  INSERT INTO academy_courses (
    slug, title, subtitle, description, audience,
    is_free, is_published, est_minutes, sort_order,
    created_at, updated_at
  )
  VALUES (
    'blog-growth-system-merchant',
    'Blog Growth System (Merchant)',
    'Get found locally, earn trust, and convert clicks into calls.',
    'Step-by-step system to publish blogs that bring local customers in without ads or paid marketing.',
    'merchant',
    true,
    true,
    240,
    10,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    est_minutes = EXCLUDED.est_minutes,
    updated_at = now()
  RETURNING id
)
INSERT INTO academy_modules (course_id, title, description, sort_order, created_at, updated_at)
SELECT 
  id,
  title,
  description,
  sort_order,
  now(),
  now()
FROM course_insert
CROSS JOIN (
  VALUES
    ('Module 1: Why Local Blogs Win', 'Learn why a simple blog beats paid ads for long-term customer acquisition.', 1),
    ('Module 2: Your Money Map', 'Reverse-engineer the services people search for and what they pay.', 2),
    ('Module 3: The 8-Post Blueprint', 'Plan your first 8 blog posts using the fill-in-the-blank calendar.', 3),
    ('Module 4: Write Once, Publish Everywhere', 'Repurpose every blog into 10+ pieces of content across all platforms.', 4),
    ('Module 5: Automate & Scale', 'Set up systems so your blog runs itself and brings leads on autopilot.', 5)
) AS modules(title, description, sort_order)
ON CONFLICT DO NOTHING;

-- Insert Blog Profit System (Partner)
WITH course_insert AS (
  INSERT INTO academy_courses (
    slug, title, subtitle, description, audience,
    is_free, is_published, est_minutes, sort_order,
    created_at, updated_at
  )
  VALUES (
    'blog-profit-system-partner',
    'Blog Profit System (Partner)',
    'Earn $500-$2,000/mo per merchant by running their blog.',
    'White-label system to create, publish, and manage SEO blogs for your merchant clients. Build recurring revenue and unlock premium DFY tools in the marketplace.',
    'partner',
    true,
    true,
    240,
    20,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    est_minutes = EXCLUDED.est_minutes,
    updated_at = now()
  RETURNING id
)
INSERT INTO academy_modules (course_id, title, description, sort_order, created_at, updated_at)
SELECT 
  id,
  title,
  description,
  sort_order,
  now(),
  now()
FROM course_insert
CROSS JOIN (
  VALUES
    ('Module 1: Why Blog Management = Recurring Revenue', 'Learn the model: earn $500-$2K/mo per merchant with a simple blog service.', 1),
    ('Module 2: Sell the Service', 'Scripts, pricing, and objection-handling to close blog clients fast.', 2),
    ('Module 3: The Partner Blog Assembly Line', 'Use DFY templates and AI tools to create 4 posts/month in under 2 hours.', 3),
    ('Module 4: Deliver & Report', 'Show your merchants proof: traffic, calls, and revenue from their blog.', 4),
    ('Module 5: Scale to 10+ Merchants', 'Systemize your blog service so you can manage 10+ clients without burnout.', 5)
) AS modules(title, description, sort_order)
ON CONFLICT DO NOTHING;

-- Note: Full lesson content with teleprompter scripts can be added through the admin Academy editor
-- or through subsequent data imports. The course structure is now in place.
