/*
  # Drop Unused Indexes - Batch 9: Gift Cards, Internal, and Invoice Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Gift card indexes
  - Internal CRM and team indexes
  - Invoice and job indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- gift_cards
DROP INDEX IF EXISTS idx_gift_cards_customer_id;
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;

-- internal_companies
DROP INDEX IF EXISTS idx_internal_companies_assigned_to;

-- internal_contacts
DROP INDEX IF EXISTS idx_internal_contacts_assigned_to;
DROP INDEX IF EXISTS idx_internal_contacts_company_id;

-- internal_crm_activities
DROP INDEX IF EXISTS idx_internal_crm_activities_contact_id;

-- internal_crm_companies
DROP INDEX IF EXISTS idx_internal_crm_companies_assigned_to;

-- internal_crm_contacts
DROP INDEX IF EXISTS idx_internal_crm_contacts_assigned_to;

-- internal_crm_deals
DROP INDEX IF EXISTS idx_internal_crm_deals_company_id;

-- internal_crm_tasks
DROP INDEX IF EXISTS idx_internal_crm_tasks_assigned_to;

-- internal_deals
DROP INDEX IF EXISTS idx_internal_deals_company_id;

-- internal_tasks
DROP INDEX IF EXISTS idx_internal_tasks_assigned_to;

-- invoice_items
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- invoices
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_merchant_id;

-- job_applications
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_partner_id;

-- job_board_jobs
DROP INDEX IF EXISTS idx_job_board_jobs_employer_type;
DROP INDEX IF EXISTS idx_job_board_jobs_merchant_id;
DROP INDEX IF EXISTS idx_job_board_jobs_partner_id;

-- job_payouts
DROP INDEX IF EXISTS idx_job_payouts_application_id;

-- locallink_campaign_performance
DROP INDEX IF EXISTS idx_locallink_campaign_performance_campaign_id;

-- locallink_campaigns
DROP INDEX IF EXISTS idx_locallink_campaigns_merchant_id;

-- locallink_crm_contacts
DROP INDEX IF EXISTS idx_locallink_crm_contacts_merchant_id;

-- locallink_crm_deals
DROP INDEX IF EXISTS idx_locallink_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_locallink_crm_deals_merchant_id;
