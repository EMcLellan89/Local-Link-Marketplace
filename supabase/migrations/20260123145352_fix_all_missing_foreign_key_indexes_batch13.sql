/*
  # Fix Missing Foreign Key Indexes - Batch 13 (Prompt, QR, Recruiting, Redemption, Referral Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - prompt tables
    - qr_codes
    - recruiting_services
    - redemptions
    - referral tables
    - reputation tables
*/

CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id ON qr_codes(created_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id ON recruiting_services(merchant_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id ON referral_conversions(referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id ON referral_links(program_id);
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id ON referral_programs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id ON referral_rewards(conversion_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id ON referrals(referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id ON reputation_alerts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id ON reputation_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id ON reputation_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by ON reputation_responses(posted_by);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id ON reputation_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id ON reputation_reviews(platform_id);
