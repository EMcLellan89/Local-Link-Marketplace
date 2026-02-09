/*
  # Drop Unused Indexes - Batch 2
  
  1. Purpose
    - Drop indexes with idx_scan = 0 (never used by queries)
    - Reduces database maintenance overhead
    - Improves write performance
  
  2. Indexes Dropped
    - partner_crm tables: various indexes
    - communications_subscriptions: merchant_id
    - communications_transactions: merchant_id
    - profit_network_enrollments: partner_id, business_id
    - purchases: customer_id, deal_id
    - review_responses: review_id
    - reviews: merchant_id, customer_id
  
  3. Security
    - No security impact
    - Performance improvement for writes
*/

-- Partner CRM Tables
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_tasks_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_tasks_deal_id;

-- Communications Tables
DROP INDEX IF EXISTS idx_communications_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;

-- Profit Network
DROP INDEX IF EXISTS idx_profit_network_enrollments_partner_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_business_id;

-- Purchases
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;

-- Reviews
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_deal_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;