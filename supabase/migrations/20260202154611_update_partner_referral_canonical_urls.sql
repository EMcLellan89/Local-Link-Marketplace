/*
  # Update Partner Referral Canonical URLs

  Updates the canonical referral URL format from /r/:slug to /ref/:slug to avoid
  conflicts with merchant customer referral landing pages.

  1. Changes
    - Update partner_referral_links canonical URL format to use /ref/ prefix
    - Update Family-2428 system account canonical URL

  2. Security
    - No RLS changes, existing policies remain in place
*/

-- Update existing partner_referral_links to use /ref/ prefix
UPDATE partner_referral_links
SET canonical_ref_url = 'https://local-linkmarketplace.com/ref/family-2428'
WHERE canonical_ref_url = 'https://local-linkmarketplace.com/r/family-2428';
