/*
  # Complete Academy Course System Setup
  
  1. Updates
    - Add image URLs to all courses
    - Fix course slug mismatch for Local Paws Passport
    - Ensure all courses are properly configured
    
  2. Changes
    - Update existing courses with proper image URLs
    - Link orphaned products to correct course slugs
    - Set proper target audiences for academy access
*/

-- Update Local Customers on Autopilot
UPDATE courses 
SET 
  subtitle = 'Get customers without ads using Local-Link',
  image_url = 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
  updated_at = now()
WHERE slug = 'local-customers-on-autopilot';

-- Update UGC From Home
UPDATE courses 
SET 
  subtitle = 'Stay-at-home income creating content (no followers needed)',
  image_url = 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
  updated_at = now()
WHERE slug = 'ugc-from-home';

-- Update AI Receptionist course
UPDATE courses 
SET 
  subtitle = 'Automate appointment booking and customer service',
  image_url = 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg',
  updated_at = now()
WHERE slug = 'ai-receptionist-missed-calls';

-- Update Reviews That Convert
UPDATE courses 
SET 
  subtitle = 'Turn 5-star reviews into paying customers',
  image_url = 'https://images.pexels.com/photos/5475754/pexels-photo-5475754.jpeg',
  updated_at = now()
WHERE slug = 'reviews-that-convert';

-- Update Partner Accelerator
UPDATE courses 
SET 
  subtitle = 'Build a 6-figure Local-Link partnership',
  image_url = 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg',
  updated_at = now()
WHERE slug = 'partner-accelerator';

-- Update Selling Recurring Revenue
UPDATE courses 
SET 
  subtitle = 'Land monthly retainers from local businesses',
  image_url = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  updated_at = now()
WHERE slug = 'selling-recurring-revenue';

-- Update Marketing for Trades
UPDATE courses 
SET 
  subtitle = 'Plumbing, HVAC, electrical, roofing & more',
  image_url = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
  updated_at = now()
WHERE slug = 'marketing-for-trades';

-- Update Local Paws Passport
UPDATE courses 
SET 
  title = 'Local Paws Passport™ with PetConnect CRM',
  subtitle = 'Marketing for groomers, vets, trainers & pet stores',
  description = 'Attract pet owners and build loyalty in your community with proven marketing strategies and a specialized CRM system for pet businesses.',
  image_url = 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
  updated_at = now()
WHERE slug = 'local-paws-passport-petconnect-crm';

-- Update Care Coordination
UPDATE courses 
SET 
  subtitle = 'Home health, senior care & family services marketing',
  image_url = 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg',
  updated_at = now()
WHERE slug = 'care-coordination-for-families';

-- Update Local Service Side Hustle
UPDATE courses 
SET 
  subtitle = 'Start a service business with little to no startup cost',
  description = 'Learn how to start and grow a profitable local service business. Lawn care, cleaning, handyman, pressure washing and more.',
  image_url = 'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg',
  updated_at = now()
WHERE slug = 'local-service-side-hustle';

-- Update Online Sales Without Ads
UPDATE courses 
SET 
  subtitle = 'Systematic outreach, relationships & closing',
  image_url = 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
  updated_at = now()
WHERE slug = 'online-sales-without-ads';

-- Update Blog Growth System (main one)
UPDATE courses 
SET 
  subtitle = 'Drive organic traffic with strategic blogging',
  image_url = 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg',
  updated_at = now()
WHERE slug = 'blog-growth-system';

-- Update Blog Growth Merchant
UPDATE courses 
SET 
  subtitle = 'Blog marketing strategies for local businesses',
  image_url = 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg',
  updated_at = now()
WHERE slug = 'blog-growth-merchant';

-- Update Blog Growth Partner
UPDATE courses 
SET 
  subtitle = 'Start a side hustle writing blogs for local businesses',
  image_url = 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg',
  updated_at = now()
WHERE slug = 'blog-growth-partner';

-- Fix product link for pet business course (currently points to wrong slug)
UPDATE products_catalog
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{course_slug}',
  '"local-paws-passport-petconnect-crm"'::jsonb
)
WHERE slug = 'pet-business-course';
