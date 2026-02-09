/*
  # Drop All Unused Indexes - Batch 2 (Campaign through Email)
  
  1. Performance Improvement
    - Continues removing unused indexes
    - Further reduces storage and write overhead
    
  2. Indexes Dropped
    - Campaign, cart, certificate indexes
    - Commission, community, course indexes  
    - CRM, customer indexes
    - Email indexes
*/

-- Campaign & Cart indexes
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;

-- Certificate indexes
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_certificates_issued_user_id;

-- Commission indexes
DROP INDEX IF EXISTS idx_commissions_order_id;

-- Community indexes
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;

-- Course indexes
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;

-- Credit & CRM indexes
DROP INDEX IF EXISTS idx_credit_ledger_user_id;
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;

-- Customer indexes
DROP INDEX IF EXISTS idx_customer_activity_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_activity_log_customer_id;
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;
DROP INDEX IF EXISTS idx_customer_business_relationships_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_created_by;
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_customer_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_team_member_id;
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_customer_support_tickets_business_unit_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_customer_id;

-- Deal indexes
DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_locations_location_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;

-- Ecommerce indexes
DROP INDEX IF EXISTS idx_ecommerce_orders_customer_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant_id;

-- Email indexes
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_communications_business_unit_id;
DROP INDEX IF EXISTS idx_email_communications_customer_id;
DROP INDEX IF EXISTS idx_email_communications_sent_by;
DROP INDEX IF EXISTS idx_email_queue_user_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_subscriber_id;
