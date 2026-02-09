/*
  # Add Missing Foreign Key Indexes - Batch 4: Partners

  1. Changes
    - Add index on partners.user_id for better JOIN performance
    
  2. Tables Updated
    - partners: user_id
*/

-- Partners table - user_id index
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
