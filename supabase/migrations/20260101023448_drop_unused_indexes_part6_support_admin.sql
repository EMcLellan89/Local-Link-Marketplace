/*
  # Drop Unused Indexes - Part 6: Support & Admin Tables
  
  1. Removes unused indexes from support and administrative tables
  2. Tables affected:
     - support_tickets, support_messages, notifications, notification_preferences
     - notification_queue, appointments, admin_sessions, merchant_orders
     - loyalty_contract_uploads, merchant_settings, merchant_locations
*/

-- Drop unused indexes on support_tickets
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_ticket_number;

-- Drop unused indexes on support_messages
DROP INDEX IF EXISTS idx_support_messages_ticket_id;

-- Drop unused indexes on notifications
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_notifications_is_read;
DROP INDEX IF EXISTS idx_notifications_type;

-- Drop unused indexes on notification_preferences
DROP INDEX IF EXISTS idx_notification_preferences_customer_id;

-- Drop unused indexes on notification_queue
DROP INDEX IF EXISTS idx_notification_queue_status;
DROP INDEX IF EXISTS idx_notification_queue_scheduled;
DROP INDEX IF EXISTS idx_notification_queue_recipient;

-- Drop unused indexes on appointments
DROP INDEX IF EXISTS idx_appointments_date;
DROP INDEX IF EXISTS idx_appointments_customer;
DROP INDEX IF EXISTS idx_appointments_status;

-- Drop unused indexes on admin_sessions
DROP INDEX IF EXISTS idx_admin_sessions_token;
DROP INDEX IF EXISTS idx_admin_sessions_expires;
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- Drop unused indexes on merchant_orders
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_merchant_orders_created_at;

-- Drop unused indexes on loyalty_contract_uploads
DROP INDEX IF EXISTS idx_loyalty_contract_uploads_status;

-- Drop unused indexes on merchant_settings
DROP INDEX IF EXISTS idx_merchant_settings_merchant_id;

-- Drop unused indexes on merchant_locations
DROP INDEX IF EXISTS idx_merchant_locations_city;

-- Drop unused indexes on merchant_subscriptions
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;

-- Drop unused indexes on appointment_setting_bookings
DROP INDEX IF EXISTS idx_appointment_setting_merchant;

-- Drop unused indexes on merchant_services_applications
DROP INDEX IF EXISTS idx_merchant_services_merchant;

-- Drop unused indexes on business_capital_applications
DROP INDEX IF EXISTS idx_business_capital_merchant;

-- Drop unused indexes on recruiting_services
DROP INDEX IF EXISTS idx_recruiting_services_merchant;

-- Drop unused indexes on dashboard_metrics
DROP INDEX IF EXISTS idx_dashboard_metrics_merchant_date;
