/*
  # Add Foreign Key Indexes - Email, Invoice, Marketplace, and Merchant Tables

  1. Indexes Added
    - email_campaigns: merchant_id, template_id
    - gift_cards: merchant_id, purchased_by_customer_id
    - invoice_items: invoice_id
    - invoices: merchant_id, customer_id
    - jobs: merchant_id, created_by_admin_id
    - loyalty_contract_uploads: merchant_id
    - marketplace_orders: user_id, product_id, partner_id
    - merchant_orders: merchant_id
    - merchant_subscriptions: merchant_id, tier_id
    - monthly_closes: merchant_id, provider_id

  2. Performance Impact
    - Dramatically improves merchant-specific queries
    - Speeds up invoice and order lookups
    - Optimizes marketplace order processing

  3. Security Notes
    - Critical for RLS policies on merchant data
    - Enables fast partner commission tracking
*/

-- Email campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_template_id ON email_campaigns(template_id) WHERE template_id IS NOT NULL;

-- Gift cards
CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id) WHERE purchased_by_customer_id IS NOT NULL;

-- Invoice tables
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id) WHERE customer_id IS NOT NULL;

-- Jobs
CREATE INDEX IF NOT EXISTS idx_jobs_merchant_id ON jobs(merchant_id) WHERE merchant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_created_by_admin_id ON jobs(created_by_admin_id) WHERE created_by_admin_id IS NOT NULL;

-- Loyalty
CREATE INDEX IF NOT EXISTS idx_loyalty_contract_uploads_merchant_id ON loyalty_contract_uploads(merchant_id);

-- Marketplace orders
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user_id ON marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON marketplace_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id ON marketplace_orders(partner_id) WHERE partner_id IS NOT NULL;

-- Merchant tables
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id ON merchant_subscriptions(tier_id);

-- Monthly closes
CREATE INDEX IF NOT EXISTS idx_monthly_closes_merchant_id ON monthly_closes(merchant_id);
CREATE INDEX IF NOT EXISTS idx_monthly_closes_provider_id ON monthly_closes(provider_id);
