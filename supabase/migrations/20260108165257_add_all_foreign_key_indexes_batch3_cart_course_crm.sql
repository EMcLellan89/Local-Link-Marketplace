/*
  # Add All Foreign Key Indexes - Batch 3 (Campaign, Cart, Certificate, Course, CRM)
  
  1. Foreign Key Indexes for:
    - Campaign, Cart, Certificate, Commission, Community, Course, Credit, CRM tables
*/

-- campaign_recipients
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id 
  ON campaign_recipients(customer_id);

-- cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id 
  ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id 
  ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id 
  ON cart_items(variant_id);

-- certificates
CREATE INDEX IF NOT EXISTS idx_certificates_course_id 
  ON certificates(course_id);

-- certificates_issued
CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id 
  ON certificates_issued(user_id);

-- commissions
CREATE INDEX IF NOT EXISTS idx_commissions_order_id 
  ON commissions(order_id);

-- community_sponsorships
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id 
  ON community_sponsorships(merchant_id);

-- course_affiliate_payouts
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate_id 
  ON course_affiliate_payouts(affiliate_id);

-- course_affiliate_referrals
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate_id 
  ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_order_id 
  ON course_affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user_id 
  ON course_affiliate_referrals(referred_user_id);

-- course_exam_attempts
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_user_id 
  ON course_exam_attempts(user_id);

-- credit_ledger
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id 
  ON credit_ledger(user_id);

-- crm_activities
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id 
  ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id 
  ON crm_activities(user_id);

-- crm_leads
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to 
  ON crm_leads(assigned_to);

-- crm_migrations
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant_id 
  ON crm_migrations(merchant_id);

-- crm_tasks
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to 
  ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by 
  ON crm_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id 
  ON crm_tasks(lead_id);
