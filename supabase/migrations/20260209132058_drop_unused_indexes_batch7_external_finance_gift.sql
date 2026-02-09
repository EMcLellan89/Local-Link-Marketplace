/*
  # Drop Unused Indexes - Batch 7: External, Financial, and Gift Tables

  1. Changes
    - Drop unused indexes from external_* tables
    - Drop unused indexes from financial_* tables
    - Drop unused indexes from favorites, gift_card, and internal tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves write performance
*/

-- External sales tables
DROP INDEX IF EXISTS idx_external_business_sales_partner_id;
DROP INDEX IF EXISTS idx_external_sales_business;
DROP INDEX IF EXISTS idx_external_sales_date;
DROP INDEX IF EXISTS idx_external_sales_partner;
DROP INDEX IF EXISTS idx_external_sales_slug;
DROP INDEX IF EXISTS idx_external_sales_status;
DROP INDEX IF EXISTS idx_external_business_webhooks_business_unit_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_external_sales_event_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_external_system_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_partner_id;
DROP INDEX IF EXISTS idx_external_sales_events_external_system_id;
DROP INDEX IF EXISTS idx_external_sales_events_partner_id;

-- Favorites and features
DROP INDEX IF EXISTS idx_favorites_customer_id;
DROP INDEX IF EXISTS idx_favorites_merchant_id;
DROP INDEX IF EXISTS idx_feature_flags_plan_id;

-- Finance tasks and reports
DROP INDEX IF EXISTS idx_finance_tasks_merchant_id;
DROP INDEX IF EXISTS idx_financial_reports_merchant_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_plan_id;

-- Gift cards
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;

-- Internal accounting and invoices
DROP INDEX IF EXISTS idx_internal_accounting_ledger_business_unit_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;
DROP INDEX IF EXISTS idx_internal_invoices_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_created_by;
DROP INDEX IF EXISTS idx_internal_invoices_customer_id;

-- Invoice items and payments
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_merchant_id;
