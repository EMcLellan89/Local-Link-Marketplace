/*
  # Add All Foreign Key Indexes - Batch 2 (Affiliate, AI, Admin, Appointment)
  
  1. Foreign Key Indexes for:
    - Admin, Affiliate, AI, Appointment, Audit, Badge, Batch, BI, Business tables
*/

-- admin_sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id 
  ON admin_sessions(admin_user_id);

-- affiliate_clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id 
  ON affiliate_clicks(converted_user_id);

-- affiliate_commissions
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id 
  ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id 
  ON affiliate_commissions(referred_user_id);

-- affiliate_partners
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id 
  ON affiliate_partners(user_id);

-- affiliate_referrals
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id 
  ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id 
  ON affiliate_referrals(referred_user_id);

-- ai_assistant_conversations
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id 
  ON ai_assistant_conversations(user_id);

-- ai_package_items
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id 
  ON ai_package_items(bot_addon_id);

-- appointment_setting_bookings
CREATE INDEX IF NOT EXISTS idx_appointment_setting_bookings_merchant_id 
  ON appointment_setting_bookings(merchant_id);

-- appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id 
  ON appointments(customer_id);

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id 
  ON audit_logs(actor_user_id);

-- badge_awards
CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id 
  ON badge_awards(user_id);

-- batch_transactions
CREATE INDEX IF NOT EXISTS idx_batch_transactions_transaction_id 
  ON batch_transactions(transaction_id);

-- bi_competitor_tracking
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant_id 
  ON bi_competitor_tracking(merchant_id);

-- bi_reports
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant_id 
  ON bi_reports(merchant_id);

-- business_api_keys
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id 
  ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by 
  ON business_api_keys(created_by);

-- business_capital_applications
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id 
  ON business_capital_applications(merchant_id);
