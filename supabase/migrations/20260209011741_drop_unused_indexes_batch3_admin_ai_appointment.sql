/*
  # Drop Unused Indexes - Batch 3: Admin, AI, and Appointment Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Admin table indexes
  - AI bot and tool indexes
  - Appointment indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- admin_sessions
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- admin_users
DROP INDEX IF EXISTS idx_admin_users_email;

-- ai_assistant_conversations
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;

-- ai_bot_products
DROP INDEX IF EXISTS idx_ai_bot_products_category;

-- ai_bot_setups
DROP INDEX IF EXISTS idx_ai_bot_setups_merchant_id;

-- ai_bot_subscriptions
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_product_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_entity_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_user_id;

-- ai_circuit_breakers
DROP INDEX IF EXISTS idx_ai_circuit_breakers_entity;
DROP INDEX IF EXISTS idx_ai_circuit_breakers_job_type;

-- ai_event_queue
DROP INDEX IF EXISTS idx_ai_event_queue_entity;
DROP INDEX IF EXISTS idx_ai_event_queue_status;

-- ai_job_locks
DROP INDEX IF EXISTS idx_ai_job_locks_entity;
DROP INDEX IF EXISTS idx_ai_job_locks_job_type;

-- ai_job_results
DROP INDEX IF EXISTS idx_ai_job_results_entity;
DROP INDEX IF EXISTS idx_ai_job_results_job_type;

-- ai_package_items
DROP INDEX IF EXISTS idx_ai_package_items_package_id;
DROP INDEX IF EXISTS idx_ai_package_items_tool_id;

-- ai_prompts_library
DROP INDEX IF EXISTS idx_ai_prompts_library_category;

-- ai_tool_calls
DROP INDEX IF EXISTS idx_ai_tool_calls_conversation_id;

-- appointment_setting_bookings
DROP INDEX IF EXISTS idx_appointment_setting_bookings_partner_id;

-- appointments
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_appointments_merchant_id;
