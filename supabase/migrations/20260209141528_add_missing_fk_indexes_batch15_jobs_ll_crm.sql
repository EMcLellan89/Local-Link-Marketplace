/*
  # Add Missing Foreign Key Indexes - Batch 15: Job Board & LocalLink CRM

  1. New Indexes
    - job_applications.job_id
    - job_applications.merchant_id
    - job_applications.partner_id
    - job_payouts.job_id
    - job_payouts.partner_id
    - job_postings.merchant_id
    - job_postings.partner_id
    - ll_crm_automations.merchant_id
    - ll_crm_contacts.merchant_id
    - ll_crm_custom_fields.merchant_id
    - ll_crm_documents.contact_id
    - ll_crm_documents.deal_id
    - ll_crm_documents.merchant_id
    - ll_crm_emails.contact_id
    - ll_crm_emails.merchant_id
    - ll_crm_notes.contact_id
    - ll_crm_notes.deal_id
    - ll_crm_notes.merchant_id
    - ll_crm_pipelines.merchant_id
    - ll_crm_tags.merchant_id
    - ll_crm_tasks.contact_id
    - ll_crm_tasks.deal_id
    - ll_crm_tasks.merchant_id

  2. Performance Impact
    - Improves job posting and application queries
    - Optimizes LocalLink CRM contact and deal management
*/

-- Job Board Indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_merchant_id ON job_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id ON job_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_job_id ON job_payouts(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_partner_id ON job_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_merchant_id ON job_postings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_partner_id ON job_postings(partner_id);

-- LocalLink CRM Indexes
CREATE INDEX IF NOT EXISTS idx_ll_crm_automations_merchant_id ON ll_crm_automations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id ON ll_crm_contacts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_custom_fields_merchant_id ON ll_crm_custom_fields(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_contact_id ON ll_crm_documents(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_deal_id ON ll_crm_documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_merchant_id ON ll_crm_documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_emails_contact_id ON ll_crm_emails(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_emails_merchant_id ON ll_crm_emails(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_notes_contact_id ON ll_crm_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_notes_deal_id ON ll_crm_notes(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_notes_merchant_id ON ll_crm_notes(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_pipelines_merchant_id ON ll_crm_pipelines(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_tags_merchant_id ON ll_crm_tags(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_tasks_contact_id ON ll_crm_tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_tasks_deal_id ON ll_crm_tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_tasks_merchant_id ON ll_crm_tasks(merchant_id);
