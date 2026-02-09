/*
  # Drop Unused Indexes - Batch 4
*/

DROP INDEX IF EXISTS idx_crm_tasks_lead_id;
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_job_assignments_job_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;
DROP INDEX IF EXISTS idx_review_responses_merchant_id;
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_favorites_merchant_id;
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_referrals_referrer_customer_id;
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_social_shares_customer_id;
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_job_assignments_assigned_by_admin_id;
DROP INDEX IF EXISTS idx_job_deliverables_job_id;
DROP INDEX IF EXISTS idx_job_deliverables_partner_id;
DROP INDEX IF EXISTS idx_job_deliverables_reviewed_by_admin_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;
