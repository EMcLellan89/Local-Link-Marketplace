/*
  # Add Stripe Connect to UGC Creators

  Add Stripe Connect integration fields to enable creator payouts.

  1. Changes to `ugc_creators` table
    - `stripe_connect_account_id` - Stripe Connect account ID
    - `connect_details_submitted` - Whether onboarding details have been submitted
    - `connect_charges_enabled` - Whether account can receive charges
    - `connect_payouts_enabled` - Whether account can receive payouts
    - `connect_enabled` - Overall account enabled status
    - `connect_disabled_reason` - Reason if account is disabled
    - `payout_email` - Email for payout notifications

  2. Security
    - Creators can view and update their own Stripe Connect status
    - Existing RLS policies cover access control
*/

-- Add Stripe Connect fields to ugc_creators table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ugc_creators' AND column_name = 'stripe_connect_account_id'
  ) THEN
    ALTER TABLE ugc_creators
      ADD COLUMN stripe_connect_account_id text,
      ADD COLUMN connect_details_submitted boolean DEFAULT false,
      ADD COLUMN connect_charges_enabled boolean DEFAULT false,
      ADD COLUMN connect_payouts_enabled boolean DEFAULT false,
      ADD COLUMN connect_enabled boolean DEFAULT false,
      ADD COLUMN connect_disabled_reason text,
      ADD COLUMN payout_email text;
  END IF;
END $$;

-- Create index for faster Stripe account lookups
CREATE INDEX IF NOT EXISTS idx_ugc_creators_stripe_connect
  ON ugc_creators(stripe_connect_account_id)
  WHERE stripe_connect_account_id IS NOT NULL;
