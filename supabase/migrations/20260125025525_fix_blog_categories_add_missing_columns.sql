/*
  # Fix Blog Categories Table - Add Missing Columns
  
  Adds the is_active and updated_at columns that were missing from blog_categories
*/

-- Add missing columns to blog_categories
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_categories' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE blog_categories ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE blog_categories ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active) WHERE is_active = true;

-- Update existing categories to ensure they have proper data
UPDATE blog_categories SET is_active = true WHERE is_active IS NULL;
UPDATE blog_categories SET updated_at = created_at WHERE updated_at IS NULL;
