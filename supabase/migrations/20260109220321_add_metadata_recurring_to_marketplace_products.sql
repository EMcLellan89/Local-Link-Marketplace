/*
  # Add Metadata and Recurring Fields to Marketplace Products

  1. Changes
    - Add `recurring` boolean field to track if product has recurring commissions
    - Add `metadata` jsonb field to store additional product information
    - Add `description` text field for product descriptions
    - Add `category` text field for product categorization

  2. Notes
    - Metadata will store commission type, fixed amounts, and other flexible data
    - Recurring flag indicates if commissions are paid monthly or one-time
*/

-- Add new columns
ALTER TABLE marketplace_affiliate_products
ADD COLUMN IF NOT EXISTS recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS category text;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category ON marketplace_affiliate_products(category);

-- Create index on metadata for jsonb queries
CREATE INDEX IF NOT EXISTS idx_marketplace_products_metadata ON marketplace_affiliate_products USING gin(metadata);
