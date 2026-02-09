/*
  # Drop Unused Indexes - Batch 3
*/

DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_referred_by_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;
DROP INDEX IF EXISTS idx_customers_referred_by_partner_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;
DROP INDEX IF EXISTS idx_purchases_paybright_transaction_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_crm_migrations_merchant_id;
DROP INDEX IF EXISTS idx_crm_leads_merchant_id;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_activities_lead_id;
DROP INDEX IF EXISTS idx_crm_activities_user_id;
