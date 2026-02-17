/*
  # Add Network Navigators Products to Marketplace
  
  1. Business Entry
    - Add Network Navigators as external business
  
  2. Territory Products
    - 25-mile territory SaaS subscription
    - 50-mile territory SaaS subscription
    - 75-mile territory SaaS subscription
  
  3. Growth Infrastructure (DFY Marketing Packages)
    - Setup & Launch Pack
    - Lead Capture & Retargeting Pack
    - Local SEO + GBP Pack
    - Content Pack
    - Review Engine Pack
  
  4. Commission Structure
    - Partners earn 20-25% on all Network Navigators sales
*/

-- Add Network Navigators as a business
INSERT INTO profit_network_businesses (
  business_key, name, logo_url, description, website_url,
  base_commission_rate, is_active, category
) VALUES (
  'network-navigators',
  'Network Navigators',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
  'Hyper-local Facebook Group monetization platform. Help businesses build recurring revenue through private member communities in their territory.',
  'https://networknavigators.com',
  0.20,
  true,
  'saas'
) ON CONFLICT (business_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url,
  base_commission_rate = EXCLUDED.base_commission_rate,
  updated_at = now();

-- Territory Subscription Products
INSERT INTO marketplace_affiliate_products (
  sku, name, type, price_cents, currency, commission_rate_bp,
  recurring, active, description, category, business_key, metadata
) VALUES
  -- 25-Mile Territory
  ('NN-TERR-25',
   'Network Navigators - 25 Mile Territory',
   'subscription',
   9900,
   'USD',
   2000,
   true,
   true,
   'Exclusive 25-mile territory ownership. Build and monetize Facebook Groups for local businesses in your protected area. Includes platform access, training, and support.',
   'saas',
   'network-navigators',
   '{"territory_radius": 25, "includes": ["Platform access", "Territory protection", "Training portal", "Monthly coaching", "Marketing templates"], "billing": "monthly"}'::jsonb
  ),
  
  -- 50-Mile Territory
  ('NN-TERR-50',
   'Network Navigators - 50 Mile Territory',
   'subscription',
   14900,
   'USD',
   2000,
   true,
   true,
   'Exclusive 50-mile territory ownership. Larger coverage area for more business opportunities. Perfect for suburban/rural areas. Includes everything in 25-mile plus expanded support.',
   'saas',
   'network-navigators',
   '{"territory_radius": 50, "includes": ["Everything in 25-mile", "Larger territory", "Priority support", "Advanced training", "Co-marketing opportunities"], "billing": "monthly"}'::jsonb
  ),
  
  -- 75-Mile Territory
  ('NN-TERR-75',
   'Network Navigators - 75 Mile Territory',
   'subscription',
   19900,
   'USD',
   2500,
   true,
   true,
   'Premium 75-mile territory ownership. Maximum coverage for serious entrepreneurs. Includes white-label options and multi-location support.',
   'saas',
   'network-navigators',
   '{"territory_radius": 75, "includes": ["Everything in 50-mile", "White-label platform", "Multi-location support", "Dedicated account manager", "Revenue share opportunities"], "billing": "monthly"}'::jsonb
  ),
  
  -- DFY Marketing Packages
  -- Setup & Launch Pack
  ('NN-DFY-SETUP',
   'Setup & Launch Pack',
   'service',
   149700,
   'USD',
   2500,
   false,
   true,
   'Complete Facebook Group setup, branding, landing page, and launch campaign. Get your first client''s group live in 7 days.',
   'dfy_marketing',
   'network-navigators',
   '{"deliverables": ["Facebook Group setup & branding", "Custom landing page", "Payment integration", "Launch email campaign", "Launch social ads", "Tracking & analytics setup"], "turnaround_days": 7, "partner_fulfillment": true}'::jsonb
  ),
  
  -- Lead Capture & Retargeting Pack
  ('NN-DFY-LEADS',
   'Lead Capture & Retargeting Pack',
   'service',
   99700,
   'USD',
   2500,
   false,
   true,
   'Build automated lead capture funnels and retargeting campaigns. Turn website visitors into group members.',
   'dfy_marketing',
   'network-navigators',
   '{"deliverables": ["Lead magnet creation", "Opt-in page design", "Email automation setup", "Facebook pixel integration", "Retargeting ad campaigns", "30-day campaign management"], "turnaround_days": 10, "partner_fulfillment": true}'::jsonb
  ),
  
  -- Local SEO + GBP Pack
  ('NN-DFY-SEO',
   'Local SEO + Google Business Profile Pack',
   'service',
   79700,
   'USD',
   2500,
   false,
   true,
   'Optimize Google Business Profile and local SEO to drive organic traffic to membership offers.',
   'dfy_marketing',
   'network-navigators',
   '{"deliverables": ["GBP optimization", "Local citation building", "Review generation setup", "Local keyword optimization", "Schema markup", "Monthly SEO report"], "turnaround_days": 14, "partner_fulfillment": true}'::jsonb
  ),
  
  -- Content Pack
  ('NN-DFY-CONTENT',
   'Content Creation Pack',
   'service',
   59700,
   'USD',
   2500,
   false,
   true,
   '30 days of done-for-you Facebook Group content. Posts, engagement prompts, and member value.',
   'dfy_marketing',
   'network-navigators',
   '{"deliverables": ["30 custom posts", "10 engagement prompts", "5 video scripts", "Content calendar", "Image graphics", "Posting schedule"], "turnaround_days": 7, "partner_fulfillment": true}'::jsonb
  ),
  
  -- Review Engine Pack
  ('NN-DFY-REVIEWS',
   'Review Engine Pack',
   'service',
   89700,
   'USD',
   2500,
   false,
   true,
   'Automated review collection system to build social proof and drive membership signups.',
   'dfy_marketing',
   'network-navigators',
   '{"deliverables": ["Automated review requests", "Multi-platform integration", "Review response templates", "Review widget for website", "Monthly reputation report", "60-day campaign management"], "turnaround_days": 5, "partner_fulfillment": true}'::jsonb
  )

ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  metadata = EXCLUDED.metadata,
  active = EXCLUDED.active;

-- Create DFY job templates for partner fulfillment
CREATE TABLE IF NOT EXISTS dfy_job_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL REFERENCES marketplace_affiliate_products(sku),
  template_name text NOT NULL,
  task_checklist jsonb NOT NULL,
  required_skills text[] DEFAULT '{}',
  estimated_hours integer NOT NULL,
  partner_payout_cents integer NOT NULL,
  instructions text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS for job templates
ALTER TABLE dfy_job_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can view job templates" ON dfy_job_templates;
CREATE POLICY "Partners can view job templates"
  ON dfy_job_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM partners WHERE user_id = auth.uid() AND status = 'Active')
  );

