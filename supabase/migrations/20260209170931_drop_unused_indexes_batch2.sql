/*
  # Drop Unused Indexes - Batch 2
*/

DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_invoice_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_deal_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_notifications_merchant_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;
DROP INDEX IF EXISTS idx_partners_user_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;
DROP INDEX IF EXISTS idx_enrollments_course_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_lesson_progress_lesson_id;
DROP INDEX IF EXISTS idx_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_course_affiliates_user_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user_id;
