/*
  # Add Profit Network Businesses to Marketplace Affiliate Products

  1. Changes
    - Add all 21 Profit Network businesses as marketplace affiliate products
    - Set 25% commission rate (2500 basis points) for all
    - Use valid product types: subscription, service, course, bundle
    - Include pricing tiers and descriptions
    - Link to profit_network_businesses via metadata

  2. Product Categories
    - Core Platform (10 products) - type: subscription
    - AI/OPS Products (3 products) - type: service
    - Service & Real-World (4 products) - type: service
    - Data & Leads (1 product) - type: subscription
    - Family/Consumer/Care (3 products) - type: subscription

  3. Commission Structure
    - Base commission: 25% (2500 basis points)
    - Partners earn through unique tracking links
    - Integrated with Profit Network enrollment system
*/

-- Core Platform Products (10) - Subscription type
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  description,
  category,
  metadata
)
VALUES
  (
    'PN-MARKETPLACE',
    'Local-Link Marketplace',
    'subscription',
    29700,
    'USD',
    2500,
    true,
    true,
    'Complete marketplace platform connecting local businesses with customers through deals, loyalty programs, and advertising',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 297}'::jsonb
  ),
  (
    'PN-AI-OS',
    'Local-Link AI OS',
    'subscription',
    49700,
    'USD',
    2500,
    true,
    true,
    'AI-powered operating system for local businesses with automation, customer engagement, and growth tools',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 497}'::jsonb
  ),
  (
    'PN-REVENUE-SYSTEM',
    'Local-Link Revenue System',
    'subscription',
    99700,
    'USD',
    2500,
    true,
    true,
    'Complete revenue generation system with upsells, cross-sells, and recurring revenue optimization',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 997}'::jsonb
  ),
  (
    'PN-LIVE',
    'Local-Link Live',
    'subscription',
    39700,
    'USD',
    2500,
    true,
    true,
    'Live event and webinar platform for local business marketing and customer engagement',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 397}'::jsonb
  ),
  (
    'PN-FOUNDRY',
    'Local-Link Foundry',
    'subscription',
    79700,
    'USD',
    2500,
    true,
    true,
    'Business incubator and accelerator platform with training, mentorship, and growth resources',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 797}'::jsonb
  ),
  (
    'PN-AI-STUDIO',
    'Local-Link AI Studio',
    'subscription',
    59700,
    'USD',
    2500,
    true,
    true,
    'AI content creation studio for marketing materials, social media, and advertising campaigns',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 597}'::jsonb
  ),
  (
    'PN-STORYLAB',
    'Local-Link StoryLab',
    'subscription',
    29700,
    'USD',
    2500,
    true,
    true,
    'Brand storytelling and content marketing platform for local businesses',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 297}'::jsonb
  ),
  (
    'PN-LEAD-COMMAND',
    'Local-Link Lead Command',
    'subscription',
    49700,
    'USD',
    2500,
    true,
    true,
    'Lead generation and management command center with AI-powered qualification and nurturing',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 497}'::jsonb
  ),
  (
    'PN-REFERRAL-ENGINE',
    'Local-Link Referral Engine',
    'subscription',
    39700,
    'USD',
    2500,
    true,
    true,
    'Automated referral and word-of-mouth marketing system for local businesses',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 397}'::jsonb
  ),
  (
    'PN-AI-MASTER-COLLECTION',
    'Local-Link AI Master Collection',
    'bundle',
    199700,
    'USD',
    2500,
    true,
    true,
    'Complete collection of all AI tools and systems in one comprehensive package',
    'Core Platform',
    '{"profit_network": true, "business_type": "platform", "monthly_price": 1997}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  metadata = EXCLUDED.metadata;

-- AI/OPS Products (3) - Service type
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  description,
  category,
  metadata
)
VALUES
  (
    'PN-FRONTDESK-AI-PRO',
    'FrontDesk AI Pro',
    'service',
    49700,
    'USD',
    2500,
    true,
    true,
    'AI-powered receptionist and customer service automation for local businesses',
    'AI/OPS Products',
    '{"profit_network": true, "business_type": "ai_service", "monthly_price": 497}'::jsonb
  ),
  (
    'PN-LIFEOPS-AI-PRO',
    'LifeOps AI Pro',
    'service',
    39700,
    'USD',
    2500,
    true,
    true,
    'AI operations assistant for personal and professional task management',
    'AI/OPS Products',
    '{"profit_network": true, "business_type": "ai_service", "monthly_price": 397}'::jsonb
  ),
  (
    'PN-LIFEOPS-TEAMS',
    'LifeOps Teams',
    'service',
    79700,
    'USD',
    2500,
    true,
    true,
    'Team collaboration and AI operations platform for growing businesses',
    'AI/OPS Products',
    '{"profit_network": true, "business_type": "ai_service", "monthly_price": 797}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  metadata = EXCLUDED.metadata;

-- Service & Real-World (4) - Service type
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  description,
  category,
  metadata
)
VALUES
  (
    'PN-GEMINI-HOME',
    'Gemini Home Solutions',
    'service',
    15000,
    'USD',
    2500,
    true,
    false,
    'Professional home services and repairs with guaranteed satisfaction',
    'Service & Real-World',
    '{"profit_network": true, "business_type": "service", "avg_job_price": 150}'::jsonb
  ),
  (
    'PN-GEMINI-SITE',
    'Gemini Site Solutions',
    'service',
    25000,
    'USD',
    2500,
    true,
    false,
    'Commercial property maintenance and facility management services',
    'Service & Real-World',
    '{"profit_network": true, "business_type": "service", "avg_job_price": 250}'::jsonb
  ),
  (
    'PN-FRESH-CLEAN',
    'Fresh & Clean Laundry',
    'service',
    3500,
    'USD',
    2500,
    true,
    false,
    'Premium laundry and dry cleaning services with pickup and delivery',
    'Service & Real-World',
    '{"profit_network": true, "business_type": "service", "avg_job_price": 35}'::jsonb
  ),
  (
    'PN-BUDGET-BUSTER',
    'My Budget Buster',
    'subscription',
    1997,
    'USD',
    2500,
    true,
    true,
    'Personal finance management and budgeting app with AI-powered insights',
    'Service & Real-World',
    '{"profit_network": true, "business_type": "app", "monthly_price": 19.97}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  metadata = EXCLUDED.metadata;

-- Data & Leads (1) - Subscription type
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  description,
  category,
  metadata
)
VALUES
  (
    'PN-LEADGRAPH',
    'LeadGraph',
    'subscription',
    19700,
    'USD',
    2500,
    true,
    true,
    'Business intelligence and lead data platform with real-time updates and verified contacts',
    'Data & Leads',
    '{"profit_network": true, "business_type": "data", "monthly_price": 197}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  metadata = EXCLUDED.metadata;

-- Family/Consumer/Care (3) - Subscription type
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  description,
  category,
  metadata
)
VALUES
  (
    'PN-CARE-COMPANION',
    'CareCompanion HQ',
    'subscription',
    4900,
    'USD',
    2500,
    true,
    true,
    'Senior care coordination and family communication platform',
    'Family/Consumer/Care',
    '{"profit_network": true, "business_type": "consumer", "monthly_price": 49}'::jsonb
  ),
  (
    'PN-PET-PASSPORT',
    'Local Pet Passport',
    'subscription',
    2997,
    'USD',
    2500,
    true,
    true,
    'Pet health records, local pet services, and community connection platform',
    'Family/Consumer/Care',
    '{"profit_network": true, "business_type": "consumer", "monthly_price": 29.97}'::jsonb
  ),
  (
    'PN-FOUNDER-CITY',
    'Founder City',
    'subscription',
    9700,
    'USD',
    2500,
    true,
    true,
    'Entrepreneur community platform with resources, networking, and collaboration tools',
    'Family/Consumer/Care',
    '{"profit_network": true, "business_type": "consumer", "monthly_price": 97}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  metadata = EXCLUDED.metadata;
