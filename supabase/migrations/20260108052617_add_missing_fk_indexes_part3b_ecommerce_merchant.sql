/*
  # Add Missing Foreign Key Indexes - Part 3B: Ecommerce-Merchant Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign keys in ecommerce through merchant tables
    - Improves query performance for joins and foreign key lookups
    
  2. Tables Affected
    - ecommerce_orders
    - email_automation_sequences
    - email_automation_steps
    - email_campaigns
    - email_communications
    - email_queue
    - email_sends
    - event_attendance
    - event_registrations
    - event_series
    - event_tickets
    - events
    - expansion_requests
    - expenses
    - external_business_webhooks
    - gift_card_templates
    - gift_card_transactions
    - gift_cards
    - internal_accounting_ledger
    - internal_invoices
    - invoice_items
    - invoice_payments
    - invoices
    - lead_list_orders
    - loyalty_events
    - marketing_campaigns
    - marketing_email_campaigns
    - marketplace_affiliate_commissions
    - marketplace_affiliate_payouts
    - marketplace_affiliate_product_assets
    - marketplace_affiliate_referrals
    - marketplace_affiliate_subscription_locks
    - merchant_addon_subscriptions
    - merchant_application_equipment
    - merchant_orders
    - merchant_services_applications
    - merchant_subscriptions
    - merchants
*/

-- ecommerce_orders
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id 
  ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id 
  ON ecommerce_orders(merchant_id);

-- email_automation_sequences
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id 
  ON email_automation_sequences(merchant_id);

-- email_automation_steps
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id 
  ON email_automation_steps(template_id);

-- email_campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id 
  ON email_campaigns(merchant_id);

-- email_communications
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id 
  ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id 
  ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by 
  ON email_communications(sent_by);

-- email_queue
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id 
  ON email_queue(user_id);

-- email_sends
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id 
  ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id 
  ON email_sends(subscriber_id);

-- event_attendance
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by 
  ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id 
  ON event_attendance(registration_id);

-- event_registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id 
  ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id 
  ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id 
  ON event_registrations(ticket_id);

-- event_series
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id 
  ON event_series(merchant_id);

-- event_tickets
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id 
  ON event_tickets(event_id);

-- events
CREATE INDEX IF NOT EXISTS idx_events_merchant_id 
  ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id 
  ON events(series_id);

-- expansion_requests
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id 
  ON expansion_requests(partner_id);

-- expenses
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id 
  ON expenses(merchant_id);

-- external_business_webhooks
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id 
  ON external_business_webhooks(business_unit_id);

-- gift_card_templates
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id 
  ON gift_card_templates(merchant_id);

-- gift_card_transactions
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id 
  ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id 
  ON gift_card_transactions(purchase_id);

-- gift_cards
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id 
  ON gift_cards(purchased_by_customer_id);

-- internal_accounting_ledger
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id 
  ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by 
  ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id 
  ON internal_accounting_ledger(customer_id);

-- internal_invoices
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id 
  ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by 
  ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id 
  ON internal_invoices(customer_id);

-- invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id 
  ON invoice_items(invoice_id);

-- invoice_payments
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id 
  ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id 
  ON invoice_payments(merchant_id);

-- invoices
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
  ON invoices(customer_id);

-- lead_list_orders
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id 
  ON lead_list_orders(merchant_id);

-- loyalty_events
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id 
  ON loyalty_events(customer_id);

-- marketing_campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id 
  ON marketing_campaigns(segment_id);

-- marketing_email_campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_business_unit_id 
  ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_created_by 
  ON marketing_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_segment_id 
  ON marketing_email_campaigns(segment_id);

-- marketplace_affiliate_commissions
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_affiliate_id 
  ON marketplace_affiliate_commissions(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id 
  ON marketplace_affiliate_commissions(referral_id);

-- marketplace_affiliate_payouts
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_affiliate_id 
  ON marketplace_affiliate_payouts(marketplace_affiliate_id);

-- marketplace_affiliate_product_assets
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_product_assets_product_sku 
  ON marketplace_affiliate_product_assets(product_sku);

-- marketplace_affiliate_referrals
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_affiliate_id 
  ON marketplace_affiliate_referrals(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id 
  ON marketplace_affiliate_referrals(referred_user_id);

-- marketplace_affiliate_subscription_locks
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_affiliate_id 
  ON marketplace_affiliate_subscription_locks(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id 
  ON marketplace_affiliate_subscription_locks(commission_id);

-- merchant_addon_subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id 
  ON merchant_addon_subscriptions(addon_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id 
  ON merchant_addon_subscriptions(merchant_id);

-- merchant_application_equipment
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id 
  ON merchant_application_equipment(application_id);

-- merchant_orders
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id 
  ON merchant_orders(merchant_id);

-- merchant_services_applications
CREATE INDEX IF NOT EXISTS idx_merchant_services_applications_merchant_id 
  ON merchant_services_applications(merchant_id);

-- merchant_subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id 
  ON merchant_subscriptions(tier_id);

-- merchants
CREATE INDEX IF NOT EXISTS idx_merchants_category_id 
  ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id 
  ON merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
  ON merchants(partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_territory_id 
  ON merchants(territory_id);
