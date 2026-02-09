/*
  # Drop Unused Indexes - Batch 2: Affiliate, Admin, and AI tables
  
  ## Tables Covered:
  - affiliate_* tables
  - admin_* tables
  - ai_* tables
*/

-- Affiliate tables
DROP INDEX IF EXISTS idx_affiliate_clicks_clicked_at;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_created_at;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_affiliate_conversions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_payout_batches_created_at;
DROP INDEX IF EXISTS idx_affiliate_payouts_created_at;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;

-- Admin tables
DROP INDEX IF EXISTS idx_admin_actions_created_at;
DROP INDEX IF EXISTS idx_admin_crm_companies_created_at;
DROP INDEX IF EXISTS idx_admin_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_admin_crm_deals_created_at;
DROP INDEX IF EXISTS idx_admin_crm_notes_created_at;
DROP INDEX IF EXISTS idx_admin_crm_tasks_created_at;

-- AI tables
DROP INDEX IF EXISTS idx_ai_assistant_conversations_created_at;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_bot_conversations_bot_id;
DROP INDEX IF EXISTS idx_ai_bot_conversations_created_at;
DROP INDEX IF EXISTS idx_ai_bot_executions_bot_id;
DROP INDEX IF EXISTS idx_ai_bot_executions_created_at;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_ai_job_queue_created_at;
DROP INDEX IF EXISTS idx_ai_job_queue_status;
DROP INDEX IF EXISTS idx_ai_prompts_category;