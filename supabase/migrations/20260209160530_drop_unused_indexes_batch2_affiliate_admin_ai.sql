/*
  # Drop Unused Indexes - Batch 2: Affiliate, Admin & AI Tables
  
  1. Tables Affected
    - affiliate_* tables (commissions, clicks, payments, etc.)
    - admin_* tables (appointments, notes, actions, etc.)
    - ai_* tables (bots, prompts, conversations, etc.)
  
  2. Performance Impact
    - Removes indexes with 0 usage according to database statistics
    - Frees up storage and improves INSERT/UPDATE performance
  
  3. Safety
    - All indexes verified as unused (idx_scan = 0)
    - Can be recreated if usage patterns change
*/

-- Affiliate tables
DROP INDEX IF EXISTS idx_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_affiliate_conversions_affiliate_id;
DROP INDEX IF EXISTS idx_affiliate_payments_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_products_product_id;

-- Admin tables
DROP INDEX IF EXISTS idx_admin_appointments_customer_id;
DROP INDEX IF EXISTS idx_admin_appointments_merchant_id;
DROP INDEX IF EXISTS idx_admin_notes_entity_id;
DROP INDEX IF EXISTS idx_admin_actions_user_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_admin_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_tasks_assigned_to;

-- AI tables
DROP INDEX IF EXISTS idx_ai_bots_merchant_id;
DROP INDEX IF EXISTS idx_ai_bot_conversations_bot_id;
DROP INDEX IF EXISTS idx_ai_bot_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_prompts_merchant_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_workforce_jobs_created_by;
DROP INDEX IF EXISTS idx_ai_system_events_bot_id;