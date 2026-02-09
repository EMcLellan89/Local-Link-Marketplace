/*
  # Seed Bot Tool Permissions
  
  Grant specific tools to bots based on their roles:
  - Checkout creation: Sales bots only
  - Deal creation: Deal placement bot only (with approval)
  - DFY job creation: Fulfillment bots only
  - Lead creation: Most bots
  - Admin tools: Admin-only bots
*/

-- Create checkout permission for sales bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'create_checkout'),
  true
FROM bot_profiles bp
WHERE bp.slug IN (
  'fd-sales-conversation-bot',
  'fd-website-chat-bot',
  'fd-upsell-crosssell-bot',
  'fd-smart-booking-bot',
  'll-deal-placement-bot',
  'll-postcard-ads-bot',
  'll-local-paws-membership-bot',
  'll-budget-buster-sales-bot',
  'll-founder-city-sales-bot'
)
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Create deal permission (requires approval)
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed, restrictions)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'create_deal'),
  true,
  '{"requires_admin_approval": true, "partner_restrictions": "print_inperson_only"}'::jsonb
FROM bot_profiles bp
WHERE bp.slug = 'll-deal-placement-bot'
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Create DFY job permission for fulfillment bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'create_dfy_job'),
  true
FROM bot_profiles bp
WHERE bp.slug IN (
  'fd-dfy-setup-bot',
  'fd-funnel-builder-bot',
  'fd-campaign-launch-bot'
)
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Create lead permission for most bots (not admin-ops or internal-only)
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'create_lead'),
  true
FROM bot_profiles bp
WHERE bp.role_type NOT IN ('admin_ops', 'core_intelligence')
  AND bp.role_type IN ('sales', 'support', 'booking', 'voice', 'voice_sales', 'social_dm')
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Create invoice permission for billing/admin bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'create_invoice'),
  true
FROM bot_profiles bp
WHERE bp.slug IN (
  'll-postcard-ads-bot',
  'fd-revenue-control-bot'
)
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Lookup SKU permission for all sales and support bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'lookup_sku'),
  true
FROM bot_profiles bp
WHERE bp.role_type IN ('sales', 'support', 'booking', 'voice', 'voice_sales')
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Calculate commission permission for sales and support bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'calculate_commission'),
  true
FROM bot_profiles bp
WHERE bp.role_type IN ('sales', 'support', 'booking')
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Extract entities permission for intake and lead bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'extract_entities'),
  true
FROM bot_profiles bp
WHERE bp.role_type IN ('sales', 'support', 'onboarding', 'booking', 'voice', 'core_intelligence')
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Generate copy permission for content/marketing bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'generate_copy'),
  true
FROM bot_profiles bp
WHERE bp.slug IN (
  'fd-campaign-builder-bot',
  'fd-local-seo-content-bot',
  'fd-funnel-builder-bot'
)
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Admin-only tools
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed, restrictions)
SELECT 
  bp.id,
  at.id,
  true,
  '{"admin_only": true}'::jsonb
FROM bot_profiles bp
CROSS JOIN ai_tools at
WHERE bp.role_type = 'admin_ops'
  AND at.slug IN (
    'adjust_commission',
    'create_payout_batch',
    'process_refund',
    'generate_report'
  )
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Classify intent for intelligence bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'classify_intent'),
  true
FROM bot_profiles bp
WHERE bp.slug IN (
  'fd-lead-intelligence-bot',
  'fd-ai-business-brain'
)
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;

-- Assign fulfillment for fulfillment and admin bots
INSERT INTO bot_tool_permissions (bot_profile_id, tool_id, is_allowed)
SELECT 
  bp.id,
  (SELECT id FROM ai_tools WHERE slug = 'assign_fulfillment'),
  true
FROM bot_profiles bp
WHERE bp.role_type IN ('fulfillment', 'admin_ops')
ON CONFLICT (bot_profile_id, tool_id) DO NOTHING;
