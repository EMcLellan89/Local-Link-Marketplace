/*
  # Drop Unused Indexes - Batch 3
  
  1. Performance
    - Remove more unused indexes
  
  2. Indexes Removed
    - Budget buster, jobs, communications, coaching, marketplace indexes
*/

DROP INDEX IF EXISTS idx_bb_bills_user;
DROP INDEX IF EXISTS idx_jobs_merchant_id;
DROP INDEX IF EXISTS idx_jobs_created_at;
DROP INDEX IF EXISTS idx_job_assignments_job_id;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_partner_id;
DROP INDEX IF EXISTS idx_job_deliverables_job_id;
DROP INDEX IF EXISTS idx_job_payouts_job_id;
DROP INDEX IF EXISTS idx_job_payouts_sourcing_partner_id;
DROP INDEX IF EXISTS idx_job_payouts_worker_partner_id;
DROP INDEX IF EXISTS idx_bb_bills_due;
DROP INDEX IF EXISTS idx_bb_bills_status;
DROP INDEX IF EXISTS idx_bb_bills_subscription;
DROP INDEX IF EXISTS idx_communications_subscriptions_entity;
DROP INDEX IF EXISTS idx_communications_subscriptions_status;
DROP INDEX IF EXISTS idx_communications_subscriptions_stripe;
DROP INDEX IF EXISTS idx_communications_usage_subscription;
DROP INDEX IF EXISTS idx_communications_usage_date;
DROP INDEX IF EXISTS idx_communications_usage_type;
DROP INDEX IF EXISTS idx_bb_debts_user;
DROP INDEX IF EXISTS idx_bb_debts_priority;
DROP INDEX IF EXISTS idx_bb_debts_active;
DROP INDEX IF EXISTS idx_bb_savings_user;
DROP INDEX IF EXISTS idx_bb_savings_active;
DROP INDEX IF EXISTS idx_bb_savings_order;
DROP INDEX IF EXISTS idx_bb_ai_user;
DROP INDEX IF EXISTS idx_bb_ai_type;
DROP INDEX IF EXISTS idx_bb_ai_read;
DROP INDEX IF EXISTS idx_bb_ai_created;
DROP INDEX IF EXISTS idx_bb_webhook_status;
DROP INDEX IF EXISTS idx_bb_webhook_created;
DROP INDEX IF EXISTS idx_tax_obligations_destination;
DROP INDEX IF EXISTS idx_tax_obligations_type;
DROP INDEX IF EXISTS idx_tax_obligations_jurisdiction;
DROP INDEX IF EXISTS idx_merchant_team_members_merchant_id;
DROP INDEX IF EXISTS idx_merchant_team_members_user_id;
DROP INDEX IF EXISTS idx_partner_team_members_partner_id;
DROP INDEX IF EXISTS idx_partner_team_members_user_id;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_created_at;
DROP INDEX IF EXISTS idx_coaching_bookings_entity;
DROP INDEX IF EXISTS idx_coaching_bookings_status;
DROP INDEX IF EXISTS idx_coaching_sessions_booking;
DROP INDEX IF EXISTS idx_coaching_sessions_scheduled;
DROP INDEX IF EXISTS idx_team_member_goals_member_id;
DROP INDEX IF EXISTS idx_team_member_goals_type;
DROP INDEX IF EXISTS idx_marketplace_products_category;
DROP INDEX IF EXISTS idx_marketplace_products_metadata;
DROP INDEX IF EXISTS idx_team_member_commissions_member_id;
DROP INDEX IF EXISTS idx_team_member_commissions_owner_id;
DROP INDEX IF EXISTS idx_team_member_commissions_status;
