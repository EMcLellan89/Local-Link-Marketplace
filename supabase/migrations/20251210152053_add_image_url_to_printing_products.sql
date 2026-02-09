/*
  # Add image_url column to printing_products
  
  1. Changes
    - Add image_url column to store product images
    - Column is optional (nullable) for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'printing_products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE printing_products ADD COLUMN image_url text;
  END IF;
END $$;
