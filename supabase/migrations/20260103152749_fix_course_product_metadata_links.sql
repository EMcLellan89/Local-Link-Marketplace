/*
  # Fix Course-Product Metadata Links

  Ensures all course products have proper course_slug in metadata
  for frontend course listing to work correctly.
*/

-- Update oswa-course metadata
UPDATE public.products_catalog
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{course_slug}',
  '"online-sales-without-ads"'
)
WHERE slug = 'oswa-course';

-- Remove duplicate online-sales-without-ads product (old one)
DELETE FROM public.products_catalog
WHERE slug = 'online-sales-without-ads'
AND price_cents = 19700;
