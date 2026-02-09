/*
  # Complete Merchant Academy - All 18 Courses
  
  Creates comprehensive course catalog with:
  - 6 Core Business Growth courses (PAID)
  - 3 Content & Visibility courses (PAID)
  - 3 Industry-Specific courses (FREE)
  - 4 Platform/Ecosystem courses (FREE)
  - 2 Advanced courses (PAID)
  
  Total: 18 courses with proper pricing, metadata, and marketplace products
*/

-- First, remove courses we're recreating (except Local Customers on Autopilot which has content)
DELETE FROM course_pricing WHERE course_id IN (
  SELECT id FROM courses WHERE slug IN (
    'online-sales-without-ads-merchant',
    'reviews-that-bring-customers-merchant',
    'selling-local-services-without-cold-calling-merchant',
    'using-canva-to-increase-sales-merchant',
    'ugc-for-business-growth-merchant',
    'ai-marketing-for-small-business-merchant',
    'ai-review-reputation-management-merchant',
    'bundle-services-thousand-dollar-deals-merchant',
    'ai-marketing-automation-merchant'
  )
);

DELETE FROM courses WHERE slug IN (
  'online-sales-without-ads-merchant',
  'reviews-that-bring-customers-merchant',
  'selling-local-services-without-cold-calling-merchant',
  'using-canva-to-increase-sales-merchant',
  'ugc-for-business-growth-merchant',
  'ai-marketing-for-small-business-merchant',
  'ai-review-reputation-management-merchant',
  'bundle-services-thousand-dollar-deals-merchant',
  'ai-marketing-automation-merchant',
  'marketing-for-trades-merchant-free',
  'pet-businesses-found-first-merchant-free',
  'care-coordination-families-merchant-free'
);

-- CORE BUSINESS GROWTH (PAID) --

-- 2. Online Sales Without Ads™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'online-sales-without-ads-merchant',
  'Online Sales Without Ads™',
  'Generate Consistent Sales Through Relationships & Systems',
  'Master relationship-based selling for your own services. Learn how to generate consistent sales without cold calling or ad spend. Includes conversation frameworks, follow-up systems, and proven scripts that convert. DFY sales system setup available.',
  'merchant',
  true
);

-- 3. Reviews That Bring Customers In™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'reviews-that-bring-customers-merchant',
  'Reviews That Bring Customers In™',
  'Turn Reviews Into Your #1 Sales & Marketing Tool',
  'Learn how to generate, manage, and convert reviews using Local-Link CRM. Build automated review collection systems, respond strategically, and leverage reviews across all marketing. Includes review automation templates and response scripts. DFY review system available.',
  'merchant',
  true
);

-- 4. AI Receptionist & Missed Call Recovery™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-receptionist-missed-call-recovery-merchant',
  'AI Receptionist & Missed Call Recovery™',
  'Never Miss Another Customer Call',
  'Learn how to use AI to capture every missed call, automatically book appointments, and follow up with leads. Includes AI receptionist setup, call tracking, and automated booking systems. Integrates with Local-Link CRM. DFY AI receptionist setup available.',
  'merchant',
  true
);

-- 5. Selling Local Services Without Cold Calling™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'selling-local-services-without-cold-calling-merchant',
  'Selling Local Services Without Cold Calling™',
  'Close More Deals Without Outbound Pressure',
  'Learn proven scripts and workflows for your team to close deals without cold calling. Master warm outreach, referral systems, and consultative selling. Includes call scripts, email templates, and sales playbooks. DFY sales training available.',
  'merchant',
  true
);

-- 6. Using Canva to Increase Sales™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'using-canva-increase-sales-merchant',
  'Using Canva to Increase Sales™',
  'Create Professional Marketing Materials That Convert',
  'Master Canva for creating sales assets, flyers, social posts, and marketing materials. No design experience needed. Includes templates, design frameworks, and brand consistency systems. Pure business growth focus. DFY design services available.',
  'merchant',
  true
);

-- CONTENT & VISIBILITY (PAID) --

-- 7. UGC for Business Growth™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ugc-business-growth-merchant',
  'UGC for Business Growth™',
  'Create Compelling Content For Your Own Brand',
  'Learn how to create user-generated style content for your business. Master social proof, before/after content, and local authority building. Includes content frameworks, filming techniques, and distribution strategies. DFY content creation available.',
  'merchant',
  true
);

-- 8. AI Marketing for Small Business™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-small-business-merchant',
  'AI Marketing for Small Business™',
  'Use AI Safely & Effectively For Marketing',
  'Learn how to use AI for emails, posts, pages, and campaigns without tech overwhelm. Includes prompt templates, workflow automation, and quality control systems. Integrates with Local-Link tools. DFY AI marketing setup available.',
  'merchant',
  true
);

