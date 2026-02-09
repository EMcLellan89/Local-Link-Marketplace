/*
  # Add Additional Growth Bundles
  
  Add new bundle options mentioned in the specs:
  - Visibility Stack (GBP + Reviews + Citations)
  - Updated Scale Stack definition
  
  Bundles increase ARPU and simplify buying decisions
*/

-- Update existing bundles and add new ones
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-bundle-visibility-stack-v2', 'Visibility Stack Bundle — Complete', 'Complete visibility package: Google Business Profile Management + Review Management + Directory Citations', 59900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['gbp_management', 'review_management', 'citations'], 'savings_percent', 20)),
  ('dfy-bundle-scale-stack-v2', 'Scale Stack Bundle — Enterprise', 'Full operations support: VA Growth (20 hrs) + CRM Management + Appointment Setting', 169900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['va_growth', 'crm_mgmt', 'appointment_setting_hourly'], 'savings_percent', 20)),
  ('dfy-bundle-content-authority', 'Content Authority Bundle', 'Build authority: Blog Writing (4/mo) + Social Content (16/mo) + Email Marketing', 149900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['blog_4', 'social_16', 'email_pro'], 'savings_percent', 15)),
  ('dfy-bundle-outreach-complete', 'Complete Outreach Bundle', 'Multi-channel outreach: Email + SMS + Letter Writing campaigns', 99900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['email_lite', 'sms_lite', 'letter_monthly'], 'savings_percent', 15))
ON CONFLICT (slug) DO NOTHING;
