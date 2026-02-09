/*
  # Drop Unused Indexes - Batch 9: Internal CRM & Final Marketplace Indexes
  
  1. Performance Optimization
    - Remove final batch of unused indexes
    - Completes the unused index cleanup
  
  2. Affected Tables
    - customer_accounts, partner_customer_links, commissions
    - commission_rules, partner_crm_subscriptions, payment_events
    - partner_referrals, product_categories, certificates_issued
    - partner_agreement_acceptances, badge_awards, partner_bonuses
    - product_entitlements, user_entitlements, email_queue
    - in_app_nudges, partner_assets, internal_team_members
    - unified_customers, customer_business_relationships
    - unified_sales, internal_invoices, internal_accounting_ledger
    - customer_support_tickets, ticket_messages, customer_activity_log
    - customer_impersonation_log, email_communications
    - external_business_webhooks, marketplace_affiliates
    - marketplace_affiliate_products, marketplace_affiliate_referrals
    - marketplace_affiliate_commissions, marketplace_affiliate_payouts
    - marketplace_affiliate_badges, marketplace_affiliate_training_progress
    - marketplace_affiliate_product_assets
*/

-- customer_accounts
DROP INDEX IF EXISTS idx_customer_accounts_stripe_customer_id;
DROP INDEX IF EXISTS idx_customer_accounts_email;

-- partner_customer_links
DROP INDEX IF EXISTS idx_partner_customer_links_partner_id;
DROP INDEX IF EXISTS idx_partner_customer_links_customer_account_id;

-- commissions
DROP INDEX IF EXISTS idx_commissions_partner_id;
DROP INDEX IF EXISTS idx_commissions_order_id;
DROP INDEX IF EXISTS idx_commissions_status;

-- commission_rules
DROP INDEX IF EXISTS idx_commission_rules_admin;

-- partner_crm_subscriptions
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_stripe_subscription_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_status;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_payment_provider;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_tier;

-- payment_events
DROP INDEX IF EXISTS idx_payment_events_provider;
DROP INDEX IF EXISTS idx_payment_events_event_id;
DROP INDEX IF EXISTS idx_payment_events_processed;

-- partner_referrals
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;

-- product_categories
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;

-- certificates_issued
DROP INDEX IF EXISTS cert_user_idx;
DROP INDEX IF EXISTS cert_course_idx;
DROP INDEX IF EXISTS cert_code_idx;

-- partner_agreement_acceptances
DROP INDEX IF EXISTS partner_agreement_user_idx;

-- badge_awards
DROP INDEX IF EXISTS badge_user_idx;
DROP INDEX IF EXISTS badge_slug_idx;

-- partner_bonuses
DROP INDEX IF EXISTS bonus_affiliate_idx;
DROP INDEX IF EXISTS bonus_quarter_idx;
DROP INDEX IF EXISTS bonus_status_idx;

-- product_entitlements
DROP INDEX IF EXISTS idx_product_entitlements_slug;

-- user_entitlements
DROP INDEX IF EXISTS idx_user_entitlements_user;

-- email_queue
DROP INDEX IF EXISTS idx_email_queue_send_after;
DROP INDEX IF EXISTS idx_email_queue_user_status;

-- in_app_nudges
DROP INDEX IF EXISTS idx_nudges_user_active;

-- partner_assets
DROP INDEX IF EXISTS idx_partner_assets_partner;
DROP INDEX IF EXISTS idx_partner_assets_product;

-- swipe_templates
DROP INDEX IF EXISTS idx_swipe_templates_product;

-- internal_team_members
DROP INDEX IF EXISTS idx_internal_team_email;

-- unified_customers
DROP INDEX IF EXISTS idx_unified_customers_email;
DROP INDEX IF EXISTS idx_unified_customers_status;
DROP INDEX IF EXISTS idx_unified_customers_primary_business;
DROP INDEX IF EXISTS idx_unified_customers_stripe;

-- customer_business_relationships
DROP INDEX IF EXISTS idx_customer_relationships_customer;
DROP INDEX IF EXISTS idx_customer_relationships_business;

-- unified_sales
DROP INDEX IF EXISTS idx_unified_sales_customer;
DROP INDEX IF EXISTS idx_unified_sales_business;
DROP INDEX IF EXISTS idx_unified_sales_date;
DROP INDEX IF EXISTS idx_unified_sales_status;

