/*
  # Fix Missing Foreign Key Indexes - Batch 8 (Job, Lead, Loyalty, Marketing Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - job tables
    - lead_list_orders
    - loyalty_events
    - marketing tables
    - marketplace tables
*/

CREATE INDEX IF NOT EXISTS idx_job_assignments_assigned_by_admin_id ON job_assignments(assigned_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_partner_id ON job_deliverables(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_reviewed_by_admin_id ON job_deliverables(reviewed_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_merchant_id ON job_payouts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by_admin_id ON jobs(created_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id ON lead_list_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id ON marketing_campaigns(segment_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_business_unit_id ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_created_by ON marketing_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_segment_id ON marketing_email_campaigns(segment_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id ON marketplace_affiliate_commissions(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id ON marketplace_affiliate_commissions(referral_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id ON marketplace_affiliate_payouts(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_product_assets_product_sku ON marketplace_affiliate_product_assets(product_sku);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id ON marketplace_affiliate_referrals(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id ON marketplace_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affiliate_id ON marketplace_affiliate_subscription_locks(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id ON marketplace_affiliate_subscription_locks(commission_id);
