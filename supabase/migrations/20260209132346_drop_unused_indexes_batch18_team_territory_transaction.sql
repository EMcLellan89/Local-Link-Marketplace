/*
  # Drop Unused Indexes - Batch 18: Team, Territory, and Transaction Tables

  1. Changes
    - Drop unused indexes from team_* tables
    - Drop unused indexes from territory_* tables
    - Drop unused indexes from transaction_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces index maintenance overhead
*/

-- Team tables
DROP INDEX IF EXISTS idx_team_members_user_id;

-- Territory tables
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;

-- Ticket messages
DROP INDEX IF EXISTS idx_ticket_messages_ticket_id;

-- Transaction tables
DROP INDEX IF EXISTS idx_transaction_categorizations_coa_id;
DROP INDEX IF EXISTS idx_transaction_categorizations_merchant_id;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP INDEX IF EXISTS transactions_merchant_date_idx;
