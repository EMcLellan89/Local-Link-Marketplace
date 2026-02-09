/*
  # Drop All Unused Indexes - Batch 3 (Event through Merchant)
  
  1. Performance Improvement
    - Continues removing unused indexes
    
  2. Indexes Dropped
    - Event, expansion, expense indexes
    - Gift card indexes
    - Internal, invoice, lead indexes
    - Loyalty, marketing, marketplace indexes
    - Merchant indexes
*/

-- Event indexes
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_event_attendance_registration_id;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;
DROP INDEX IF EXISTS idx_event_series_merchant_id;
DROP INDEX IF EXISTS idx_event_tickets_event_id;
DROP INDEX IF EXISTS idx_events_merchant_id;
DROP INDEX IF EXISTS idx_events_series_id;

-- Expansion & Expense indexes
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expenses_merchant_id;

-- External business indexes
DROP INDEX IF EXISTS idx_external_business_webhooks_business_unit_id;

-- Gift card indexes
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;

-- Internal indexes
DROP INDEX IF EXISTS idx_internal_accounting_ledger_business_unit_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;
DROP INDEX IF EXISTS idx_internal_invoices_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_created_by;
DROP INDEX IF EXISTS idx_internal_invoices_customer_id;

-- Invoice indexes
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;

-- Lead indexes
DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;

-- Loyalty indexes
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;

-- Marketing indexes
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_business_unit_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_segment_id;

-- Marketplace affiliate indexes
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_referral_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_product_assets_product_sku;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_commission_id;

-- Merchant indexes
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;
