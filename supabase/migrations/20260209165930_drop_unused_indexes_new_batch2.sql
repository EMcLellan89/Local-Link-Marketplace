/*
  # Drop Unused Indexes - New Batch 2
  
  1. Indexes to Drop (Affiliate, Admin, AI)
    - Affiliate tables: clicks, commissions, payouts
    - Admin tables: appointments, users
    - AI tables: bots, conversations, prompts
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Affiliate indexes
DROP INDEX IF EXISTS idx_affiliate_clicks_clicked_at;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id_created_at;
DROP INDEX IF EXISTS idx_affiliate_commissions_created_at;
DROP INDEX IF EXISTS idx_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id_created_at;
DROP INDEX IF EXISTS idx_affiliate_payouts_status;

-- Admin indexes
DROP INDEX IF EXISTS idx_admin_appointments_admin_id;
DROP INDEX IF EXISTS idx_admin_appointments_merchant_id;
DROP INDEX IF EXISTS idx_admin_appointments_scheduled_at;
DROP INDEX IF EXISTS idx_admin_users_email;
DROP INDEX IF EXISTS idx_admin_users_role;

-- AI indexes
DROP INDEX IF EXISTS idx_ai_bots_merchant_id;
DROP INDEX IF EXISTS idx_ai_bots_status;
DROP INDEX IF EXISTS idx_ai_bots_type;
DROP INDEX IF EXISTS idx_ai_conversations_bot_id;
DROP INDEX IF EXISTS idx_ai_conversations_customer_id;
DROP INDEX IF EXISTS idx_ai_conversations_started_at;
DROP INDEX IF EXISTS idx_ai_prompts_category;
DROP INDEX IF EXISTS idx_ai_prompts_type;