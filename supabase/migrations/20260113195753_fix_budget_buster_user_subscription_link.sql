/*
  # Fix Budget Buster User-Subscription Link
  
  Updates the budget_buster_users table to add the subscription_id column
  that references the earlier created budget_buster_subscriptions table.
*/

-- Add subscription_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budget_buster_users' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE budget_buster_users 
    ADD COLUMN subscription_id UUID REFERENCES budget_buster_subscriptions(id);
    
    CREATE INDEX IF NOT EXISTS idx_bb_users_subscription 
    ON budget_buster_users(subscription_id) WHERE subscription_id IS NOT NULL;
  END IF;
END $$;
