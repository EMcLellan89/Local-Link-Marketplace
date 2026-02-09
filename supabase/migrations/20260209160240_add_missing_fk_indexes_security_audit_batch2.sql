/*
  # Add Missing Foreign Key Indexes - Security Audit Batch 2

  1. Purpose
    - Continue adding missing foreign key indexes for query performance
    
  2. Tables Updated (Batch 2 - Deals, DFY, Jobs & LocalLink CRM tables)
    - deals
    - dfy_jobs
    - jobs
    - ll_books_expenses
    - ll_books_income
    - ll_crm_ai_usage
    - ll_crm_documents
    - ll_crm_email_sends
    - ll_crm_invoices
    - ll_crm_payments
    - ll_crm_workflow_executions
*/

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id
  ON deals(merchant_id);

-- DFY Jobs
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_merchant_order_id
  ON dfy_jobs(merchant_order_id);

-- Jobs
CREATE INDEX IF NOT EXISTS idx_jobs_created_by_admin_id
  ON jobs(created_by_admin_id);

CREATE INDEX IF NOT EXISTS idx_jobs_merchant_id
  ON jobs(merchant_id);

-- LocalLink Books
CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_created_by
  ON ll_books_expenses(created_by);

CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_merchant_id
  ON ll_books_expenses(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_books_income_invoice_id
  ON ll_books_income(invoice_id);

CREATE INDEX IF NOT EXISTS idx_ll_books_income_merchant_id
  ON ll_books_income(merchant_id);

-- LocalLink CRM
CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_contact_id
  ON ll_crm_ai_usage(contact_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_deal_id
  ON ll_crm_ai_usage(deal_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_feature_id
  ON ll_crm_ai_usage(feature_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_contact_id
  ON ll_crm_documents(contact_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_deal_id
  ON ll_crm_documents(deal_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_uploaded_by
  ON ll_crm_documents(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_merchant_id
  ON ll_crm_email_sends(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_invoices_created_by
  ON ll_crm_invoices(created_by);

CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_contact_id
  ON ll_crm_payments(contact_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_created_by
  ON ll_crm_payments(created_by);

CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_contact_id
  ON ll_crm_workflow_executions(contact_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_deal_id
  ON ll_crm_workflow_executions(deal_id);
