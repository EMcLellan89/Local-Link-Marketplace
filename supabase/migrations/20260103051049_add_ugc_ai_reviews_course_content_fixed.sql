/*
  # UGC, AI Receptionist, and Reviews Course Content - Fixed Slugs

  Adds comprehensive modules and lessons for:
  - Course 2: UGC From Home™ (4 modules, 21 lessons)
  - Course 3: AI Receptionist & Missed Call Recovery™ (4 modules, 19 lessons)
  - Course 4: Reviews That Bring Customers In™ (4 modules, 20 lessons)
*/

-- ============================================================================
-- COURSE 2: UGC From Home™ - 4 Modules, 21 Lessons
-- ============================================================================

-- Module 1: UGC Foundations
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ugc-from-home'), 1, 'UGC Foundations', 'Understanding the creator economy and your place in it')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 1), 1, 'What is UGC and Why Brands Pay For It', 'The $20B creator economy explained. Learn why brands pay $200-$1500 per video and how you can capture this opportunity without followers.', 'https://example.com/video30', 10, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 1), 2, 'UGC vs Influencer Marketing', 'Why you don''t need followers to make money. The key differences between UGC creators and influencers, and why UGC often converts better.', 'https://example.com/video31', 8, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 1), 3, 'Income Reality Check: What You Can Actually Make', 'Realistic expectations and earnings breakdown. Beginner rates ($100-300/video), intermediate ($300-800), and expert ($800-1500+) with volume strategies.', 'https://example.com/video32', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 1), 4, 'Equipment You Need (and Don''t Need)', 'Starting with what you have vs upgrading. Your smartphone is enough to start. Optional upgrades: ring light, microphone, tripod - when to invest.', 'https://example.com/video33', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 1), 5, 'Finding Your UGC Niche', 'Matching your interests to profitable opportunities. Beauty, tech, home goods, pet products, food & beverage - which niches pay best and fit your lifestyle.', 'https://example.com/video34', 14, false)
ON CONFLICT DO NOTHING;

-- Module 2: Content Creation Mastery
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ugc-from-home'), 2, 'Content Creation Mastery', 'Creating scroll-stopping content brands love')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 1, 'Hooks That Stop the Scroll', 'First 3 seconds that determine success. Proven hook formulas, pattern interrupts, and the psychology of stopping thumb momentum.', 'https://example.com/video35', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 2, 'Scripting Authentic-Feeling Content', 'Looking natural while being strategic. How to memorize scripts, teleprompter alternatives, and improvisation techniques that feel genuine.', 'https://example.com/video36', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 3, 'Lighting and Composition Basics', 'Professional-looking videos at home. Three-point lighting setup, natural light optimization, and framing rules for maximum impact.', 'https://example.com/video37', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 4, 'Editing Apps and Techniques', 'Quick editing for maximum impact. CapCut, InShot, and Adobe Rush tutorials. Cuts, transitions, text overlays, and color grading basics.', 'https://example.com/video38', 16, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 5, 'Trending Sounds and Styles', 'Staying current with platform trends. How to identify viral sounds early, adapt trends to brand content, and when to jump on vs skip trends.', 'https://example.com/video39', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 2), 6, 'Creating Multiple Variations Fast', 'Batch content creation workflow. Filming 10-20 videos in one session, organizing files, and efficient editing systems to maximize output.', 'https://example.com/video40', 14, false)
ON CONFLICT DO NOTHING;

