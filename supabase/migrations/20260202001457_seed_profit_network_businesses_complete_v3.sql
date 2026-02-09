/*
  # Seed All Profit Network Businesses
  
  1. Businesses Added
    - 10 Core Platform businesses
    - 3 AI/OPS products
    - 4 Service & Real-World businesses
    - 1 Data/Leads business
    - 3 Family/Consumer/Care businesses
    - Total: 21 businesses
    
  2. Features
    - All set to 25% base commission
    - Categorized by business type
    - Descriptions and branding included
    - Active and ready for partner enrollment
*/

-- First, add unique constraint on name if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profit_network_businesses_name_key'
  ) THEN
    ALTER TABLE profit_network_businesses ADD CONSTRAINT profit_network_businesses_name_key UNIQUE (name);
  END IF;
END $$;

-- Insert all 21 Profit Network businesses
INSERT INTO profit_network_businesses (name, description, website_url, logo_url, category, base_commission_rate, is_active)
VALUES
  -- Core Platform (10 businesses)
  (
    'Local-Link Marketplace™',
    'The complete local business growth platform - CRM, marketing automation, customer engagement, and revenue tools for local businesses.',
    'https://local-link.com/marketplace',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link AI OS™',
    'Revolutionary AI operating system that powers intelligent business automation, customer engagement, and growth acceleration.',
    'https://local-link.com/ai-os',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link Revenue System™',
    'Complete revenue generation and optimization platform for local businesses - from lead capture to customer retention.',
    'https://local-link.com/revenue-system',
    'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link Live™',
    'Real-time customer engagement platform with live chat, video consultations, and instant booking capabilities.',
    'https://local-link.com/live',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link Foundry™',
    'Business building and automation platform - create, deploy, and scale local business operations with AI.',
    'https://local-link.com/foundry',
    'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link AI Studio™',
    'Professional AI content creation suite - generate marketing materials, social content, and customer communications.',
    'https://local-link.com/ai-studio',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link StoryLab™',
    'AI-powered storytelling platform for businesses - create compelling brand narratives and customer success stories.',
    'https://local-link.com/storylab',
    'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link Lead Command™',
    'Advanced lead generation and management system with AI qualification, routing, and conversion optimization.',
    'https://local-link.com/lead-command',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Customer Referral Engine™ (DFY)',
    'Done-for-you referral program management - automated customer advocacy, rewards, and growth marketing.',
    'https://local-link.com/referral-engine',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  (
    'Local-Link AI Master Collection™',
    'The ultimate AI business suite - all AI tools, automations, and agents in one comprehensive platform.',
    'https://local-link.com/ai-master-collection',
    'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    'Core Platform',
    25.00,
    true
  ),
  
  -- AI/OPS Products (3 businesses)
  (
    'FrontDesk AI Pro™',
    'AI-powered receptionist and customer service platform - handles calls, bookings, and customer inquiries 24/7.',
    'https://local-link.com/frontdesk-ai',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    'AI/OPS Products',
    25.00,
    true
  ),
  (
    'LifeOps AI Pro™',
    'Complete AI business operations platform - automate scheduling, admin tasks, and daily operations.',
    'https://local-link.com/lifeops-ai',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'AI/OPS Products',
    25.00,
    true
  ),
  (
    'LifeOps Agents™ / LifeOps Teams™',
    'AI agent workforce for businesses - deploy virtual teams to handle operations, support, and growth tasks.',
    'https://local-link.com/lifeops-teams',
    'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
    'AI/OPS Products',
    25.00,
    true
  ),
  
  -- Service & Real-World (4 businesses)
  (
    'Gemini Home Solutions™',
    'Professional home improvement and maintenance services - repairs, renovations, and property care.',
    'https://local-link.com/gemini-home',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    'Service & Real-World',
    25.00,
    true
  ),
  (
    'Gemini Site Solutions™',
    'Commercial property services - facility management, repairs, and business property maintenance.',
    'https://local-link.com/gemini-site',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'Service & Real-World',
    25.00,
    true
  ),
  (
    'Fresh & Clean Laundry™',
    'Premium laundry and dry cleaning service - pickup, cleaning, and delivery for homes and businesses.',
    'https://local-link.com/fresh-clean-laundry',
    'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg',
    'Service & Real-World',
    25.00,
    true
  ),
  (
    'My Budget Buster™',
    'Personal finance and budgeting platform - AI-powered expense tracking, savings optimization, and financial wellness.',
    'https://local-link.com/budget-buster',
    'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
    'Service & Real-World',
    25.00,
    true
  ),
  
  -- Data & Leads (1 business)
  (
    'LeadGraph™',
    'Advanced lead intelligence and data platform - B2B contact data, company insights, and sales intelligence.',
    'https://local-link.com/leadgraph',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'Data & Leads',
    25.00,
    true
  ),
  
  -- Family/Consumer/Care (3 businesses)
  (
    'CareCompanion HQ™',
    'Comprehensive caregiving platform - connect families with professional caregivers, schedule care, and manage health.',
    'https://local-link.com/care-companion',
    'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg',
    'Family/Consumer/Care',
    25.00,
    true
  ),
  (
    'Local Pet Passport™',
    'Complete pet care platform - vet records, grooming, boarding, and local pet services in one place.',
    'https://local-link.com/pet-passport',
    'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
    'Family/Consumer/Care',
    25.00,
    true
  ),
  (
    'Founder City™',
    'Entrepreneur community and business building platform - connect with founders, access resources, and grow together.',
    'https://local-link.com/founder-city',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
    'Family/Consumer/Care',
    25.00,
    true
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url,
  logo_url = EXCLUDED.logo_url,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active;
