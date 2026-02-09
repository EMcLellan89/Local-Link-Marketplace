/*
  # Create Complete Partner Academy - All 19 Courses

  1. Course Creation
    - All 19 partner courses across 5 categories
    - Target audience: 'partner' or 'both'
    - All courses FREE with active partner subscription
    
  2. Pricing Structure
    - Partner courses: FREE (price_usd = 0)
    - Access controlled by active partner subscription
    - No marketplace products needed (subscription-gated)
    
  3. Course Categories
    - Core Partner Systems (5 courses)
    - Sales & Commission Skills (4 courses)
    - Content & Digital Income (5 courses)
    - Industry-Specific Selling (3 courses)
    - Certification/Enablement (2 courses)
*/

-- CATEGORY 1: CORE PARTNER SYSTEMS

-- 1. Local-Link Partner Accelerator™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published, created_at)
VALUES (
  'partner-accelerator',
  'Local-Link Partner Accelerator™',
  'Master the Partner Ecosystem & Build Recurring Income',
  'Complete partner onboarding and ecosystem training. Learn how the Local-Link partner program works, how to earn recurring commissions, territory management, compliance requirements, and scaling strategies. FREE for active partners—your roadmap to 6-figure partnership income.',
  'partner',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- 2. Selling Recurring Revenue™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'selling-recurring-revenue-partner',
  'Selling Recurring Revenue™',
  'Build Long-Term Income with Memberships, SaaS & Retainers',
  'Master the art of selling subscription-based services to local businesses. Learn how to position recurring revenue offers, overcome objections to monthly fees, demonstrate ongoing value, and build a portfolio of clients paying you every month. Includes scripts for selling CRM subscriptions, retainers, and membership programs. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 3. Online Sales Without Ads™ (Partner Version)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'online-sales-without-ads-partner',
  'Online Sales Without Ads™ (Partner Edition)',
  'Sell Services Through Relationships, Not Advertising',
  'Partner-specific version teaching how to sell Local-Link services without paid advertising. Build warm audiences, leverage referrals, create content that attracts merchants, and use relationship-based selling. Includes outreach scripts, positioning strategies, and proven sales sequences. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Start a Local Service Side Hustle™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'local-service-side-hustle-partner',
  'Start a Local Service Side Hustle™',
  'Launch Small Service Businesses with DFY Fulfillment',
  'Learn how to start service-based side businesses (reviews management, social media, content creation) and use Local-Link DFY fulfillment to deliver without doing the work yourself. Includes business models, pricing strategies, client acquisition, and scaling. Perfect for partners building additional income streams. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 5. Marketplace Deal Selling Playbook
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'marketplace-deal-selling-partner',
  'Marketplace Deal Selling Playbook',
  'Place Deals in the Marketplace & Earn on Every Sale',
  'Complete guide to creating and selling deals through the Local-Link marketplace. Learn compliance requirements, pricing strategies, deal positioning, how to write compelling offers, and how to maximize commissions. Includes templates and approval checklists. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- CATEGORY 2: SALES & COMMISSION SKILLS

-- 6. Local Customers on Autopilot™ (Partner Version)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'local-customers-autopilot-partner',
  'Local Customers on Autopilot™ (Partner Edition)',
  'Sell the Complete Autopilot System to Merchants',
  'Partner sales training for the Local Customers on Autopilot system. Learn how to explain the value simply, position it against alternatives, handle objections, demo the system, and close deals. Includes merchant-facing presentations, ROI calculators, and sales scripts. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 7. Selling Local Services Without Cold Calling™ (Partner)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'selling-services-no-cold-calling-partner',
  'Selling Local Services Without Cold Calling™ (Partner)',
  'Partner Sales Scripts & Objection Handling',
  'Complete sales methodology for partners selling Local-Link services. Includes proven scripts, objection handling frameworks, pricing presentations, and closing techniques. Learn to sell consultatively, not pushy. Build trust, demonstrate value, and close deals naturally. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 8. How to Bundle Services for $1,000+ Sales™ (Partner)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'bundle-services-partner',
  'How to Bundle Services for $1,000+ Sales™ (Partner)',
  'Package DFY Offers Into High-Value Bundles',
  'Learn how to package multiple Local-Link services into irresistible bundles that merchants gladly pay $1,000+ for. Includes bundle templates, pricing strategies, presentation methods, and upsell frameworks. Turn small sales into major revenue. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 9. How to Sell CRMs to Trades™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'sell-crm-trades-partner',
  'How to Sell CRMs to Trades™',
  'Selling CRM Access + Services to Trade Businesses',
  'Specialized training for selling to trades (plumbing, HVAC, electrical, etc.). Learn trade-specific pain points, industry language, ROI demonstrations, and positioning strategies. Includes vertical-specific scripts and objection handling. Trade businesses are high-value clients—learn to speak their language. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- CATEGORY 3: CONTENT & DIGITAL INCOME

-- 10. UGC From Home™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ugc-from-home-partner',
  'UGC From Home™',
  'Create Content for Merchants & Earn Per Job',
  'Learn how to create User-Generated Content for local businesses from home. Includes filming techniques, equipment setup, scripting, editing basics, and how to find paid work. Partners can earn per-job fees plus recurring commissions. Access the UGC job board after certification. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 11. Make Money with Canva™ (Partner Version)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'canva-money-partner',
  'Make Money with Canva™ (Partner Edition)',
  'Monetizable Design Skills for Client Work',
  'Learn Canva design skills you can sell to local businesses. Create marketing materials, social graphics, presentations, and print assets. Includes pricing strategies, client management, and how to bundle design services. Turn design skills into recurring income. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 12. AI Marketing & Automation™ (Partner Fulfillment)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-automation-partner',
  'AI Marketing & Automation™ (Partner Edition)',
  'Do AI Work FOR Merchants - Fulfillment & Pricing',
  'Learn how to deliver AI marketing services for merchant clients. Includes AI tools training, service fulfillment workflows, quality standards, pricing structures, and client communication. Sell high-value AI services with Local-Link DFY support. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 13. AI Marketing for Small Business™ (Partner Sales)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-small-business-partner',
  'AI Marketing for Small Business™ (Partner Edition)',
  'Selling AI Services with Ongoing Retainers',
  'Partner sales training for AI marketing services. Learn how to position AI solutions, demonstrate ROI, overcome technology objections, and structure ongoing retainer agreements. AI services command premium pricing—learn to sell them confidently. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 14. AI Review & Reputation Management™ (Partner)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-review-reputation-partner',
  'AI Review & Reputation Management™ (Partner)',
  'Manage Reviews for Clients - Monthly Service Model',
  'Learn to deliver review management services using Local-Link AI tools. Includes review monitoring, response strategies, reputation crisis management, and monthly reporting. Structure this as a recurring monthly service. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- CATEGORY 4: INDUSTRY-SPECIFIC SELLING

-- 15. Marketing for Trades™ (Partner Sales)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'marketing-for-trades-partner',
  'Marketing for Trades™ (Partner Edition)',
  'Who to Sell To & Why Trades Need It',
  'Partner sales guide for the trades vertical (plumbing, HVAC, electrical, roofing, etc.). Learn why trades are ideal customers, their unique pain points, buying cycles, seasonal opportunities, and how to become the go-to provider for trade businesses in your area. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 16. Pet Businesses That Get Found First™ (Partner)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'pet-businesses-partner',
  'Pet Businesses That Get Found First™ (Partner)',
  'Pet Industry Sales Angles & Platform Positioning',
  'Partner guide to selling in the pet industry vertical. Learn the Local Paws Passport positioning, pet business pain points, emotional buying triggers, and how to build a portfolio of pet service clients. Pet industry is growing—capture this market. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 17. Care Coordination for Families™ (Partner)
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'care-coordination-partner',
  'Care Coordination for Families™ (Partner)',
  'Selling Awareness Programs - Compliance-Safe Messaging',
  'Partner training for the senior care and home care vertical. Learn HIPAA-compliant marketing, how to position CareCompanion HQ, building referral relationships with healthcare providers, and messaging that respects regulations while driving results. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- CATEGORY 5: CERTIFICATION / ENABLEMENT

-- 18. UGC Creator Certification
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ugc-creator-certification',
  'UGC Creator Certification',
  'Quality Standards & Job Board Eligibility',
  'Official certification program for UGC creators. Learn quality standards, production requirements, client communication, job completion workflows, and platform policies. Pass the certification exam to access the UGC job board and receive priority assignments. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 19. Local-Link Certified Associate
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'local-link-certified-associate',
  'Local-Link Certified Associate',
  'Platform Mastery & Trust Badge',
  'Comprehensive platform certification covering all Local-Link features, tools, and best practices. Earn your Certified Associate badge to display on your profile and marketing materials. Demonstrates expertise to merchants and increases close rates. FREE for partners.',
  'partner',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Add pricing records (all FREE for partners)
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'subscription'
FROM courses
WHERE slug IN (
  'partner-accelerator',
  'selling-recurring-revenue-partner',
  'online-sales-without-ads-partner',
  'local-service-side-hustle-partner',
  'marketplace-deal-selling-partner',
  'local-customers-autopilot-partner',
  'selling-services-no-cold-calling-partner',
  'bundle-services-partner',
  'sell-crm-trades-partner',
  'ugc-from-home-partner',
  'canva-money-partner',
  'ai-marketing-automation-partner',
  'ai-marketing-small-business-partner',
  'ai-review-reputation-partner',
  'marketing-for-trades-partner',
  'pet-businesses-partner',
  'care-coordination-partner',
  'ugc-creator-certification',
  'local-link-certified-associate'
)
ON CONFLICT (course_id) DO UPDATE SET
  price_usd = 0,
  is_free = true,
  payment_type = 'subscription';

-- Add webinar metadata for all partner courses
INSERT INTO course_webinar_content (
  course_id,
  webinar_format,
  total_duration_minutes,
  includes_workbook,
  includes_templates,
  certification_available
)
SELECT 
  id,
  'recorded',
  CASE 
    WHEN slug IN ('ugc-creator-certification', 'local-link-certified-associate') THEN 120
    WHEN slug IN ('partner-accelerator', 'selling-recurring-revenue-partner') THEN 240
    ELSE 180
  END,
  true,
  true,
  slug IN ('ugc-creator-certification', 'local-link-certified-associate')
FROM courses
WHERE slug IN (
  'partner-accelerator',
  'selling-recurring-revenue-partner',
  'online-sales-without-ads-partner',
  'local-service-side-hustle-partner',
  'marketplace-deal-selling-partner',
  'local-customers-autopilot-partner',
  'selling-services-no-cold-calling-partner',
  'bundle-services-partner',
  'sell-crm-trades-partner',
  'ugc-from-home-partner',
  'canva-money-partner',
  'ai-marketing-automation-partner',
  'ai-marketing-small-business-partner',
  'ai-review-reputation-partner',
  'marketing-for-trades-partner',
  'pet-businesses-partner',
  'care-coordination-partner',
  'ugc-creator-certification',
  'local-link-certified-associate'
)
ON CONFLICT (course_id) DO NOTHING;