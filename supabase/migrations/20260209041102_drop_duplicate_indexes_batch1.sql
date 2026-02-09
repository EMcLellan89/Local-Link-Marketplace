/*
  # Drop Duplicate Indexes - Batch 1

  1. Performance Optimization
    - Removes duplicate indexes covering same columns
    - Keeps unique constraint indexes (_key, _pkey)
    - Drops redundant non-unique indexes

  2. Tables Affected (15 tables with duplicates)
    - ll_crm_subscriptions (3 → 1)
    - partner_special_overrides (3 → 1)
    - transaction_categorizations (3 → 1)
    - And 12 more tables with 2 → 1 indexes

  3. Strategy
    - Keep unique constraint indexes (enforced by database)
    - Drop additional indexes on same columns
    - Reduces write overhead and storage

  Important: Always keeping constraint indexes
*/

-- ll_crm_subscriptions: keep unique constraint, drop duplicates
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_merchant;
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_merchant_id;
-- Keep: ll_crm_subscriptions_merchant_id_key (unique constraint)

-- partner_special_overrides: keep unique constraint, drop duplicates
DROP INDEX IF EXISTS idx_partner_special_overrides_partner_id;
DROP INDEX IF EXISTS idx_partner_special_overrides_partner;
-- Keep: partner_special_overrides_partner_id_key (unique constraint)

-- transaction_categorizations: keep unique constraint, drop duplicates
DROP INDEX IF EXISTS transaction_categorizations_tx_idx;
DROP INDEX IF EXISTS idx_transaction_categorizations_transaction_id;
-- Keep: transaction_categorizations_transaction_id_key (unique constraint)

-- course_pricing: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_course_pricing_course_id;
-- Keep: course_pricing_course_id_key (unique constraint)

-- customer_referral_programs: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_customer_referral_programs_merchant_id;
-- Keep: customer_referral_programs_merchant_id_key (unique constraint)

-- merchant_settings: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_merchant_settings_merchant_id;
-- Keep: merchant_settings_merchant_id_key (unique constraint)

-- merchant_crm_preferences: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_merchant_crm_preferences_merchant_id;
-- Keep: merchant_crm_preferences_merchant_id_key (unique constraint)

-- customer_memberships: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_customer_memberships_customer_id;
-- Keep: customer_memberships_customer_id_key (unique constraint)

-- course_webinar_content: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_course_webinar_course_id;
-- Keep: course_webinar_content_course_id_key (unique constraint)

-- paybright_config: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_paybright_config_merchant_id;
-- Keep: paybright_config_merchant_id_key (unique constraint)

-- partner_uplines: keep primary key, drop duplicate
DROP INDEX IF EXISTS idx_partner_uplines_partner_id;
-- Keep: partner_uplines_pkey (primary key)

-- deal_transactions: drop one duplicate (keep first)
DROP INDEX IF EXISTS idx_deal_transactions_bundle_id;
-- Keep: idx_deal_transactions_bundle

-- ll_crm_deals: drop one duplicate (keep first)
DROP INDEX IF EXISTS idx_ll_crm_deals_pipeline_id;
-- Keep: idx_ll_crm_deals_pipeline

-- ll_crm_documents: drop one duplicate (keep first)
DROP INDEX IF EXISTS idx_ll_crm_documents_contact_id;
-- Keep: idx_ll_crm_documents_contact

-- partner_tax_settings: keep unique constraint, drop duplicate
DROP INDEX IF EXISTS idx_partner_tax_settings_partner_id;
-- Keep: partner_tax_settings_partner_id_key (unique constraint)
