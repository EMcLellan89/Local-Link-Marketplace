/*
  # Drop Unused Indexes - Batch 1
  
  Removes indexes with idx_scan = 0 (never used) to reduce storage overhead
  and improve INSERT/UPDATE performance.
*/

DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_certificates_course_id;
DROP INDEX IF EXISTS idx_creative_events_creative_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_customer_referral_rewards_merchant_id;
DROP INDEX IF EXISTS idx_customer_referrals_merchant_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_customer_id;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_events_merchant_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
