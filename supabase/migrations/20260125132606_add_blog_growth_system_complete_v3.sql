/*
  # Blog Growth System - Complete Course & Products
  
  1. Course Creation
    - Unified "Blog Growth System" course
    - 10 modules with teleprompter scripts
    - Target: merchants + partners
    
  2. Marketplace Products
    - Self-Implement ($997)
    - Implementation Accelerator ($1,997)
    - Done-For-You Path ($2,997)
*/

-- Create the unified Blog Growth System course
INSERT INTO courses (slug, title, description, target_audience, is_published)
VALUES (
  'blog-growth-system',
  'The Blog Growth System for Local Businesses',
  'Learn the exact system that drives traffic, builds authority, and generates consistent leads through strategic blogging. No guesswork. No generic advice. Just proven frameworks for local service businesses.',
  'both',
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published;

-- Create all modules and lessons
DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'blog-growth-system';
  
  -- MODULE 1
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 1, 'Why Blogging Still Wins for Local Businesses', 'Understand why blogging is the foundation of predictable organic growth.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Why Blogging Still Wins', '/academy/videos/blog-growth/why-blogging-wins', 
  'Blogging works because buyers search before they call. When your business answers questions consistently, Google rewards you with visibility. This course shows you how blogging becomes a predictable growth channel—not a guessing game.', 8)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 2
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 2, 'How Google Actually Ranks Local Content', 'Learn the 3 ranking factors Google uses.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Local SEO Fundamentals', '/academy/videos/blog-growth/local-seo-fundamentals',
  'Google ranks relevance, proximity, and authority. Blogs support all three by targeting service keywords, locations, and expertise signals.', 12)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 3
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 3, 'Choosing Topics That Attract Buyers', 'Target buyer-intent topics that convert.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Buyer-Intent Topics', '/academy/videos/blog-growth/buyer-intent-topics',
  'Not all traffic is equal. We target buyer-intent topics—services, comparisons, problems—so readers convert into leads.', 15)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 4
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 4, 'Blog Structure That Converts', 'Follow the proven 5-part structure.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'High-Converting Blog Structure', '/academy/videos/blog-growth/high-converting-structure',
  'Every post follows a proven structure: hook, problem, solution, proof, CTA. This keeps readers engaged and drives action.', 18)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 5
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 5, 'Local SEO Optimization (The Right Way)', 'Optimize without keyword stuffing.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Local SEO Optimization', '/academy/videos/blog-growth/local-seo-optimization',
  'We optimize titles, headers, internal links, and local signals without keyword stuffing. This protects rankings long-term.', 20)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 6
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 6, 'Publishing & Indexing Best Practices', 'Ensure Google indexes content fast.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Publishing & Indexing', '/academy/videos/blog-growth/publishing-indexing',
  'Publishing correctly ensures Google indexes posts fast. We handle formatting, categories, schema, and sitemap inclusion.', 14)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 7
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 7, 'Turning Blogs Into Leads', 'Convert readers into contacts.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Blog to Lead Conversion', '/academy/videos/blog-growth/blog-to-lead',
  'CTAs, internal links, and CRM tracking turn readers into contacts—automatically.', 16)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 8
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 8, 'Tracking Performance Inside Your CRM', 'Know which posts drive revenue.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'CRM Performance Tracking', '/academy/videos/blog-growth/crm-tracking',
  'We track blog-driven leads inside the CRM so you know what content produces revenue.', 18)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 9
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 9, 'Scaling Content Without Burning Out', 'Build a repeatable system.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, 'Scaling Your Content System', '/academy/videos/blog-growth/scaling-content',
  'This system scales because it is process-driven. You never start from scratch.', 15)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
  -- MODULE 10
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 10, 'Your 90-Day Blog Growth Plan', 'Follow this roadmap.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_module_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, video_url, content_md, video_duration_minutes)
  VALUES (v_module_id, 1, '90-Day Implementation Roadmap', '/academy/videos/blog-growth/90-day-plan',
  'Follow this roadmap and your blog becomes a compounding asset, not a chore.', 25)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET content_md = EXCLUDED.content_md;
  
END $$;

-- Create marketplace products (3 tiers)
INSERT INTO marketplace_products (slug, name, description, long_description, product_type, is_active)
VALUES 
(
  'blog-growth-self-implement',
  'Blog Growth System - Self-Implement',
  'Master the blog growth system yourself with full training',
  'Get complete access to our 10-module Blog Growth System. Learn to create SEO-optimized content that drives leads. Includes step-by-step frameworks, AI prompts, distribution strategies, and ROI tracking. Perfect for hands-on business owners. **Price: $997 one-time**',
  'course',
  true
),
(
  'blog-growth-accelerator',
  'Blog Growth System - Implementation Accelerator',
  'Get set up faster with done-for-you planning',
  'Everything in Self-Implement PLUS: 12-month blog topic plan, writing templates, partner hiring guidance, priority job posting, verified merchant badge, and direct implementation support. Ideal for growing businesses. **Price: $1,997 one-time**',
  'course',
  true
),
(
  'blog-growth-dfy',
  'Blog Growth System - Done-For-You Path',
  'We execute the blog strategy for you',
  'Everything in Accelerator PLUS: Complete blog strategy and setup, DFY blog execution via vetted partners, monthly performance reporting, content management oversight, and dedicated account manager. For established businesses who want results without effort. **Price: $2,997 setup + monthly fees**',
  'course',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  is_active = EXCLUDED.is_active;
