/*
  # Internal Team CRM System - Core Tables

  Creates the foundational tables for the internal team CRM system

  ## New Tables
  1. internal_team_members - Team staff access
  2. business_units - All business entities  
  3. unified_customers - Central customer database
  4. customer_business_relationships - Multi-business tracking
  5. unified_sales - Sales across all businesses
  6. internal_invoices - Customer invoicing
  7. customer_support_tickets - Support system
  8. ticket_messages - Ticket communication
  9. customer_activity_log - Activity timeline
  10. customer_impersonation_log - Impersonation tracking
  11. email_communications - Email logs
  12. external_business_webhooks - Webhook data
  13. internal_accounting_ledger - Pro accounting system
*/

-- Create internal team members table
CREATE TABLE IF NOT EXISTS internal_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'support', 'developer', 'accountant')),
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create business units table
CREATE TABLE IF NOT EXISTS business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE NOT NULL,
  business_type text NOT NULL CHECK (business_type IN ('crm', 'marketplace', 'saas', 'service')),
  stripe_account_id text,
  tax_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create unified customers table
CREATE TABLE IF NOT EXISTS unified_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  business_name text,
  customer_type text NOT NULL DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business', 'merchant', 'partner')),
  primary_business_unit_id uuid REFERENCES business_units(id),
  total_lifetime_value numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'churned')),
  stripe_customer_id text,
  tags text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer business relationships table
CREATE TABLE IF NOT EXISTS customer_business_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES unified_customers(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES business_units(id),
  external_customer_id text,
  subscription_status text DEFAULT 'active',
  lifetime_value numeric DEFAULT 0,
  first_purchase_date date,
  last_purchase_date date,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, business_unit_id)
);

-- Create internal invoices table
CREATE TABLE IF NOT EXISTS internal_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES unified_customers(id),
  business_unit_id uuid REFERENCES business_units(id),
  issue_date date NOT NULL,
  due_date date NOT NULL,
  subtotal numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  amount_paid numeric DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  line_items jsonb NOT NULL,
  notes text,
  sent_at timestamptz,
  paid_at timestamptz,
  created_by uuid REFERENCES internal_team_members(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unified sales table
CREATE TABLE IF NOT EXISTS unified_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES unified_customers(id),
  business_unit_id uuid REFERENCES business_units(id),
  transaction_id text,
  order_number text,
  product_name text NOT NULL,
  product_sku text,
  amount numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  fee_amount numeric DEFAULT 0,
  net_amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  subscription_id text,
  invoice_id uuid REFERENCES internal_invoices(id),
  sale_date date NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create internal accounting ledger table (renamed to avoid conflict)
CREATE TABLE IF NOT EXISTS internal_accounting_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date date NOT NULL,
  business_unit_id uuid REFERENCES business_units(id),
  customer_id uuid REFERENCES unified_customers(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('revenue', 'expense', 'refund', 'fee', 'tax', 'adjustment')),
  category text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  debit_account text NOT NULL,
  credit_account text NOT NULL,
  reference_type text,
  reference_id uuid,
  tax_year integer NOT NULL,
  tax_quarter integer CHECK (tax_quarter BETWEEN 1 AND 4),
  is_reconciled boolean DEFAULT false,
  reconciled_at timestamptz,
  created_by uuid REFERENCES internal_team_members(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create customer support tickets table
CREATE TABLE IF NOT EXISTS customer_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES unified_customers(id),
  business_unit_id uuid REFERENCES business_units(id),
  subject text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  category text DEFAULT 'general',
  assigned_to uuid REFERENCES internal_team_members(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES customer_support_tickets(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('team', 'customer')),
  sender_id uuid NOT NULL,
  message text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_internal_note boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create customer activity log table
CREATE TABLE IF NOT EXISTS customer_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES unified_customers(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES business_units(id),
  activity_type text NOT NULL,
  activity_description text NOT NULL,
  performed_by uuid REFERENCES internal_team_members(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create customer impersonation log table
CREATE TABLE IF NOT EXISTS customer_impersonation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid REFERENCES internal_team_members(id),
  customer_id uuid REFERENCES unified_customers(id),
  business_unit_id uuid REFERENCES business_units(id),
  reason text NOT NULL,
  actions_taken text,
  session_start timestamptz NOT NULL,
  session_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create email communications table
CREATE TABLE IF NOT EXISTS email_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES unified_customers(id),
  business_unit_id uuid REFERENCES business_units(id),
  sent_by uuid REFERENCES internal_team_members(id),
  to_email text NOT NULL,
  from_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  email_type text NOT NULL,
  status text DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'failed')),
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create external business webhooks table
CREATE TABLE IF NOT EXISTS external_business_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid REFERENCES business_units(id),
  webhook_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_internal_team_email ON internal_team_members(email) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_unified_customers_email ON unified_customers(email);
CREATE INDEX IF NOT EXISTS idx_unified_customers_status ON unified_customers(status);
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business ON unified_customers(primary_business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_customers_stripe ON unified_customers(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_relationships_customer ON customer_business_relationships(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_relationships_business ON customer_business_relationships(business_unit_id);

CREATE INDEX IF NOT EXISTS idx_unified_sales_customer ON unified_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_business ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_date ON unified_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_unified_sales_status ON unified_sales(payment_status);

CREATE INDEX IF NOT EXISTS idx_invoices_customer ON internal_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON internal_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON internal_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_business ON internal_invoices(business_unit_id);

CREATE INDEX IF NOT EXISTS idx_ledger_date ON internal_accounting_ledger(transaction_date);
CREATE INDEX IF NOT EXISTS idx_ledger_business ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_ledger_tax_year ON internal_accounting_ledger(tax_year);
CREATE INDEX IF NOT EXISTS idx_ledger_reconciled ON internal_accounting_ledger(is_reconciled);

CREATE INDEX IF NOT EXISTS idx_tickets_customer ON customer_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON customer_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_business ON customer_support_tickets(business_unit_id);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);

CREATE INDEX IF NOT EXISTS idx_activity_log_customer ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON customer_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_business ON customer_activity_log(business_unit_id);

CREATE INDEX IF NOT EXISTS idx_impersonation_team ON customer_impersonation_log(team_member_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_customer ON customer_impersonation_log(customer_id);

CREATE INDEX IF NOT EXISTS idx_emails_customer ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON email_communications(status);

CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON external_business_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_business ON external_business_webhooks(business_unit_id);

-- Enable RLS
ALTER TABLE internal_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_business_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_accounting_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_impersonation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_business_webhooks ENABLE ROW LEVEL SECURITY;

-- Seed business units
INSERT INTO business_units (name, domain, business_type, metadata) VALUES
  ('TradeHive CRM', 'tradehivecrm.com', 'crm', '{"description": "CRM for trades and contractors"}'::jsonb),
  ('AdSuite CRM', 'adsuitecrm.com', 'crm', '{"description": "CRM for marketing agencies"}'::jsonb),
  ('Local-Link Marketplace', 'local-link.app', 'marketplace', '{"description": "Local business marketplace platform"}'::jsonb),
  ('My Budget Buster', 'mybudgetbuster.com', 'service', '{"description": "Budget management service"}'::jsonb),
  ('PetConnect CRM', 'petconnect.app', 'crm', '{"description": "CRM for pet service businesses"}'::jsonb),
  ('CareCompanion HQ', 'carecompanion.app', 'saas', '{"description": "Family care coordination platform"}'::jsonb),
  ('Fresh & Clean Laundry', 'freshclean.app', 'saas', '{"description": "Laundry service management SAAS"}'::jsonb)
ON CONFLICT (domain) DO NOTHING;
