/*
  # Add Missing Foreign Key Indexes - Batch 7: Social & Sponsorships Tables

  This migration adds B-tree indexes for foreign key columns that lack covering indexes.
  
  ## Tables Updated:
  - social_ugc_subscriptions (merchant_id, package_id)
  - community_sponsorships (merchant_id)
*/

-- Social/UGC Tables
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id ON social_ugc_subscriptions(package_id);

-- Note: merchant_id index already exists from original migration

-- Community Sponsorships
-- Note: merchant_id index already exists from original migration
