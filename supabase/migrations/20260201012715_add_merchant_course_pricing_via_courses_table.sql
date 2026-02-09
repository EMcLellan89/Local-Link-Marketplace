/*
  # Add Pricing for Merchant Courses via Courses Table
  
  1. New Data
    - Course pricing for merchant courses in courses table
    - Tiered pricing: $49, $97, $197
  
  2. Pricing Strategy
    - Foundation: $49
    - Specialty: $97
    - Advanced: $197
*/

INSERT INTO course_pricing (course_id, price_usd, compare_at_price_usd, is_free, payment_type)
SELECT 
  c.id,
  CASE 
    -- Free courses
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-system-merchant') THEN 0
    
    -- $49 Foundation
    WHEN c.slug IN (
      'financial-basics-small-business',
      'local-seo-foundations',
      'social-media-local',
      'local-service-side-hustle',
      'pricing-profitability'
    ) THEN 49.00
    
    -- $197 Advanced
    WHEN c.slug IN (
      'local-customers-on-autopilot',
      'blog-growth-merchant',
      'scaling-local-business',
      'marketplace-mastery-merchant',
      'facebook-monetization-local',
      'lead-conversion-local',
      'customer-reactivation'
    ) THEN 197.00
    
    -- $97 Specialty (default)
    ELSE 97.00
  END as price_usd,
  CASE 
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-system-merchant') THEN 0
    WHEN c.slug IN (
      'financial-basics-small-business',
      'local-seo-foundations',
      'social-media-local',
      'local-service-side-hustle',
      'pricing-profitability'
    ) THEN 97.00
    WHEN c.slug IN (
      'local-customers-on-autopilot',
      'blog-growth-merchant',
      'scaling-local-business',
      'marketplace-mastery-merchant',
      'facebook-monetization-local',
      'lead-conversion-local',
      'customer-reactivation'
    ) THEN 297.00
    ELSE 147.00
  END as compare_at_price_usd,
  CASE 
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-system-merchant') THEN true
    ELSE false
  END as is_free,
  'one_time' as payment_type
FROM courses c
WHERE c.target_audience = 'merchant' 
AND c.is_published = true
AND c.id NOT IN (SELECT course_id FROM course_pricing WHERE course_id IS NOT NULL)
ON CONFLICT (course_id) DO NOTHING;
