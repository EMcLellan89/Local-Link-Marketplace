/*
  # Update Appointment Setting Pricing Model
  
  Change from flat rate to hourly + per-meeting commission:
  - Hourly packages (10, 20, 40 hours)
  - Per-qualified-meeting charges
  - Optional success bonuses
  
  This aligns incentives and provides predictable revenue
*/

-- Remove old flat-rate appointment setting products
DELETE FROM products_catalog WHERE slug LIKE 'dfy-appointment-setting%' AND slug NOT LIKE 'dfy-appointment-setting-hourly%';

-- Add new hourly + commission packages
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-appointment-setting-hourly-10', 'Appointment Setting — 10 Hours/Month', 'Human-backed appointment setting with 10 hours of monthly coverage plus per-meeting charges', 55000, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'hours', 10, 'hourly_rate', 55)),
  ('dfy-appointment-setting-hourly-20', 'Appointment Setting — 20 Hours/Month', 'Professional appointment setting with 20 hours monthly coverage for consistent lead flow', 110000, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'hours', 20, 'hourly_rate', 55)),
  ('dfy-appointment-setting-hourly-40', 'Appointment Setting — 40 Hours/Month', 'Enterprise appointment setting with 40 hours monthly coverage for high-volume businesses', 200000, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'hours', 40, 'hourly_rate', 50)),
  ('dfy-appointment-qualified-meeting', 'Qualified Meeting Fee', 'Per-meeting charge for each qualified, attended meeting booked with decision-makers', 6000, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'per_meeting', true, 'meeting_type', 'qualified')),
  ('dfy-appointment-success-bonus', 'Appointment Success Bonus', 'Optional success bonus when a qualified meeting converts to a closed sale', 15000, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'success_bonus', true))
ON CONFLICT (slug) DO NOTHING;

-- Add partner compensation structure to metadata (informational)
COMMENT ON COLUMN products_catalog.metadata IS 'Service metadata including partner compensation: Appointment Setting pays partners $25/hr base + $25/qualified meeting + $50/closed sale';
