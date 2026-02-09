/*
  # Add Missing Foreign Key Indexes - Batch 7: PayBright & Services

  1. Changes
    - Add indexes for paybright_transactions (customer_id, merchant_id)
    - Add indexes for paybright_subscriptions (customer_id, merchant_id)
    - Add indexes for paybright_refunds (transaction_id, merchant_id, requested_by)
    - Add indexes for paybright_audit_log (merchant_id, user_id)
    - Add indexes for various service orders (merchant_id)
    - Add indexes for deal_locations (location_id)
    
  2. Rationale
    - Payment processing requires fast transaction lookups
    - Service order management needs efficient queries
    
  3. Performance Impact
    - Faster payment verification
    - Better service order tracking
*/

-- PayBright Transactions
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);

-- PayBright Subscriptions
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id ON paybright_subscriptions(merchant_id);

-- PayBright Refunds
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by ON paybright_refunds(requested_by);

-- PayBright Audit Log
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id ON paybright_audit_log(user_id);

-- Service Orders
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id ON website_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id ON website_orders(template_id);
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id ON lead_list_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_appointment_setting_bookings_merchant_id ON appointment_setting_bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_services_applications_merchant_id ON merchant_services_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id ON recruiting_services(merchant_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON printing_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_bot_setups_merchant_id ON ai_bot_setups(merchant_id);

-- Deal Locations
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
