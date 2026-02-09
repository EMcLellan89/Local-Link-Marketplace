/*
  # Add Missing Foreign Key Indexes - Security Audit Batch 5 (Final)

  1. Purpose
    - Final batch of missing foreign key indexes
    
  2. Tables Updated (Batch 5 - Remaining tables)
    - subscription_crm_mapping
    - team_members
    - vapi_tools
    - white_label_licenses
*/

-- Subscription CRM mapping
CREATE INDEX IF NOT EXISTS idx_subscription_crm_mapping_crm_tier_id
  ON subscription_crm_mapping(crm_tier_id);

-- Team members
CREATE INDEX IF NOT EXISTS idx_team_members_user_id
  ON team_members(user_id);

-- VAPI tools
CREATE INDEX IF NOT EXISTS idx_vapi_tools_assistant_id
  ON vapi_tools(assistant_id);

-- White label licenses
CREATE INDEX IF NOT EXISTS idx_white_label_licenses_partner_id
  ON white_label_licenses(partner_id);

CREATE INDEX IF NOT EXISTS idx_white_label_licenses_vertical_product_id
  ON white_label_licenses(vertical_product_id);
