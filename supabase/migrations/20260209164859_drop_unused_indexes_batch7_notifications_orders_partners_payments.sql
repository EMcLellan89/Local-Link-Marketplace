/*
  # Drop Unused Indexes - Batch 7: Notifications, Orders, Partners, Payments
  
  ## Tables Covered:
  - notifications
  - order_* tables
  - partner_* tables
  - paybright_* tables
  - postcard_* tables
  - printing_* tables
  - product_* tables
*/

-- Notifications
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_notifications_read;

-- Order tables
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_merchant_id;
DROP INDEX IF EXISTS idx_orders_status;

-- Partner tables
DROP INDEX IF EXISTS idx_partner_banking_partner_id;
DROP INDEX IF EXISTS idx_partner_challenge_participants_challenge_id;
DROP INDEX IF EXISTS idx_partner_challenge_participants_partner_id;
DROP INDEX IF EXISTS idx_partner_challenges_created_at;
DROP INDEX IF EXISTS idx_partner_contracts_created_at;
DROP INDEX IF EXISTS idx_partner_contracts_status;
DROP INDEX IF EXISTS idx_partner_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_created_at;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_milestones_partner_id;
DROP INDEX IF EXISTS idx_partner_outreach_logs_created_at;
DROP INDEX IF EXISTS idx_partner_overrides_partner_id;
DROP INDEX IF EXISTS idx_partner_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_swipe_assets_created_at;
DROP INDEX IF EXISTS idx_partner_tax_documents_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;
DROP INDEX IF EXISTS idx_partner_territories_partner_id;
DROP INDEX IF EXISTS idx_partner_tiers_created_at;
DROP INDEX IF EXISTS idx_partner_training_progress_partner_id;
DROP INDEX IF EXISTS idx_partners_created_at;
DROP INDEX IF EXISTS idx_partners_user_id;

-- Payment tables
DROP INDEX IF EXISTS idx_paybright_transactions_created_at;
DROP INDEX IF EXISTS idx_paybright_transactions_status;

-- Postcard tables
DROP INDEX IF EXISTS idx_postcard_orders_created_at;
DROP INDEX IF EXISTS idx_postcard_orders_merchant_id;

-- Printing tables
DROP INDEX IF EXISTS idx_printing_orders_created_at;
DROP INDEX IF EXISTS idx_printing_orders_merchant_id;
DROP INDEX IF EXISTS idx_printing_products_category;

-- Product tables
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_created_at;