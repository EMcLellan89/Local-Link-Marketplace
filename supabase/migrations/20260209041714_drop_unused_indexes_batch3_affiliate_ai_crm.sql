/*
  # Drop Unused Indexes - Batch 3: Affiliate, AI, and CRM Tables

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Affiliate tables (commissions, payouts, referrals)
    - AI tables (assistant conversations, bot subscriptions, prompt library)
    - CRM tables (activities, contacts, deals, leads, tasks)

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- Affiliate table indexes
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_affiliate_commissions_created_at;
DROP INDEX IF EXISTS idx_affiliate_payouts_status;
DROP INDEX IF EXISTS idx_affiliate_payouts_created_at;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_status;
DROP INDEX IF EXISTS idx_affiliate_referrals_created_at;

-- AI table indexes
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_created_at;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_type;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_status;
DROP INDEX IF EXISTS idx_ai_prompt_library_category;
DROP INDEX IF EXISTS idx_ai_prompt_library_is_active;

-- CRM table indexes
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_activities_created_at;
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_email;
DROP INDEX IF EXISTS idx_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_crm_deals_status;
DROP INDEX IF EXISTS idx_crm_deals_created_at;
DROP INDEX IF EXISTS idx_crm_leads_merchant_id;
DROP INDEX IF EXISTS idx_crm_leads_status;
DROP INDEX IF EXISTS idx_crm_leads_source;
DROP INDEX IF EXISTS idx_crm_leads_created_at;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;
DROP INDEX IF EXISTS idx_crm_tasks_status;