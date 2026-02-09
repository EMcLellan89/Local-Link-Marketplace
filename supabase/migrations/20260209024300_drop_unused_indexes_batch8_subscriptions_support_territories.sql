/*
  # Drop Unused Indexes - Batch 8: Subscriptions, Support, Territories & Transaction Tables

  This migration drops unused indexes from subscription, support, territory,
  and transaction-related tables.

  ## Tables Affected:
  - Subscription tables
  - Support tables
  - Territory tables
  - Transaction tables

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Subscription indexes
DROP INDEX IF EXISTS idx_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_subscriptions_created_at;
DROP INDEX IF EXISTS idx_subscription_items_subscription_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS idx_user_subscriptions_status;
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_status;

-- Support indexes
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_priority;
DROP INDEX IF EXISTS idx_support_tickets_created_at;
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_messages_created_at;

-- Territory indexes
DROP INDEX IF EXISTS idx_territories_partner_id;
DROP INDEX IF EXISTS idx_territories_state;
DROP INDEX IF EXISTS idx_territories_city;
DROP INDEX IF EXISTS idx_territories_status;
DROP INDEX IF EXISTS idx_territory_assignments_partner_id;
DROP INDEX IF EXISTS idx_territory_assignments_merchant_id;
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expansion_requests_status;

-- Transaction indexes
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created_at;