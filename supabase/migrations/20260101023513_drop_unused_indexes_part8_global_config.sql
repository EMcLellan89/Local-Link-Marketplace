/*
  # Drop Unused Indexes - Part 8: Global Configuration
  
  1. Removes unused indexes from configuration and utility tables
  2. Tables affected:
     - system_settings, profiles, currencies, countries
     - payment_methods, tax_rates, webhook_events
     - help_articles, deal_locations, customer_memberships
     - swipe_file_templates, swipe_file_favorites
*/

-- Drop unused indexes on system_settings
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_system_settings_key;
DROP INDEX IF EXISTS idx_system_settings_category;

-- Drop unused indexes on profiles
DROP INDEX IF EXISTS idx_profiles_partner_id;

-- Drop unused indexes on currencies
DROP INDEX IF EXISTS idx_currencies_code;
DROP INDEX IF EXISTS idx_currencies_active;

-- Drop unused indexes on countries
DROP INDEX IF EXISTS idx_countries_code;
DROP INDEX IF EXISTS idx_countries_supported;

-- Drop unused indexes on payment_methods
DROP INDEX IF EXISTS idx_payment_methods_slug;
DROP INDEX IF EXISTS idx_payment_methods_active;

-- Drop unused indexes on tax_rates
DROP INDEX IF EXISTS idx_tax_rates_country;
DROP INDEX IF EXISTS idx_tax_rates_effective;

-- Drop unused indexes on webhook_events
DROP INDEX IF EXISTS idx_webhook_events_provider;
DROP INDEX IF EXISTS idx_webhook_events_external_payment_id;
DROP INDEX IF EXISTS idx_webhook_events_received_at;

-- Drop unused indexes on help_articles
DROP INDEX IF EXISTS idx_help_articles_slug;
DROP INDEX IF EXISTS idx_help_articles_category;

-- Drop unused indexes on deal_locations
DROP INDEX IF EXISTS idx_deal_locations_location_id;

-- Drop unused indexes on customer_memberships
DROP INDEX IF EXISTS idx_customer_memberships_customer_id;
DROP INDEX IF EXISTS idx_customer_memberships_tier_id;

-- Drop unused indexes on swipe_file_templates
DROP INDEX IF EXISTS idx_swipe_templates_category;
DROP INDEX IF EXISTS idx_swipe_templates_industry;

-- Drop unused indexes on swipe_file_favorites
DROP INDEX IF EXISTS idx_swipe_favorites_merchant;
DROP INDEX IF EXISTS idx_swipe_favorites_template;

-- Drop unused indexes on usage_tracking
DROP INDEX IF EXISTS idx_usage_tracking_user;
DROP INDEX IF EXISTS idx_usage_tracking_period;
