/*
  # Add Missing Foreign Key Indexes - Batch 2 (Admin CRM/Affiliate/AI)

  Adds indexes for foreign keys that are missing covering indexes.
  
  Tables covered:
  - Admin CRM tables
  - Affiliate tables
  - AI and appointment tables
  - Audit and badge tables
  - Batch and BI tables
  - Budget Buster tables
*/

-- Admin CRM Tables
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_contact_id ON admin_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_project_id ON admin_crm_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_team_member_id ON admin_crm_activities(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_assigned_to_team_member ON admin_crm_contacts(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_company_id ON admin_crm_list_members(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_contact_id ON admin_crm_list_members(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Affiliate Tables
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id ON affiliate_clicks(converted_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id ON affiliate_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);

-- AI and Appointment Tables
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id ON ai_package_items(bot_addon_id);
CREATE INDEX IF NOT EXISTS idx_appointment_setting_bookings_merchant_id ON appointment_setting_bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);

-- Audit and Badge Tables
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_transaction_id ON batch_transactions(transaction_id);

-- BI Tables
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant_id ON bi_competitor_tracking(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant_id ON bi_reports(merchant_id);

-- Budget Buster Tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);

-- Business API Keys
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by ON business_api_keys(created_by);

-- Business Capital
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);

-- Business Coaching
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
