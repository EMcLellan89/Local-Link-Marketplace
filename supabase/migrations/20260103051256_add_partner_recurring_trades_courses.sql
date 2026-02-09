/*
  # Partner, Recurring Revenue, and Trades Courses

  Adds comprehensive modules and lessons for:
  - Course 5: Local-Link Partner Accelerator™ (5 modules, 27 lessons)
  - Course 6: Selling Recurring Revenue™ (5 modules, 26 lessons)
  - Course 7: Marketing for Trades™ (5 modules, 25 lessons)
*/

-- ============================================================================
-- COURSE 5: Local-Link Partner Accelerator™ - 5 Modules, 27 Lessons
-- ============================================================================

-- Module 1: Partner Business Foundations
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'partner-accelerator'), 1, 'Partner Business Foundations', 'Building your Local-Link partner territory')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 1), 1, 'Understanding the Local-Link Model', 'How the Local-Link ecosystem works. Territory rights, recurring revenue structure, and the opportunity to build $50K-$200K/year income.', 'https://example.com/video91', 12, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 1), 2, 'Territory Selection Strategy', 'Choosing your market area. Population density, business count, competition analysis, and expansion potential. Urban vs suburban considerations.', 'https://example.com/video92', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 1), 3, 'Business Structure and Setup', 'LLC formation, business banking, insurance requirements, and tax considerations. Setting up for long-term growth and profitability.', 'https://example.com/video93', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 1), 4, 'Revenue Model Deep Dive', 'Commission structure, residual income, and growth projections. How to calculate your earning potential and set realistic goals.', 'https://example.com/video94', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 1), 5, 'Your First 90 Days Plan', 'Month-by-month action plan. Setting up systems, prospecting targets, and milestones to hit in your first quarter.', 'https://example.com/video95', 15, false)
ON CONFLICT DO NOTHING;

-- Module 2: Merchant Acquisition
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'partner-accelerator'), 2, 'Merchant Acquisition', 'Landing and onboarding local businesses')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 1, 'Ideal Merchant Profile', 'Who makes the best Local-Link merchant. Industry types, revenue size, and readiness indicators. Where to focus for fastest growth.', 'https://example.com/video96', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 2, 'Lead Generation Systems', 'Building your prospect pipeline. Referrals, networking events, chambers of commerce, and online prospecting strategies.', 'https://example.com/video97', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 3, 'The Perfect Pitch', 'Presenting Local-Link value. Scripts, handling objections, and positioning yourself as a growth partner, not a vendor.', 'https://example.com/video98', 16, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 4, 'Closing Techniques That Work', 'Moving from interest to commitment. Trial closes, assumptive closes, and overcoming last-minute hesitation.', 'https://example.com/video99', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 5, 'Onboarding Process', 'Setting merchants up for success. Documentation, account setup, training, and first-month support that ensures retention.', 'https://example.com/video100', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 2), 6, 'Deal Structure Options', 'Pricing tiers, payment plans, and custom packages. Flexibility that closes deals while protecting your margins.', 'https://example.com/video101', 11, false)
ON CONFLICT DO NOTHING;

-- Module 3: Territory Management
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'partner-accelerator'), 3, 'Territory Management', 'Growing and scaling your partner business')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 3), 1, 'CRM for Partner Success', 'Organizing your merchant base. Tracking touchpoints, renewal dates, upsell opportunities, and communication history.', 'https://example.com/video102', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 3), 2, 'Merchant Retention Strategies', 'Keeping clients long-term. Regular check-ins, value reporting, proactive support, and anticipating churn before it happens.', 'https://example.com/video103', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 3), 3, 'Upselling and Cross-Selling', 'Growing account value. Identifying expansion opportunities, timing upgrades, and introducing add-on services.', 'https://example.com/video104', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 3), 4, 'Handling Merchant Issues', 'Problem resolution protocols. Technical support escalation, billing disputes, and turning problems into retention opportunities.', 'https://example.com/video105', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 3), 5, 'Territory Expansion', 'Growing your footprint. When to expand, adjacent territory strategy, and managing larger geographic areas effectively.', 'https://example.com/video106', 14, false)
ON CONFLICT DO NOTHING;

