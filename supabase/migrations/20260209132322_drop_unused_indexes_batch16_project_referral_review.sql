/*
  # Drop Unused Indexes - Batch 16: Project, Referral, and Review Tables

  1. Changes
    - Drop unused indexes from project, prompt, and provider tables
    - Drop unused indexes from referral_* tables
    - Drop unused indexes from reputation and review tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces storage and maintenance overhead
*/

-- Project and prompt tables
DROP INDEX IF EXISTS idx_project_assignments_project_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_prompts_category_id;

-- Provider and purchase tables
DROP INDEX IF EXISTS idx_provider_assignments_merchant_id;
DROP INDEX IF EXISTS idx_provider_assignments_provider_id;
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;
DROP INDEX IF EXISTS idx_purchases_paybright_transaction_id;

-- QR codes and receipts
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;
DROP INDEX IF EXISTS idx_receipts_linked_transaction_id;
DROP INDEX IF EXISTS idx_receipts_merchant_id;

-- Recruiting and recurring
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;
DROP INDEX IF EXISTS idx_recurring_commission_next_payment;
DROP INDEX IF EXISTS idx_recurring_commission_partner;
DROP INDEX IF EXISTS idx_recurring_commission_schedule_order_id;
DROP INDEX IF EXISTS idx_recurring_commission_schedule_product_id;

-- Redemptions and referral attribution
DROP INDEX IF EXISTS idx_redemptions_purchase_id;
DROP INDEX IF EXISTS idx_referral_attribution_attributed_partner_id;

-- Referral conversions and links
DROP INDEX IF EXISTS idx_referral_conversions_referee_customer_id;
DROP INDEX IF EXISTS idx_referral_conversions_referral_link_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_program_id;

-- Referral programs and rewards
DROP INDEX IF EXISTS idx_referral_programs_merchant_id;
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referral_short_links_merchant_id;

-- Referrals and reputation
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_referrals_referrer_customer_id;
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;
DROP INDEX IF EXISTS idx_reputation_responses_review_id;
DROP INDEX IF EXISTS idx_reputation_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_platform_id;

-- Review tables
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_review_helpful_votes_review_id;
DROP INDEX IF EXISTS idx_review_responses_merchant_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;

-- Reward redemptions and rules
DROP INDEX IF EXISTS idx_reward_redemptions_customer_id;
DROP INDEX IF EXISTS idx_reward_redemptions_merchant_org_id;
DROP INDEX IF EXISTS idx_rule_suggestions_suggested_coa_id;
