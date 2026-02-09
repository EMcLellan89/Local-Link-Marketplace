/*
  # Fix Missing Foreign Key Indexes - Batch 16 (Transaction, Twilio, UGC, Unified, Upsell, User, VAPI Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - transactions
    - twilio tables
    - ugc tables
    - unified tables
    - upsell tables
    - user_subscriptions
    - vapi_call_logs
*/

CREATE INDEX IF NOT EXISTS idx_transactions_deal_id ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner_id ON transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_territory_id ON transactions(territory_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id ON twilio_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id ON twilio_call_queues(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id ON twilio_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id ON twilio_phone_numbers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id ON twilio_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id ON twilio_voicemails(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id ON twilio_voicemails(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id ON ugc_assets(order_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id ON ugc_orders(package_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id ON ugc_payouts(order_id);
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business_unit_id ON unified_customers(primary_business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_business_unit_id ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_customer_id ON unified_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_invoice_id ON unified_sales(invoice_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id ON upsell_purchases(upsell_offer_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id ON upsell_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_assistant_id ON vapi_call_logs(assistant_id);
