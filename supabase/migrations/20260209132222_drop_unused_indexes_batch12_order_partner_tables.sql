/*
  # Drop Unused Indexes - Batch 12: Order and Partner Tables (Part 1)

  1. Changes
    - Drop unused indexes from order_* tables
    - Drop unused indexes from org_* and outreach tables
    - Drop unused indexes from partner_* tables (first batch)
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces database overhead
*/

-- Order tables
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_orders_user_id;

-- Org and outreach
DROP INDEX IF EXISTS idx_org_members_profile_id;
DROP INDEX IF EXISTS idx_outreach_logs_partner_id;

-- Partner accounting
DROP INDEX IF EXISTS idx_partner_accounting_categories_parent_category_id;
DROP INDEX IF EXISTS idx_partner_accounting_pro_partner_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_bank_account_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_category_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_deal_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_partner_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_tax_payment_id;

-- Partner activity and ads
DROP INDEX IF EXISTS idx_partner_activity_log_partner_id;
DROP INDEX IF EXISTS idx_partner_ad_budgets_partner_id;

-- Partner agreements and AI
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;

-- Partner applications and assets
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;
DROP INDEX IF EXISTS idx_partner_assets_partner_id;

-- Partner badges and bank
DROP INDEX IF EXISTS idx_partner_badge_awards_partner_id;
DROP INDEX IF EXISTS idx_partner_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id;

-- Partner bonuses and campaigns
DROP INDEX IF EXISTS idx_partner_bonuses_affiliate_id;
DROP INDEX IF EXISTS idx_partner_campaigns_creative_id;
DROP INDEX IF EXISTS idx_partner_campaigns_partner_id;

-- Partner certifications
DROP INDEX IF EXISTS idx_partner_certifications_certification_id;
DROP INDEX IF EXISTS idx_partner_certs_cert_id;
DROP INDEX IF EXISTS idx_partner_certs_partner_id;

-- Partner challenges
DROP INDEX IF EXISTS idx_partner_challenge_enrollments_partner_id;
DROP INDEX IF EXISTS idx_partner_challenge_progress_enrollment_id;
DROP INDEX IF EXISTS idx_partner_challenge_progress_partner_id;

-- Partner contracts
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