-- Module 4: Recurring Revenue Systems
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'partner-accelerator'), 4, 'Recurring Revenue Systems', 'Building predictable monthly income')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 4), 1, 'Residual Income Explained', 'How recurring commissions build wealth. Understanding lifetime value, compound growth, and passive income creation.', 'https://example.com/video107', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 4), 2, 'Churn Prevention', 'Keeping merchants subscribed. Early warning signs, intervention strategies, and what causes merchants to leave.', 'https://example.com/video108', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 4), 3, 'Annual Contract Strategy', 'Locking in long-term revenue. Benefits of annual vs monthly, discounting strategy, and renewal management.', 'https://example.com/video109', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 4), 4, 'Financial Planning for Partners', 'Managing variable income. Cash flow management, taxes, reinvestment vs personal income, and building reserves.', 'https://example.com/video110', 13, false)
ON CONFLICT DO NOTHING;

-- Module 5: Advanced Partner Strategies
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'partner-accelerator'), 5, 'Advanced Partner Strategies', 'Maximizing earnings and expansion')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 5), 1, 'Building a Partner Team', 'Hiring sub-partners or sales reps. When to scale beyond yourself, commission structures, and management systems.', 'https://example.com/video111', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 5), 2, 'Strategic Partnerships', 'Leveraging complementary businesses. Accountants, marketing agencies, business coaches - creating referral networks.', 'https://example.com/video112', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 5), 3, 'Becoming a Top Earner', 'What $200K+/year partners do differently. Activity levels, mindset, systems, and consistent execution.', 'https://example.com/video113', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'partner-accelerator') AND module_index = 5), 4, 'Exit Strategy and Business Value', 'Building a sellable asset. How to position your territory for acquisition and what multiples to expect.', 'https://example.com/video114', 13, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 6: Selling Recurring Revenue™ - 5 Modules, 26 Lessons
-- ============================================================================

-- Module 1: Subscription Business Models
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'selling-recurring-revenue'), 1, 'Subscription Business Models', 'Understanding recurring revenue fundamentals')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 1), 1, 'Why Recurring Revenue is the Holy Grail', 'Predictability, valuation multiples, and customer lifetime value. Why subscription businesses sell for 5-10x more than traditional businesses.', 'https://example.com/video115', 11, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 1), 2, 'Subscription Model Options', 'Service subscriptions, membership models, retainer agreements, and product subscriptions. Which fits your business best.', 'https://example.com/video116', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 1), 3, 'Unit Economics of Subscriptions', 'CAC, LTV, churn rate, and MRR calculations. The metrics that determine subscription business success or failure.', 'https://example.com/video117', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 1), 4, 'Converting One-Time to Recurring', 'Transitioning existing business models. Service packages, maintenance plans, and ongoing value delivery.', 'https://example.com/video118', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 1), 5, 'Case Studies: Successful Transitions', 'Real businesses that shifted to recurring revenue. HVAC maintenance, lawn care contracts, marketing retainers.', 'https://example.com/video119', 15, false)
ON CONFLICT DO NOTHING;

-- Module 2: Pricing and Packaging
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'selling-recurring-revenue'), 2, 'Pricing and Packaging', 'Creating irresistible subscription offers')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 2), 1, 'Pricing Psychology for Subscriptions', 'Monthly vs annual, price anchoring, and decoy pricing. Using psychology to increase perceived value and reduce price resistance.', 'https://example.com/video120', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 2), 2, 'Good-Better-Best Tier Strategy', 'Creating tiered offers. Why 3 tiers convert better than 1, designing middle-tier sweet spot, and premium positioning.', 'https://example.com/video121', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 2), 3, 'What to Include in Each Tier', 'Feature distribution across tiers. Core value in base tier, compelling upgrades, and exclusive premium benefits.', 'https://example.com/video122', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 2), 4, 'Handling Price Objections', 'Justifying monthly fees. Value equation, competitive comparison, and demonstrating ROI to overcome price resistance.', 'https://example.com/video123', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 2), 5, 'Testing and Optimizing Pricing', 'A/B testing subscription offers. When to raise prices, grandfathering existing customers, and price elasticity testing.', 'https://example.com/video124', 10, false)
ON CONFLICT DO NOTHING;

