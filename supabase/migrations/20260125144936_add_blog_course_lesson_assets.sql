/*
  # Add Blog Course Lesson Assets

  1. Assets Added
    - Money Map Template (Excel/PDF)
    - 8-Post Content Calendar (Excel/PDF)
    - Repurpose Sheet (Excel/PDF)
    
  2. Asset Types
    - Downloadable worksheets and templates
    - Referenced in course lessons
    - Help merchants and partners execute the training
    
  3. Placement
    - Money Map: Module 2 lessons
    - 8-Post Calendar: Module 3 lessons
    - Repurpose Sheet: Module 4 lessons
*/

-- Add Money Map asset to Merchant Course Module 2
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  'Money Map Template',
  'Fill-in-the-blank spreadsheet to identify your highest-value services and plan blog posts that bring in revenue. Track Service, Avg Job Value, Search Volume, and Blog Post Ideas.',
  'spreadsheet',
  '/assets/academy/money-map-template.xlsx',
  1,
  'Excel format - Download and customize with your business services',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-growth-system-merchant' 
  AND m.sort_order = 2
  AND l.slug = 'merchant-money-map'
ON CONFLICT DO NOTHING;

-- Add 8-Post Calendar asset to Merchant Course Module 3
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  '8-Post Content Calendar',
  'Pre-planned calendar with 8 blog post templates: Service + City, Cost Calculator, DIY vs Pro, Common Problems, Case Study, Seasonal, FAQ Roundup, and Local Area Guide. Simply fill in your city and services.',
  'spreadsheet',
  '/assets/academy/8-post-calendar-template.xlsx',
  1,
  'Excel format - Schedule your first 8 weeks of content',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-growth-system-merchant' 
  AND m.sort_order = 3
  AND l.slug = 'merchant-8-post-blueprint'
ON CONFLICT DO NOTHING;

-- Add Repurpose Sheet asset to Merchant Course Module 4
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  'Blog Repurpose Sheet',
  'Turn one blog post into 10+ pieces of content. Includes templates for: 5 social media posts, 2 email newsletters, 1 YouTube video script, 1 podcast outline, and 3-5 quote graphics. Write once, publish everywhere.',
  'spreadsheet',
  '/assets/academy/repurpose-sheet-template.xlsx',
  1,
  'Excel format - Extract maximum value from every blog post',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-growth-system-merchant' 
  AND m.sort_order = 4
  AND l.slug = 'merchant-repurpose'
ON CONFLICT DO NOTHING;

-- Add Partner-specific assets for Blog Profit System

-- Add Partner Pricing Sheet asset
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  'Blog Service Pricing Sheet',
  '3-tier pricing template: Basic ($500/mo), Standard ($800/mo), Premium ($1,200/mo). Includes what to include in each package, how to present pricing, and upsell strategies.',
  'pdf',
  '/assets/academy/partner-pricing-sheet.pdf',
  1,
  'PDF format - Print and use during sales calls',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-profit-system-partner' 
  AND m.sort_order = 2
  AND l.slug = 'partner-pricing-packaging'
ON CONFLICT DO NOTHING;

-- Add Partner Assembly Line Checklist
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  'Blog Assembly Line Checklist',
  'Step-by-step checklist to create 4 blog posts in under 2 hours: Plan (15 min), Draft with AI (60 min), Edit & Localize (30 min), Publish (15 min). Includes AI prompts and editing tips.',
  'pdf',
  '/assets/academy/partner-assembly-line-checklist.pdf',
  1,
  'PDF format - Follow this every month for consistent delivery',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-profit-system-partner' 
  AND m.sort_order = 3
  AND l.slug = 'partner-assembly-line'
ON CONFLICT DO NOTHING;

-- Add Partner Monthly Report Template
INSERT INTO academy_lesson_assets (
  lesson_id,
  title,
  description,
  asset_type,
  url,
  sort_order,
  notes,
  created_at
)
SELECT 
  l.id,
  'Monthly Report Template',
  'One-page report template showing: Posts Published, Traffic Results, Lead Results. Takes 10 minutes to fill out. Keeps clients paying by proving your value every month.',
  'spreadsheet',
  '/assets/academy/partner-monthly-report-template.xlsx',
  1,
  'Excel format - Send to merchants on the 1st of each month',
  now()
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.slug = 'blog-profit-system-partner' 
  AND m.sort_order = 4
  AND l.slug = 'partner-monthly-reports'
ON CONFLICT DO NOTHING;

-- Note: Asset URLs point to /assets/academy/ directory
-- Actual files should be added to the public/assets/academy/ folder
-- These are referenced in lessons and available for download by enrolled students
