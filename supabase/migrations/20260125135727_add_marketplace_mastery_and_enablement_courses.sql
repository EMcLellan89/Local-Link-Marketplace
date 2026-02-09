/*
  # Add Marketplace Mastery and Enablement Courses
  
  1. Courses
    - Local-Link Marketplace Mastery (FREE, Required)
    - Hiring & Managing Partners Inside Local-Link
    - How to Use a Virtual Assistant
    - Understanding Your Numbers Inside Local-Link
    - DIY vs Done-For-You Decision Course
    
  2. Purpose
    - Platform onboarding and retention
    - Service adoption
    - Partner success
    - DFY conversion
*/

-- 1. Local-Link Marketplace Mastery (FREE, REQUIRED)
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'marketplace-mastery-required',
  'Local-Link Marketplace Mastery',
  'Your complete guide to winning inside Local-Link',
  'FREE required course teaching merchants how to use every Local-Link feature, service, and partner relationship. Learn the platform, understand pricing, track results, and discover your growth path. Required before hiring partners or purchasing DFY services.',
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Hiring & Managing Partners
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'hiring-managing-partners',
  'Hiring & Managing Partners Inside Local-Link',
  'Get the most value from Local-Link partner relationships',
  'Learn how to successfully work with Local-Link partners. Understand what partners do and do not do, how pricing works, how to set expectations, and how to manage deliverables to ensure successful outcomes every time.',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 3. How to Use a VA
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'how-to-use-va',
  'How to Use a Virtual Assistant to Run Your Business',
  'Delegate effectively and scale with VA support',
  'Master the art of delegation with virtual assistants. Learn what tasks to delegate, how to communicate effectively, what ROI to expect, and how to scale your business by working with a trained Local-Link VA.',
  'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Understanding Your Numbers
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'understanding-your-numbers',
  'Understanding Your Numbers Inside Local-Link',
  'See ROI clearly and make data-driven decisions',
  'Learn to interpret your Local-Link analytics, understand CRM pipeline value, measure review impact, track lead flow, and recognize what success actually looks like in your dashboard. Data-driven decision making made simple.',
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 5. DIY vs Done-For-You
INSERT INTO courses (slug, title, subtitle, description, image_url, target_audience, is_published)
VALUES (
  'diy-vs-done-for-you',
  'DIY vs Done-For-You: Making Smart Decisions',
  'Know when to DIY and when to outsource',
  'Remove buying hesitation and make confident decisions about what to do yourself versus what to outsource. Learn time vs money trade-offs, what to outsource first, and what to keep in-house for your business stage.',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
  'merchant',
  true
) ON CONFLICT (slug) DO NOTHING;
