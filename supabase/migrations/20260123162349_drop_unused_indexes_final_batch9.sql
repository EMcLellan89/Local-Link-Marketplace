/*
  # Drop Unused Indexes - Final Batch 9 (Notifications and Orders)

  This migration removes unused indexes from notification and order tables.

  Tables covered:
  - notifications
  - order_items
  - orders
  - partner_accounting_categories
  - partner_accounting_transactions
  - partner_agreement_acceptances
  - partner_agreements
  - partner_ai_commissions
  - partner_applications
  - partner_assets
  - partner_bonuses
  - partner_contracts
  - partner_crm_deals
  - partner_crm_subscriptions
  - partner_customer_links
  - partner_deal_sync_log
  - partner_onboarding_progress
  - partner_quarterly_taxes
  - partner_referrals
  - partner_subscriptions
  - partner_tax_payments
  - partner_tax_settings
  - partner_warning_logs
  - partners
*/

-- Notifications and Orders
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_orders_user_id;

-- Partner Accounting
DROP INDEX IF EXISTS idx_partner_accounting_categories_parent_category_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_bank_account_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_deal_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_tax_payment_id;

-- Partner Tables
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;
DROP INDEX IF EXISTS idx_partner_assets_partner_id;
DROP INDEX IF EXISTS idx_partner_bonuses_affiliate_id;
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;
DROP INDEX IF EXISTS idx_partner_deal_sync_log_partner_deal_id;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_bank_account_id;
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_bank_account_id;
DROP INDEX IF EXISTS idx_partner_tax_settings_autopay_bank_account_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_partners_user_id;