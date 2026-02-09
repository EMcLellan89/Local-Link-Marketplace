/*
  # Add Pricing for Missing Merchant Courses
  
  1. Purpose
    - Add pricing for 8 courses without pricing
*/

INSERT INTO course_pricing (course_id, price_usd, compare_at_price_usd, is_free, payment_type)
SELECT 
  c.id,
  CASE 
    -- Free courses
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-merchant') THEN 0
    
    -- $49 Foundation
    WHEN c.slug IN ('local-service-side-hustle') THEN 49.00
    
    -- $197 Advanced
    WHEN c.slug IN ('facebook-monetization-local', 'online-sales-without-ads') THEN 197.00
    
    -- $97 Specialty (default)
    ELSE 97.00
  END as price_usd,
  CASE 
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-merchant') THEN 0
    WHEN c.slug IN ('local-service-side-hustle') THEN 97.00
    WHEN c.slug IN ('facebook-monetization-local', 'online-sales-without-ads') THEN 297.00
    ELSE 147.00
  END as compare_at_price_usd,
  CASE 
    WHEN c.slug IN ('blog-growth-system', 'blog-growth-merchant') THEN true
    ELSE false
  END as is_free,
  'one_time' as payment_type
FROM courses c
WHERE c.slug IN (
  'local-paws-passport-petconnect-crm',
  'care-coordination-for-families',
  'local-service-side-hustle',
  'online-sales-without-ads',
  'blog-growth-system',
  'blog-growth-merchant',
  'ugc-from-home',
  'facebook-monetization-local'
)
AND c.id NOT IN (SELECT course_id FROM course_pricing WHERE course_id IS NOT NULL);
