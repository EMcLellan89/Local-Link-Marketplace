/*
  # Add Missing Foreign Key Indexes - Batch 4: Partner, DFY, Invoice Tables
  
  1. Purpose
    - Add covering indexes for unindexed foreign key constraints
    - Focuses on partner, DFY orders, invoices, and campaigns
  
  2. Tables Affected
    - dfy_orders: product_id, referral_partner_id, user_id, stripe IDs
    - email_campaigns: merchant_id, template_id
    - invoice_items: invoice_id
    - invoices: customer_id, merchant_id
    - partner_contracts: partner_id
    - partner_crm_contacts: company_id, partner_id
    - partner_crm_deals: admin_crm_sale_id, company_id, contact_id, partner_id, stripe_payment_intent_id
  
  3. Security
    - Indexes improve performance of FK constraint checks
    - No RLS changes required
*/

-- DFY Orders
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id 
  ON public.dfy_orders(product_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_referral_partner_id 
  ON public.dfy_orders(referral_partner_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_user_id 
  ON public.dfy_orders(user_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_stripe_checkout_session_id 
  ON public.dfy_orders(stripe_checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_stripe_customer_id 
  ON public.dfy_orders(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_stripe_payment_intent_id 
  ON public.dfy_orders(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_dfy_orders_stripe_subscription_id 
  ON public.dfy_orders(stripe_subscription_id);

-- Email Campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id 
  ON public.email_campaigns(merchant_id);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_template_id 
  ON public.email_campaigns(template_id);

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id 
  ON public.invoice_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
  ON public.invoices(customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id 
  ON public.invoices(merchant_id);

-- Partner Tables
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id 
  ON public.partner_contracts(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_company_id 
  ON public.partner_crm_contacts(company_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id 
  ON public.partner_crm_contacts(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_admin_crm_sale_id 
  ON public.partner_crm_deals(admin_crm_sale_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_company_id 
  ON public.partner_crm_deals(company_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id 
  ON public.partner_crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id 
  ON public.partner_crm_deals(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_stripe_payment_intent_id 
  ON public.partner_crm_deals(stripe_payment_intent_id);