/*
  # Fix Missing Foreign Key Indexes - Batch 15 (Support, Survey, Swipe, System, Territory Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - support tables
    - survey_responses
    - swipe_file_favorites
    - system_settings
    - territory tables
    - ticket_messages
*/

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id ON survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id ON swipe_file_favorites(template_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON system_settings(updated_by);
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id ON territories(parent_territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id ON territory_licenses(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id ON territory_licenses(territory_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
