/*
  # Partner Academy - Complete Module Structures for All 19 Courses

  1. Module Organization
    - 5-8 modules per course based on content complexity
    - Partner-focused: how to sell, fulfill, and earn
    - Certification courses: 4-5 modules with exam preparation
    
  2. Course Coverage
    - All 19 partner courses
    - Logical progression from fundamentals to advanced
*/

DO $$
DECLARE
  v_course_id uuid;
BEGIN

-- 1. Local-Link Partner Accelerator™ (8 modules - comprehensive onboarding)
SELECT id INTO v_course_id FROM courses WHERE slug = 'partner-accelerator';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Welcome to the Partner Ecosystem', 'Understanding how the Local-Link partner program works and your earning potential', 1),
    (v_course_id, 'Territory Management & Compliance', 'Managing your territory, compliance requirements, and program policies', 2),
    (v_course_id, 'Commission Structure & Payment Systems', 'How you earn, commission tiers, bonuses, and getting paid', 3),
    (v_course_id, 'The Local-Link Tech Stack', 'Mastering the platform tools you''ll use daily', 4),
    (v_course_id, 'Your First 30 Days Action Plan', 'Step-by-step roadmap to your first clients and commissions', 5),
    (v_course_id, 'Building Your Partner Brand', 'Positioning yourself as the local expert', 6),
    (v_course_id, 'Scaling to $10K/Month', 'Systems and strategies for consistent growth', 7),
    (v_course_id, 'Building Your Partner Team', 'When and how to add team members and scale operations', 8)
  ON CONFLICT DO NOTHING;
END IF;

