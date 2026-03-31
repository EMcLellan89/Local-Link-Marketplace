/*
  # Remove Old Drive Repeat Business System

  1. Tables to Drop
    - loyalty_contract_uploads (old SenText Solutions contract upload system)

  2. Changes
    - Drop table and all associated policies
    - Remove old SMS loyalty program infrastructure

  Note: This removes the old "Drive Repeat Business" program powered by SenText Solutions.
  The new GoPayBright Loyalty Program (added 2026-03-31) is UI-only in MerchantServicesPage.tsx
  and does not use this table structure.
*/

-- Drop the old loyalty contract uploads table
DROP TABLE IF EXISTS loyalty_contract_uploads CASCADE;

-- Note: The new GoPayBright Loyalty Program does not require database tables yet.
-- It's currently informational content in the Merchant Services page.
