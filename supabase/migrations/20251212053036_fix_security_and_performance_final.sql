/*
  # Fix Critical Security and Performance Issues
  
  1. Performance Improvements
    - Add missing indexes for all unindexed foreign keys (19 indexes)
    - Improves query performance for joins and foreign key lookups
  
  2. Function Security
    - Set immutable search_path for all functions
    - Prevents search_path hijacking attacks
*/

-- ============================================================================
-- PART 1: ADD MISSING INDEXES FOR FOREIGN KEYS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON public.crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by ON public.crm_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON public.crm_tasks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON public.deal_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON public.deal_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON public.gift_card_transactions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON public.gift_cards(purchased_by_customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id ON public.marketing_campaigns(segment_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id ON public.merchant_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id ON public.merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_postcard_placements_deal_id ON public.postcard_placements(deal_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON public.printing_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id ON public.review_helpful_votes(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_merchant_id ON public.review_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON public.reviews(purchase_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_deal_id ON public.scheduled_deals(deal_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id ON public.scheduled_deals(template_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id ON public.survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id ON public.website_orders(template_id);

-- ============================================================================
-- PART 2: FIX FUNCTION SEARCH_PATH VULNERABILITIES  
-- ============================================================================

-- Functions with parameters need their signatures specified
ALTER FUNCTION public.activate_crm_trial_for_merchant(p_merchant_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.calculate_deal_performance(p_deal_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_user_profile(user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_deal_view(p_deal_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.track_deal_click(p_deal_id uuid, p_click_type text, p_user_id uuid, p_session_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.track_deal_impression(p_deal_id uuid, p_user_id uuid, p_session_id text, p_referrer_url text, p_user_agent text, p_ip_address inet) SET search_path = public, pg_temp;

-- Functions without parameters
ALTER FUNCTION public.auto_create_lead_from_purchase() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_referral_completion() SET search_path = public, pg_temp;
ALTER FUNCTION public.create_default_customer_preferences() SET search_path = public, pg_temp;
ALTER FUNCTION public.create_default_notification_preferences() SET search_path = public, pg_temp;
ALTER FUNCTION public.ensure_single_primary_location() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_gift_card_code() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_referral_code() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_ticket_number() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.trigger_recalculate_deal_performance() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_campaign_stats() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_crm_leads_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_crm_subscriptions_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_customer_loyalty_points() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_deal_analytics_on_purchase() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_deal_performance_stats_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_merchant_rating() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_review_helpful_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_survey_response_count() SET search_path = public, pg_temp;