-- Module 3: Customer Retention
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'selling-recurring-revenue'), 3, 'Customer Retention', 'Reducing churn and increasing lifetime value')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 1, 'Understanding Churn', 'Why customers cancel. Voluntary vs involuntary churn, identifying at-risk customers, and acceptable churn rates by industry.', 'https://example.com/video125', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 2, 'Onboarding That Prevents Churn', 'First 30 days are critical. Activation events, early wins, and ensuring customers experience value before first renewal.', 'https://example.com/video126', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 3, 'Ongoing Engagement Strategies', 'Keeping customers active. Check-ins, value reporting, education content, and community building.', 'https://example.com/video127', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 4, 'Win-Back Campaigns', 'Re-engaging canceled customers. Timing, messaging, special offers, and addressing cancellation reasons.', 'https://example.com/video128', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 5, 'Payment Failure Recovery', 'Involuntary churn prevention. Dunning processes, payment method updates, and reducing failed transaction losses.', 'https://example.com/video129', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 3), 6, 'Building Customer Loyalty', 'Creating subscribers for life. Exclusive benefits, VIP treatment, and emotional connection beyond transactions.', 'https://example.com/video130', 14, false)
ON CONFLICT DO NOTHING;

-- Module 4: Scaling Subscriptions
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'selling-recurring-revenue'), 4, 'Scaling Subscriptions', 'Growing predictable monthly revenue')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 4), 1, 'Subscription Acquisition Channels', 'Where to find subscribers. Referrals, content marketing, partnerships, and paid acquisition strategies that work.', 'https://example.com/video131', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 4), 2, 'Free Trials and Freemium Models', 'Try before you buy strategies. Trial length optimization, conversion tactics, and when freemium makes sense.', 'https://example.com/video132', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 4), 3, 'Automating Subscription Operations', 'Systems for scale. Billing automation, customer communication, and self-service portals that reduce support burden.', 'https://example.com/video133', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 4), 4, 'Hiring for Subscription Business', 'Building your team. Customer success roles, support staff, and when to hire vs automate.', 'https://example.com/video134', 11, false)
ON CONFLICT DO NOTHING;

-- Module 5: Advanced Monetization
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'selling-recurring-revenue'), 5, 'Advanced Monetization', 'Upsells, cross-sells, and expansion revenue')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 5), 1, 'Expansion Revenue Strategy', 'Growing existing accounts. Usage-based pricing, seat expansion, and add-on modules that increase ARPU.', 'https://example.com/video135', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 5), 2, 'Cross-Selling Complementary Services', 'Bundling strategies. Identifying natural add-ons, timing cross-sell offers, and packaging for increased adoption.', 'https://example.com/video136', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 5), 3, 'Annual Prepay Incentives', 'Cash flow acceleration. Discount structure for annual payment, reducing churn, and improving cash position.', 'https://example.com/video137', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 5), 4, 'Partnership and Reseller Programs', 'Leveraging others for growth. Affiliate programs, white-label opportunities, and channel partnerships.', 'https://example.com/video138', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue') AND module_index = 5), 5, 'Valuation and Exit Strategy', 'Building a valuable asset. SaaS multiples, buyer expectations, and positioning your subscription business for acquisition.', 'https://example.com/video139', 15, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 7: Marketing for Trades (No Ads Required)™ - 5 Modules, 25 Lessons
-- ============================================================================

-- Module 1: Trade Business Marketing Fundamentals
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 1, 'Trade Business Marketing Fundamentals', 'Why contractors need different marketing')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1), 1, 'Why Traditional Marketing Fails Trades', 'The unique challenges of contractor marketing. Project-based work, seasonality, and trust-building in home services.', 'https://example.com/video140', 10, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1), 2, 'Customer Psychology in Home Services', 'How homeowners choose contractors. Fear of being ripped off, importance of licensing/insurance, and decision-making process.', 'https://example.com/video141', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1), 3, 'Building Trust Before the Estimate', 'Pre-selling through marketing. Demonstrating expertise, showcasing credentials, and reducing objections before contact.', 'https://example.com/video142', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1), 4, 'Residential vs Commercial Strategy', 'Different approaches for different clients. Marketing to homeowners vs property managers vs commercial buyers.', 'https://example.com/video143', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1), 5, 'Seasonal Marketing Planning', 'Managing demand fluctuations. Pre-season positioning, off-season lead generation, and year-round visibility.', 'https://example.com/video144', 11, false)
ON CONFLICT DO NOTHING;