-- Module 3: Landing Your First Clients
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ugc-from-home'), 3, 'Landing Your First Clients', 'Finding and pitching brands that will pay you')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 1, 'Building Your UGC Portfolio', 'Creating samples that sell your services. How to create portfolio pieces without brand partnerships, showcasing versatility and style range.', 'https://example.com/video41', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 2, 'Where to Find UGC Opportunities', 'Platforms, job boards, and brand outreach. Fiverr, Upwork, Billo, Social Cat, and direct brand outreach strategies for consistent work.', 'https://example.com/video42', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 3, 'Pitch Templates That Get Responses', 'Cold email scripts that land meetings. Subject lines that get opened, value propositions that resonate, and follow-up sequences that book calls.', 'https://example.com/video43', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 4, 'Pricing Your Services', 'What to charge and how to negotiate. Per-video pricing, usage rights, exclusivity premiums, and when to offer package deals vs one-offs.', 'https://example.com/video44', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 5, 'Contract Essentials', 'Protecting yourself and getting paid. Payment terms, usage rights, revision policies, and cancellation clauses to include in every agreement.', 'https://example.com/video45', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 3), 6, 'Following Up Without Being Annoying', 'Persistence that leads to bookings. The 3-7-21 follow-up formula, knowing when to move on, and maintaining relationships for future opportunities.', 'https://example.com/video46', 8, false)
ON CONFLICT DO NOTHING;

-- Module 4: Scaling to Full-Time Income
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ugc-from-home'), 4, 'Scaling to Full-Time Income', 'Building a sustainable UGC business')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 4), 1, 'Landing Retainer Clients', 'Monthly recurring revenue from brands. How to pitch ongoing partnerships, typical retainer structures (4-12 videos/month), and client expectations.', 'https://example.com/video47', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 4), 2, 'Managing Multiple Clients', 'Systems for staying organized and on time. Project management tools, content calendars, communication protocols, and avoiding burnout.', 'https://example.com/video48', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 4), 3, 'Raising Your Rates', 'When and how to increase pricing. Performance-based pricing increases, grandfather pricing for existing clients, and positioning as premium creator.', 'https://example.com/video49', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 4), 4, 'Building Long-Term Brand Relationships', 'Becoming a go-to creator. Over-delivering on projects, strategic upselling, and expanding into bigger brand budgets and longer partnerships.', 'https://example.com/video50', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home') AND module_index = 4), 5, 'Taxes and Business Setup', 'Legal and financial foundations. LLC vs sole proprietorship, quarterly tax estimates, deductible expenses, and working with an accountant.', 'https://example.com/video51', 12, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 3: AI Receptionist & Missed Call Recovery™ - 4 Modules, 19 Lessons
-- ============================================================================

-- Module 1: The Missed Call Problem
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls'), 1, 'The Missed Call Problem', 'Understanding the revenue leak in your business')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 1), 1, 'How Much Money You''re Losing', 'Calculating the true cost of missed calls. If your average customer is worth $500 and you miss 20 calls/month, that''s $10,000 lost revenue monthly.', 'https://example.com/video52', 10, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 1), 2, 'Why Customers Don''t Leave Voicemails', 'Consumer behavior in the mobile age. Only 4% of callers leave voicemails. 80% move to your competitor immediately after a missed call.', 'https://example.com/video53', 8, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 1), 3, 'The Competitive Advantage of Speed', 'First responder wins the business. Studies show responding within 5 minutes increases close rates by 400% compared to 30-minute response times.', 'https://example.com/video54', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 1), 4, 'AI vs Human Receptionists', 'Cost comparison and capability analysis. Human: $3000-4000/month. AI: $50-300/month. Works 24/7, never sick, instant response times.', 'https://example.com/video55', 11, false)
ON CONFLICT DO NOTHING;

-- Module 2: Setting Up AI Call Handling
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls'), 2, 'Setting Up AI Call Handling', 'Implementing automated call response systems')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 2), 1, 'Top AI Receptionist Platforms', 'Comparing features, pricing, and capabilities. Ruby Receptionist, Smith.ai, conversational AI tools - pros/cons and best fits by industry.', 'https://example.com/video56', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 2), 2, 'Phone System Integration', 'Connecting AI to your existing setup. Integration with major phone systems, call forwarding setup, and testing protocols.', 'https://example.com/video57', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 2), 3, 'Scripting Your AI Responses', 'What your AI should say and when. Greeting scripts, FAQ responses, appointment booking flow, and emergency escalation protocols.', 'https://example.com/video58', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 2), 4, 'Testing and Optimization', 'Ensuring natural, helpful conversations. Mystery shopping your own AI, analyzing call recordings, and iteration based on real feedback.', 'https://example.com/video59', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 2), 5, 'Handling Complex Scenarios', 'Edge cases and escalation protocols. When to route to human, handling angry customers, managing pricing questions, and service inquiries.', 'https://example.com/video60', 11, false)
ON CONFLICT DO NOTHING;

