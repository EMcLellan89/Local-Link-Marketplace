/*
  # Drop Unused Indexes - Batch 12
*/

DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_product_sku;
DROP INDEX IF EXISTS idx_marketplace_affiliate_training_progress_marketplace_affilia;
DROP INDEX IF EXISTS idx_commission_ledger_batch_id;
DROP INDEX IF EXISTS idx_commission_ledger_order_id;
DROP INDEX IF EXISTS idx_commission_ledger_payout_batch_id;
DROP INDEX IF EXISTS idx_partner_challenge_enrollments_partner_id;
DROP INDEX IF EXISTS idx_partner_challenge_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_activity_log_partner_id;
DROP INDEX IF EXISTS idx_partner_streak_freezes_partner_id;
DROP INDEX IF EXISTS idx_partner_notifications_partner_id;
DROP INDEX IF EXISTS idx_customer_referral_links_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_links_merchant_id;
DROP INDEX IF EXISTS idx_customer_referrals_referee_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_referrer_customer_id;
DROP INDEX IF EXISTS idx_partner_accounting_pro_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_user_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_lesson_id;
DROP INDEX IF EXISTS idx_profit_network_ad_costs_enrollment_id;
DROP INDEX IF EXISTS idx_profit_network_sales_enrollment_id;
