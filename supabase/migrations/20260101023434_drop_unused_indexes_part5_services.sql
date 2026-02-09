/*
  # Drop Unused Indexes - Part 5: Service Tables
  
  1. Removes unused indexes from service-related tables
  2. Tables affected:
     - printing_products, printing_orders, gift_cards, gift_card_transactions
     - surveys, survey_responses, scheduled_deals, website_orders, website_templates
     - service_bookings, ai_bot_setups, lead_list_orders
*/

-- Drop unused indexes on printing_products
DROP INDEX IF EXISTS idx_printing_products_active;

-- Drop unused indexes on printing_orders
DROP INDEX IF EXISTS idx_printing_orders_status;
DROP INDEX IF EXISTS idx_printing_orders_product_id;

-- Drop unused indexes on gift_cards
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;
DROP INDEX IF EXISTS idx_gift_cards_code;
DROP INDEX IF EXISTS idx_gift_cards_status;

-- Drop unused indexes on gift_card_transactions
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;

-- Drop unused indexes on surveys
DROP INDEX IF EXISTS idx_surveys_status;

-- Drop unused indexes on survey_responses
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_survey_responses_customer_id;

-- Drop unused indexes on scheduled_deals
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;
DROP INDEX IF EXISTS idx_scheduled_deals_status;
DROP INDEX IF EXISTS idx_scheduled_deals_auto_publish_at;

-- Drop unused indexes on website_orders
DROP INDEX IF EXISTS idx_website_orders_template_id;
DROP INDEX IF EXISTS idx_website_orders_merchant;
DROP INDEX IF EXISTS idx_website_orders_status;

-- Drop unused indexes on website_templates
DROP INDEX IF EXISTS idx_website_templates_active;

-- Drop unused indexes on service_bookings
DROP INDEX IF EXISTS idx_service_bookings_service_id;
DROP INDEX IF EXISTS idx_service_bookings_customer;
DROP INDEX IF EXISTS idx_service_bookings_status;

-- Drop unused indexes on ai_bot_setups
DROP INDEX IF EXISTS idx_ai_bot_setups_merchant;
DROP INDEX IF EXISTS idx_ai_bot_setups_status;

-- Drop unused indexes on lead_list_orders
DROP INDEX IF EXISTS idx_lead_list_orders_merchant;
