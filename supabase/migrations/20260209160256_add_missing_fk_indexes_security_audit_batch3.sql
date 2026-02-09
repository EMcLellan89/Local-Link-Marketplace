/*
  # Add Missing Foreign Key Indexes - Security Audit Batch 3

  1. Purpose
    - Continue adding missing foreign key indexes
    
  2. Tables Updated (Batch 3 - Team, Partner & Misc tables)
    - merchant_team_members
    - milestone_badge_audit_log
    - outreach_logs
    - partner_accounting_categories
    - partner_accounting_transactions
    - partner_badges
    - partner_bank_accounts
    - partner_certifications
    - partner_certs
    - partner_crm_companies
    - partner_crm_contacts
    - partner_crm_deal_notes
    - partner_crm_deal_products
    - partner_crm_deals
*/

-- Merchant team
CREATE INDEX IF NOT EXISTS idx_merchant_team_members_user_id
  ON merchant_team_members(user_id);

-- Milestone badges
CREATE INDEX IF NOT EXISTS idx_milestone_badge_audit_log_badge_id
  ON milestone_badge_audit_log(badge_id);

-- Outreach
CREATE INDEX IF NOT EXISTS idx_outreach_logs_partner_id
  ON outreach_logs(partner_id);

-- Partner accounting
CREATE INDEX IF NOT EXISTS idx_partner_accounting_categories_parent_category_id
  ON partner_accounting_categories(parent_category_id);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_bank_account_id
  ON partner_accounting_transactions(bank_account_id);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_category_id
  ON partner_accounting_transactions(category_id);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_deal_id
  ON partner_accounting_transactions(deal_id);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_partner_id
  ON partner_accounting_transactions(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_tax_payment_id
  ON partner_accounting_transactions(tax_payment_id);

-- Partner badges & certs
CREATE INDEX IF NOT EXISTS idx_partner_badges_badge_id
  ON partner_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_partner_bank_accounts_partner_id
  ON partner_bank_accounts(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_certifications_certification_id
  ON partner_certifications(certification_id);

CREATE INDEX IF NOT EXISTS idx_partner_certs_cert_id
  ON partner_certs(cert_id);

-- Partner CRM
CREATE INDEX IF NOT EXISTS idx_partner_crm_companies_partner_id
  ON partner_crm_companies(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_company_id
  ON partner_crm_contacts(company_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id
  ON partner_crm_contacts(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_deal_id
  ON partner_crm_deal_notes(deal_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_partner_id
  ON partner_crm_deal_notes(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_deal_id
  ON partner_crm_deal_products(deal_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_partner_id
  ON partner_crm_deal_products(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_company_id
  ON partner_crm_deals(company_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id
  ON partner_crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id
  ON partner_crm_deals(partner_id);