-- 2. Selling Recurring Revenue™ (7 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-recurring-revenue-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Recurring Revenue Mindset', 'Why recurring revenue builds wealth and how to think about MRR', 1),
    (v_course_id, 'Positioning Subscription Offers', 'How to frame monthly services so merchants see the value', 2),
    (v_course_id, 'Overcoming Monthly Fee Objections', 'Handling "I don''t want to pay monthly" objections', 3),
    (v_course_id, 'Demonstrating Ongoing Value', 'Showing continuous ROI to reduce churn', 4),
    (v_course_id, 'Pricing Recurring Services', 'What to charge for subscriptions, retainers, and memberships', 5),
    (v_course_id, 'Selling CRM Subscriptions', 'Specific strategies for selling Local-Link CRM access', 6),
    (v_course_id, 'Building Your MRR Portfolio', 'Managing multiple subscription clients for stable income', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 3. Online Sales Without Ads™ (Partner) (7 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'online-sales-without-ads-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Building Your Warm Audience as a Partner', 'Creating content and presence that attracts merchants', 1),
    (v_course_id, 'Relationship-Based Outreach', 'Reaching out without being salesy or annoying', 2),
    (v_course_id, 'Leveraging Referrals & Word of Mouth', 'Turning clients into your sales team', 3),
    (v_course_id, 'Content Marketing for Partners', 'Using content to demonstrate expertise and attract leads', 4),
    (v_course_id, 'Social Selling Strategies', 'Using social media to build relationships and generate leads', 5),
    (v_course_id, 'Partnership & Networking', 'Building strategic relationships that send you clients', 6),
    (v_course_id, 'Scaling Without Ads', 'Building predictable lead flow through organic strategies', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 4. Start a Local Service Side Hustle™ (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'local-service-side-hustle-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Service Business Models for Partners', 'Types of services you can offer with DFY fulfillment', 1),
    (v_course_id, 'Pricing Your Services Profitably', 'What to charge and how to structure offers', 2),
    (v_course_id, 'Client Acquisition Strategies', 'Finding your first clients quickly', 3),
    (v_course_id, 'Using DFY Fulfillment', 'Delivering services without doing the work yourself', 4),
    (v_course_id, 'Managing Client Relationships', 'Communication, expectations, and retention', 5),
    (v_course_id, 'Scaling Your Side Hustle', 'From side income to full-time revenue', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 5. Marketplace Deal Selling Playbook (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'marketplace-deal-selling-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Marketplace Fundamentals', 'How the Local-Link marketplace works and commission structure', 1),
    (v_course_id, 'Creating Compelling Deals', 'Writing offers that convert and get approved', 2),
    (v_course_id, 'Compliance & Guidelines', 'Rules you must follow to avoid rejection', 3),
    (v_course_id, 'Pricing Strategy for Deals', 'What to charge to maximize sales and commissions', 4),
    (v_course_id, 'Deal Promotion & Marketing', 'Driving traffic to your marketplace listings', 5),
    (v_course_id, 'Maximizing Deal Commissions', 'Upsells, bundles, and optimization strategies', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 6. Local Customers on Autopilot™ (Partner) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'local-customers-autopilot-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Understanding the Autopilot System', 'What it does and why merchants need it', 1),
    (v_course_id, 'Explaining Value Simply', 'Making complex automation easy to understand', 2),
    (v_course_id, 'Positioning Against Alternatives', 'Competing with DIY and other solutions', 3),
    (v_course_id, 'Demonstrating the System', 'Live demos that close deals', 4),
    (v_course_id, 'Handling Common Objections', 'Overcoming "too expensive," "too complicated," etc.', 5),
    (v_course_id, 'Closing Autopilot Deals', 'Getting to yes and onboarding clients', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 7. Selling Local Services Without Cold Calling™ (Partner) (7 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-services-no-cold-calling-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Consultative Selling Fundamentals', 'The modern sales approach that wins', 1),
    (v_course_id, 'Discovery Questions That Qualify', 'Asking the right questions to uncover needs', 2),
    (v_course_id, 'Presenting Solutions Effectively', 'How to present so merchants want to buy', 3),
    (v_course_id, 'The Objection Handling Framework', 'Turning objections into opportunities', 4),
    (v_course_id, 'Pricing Presentations', 'Presenting pricing confidently without apologizing', 5),
    (v_course_id, 'Closing Techniques That Feel Natural', 'Getting to yes without pressure', 6),
    (v_course_id, 'Follow-Up Systems That Convert', 'Staying top of mind without being annoying', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 8. How to Bundle Services for $1,000+ Sales™ (Partner) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'bundle-services-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Psychology of Bundle Pricing', 'Why bundles sell better and command premium prices', 1),
    (v_course_id, 'Building High-Value Bundles', 'Packaging services into irresistible offers', 2),
    (v_course_id, 'Pricing Bundles for Profit', 'What to charge for package deals', 3),
    (v_course_id, 'Presenting Bundle Options', 'Good-better-best and tiered offerings', 4),
    (v_course_id, 'Upselling Into Bundles', 'Moving single service buyers to packages', 5),
    (v_course_id, 'Bundle Templates & Examples', 'Proven bundle configurations that sell', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 9. How to Sell CRMs to Trades™ (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'sell-crm-trades-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why Trades Need CRMs', 'Understanding trade business pain points', 1),
    (v_course_id, 'Speaking Trade Language', 'Industry terminology and communication styles', 2),
    (v_course_id, 'Trade-Specific ROI Demonstrations', 'Showing value in terms trades understand', 3),
    (v_course_id, 'Positioning Against Pen & Paper', 'Why digital beats their current system', 4),
    (v_course_id, 'Handling Trade Objections', 'Overcoming technology resistance', 5),
    (v_course_id, 'Selling Services + CRM Bundles', 'Packaging CRM with complementary services', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 10. UGC From Home™ (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ugc-from-home-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'UGC Fundamentals & Equipment', 'What UGC is and what you need to get started', 1),
    (v_course_id, 'Filming Techniques for Beginners', 'Creating professional-looking content at home', 2),
    (v_course_id, 'Scripting & Planning Content', 'Writing scripts that convert for merchants', 3),
    (v_course_id, 'Basic Editing Skills', 'Editing software and techniques', 4),
    (v_course_id, 'Finding UGC Work', 'Accessing the job board and landing assignments', 5),
    (v_course_id, 'Building Your UGC Portfolio', 'Creating samples and establishing your reputation', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 11. Make Money with Canva™ (Partner) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'canva-money-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Canva Mastery for Client Work', 'Advanced Canva skills merchants will pay for', 1),
    (v_course_id, 'Creating Marketing Materials', 'Flyers, postcards, and print assets', 2),
    (v_course_id, 'Social Media Graphics That Sell', 'Designing for engagement and conversions', 3),
    (v_course_id, 'Pricing Your Design Services', 'What to charge per project or retainer', 4),
    (v_course_id, 'Finding Design Clients', 'Where to find businesses that need design work', 5),
    (v_course_id, 'Building Design Service Packages', 'Recurring design retainers for steady income', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 12. AI Marketing & Automation™ (Partner Fulfillment) (7 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-marketing-automation-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'AI Tools for Partner Fulfillment', 'Which AI tools to use for client work', 1),
    (v_course_id, 'Delivering AI Email Marketing', 'Using AI to create campaigns for clients', 2),
    (v_course_id, 'AI Social Media Management', 'Managing client social media with AI', 3),
    (v_course_id, 'AI Content Creation Services', 'Blog posts, website copy, and more', 4),
    (v_course_id, 'Quality Control & Client Standards', 'Ensuring AI output meets expectations', 5),
    (v_course_id, 'Pricing AI Services', 'What to charge for AI-powered deliverables', 6),
    (v_course_id, 'Client Communication & Reporting', 'Keeping clients informed and happy', 7)
  ON CONFLICT DO NOTHING;
END IF;

-- 13. AI Marketing for Small Business™ (Partner Sales) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-marketing-small-business-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Positioning AI Solutions', 'Making AI sound valuable, not scary', 1),
    (v_course_id, 'Demonstrating AI ROI', 'Showing measurable results from AI marketing', 2),
    (v_course_id, 'Overcoming Technology Objections', 'Handling "AI isn''t ready" concerns', 3),
    (v_course_id, 'Structuring AI Retainers', 'Monthly packages for ongoing AI services', 4),
    (v_course_id, 'Selling AI Confidently', 'Positioning yourself as the AI expert', 5),
    (v_course_id, 'Closing AI Service Deals', 'Getting merchants to commit to AI services', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 14. AI Review & Reputation Management™ (Partner) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ai-review-reputation-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Review Management as a Service', 'Building a recurring review service offering', 1),
    (v_course_id, 'Setting Up Review Monitoring', 'Tools and systems for tracking reviews', 2),
    (v_course_id, 'Writing Review Responses', 'AI-assisted response strategies', 3),
    (v_course_id, 'Reputation Crisis Management', 'Handling negative review situations', 4),
    (v_course_id, 'Monthly Reporting to Clients', 'Showing value and maintaining contracts', 5),
    (v_course_id, 'Pricing Review Services', 'Monthly retainer structures for review management', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 15. Marketing for Trades™ (Partner Sales) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'marketing-for-trades-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Why Trades Are Ideal Clients', 'High LTV, low churn, strong ROI', 1),
    (v_course_id, 'Trade Business Pain Points', 'What keeps trade owners up at night', 2),
    (v_course_id, 'Trade Buying Cycles', 'When trades buy and how to time your outreach', 3),
    (v_course_id, 'Seasonal Opportunities', 'Capturing HVAC, roofing, and other seasonal businesses', 4),
    (v_course_id, 'Speaking to Trade Owners', 'Communication styles that resonate', 5),
    (v_course_id, 'Building a Trade Portfolio', 'Becoming known as THE trades marketing expert', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 16. Pet Businesses That Get Found First™ (Partner) (6 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'pet-businesses-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'The Pet Industry Opportunity', 'Market size, growth, and partner potential', 1),
    (v_course_id, 'Pet Business Pain Points', 'What pet service businesses struggle with', 2),
    (v_course_id, 'Positioning Local Paws Passport', 'Selling the pet-specific platform', 3),
    (v_course_id, 'Emotional Buying Triggers', 'How pet owners make decisions', 4),
    (v_course_id, 'Pet Industry Partnerships', 'Vet clinics, pet stores, and referral networks', 5),
    (v_course_id, 'Building a Pet Client Portfolio', 'Specializing in pet services', 6)
  ON CONFLICT DO NOTHING;
END IF;

-- 17. Care Coordination for Families™ (Partner) (5 modules)
SELECT id INTO v_course_id FROM courses WHERE slug = 'care-coordination-partner';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Senior Care Marketing Compliance', 'HIPAA, advertising rules, and regulations', 1),
    (v_course_id, 'Positioning CareCompanion HQ', 'Selling the care coordination platform', 2),
    (v_course_id, 'Building Healthcare Referral Networks', 'Partnering with doctors, hospitals, facilities', 3),
    (v_course_id, 'Messaging That Respects Regulations', 'What you can and cannot say', 4),
    (v_course_id, 'Growing in the Care Space', 'Building authority in senior care marketing', 5)
  ON CONFLICT DO NOTHING;
END IF;

-- 18. UGC Creator Certification (4 modules + exam)
SELECT id INTO v_course_id FROM courses WHERE slug = 'ugc-creator-certification';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'UGC Quality Standards', 'Production quality requirements and best practices', 1),
    (v_course_id, 'Job Completion Workflows', 'How to manage assignments from start to finish', 2),
    (v_course_id, 'Client Communication & Professionalism', 'Working with merchants and meeting expectations', 3),
    (v_course_id, 'Certification Exam Preparation', 'Review and prepare for certification test', 4)
  ON CONFLICT DO NOTHING;
END IF;

-- 19. Local-Link Certified Associate (5 modules + exam)
SELECT id INTO v_course_id FROM courses WHERE slug = 'local-link-certified-associate';
IF v_course_id IS NOT NULL THEN
  INSERT INTO course_modules (course_id, title, description, module_index) VALUES
    (v_course_id, 'Platform Features Mastery', 'Complete overview of all Local-Link tools', 1),
    (v_course_id, 'Best Practices & Workflows', 'How top partners use the platform', 2),
    (v_course_id, 'Client Onboarding & Training', 'Teaching merchants to use the platform', 3),
    (v_course_id, 'Troubleshooting & Support', 'Solving common issues independently', 4),
    (v_course_id, 'Certification Exam Preparation', 'Review and prepare for certification test', 5)
  ON CONFLICT DO NOTHING;
END IF;

END $$;