-- 9. AI Review & Reputation Management™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-review-reputation-management-merchant',
  'AI Review & Reputation Management™',
  'Monitor, Respond & Leverage Reviews With AI',
  'Master AI-powered review monitoring, intelligent response systems, and reputation leverage strategies. Turn your reputation into revenue. Includes AI response templates and monitoring dashboards. DFY reputation management available.',
  'merchant',
  true
);

-- INDUSTRY-SPECIFIC (FREE) --

-- 10. Marketing for Trades™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'marketing-for-trades-merchant',
  'Marketing for Trades™',
  'Proven Marketing For Plumbers, HVAC, Electricians & More',
  'Complete marketing system designed specifically for trade businesses. Learn how Local-Link tools integrate with your trade operations. Includes industry-specific templates and workflows. FREE for trade businesses.',
  'merchant',
  true
);

-- 11. Pet Businesses That Get Found First™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'pet-businesses-found-first-merchant',
  'Pet Businesses That Get Found First™',
  'Dominate Your Local Pet Services Market',
  'Complete visibility and growth strategy for groomers, vets, trainers, and pet stores. Includes Local Paws Passport integration and pet industry marketing tactics. FREE for pet businesses.',
  'merchant',
  true
);

-- 12. Care Coordination for Families™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'care-coordination-families-merchant',
  'Care Coordination for Families™',
  'Awareness-Based Marketing For Care Services',
  'Learn compliant, awareness-based positioning for home care, senior care, and family services. Non-medical focus with proven communication frameworks. FREE for care service providers.',
  'merchant',
  true
);

-- PLATFORM/ECOSYSTEM (FREE) --

-- 13. Local Paws Passport™ Platform Training
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'local-paws-passport-platform-merchant',
  'Local Paws Passport™ Platform Training',
  'Maximize Your Pet Business With Local Paws Passport',
  'Complete training on using Local Paws Passport to grow your pet business. Learn features, marketing integration, and customer engagement strategies. FREE platform training.',
  'merchant',
  true
);

-- 14. Gemini Site Solutions™ Overview
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'gemini-site-solutions-merchant',
  'Gemini Site Solutions™ Platform Training',
  'Property & Service Business Growth With Gemini',
  'Learn how Gemini Site Solutions enhances your property or service business. Complete platform overview and growth strategies. FREE platform training.',
  'merchant',
  true
);

-- 15. CareCompanion HQ™ Training
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'carecompanion-hq-merchant',
  'CareCompanion HQ™ Platform Training',
  'Community Awareness & Education Platform',
  'Education-focused training for care service providers. Learn compliant communication and community awareness strategies. FREE platform training.',
  'merchant',
  true
);

-- 16. Fresh & Clean Laundry SaaS™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'fresh-clean-laundry-saas-merchant',
  'Fresh & Clean Laundry SaaS™ Platform Training',
  'Optimize Your Laundry Operations',
  'Complete training on Fresh & Clean Laundry SaaS. Learn operational optimization and customer management. FREE platform training.',
  'merchant',
  true
);

-- ADVANCED (PAID) --

-- 17. How to Bundle Services for $1,000+ Deals™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'bundle-services-thousand-dollar-deals-merchant',
  'How to Bundle Services for $1,000+ Deals™',
  'Package Services For Maximum Value & Profit',
  'Master the art of packaging your services into high-value bundles. Increase deal size without finding new customers. Includes bundle frameworks, pricing strategies, and presentation templates. DFY bundle creation available.',
  'merchant',
  true
);

-- 18. AI Marketing & Automation™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-automation-advanced-merchant',
  'AI Marketing & Automation™ (Advanced)',
  'Enterprise-Level AI Marketing & Workflow Automation',
  'Advanced AI workflows and automation for internal operations. Master complex integrations, multi-step automations, and AI-powered business systems. Build systems that scale without adding staff. DFY enterprise automation available.',
  'merchant',
  true
);

-- Add pricing for all courses
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'online-sales-without-ads-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'reviews-that-bring-customers-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'ai-receptionist-missed-call-recovery-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'selling-local-services-without-cold-calling-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 67.00, false, 'one_time' FROM courses WHERE slug = 'using-canva-increase-sales-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 67.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 67.00, false, 'one_time' FROM courses WHERE slug = 'ugc-business-growth-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 67.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'ai-marketing-small-business-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'ai-review-reputation-management-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'bundle-services-thousand-dollar-deals-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 127.00, false, 'one_time' FROM courses WHERE slug = 'ai-marketing-automation-advanced-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 127.00;

