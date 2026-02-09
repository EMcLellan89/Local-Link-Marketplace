/*
  # Add Missing Foreign Key Indexes - Batch 6: Financial Engine Tables

  This migration adds B-tree indexes for foreign key columns that lack covering indexes.
  
  ## Tables Updated:
  - merchant_members (merchant_id, user_id)
  - provider_assignments (merchant_id, provider_id)
  - providers (user_id)
*/

-- Financial Engine Tables
CREATE INDEX IF NOT EXISTS idx_merchant_members_merchant_id ON merchant_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_members_user_id ON merchant_members(user_id);

CREATE INDEX IF NOT EXISTS idx_provider_assignments_merchant_id ON provider_assignments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider_id ON provider_assignments(provider_id);

CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
