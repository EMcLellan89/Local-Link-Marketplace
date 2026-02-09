/*
  # Add Missing Merchant Courses to Academy

  1. Courses Added
    - Local Customers on Autopilot™ (merchant, priced $97-$297)
    - UGC From Home™ (merchant, priced $97-$297)
    - AI Receptionist & Missed Call Recovery™ (merchant, $97)
    - Reviews That Bring Customers In™ (merchant, $49)
    - Marketing for Trades™ (merchant, $197)
    - Pet Businesses That Get Found First™ (merchant, $197)
    - Care Coordination for Families™ (merchant, $97)
    - Start a Local Service Side Hustle™ (merchant, $97)
    - Online Sales Without Ads™ (merchant, $97)
    - Facebook Monetization for Local Businesses™ (merchant, $197)
    - Blog Growth System™ (merchant, tiered $297-$2997)
    - Plus 13 more merchant training courses

  2. Changes
    - All merchant courses set to is_free=false (they have paid products)
    - All merchant courses set to target_audience=''merchant''
    - All courses set to is_published=true
*/

INSERT INTO academy_courses (
  slug,
  title,
  subtitle,
  description,
  thumbnail_url,
  target_audience,
  is_free,
  is_published,
  est_minutes,
  difficulty_level
) VALUES
  ('local-customers-on-autopilot', 'Local Customers on Autopilot™', 'Get customers without ads using Local-Link', 'Master the Local-Link platform to generate predictable customer flow. Learn referral systems, marketplace positioning, and automated lead generation.', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg', 'merchant', false, true, 480, 'beginner'),
  ('ugc-from-home', 'UGC From Home™', 'Stay-at-home income creating content (no followers needed)', 'Build a profitable UGC portfolio, master client outreach, and price your services competitively. Create content that converts without needing a large following.', 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg', 'merchant', false, true, 360, 'beginner'),
  ('ai-receptionist-missed-calls', 'AI Receptionist & Missed Call Recovery™', 'Automate appointment booking and customer service 24/7', 'Set up AI-powered phone answering to capture every lead. Never miss a call again with automated appointment scheduling and inquiry handling.', 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg', 'merchant', false, true, 240, 'intermediate'),
  ('reviews-that-convert', 'Reviews That Bring Customers In™', 'Turn 5-star reviews into paying customers', 'Systematic review generation and showcasing strategies. Learn ethical review collection, response templates, and reputation management.', 'https://images.pexels.com/photos/5475754/pexels-photo-5475754.jpeg', 'merchant', false, true, 180, 'beginner'),
  ('marketing-for-trades', 'Marketing for Trades (No Ads Required)™', 'Plumbing, HVAC, electrical, roofing & more', 'Industry-specific marketing that actually works for trade businesses. No expensive ads—just proven systems that bring you qualified leads.', 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg', 'merchant', false, true, 360, 'beginner'),
  ('local-paws-passport-petconnect-crm', 'Pet Businesses That Get Found First™', 'Marketing for groomers, vets, trainers & pet stores', 'Attract pet owners and build loyalty in your community. Specialized strategies for pet service providers to dominate local search.', 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg', 'merchant', false, true, 300, 'beginner'),
  ('care-coordination-for-families', 'Care Coordination for Families™', 'Home health, senior care & family services marketing', 'Build trust and reach families who need your care services. Compliance-safe marketing for healthcare and senior service providers.', 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg', 'merchant', false, true, 240, 'beginner'),
  ('local-service-side-hustle', 'Start a Local Service Side Hustle™', 'Start a service business with little to no startup cost', 'Launch profitable service businesses: lawn care, cleaning, handyman, pressure washing & more. Bootstrap your way to sustainable income.', 'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg', 'merchant', false, true, 300, 'beginner'),
  ('online-sales-without-ads', 'Online Sales Without Ads™', 'Systematic outreach, relationships & closing', 'Build a sales pipeline without spending on advertising. Master relationship-based selling and organic lead generation.', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg', 'merchant', false, true, 360, 'intermediate'),
  ('facebook-monetization-local', 'Facebook Monetization for Local Businesses™', 'Turn your Facebook presence into recurring revenue', 'Monetize your local Facebook following. Learn community building, engagement strategies, and conversion tactics that work.', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg', 'merchant', false, true, 420, 'intermediate'),
  ('blog-growth-merchant', 'Blog Growth System™', 'Turn your blog into a customer-getting machine', 'Complete blog strategy for local businesses. Learn content creation, SEO, and conversion optimization to attract ideal customers.', 'https://images.pexels.com/photos/34600/pexels-photo.jpg', 'merchant', false, true, 600, 'intermediate'),
  ('automation-ai-local', 'Automation & AI for Local Business™', 'Automate operations and leverage AI tools', 'Implement automation and AI in your local business. Streamline operations, reduce costs, and scale efficiently.', 'https://images.pexels.com/photos/8438954/pexels-photo-8438954.jpeg', 'merchant', false, true, 480, 'advanced'),
  ('customer-reactivation', 'Customer Reactivation Mastery™', 'Bring back inactive customers profitably', 'Win back lost customers with proven reactivation campaigns. Turn dormant contacts into active buyers.', 'https://images.pexels.com/photos/3182765/pexels-photo-3182765.jpeg', 'merchant', false, true, 240, 'intermediate'),
  ('financial-basics-small-business', 'Financial Basics for Small Business™', 'Master cashflow, pricing, and profitability', 'Essential financial management for business owners. Understand your numbers and make profitable decisions.', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg', 'merchant', false, true, 300, 'beginner'),
  ('hiring-outsourcing-local', 'Hiring & Outsourcing for Local Business™', 'Build your team without breaking the bank', 'Strategic hiring and outsourcing for growth. Find, train, and retain great team members.', 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg', 'merchant', false, true, 360, 'intermediate'),
  ('lead-conversion-local', 'Lead Conversion Mastery™', 'Turn more leads into paying customers', 'Optimize your conversion process. Follow-up systems, sales scripts, and closing techniques that work.', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg', 'merchant', false, true, 300, 'intermediate'),
  ('local-advertising-mastery', 'Local Advertising Mastery™', 'Cost-effective ads that actually convert', 'Master local advertising across platforms. Facebook, Google, and more—get ROI from every dollar spent.', 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg', 'merchant', false, true, 480, 'advanced'),
  ('local-seo-foundations', 'Local SEO Foundations™', 'Get found when customers search', 'Dominate local search results. Google My Business optimization, local citations, and ranking strategies.', 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg', 'merchant', false, true, 420, 'intermediate'),
  ('local-visibility-booster', 'Local Visibility Booster™', 'Get seen by more local customers', 'Increase your local market visibility. Multi-channel strategies to ensure you''re found everywhere customers look.', 'https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg', 'merchant', false, true, 360, 'beginner'),
  ('marketplace-mastery-merchant', 'Marketplace Mastery™', 'Maximize sales in local marketplaces', 'Dominate Local-Link and other local marketplaces. Listing optimization, deal creation, and customer engagement.', 'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg', 'merchant', false, true, 300, 'beginner'),
  ('pricing-profitability', 'Pricing & Profitability™', 'Price your services for maximum profit', 'Strategic pricing that increases profit without losing customers. Value-based pricing and packaging strategies.', 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg', 'merchant', false, true, 240, 'intermediate'),
  ('review-growth-protection', 'Review Growth & Protection™', 'Build and protect your online reputation', 'Systematic review collection and reputation management. Handle negative reviews and amplify positive feedback.', 'https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg', 'merchant', false, true, 300, 'intermediate'),
  ('scaling-local-business', 'Scaling Your Local Business™', 'Grow beyond $1M in revenue', 'Advanced strategies for scaling local service businesses. Systems, processes, and leadership for sustainable growth.', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg', 'merchant', false, true, 720, 'advanced'),
  ('social-media-local', 'Social Media for Local Business™', 'Social content that brings in customers', 'Social media strategy that converts followers into customers. Content calendars, engagement tactics, and local targeting.', 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg', 'merchant', false, true, 360, 'intermediate')
ON CONFLICT (slug) DO NOTHING;
