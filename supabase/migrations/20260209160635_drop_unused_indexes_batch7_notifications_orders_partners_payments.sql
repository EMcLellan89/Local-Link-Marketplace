/*
  # Drop Unused Indexes - Batch 7: Notifications, Orders, Partners & Payments Tables
  
  1. Tables Affected
    - notifications
    - orders and order_* tables
    - partners and partner_* tables
    - payment_* tables
  
  2. Performance Impact
    - Removes unused indexes freeing up storage
    - Reduces maintenance overhead on write operations
  
  3. Safety
    - All indexes confirmed unused via pg_stat_user_indexes
    - Zero scan count on all listed indexes
*/

-- Notifications
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_merchant_id;

-- Orders
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_merchant_id;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;

-- Partner tables (core)
DROP INDEX IF EXISTS idx_partners_referred_by;
DROP INDEX IF EXISTS idx_partner_territories_partner_id;
DROP INDEX IF EXISTS idx_partner_enrollments_partner_id;
DROP INDEX IF EXISTS idx_partner_commission_overrides_partner_id;

-- Partner CRM
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_companies_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_deal_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_deal_id;

-- Partner system
DROP INDEX IF EXISTS idx_partner_badges_partner_id;
DROP INDEX IF EXISTS idx_partner_certifications_partner_id;
DROP INDEX IF EXISTS idx_partner_tracking_links_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_completions_partner_id;

-- Payments
DROP INDEX IF EXISTS idx_payments_customer_id;
DROP INDEX IF EXISTS idx_payments_merchant_id;
DROP INDEX IF EXISTS idx_payment_methods_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;