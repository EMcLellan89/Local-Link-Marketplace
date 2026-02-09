/*
  # Add Missing Foreign Key Indexes - Batch 8: Partner Tables

  1. Performance Improvements
    - Adds indexes for all unindexed foreign keys in partner-related tables
    - Improves JOIN performance for partner queries
    - Optimizes referential integrity checks

  2. Tables Covered
    - partner_accounting_categories
    - partner_accounting_pro
    - partner_accounting_transactions
    - partner_agreement_acceptances
    - partner_agreements
    - partner_ai_commissions
    - partner_applications
    - partner_assets
    - partner_bank_accounts
    - partner_bonus_awards
    - partner_bonuses
    - partner_contracts
    - partner_crm_* tables
    - partner_customer_links
    - partner_deal_sync_log
    - partner_dfy_tracking_links
    - partner_onboarding_progress
    - partner_overrides
    - partner_quarterly_taxes
    - partner_referrals
    - partner_settings
    - partner_subscriptions
    - partner_tax_payments
    - partner_tax_settings
    - partner_team_members
    - partner_warning_logs
    - partners
*/

-- partner_accounting_categories
CREATE INDEX IF NOT EXISTS idx_partner_accounting_categories_parent_category_id ON partner_accounting_categories(parent_category_id);

-- partner_accounting_pro
CREATE INDEX IF NOT EXISTS idx_partner_accounting_pro_partner_id ON partner_accounting_pro(partner_id);

-- partner_accounting_transactions
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_bank_account_id ON partner_accounting_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_category_id ON partner_accounting_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_deal_id ON partner_accounting_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_partner_id ON partner_accounting_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_tax_payment_id ON partner_accounting_transactions(tax_payment_id);

-- partner_agreement_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id ON partner_agreement_acceptances(user_id);

-- partner_agreements
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id ON partner_agreements(partner_id);

-- partner_ai_commissions
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON partner_ai_commissions(partner_id);

-- partner_applications
CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by ON partner_applications(reviewed_by);

-- partner_assets
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id ON partner_assets(partner_id);

-- partner_bank_accounts
CREATE INDEX IF NOT EXISTS idx_partner_bank_accounts_partner_id ON partner_bank_accounts(partner_id);

-- partner_bonus_awards
CREATE INDEX IF NOT EXISTS idx_partner_bonus_awards_partner_id ON partner_bonus_awards(partner_id);

-- partner_bonuses
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id ON partner_bonuses(affiliate_id);

-- partner_contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);

-- partner_crm_companies
CREATE INDEX IF NOT EXISTS idx_partner_crm_companies_partner_id ON partner_crm_companies(partner_id);

-- partner_crm_contacts
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_company_id ON partner_crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id ON partner_crm_contacts(partner_id);

-- partner_crm_deal_notes
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_deal_id ON partner_crm_deal_notes(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_partner_id ON partner_crm_deal_notes(partner_id);

-- partner_crm_deal_products
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_deal_id ON partner_crm_deal_products(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_partner_id ON partner_crm_deal_products(partner_id);

-- partner_crm_deals
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_company_id ON partner_crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id ON partner_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id ON partner_crm_deals(partner_id);

-- partner_crm_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON partner_crm_subscriptions(partner_id);

-- partner_customer_links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON partner_customer_links(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_partner_id ON partner_customer_links(partner_id);

-- partner_deal_sync_log
CREATE INDEX IF NOT EXISTS idx_partner_deal_sync_log_partner_deal_id ON partner_deal_sync_log(partner_deal_id);

-- partner_dfy_tracking_links
CREATE INDEX IF NOT EXISTS idx_partner_dfy_tracking_links_product_id ON partner_dfy_tracking_links(product_id);

-- partner_onboarding_progress
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_partner_id ON partner_onboarding_progress(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key ON partner_onboarding_progress(step_key);

-- partner_overrides
CREATE INDEX IF NOT EXISTS idx_partner_overrides_partner_id ON partner_overrides(partner_id);

-- partner_quarterly_taxes
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_bank_account_id ON partner_quarterly_taxes(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_partner_id ON partner_quarterly_taxes(partner_id);

-- partner_referrals
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON partner_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_partner_id ON partner_referrals(partner_id);

-- partner_settings
CREATE INDEX IF NOT EXISTS idx_partner_settings_partner_id ON partner_settings(partner_id);

-- partner_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id ON partner_subscriptions(tier_id);

-- partner_tax_payments
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_bank_account_id ON partner_tax_payments(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);

-- partner_tax_settings
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_autopay_bank_account_id ON partner_tax_settings(autopay_bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_partner_id ON partner_tax_settings(partner_id);

-- partner_team_members
CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id ON partner_team_members(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_team_members_user_id ON partner_team_members(user_id);

-- partner_warning_logs
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);

-- partners
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
