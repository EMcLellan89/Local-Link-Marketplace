/*
  # Drop Unused Indexes - Batch 3 (Deal to Marketing tables)
  
  1. Changes
    - Drop unused indexes on deal, ecommerce, email, event, expansion, expense, external, gift card tables
    - Also internal, invoice, lead, loyalty, and marketing tables
*/

DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_locations_location_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_customer_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_communications_business_unit_id;
DROP INDEX IF EXISTS idx_email_communications_customer_id;
DROP INDEX IF EXISTS idx_email_communications_sent_by;
DROP INDEX IF EXISTS idx_email_queue_user_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_subscriber_id;
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_event_attendance_registration_id;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;
DROP INDEX IF EXISTS idx_event_series_merchant_id;
DROP INDEX IF EXISTS idx_event_tickets_event_id;
DROP INDEX IF EXISTS idx_events_merchant_id;
DROP INDEX IF EXISTS idx_events_series_id;
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expenses_merchant_id;
DROP INDEX IF EXISTS idx_external_business_webhooks_business_unit_id;
DROP INDEX IF EXISTS idx_gift_card_templates_merchant_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_gift_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_purchase_id;
DROP INDEX IF EXISTS idx_gift_cards_purchased_by_customer_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_business_unit_id;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;
DROP INDEX IF EXISTS idx_internal_invoices_business_unit_id;
DROP INDEX IF EXISTS idx_internal_invoices_created_by;
DROP INDEX IF EXISTS idx_internal_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_business_unit_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_segment_id;
