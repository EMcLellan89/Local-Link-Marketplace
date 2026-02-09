/*
  # Drop Unused Indexes - Batch 24
*/

DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_review_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_video_service_orders_merchant_id;
DROP INDEX IF EXISTS idx_video_scripts_order_id;
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_deliverables_order_id;
DROP INDEX IF EXISTS idx_video_revisions_order_id;
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_referral_programs_merchant_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_program_id;
DROP INDEX IF EXISTS idx_referral_conversions_referral_link_id;
DROP INDEX IF EXISTS idx_referral_conversions_referee_customer_id;
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_created_by;
DROP INDEX IF EXISTS idx_ll_crm_payments_contact_id;
