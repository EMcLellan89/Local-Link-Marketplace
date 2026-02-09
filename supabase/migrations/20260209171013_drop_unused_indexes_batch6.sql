/*
  # Drop Unused Indexes - Batch 6
*/

DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;
DROP INDEX IF EXISTS idx_merchant_services_applications_merchant_id;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;
DROP INDEX IF EXISTS idx_printing_orders_product_id;
DROP INDEX IF EXISTS idx_ai_bot_setups_merchant_id;
DROP INDEX IF EXISTS idx_deal_locations_location_id;
DROP INDEX IF EXISTS idx_partners_tier_key;
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;
DROP INDEX IF EXISTS idx_partner_applications_reviewed_by;
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;
DROP INDEX IF EXISTS idx_payout_batches_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
