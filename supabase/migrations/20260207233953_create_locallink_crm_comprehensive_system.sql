/*
  # Local-Link CRM - Comprehensive Universal Business Hub System

  1. Overview
    Complete CRM system with 5 pricing tiers ($45/$145/$299/$499/Enterprise)
    Includes Local-Link Books Lite & Pro accounting integration
    AI features gated by subscription add-ons
    Full invoice and payment processing capabilities

  2. Pricing Tiers
    - Starter CRM: $45/month (100 contacts, basic features)
    - Professional CRM: $145/month (1,000 contacts, enhanced features)
    - Business CRM: $299/month (5,000 contacts, advanced features)
    - Enterprise CRM: $499/month (25,000 contacts, all features)
    - Enterprise Plus: Custom pricing (unlimited, white-label, API)

  3. Core Features by Tier
    All Tiers: Contact management, basic pipeline, task management
    Pro+: Email campaigns, automation, custom fields
    Business+: Advanced reporting, integrations, team collaboration
    Enterprise+: AI features, API access, white-label, priority support

  4. Local-Link Books Integration
    - Books Lite: Included in Professional+ (invoice/expense tracking)
    - Books Pro: Included in Business+ (full accounting, tax ready)
*/

-- =====================================================
-- CRM PRICING TIERS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE,
  tier_level INTEGER NOT NULL UNIQUE,
  monthly_price NUMERIC(10,2) NOT NULL,
  annual_price NUMERIC(10,2),
  contact_limit INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_features_included BOOLEAN DEFAULT false,
  books_tier TEXT, -- 'none', 'lite', 'pro'
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert CRM pricing tiers
INSERT INTO ll_crm_pricing_tiers (tier_name, tier_level, monthly_price, annual_price, contact_limit, features, ai_features_included, books_tier, description)
VALUES
  ('Starter CRM', 1, 45.00, 480.00, 100, 
   '["Contact management (100 contacts)", "Basic pipeline (1 pipeline)", "Task management", "Basic reporting", "Email integration", "Mobile app access", "Standard support"]'::jsonb,
   false, 'none',
   'Perfect for solopreneurs and small teams just getting started with CRM'),
   
  ('Professional CRM', 2, 145.00, 1550.00, 1000,
   '["Contact management (1,000 contacts)", "Multiple pipelines (3 pipelines)", "Advanced task management", "Email campaigns (500/month)", "Custom fields", "Automation (5 workflows)", "Local-Link Books Lite", "Enhanced reporting", "Calendar integration", "File storage (5GB)", "Priority support"]'::jsonb,
   false, 'lite',
   'For growing businesses that need professional tools and basic accounting'),
   
  ('Business CRM', 3, 299.00, 3190.00, 5000,
   '["Contact management (5,000 contacts)", "Unlimited pipelines", "Advanced automation (25 workflows)", "Email campaigns (5,000/month)", "SMS campaigns (1,000/month)", "Local-Link Books Pro", "Advanced reporting & analytics", "Team collaboration tools", "Document management (25GB)", "API access (basic)", "Integrations (Zapier, etc)", "Custom branding", "Dedicated account manager", "AI features available (paid add-ons)"]'::jsonb,
   false, 'pro',
   'Complete business solution with full accounting and advanced features'),
   
  ('Enterprise CRM', 4, 499.00, 5340.00, 25000,
   '["Contact management (25,000 contacts)", "Unlimited everything", "Advanced automation (unlimited)", "Email campaigns (25,000/month)", "SMS campaigns (5,000/month)", "Local-Link Books Pro Plus", "Advanced AI features (5 included)", "Custom reporting & dashboards", "Team management & permissions", "Document management (100GB)", "Full API access", "All integrations", "White-label options", "Priority support 24/7", "Onboarding & training", "Quarterly business reviews"]'::jsonb,
   true, 'pro',
   'For large organizations that need unlimited power and AI capabilities'),
   
  ('Enterprise Plus', 5, 0.00, 0.00, NULL,
   '["Unlimited contacts", "Unlimited everything", "Complete white-label", "Full API & webhooks", "AI features (unlimited)", "Custom development", "Dedicated infrastructure", "24/7 premium support", "On-site training", "Custom SLAs", "Multi-tenant support", "Advanced security features"]'::jsonb,
   true, 'custom',
   'Custom enterprise solution with unlimited capabilities and dedicated support')
ON CONFLICT (tier_name) DO UPDATE SET
  tier_level = EXCLUDED.tier_level,
  monthly_price = EXCLUDED.monthly_price,
  annual_price = EXCLUDED.annual_price,
  contact_limit = EXCLUDED.contact_limit,
  features = EXCLUDED.features,
  ai_features_included = EXCLUDED.ai_features_included,
  books_tier = EXCLUDED.books_tier,
  description = EXCLUDED.description;

-- =====================================================
-- CRM SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES ll_crm_pricing_tiers(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, suspended, trial
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, annual
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  cancellation_date TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  contact_count INTEGER DEFAULT 0,
  ai_addon_enabled BOOLEAN DEFAULT false,
  ai_credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(merchant_id)
);

