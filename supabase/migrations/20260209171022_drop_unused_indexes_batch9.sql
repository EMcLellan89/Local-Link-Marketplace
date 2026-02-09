/*
  # Drop Unused Indexes - Batch 9
*/

DROP INDEX IF EXISTS idx_upsell_purchases_user_id;
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;
DROP INDEX IF EXISTS idx_certificates_issued_user_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;
DROP INDEX IF EXISTS idx_partner_bonuses_affiliate_id;
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;
DROP INDEX IF EXISTS idx_email_queue_user_id;
DROP INDEX IF EXISTS idx_partner_assets_partner_id;
DROP INDEX IF EXISTS idx_product_commission_rules_product_id;
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;
DROP INDEX IF EXISTS idx_sms_queue_user_id;
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_merchant_accounting_lite_merchant_id;
DROP INDEX IF EXISTS idx_merchant_accounting_pro_merchant_id;
DROP INDEX IF EXISTS idx_merchant_settings_merchant_id;
DROP INDEX IF EXISTS idx_unified_customers_primary_business_unit_id;
