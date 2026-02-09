/*
  # Add Social Media Ad Design Product

  1. New Product
    - SKU: `LL_SOCIAL_AD_DESIGN`
    - Name: Social Media Ad Design
    - Price: $297 one-time
    - Type: service
    - Category: dfy_services
    - Commission: 15% for partners
    
  2. Purpose
    - Allows merchants to purchase professional ad design services
    - Jobs posted to partner job board for fulfillment
    - Partners earn commission for completing designs
*/

-- Insert Social Media Ad Design product
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  metadata,
  description,
  category
) VALUES (
  'LL_SOCIAL_AD_DESIGN',
  'Social Media Ad Design',
  'service',
  29700,
  'USD',
  1500, -- 15% commission = $44.55 per sale
  true,
  false,
  jsonb_build_object(
    'turnaround_days', 7,
    'deliverables', jsonb_build_array(
      '3-5 high-converting ad design variations',
      'Multiple size formats (Feed, Story, Reel)',
      'Brand-aligned visuals',
      'Ad copy suggestions',
      'Source files included'
    ),
    'partner_job_board', true,
    'service_type', 'ad_design'
  ),
  'Professional social media ad creative design service. Expert partners create high-converting ad designs for Facebook, Instagram, and other platforms. Includes multiple variations, formats, and ad copy suggestions.',
  'dfy_services'
) ON CONFLICT (sku) DO UPDATE SET
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  metadata = EXCLUDED.metadata,
  description = EXCLUDED.description,
  active = EXCLUDED.active;
