/*
  # Add Missing Foreign Key Indexes - Part 3A: Campaign-Deals Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign keys in campaign through deals tables
    - Improves query performance for joins and foreign key lookups
    
  2. Tables Affected
    - campaign_recipients
    - cart_items
    - certificates
    - certificates_issued
    - commissions
    - community_sponsorships
    - course_affiliate_payouts
    - course_affiliate_referrals
    - course_exam_attempts
    - credit_ledger
    - crm_activities
    - crm_leads
    - crm_migrations
    - crm_tasks
    - customer_activity_log
    - customer_business_relationships
    - customer_email_segments
    - customer_impersonation_log
    - customer_memberships
    - customer_support_tickets
    - deal_clicks
    - deal_impressions
    - deal_locations
    - deals
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

-- customer_activity_log
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id 
  ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id 
  ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by 
  ON customer_activity_log(performed_by);

-- customer_business_relationships
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id 
  ON customer_business_relationships(business_unit_id);

-- customer_email_segments
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id 
  ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by 
  ON customer_email_segments(created_by);

-- customer_impersonation_log
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id 
  ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id 
  ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id 
  ON customer_impersonation_log(team_member_id);

-- customer_memberships
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id 
  ON customer_memberships(tier_id);

-- customer_support_tickets
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to 
  ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id 
  ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id 
  ON customer_support_tickets(customer_id);

-- deal_clicks
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id 
  ON deal_clicks(user_id);

-- deal_impressions
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id 
  ON deal_impressions(user_id);

-- deal_locations
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id 
  ON deal_locations(location_id);

-- deals
CREATE INDEX IF NOT EXISTS idx_deals_partner_id 
  ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id 
  ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id 
  ON deals(territory_id);
