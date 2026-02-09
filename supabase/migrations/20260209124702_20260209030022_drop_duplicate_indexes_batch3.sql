/*
  # Drop Duplicate Indexes - Batch 3

  1. Changes
    - Drop additional duplicate indexes
    - Continues cleanup from batches 1-2
    
  2. Indexes Being Dropped
    - idx_dfy_orders_merchant (duplicate of idx_dfy_orders_merchant_id)
    - idx_dfy_orders_partner (duplicate of idx_dfy_orders_partner_id)
    - idx_partner_applications_user (duplicate of idx_partner_applications_user_id)
    - idx_expansion_requests_partner (duplicate of idx_expansion_requests_partner_id)
    - idx_partner_overrides_partner (duplicate of idx_partner_overrides_partner_id)
    - idx_partner_territories_partner (duplicate of idx_partner_territories_partner_id)
    - idx_partner_referrals_partner (duplicate of idx_partner_referrals_partner_id)
    - idx_academy_enrollments_user (duplicate of idx_academy_enrollments_user_id)
    - idx_academy_progress_user (duplicate of idx_academy_progress_user_id)
    - idx_academy_certifications_user (duplicate of idx_academy_certifications_user_id)
    - idx_ll_crm_contacts_merchant (duplicate of idx_ll_crm_contacts_merchant_id)
    - idx_ll_crm_deals_merchant (duplicate of idx_ll_crm_deals_merchant_id)
*/

-- DFY indexes
DROP INDEX IF EXISTS idx_dfy_orders_merchant;
DROP INDEX IF EXISTS idx_dfy_orders_partner;

-- Partner indexes
DROP INDEX IF EXISTS idx_partner_applications_user;
DROP INDEX IF EXISTS idx_expansion_requests_partner;
DROP INDEX IF EXISTS idx_partner_overrides_partner;
DROP INDEX IF EXISTS idx_partner_territories_partner;
DROP INDEX IF EXISTS idx_partner_referrals_partner;

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_enrollments_user;
DROP INDEX IF EXISTS idx_academy_progress_user;
DROP INDEX IF EXISTS idx_academy_certifications_user;

-- LocalLink CRM indexes
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant;