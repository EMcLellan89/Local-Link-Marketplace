/*
  # Add Missing Foreign Key Indexes for Partner Tables
  
  1. New Indexes
    - Add index on `partner_agreements.partner_id` for FK constraint `partner_agreements_partner_id_fkey`
    - Add index on `partner_assets.partner_id` for FK constraint `partner_assets_partner_id_fkey`
  
  2. Security
    - No RLS changes required
  
  ## Notes
  - These indexes improve query performance for foreign key lookups
  - Addresses security audit finding: unindexed foreign keys
*/

-- Add index for partner_agreements.partner_id
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id 
  ON partner_agreements(partner_id);

-- Add index for partner_assets.partner_id
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id 
  ON partner_assets(partner_id);