-- Module 3: Missed Call Recovery Systems
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls'), 3, 'Missed Call Recovery Systems', 'Automated follow-up that converts')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 3), 1, 'SMS Response Automation', 'Text-back systems that book appointments. Instant SMS replies with booking links recover 35-45% of missed calls with zero manual effort.', 'https://example.com/video61', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 3), 2, 'Email Follow-Up Sequences', 'Multi-touch campaigns for missed calls. 3-email sequence over 7 days with declining urgency and special offers to capture late responders.', 'https://example.com/video62', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 3), 3, 'Callback Scheduling Tools', 'Let customers book you automatically. Calendly, Acuity, or built-in booking systems that eliminate phone tag completely.', 'https://example.com/video63', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 3), 4, 'Response Time Optimization', 'The golden window for follow-up. Within 1 minute: 80% recovery. Within 5 minutes: 50%. After 30 minutes: less than 10%.', 'https://example.com/video64', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 3), 5, 'Tracking and Analytics', 'Measuring recovery rates and ROI. Call tracking dashboards, response rates, conversion tracking, and calculating system payback period.', 'https://example.com/video65', 14, false)
ON CONFLICT DO NOTHING;

-- Module 4: Advanced Automation
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls'), 4, 'Advanced Automation', '24/7 business operations without staff')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 4), 1, 'After-Hours Call Handling', 'Capturing leads while you sleep. 40% of calls come outside business hours. Setup for capturing weekend and evening opportunities.', 'https://example.com/video66', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 4), 2, 'CRM Integration', 'Automatic lead capture and organization. Zapier connections, native integrations, and ensuring no lead falls through cracks.', 'https://example.com/video67', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 4), 3, 'Payment Collection Automation', 'Getting paid without manual invoicing. Automated deposit collection, service confirmation, and reducing no-shows with prepayment.', 'https://example.com/video68', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 4), 4, 'Managing Customer Expectations', 'Communication about AI assistance. When and how to disclose AI vs human handling, and customer satisfaction considerations.', 'https://example.com/video69', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-calls') AND module_index = 4), 5, 'ROI Tracking and Reporting', 'Proving the value of automation. Before/after comparison, recovered revenue calculations, and justifying ongoing investment.', 'https://example.com/video70', 10, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 4: Reviews That Bring Customers In™ - 4 Modules, 20 Lessons
-- ============================================================================

-- Module 1: Review Psychology
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'reviews-that-convert'), 1, 'Review Psychology', 'Understanding how reviews influence buying decisions')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 1), 1, 'Why 93% of Consumers Read Reviews', 'The trust economy explained. Reviews are the #1 factor in local business selection. Understanding social proof psychology and herd behavior.', 'https://example.com/video71', 9, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 1), 2, 'The Magic Number: How Many Reviews You Need', 'Quantity vs quality benchmarks. Under 10 reviews: high skepticism. 10-50: gaining trust. 50-100: competitive. 100+: dominant position.', 'https://example.com/video72', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 1), 3, 'Rating Thresholds That Matter', '4.0 vs 4.5 vs 5.0 stars impact. 4.8-4.9 is the sweet spot (too perfect looks fake). Impact on click-through rates at each tier.', 'https://example.com/video73', 8, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 1), 4, 'Recency Effect in Reviews', 'Why fresh reviews outweigh old ones. Google prioritizes recent reviews. A 2-week-old review carries 3x weight of a 2-year-old review.', 'https://example.com/video74', 11, false)
ON CONFLICT DO NOTHING;

