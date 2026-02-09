/*
  # Add Expanded Merchant Services
  
  1. Business Health Check
  2. Missed Revenue Recovery
  3. Competitor Monitoring
  4. Seasonal Campaigns
  5. Compliance & Listing Protection
  6. Done-With-You Growth Support
  7. Staff Training
  8. Emergency Priority Mode
  9. Exit Readiness
  
  Focus on retention, ARPU increase, and merchant success
*/

-- Business Health Check
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-health-check-human', 'Business Health Check — Human Review', 'Monthly performance review with human analysis, insights, and recommended next steps', 7900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'health_check', 'human_review', true))
ON CONFLICT (slug) DO NOTHING;

-- Missed Revenue Recovery
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-revenue-recovery-setup', 'Missed Revenue Recovery — Setup', 'Complete setup for missed call recovery, form abandonment follow-up, and stale lead reactivation', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'revenue_recovery', 'setup', true)),
  ('dfy-revenue-recovery-monthly', 'Missed Revenue Recovery — Monthly', 'Ongoing revenue recovery with systematic follow-up and reactivation campaigns', 19900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'revenue_recovery', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Competitor Monitoring
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-competitor-dashboard', 'Competitor Monitoring — Dashboard', 'Automated competitor tracking dashboard showing reviews, rankings, and offer changes', 3900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'competitor_monitoring', 'tier', 'dashboard')),
  ('merchant-competitor-alerts', 'Competitor Monitoring — Alerts + Actions', 'Active competitor monitoring with real-time alerts and strategic recommendations', 9900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'competitor_monitoring', 'tier', 'alerts_actions'))
ON CONFLICT (slug) DO NOTHING;

-- Seasonal Campaigns
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-seasonal-campaign-standard', 'Seasonal Campaign — Standard', 'Complete seasonal campaign including emails, SMS, letters, landing page, and posting schedule', 69900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'seasonal_campaign', 'tier', 'standard')),
  ('dfy-seasonal-campaign-premium', 'Seasonal Campaign — Premium', 'Premium seasonal campaign with print materials, extended reach, and multi-channel coordination', 99900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'seasonal_campaign', 'tier', 'premium'))
ON CONFLICT (slug) DO NOTHING;

-- Compliance & Listing Protection
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-compliance-audit', 'Compliance & Listing Protection — Audit', 'Comprehensive audit of all business listings for compliance, policy violations, and optimization opportunities', 9900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'compliance', 'audit', true)),
  ('merchant-compliance-monitoring', 'Compliance & Listing Protection — Monitoring', 'Ongoing listing health monitoring with alerts for policy changes and violations', 3900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'compliance', 'monitoring', true))
ON CONFLICT (slug) DO NOTHING;

-- Done-With-You Growth Support
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-done-with-you', 'Done-With-You Growth Support', 'Guided growth support where partners set up systems and provide ongoing guidance while you execute', 39900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'done_with_you', 'hybrid', true))
ON CONFLICT (slug) DO NOTHING;

-- Staff Training
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-staff-training', 'Staff Training — Advanced Team Access', 'Comprehensive staff training for lead handling, CRM usage, review requests, and customer communication', 14900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'staff_training', 'team_access', true))
ON CONFLICT (slug) DO NOTHING;

-- Emergency Priority Mode
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-emergency-priority', 'Emergency Priority Mode', 'Priority partner matching, fast-track job posting, and SLA escalation when you need immediate help', 7900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'emergency_priority', 'priority', true))
ON CONFLICT (slug) DO NOTHING;

-- Exit Readiness
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('merchant-exit-readiness-audit', 'Exit Readiness — Audit', 'Business systems audit evaluating lead consistency, documentation, and buyer attractiveness', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'exit_readiness', 'audit', true)),
  ('merchant-exit-readiness-cleanup', 'Exit Readiness — DFY Cleanup', 'Complete business cleanup to maximize valuation and buyer readiness', 79900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'exit_readiness', 'cleanup', true))
ON CONFLICT (slug) DO NOTHING;
