/*
  # Add Missing Foreign Key Indexes - Batch 11 Part 3
  
  1. Tables Covered
    - LocalLink CRM tables (ll_crm_contacts, ll_crm_deals, ll_crm_documents, ll_crm_email_campaigns, ll_crm_email_sends, ll_crm_invoices, ll_crm_payments, ll_crm_pipelines, ll_crm_subscriptions, ll_crm_workflow_executions, ll_crm_workflows)
    - LocalLink partner commission rules
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for LocalLink CRM operations
    - Critical for CRM contacts, deals, and workflow management
    
  3. Security
    - No security changes, only performance optimization
*/

-- LocalLink CRM contacts
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_assigned_to ON ll_crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_created_by ON ll_crm_contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id ON ll_crm_contacts(merchant_id);

-- LocalLink CRM deals
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_assigned_to ON ll_crm_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id ON ll_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_merchant_id ON ll_crm_deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_pipeline_id ON ll_crm_deals(pipeline_id);

-- LocalLink CRM documents
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_contact_id ON ll_crm_documents(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_deal_id ON ll_crm_documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_merchant_id ON ll_crm_documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_uploaded_by ON ll_crm_documents(uploaded_by);

-- LocalLink CRM email campaigns
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_campaigns_merchant_id ON ll_crm_email_campaigns(merchant_id);

-- LocalLink CRM email sends
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_campaign_id ON ll_crm_email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_contact_id ON ll_crm_email_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_merchant_id ON ll_crm_email_sends(merchant_id);

-- LocalLink CRM invoices
CREATE INDEX IF NOT EXISTS idx_ll_crm_invoices_contact_id ON ll_crm_invoices(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_invoices_created_by ON ll_crm_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_crm_invoices_merchant_id ON ll_crm_invoices(merchant_id);

-- LocalLink CRM payments
CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_contact_id ON ll_crm_payments(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_created_by ON ll_crm_payments(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_invoice_id ON ll_crm_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_merchant_id ON ll_crm_payments(merchant_id);

-- LocalLink CRM pipelines
CREATE INDEX IF NOT EXISTS idx_ll_crm_pipelines_merchant_id ON ll_crm_pipelines(merchant_id);

-- LocalLink CRM subscriptions
CREATE INDEX IF NOT EXISTS idx_ll_crm_subscriptions_merchant_id ON ll_crm_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_subscriptions_tier_id ON ll_crm_subscriptions(tier_id);

-- LocalLink CRM workflow executions
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_contact_id ON ll_crm_workflow_executions(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_deal_id ON ll_crm_workflow_executions(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_merchant_id ON ll_crm_workflow_executions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_workflow_id ON ll_crm_workflow_executions(workflow_id);

-- LocalLink CRM workflows
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflows_merchant_id ON ll_crm_workflows(merchant_id);

-- LocalLink partner commission rules
CREATE INDEX IF NOT EXISTS idx_ll_partner_commission_rules_partner_id ON ll_partner_commission_rules(partner_id);
