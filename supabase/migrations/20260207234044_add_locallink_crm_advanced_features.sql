/*
  # Local-Link CRM - Advanced Features Part 2

  1. Email Campaigns & Marketing
  2. Automation & Workflows
  3. Documents & Files
  4. Invoicing & Payments
  5. AI Features (gated by subscription)
  6. Books Lite/Pro Integration
  7. Analytics & Reporting
*/

-- =====================================================
-- EMAIL CAMPAIGNS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  subject_line TEXT,
  from_name TEXT,
  from_email TEXT,
  reply_to_email TEXT,
  
  -- Content
  email_body_html TEXT,
  email_body_text TEXT,
  
  -- Targeting
  target_segment JSONB, -- Criteria for selecting contacts
  target_contact_count INTEGER DEFAULT 0,
  
  -- Schedule
  scheduled_send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, paused
  
  -- Stats
  recipients_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_bounced INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_email_campaigns_merchant ON ll_crm_email_campaigns(merchant_id);
CREATE INDEX idx_ll_crm_email_campaigns_status ON ll_crm_email_campaigns(status);

CREATE TABLE IF NOT EXISTS ll_crm_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES ll_crm_email_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES ll_crm_contacts(id),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  
  bounce_reason TEXT,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  status TEXT DEFAULT 'sent' -- sent, delivered, opened, clicked, bounced, unsubscribed
);

CREATE INDEX idx_ll_crm_email_sends_campaign ON ll_crm_email_sends(campaign_id);
CREATE INDEX idx_ll_crm_email_sends_contact ON ll_crm_email_sends(contact_id);
CREATE INDEX idx_ll_crm_email_sends_merchant ON ll_crm_email_sends(merchant_id);

-- =====================================================
-- AUTOMATION & WORKFLOWS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type TEXT NOT NULL, -- contact_created, deal_stage_changed, form_submitted, etc
  trigger_config JSONB DEFAULT '{}'::jsonb,
  
  -- Actions
  actions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {type, config, delay}
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Stats
  triggered_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_workflows_merchant ON ll_crm_workflows(merchant_id);
CREATE INDEX idx_ll_crm_workflows_active ON ll_crm_workflows(is_active);

CREATE TABLE IF NOT EXISTS ll_crm_workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES ll_crm_workflows(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES ll_crm_contacts(id),
  deal_id UUID REFERENCES ll_crm_deals(id),
  
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running', -- running, completed, failed, cancelled
  
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER,
  
  execution_log JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_workflow_executions_workflow ON ll_crm_workflow_executions(workflow_id);
CREATE INDEX idx_ll_crm_workflow_executions_status ON ll_crm_workflow_executions(status);

-- =====================================================
-- DOCUMENTS & FILES
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES ll_crm_contacts(id),
  deal_id UUID REFERENCES ll_crm_deals(id),
  
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  
  -- Categorization
  document_type TEXT, -- contract, proposal, invoice, receipt, other
  tags TEXT[],
  
  -- Access
  uploaded_by UUID REFERENCES merchants(id),
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_documents_merchant ON ll_crm_documents(merchant_id);
CREATE INDEX idx_ll_crm_documents_contact ON ll_crm_documents(contact_id);
CREATE INDEX idx_ll_crm_documents_deal ON ll_crm_documents(deal_id);
CREATE INDEX idx_ll_crm_documents_type ON ll_crm_documents(document_type);

-- =====================================================
-- INVOICING & PAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES ll_crm_contacts(id),
  
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  
  -- Amounts
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  amount_due NUMERIC(10,2),
  
  -- Line items
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Notes
  notes TEXT,
  terms TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Payment info
  payment_method TEXT,
  payment_reference TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES merchants(id),
  
  UNIQUE(merchant_id, invoice_number)
);

CREATE INDEX idx_ll_crm_invoices_merchant ON ll_crm_invoices(merchant_id);
CREATE INDEX idx_ll_crm_invoices_contact ON ll_crm_invoices(contact_id);
CREATE INDEX idx_ll_crm_invoices_status ON ll_crm_invoices(status);
CREATE INDEX idx_ll_crm_invoices_date ON ll_crm_invoices(invoice_date DESC);
CREATE INDEX idx_ll_crm_invoices_due_date ON ll_crm_invoices(due_date) WHERE status != 'paid';

CREATE TABLE IF NOT EXISTS ll_crm_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES ll_crm_invoices(id),
  contact_id UUID REFERENCES ll_crm_contacts(id),
  
  payment_amount NUMERIC(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT, -- cash, check, credit_card, bank_transfer, stripe, paypal
  
  reference_number TEXT,
  notes TEXT,
  
  -- Stripe integration
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES merchants(id)
);

