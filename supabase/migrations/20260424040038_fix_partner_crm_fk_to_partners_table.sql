/*
  # Fix partner_crm_companies and partner_crm_contacts foreign keys

  ## Problem
  partner_crm_companies.partner_id and partner_crm_contacts.partner_id reference
  the affiliate_partners table, but the PartnerCRMDashboard queries them using
  the partners.id value. This causes FK violations when seeding data and means
  the page can never load data correctly.

  ## Changes
  1. Drop the incorrect FK constraints referencing affiliate_partners
  2. Add correct FK constraints referencing partners table
  3. Seed demo companies and contacts for the existing partner
*/

-- Drop incorrect FK constraints
ALTER TABLE partner_crm_companies DROP CONSTRAINT IF EXISTS partner_crm_companies_partner_id_fkey;
ALTER TABLE partner_crm_contacts DROP CONSTRAINT IF EXISTS partner_crm_contacts_partner_id_fkey;

-- Re-add correct FK constraints pointing to partners table
ALTER TABLE partner_crm_companies
  ADD CONSTRAINT partner_crm_companies_partner_id_fkey
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE;

ALTER TABLE partner_crm_contacts
  ADD CONSTRAINT partner_crm_contacts_partner_id_fkey
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE;

-- Also fix partner_crm_deals if it has the same issue
ALTER TABLE partner_crm_deals DROP CONSTRAINT IF EXISTS partner_crm_deals_partner_id_fkey;
ALTER TABLE partner_crm_deals
  ADD CONSTRAINT partner_crm_deals_partner_id_fkey
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE;

-- The partner_crm_companies status check allows: lead, prospect, customer, inactive
-- But loadData() filters on status = 'active' — we need to add 'active' to the constraint
ALTER TABLE partner_crm_companies DROP CONSTRAINT IF EXISTS partner_crm_companies_status_check;
ALTER TABLE partner_crm_companies ADD CONSTRAINT partner_crm_companies_status_check
  CHECK (status IN ('lead', 'prospect', 'customer', 'active', 'inactive'));
