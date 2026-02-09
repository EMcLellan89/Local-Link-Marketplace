/*
  # Fix Missing Foreign Key Indexes - Batch 10 (Partner Tables Part 1)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - partner tables (accounting, agreements, AI, applications, assets, bonuses, contracts, CRM)
*/

CREATE INDEX IF NOT EXISTS idx_partner_accounting_categories_parent_category_id ON partner_accounting_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_bank_account_id ON partner_accounting_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_deal_id ON partner_accounting_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_tax_payment_id ON partner_accounting_transactions(tax_payment_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id ON partner_agreement_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id ON partner_agreements(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON partner_ai_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by ON partner_applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id ON partner_assets(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id ON partner_bonuses(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id ON partner_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON partner_crm_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON partner_customer_links(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_sync_log_partner_deal_id ON partner_deal_sync_log(partner_deal_id);
