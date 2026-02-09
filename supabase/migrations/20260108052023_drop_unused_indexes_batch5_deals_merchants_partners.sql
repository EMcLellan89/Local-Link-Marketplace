/*
  # Drop Unused Indexes - Batch 5: Deals, Merchants, Partners
  
  1. Performance Optimization
    - Remove 50+ unused indexes from deals, merchants, and partner tables
  
  2. Affected Tables
    - deal_clicks, deal_impressions, deal_locations, deals
    - expansion_requests, expenses, gift_cards, gift_card_transactions
    - invoice_items, invoice_payments, invoices
    - lead_list_orders, loyalty_events
    - merchant_addon_subscriptions, merchant_application_equipment
    - merchant_orders, merchant_services_applications, merchant_subscriptions
    - merchants, notifications, partner_ai_commissions
    - partner_applications, partner_subscriptions, partner_warning_logs
    - partners
*/

-- deal_clicks
DROP INDEX IF EXISTS idx_deal_clicks_user_id;

-- deal_impressions
DROP INDEX IF EXISTS idx_deal_impressions_user_id;

-- deal_locations
DROP INDEX IF EXISTS idx_deal_locations_location_id;

-- deals
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;

-- expansion_requests
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;

-- expenses
DROP INDEX IF EXISTS idx_expenses_merchant_id;

-- gift_cards
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;

-- gift_card_transactions
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;

-- gift_card_templates
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;

-- invoice_items
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- invoice_payments
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;

-- invoices
DROP INDEX IF EXISTS idx_invoices_customer_id;

-- lead_list_orders
DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;

-- loyalty_events
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;

-- merchant_addon_subscriptions
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;

-- merchant_application_equipment
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;

-- merchant_orders
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;

-- merchant_services_applications
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;

-- merchant_subscriptions
DROP INDEX IF EXISTS idx_merchant_subscriptions_tier_id;

-- merchants
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;

-- notifications
DROP INDEX IF EXISTS idx_notifications_customer_id;

-- partner_ai_commissions
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;

-- partner_applications
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;

-- partner_subscriptions
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;

-- partner_warning_logs
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;

-- partners
DROP INDEX IF EXISTS idx_partners_user_id;