CREATE INDEX idx_ll_crm_payments_merchant ON ll_crm_payments(merchant_id);
CREATE INDEX idx_ll_crm_payments_invoice ON ll_crm_payments(invoice_id);
CREATE INDEX idx_ll_crm_payments_contact ON ll_crm_payments(contact_id);
CREATE INDEX idx_ll_crm_payments_date ON ll_crm_payments(payment_date DESC);

-- =====================================================
-- AI FEATURES (Gated by subscription)
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_ai_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL UNIQUE,
  feature_type TEXT NOT NULL, -- lead_scoring, email_writing, data_enrichment, etc
  description TEXT,
  credits_per_use INTEGER DEFAULT 1,
  min_tier_required INTEGER DEFAULT 3, -- Minimum tier level needed
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pre-populate AI features
INSERT INTO ll_crm_ai_features (feature_name, feature_type, description, credits_per_use, min_tier_required)
VALUES
  ('AI Lead Scoring', 'lead_scoring', 'Automatically score leads based on behavior and engagement', 1, 3),
  ('AI Email Writer', 'email_writing', 'Generate personalized email content using AI', 2, 3),
  ('AI Meeting Summarizer', 'meeting_summary', 'Automatically summarize meeting notes and extract action items', 3, 3),
  ('AI Contact Enrichment', 'data_enrichment', 'Enrich contact data with company info, social profiles, etc', 5, 3),
  ('AI Sales Forecasting', 'forecasting', 'Predict deal close probability and revenue forecasts', 10, 4),
  ('AI Chatbot', 'chatbot', 'AI-powered chat assistant for customer interactions', 1, 4),
  ('AI Call Transcription', 'transcription', 'Transcribe and analyze sales calls automatically', 5, 4),
  ('AI Sentiment Analysis', 'sentiment', 'Analyze customer sentiment from emails and interactions', 2, 3),
  ('AI Next Best Action', 'recommendations', 'Get AI recommendations for next steps with contacts', 3, 4),
  ('AI Data Insights', 'analytics', 'AI-powered insights and trend analysis on your CRM data', 5, 4)
ON CONFLICT (feature_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS ll_crm_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES ll_crm_ai_features(id),
  contact_id UUID REFERENCES ll_crm_contacts(id),
  deal_id UUID REFERENCES ll_crm_deals(id),
  
  credits_used INTEGER DEFAULT 1,
  result JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_ai_usage_merchant ON ll_crm_ai_usage(merchant_id);
CREATE INDEX idx_ll_crm_ai_usage_feature ON ll_crm_ai_usage(feature_id);
CREATE INDEX idx_ll_crm_ai_usage_created ON ll_crm_ai_usage(created_at DESC);

-- =====================================================
-- LOCAL-LINK BOOKS INTEGRATION
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_books_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL, -- supplies, software, marketing, etc
  vendor_name TEXT,
  description TEXT,
  
  -- Receipt
  receipt_url TEXT,
  
  -- Tax
  is_tax_deductible BOOLEAN DEFAULT true,
  
  -- Accounting
  account_code TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES merchants(id)
);

CREATE INDEX idx_ll_books_expenses_merchant ON ll_books_expenses(merchant_id);
CREATE INDEX idx_ll_books_expenses_date ON ll_books_expenses(expense_date DESC);
CREATE INDEX idx_ll_books_expenses_category ON ll_books_expenses(category);

CREATE TABLE IF NOT EXISTS ll_books_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES ll_crm_invoices(id),
  
  income_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  
  -- Accounting
  account_code TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_books_income_merchant ON ll_books_income(merchant_id);
CREATE INDEX idx_ll_books_income_date ON ll_books_income(income_date DESC);

COMMENT ON TABLE ll_crm_email_campaigns IS 'Email marketing campaigns with targeting and analytics';
COMMENT ON TABLE ll_crm_workflows IS 'Marketing automation workflows with trigger-action sequences';
COMMENT ON TABLE ll_crm_documents IS 'Document storage and management linked to contacts and deals';
COMMENT ON TABLE ll_crm_invoices IS 'Invoice management and tracking with line items';
COMMENT ON TABLE ll_crm_payments IS 'Payment tracking and Stripe integration';
COMMENT ON TABLE ll_crm_ai_features IS 'AI feature catalog with credit costs and tier requirements';
COMMENT ON TABLE ll_crm_ai_usage IS 'Track AI feature usage and credit consumption';
COMMENT ON TABLE ll_books_expenses IS 'Local-Link Books expense tracking';
COMMENT ON TABLE ll_books_income IS 'Local-Link Books income tracking';
