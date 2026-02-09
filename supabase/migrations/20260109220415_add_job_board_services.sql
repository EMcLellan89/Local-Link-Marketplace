/*
  # Job Board Services

  1. Commission Structure
    - If outsourced to others or admin does it: Partner gets 7% commission
    - If partner self-fulfills: Partner gets tier % commission (15%/20%/25%)
    - Upline always gets 7% of partner's commission

  2. Services Included
    - Marketing services
    - CRM migration
    - AI & automation setup
    - Ad swipe file creation
    - Website design & development
    - Printing services
    - UGC content creation
    - Leads & outreach
    - Appointment setting
    - Recruiting tools setup
    - Postcard advertising campaigns
*/

INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, recurring, category, description, active, metadata)
VALUES
  (
    'marketing_services_499',
    'Marketing Services',
    'service',
    49900,
    'USD',
    700, -- 7% if outsourced
    false,
    'job_board',
    'Marketing campaign setup - $499. Commission: 7% if outsourced ($34.93), or tier % if self-fulfilled (15%=$74.85, 20%=$99.80, 25%=$124.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'crm_migration_799',
    'CRM Migration Service',
    'service',
    79900,
    'USD',
    700,
    false,
    'job_board',
    'Migrate customer data to new CRM - $799. Commission: 7% if outsourced ($55.93), or tier % if self-fulfilled (15%=$119.85, 20%=$159.80, 25%=$199.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'ai_automation_setup_999',
    'AI & Automation Setup',
    'service',
    99900,
    'USD',
    700,
    false,
    'job_board',
    'AI bot implementation and automation - $999. Commission: 7% if outsourced ($69.93), or tier % if self-fulfilled (15%=$149.85, 20%=$199.80, 25%=$249.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'swipe_file_creation_299',
    'Ad Swipe File Creation',
    'service',
    29900,
    'USD',
    700,
    false,
    'job_board',
    'Custom ad templates and swipe file - $299. Commission: 7% if outsourced ($20.93), or tier % if self-fulfilled (15%=$44.85, 20%=$59.80, 25%=$74.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'website_design_1499',
    'Website Design & Development',
    'service',
    149900,
    'USD',
    700,
    false,
    'job_board',
    'Professional website design and development - $1,499. Commission: 7% if outsourced ($104.93), or tier % if self-fulfilled (15%=$224.85, 20%=$299.80, 25%=$374.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'printing_services_199',
    'Printing Services',
    'service',
    19900,
    'USD',
    700,
    false,
    'job_board',
    'Business cards, flyers, brochures - $199. Commission: 7% if outsourced ($13.93), or tier % if self-fulfilled (15%=$29.85, 20%=$39.80, 25%=$49.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'ugc_content_399',
    'UGC Content Creation',
    'service',
    39900,
    'USD',
    700,
    false,
    'job_board',
    'User-generated content videos and photos - $399. Commission: 7% if outsourced ($27.93), or tier % if self-fulfilled (15%=$59.85, 20%=$79.80, 25%=$99.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'leads_outreach_599',
    'Leads & Outreach',
    'service',
    59900,
    'USD',
    700,
    false,
    'job_board',
    'Lead generation campaigns - $599. Commission: 7% if outsourced ($41.93), or tier % if self-fulfilled (15%=$89.85, 20%=$119.80, 25%=$149.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'appointment_setting_499',
    'Appointment Setting',
    'service',
    49900,
    'USD',
    700,
    false,
    'job_board',
    'Book appointments for merchants - $499. Commission: 7% if outsourced ($34.93), or tier % if self-fulfilled (15%=$74.85, 20%=$99.80, 25%=$124.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'recruiting_tools_699',
    'Recruiting Tools Setup',
    'service',
    69900,
    'USD',
    700,
    false,
    'job_board',
    'Hiring funnel and job board setup - $699. Commission: 7% if outsourced ($48.93), or tier % if self-fulfilled (15%=$104.85, 20%=$139.80, 25%=$174.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  ),
  (
    'postcard_advertising_399',
    'Postcard Advertising Campaign',
    'service',
    39900,
    'USD',
    700,
    false,
    'job_board',
    'Direct mail marketing campaign - $399. Commission: 7% if outsourced ($27.93), or tier % if self-fulfilled (15%=$59.85, 20%=$79.80, 25%=$99.75). Upline gets 7% of partner commission.',
    true,
    '{"commission_type": "job_board", "outsourced_rate_bp": 700, "self_fulfilled_uses_tier": true}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  metadata = EXCLUDED.metadata;
