/*
  # Add Missing Foreign Key Indexes - Batch 30: Services & Equipment

  1. Changes
    - Add indexes for service_bookings (service_id)
    - Add indexes for system_settings (updated_by)
    - Add indexes for merchant_application_equipment (application_id)
    
  2. Rationale
    - Service booking requires service lookups
    - System settings tracking needs user auditing
    - Equipment applications need application references
    
  3. Performance Impact
    - Faster service booking queries
    - Better system audit trails
    - Improved equipment application tracking
*/

-- Service Bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);

-- System Settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON system_settings(updated_by);

-- Merchant Application Equipment
CREATE INDEX IF NOT EXISTS idx_merchant_application_equipment_application_id ON merchant_application_equipment(application_id);
