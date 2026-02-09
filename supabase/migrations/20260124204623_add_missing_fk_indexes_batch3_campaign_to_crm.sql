/*
  # Add Missing Foreign Key Indexes - Batch 3 (Campaign to CRM)

  Adds indexes for foreign keys that are missing covering indexes.
  
  Tables covered:
  - Campaign tables
  - Cart/Certificate/Commission tables
  - Communications tables
  - Community/Course tables
  - Credit/CRM tables
*/

-- Campaign Tables
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);

-- Cart Tables
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);

-- Certificate Tables
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id ON certificates_issued(user_id);

-- Commission Tables
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);

-- Communications Tables
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_product_id ON communications_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id);

-- Community Tables
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id ON community_sponsorships(merchant_id);

-- Course Tables
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate_id ON course_affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate_id ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_order_id ON course_affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user_id ON course_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_user_id ON course_exam_attempts(user_id);

-- Credit Tables
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);

-- CRM Tables
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant_id ON crm_migrations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created_by ON crm_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by ON crm_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id);
