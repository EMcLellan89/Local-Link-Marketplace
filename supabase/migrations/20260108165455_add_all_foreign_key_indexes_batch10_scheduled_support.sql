/*
  # Add All Foreign Key Indexes - Batch 10 (Scheduled, Service, Shopping, SMS, Social, Stripe, Support, Survey, Swipe, System)
  
  1. Foreign Key Indexes for:
    - Scheduled, Service, Shopping, SMS, Social, Stripe, Support, Survey, Swipe, System tables
*/

-- scheduled_deals
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id 
  ON scheduled_deals(template_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id 
  ON service_bookings(service_id);

-- shopping_carts
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id 
  ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id 
  ON shopping_carts(merchant_id);

-- sms_queue
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id 
  ON sms_queue(user_id);

-- social_shares
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id 
  ON social_shares(customer_id);

-- social_ugc_subscriptions
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id 
  ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id 
  ON social_ugc_subscriptions(package_id);

-- stripe_subscription_map
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id 
  ON stripe_subscription_map(user_id);

-- support_messages
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id 
  ON support_messages(ticket_id);

-- support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id 
  ON support_tickets(customer_id);

-- survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id 
  ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id 
  ON survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id 
  ON survey_responses(survey_id);

-- swipe_file_favorites
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id 
  ON swipe_file_favorites(template_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
  ON system_settings(updated_by);