-- Module 2: Generating More Reviews
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'reviews-that-convert'), 2, 'Generating More Reviews', 'Systems to increase review volume')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 1, 'The Perfect Moment to Ask', 'Timing your review requests for maximum response. Best moments: immediately after positive experience, after problem resolution, or at satisfaction peak.', 'https://example.com/video75', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 2, 'SMS Review Request Templates', 'Text messages that get results. Copy-paste templates achieving 15-25% response rates. Optimal length, tone, and call-to-action wording.', 'https://example.com/video76', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 3, 'Email Review Campaigns', 'Follow-up sequences that work. 3-email sequence: immediate thank you + review link, 3-day reminder, 7-day final ask with social proof.', 'https://example.com/video77', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 4, 'In-Person Review Requests', 'Face-to-face techniques. How to ask without seeming desperate, handling objections, and using tablets/phones for instant reviews on-site.', 'https://example.com/video78', 9, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 5, 'QR Code Strategy', 'Making it stupid-simple to leave reviews. QR code placement, design best practices, and tracking which locations generate most reviews.', 'https://example.com/video79', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 2), 6, 'Incentives (Legal Ways Only)', 'What you can and can''t offer. FTC guidelines, platform policies. Legal: discounts for ALL customers. Illegal: payment contingent on positive reviews.', 'https://example.com/video80', 14, false)
ON CONFLICT DO NOTHING;

-- Module 3: Review Response Mastery
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'reviews-that-convert'), 3, 'Review Response Mastery', 'Turning every review into a marketing asset')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 3), 1, 'Why You Must Respond to Every Review', 'The visibility and trust benefits. Responding increases visibility by 30%. Prospects read your responses as much as the reviews themselves.', 'https://example.com/video81', 8, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 3), 2, '5-Star Review Response Templates', 'Thanking customers professionally. Templates that show gratitude, reinforce key services, and subtly ask for referrals without being pushy.', 'https://example.com/video82', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 3), 3, 'Handling 1-3 Star Reviews', 'Damage control and recovery scripts. The HEARD framework: Hear, Empathize, Apologize, Resolve, Document. Turning critics into advocates.', 'https://example.com/video83', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 3), 4, 'When to Take Conversations Offline', 'Escalation protocols. Red flags that require phone/in-person follow-up. Preventing public back-and-forth that damages reputation.', 'https://example.com/video84', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 3), 5, 'Getting Negative Reviews Removed', 'Platform policies and request processes. Google''s violation criteria, flagging fake reviews, when removal is possible vs impossible.', 'https://example.com/video85', 13, false)
ON CONFLICT DO NOTHING;

-- Module 4: Reputation Amplification
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'reviews-that-convert'), 4, 'Reputation Amplification', 'Showcasing your reviews everywhere')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 4), 1, 'Adding Reviews to Your Website', 'Widget installation and display. Best locations for review widgets, mobile optimization, and automatic syncing with Google reviews.', 'https://example.com/video86', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 4), 2, 'Social Media Review Promotion', 'Turning reviews into social proof. Screenshot best reviews for Instagram stories, create testimonial graphics, and regular review highlights.', 'https://example.com/video87', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 4), 3, 'Using Reviews in Marketing Materials', 'Testimonials that convert. Incorporating reviews in emails, proposals, sales materials, and service menus for maximum credibility.', 'https://example.com/video88', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 4), 4, 'Video Testimonial Strategy', 'Getting customers on camera. Request process, making it easy (come to them), and editing raw footage into compelling testimonials.', 'https://example.com/video89', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-convert') AND module_index = 4), 5, 'Case Studies from Reviews', 'Deep-dive success stories. Expanding great reviews into full case studies with before/after, specific results, and detailed customer journeys.', 'https://example.com/video90', 13, false)
ON CONFLICT DO NOTHING;