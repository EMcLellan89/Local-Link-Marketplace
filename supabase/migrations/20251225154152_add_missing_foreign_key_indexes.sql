/*
  # Add Missing Foreign Key Indexes

  1. Performance Issue
    - 16 foreign keys without covering indexes
    - Causes slow joins and lookups
    - Can be 10-100x slower without indexes

  2. Solution
    - Add indexes for all unindexed foreign keys
    - Improves query performance significantly
    - No data changes, only performance optimization
*/

CREATE INDEX IF NOT EXISTS idx_batch_transactions_transaction_id 
  ON batch_transactions(transaction_id);

CREATE INDEX IF NOT EXISTS idx_deals_partner_id 
  ON deals(partner_id);

CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id 
  ON deals(qr_code_id);

CREATE INDEX IF NOT EXISTS idx_deals_territory_id 
  ON deals(territory_id);

CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
  ON merchants(partner_id);

CREATE INDEX IF NOT EXISTS idx_merchants_territory_id 
  ON merchants(territory_id);

CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by 
  ON partner_applications(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id_fk 
  ON partner_subscriptions(tier_id);

CREATE INDEX IF NOT EXISTS idx_partners_user_id_fk 
  ON partners(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_partner_id 
  ON profiles(partner_id);

CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
  ON system_settings(updated_by);

CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id 
  ON territories(parent_territory_id);

CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id 
  ON territory_licenses(pricing_tier_id);

CREATE INDEX IF NOT EXISTS idx_transactions_deal_id 
  ON transactions(deal_id);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id_fk 
  ON transactions(merchant_id);

CREATE INDEX IF NOT EXISTS idx_transactions_territory_id 
  ON transactions(territory_id);
