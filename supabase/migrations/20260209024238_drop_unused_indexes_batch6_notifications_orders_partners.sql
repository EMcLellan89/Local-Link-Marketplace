/*
  # Drop Unused Indexes - Batch 6: Notifications, Orders, Partners & Payment Tables

  This migration drops unused indexes from notification, order, partner,
  and payment-related tables.

  ## Tables Affected:
  - Notification tables
  - Order tables
  - Partner tables
  - Payment tables (Paybright, Stripe)

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Notification indexes
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_notifications_merchant_id;
DROP INDEX IF EXISTS idx_notifications_type;
DROP INDEX IF EXISTS idx_notifications_is_read;
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_partner_notifications_partner_id;
DROP INDEX IF EXISTS idx_partner_notifications_type;
DROP INDEX IF EXISTS idx_partner_notifications_is_read;

-- Order indexes
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_merchant_id;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;

-- Partner indexes
DROP INDEX IF EXISTS idx_partners_user_id;
DROP INDEX IF EXISTS idx_partners_status;
DROP INDEX IF EXISTS idx_partners_certification_level;
DROP INDEX IF EXISTS idx_partners_partner_type;
DROP INDEX IF EXISTS idx_partners_created_at;
DROP INDEX IF EXISTS idx_partner_certifications_partner_id;
DROP INDEX IF EXISTS idx_partner_certifications_certification_type;
DROP INDEX IF EXISTS idx_partner_certifications_issued_at;
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_email;
DROP INDEX IF EXISTS idx_partner_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_status;
DROP INDEX IF EXISTS idx_partner_crm_deals_created_at;

-- Payment indexes
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_status;
DROP INDEX IF EXISTS idx_paybright_transactions_created_at;
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_type;
DROP INDEX IF EXISTS idx_stripe_webhook_events_processed;
DROP INDEX IF EXISTS idx_stripe_webhook_events_created_at;