-- Module 2: Local Visibility for Trades
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 2, 'Local Visibility for Trades', 'Being found when customers need you')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2), 1, 'Google Business Profile for Contractors', 'Trade-specific GBP optimization. Service areas, emergency services, licensing display, and before/after photos.', 'https://example.com/video145', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2), 2, 'Local SEO for Trade Businesses', 'Ranking for "near me" searches. Service area pages, emergency keywords, and competition strategies.', 'https://example.com/video146', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2), 3, 'Directory Listings That Matter', 'Trade-specific directories. HomeAdvisor, Angi, Thumbtack - which are worth it and how to maximize them.', 'https://example.com/video147', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2), 4, 'Yard Signs and Vehicle Wraps', 'Mobile advertising that works. Design best practices, placement strategy, and tracking effectiveness.', 'https://example.com/video148', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2), 5, 'Neighborhood Marketing Tactics', 'Dominating your service area. Door hangers, neighborhood Fac ebook groups, and local event sponsorship.', 'https://example.com/video149', 11, false)
ON CONFLICT DO NOTHING;

-- Module 3: Word-of-Mouth Systems
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 3, 'Word-of-Mouth Systems', 'Referrals that fill your calendar')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3), 1, 'Creating Referral-Worthy Experiences', 'Going beyond expectations. Small touches that get customers talking and recommending you to neighbors.', 'https://example.com/video150', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3), 2, 'Asking for Referrals Effectively', 'When and how to ask. Scripts that feel natural, timing after job completion, and following up on referrals.', 'https://example.com/video151', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3), 3, 'Referral Incentive Programs', 'Rewarding customers who refer. What works for trades (discounts, gift cards, donations), legal considerations.', 'https://example.com/video152', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3), 4, 'Building Trade Partner Networks', 'Complementary contractor relationships. Electricians + plumbers, HVAC + insulation - mutual referral agreements.', 'https://example.com/video153', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3), 5, 'Staying Top of Mind', 'Ongoing communication with past customers. Email newsletters, seasonal reminders, and maintenance programs.', 'https://example.com/video154', 13, false)
ON CONFLICT DO NOTHING;

-- Module 4: Commercial Client Acquisition
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 4, 'Commercial Client Acquisition', 'Landing bigger, recurring contracts')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4), 1, 'Residential vs Commercial Mindset', 'Different sales cycle, decision-makers, and buying process. Why commercial requires different approach.', 'https://example.com/video155', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4), 2, 'Finding Commercial Opportunities', 'Property managers, HOAs, retail chains, and facilities managers. Where to find recurring contract work.', 'https://example.com/video156', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4), 3, 'Commercial Proposal Writing', 'Bid documentation, scope of work, and pricing strategy for commercial projects. What separates winners from losers.', 'https://example.com/video157', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4), 4, 'Maintenance Agreement Models', 'Recurring revenue from commercial clients. Monthly service contracts, priority response, and preventive maintenance plans.', 'https://example.com/video158', 14, false)
ON CONFLICT DO NOTHING;

-- Module 5: Trade Business Scaling
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 5, 'Trade Business Scaling', 'Growing without losing quality')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5), 1, 'When to Hire Your First Employee', 'Knowing when you''ve outgrown solo operation. Financial indicators, workload signals, and preparation steps.', 'https://example.com/video159', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5), 2, 'Building Your Trade Brand', 'Standing out from commodity competition. Specialization, guarantees, and premium positioning strategies.', 'https://example.com/video160', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5), 3, 'Systems and Processes', 'Documenting your way of doing business. Checklists, standard operating procedures, and quality control.', 'https://example.com/video161', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5), 4, 'Managing Lead Flow', 'Handling increased demand without overwhelm. Scheduling systems, deposit requirements, and when to raise prices.', 'https://example.com/video162', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5), 5, 'Exit Strategy and Business Sale', 'Building a sellable trade business. What buyers look for, valuation factors, and transition planning.', 'https://example.com/video163', 15, false)
ON CONFLICT DO NOTHING;