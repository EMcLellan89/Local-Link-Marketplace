/*
  # Fix Unindexed Foreign Keys - Batch 2 (P-S)
  
  Creates indexes for all unindexed foreign keys starting with P-S
*/

-- partner_relationships
CREATE INDEX IF NOT EXISTS idx_partner_relationships_merchant_org_id 
  ON partner_relationships(merchant_org_id);

-- partner_uplines
CREATE INDEX IF NOT EXISTS idx_partner_uplines_upline_partner_id 
  ON partner_uplines(upline_partner_id);

-- printing_orders
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON printing_orders(product_id);

-- product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id 
  ON product_categories(parent_category_id);

-- product_course_map
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug 
  ON product_course_map(course_slug);

-- product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- prompt_runs
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);

-- prompts
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);

-- recruiting_services
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id ON recruiting_services(merchant_id);

-- referral_conversions
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id 
  ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id 
  ON referral_conversions(referral_link_id);

-- referral_links
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id ON referral_links(program_id);

-- referral_programs
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id ON referral_programs(merchant_id);

-- referral_rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id ON referral_rewards(conversion_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);

-- referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id ON referrals(referred_customer_id);

-- review_helpful_votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id 
  ON review_helpful_votes(customer_id);

-- review_responses
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);

-- reward_redemptions
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer_id ON reward_redemptions(customer_id);

-- scheduled_deals
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id ON scheduled_deals(template_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);

-- shopping_carts
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id ON shopping_carts(merchant_id);

-- sms_queue
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id ON sms_queue(user_id);

-- social_shares
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id ON social_shares(customer_id);

-- social_ugc_subscriptions
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id 
  ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id 
  ON social_ugc_subscriptions(package_id);

-- subscription_items
CREATE INDEX IF NOT EXISTS idx_subscription_items_plan_id ON subscription_items(plan_id);

-- subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id ON survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);

-- swipe_file_favorites
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id 
  ON swipe_file_favorites(template_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON system_settings(updated_by);
