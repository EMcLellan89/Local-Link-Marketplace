/*
  # Add 5 Remaining Unindexed Foreign Keys

  1. Performance Improvements
    - Add missing foreign key indexes to prevent sequential scans
    - Improve JOIN performance across critical tables
    - Prevent potential DoS attacks on unindexed foreign keys

  2. Indexes Added
    - `admin_crm_companies.assigned_to_team_member`
    - `business_deals.vendor_id`
    - `customers.referred_by_partner_id`
    - `deals.partner_id`
    - `profiles.partner_id`

  3. Security
    - Prevents performance degradation attacks
    - Improves query planner efficiency
*/

-- Admin CRM companies
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to_team_member 
  ON admin_crm_companies(assigned_to_team_member);

-- Business deals
CREATE INDEX IF NOT EXISTS idx_business_deals_vendor_id 
  ON business_deals(vendor_id);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id 
  ON customers(referred_by_partner_id);

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_partner_id 
  ON deals(partner_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id 
  ON profiles(partner_id);