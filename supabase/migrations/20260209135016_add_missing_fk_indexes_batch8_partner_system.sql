/*
  # Add Missing Foreign Key Indexes - Batch 8: Partner System

  1. Changes
    - Add indexes for partners (user_id, tier_key)
    - Add indexes for territories (assigned_partner_id, parent_territory_id)
    - Add indexes for partner_applications (reviewed_by)
    - Add indexes for partner_subscriptions (partner_id, tier_id)
    - Add indexes for partner_warning_logs (partner_id)
    - Add indexes for expansion_requests (partner_id)
    - Add indexes for qr_codes (created_by_partner_id)
    - Add indexes for payout_batches (partner_id)
    - Add indexes for territory_licenses (partner_id, territory_id, pricing_tier_id)
    
  2. Rationale
    - Partner management requires efficient territory queries
    - Payout processing needs fast partner lookups
    
  3. Performance Impact
    - Faster partner dashboard loading
    - Better territory management performance
    - Improved payout batch processing
*/

-- Partners
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_tier_key ON partners(tier_key);

-- Territories
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id ON territories(parent_territory_id);

-- Partner Applications
CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by ON partner_applications(reviewed_by);

-- Partner Subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id ON partner_subscriptions(tier_id);

-- Partner Warning Logs
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);

-- Expansion Requests
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);

-- QR Codes
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id ON qr_codes(created_by_partner_id);

-- Payout Batches
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id ON payout_batches(partner_id);

-- Territory Licenses
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id ON territory_licenses(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id ON territory_licenses(pricing_tier_id);
