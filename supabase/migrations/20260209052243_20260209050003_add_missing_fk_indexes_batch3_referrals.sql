/*
  # Add Missing Foreign Key Indexes - Batch 3: Customer Referrals

  1. Changes
    - Add indexes on foreign key columns for customer referrals
    - Improves query performance for referral tracking

  2. Tables Updated
    - customer_referrals: merchant_id, referrer_customer_id, referee_customer_id
*/

-- Customer referrals table
CREATE INDEX IF NOT EXISTS idx_customer_referrals_merchant_id ON customer_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_customer_id ON customer_referrals(referrer_customer_id) WHERE referrer_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referee_customer_id ON customer_referrals(referee_customer_id) WHERE referee_customer_id IS NOT NULL;
