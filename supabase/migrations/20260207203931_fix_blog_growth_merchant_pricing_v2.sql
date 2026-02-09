/*
  # Fix Blog Growth System Merchant Pricing v2

  1. Changes
    - Mark merchant blog courses as PAID (not free)
    - Add commission rules for blog product tiers
    - Commission rate: 0 (tier-based, uses partner's tier rate)
  
  2. Products
    - Blog Growth Self-Implement: $997
    - Blog Growth Accelerator: $1,997
    - Blog Growth DFY: $2,997 + monthly
  
  3. Commission
    - Tier-based one-time commission
    - Rate determined by partner tier (10-30%)
*/

-- Ensure merchant blog courses are NOT free
UPDATE academy_courses
SET is_free = false
WHERE target_audience = 'merchant'
AND (slug LIKE '%blog%' OR title ILIKE '%blog%');

-- Add commission rules for blog tiers
INSERT INTO product_commission_rules (
  sku,
  product_name,
  commission_rate_bps,
  commission_type,
  is_recurring,
  active,
  notes
) VALUES
  (
    'BLOG_GROWTH_SELF_IMPLEMENT', 
    'Blog Growth System - Self-Implement ($997)', 
    0, 
    'tier', 
    false, 
    true,
    'Tier-based commission: Starter 10%, Growth 15%, Pro 20%, Elite 25%, Enterprise 30%'
  ),
  (
    'BLOG_GROWTH_ACCELERATOR', 
    'Blog Growth System - Accelerator ($1,997)', 
    0, 
    'tier', 
    false, 
    true,
    'Tier-based commission: Starter 10%, Growth 15%, Pro 20%, Elite 25%, Enterprise 30%'
  ),
  (
    'BLOG_GROWTH_DFY', 
    'Blog Growth System - Done-For-You ($2,997)', 
    0, 
    'tier', 
    false, 
    true,
    'Tier-based commission on setup fee only. Monthly fees are separate service revenue.'
  )
ON CONFLICT (sku) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  commission_rate_bps = EXCLUDED.commission_rate_bps,
  notes = EXCLUDED.notes,
  active = true;

-- Update existing generic blog course commission rule
UPDATE product_commission_rules
SET 
  product_name = 'Blog Growth System (Generic)',
  commission_rate_bps = 0,
  notes = 'Legacy SKU - use specific tier SKUs instead',
  active = true
WHERE sku = 'COURSE_BLOG_GROWTH';
