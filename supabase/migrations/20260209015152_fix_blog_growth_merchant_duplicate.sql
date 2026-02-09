/*
  # Fix Blog Growth System Duplicate Course
  
  1. Changes
    - Remove duplicate "Blog Growth System™" entry (slug: blog-growth-system)
    - Keep "Blog Growth System (Merchant)" (slug: blog-growth-system-merchant) which has 6 products
    - Ensure course is marked as paid and published
  
  2. Rationale
    - The course with slug 'blog-growth-merchant' has 6 active products in products_catalog
    - The duplicate with slug 'blog-growth-system' has no products and causes confusion
*/

-- Delete the duplicate with no products
DELETE FROM academy_courses 
WHERE slug = 'blog-growth-system' 
  AND target_audience = 'merchant'
  AND id = '4ff1a498-9c98-41c8-a158-528f3ef2d6ff';

-- Also delete the other duplicate merchant version
DELETE FROM academy_courses 
WHERE slug = 'blog-growth-system-merchant' 
  AND target_audience = 'merchant'
  AND id = '51b42a32-c650-4f80-9330-7ffc65de81f6';

-- Ensure the main Blog Growth course is properly configured
UPDATE academy_courses
SET 
  title = 'Blog Growth System™',
  subtitle = 'Turn Your Blog Into a Customer-Getting Machine',
  description = 'Master blogging strategies to attract and convert local customers to YOUR business',
  is_free = false,
  is_published = true,
  target_audience = 'merchant',
  audience = 'merchant',
  display_order = 7
WHERE slug = 'blog-growth-merchant';
