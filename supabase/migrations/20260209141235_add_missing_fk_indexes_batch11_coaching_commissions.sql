/*
  # Add Missing Foreign Key Indexes - Batch 11: Business Coaching & Commissions

  1. New Indexes
    - business_coaching_bookings.package_id
    - business_coaching_sessions.booking_id
    - commission_bundle_incentives.bundle_id
    - commission_bundle_incentives.partner_tier_id
    - commission_challenge_participants.challenge_id
    - commission_challenge_participants.partner_id
    - commission_partner_earnings.partner_id
    - commission_partner_earnings.period_id
    - commission_partner_earnings.tier_id
    - commission_payout_batches.approved_by
    - commission_payout_batches.created_by
    - commission_payouts.batch_id
    - commission_payouts.partner_id
    - commission_periods.parent_period_id

  2. Performance Impact
    - Improves commission calculation and payout queries
    - Optimizes business coaching session tracking
*/

-- Business Coaching Indexes
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);

-- Commission System Indexes
CREATE INDEX IF NOT EXISTS idx_commission_bundle_incentives_bundle_id ON commission_bundle_incentives(bundle_id);
CREATE INDEX IF NOT EXISTS idx_commission_bundle_incentives_partner_tier_id ON commission_bundle_incentives(partner_tier_id);
CREATE INDEX IF NOT EXISTS idx_commission_challenge_participants_challenge_id ON commission_challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_commission_challenge_participants_partner_id ON commission_challenge_participants(partner_id);
CREATE INDEX IF NOT EXISTS idx_commission_partner_earnings_partner_id ON commission_partner_earnings(partner_id);
CREATE INDEX IF NOT EXISTS idx_commission_partner_earnings_period_id ON commission_partner_earnings(period_id);
CREATE INDEX IF NOT EXISTS idx_commission_partner_earnings_tier_id ON commission_partner_earnings(tier_id);
CREATE INDEX IF NOT EXISTS idx_commission_payout_batches_approved_by ON commission_payout_batches(approved_by);
CREATE INDEX IF NOT EXISTS idx_commission_payout_batches_created_by ON commission_payout_batches(created_by);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_batch_id ON commission_payouts(batch_id);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_partner_id ON commission_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_commission_periods_parent_period_id ON commission_periods(parent_period_id);
