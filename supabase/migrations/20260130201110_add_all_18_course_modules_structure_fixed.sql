/*
  # Add Complete Module Structure for All 18 Merchant Courses

  1. Module Organization
    - Creates 5-10 modules per course based on content depth
    - Follows standard course structure template
    - Numbered modules for clear progression
    
  2. Course Coverage
    - All 18 merchant webinar courses
    - Module titles designed for logical learning flow
    - Proper indexing for course progression
    
  3. Module Counts by Course
    - Standard courses: 6-8 modules
    - Advanced courses: 8 modules
    - Platform training: 4 modules (3 for laundry)
    - Shorter courses: 5-6 modules
*/

-- Get course IDs for module creation
DO $$
DECLARE
  v_course_id uuid;
BEGIN

-- 1. Local Customers on Autopilot™ (Module 1 already exists, add Modules 2-8)
SELECT id INTO v_course_id FROM courses WHERE slug = 'local-customers-on-autopilot-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Building Your Local Visibility Foundation', 'Setting up your digital presence to be found by local customers searching for your services', 2),
    (v_course_id, 'The Review Generation System', 'Creating automated systems to collect authentic reviews from happy customers', 3),
    (v_course_id, 'Content That Attracts Local Customers', 'Developing content strategies that position you as the local expert', 4),
    (v_course_id, 'Referral Systems That Run Themselves', 'Building automated referral programs that turn customers into ambassadors', 5),
    (v_course_id, 'Local SEO Without the Confusion', 'Simple, effective local SEO tactics that bring customers to your door', 6),
    (v_course_id, 'Building Your Email & SMS Engine', 'Creating automated communication systems that nurture and convert leads', 7),
    (v_course_id, 'Scaling Your Autopilot System', 'Advanced automation and optimization to multiply your results', 8)
  ON CONFLICT DO NOTHING;
END IF;