-- Free courses
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'one_time' FROM courses WHERE slug IN (
  'marketing-for-trades-merchant',
  'pet-businesses-found-first-merchant',
  'care-coordination-families-merchant',
  'local-paws-passport-platform-merchant',
  'gemini-site-solutions-merchant',
  'carecompanion-hq-merchant',
  'fresh-clean-laundry-saas-merchant'
)
ON CONFLICT (course_id) DO UPDATE SET price_usd = 0, is_free = true;

-- Add webinar metadata for all courses
INSERT INTO course_webinar_content (course_id, webinar_format, total_duration_minutes, includes_workbook, certification_available)
SELECT id, 'recorded', 360, true, true FROM courses 
WHERE slug IN (
  'online-sales-without-ads-merchant',
  'reviews-that-bring-customers-merchant',
  'ai-receptionist-missed-call-recovery-merchant',
  'selling-local-services-without-cold-calling-merchant',
  'using-canva-increase-sales-merchant',
  'ugc-business-growth-merchant',
  'ai-marketing-small-business-merchant',
  'ai-review-reputation-management-merchant',
  'bundle-services-thousand-dollar-deals-merchant',
  'ai-marketing-automation-advanced-merchant',
  'marketing-for-trades-merchant',
  'pet-businesses-found-first-merchant',
  'care-coordination-families-merchant'
)
ON CONFLICT (course_id) DO UPDATE 
SET total_duration_minutes = 360, includes_workbook = true, certification_available = true;

-- Platform courses (shorter, focused training)
INSERT INTO course_webinar_content (course_id, webinar_format, total_duration_minutes, includes_workbook, certification_available)
SELECT id, 'recorded', 120, true, false FROM courses 
WHERE slug IN (
  'local-paws-passport-platform-merchant',
  'gemini-site-solutions-merchant',
  'carecompanion-hq-merchant',
  'fresh-clean-laundry-saas-merchant'
)
ON CONFLICT (course_id) DO UPDATE 
SET total_duration_minutes = 120, includes_workbook = true, certification_available = false;

-- Create marketplace products for PAID courses
INSERT INTO marketplace_products (slug, name, description, product_type, is_active)
VALUES
  ('online-sales-without-ads-course', 'Online Sales Without Ads™', 'Generate consistent sales through relationships and systems. Complete course with scripts and frameworks.', 'course', true),
  ('reviews-bring-customers-course', 'Reviews That Bring Customers In™', 'Master review generation and leverage using Local-Link CRM. Includes automation templates.', 'course', true),
  ('ai-receptionist-course', 'AI Receptionist & Missed Call Recovery™', 'Never miss a customer call. Learn AI-powered call capture and booking automation.', 'course', true),
  ('selling-without-cold-calling-course', 'Selling Local Services Without Cold Calling™', 'Proven sales scripts and workflows. Close more deals without pressure tactics.', 'course', true),
  ('canva-for-sales-course', 'Using Canva to Increase Sales™', 'Create professional marketing materials. No design experience needed.', 'course', true),
  ('ugc-business-growth-course', 'UGC for Business Growth™', 'Create compelling content for your brand. Includes filming and distribution strategies.', 'course', true),
  ('ai-marketing-small-biz-course', 'AI Marketing for Small Business™', 'Use AI safely for emails, posts, and campaigns. Includes prompt templates.', 'course', true),
  ('ai-reputation-management-course', 'AI Review & Reputation Management™', 'AI-powered reputation monitoring and response systems.', 'course', true),
  ('bundle-services-course', 'How to Bundle Services for $1,000+ Deals™', 'Package services for maximum value. Includes pricing strategies and templates.', 'course', true),
  ('ai-automation-advanced-course', 'AI Marketing & Automation™ (Advanced)', 'Enterprise-level AI workflows and automation systems.', 'course', true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, is_active = EXCLUDED.is_active;

-- Link products to courses
INSERT INTO product_course_map (product_slug, course_slug)
VALUES
  ('online-sales-without-ads-course', 'online-sales-without-ads-merchant'),
  ('reviews-bring-customers-course', 'reviews-that-bring-customers-merchant'),
  ('ai-receptionist-course', 'ai-receptionist-missed-call-recovery-merchant'),
  ('selling-without-cold-calling-course', 'selling-local-services-without-cold-calling-merchant'),
  ('canva-for-sales-course', 'using-canva-increase-sales-merchant'),
  ('ugc-business-growth-course', 'ugc-business-growth-merchant'),
  ('ai-marketing-small-biz-course', 'ai-marketing-small-business-merchant'),
  ('ai-reputation-management-course', 'ai-review-reputation-management-merchant'),
  ('bundle-services-course', 'bundle-services-thousand-dollar-deals-merchant'),
  ('ai-automation-advanced-course', 'ai-marketing-automation-advanced-merchant')
ON CONFLICT DO NOTHING;
