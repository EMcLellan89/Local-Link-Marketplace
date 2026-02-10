/*
  # Remove Duplicate Indexes - Final Cleanup
  
  1. Purpose
    - Remove duplicate indexes where two indexes have identical definitions
    - Keep the index with the clearer, more consistent naming pattern
    - Reduces storage overhead and write operation costs
    
  2. Tables Affected (32 tables)
    - bot_tool_permissions (2 pairs)
    - course_exam_questions
    - dfy_ad_vault
    - marketplace_affiliate_* (6 tables)
    - partner_crm_* (5 tables)
    - partner_bank_accounts
    - paybright_transactions
    - profit_network_enrollments
    - purchases, reviews, review_responses
    - support_tickets, support_messages
    - surveys, survey_responses (2 pairs)
    - swipe_file_access
    - ugc_orders
    - vapi_assistants, vapi_call_logs
    - white_label_licenses
    - winback_campaigns
    
  3. Strategy
    - Keep: Indexes with consistent naming pattern (idx_table_column)
    - Drop: Indexes with _fk suffix or inconsistent names
*/

-- bot_tool_permissions
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot;
DROP INDEX IF EXISTS idx_bot_tool_permissions_tool;

-- course_exam_questions
DROP INDEX IF EXISTS idx_exam_questions_course;

-- dfy_ad_vault
DROP INDEX IF EXISTS idx_ad_vault_product;

-- marketplace_affiliate_badges
DROP INDEX IF EXISTS idx_marketplace_affiliate_badges_affiliate_id;

-- marketplace_affiliate_commissions
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;

-- marketplace_affiliate_payouts
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_affiliate_id;

-- marketplace_affiliate_referrals
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_affiliate_id;

-- marketplace_affiliate_subscription_locks
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_affiliate_id;

-- marketplace_affiliate_training_progress
DROP INDEX IF EXISTS idx_marketplace_affiliate_training_progress_affiliate_id;

-- partner_bank_accounts
DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id_fk;

-- partner_crm_companies
DROP INDEX IF EXISTS idx_partner_crm_companies_partner_id_fk;

-- partner_crm_contacts
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id_fk;

-- partner_crm_deal_notes
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_deal_id_fk;

-- partner_crm_deal_products
DROP INDEX IF EXISTS idx_partner_crm_deal_products_deal_id_fk;

-- partner_crm_deals
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id_fk;

-- paybright_transactions
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id_fk;

-- profit_network_enrollments
DROP INDEX IF EXISTS idx_profit_network_enrollments_business_id_fk;

-- purchases
DROP INDEX IF EXISTS idx_purchases_customer_id_fk;

-- review_responses
DROP INDEX IF EXISTS idx_review_responses_review_id_fk;

-- reviews
DROP INDEX IF EXISTS idx_reviews_merchant_id_fk;

-- support_messages
DROP INDEX IF EXISTS idx_support_messages_ticket_id_fk;

-- support_tickets
DROP INDEX IF EXISTS idx_support_tickets_merchant_id_fk;

-- survey_responses (2 pairs)
DROP INDEX IF EXISTS idx_survey_responses_customer_id_fk;
DROP INDEX IF EXISTS idx_survey_responses_survey_id_fk;

-- surveys
DROP INDEX IF EXISTS idx_surveys_merchant_id_fk;

-- swipe_file_access
DROP INDEX IF EXISTS idx_swipe_file_access_merchant;

-- ugc_orders
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id_fk;

-- vapi_assistants
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id_fk;

-- vapi_call_logs
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id_fk;

-- white_label_licenses
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id_fk;

-- winback_campaigns
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id_fk;
