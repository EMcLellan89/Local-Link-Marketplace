/*
  # Drop Unused Indexes - Final Batch 5 (Customer Tables)

  This migration removes unused indexes from customer-related tables.

  Tables covered:
  - customer_activity_log
  - customer_business_relationships
  - customer_email_segments
  - customer_impersonation_log
  - customer_memberships
  - customer_support_tickets
  - deal_clicks
  - deal_impressions
  - deal_locations
  - deals
  - ecommerce_orders
*/

-- Customer Tables
DROP INDEX IF EXISTS idx_customer_activity_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_activity_log_customer_id;
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;
DROP INDEX IF EXISTS idx_customer_business_relationships_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_business_unit_id;
DROP INDEX IF EXISTS idx_customer_email_segments_created_by;
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_customer_id;
DROP INDEX IF EXISTS idx_customer_impersonation_log_team_member_id;
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_customer_support_tickets_business_unit_id;
DROP INDEX IF EXISTS idx_customer_support_tickets_customer_id;

-- Deal Tables
DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_locations_location_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;

-- Ecommerce
DROP INDEX IF EXISTS idx_ecommerce_orders_customer_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant_id;