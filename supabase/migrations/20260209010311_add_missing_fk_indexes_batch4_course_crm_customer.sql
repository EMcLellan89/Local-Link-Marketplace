/*
  # Add Missing Foreign Key Indexes - Batch 4
  
  1. Tables Covered
    - Course tables (course_affiliate_*, course_exam_*, course_lessons, course_modules, course_pricing, course_webinar_content)
    - CRM tables (crm_activities, crm_bot_training_data, crm_companies, crm_contacts, crm_csv_exports, crm_deals, crm_leads, crm_migrations, crm_notes, crm_subscriptions, crm_tasks)
    - Customer tables (customer_activity_log, customer_asset_grants, customer_business_relationships, customer_email_segments, customer_impersonation_log, customer_memberships, customer_preferences, customer_referral_*, customer_reward_*, customer_segments, customer_support_tickets, customers)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance across related tables
    - Critical for course enrollment, CRM operations, and customer data queries
    
  3. Security
    - No security changes, only performance optimization
*/

-- Course tables
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate_id ON course_affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate_id ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_order_id ON course_affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user_id ON course_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliates_user_id ON course_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_course_id ON course_exam_attempts(course_id);
CREATE INDEX IF NOT EXISTS idx_course_exam_questions_course_id ON course_exam_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_course_webinar_content_course_id ON course_webinar_content(course_id);

-- CRM tables
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_bot_training_data_migration_request_id ON crm_bot_training_data(migration_request_id);
CREATE INDEX IF NOT EXISTS idx_crm_companies_assigned_to ON crm_companies(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned_to ON crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id ON crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_csv_exports_merchant_id ON crm_csv_exports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_assigned_to ON crm_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id ON crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_merchant_id ON crm_leads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_migration_requests_merchant_id ON crm_migration_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant_id ON crm_migrations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_company_id ON crm_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_contact_id ON crm_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created_by ON crm_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_subscriptions_merchant_id ON crm_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by ON crm_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON crm_tasks(merchant_id);

-- Customer tables
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by ON customer_activity_log(performed_by);
CREATE INDEX IF NOT EXISTS idx_customer_asset_grants_asset_id ON customer_asset_grants(asset_id);
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id ON customer_business_relationships(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_customer_id ON customer_business_relationships(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by ON customer_email_segments(created_by);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id ON customer_impersonation_log(team_member_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_customer_id ON customer_memberships(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id ON customer_memberships(tier_id);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_customer_id ON customer_referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_merchant_id ON customer_referral_links(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_programs_merchant_id ON customer_referral_programs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_merchant_id ON customer_referral_rewards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_referral_id ON customer_referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_referrer_customer_id ON customer_referral_rewards(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_merchant_id ON customer_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referee_customer_id ON customer_referrals(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_customer_id ON customer_referrals(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_reward_rules_merchant_org_id ON customer_reward_rules(merchant_org_id);
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_customer_id ON customer_rewards_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_merchant_org_id ON customer_rewards_ledger(merchant_org_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_merchant_id ON customer_segments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id ON customer_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id ON customers(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