-- internal_invoices
DROP INDEX IF EXISTS idx_invoices_customer;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_business;

-- internal_accounting_ledger
DROP INDEX IF EXISTS idx_ledger_date;
DROP INDEX IF EXISTS idx_ledger_business;
DROP INDEX IF EXISTS idx_ledger_tax_year;
DROP INDEX IF EXISTS idx_ledger_reconciled;

-- customer_support_tickets
DROP INDEX IF EXISTS idx_tickets_customer;
DROP INDEX IF EXISTS idx_tickets_status;
DROP INDEX IF EXISTS idx_tickets_assigned;
DROP INDEX IF EXISTS idx_tickets_business;

-- ticket_messages
DROP INDEX IF EXISTS idx_ticket_messages_ticket;

-- customer_activity_log
DROP INDEX IF EXISTS idx_activity_log_customer;
DROP INDEX IF EXISTS idx_activity_log_created;
DROP INDEX IF EXISTS idx_activity_log_business;

-- customer_impersonation_log
DROP INDEX IF EXISTS idx_impersonation_team;
DROP INDEX IF EXISTS idx_impersonation_customer;

-- email_communications
DROP INDEX IF EXISTS idx_emails_customer;
DROP INDEX IF EXISTS idx_emails_status;

-- external_business_webhooks
DROP INDEX IF EXISTS idx_webhooks_processed;
DROP INDEX IF EXISTS idx_webhooks_business;

-- marketplace_affiliates
DROP INDEX IF EXISTS idx_mkt_aff_user_id;
DROP INDEX IF EXISTS idx_mkt_aff_code;
DROP INDEX IF EXISTS idx_mkt_aff_status;
DROP INDEX IF EXISTS marketplace_affiliates_points_idx;

-- marketplace_affiliate_products
DROP INDEX IF EXISTS idx_mkt_prod_sku;
DROP INDEX IF EXISTS idx_mkt_prod_active;

-- marketplace_affiliate_referrals
DROP INDEX IF EXISTS idx_mkt_ref_aff_id;
DROP INDEX IF EXISTS idx_mkt_ref_user_id;

-- marketplace_affiliate_commissions
DROP INDEX IF EXISTS idx_mkt_comm_aff_status;
DROP INDEX IF EXISTS idx_mkt_comm_order_id;
DROP INDEX IF EXISTS idx_mkt_comm_eligible;

-- marketplace_affiliate_payouts
DROP INDEX IF EXISTS idx_mkt_payout_aff_id;
DROP INDEX IF EXISTS idx_mkt_payout_status;

-- marketplace_affiliate_badges
DROP INDEX IF EXISTS marketplace_affiliate_badges_affiliate_idx;

-- marketplace_affiliate_training_progress
DROP INDEX IF EXISTS marketplace_affiliate_training_progress_affiliate_idx;

-- marketplace_affiliate_product_assets
DROP INDEX IF EXISTS marketplace_affiliate_product_assets_sku_idx;

-- twilio_configurations
DROP INDEX IF EXISTS idx_twilio_config_merchant;

-- twilio_phone_numbers
DROP INDEX IF EXISTS idx_twilio_phones_merchant;

-- twilio_call_logs
DROP INDEX IF EXISTS idx_twilio_calls_merchant;
DROP INDEX IF EXISTS idx_twilio_calls_lead;
DROP INDEX IF EXISTS idx_twilio_calls_sid;
DROP INDEX IF EXISTS idx_twilio_calls_created;

-- twilio_sms_logs
DROP INDEX IF EXISTS idx_twilio_sms_merchant;
DROP INDEX IF EXISTS idx_twilio_sms_lead;
DROP INDEX IF EXISTS idx_twilio_sms_sid;
DROP INDEX IF EXISTS idx_twilio_sms_created;

-- twilio_email_logs
DROP INDEX IF EXISTS idx_twilio_email_merchant;
DROP INDEX IF EXISTS idx_twilio_email_lead;
DROP INDEX IF EXISTS idx_twilio_email_created;

-- twilio_voicemails
DROP INDEX IF EXISTS idx_twilio_voicemail_merchant;
DROP INDEX IF EXISTS idx_twilio_voicemail_listened;

-- twilio_call_queues
DROP INDEX IF EXISTS idx_twilio_queue_merchant;
DROP INDEX IF EXISTS idx_twilio_queue_status;
