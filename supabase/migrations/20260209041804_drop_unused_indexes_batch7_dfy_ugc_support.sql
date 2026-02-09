/*
  # Drop Unused Indexes - Batch 7: DFY, UGC, Support Tables

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - DFY (Done-For-You) service tables
    - UGC (User Generated Content) tables
    - Video and content tables
    - Support and ticket tables

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- DFY service indexes
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id;
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_orders_created_at;
DROP INDEX IF EXISTS idx_dfy_products_category;
DROP INDEX IF EXISTS idx_dfy_products_active;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_assigned_to;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_status;
DROP INDEX IF EXISTS idx_dfy_ad_vault_industry;
DROP INDEX IF EXISTS idx_dfy_ad_vault_asset_type;

-- UGC content indexes
DROP INDEX IF EXISTS idx_ugc_requests_merchant_id;
DROP INDEX IF EXISTS idx_ugc_requests_creator_id;
DROP INDEX IF EXISTS idx_ugc_requests_status;
DROP INDEX IF EXISTS idx_ugc_requests_created_at;
DROP INDEX IF EXISTS idx_ugc_content_creator_id;
DROP INDEX IF EXISTS idx_ugc_content_request_id;
DROP INDEX IF EXISTS idx_ugc_content_status;
DROP INDEX IF EXISTS idx_ugc_creators_user_id;
DROP INDEX IF EXISTS idx_ugc_creators_status;
DROP INDEX IF EXISTS idx_ugc_creators_rating;

-- Video content indexes
DROP INDEX IF EXISTS idx_video_content_merchant_id;
DROP INDEX IF EXISTS idx_video_content_creator_id;
DROP INDEX IF EXISTS idx_video_content_status;
DROP INDEX IF EXISTS idx_video_orders_merchant_id;
DROP INDEX IF EXISTS idx_video_orders_creator_id;
DROP INDEX IF EXISTS idx_video_orders_status;
DROP INDEX IF EXISTS idx_video_orders_created_at;

-- Support and ticket indexes
DROP INDEX IF EXISTS idx_support_tickets_user_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_priority;
DROP INDEX IF EXISTS idx_support_tickets_created_at;
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_messages_user_id;
DROP INDEX IF EXISTS idx_support_messages_created_at;