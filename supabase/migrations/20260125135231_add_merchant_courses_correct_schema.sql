/*
  # Add Complete Merchant Course Catalog
  
  1. New Courses (13 additional merchant courses)
    - Local SEO Foundations for Merchants
    - Local Visibility Booster Program™
    - Customer Reactivation Program™
    - Review Growth & Protection Program™
    - Lead Conversion for Local Businesses
    - Local Advertising Mastery
    - Social Media for Local Businesses
    - Hiring & Outsourcing Through Local-Link
    - Automation & AI for Local Businesses
    - Small Business Financial Basics
    - Pricing & Profitability
    - Scaling Your Local Business
    - Local-Link Marketplace Mastery
*/

-- Course 2: Local SEO Foundations
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'local-seo-foundations',
  'Local SEO Foundations for Merchants',
  'Master Google rankings and local search visibility',
  'Learn how Google ranks local businesses, optimize your Google Business Profile, master local citations, and understand on-page SEO basics that every merchant needs to know.',
  'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 3: Local Visibility Booster
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'local-visibility-booster',
  'Local Visibility Booster Program™',
  'Dominate local maps, directories & search results',
  'Discover where local customers actually find businesses and learn simple weekly visibility routines to dominate local maps and directories through visibility stacking.',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 4: Customer Reactivation
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'customer-reactivation',
  'Customer Reactivation Program™',
  'Bring back old customers and unlock hidden revenue',
  'Fast ROI course teaching email & SMS reactivation strategies, review requests, repeat business systems, and turning past customers into referral sources.',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 5: Review Growth & Protection
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'review-growth-protection',
  'Review Growth & Protection Program™',
  'Build trust with automated review generation',
  'Essential trust-building education covering automated review requests, protection against bad reviews, and review response frameworks that build credibility.',
  'https://images.pexels.com/photos/5475754/pexels-photo-5475754.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 6: Lead Conversion
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'lead-conversion-local',
  'Lead Conversion for Local Businesses',
  'Turn inquiries into booked jobs and revenue',
  'Master messaging & follow-up systems for phone, text, and email. Learn how to reduce price shoppers and complement your ads, SEO, and blog efforts.',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 7: Local Advertising Mastery
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'local-advertising-mastery',
  'Local Advertising Mastery (Print + Digital)',
  'Master print and digital advertising that converts',
  'Learn how postcard ads work, when print beats digital, messaging that converts in local ads, and how to evaluate ad ROI to support your marketing strategy.',
  'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 8: Social Media
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'social-media-local',
  'Social Media for Local Businesses (Simple Systems)',
  'Non-overwhelming social strategy that works',
  'Learn what to post (and what not to), repurpose blogs into social content, implement weekly content systems, and avoid time-wasting trends.',
  'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 9: Hiring & Outsourcing
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'hiring-outsourcing-local',
  'Hiring & Outsourcing Through Local-Link',
  'Build your team without the headaches',
  'Reduce churn and service complaints by learning when to outsource vs DIY, how to hire partners inside Local-Link, and how to manage vendors correctly.',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 10: Automation & AI
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'automation-ai-local',
  'Automation & AI for Local Businesses',
  'Strategic AI education for cost-saving automation',
  'Non-technical course teaching where AI helps and where it does not, AI for content and customer follow-up, cost-saving automations, and ethical AI usage.',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 11: Financial Basics
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'financial-basics-small-business',
  'Small Business Financial Basics',
  'Master cash flow, budgeting & marketing ROI',
  'Great pairing with My Budget Buster. Learn cash flow basics, budgeting for marketing, understanding ROI, and avoiding common financial mistakes.',
  'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 12: Pricing & Profitability
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'pricing-profitability',
  'Pricing & Profitability for Local Businesses',
  'Price profitably without racing to the bottom',
  'High-impact operational course teaching how to price services profitably, communicate value, and increase average job value without discounting.',
  'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 13: Scaling
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'scaling-local-business',
  'Scaling Your Local Business with Systems',
  'Move from owner-operator to systematic business',
  'Advanced course for operators ready to scale. Learn delegation & SOPs, managing growth without burnout, and long-term exit thinking.',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Course 14: Marketplace Mastery
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'marketplace-mastery-merchant',
  'Local-Link Marketplace Mastery (Merchant Edition)',
  'Maximize ROI from the Local-Link ecosystem',
  'Platform retention course teaching how to use every Local-Link tool, get maximum visibility inside the platform, and understand partner services.',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;
