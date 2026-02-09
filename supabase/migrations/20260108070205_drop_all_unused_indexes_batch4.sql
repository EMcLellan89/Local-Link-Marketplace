/*
  # Drop All Unused Indexes - Batch 4 (Notification through Referral)
  
  1. Performance Improvement
    - Continues removing unused indexes
    
  2. Indexes Dropped
    - Notification, order indexes
    - Partner indexes
    - PayBright indexes
    - Printing, product indexes
    - Referral indexes
*/

-- Notification indexes
DROP INDEX IF EXISTS idx_notifications_customer_id;

-- Order indexes
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_orders_user_id;

-- Partner indexes
DROP INDEX IF EXISTS idx_partner_agreement_acceptances_user_id;
DROP INDEX IF EXISTS idx_partner_agreements_partner_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;
DROP INDEX IF EXISTS idx_partner_assets_partner_id;
DROP INDEX IF EXISTS idx_partner_bonuses_affiliate_id;
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_partners_user_id;

-- PayBright indexes
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;

-- Payout indexes
DROP INDEX IF EXISTS idx_payout_batches_partner_id;

-- Printing indexes
DROP INDEX IF EXISTS idx_printing_orders_product_id;

-- Product indexes
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;
DROP INDEX IF EXISTS idx_product_course_map_course_slug;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_products_category_id;

-- Profile & Prompt indexes
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_prompts_category_id;

-- QR code indexes
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;

-- Recruiting indexes
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;

-- Redemption indexes
DROP INDEX IF EXISTS idx_redemptions_purchase_id;

-- Referral indexes
DROP INDEX IF EXISTS idx_referral_conversions_referee_customer_id;
DROP INDEX IF EXISTS idx_referral_conversions_referral_link_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_program_id;
DROP INDEX IF EXISTS idx_referral_programs_merchant_id;
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
