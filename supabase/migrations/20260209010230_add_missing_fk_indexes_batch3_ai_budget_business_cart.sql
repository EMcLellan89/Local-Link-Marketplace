/*
  # Add Missing Foreign Key Indexes - Batch 3
  
  1. Tables Covered
    - AI tables (ai_assistant_conversations)
    - Appointment tables (appointment_setting_bookings, appointments)
    - Budget Buster tables (all budget_buster_* tables)
    - Business tables (business_ad_campaigns, business_api_keys, business_capital_applications, business_coaching_*)
    - Cart tables (cart_items)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance across related tables
    - Essential for query optimizer to choose efficient execution plans
    
  3. Security
    - No security changes, only performance optimization
*/

-- AI tables
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);

-- Appointment tables
CREATE INDEX IF NOT EXISTS idx_appointment_setting_bookings_merchant_id ON appointment_setting_bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);

-- Budget Buster tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_ai_insights_user_id ON budget_buster_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debt_settings_user_id ON budget_buster_debt_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_momentum_user_id ON budget_buster_momentum(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_savings_goals_user_id ON budget_buster_savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id ON budget_buster_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_subscription_id ON budget_buster_usage_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id ON budget_buster_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id ON budget_buster_users(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);

-- Business tables
CREATE INDEX IF NOT EXISTS idx_business_ad_campaigns_business_id ON business_ad_campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by ON business_api_keys(created_by);
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_business_deals_vendor_id ON business_deals(vendor_id);

-- Cart tables
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);
