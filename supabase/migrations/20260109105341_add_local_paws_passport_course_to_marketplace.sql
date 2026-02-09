/*
  # Add Local Paws Passport Course to Marketplace
  
  1. Creates marketplace product for Local Paws Passport course
  2. Priced at $97 for partners only
  3. Sets commission structure for affiliates
*/

-- Add Local Paws Passport course to marketplace (partner-only)
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active
) VALUES (
  'course_local_paws_passport',
  'Local Paws Passport™ with PetConnect CRM',
  'course',
  9700, -- $97
  'usd',
  2000, -- 20% affiliate commission (for marketplace affiliates)
  true
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active;