-- 2. Online Sales Without Ads™
SELECT id INTO v_course_id FROM courses WHERE slug = 'online-sales-without-ads-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why Cold Outreach Fails & What Works Instead', 'Understanding relationship-based selling vs traditional sales tactics', 1),
    (v_course_id, 'Building Your Warm Audience Foundation', 'Creating content and presence that attracts ready-to-buy customers', 2),
    (v_course_id, 'The Consultative Sales Framework', 'Moving from pushy sales to trusted advisor conversations', 3),
    (v_course_id, 'Creating Your Value Ladder', 'Designing service packages that naturally lead to higher-ticket sales', 4),
    (v_course_id, 'Follow-Up Systems That Convert', 'Building automated follow-up sequences that close more deals', 5),
    (v_course_id, 'Handling Objections & Closing Naturally', 'Overcoming common objections and closing with confidence', 6),
    (v_course_id, 'Scaling Your Sales System', 'Training teams and systemizing your sales process for growth', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 3. Reviews That Bring Customers In™
SELECT id INTO v_course_id FROM courses WHERE slug = 'reviews-that-bring-customers-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why Reviews Are Your #1 Marketing Asset', 'Understanding how reviews impact local search, trust, and conversions', 1),
    (v_course_id, 'Setting Up Your Review Collection System', 'Building automated review requests using Local-Link CRM', 2),
    (v_course_id, 'The Perfect Review Request Strategy', 'Timing, messaging, and channels that maximize review generation', 3),
    (v_course_id, 'Responding to Reviews Strategically', 'How to respond to positive and negative reviews to build trust', 4),
    (v_course_id, 'Leveraging Reviews in Your Marketing', 'Using reviews across all channels to increase conversions', 5),
    (v_course_id, 'Reputation Management & Monitoring', 'Protecting and enhancing your online reputation continuously', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 4. AI Receptionist & Missed Call Recovery™
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-receptionist-missed-call-recovery-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Cost of Missed Opportunities', 'Calculating the revenue you lose from missed calls and slow responses', 1),
    (v_course_id, 'AI Call Capture Fundamentals', 'How AI receptionists work and why they outperform human-only systems', 2),
    (v_course_id, 'Setting Up Your AI Receptionist', 'Implementing AI call handling with Local-Link VAPI integration', 3),
    (v_course_id, 'Automated Booking & Scheduling', 'Letting AI book appointments directly into your calendar', 4),
    (v_course_id, 'Missed Call Recovery Systems', 'Automatically following up with every missed opportunity', 5),
    (v_course_id, 'Optimizing AI Performance & Scripts', 'Fine-tuning your AI responses for maximum conversions', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 5. Selling Local Services Without Cold Calling™
SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-local-services-without-cold-calling-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why Cold Calling Is Dead for Local Services', 'Understanding modern buying behaviors and trust-based selling', 1),
    (v_course_id, 'Building Your Warm Lead Engine', 'Creating systems that attract interested prospects to you', 2),
    (v_course_id, 'Referral-Based Growth Strategies', 'Turning every customer into a referral source', 3),
    (v_course_id, 'Partner & Network Development', 'Building strategic partnerships that send you qualified leads', 4),
    (v_course_id, 'The Warm Outreach Formula', 'Reaching out to connections without being pushy or salesy', 5),
    (v_course_id, 'Content Marketing for Service Businesses', 'Using content to position yourself as the obvious choice', 6),
    (v_course_id, 'Scaling Without Cold Calling', 'Building predictable lead flow through relationship systems', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 6. Using Canva to Increase Sales™
SELECT id INTO v_course_id FROM courses WHERE slug = 'using-canva-increase-sales-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Canva Fundamentals for Business Owners', 'Getting started with Canva and understanding design basics', 1),
    (v_course_id, 'Creating High-Converting Marketing Materials', 'Designing flyers, postcards, and print materials that sell', 2),
    (v_course_id, 'Social Media Graphics That Stop Scrolling', 'Creating eye-catching social posts that drive engagement', 3),
    (v_course_id, 'Professional Presentations & Proposals', 'Building sales materials that close more deals', 4),
    (v_course_id, 'Email & Digital Marketing Assets', 'Designing email headers, banners, and digital campaigns', 5),
    (v_course_id, 'Brand Consistency & Templates', 'Creating your brand kit and reusable template library', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 7. UGC for Business Growth™
SELECT id INTO v_course_id FROM courses WHERE slug = 'ugc-business-growth-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why User-Generated Content Outperforms Everything', 'Understanding the power and authenticity of UGC', 1),
    (v_course_id, 'Building Your UGC Strategy', 'Creating a content plan focused on authentic customer stories', 2),
    (v_course_id, 'Capturing Great UGC Content', 'Simple filming techniques for creating professional-looking videos', 3),
    (v_course_id, 'Encouraging Customers to Create Content', 'Systems for getting customers to share their experiences', 4),
    (v_course_id, 'Editing & Repurposing UGC', 'Turning raw footage into polished marketing content', 5),
    (v_course_id, 'Distributing UGC Across Channels', 'Maximizing the impact of your user-generated content', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 8. AI Marketing for Small Business™
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-marketing-small-business-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'AI Marketing Fundamentals', 'Understanding how AI can transform your marketing efforts', 1),
    (v_course_id, 'AI Email Marketing That Converts', 'Using AI to write and optimize email campaigns', 2),
    (v_course_id, 'AI Social Media Content Creation', 'Generating engaging social posts with AI assistance', 3),
    (v_course_id, 'AI Ad Copy & Campaign Optimization', 'Writing better ads and improving campaign performance with AI', 4),
    (v_course_id, 'AI Customer Segmentation & Personalization', 'Using AI to deliver personalized marketing messages', 5),
    (v_course_id, 'AI Content Calendar & Planning', 'Leveraging AI for strategic content planning', 6),
    (v_course_id, 'Measuring AI Marketing ROI', 'Tracking results and optimizing your AI marketing systems', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 9. AI Review & Reputation Management™
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-review-reputation-management-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The AI Reputation Revolution', 'How AI is transforming reputation management', 1),
    (v_course_id, 'AI-Powered Review Monitoring', 'Setting up automated review tracking across all platforms', 2),
    (v_course_id, 'AI Review Response Systems', 'Using AI to craft personalized, brand-aligned responses', 3),
    (v_course_id, 'Sentiment Analysis & Insights', 'Understanding customer feedback patterns with AI', 4),
    (v_course_id, 'AI Crisis Management', 'Using AI to detect and respond to reputation threats quickly', 5),
    (v_course_id, 'Reputation Enhancement Automation', 'Building systems that continuously improve your reputation', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 10. Marketing for Trades™ (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'marketing-for-trades-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Trades Marketing Landscape', 'Understanding unique challenges and opportunities for trade businesses', 1),
    (v_course_id, 'Local SEO for Trades', 'Getting found when locals search for plumbing, HVAC, electrical services', 2),
    (v_course_id, 'Service Area Marketing', 'Dominating your service area with location-based marketing', 3),
    (v_course_id, 'Emergency Service Marketing', 'Capturing high-value emergency calls and after-hours leads', 4),
    (v_course_id, 'Maintenance Agreement Programs', 'Building recurring revenue with maintenance memberships', 5),
    (v_course_id, 'Trades-Specific Local-Link Features', 'Leveraging Local-Link CRM tools built for trade businesses', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 11. Pet Businesses That Get Found First™ (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'pet-businesses-found-first-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Pet Business Marketing Ecosystem', 'Understanding the unique pet business marketplace', 1),
    (v_course_id, 'Local Pet Owner Targeting', 'Reaching pet owners actively looking for your services', 2),
    (v_course_id, 'Pet Business Review Strategies', 'Generating reviews that attract more pet parents', 3),
    (v_course_id, 'Social Media for Pet Businesses', 'Creating shareable pet content that drives bookings', 4),
    (v_course_id, 'Building Pet Service Packages', 'Bundling services to increase customer value', 5),
    (v_course_id, 'Local Paws Passport Platform', 'Using the pet business platform to grow faster', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 12. Care Coordination for Families™ (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'care-coordination-families-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Care Services Marketing Fundamentals', 'HIPAA-compliant marketing for home and senior care', 1),
    (v_course_id, 'Building Trust with Families', 'Creating content and messaging that earns family confidence', 2),
    (v_course_id, 'Referral Partnerships in Care', 'Building relationships with healthcare providers and facilities', 3),
    (v_course_id, 'Care Service Differentiation', 'Standing out in a competitive care services market', 4),
    (v_course_id, 'CareCompanion HQ Platform Training', 'Leveraging the care coordination platform effectively', 5)
  ON CONFLICT DO NOTHING;
END IF;

-- 13. Local Paws Passport™ Platform Training (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'local-paws-passport-platform-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Platform Overview & Setup', 'Getting started with Local Paws Passport features', 1),
    (v_course_id, 'Customer Management Tools', 'Managing pet profiles, appointments, and communications', 2),
    (v_course_id, 'Marketing & Growth Features', 'Using built-in marketing tools to attract more pet parents', 3),
    (v_course_id, 'Reporting & Analytics', 'Understanding your business metrics and growth opportunities', 4)
  ON CONFLICT DO NOTHING;
END IF;

-- 14. Gemini Site Solutions™ Platform Training (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'gemini-site-solutions-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Platform Introduction & Configuration', 'Setting up your Gemini Site Solutions account', 1),
    (v_course_id, 'Property & Service Management', 'Managing listings, services, and customer interactions', 2),
    (v_course_id, 'Marketing Automation Features', 'Leveraging automated marketing tools for growth', 3),
    (v_course_id, 'Performance Tracking & Optimization', 'Using analytics to improve business results', 4)
  ON CONFLICT DO NOTHING;
END IF;

-- 15. CareCompanion HQ™ Platform Training (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'carecompanion-hq-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'CareCompanion HQ Setup & Overview', 'Getting started with the care coordination platform', 1),
    (v_course_id, 'Care Scheduling & Coordination', 'Managing care schedules, staff, and family communications', 2),
    (v_course_id, 'Compliance & Documentation', 'Maintaining HIPAA-compliant records and communications', 3),
    (v_course_id, 'Growth & Marketing Tools', 'Using platform features to attract more families', 4)
  ON CONFLICT DO NOTHING;
END IF;

-- 16. Fresh & Clean Laundry SaaS™ Platform Training (FREE)
SELECT id INTO v_course_id FROM courses WHERE slug = 'fresh-clean-laundry-saas-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Platform Setup & Configuration', 'Getting your laundry operation set up in the system', 1),
    (v_course_id, 'Operations & Order Management', 'Managing orders, routes, and customer communications', 2),
    (v_course_id, 'Customer Growth Features', 'Using built-in marketing to attract and retain customers', 3)
  ON CONFLICT DO NOTHING;
END IF;

-- 17. How to Bundle Services for $1,000+ Deals™
SELECT id INTO v_course_id FROM courses WHERE slug = 'bundle-services-thousand-dollar-deals-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Psychology of Bundle Pricing', 'Why customers buy bundles and how to price them effectively', 1),
    (v_course_id, 'Identifying Your Service Stack', 'Finding complementary services that create irresistible packages', 2),
    (v_course_id, 'Creating High-Value Bundles', 'Structuring packages that deliver value while maximizing profit', 3),
    (v_course_id, 'Pricing & Positioning Premium Packages', 'Setting prices that attract buyers while reflecting true value', 4),
    (v_course_id, 'Presenting & Selling Bundles', 'Sales presentations that make bundles the obvious choice', 5),
    (v_course_id, 'Upselling & Cross-Selling Systems', 'Moving customers from basic services to premium packages', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 18. AI Marketing & Automation™ (Advanced)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-marketing-automation-advanced-merchant';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Enterprise AI Marketing Architecture', 'Building sophisticated AI-powered marketing systems', 1),
    (v_course_id, 'Advanced Customer Segmentation with AI', 'Using machine learning for predictive customer insights', 2),
    (v_course_id, 'Multi-Channel AI Campaign Orchestration', 'Coordinating AI-driven campaigns across all channels', 3),
    (v_course_id, 'AI-Powered Marketing Analytics', 'Deep analytics and attribution with AI assistance', 4),
    (v_course_id, 'Custom AI Model Training', 'Training AI on your business data for competitive advantage', 5),
    (v_course_id, 'AI Integration & API Management', 'Connecting AI tools with your existing tech stack', 6),
    (v_course_id, 'Team Training & AI Adoption', 'Building an AI-first marketing culture', 7),
    (v_course_id, 'Advanced Automation Workflows', 'Creating complex, multi-step automated marketing systems', 8)
  ON CONFLICT DO NOTHING;
END IF;

END $$;