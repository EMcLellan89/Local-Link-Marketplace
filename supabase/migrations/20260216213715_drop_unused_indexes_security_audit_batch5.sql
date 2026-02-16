/*
  # Drop Unused Indexes - Security Audit Batch 5
  
  Drops unused indexes from gift cards, internal CRM, invoicing, job board, and LocalLink CRM tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - gift_cards
  - internal_crm_activities, internal_crm_companies, internal_crm_contacts, internal_crm_deals, internal_crm_notes
  - invoice_items, invoices
  - job_applications, job_payouts, job_postings, job_submissions
  - ll_crm_activities, ll_crm_contacts, ll_crm_deals, ll_crm_documents, ll_crm_email_tracking
  - ll_crm_notes, ll_crm_pipelines, ll_crm_segments, ll_crm_stages, ll_crm_tags, ll_crm_tasks
*/

-- Gift card tables
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;
DROP INDEX IF EXISTS idx_gift_cards_customer_id;
DROP INDEX IF EXISTS idx_gift_cards_code;

-- Internal CRM tables
DROP INDEX IF EXISTS idx_internal_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_internal_crm_activities_company_id;
DROP INDEX IF EXISTS idx_internal_crm_companies_owner_id;
DROP INDEX IF EXISTS idx_internal_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_internal_crm_contacts_owner_id;
DROP INDEX IF EXISTS idx_internal_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_internal_crm_deals_company_id;
DROP INDEX IF EXISTS idx_internal_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_internal_crm_notes_deal_id;

-- Invoice tables
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoices_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_status;

-- Job board tables
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_partner_id;
DROP INDEX IF EXISTS idx_job_payouts_job_id;
DROP INDEX IF EXISTS idx_job_payouts_partner_id;
DROP INDEX IF EXISTS idx_job_postings_merchant_id;
DROP INDEX IF EXISTS idx_job_postings_status;
DROP INDEX IF EXISTS idx_job_submissions_job_id;
DROP INDEX IF EXISTS idx_job_submissions_partner_id;

-- LocalLink CRM tables
DROP INDEX IF EXISTS idx_ll_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_contacts_email;
DROP INDEX IF EXISTS idx_ll_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_stage_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_email_tracking_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_email_tracking_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_notes_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_pipelines_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_segments_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_stages_pipeline_id;
DROP INDEX IF EXISTS idx_ll_crm_tags_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_tasks_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_tasks_merchant_id;