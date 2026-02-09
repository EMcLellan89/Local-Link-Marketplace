/*
  # Seed Business Deals Hub with Sample Data

  1. Sample Vendors
    - Major SaaS providers and service companies
    - Realistic commission structures

  2. Sample Deals
    - Across all categories
    - Various pricing tiers
    - Real-world offerings

  3. Sample Bundles
    - Local Growth Starter
    - Marketing Domination
    - Automation Pro

  4. Sample Growth Guides
    - Educational content library

  5. Sample Seasonal Campaign
    - Spring Growth Campaign
*/

-- Insert Sample Vendors
INSERT INTO vendors (name, slug, website, logo_url, description, affiliate_program, commission_rate, commission_type, payout_terms, contact_email, active, featured) VALUES
('GoHighLevel', 'gohighlevel', 'https://gohighlevel.com', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200', 'All-in-one marketing and CRM platform for agencies and local businesses', 'Partner Program', 40, 'percentage', 'Net 30', 'partners@gohighlevel.com', true, true),
('Twilio', 'twilio', 'https://twilio.com', 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=200', 'Cloud communications platform for SMS, voice, and video', 'Affiliate Program', 25, 'percentage', 'Net 45', 'affiliates@twilio.com', true, true),
('Canva', 'canva', 'https://canva.com', 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=200', 'Graphic design platform for creating stunning visuals', 'Partner Network', 30, 'percentage', 'Monthly', 'partners@canva.com', true, false),
('Calendly', 'calendly', 'https://calendly.com', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=200', 'Automated scheduling and booking platform', 'Referral Program', 20, 'percentage', 'Net 30', 'referrals@calendly.com', true, false),
('SEMrush', 'semrush', 'https://semrush.com', 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=200', 'All-in-one SEO and digital marketing toolkit', 'Affiliate Program', 40, 'percentage', 'Net 30', 'affiliates@semrush.com', true, true),
('Mailchimp', 'mailchimp', 'https://mailchimp.com', 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=200', 'Email marketing and automation platform', 'Partner Program', 30, 'percentage', 'Monthly', 'partners@mailchimp.com', true, false),
('Zapier', 'zapier', 'https://zapier.com', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200', 'No-code automation platform connecting 5000+ apps', 'Partner Program', 25, 'percentage', 'Net 30', 'partners@zapier.com', true, false),
('Podium', 'podium', 'https://podium.com', 'https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=200', 'Customer communication and reviews platform', 'Referral Program', 35, 'percentage', 'Net 30', 'referrals@podium.com', true, true);

-- Insert Sample Business Deals
INSERT INTO business_deals (vendor_id, title, slug, category, description, features, deal_type, regular_price_cents, deal_price_cents, commission_percent, partner_commission_percent, referral_link, image_url, featured, status) VALUES
(
  (SELECT id FROM vendors WHERE slug = 'gohighlevel'),
  'GoHighLevel CRM Pro - 60% Off First 3 Months',
  'gohighlevel-crm-pro',
  'crm_sms',
  'Complete marketing and CRM suite with unlimited contacts, funnels, and automation. Perfect for scaling local businesses.',
  ARRAY['Unlimited contacts', 'Marketing automation', 'Sales funnels', 'Email & SMS campaigns', 'Appointment booking', 'Pipeline management'],
  'affiliate',
  29700,
  11900,
  40,
  30,
  'https://gohighlevel.com/local-link',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'twilio'),
  'Twilio SMS Credits - $100 Free',
  'twilio-sms-credits',
  'crm_sms',
  'Get $100 in free SMS credits when you sign up. Perfect for customer communication and marketing campaigns.',
  ARRAY['$100 free credits', 'Global SMS delivery', 'Two-way messaging', 'MMS support', 'API integration', 'Analytics dashboard'],
  'affiliate',
  10000,
  0,
  25,
  30,
  'https://twilio.com/local-link',
  'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'canva'),
  'Canva Pro - 50% Off Annual Plan',
  'canva-pro-annual',
  'design_video',
  'Create professional marketing materials, social media graphics, and more with Canva Pro.',
  ARRAY['100M+ premium assets', 'Brand kit', 'Background remover', 'Magic resize', 'Team collaboration', 'Custom templates'],
  'affiliate',
  11999,
  5999,
  30,
  30,
  'https://canva.com/local-link',
  'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
  false,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'calendly'),
  'Calendly Premium - 3 Months Free',
  'calendly-premium-trial',
  'operations',
  'Automate appointment scheduling and eliminate back-and-forth emails. Integrates with your calendar and CRM.',
  ARRAY['Unlimited event types', 'Team scheduling', 'Custom branding', 'Payment integration', 'Workflows', 'Analytics'],
  'affiliate',
  3600,
  0,
  20,
  30,
  'https://calendly.com/local-link',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  false,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'semrush'),
  'SEMrush Pro - 30 Day Free Trial',
  'semrush-pro-trial',
  'marketing_ads',
  'Complete SEO toolkit with keyword research, competitor analysis, and rank tracking.',
  ARRAY['Keyword research', 'Site audit', 'Position tracking', 'Backlink analysis', 'Competitor research', 'Content marketing tools'],
  'affiliate',
  11995,
  0,
  40,
  30,
  'https://semrush.com/local-link',
  'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'mailchimp'),
  'Mailchimp Standard - 20% Off Annual',
  'mailchimp-standard',
  'marketing_ads',
  'Email marketing platform with automation, segmentation, and analytics for growing businesses.',
  ARRAY['50K contacts', 'A/B testing', 'Behavioral targeting', 'Custom templates', 'Landing pages', 'Detailed analytics'],
  'affiliate',
  34800,
  27840,
  30,
  30,
  'https://mailchimp.com/local-link',
  'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=800',
  false,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'zapier'),
  'Zapier Professional - 2 Months Free',
  'zapier-professional',
  'ai_automation',
  'Connect and automate workflows across 5000+ apps without coding. Save hours every week.',
  ARRAY['Unlimited Zaps', 'Multi-step Zaps', 'Premium apps', 'Auto-replay', 'Custom logic', 'Priority support'],
  'affiliate',
  9800,
  0,
  25,
  30,
  'https://zapier.com/local-link',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  false,
  'active'
),
(
  (SELECT id FROM vendors WHERE slug = 'podium'),
  'Podium Reviews Suite - First Month Free',
  'podium-reviews-suite',
  'reviews_reputation',
  'Automate review requests, manage online reputation, and improve your star ratings across platforms.',
  ARRAY['Automated review requests', 'Multi-platform management', 'Text messaging', 'Webchat', 'Payments', 'Video chat'],
  'affiliate',
  29900,
  0,
  35,
  30,
  'https://podium.com/local-link',
  'https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  'active'
);

-- Insert Sample Deal Bundles
INSERT INTO deal_bundles (name, slug, description, category, retail_price_cents, bundle_price_cents, margin_cents, features, included_services, status, featured, stripe_product_id) VALUES
(
  'Local Growth Starter',
  'local-growth-starter',
  'Everything a local business needs to start growing online. Includes website, CRM, and review management.',
  'Growth',
  24700,
  9700,
  5000,
  ARRAY['Professional website setup', 'CRM with 1000 contacts', 'Review automation', '30 days support', 'Training videos'],
  ARRAY['Website template', 'GoHighLevel CRM', 'Podium Reviews'],
  'active',
  true,
  null
),
(
  'Marketing Domination',
  'marketing-domination',
  'Complete marketing automation stack. Postcards, AI ads, email campaigns, and sales funnels in one package.',
  'Marketing',
  49700,
  19700,
  8000,
  ARRAY['500 postcards printed', 'AI ad copywriting', 'Email marketing setup', 'Sales funnel templates', 'SMS campaigns'],
  ARRAY['Postcard campaign', 'AI Ad Copy', 'Mailchimp setup', 'Funnel templates'],
  'active',
  true,
  null
),
(
  'Automation Pro',
  'automation-pro',
  'Automate your entire business with SMS, AI bots, and booking systems. Save 20+ hours per week.',
  'Automation',
  39700,
  14900,
  6000,
  ARRAY['SMS automation', 'AI chatbot setup', 'Appointment booking', 'Workflow automation', 'Integration setup'],
  ARRAY['Twilio SMS', 'AI Bot setup', 'Calendly Premium', 'Zapier automation'],
  'active',
  true,
  null
),
(
  'SEO & Content Domination',
  'seo-content-domination',
  'Rank higher on Google and create amazing content. Includes SEO tools, design platform, and content calendar.',
  'SEO & Content',
  29900,
  12900,
  5000,
  ARRAY['SEO audit & setup', 'Keyword research', 'Content calendar', 'Design templates', 'Social media graphics'],
  ARRAY['SEMrush access', 'Canva Pro', 'Content strategy', 'Template library'],
  'active',
  false,
  null
);

-- Link deals to bundles
INSERT INTO bundle_items (bundle_id, deal_id, sort_order) VALUES
-- Local Growth Starter
((SELECT id FROM deal_bundles WHERE slug = 'local-growth-starter'), (SELECT id FROM business_deals WHERE slug = 'gohighlevel-crm-pro'), 1),
((SELECT id FROM deal_bundles WHERE slug = 'local-growth-starter'), (SELECT id FROM business_deals WHERE slug = 'podium-reviews-suite'), 2),

-- Marketing Domination
((SELECT id FROM deal_bundles WHERE slug = 'marketing-domination'), (SELECT id FROM business_deals WHERE slug = 'mailchimp-standard'), 1),
((SELECT id FROM deal_bundles WHERE slug = 'marketing-domination'), (SELECT id FROM business_deals WHERE slug = 'canva-pro-annual'), 2),

-- Automation Pro
((SELECT id FROM deal_bundles WHERE slug = 'automation-pro'), (SELECT id FROM business_deals WHERE slug = 'twilio-sms-credits'), 1),
((SELECT id FROM deal_bundles WHERE slug = 'automation-pro'), (SELECT id FROM business_deals WHERE slug = 'calendly-premium-trial'), 2),
((SELECT id FROM deal_bundles WHERE slug = 'automation-pro'), (SELECT id FROM business_deals WHERE slug = 'zapier-professional'), 3),

-- SEO & Content Domination
((SELECT id FROM deal_bundles WHERE slug = 'seo-content-domination'), (SELECT id FROM business_deals WHERE slug = 'semrush-pro-trial'), 1),
((SELECT id FROM deal_bundles WHERE slug = 'seo-content-domination'), (SELECT id FROM business_deals WHERE slug = 'canva-pro-annual'), 2);

-- Insert Sample Growth Guides
INSERT INTO growth_guides (title, slug, category, description, content, related_deal_ids, video_url, thumbnail_url, author, read_time_minutes, status, published_at) VALUES
(
  'Complete Guide to Local Business CRM Setup',
  'crm-setup-guide',
  'CRM & Sales',
  'Learn how to set up and use a CRM to manage leads, automate follow-ups, and close more deals.',
  'A comprehensive guide covering CRM fundamentals, lead management, pipeline setup, and automation workflows...',
  ARRAY[(SELECT id FROM business_deals WHERE slug = 'gohighlevel-crm-pro')],
  'https://youtube.com/watch?v=example',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Local-Link Team',
  15,
  'published',
  now()
),
(
  'SMS Marketing for Local Businesses',
  'sms-marketing-guide',
  'Marketing',
  'Master SMS marketing to boost customer engagement and drive repeat business with text campaigns.',
  'Everything you need to know about SMS marketing including compliance, message templates, timing, and automation...',
  ARRAY[(SELECT id FROM business_deals WHERE slug = 'twilio-sms-credits')],
  'https://youtube.com/watch?v=example2',
  'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Local-Link Team',
  12,
  'published',
  now()
),
(
  'Review Generation Playbook',
  'review-generation-playbook',
  'Reviews & Reputation',
  'Get more 5-star reviews on autopilot with proven strategies and automation tools.',
  'Step-by-step playbook for requesting reviews, handling negative feedback, and improving your online reputation...',
  ARRAY[(SELECT id FROM business_deals WHERE slug = 'podium-reviews-suite')],
  'https://youtube.com/watch?v=example3',
  'https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Local-Link Team',
  10,
  'published',
  now()
),
(
  'DIY Marketing Graphics with Canva',
  'canva-marketing-graphics',
  'Design & Creative',
  'Create professional marketing materials in minutes without hiring a designer.',
  'Learn Canva shortcuts, design principles, and templates to create stunning social media posts, flyers, and ads...',
  ARRAY[(SELECT id FROM business_deals WHERE slug = 'canva-pro-annual')],
  'https://youtube.com/watch?v=example4',
  'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Local-Link Team',
  8,
  'published',
  now()
);

-- Insert Sample Seasonal Campaign
INSERT INTO seasonal_campaigns (name, slug, season, description, start_date, end_date, featured_deal_ids, banner_url, status) VALUES
(
  'Spring Growth Blitz 2026',
  'spring-growth-2026',
  'Spring',
  'Massive deals on marketing tools and automation to help you dominate spring season. Limited time offers!',
  '2026-03-01'::timestamptz,
  '2026-04-30'::timestamptz,
  ARRAY[
    (SELECT id FROM business_deals WHERE slug = 'gohighlevel-crm-pro'),
    (SELECT id FROM business_deals WHERE slug = 'semrush-pro-trial'),
    (SELECT id FROM business_deals WHERE slug = 'podium-reviews-suite')
  ],
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'scheduled'
);