/*
  # Drop Unused Indexes - Security Audit Batch 3
  
  Drops unused indexes from cart, certificate, coaching, commission, communications, course, CRM, and customer tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - cart_items
  - certificates
  - coaching_bookings, coaching_packages
  - commission_ledger, commission_payout_batches, commission_payouts, commission_rules
  - communications_email_campaigns, communications_prepay_balances, communications_usage
  - course_enrollments, course_modules, course_products, courses
  - crm_activities, crm_contacts, crm_deals, crm_notes, crm_pipeline_stages, crm_subscriptions, crm_tasks
  - customer_favorites, customer_preferences, customer_referral_links, customer_referral_rewards, customer_rewards_ledger
*/

-- Cart tables
DROP INDEX IF EXISTS idx_cart_items_user_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_marketplace_product_id;

-- Certificate tables
DROP INDEX IF EXISTS idx_certificates_user_id;
DROP INDEX IF EXISTS idx_certificates_course_id;

-- Coaching tables
DROP INDEX IF EXISTS idx_coaching_bookings_coach_id;
DROP INDEX IF EXISTS idx_coaching_bookings_customer_id;
DROP INDEX IF EXISTS idx_coaching_packages_coach_id;

-- Commission tables
DROP INDEX IF EXISTS idx_commission_ledger_partner_id;
DROP INDEX IF EXISTS idx_commission_ledger_merchant_id;
DROP INDEX IF EXISTS idx_commission_payout_batches_partner_id;
DROP INDEX IF EXISTS idx_commission_payouts_partner_id;
DROP INDEX IF EXISTS idx_commission_payouts_batch_id;
DROP INDEX IF EXISTS idx_commission_rules_partner_tier_id;

-- Communications tables
DROP INDEX IF EXISTS idx_communications_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_communications_prepay_balances_merchant_id;
DROP INDEX IF EXISTS idx_communications_usage_merchant_id;

-- Course tables
DROP INDEX IF EXISTS idx_course_enrollments_user_id;
DROP INDEX IF EXISTS idx_course_enrollments_course_id;
DROP INDEX IF EXISTS idx_course_modules_course_id;
DROP INDEX IF EXISTS idx_course_products_course_id;
DROP INDEX IF EXISTS idx_courses_target_audience;

-- CRM tables
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_email;
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_crm_deals_stage_id;
DROP INDEX IF EXISTS idx_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_crm_notes_deal_id;
DROP INDEX IF EXISTS idx_crm_pipeline_stages_merchant_id;
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_contact_id;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;

-- Customer tables
DROP INDEX IF EXISTS idx_customer_favorites_customer_id;
DROP INDEX IF EXISTS idx_customer_favorites_merchant_id;
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_links_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_links_merchant_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_customer_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_merchant_id;