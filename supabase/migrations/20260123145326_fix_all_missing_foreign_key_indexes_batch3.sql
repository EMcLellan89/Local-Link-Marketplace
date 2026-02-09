/*
  # Fix Missing Foreign Key Indexes - Batch 3 (AI, Appointments, Audit, Business)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - ai_assistant_conversations
    - ai_package_items
    - appointment_setting_bookings
    - appointments
    - audit_logs
    - badge_awards
    - batch_transactions
    - bi_competitor_tracking
    - bi_reports
    - budget_buster tables
    - business tables
    - campaign_recipients
*/

CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id ON ai_package_items(bot_addon_id);
CREATE INDEX IF NOT EXISTS idx_appointment_setting_bookings_merchant_id ON appointment_setting_bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_transaction_id ON batch_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant_id ON bi_competitor_tracking(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant_id ON bi_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by ON business_api_keys(created_by);
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);
