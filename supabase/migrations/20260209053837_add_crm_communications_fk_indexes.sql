/*
  # Add Foreign Key Indexes - CRM and Communications Tables

  1. Indexes Added
    - commissions: merchant_id, partner_id
    - communications_transactions: merchant_id, call_log_id, sms_log_id
    - crm_activities: merchant_id, lead_id, user_id
    - crm_leads: merchant_id
    - crm_tasks: merchant_id, lead_id

  2. Performance Impact
    - Dramatically speeds up CRM queries by merchant
    - Improves commission calculation performance
    - Optimizes communications history lookups

  3. Security Notes
    - Critical for RLS policies filtering by merchant ownership
    - Enables efficient partner earnings queries
*/

-- Commissions table
CREATE INDEX IF NOT EXISTS idx_commissions_merchant_id ON commissions(merchant_id) WHERE merchant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON commissions(partner_id);

-- Communications table
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id) WHERE call_log_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id) WHERE sms_log_id IS NOT NULL;

-- CRM tables
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_merchant_id ON crm_leads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON crm_tasks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id) WHERE lead_id IS NOT NULL;
