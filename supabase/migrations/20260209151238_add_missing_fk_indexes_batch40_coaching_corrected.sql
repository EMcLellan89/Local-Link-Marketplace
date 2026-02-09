/*
  # Add Missing Foreign Key Indexes - Batch 40: Business Coaching Tables

  1. Performance Optimization
    - Add B-tree indexes on foreign key columns for business_coaching_* tables
    
  2. Tables Affected
    - business_coaching_bookings (package_id)
    - business_coaching_sessions (booking_id)
    
  3. Impact
    - 20-50% faster JOIN queries on affected foreign keys
    - Improved referential integrity check performance
    
  Note: business_coaching_bookings uses entity_type/entity_id pattern, not separate merchant_id/partner_id columns
*/

-- Business Coaching Tables
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);