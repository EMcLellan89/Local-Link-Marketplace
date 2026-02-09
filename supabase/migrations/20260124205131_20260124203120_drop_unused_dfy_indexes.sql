/*
  # Drop Unused DFY Indexes

  1. Performance Improvements
    - Removes unused indexes to reduce storage overhead
    - Improves write performance by reducing index maintenance
    - Keeps essential foreign key indexes created in previous migrations

  2. Changes
    - Drops indexes that are not used in query patterns
    - Retains all foreign key indexes for referential integrity
*/

-- Drop unused indexes on dfy_orders if they exist
DROP INDEX IF EXISTS idx_dfy_orders_created_at;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_orders_referral_source;

-- Drop unused indexes on dfy_products if they exist  
DROP INDEX IF EXISTS idx_dfy_products_category;
DROP INDEX IF EXISTS idx_dfy_products_is_active;
DROP INDEX IF EXISTS idx_dfy_products_sort_order;

-- Drop unused indexes on dfy_onboarding if they exist
DROP INDEX IF EXISTS idx_dfy_onboarding_submitted_at;
DROP INDEX IF EXISTS idx_dfy_onboarding_status;

-- Drop unused indexes on dfy_fulfillment_tasks if they exist
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_status;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_assigned_to;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_due_at;

-- Drop unused indexes on dfy_commission_ledger if they exist
DROP INDEX IF EXISTS idx_dfy_commission_ledger_status;
DROP INDEX IF EXISTS idx_dfy_commission_ledger_partner_id;

-- Drop unused indexes on partner_dfy_tracking_links if they exist
DROP INDEX IF EXISTS idx_partner_dfy_tracking_links_slug;
