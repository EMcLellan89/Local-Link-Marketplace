/*
  # Drop Unused Indexes - Batch 9: LL CRM Deals, Documents, and Email Tables

  1. Changes
    - Drop unused indexes from ll_crm_deals_* tables
    - Drop unused indexes from ll_crm_documents_* tables
    - Drop unused indexes from ll_crm_email_* and other ll_crm tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves database performance
*/

-- LocalLink CRM Deals
DROP INDEX IF EXISTS idx_ll_crm_deals_assigned;
DROP INDEX IF EXISTS idx_ll_crm_deals_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_deals_contact;
DROP INDEX IF EXISTS idx_ll_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_pipeline;
DROP INDEX IF EXISTS idx_ll_crm_deals_stage;
DROP INDEX IF EXISTS idx_ll_crm_deals_status;

-- LocalLink CRM Documents
DROP INDEX IF EXISTS idx_ll_crm_documents_contact;
DROP INDEX IF EXISTS idx_ll_crm_documents_deal;
DROP INDEX IF EXISTS idx_ll_crm_documents_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_merchant;
DROP INDEX IF EXISTS idx_ll_crm_documents_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_type;
DROP INDEX IF EXISTS idx_ll_crm_documents_uploaded_by;

-- LocalLink CRM Email Campaigns
DROP INDEX IF EXISTS idx_ll_crm_email_campaigns_merchant;
DROP INDEX IF EXISTS idx_ll_crm_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_email_campaigns_status;

-- LocalLink CRM Email Sends
DROP INDEX IF EXISTS idx_ll_crm_email_sends_campaign;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_contact;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_merchant;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_merchant_id;

-- LocalLink CRM Invoices
DROP INDEX IF EXISTS idx_ll_crm_invoices_contact;
DROP INDEX IF EXISTS idx_ll_crm_invoices_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_created_by;
DROP INDEX IF EXISTS idx_ll_crm_invoices_date;
DROP INDEX IF EXISTS idx_ll_crm_invoices_due_date;
DROP INDEX IF EXISTS idx_ll_crm_invoices_merchant;
DROP INDEX IF EXISTS idx_ll_crm_invoices_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_status;

-- LocalLink CRM Payments
DROP INDEX IF EXISTS idx_ll_crm_payments_contact;
DROP INDEX IF EXISTS idx_ll_crm_payments_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_created_by;
DROP INDEX IF EXISTS idx_ll_crm_payments_date;
DROP INDEX IF EXISTS idx_ll_crm_payments_invoice;
DROP INDEX IF EXISTS idx_ll_crm_payments_invoice_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_merchant;
DROP INDEX IF EXISTS idx_ll_crm_payments_merchant_id;

-- LocalLink CRM Pipelines and Subscriptions
DROP INDEX IF EXISTS idx_ll_crm_pipelines_merchant;
DROP INDEX IF EXISTS idx_ll_crm_pipelines_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_status;
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_tier_id;

-- LocalLink CRM Workflow Executions
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_status;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_workflow;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_workflow_id;

-- LocalLink CRM Workflows
DROP INDEX IF EXISTS idx_ll_crm_workflows_active;
DROP INDEX IF EXISTS idx_ll_crm_workflows_merchant;
DROP INDEX IF EXISTS idx_ll_crm_workflows_merchant_id;

-- LocalLink Partner Commission Rules
DROP INDEX IF EXISTS idx_ll_partner_commission_rules_partner_id;
