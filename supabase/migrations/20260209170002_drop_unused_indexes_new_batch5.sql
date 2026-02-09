/*
  # Drop Unused Indexes - New Batch 5
  
  1. Indexes to Drop (Events, Financial, Gift Cards, Internal CRM)
    - Event tracking indexes
    - Financial engine indexes
    - Gift card system
    - Internal CRM
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Event indexes
DROP INDEX IF EXISTS idx_events_event_date;
DROP INDEX IF EXISTS idx_events_status;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;

-- Financial indexes
DROP INDEX IF EXISTS idx_financial_accounts_merchant_id;
DROP INDEX IF EXISTS idx_financial_accounts_type;
DROP INDEX IF EXISTS idx_financial_bank_transactions_account_id;
DROP INDEX IF EXISTS idx_financial_bank_transactions_date;
DROP INDEX IF EXISTS idx_financial_plans_merchant_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_status;

-- Gift Card indexes
DROP INDEX IF EXISTS idx_gift_cards_code;
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;
DROP INDEX IF EXISTS idx_gift_cards_status;
DROP INDEX IF EXISTS idx_gift_card_transactions_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_created_at;

-- Internal CRM indexes
DROP INDEX IF EXISTS idx_internal_crm_companies_assigned_to;
DROP INDEX IF EXISTS idx_internal_crm_companies_status;
DROP INDEX IF EXISTS idx_internal_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_internal_crm_contacts_email;
DROP INDEX IF EXISTS idx_internal_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_internal_crm_tasks_status;