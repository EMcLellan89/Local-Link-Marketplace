/*
  # Remove Local-Link CRM from Marketplace

  LocalLink CRM is now included with tier subscriptions and should not be sold separately through the marketplace.

  1. Changes
    - Deactivate all standalone LocalLink CRM marketplace products
    - CRM access is now bundled with merchant tier subscriptions (Basic, Professional, Premium, Enterprise)
    - Preserves historical data for any existing CRM-only subscriptions

  2. Security
    - No security changes - only deactivating products
*/

-- Deactivate all standalone LocalLink CRM marketplace products
UPDATE marketplace_affiliate_products
SET
  active = false,
  description = description || ' [DEPRECATED: CRM now included with tier subscriptions]'
WHERE sku IN (
  'locallink_merchant_solo_45',
  'locallink_merchant_team_145',
  'locallink_merchant_growth_299',
  'locallink_merchant_scale_499',
  'locallink_crm_solo_45',
  'locallink_crm_team_145',
  'locallink_crm_growth_299',
  'locallink_crm_scale_499'
)
AND active = true;