DROP POLICY IF EXISTS "Admin full access to job templates" ON dfy_job_templates;
CREATE POLICY "Admin full access to job templates"
  ON dfy_job_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed job templates
INSERT INTO dfy_job_templates (sku, template_name, task_checklist, required_skills, estimated_hours, partner_payout_cents, instructions) VALUES
  ('NN-DFY-SETUP', 'Setup & Launch Pack', 
   '[
     {"task": "Create Facebook Group with client branding", "complete": false},
     {"task": "Design cover image and group assets", "complete": false},
     {"task": "Set up group rules and guidelines", "complete": false},
     {"task": "Build custom landing page", "complete": false},
     {"task": "Integrate payment system (Stripe/PayBright)", "complete": false},
     {"task": "Create welcome email sequence", "complete": false},
     {"task": "Design launch email campaign", "complete": false},
     {"task": "Set up Facebook ads for launch", "complete": false},
     {"task": "Configure tracking and analytics", "complete": false},
     {"task": "Test entire member journey", "complete": false}
   ]'::jsonb,
   ARRAY['Facebook Groups', 'Landing Page Design', 'Email Marketing', 'Facebook Ads', 'Payment Integration'],
   12,
   75000,
   'Complete turnkey setup of Facebook Group membership program. Client should be able to launch within 7 days of completion. Include training video on how to manage the group.'
  ),
  
  ('NN-DFY-LEADS', 'Lead Capture & Retargeting Pack',
   '[
     {"task": "Create lead magnet (guide/checklist/template)", "complete": false},
     {"task": "Design opt-in landing page", "complete": false},
     {"task": "Set up email automation sequence", "complete": false},
     {"task": "Install and configure Facebook pixel", "complete": false},
     {"task": "Create custom audience segments", "complete": false},
     {"task": "Design retargeting ad creative (3 variations)", "complete": false},
     {"task": "Launch retargeting campaigns", "complete": false},
     {"task": "Set up conversion tracking", "complete": false},
     {"task": "Create 30-day optimization schedule", "complete": false}
   ]'::jsonb,
   ARRAY['Lead Generation', 'Email Marketing', 'Facebook Ads', 'Copywriting'],
   10,
   55000,
   'Build automated lead capture system with retargeting. Focus on converting website visitors into group members. Provide optimization schedule for first 30 days.'
  ),
  
  ('NN-DFY-SEO', 'Local SEO + GBP Pack',
   '[
     {"task": "Complete Google Business Profile audit", "complete": false},
     {"task": "Optimize GBP with keywords and categories", "complete": false},
     {"task": "Add high-quality photos and videos", "complete": false},
     {"task": "Build local citations (top 50 directories)", "complete": false},
     {"task": "Set up automated review requests", "complete": false},
     {"task": "Optimize website for local keywords", "complete": false},
     {"task": "Add schema markup for local business", "complete": false},
     {"task": "Create monthly SEO report template", "complete": false}
   ]'::jsonb,
   ARRAY['Local SEO', 'Google Business Profile', 'Citation Building'],
   8,
   45000,
   'Comprehensive local SEO optimization. Focus on driving organic traffic to membership offers. Provide ongoing monitoring guide.'
  ),
  
  ('NN-DFY-CONTENT', 'Content Pack',
   '[
     {"task": "Research industry trends and topics", "complete": false},
     {"task": "Write 30 custom Facebook posts", "complete": false},
     {"task": "Create 10 engagement prompts", "complete": false},
     {"task": "Write 5 video scripts", "complete": false},
     {"task": "Design content calendar", "complete": false},
     {"task": "Create image graphics for each post", "complete": false},
     {"task": "Build posting schedule with optimal times", "complete": false}
   ]'::jsonb,
   ARRAY['Content Writing', 'Social Media', 'Graphic Design'],
   6,
   35000,
   'Create 30 days of engaging Facebook Group content. Posts should drive engagement, provide value, and promote membership retention.'
  ),
  
  ('NN-DFY-REVIEWS', 'Review Engine Pack',
   '[
     {"task": "Set up automated review request system", "complete": false},
     {"task": "Integrate with Google, Facebook, Yelp", "complete": false},
     {"task": "Create review request email/SMS templates", "complete": false},
     {"task": "Write review response templates", "complete": false},
     {"task": "Add review widget to website", "complete": false},
     {"task": "Set up reputation monitoring alerts", "complete": false},
     {"task": "Create monthly reputation report", "complete": false},
     {"task": "Train client on review management", "complete": false}
   ]'::jsonb,
   ARRAY['Reputation Management', 'Review Generation', 'Email/SMS Marketing'],
   7,
   50000,
   'Build automated review collection and management system. Focus on generating consistent 5-star reviews to support membership sales.'
  )

ON CONFLICT (sku) DO UPDATE SET
  task_checklist = EXCLUDED.task_checklist,
  estimated_hours = EXCLUDED.estimated_hours,
  partner_payout_cents = EXCLUDED.partner_payout_cents,
  instructions = EXCLUDED.instructions,
  updated_at = now();

-- Add index
CREATE INDEX IF NOT EXISTS idx_dfy_job_templates_sku ON dfy_job_templates(sku);
