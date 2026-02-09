/*
  # Fix Missing Foreign Key Indexes - Batch 11 (Partner Tables Part 2)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - partner tables (onboarding, quarterly taxes, referrals, subscriptions, tax payments, tax settings, warning logs, partners main)
*/

CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key ON partner_onboarding_progress(step_key);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_bank_account_id ON partner_quarterly_taxes(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON partner_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id ON partner_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_bank_account_id ON partner_tax_payments(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_autopay_bank_account_id ON partner_tax_settings(autopay_bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
