/*
  # Add Foreign Key Indexes - Customer Referral, Deal, and DFY Tables

  1. Indexes Added
    - customer_referral_links: merchant_id, customer_id
    - deal_transactions: deal_id, merchant_id, customer_id, partner_id, campaign_id
    - dfy_fulfillment_tasks: order_id
    - dfy_orders: user_id, product_id, referral_partner_id

  2. Performance Impact
    - Speeds up referral tracking queries
    - Improves deal transaction lookups by merchant/customer
    - Optimizes DFY order processing and fulfillment tracking

  3. Security Notes
    - Critical for RLS policies on deal transactions
    - Enables fast partner commission calculations
*/

-- Customer referral links
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_merchant_id ON customer_referral_links(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_customer_id ON customer_referral_links(customer_id);

-- Deal transactions
CREATE INDEX IF NOT EXISTS idx_deal_transactions_deal_id ON deal_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_merchant_id ON deal_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_customer_id ON deal_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_partner_id ON deal_transactions(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deal_transactions_campaign_id ON deal_transactions(campaign_id) WHERE campaign_id IS NOT NULL;

-- DFY tables
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_user_id ON dfy_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id ON dfy_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_referral_partner_id ON dfy_orders(referral_partner_id) WHERE referral_partner_id IS NOT NULL;
