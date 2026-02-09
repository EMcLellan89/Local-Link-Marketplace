/*
  # Add Missing Foreign Key Indexes - Batch 5: CRM, Communications, Subscriptions
  
  1. Purpose
    - Add covering indexes for unindexed foreign key constraints
    - Focuses on LocalLink CRM, communications, subscriptions, and team tables
  
  2. Tables Affected
    - communications_transactions: call_log_id, merchant_id, sms_log_id
    - ll_crm_contacts: merchant_id
    - ll_crm_deals: contact_id, merchant_id, pipeline_id
    - org_members: org_id, profile_id
    - team_members: manager_id, user_id
    - user_subscriptions: stripe_customer_id, stripe_subscription_id, user_id
  
  3. Security
    - Indexes improve performance of FK constraint checks
    - No RLS changes required
*/

-- Communications Transactions
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id 
  ON public.communications_transactions(call_log_id);

CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id 
  ON public.communications_transactions(merchant_id);

CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id 
  ON public.communications_transactions(sms_log_id);

-- LocalLink CRM
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id 
  ON public.ll_crm_contacts(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id 
  ON public.ll_crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_merchant_id 
  ON public.ll_crm_deals(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_pipeline_id 
  ON public.ll_crm_deals(pipeline_id);

-- Organization Members
CREATE INDEX IF NOT EXISTS idx_org_members_org_id 
  ON public.org_members(org_id);

CREATE INDEX IF NOT EXISTS idx_org_members_profile_id 
  ON public.org_members(profile_id);

-- Team Members
CREATE INDEX IF NOT EXISTS idx_team_members_manager_id 
  ON public.team_members(manager_id);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id 
  ON public.team_members(user_id);

-- User Subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id 
  ON public.user_subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id 
  ON public.user_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
  ON public.user_subscriptions(user_id);