CREATE INDEX idx_ll_crm_subscriptions_merchant ON ll_crm_subscriptions(merchant_id);
CREATE INDEX idx_ll_crm_subscriptions_status ON ll_crm_subscriptions(status);

-- =====================================================
-- CONTACTS & LEADS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL DEFAULT 'lead', -- lead, customer, partner, vendor
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  
  -- Address
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  
  -- Lead scoring
  lead_score INTEGER DEFAULT 0,
  lead_status TEXT DEFAULT 'new', -- new, contacted, qualified, proposal, negotiation, won, lost
  lead_source TEXT, -- website, referral, social, advertising, etc
  
  -- Custom fields (JSONB for flexibility)
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Tags and categorization
  tags TEXT[],
  industry TEXT,
  company_size TEXT,
  
  -- Engagement tracking
  last_contacted_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  
  -- Assignment
  assigned_to UUID REFERENCES merchants(id),
  
  -- Lifecycle
  converted_to_customer_at TIMESTAMPTZ,
  lifetime_value NUMERIC(10,2) DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  
  -- Notes and relationships
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES merchants(id),
  is_archived BOOLEAN DEFAULT false
);

CREATE INDEX idx_ll_crm_contacts_merchant ON ll_crm_contacts(merchant_id);
CREATE INDEX idx_ll_crm_contacts_type ON ll_crm_contacts(contact_type);
CREATE INDEX idx_ll_crm_contacts_status ON ll_crm_contacts(lead_status);
CREATE INDEX idx_ll_crm_contacts_email ON ll_crm_contacts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_ll_crm_contacts_phone ON ll_crm_contacts(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_ll_crm_contacts_assigned ON ll_crm_contacts(assigned_to);
CREATE INDEX idx_ll_crm_contacts_tags ON ll_crm_contacts USING GIN(tags);

-- =====================================================
-- PIPELINES & DEALS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {name, order, probability}
  is_default BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_pipelines_merchant ON ll_crm_pipelines(merchant_id);

CREATE TABLE IF NOT EXISTS ll_crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES ll_crm_pipelines(id),
  contact_id UUID REFERENCES ll_crm_contacts(id),
  
  deal_name TEXT NOT NULL,
  deal_value NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  
  stage TEXT NOT NULL,
  probability INTEGER DEFAULT 50, -- 0-100
  expected_close_date DATE,
  actual_close_date DATE,
  
  status TEXT DEFAULT 'open', -- open, won, lost
  lost_reason TEXT,
  
  assigned_to UUID REFERENCES merchants(id),
  
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_archived BOOLEAN DEFAULT false
);

CREATE INDEX idx_ll_crm_deals_merchant ON ll_crm_deals(merchant_id);
CREATE INDEX idx_ll_crm_deals_pipeline ON ll_crm_deals(pipeline_id);
CREATE INDEX idx_ll_crm_deals_contact ON ll_crm_deals(contact_id);
CREATE INDEX idx_ll_crm_deals_status ON ll_crm_deals(status);
CREATE INDEX idx_ll_crm_deals_assigned ON ll_crm_deals(assigned_to);

-- =====================================================
-- ACTIVITIES & TASKS
-- =====================================================

CREATE TABLE IF NOT EXISTS ll_crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES ll_crm_contacts(id),
  deal_id UUID REFERENCES ll_crm_deals(id),
  
  activity_type TEXT NOT NULL, -- call, email, meeting, note, task
  subject TEXT,
  description TEXT,
  outcome TEXT,
  
  -- For tasks
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Assignment
  assigned_to UUID REFERENCES merchants(id),
  created_by UUID REFERENCES merchants(id),
  
  -- Metadata
  duration_minutes INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ll_crm_activities_merchant ON ll_crm_activities(merchant_id);
CREATE INDEX idx_ll_crm_activities_contact ON ll_crm_activities(contact_id);
CREATE INDEX idx_ll_crm_activities_deal ON ll_crm_activities(deal_id);
CREATE INDEX idx_ll_crm_activities_type ON ll_crm_activities(activity_type);
CREATE INDEX idx_ll_crm_activities_assigned ON ll_crm_activities(assigned_to);
CREATE INDEX idx_ll_crm_activities_due ON ll_crm_activities(due_date) WHERE is_completed = false;

COMMENT ON TABLE ll_crm_subscriptions IS 'CRM subscription management with tier tracking and AI credits';
COMMENT ON TABLE ll_crm_contacts IS 'Universal contact/lead management with custom fields and lead scoring';
COMMENT ON TABLE ll_crm_pipelines IS 'Customizable sales pipelines with configurable stages';
COMMENT ON TABLE ll_crm_deals IS 'Deal/opportunity tracking through pipeline stages';
COMMENT ON TABLE ll_crm_activities IS 'Activity timeline and task management for contacts and deals';
