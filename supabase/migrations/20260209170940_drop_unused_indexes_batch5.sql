/*
  # Drop Unused Indexes - Batch 5
*/

DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
DROP INDEX IF EXISTS idx_job_payouts_job_id;
DROP INDEX IF EXISTS idx_job_payouts_merchant_id;
DROP INDEX IF EXISTS idx_job_payouts_sourcing_partner_id;
DROP INDEX IF EXISTS idx_job_payouts_worker_partner_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_contact_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;
