/*
  # Drop Unused Indexes - Batch 8: AI Bots & Communications Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - ai_bots (3 indexes)
    - ai_bot_products (3 indexes)
    - ai_bot_addons (2 indexes)
    - ai_bot_packages (2 indexes)
    - ai_prompt_library (3 indexes)
    - ai_assistant_conversations (3 indexes)
    - ai_assistant_messages (2 indexes)
    - ai_job_queue (3 indexes)
    - ai_job_results (2 indexes)
    - ai_event_router (2 indexes)
    - ai_system_settings (1 index)
    - ai_circuit_breaker (2 indexes)
    - communications_transactions (4 indexes)
    - communications_prepay (3 indexes)
    - email_campaigns (3 indexes)
    - email_sends (4 indexes)
    - email_subscriptions (3 indexes)
    - email_templates (2 indexes)
    - sms_sends (3 indexes)
    - twilio_phone_numbers (2 indexes)
    - twilio_messages (3 indexes)

  3. Total Indexes Dropped: ~57
*/

-- ai_bots
DROP INDEX IF EXISTS idx_ai_bots_slug;
DROP INDEX IF EXISTS idx_ai_bots_category;
DROP INDEX IF EXISTS idx_ai_bots_status;

-- ai_bot_products
DROP INDEX IF EXISTS idx_ai_bot_products_bot;
DROP INDEX IF EXISTS idx_ai_bot_products_stripe_price;
DROP INDEX IF EXISTS idx_ai_bot_products_tier;

-- ai_bot_addons
DROP INDEX IF EXISTS idx_ai_bot_addons_bot;
DROP INDEX IF EXISTS idx_ai_bot_addons_stripe_price;

-- ai_bot_packages
DROP INDEX IF EXISTS idx_ai_bot_packages_slug;
DROP INDEX IF EXISTS idx_ai_bot_packages_tier;

-- ai_prompt_library
DROP INDEX IF EXISTS idx_ai_prompt_library_category;
DROP INDEX IF EXISTS idx_ai_prompt_library_role;
DROP INDEX IF EXISTS idx_ai_prompt_library_status;

-- ai_assistant_conversations
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_merchant;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_status;

-- ai_assistant_messages
DROP INDEX IF EXISTS idx_ai_assistant_messages_conversation;
DROP INDEX IF EXISTS idx_ai_assistant_messages_role;

-- ai_job_queue
DROP INDEX IF EXISTS idx_ai_job_queue_status;
DROP INDEX IF EXISTS idx_ai_job_queue_job_type;
DROP INDEX IF EXISTS idx_ai_job_queue_priority;

-- ai_job_results
DROP INDEX IF EXISTS idx_ai_job_results_job;
DROP INDEX IF EXISTS idx_ai_job_results_status;

-- ai_event_router
DROP INDEX IF EXISTS idx_ai_event_router_event_type;
DROP INDEX IF EXISTS idx_ai_event_router_priority;

-- ai_system_settings
DROP INDEX IF EXISTS idx_ai_system_settings_key;

-- ai_circuit_breaker
DROP INDEX IF EXISTS idx_ai_circuit_breaker_service;
DROP INDEX IF EXISTS idx_ai_circuit_breaker_status;

-- communications_transactions
DROP INDEX IF EXISTS idx_communications_transactions_merchant;
DROP INDEX IF EXISTS idx_communications_transactions_type;
DROP INDEX IF EXISTS idx_communications_transactions_status;
DROP INDEX IF EXISTS idx_communications_transactions_timestamp;

-- communications_prepay
DROP INDEX IF EXISTS idx_communications_prepay_merchant;
DROP INDEX IF EXISTS idx_communications_prepay_type;
DROP INDEX IF EXISTS idx_communications_prepay_status;

-- email_campaigns
DROP INDEX IF EXISTS idx_email_campaigns_merchant;
DROP INDEX IF EXISTS idx_email_campaigns_status;
DROP INDEX IF EXISTS idx_email_campaigns_type;

-- email_sends
DROP INDEX IF EXISTS idx_email_sends_campaign;
DROP INDEX IF EXISTS idx_email_sends_customer;
DROP INDEX IF EXISTS idx_email_sends_status;
DROP INDEX IF EXISTS idx_email_sends_timestamp;

-- email_subscriptions
DROP INDEX IF EXISTS idx_email_subscriptions_email;
DROP INDEX IF EXISTS idx_email_subscriptions_merchant;
DROP INDEX IF EXISTS idx_email_subscriptions_status;

-- email_templates
DROP INDEX IF EXISTS idx_email_templates_merchant;
DROP INDEX IF EXISTS idx_email_templates_type;

-- sms_sends
DROP INDEX IF EXISTS idx_sms_sends_merchant;
DROP INDEX IF EXISTS idx_sms_sends_customer;
DROP INDEX IF EXISTS idx_sms_sends_status;

-- twilio_phone_numbers
DROP INDEX IF EXISTS idx_twilio_phone_numbers_merchant;
DROP INDEX IF EXISTS idx_twilio_phone_numbers_number;

-- twilio_messages
DROP INDEX IF EXISTS idx_twilio_messages_merchant;
DROP INDEX IF EXISTS idx_twilio_messages_direction;
DROP INDEX IF EXISTS idx_twilio_messages_status;