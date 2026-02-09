/*
  # Drop Unused Indexes - Batch 22
*/

DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;
DROP INDEX IF EXISTS idx_prompts_category_id;
DROP INDEX IF EXISTS idx_credit_ledger_user_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;
DROP INDEX IF EXISTS idx_ugc_assets_order_id;
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;
DROP INDEX IF EXISTS idx_dfy_jobs_merchant_order_id;
DROP INDEX IF EXISTS idx_email_sends_subscriber_id;
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;
