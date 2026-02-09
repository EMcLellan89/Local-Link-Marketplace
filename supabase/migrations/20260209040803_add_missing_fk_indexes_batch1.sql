/*
  # Add Missing Foreign Key Indexes - Batch 1

  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns (22 columns identified)
    - Improves JOIN performance across related tables
    - Reduces query execution time for referential lookups

  2. Tables Affected
    - affiliate_payouts, affiliate_referrals
    - crm_deals, crm_tasks
    - deal_templates, deals
    - dfy_fulfillment_tasks
    - email_campaigns, expansion_requests
    - invoice_items, merchants
    - partner_notifications, partner_subscriptions, partners
    - paybright_transactions
    - referral_rewards, review_responses
    - subscriptions, support_messages

  3. Security Impact
    - Prevents slow queries that could be exploited for DoS
    - Improves RLS policy evaluation performance
    - Essential for production-scale operations
*/

-- Affiliate tables
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);

-- CRM tables
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON crm_tasks(merchant_id);

-- Deal tables
CREATE INDEX IF NOT EXISTS idx_deal_templates_merchant_id ON deal_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);

-- DFY tables
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);

-- Email tables
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);

-- Expansion tables
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);

-- Invoice tables
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Merchant tables
CREATE INDEX IF NOT EXISTS idx_merchants_category_id ON merchants(category_id);

-- Partner tables
CREATE INDEX IF NOT EXISTS idx_partner_notifications_partner_id ON partner_notifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

-- Payment tables
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);

-- Referral tables
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);

-- Review tables
CREATE INDEX IF NOT EXISTS idx_review_responses_merchant_id ON review_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);

-- Subscription tables
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- Support tables
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
