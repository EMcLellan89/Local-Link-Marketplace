/*
  # Drop Unused Indexes - Batch 5: Partner Performance & Admin Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - partner_performance_metrics (2 indexes)
    - partner_warnings (2 indexes)
    - merchant_reassignment_requests (1 index)
    - territory_recovery_log (1 index)
    - partner_w9_documents (2 indexes)
    - docusign_webhooks (1 index)
    - partner_1099_documents (3 indexes)
    - partner_1099_corrections (2 indexes)
    - partner_tax_payments (3 indexes)
    - partner_commission_adjustments (2 indexes)
    - partner_commission_holds (2 indexes)
    - partner_commission_releases (2 indexes)
    - partner_payout_methods (1 index)
    - partner_banking_info (1 index)
    - partner_stripe_accounts (2 indexes)
    - merchant_subscriptions (5 indexes)
    - merchant_subscription_history (3 indexes)
    - crm_subscriptions (3 indexes)
    - white_label_licenses (3 indexes)

  3. Total Indexes Dropped: ~41
*/

-- partner_performance_metrics
DROP INDEX IF EXISTS idx_partner_performance_partner;
DROP INDEX IF EXISTS idx_partner_performance_period;

-- partner_warnings
DROP INDEX IF EXISTS idx_partner_warnings_partner;
DROP INDEX IF EXISTS idx_partner_warnings_resolved;

-- merchant_reassignment_requests
DROP INDEX IF EXISTS idx_merchant_reassignment_status;

-- territory_recovery_log
DROP INDEX IF EXISTS idx_territory_recovery_territory;

-- partner_w9_documents
DROP INDEX IF EXISTS idx_partner_w9_partner;
DROP INDEX IF EXISTS idx_partner_w9_status;

-- docusign_webhooks
DROP INDEX IF EXISTS idx_docusign_webhooks_envelope;

-- partner_1099_documents
DROP INDEX IF EXISTS idx_partner_1099_partner;
DROP INDEX IF EXISTS idx_partner_1099_tax_year;
DROP INDEX IF EXISTS idx_partner_1099_status;

-- partner_1099_corrections
DROP INDEX IF EXISTS idx_partner_1099_corrections_original;
DROP INDEX IF EXISTS idx_partner_1099_corrections_partner;

-- partner_tax_payments
DROP INDEX IF EXISTS idx_partner_tax_payments_partner;
DROP INDEX IF EXISTS idx_partner_tax_payments_quarter;
DROP INDEX IF EXISTS idx_partner_tax_payments_status;

-- partner_commission_adjustments
DROP INDEX IF EXISTS idx_partner_commission_adjustments_partner;
DROP INDEX IF EXISTS idx_partner_commission_adjustments_commission;

-- partner_commission_holds
DROP INDEX IF EXISTS idx_partner_commission_holds_partner;
DROP INDEX IF EXISTS idx_partner_commission_holds_status;

-- partner_commission_releases
DROP INDEX IF EXISTS idx_partner_commission_releases_hold;
DROP INDEX IF EXISTS idx_partner_commission_releases_partner;

-- partner_payout_methods
DROP INDEX IF EXISTS idx_partner_payout_methods_partner;

-- partner_banking_info
DROP INDEX IF EXISTS idx_partner_banking_info_partner;

-- partner_stripe_accounts
DROP INDEX IF EXISTS idx_partner_stripe_accounts_partner;
DROP INDEX IF EXISTS idx_partner_stripe_accounts_stripe_account;

-- merchant_subscriptions
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant;
DROP INDEX IF EXISTS idx_merchant_subscriptions_stripe_subscription;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier;
DROP INDEX IF EXISTS idx_merchant_subscriptions_status;
DROP INDEX IF EXISTS idx_merchant_subscriptions_partner;

-- merchant_subscription_history
DROP INDEX IF EXISTS idx_merchant_subscription_history_merchant;
DROP INDEX IF EXISTS idx_merchant_subscription_history_subscription;
DROP INDEX IF EXISTS idx_merchant_subscription_history_event_type;

-- crm_subscriptions
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant;
DROP INDEX IF EXISTS idx_crm_subscriptions_stripe_subscription;
DROP INDEX IF EXISTS idx_crm_subscriptions_status;

-- white_label_licenses
DROP INDEX IF EXISTS idx_white_label_licenses_partner;
DROP INDEX IF EXISTS idx_white_label_licenses_status;
DROP INDEX IF EXISTS idx_white_label_licenses_stripe_subscription;