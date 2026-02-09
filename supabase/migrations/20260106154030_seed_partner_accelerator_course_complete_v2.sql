/*
  # Seed Partner Accelerator Course - Complete Data V2
  
  Seeds:
  - 1 course (partner-accelerator)
  - 5 modules
  - 26 lessons with full content
  - 30 exam questions
*/

-- Insert Course
INSERT INTO courses (slug, title, subtitle, description, image_url, is_published)
VALUES (
  'partner-accelerator',
  'Local-Link Partner Accelerator™',
  'Train, Certify, and Scale as a Local-Link Partner',
  'Master the art of selling Local-Link solutions, create recurring income, and build long-term success. This comprehensive training program includes 5 modules, 26 lessons, and certification upon completion. Perfect for partners who want to confidently position Local-Link without pressure or hype.',
  '/images/partner-accelerator.jpg',
  true
);

-- Get course ID and insert all data
DO $$
DECLARE
  v_course_id uuid;
  v_module1_id uuid;
  v_module2_id uuid;
  v_module3_id uuid;
  v_module4_id uuid;
  v_module5_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'partner-accelerator';

  -- Insert Modules
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 1, 'Understanding the Local-Link Ecosystem', 'Learn what Local-Link is, how it works, and why businesses need it.')
  RETURNING id INTO v_module1_id;

  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 2, 'Selling the Right Way', 'Master non-pushy sales conversations and handle objections confidently.')
  RETURNING id INTO v_module2_id;

  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 3, 'Bundling & Pricing for Maximum Close Rate', 'Learn how to bundle products for faster closes.')
  RETURNING id INTO v_module3_id;

  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 4, 'Partner Operations & Scaling', 'Navigate your partner dashboard and scale beyond 1-to-1 selling.')
  RETURNING id INTO v_module4_id;

  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 5, 'Long-Term Partner Growth', 'Build recurring income and become a top-tier partner.')
  RETURNING id INTO v_module5_id;

  -- Module 1 Lessons (5 lessons)
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview) VALUES
  (v_module1_id, 1, 'What Local-Link Actually Is (and Isn''t)', 
  'Local-Link is not another marketing tool. It''s a visibility and follow-up system designed for how people actually buy locally. As a partner, your job is to explain this clearly, not oversell it.', 4, true),
  (v_module1_id, 2, 'The Marketplace vs CRM vs Add-Ons', 
  'Local-Link has three layers: Marketplace (visibility), CRM (organization), Add-ons (conversion). Partners succeed when they explain these as one connected flow.', 4, false),
  (v_module1_id, 3, 'Who Local-Link Is Perfect For', 
  'Local-Link works best for trades, home services, restaurants, pet services, and any business relying on calls or repeat customers.', 3, false),
  (v_module1_id, 4, 'Why Businesses Say Yes', 
  'Businesses buy relief from missed calls, bad leads, and juggling too many tools. Local-Link simplifies their operations.', 4, false),
  (v_module1_id, 5, 'Partner Income Opportunities', 
  'Partners earn from subscriptions, CRMs, add-ons, and long-term relationships. This is recurring income, not one-time sales.', 4, false);

  -- Module 2 Lessons (6 lessons)
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview) VALUES
  (v_module2_id, 1, 'The Non-Pushy Partner Mindset', 
  'You are not convincing anyone. You are helping them see what''s missing. Pressure kills trust. Clarity builds it.', 3, false),
  (v_module2_id, 2, 'The Core Sales Conversation', 
  'Every conversation follows: What''s not working, What it''s costing them, How the system fixes it, What the next step is.', 5, false),
  (v_module2_id, 3, 'Selling Without Being Salesy', 
  'If it feels salesy to you, it feels salesy to them. Stick to questions. Let the business owner connect the dots.', 3, false),
  (v_module2_id, 4, 'Common Objections & Responses', 
  'Price objections are rarely about money. They''re about uncertainty. Your job is to reduce risk, not argue.', 4, false),
  (v_module2_id, 5, 'Positioning Against Competitors', 
  'You don''t need to name other platforms. Just explain why Local-Link works differently. Systems beat tools.', 3, false),
  (v_module2_id, 6, 'When to Stop Selling', 
  'The fastest way to lose a deal is to keep pushing. If trust isn''t there yet, pause. Follow-up beats force.', 3, false);

  -- Module 3 Lessons (5 lessons)
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview) VALUES
  (v_module3_id, 1, 'Why Bundles Close Faster', 
  'Bundles reduce confusion. When everything works together, the decision is easier.', 3, false),
  (v_module3_id, 2, 'Core Bundles Partners Can Offer', 
  'Marketplace plus follow-up converts better than either alone. CRM plus automation creates stickiness.', 4, false),
  (v_module3_id, 3, 'Monthly vs Annual Conversations', 
  'Monthly lowers resistance. Annual builds commitment. Your job is to offer both clearly.', 3, false),
  (v_module3_id, 4, 'Using Examples Without Overpromising', 
  'Share outcomes, not guarantees. Overpromising kills long-term trust.', 3, false),
  (v_module3_id, 5, 'Avoiding Discount Traps', 
  'Discounting devalues the system. If price is the only lever, something else wasn''t explained clearly.', 3, false);

  -- Module 4 Lessons (5 lessons)
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview) VALUES
  (v_module4_id, 1, 'Your Partner Dashboard', 
  'Your dashboard tracks links, sales, and payouts. Check it weekly — not obsessively.', 4, false),
  (v_module4_id, 2, 'How Attribution Works', 
  'Links matter. Cookies matter. Use your partner link every time.', 3, false),
  (v_module4_id, 3, 'Weekly Partner Activity Plan', 
  'Five conversations a week beats fifty random messages.', 3, false),
  (v_module4_id, 4, 'Scaling Beyond 1-to-1', 
  'Referrals, content, and partnerships scale better than cold outreach.', 4, false),
  (v_module4_id, 5, 'Brand Compliance', 
  'You represent the brand. Clarity and honesty protect everyone.', 3, false);

  -- Module 5 Lessons (5 lessons)
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview) VALUES
  (v_module5_id, 1, 'Building Recurring Income', 
  'Recurring income beats one-time wins. Retention matters.', 3, false),
  (v_module5_id, 2, 'Creating a Niche', 
  'Partners who focus on one industry grow faster.', 3, false),
  (v_module5_id, 3, 'Common Partner Mistakes', 
  'Chasing everyone serves no one.', 3, false),
  (v_module5_id, 4, 'White-Label Readiness', 
  'White-label is earned, not automatic.', 3, false),
  (v_module5_id, 5, 'Becoming a Top-Tier Partner', 
  'Consistency beats intensity. Top partners show up every week.', 4, false);

  -- Insert 30 Exam Questions
  INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation) VALUES
  (v_course_id, 1, 'Local-Link should be positioned as:', 'multiple_choice',
   '{"a": "A marketing tool", "b": "A website replacement", "c": "A connected visibility + follow-up system", "d": "An ad platform"}'::jsonb,
   'c', 'Local-Link is a complete system, not just another marketing tool.'),
  (v_course_id, 2, 'The Marketplace primary role is to:', 'multiple_choice',
   '{"a": "Send emails", "b": "Capture payments", "c": "Get businesses found during search", "d": "Replace websites"}'::jsonb,
   'c', 'The Marketplace helps businesses get discovered.'),
  (v_course_id, 3, 'The CRM primary role is to:', 'multiple_choice',
   '{"a": "Run ads", "b": "Organize leads and follow-up", "c": "Host reviews", "d": "Replace accounting"}'::jsonb,
   'b', 'The CRM captures leads and ensures follow-up.'),
  (v_course_id, 4, 'Add-ons exist primarily to:', 'multiple_choice',
   '{"a": "Increase complexity", "b": "Lower pricing", "c": "Increase conversion and retention", "d": "Replace staff"}'::jsonb,
   'c', 'Add-ons increase conversion rates and retention.'),
  (v_course_id, 5, 'Which business is the best fit for Local-Link?', 'multiple_choice',
   '{"a": "National e-commerce", "b": "Dropshipping store", "c": "Local service business relying on calls", "d": "Digital product seller"}'::jsonb,
   'c', 'Local-Link works best for local service businesses.'),
  (v_course_id, 6, 'Businesses buy Local-Link because they want:', 'multiple_choice',
   '{"a": "New features", "b": "Relief from missed calls and tool overload", "c": "More dashboards", "d": "Cheaper ads"}'::jsonb,
   'b', 'Businesses buy relief from pain points.'),
  (v_course_id, 7, 'The correct sales mindset is:', 'multiple_choice',
   '{"a": "Persuasion", "b": "Pressure", "c": "Education and clarity", "d": "Urgency tactics"}'::jsonb,
   'c', 'Partners succeed through education, not pressure.'),
  (v_course_id, 8, 'A strong conversation should include:', 'multiple_choice',
   '{"a": "A demo", "b": "Competitor comparisons", "c": "Cost of inaction + next step", "d": "Discount offers"}'::jsonb,
   'c', 'Include what''s not working, cost of inaction, and next step.'),
  (v_course_id, 9, 'To avoid sounding salesy:', 'multiple_choice',
   '{"a": "Talk faster", "b": "Use questions", "c": "Show pricing first", "d": "Push bundles"}'::jsonb,
   'b', 'Questions let customers connect dots themselves.'),
  (v_course_id, 10, 'When prospect says "I need to think":', 'multiple_choice',
   '{"a": "Push urgency", "b": "Discount", "c": "Pause and follow up later", "d": "End conversation"}'::jsonb,
   'c', 'Respect their pace and follow up later.'),
  (v_course_id, 11, 'Why bundles close faster:', 'multiple_choice',
   '{"a": "Cheaper", "b": "Reduce decision fatigue", "c": "Hide pricing", "d": "Force commitment"}'::jsonb,
   'b', 'Bundles reduce choice overload.'),
  (v_course_id, 12, 'Wrong reason to discount:', 'multiple_choice',
   '{"a": "Seasonal promo", "b": "Enterprise deal", "c": "To close hesitant buyer quickly", "d": "Strategic incentive"}'::jsonb,
   'c', 'Discounting means value wasn''t clear.'),
  (v_course_id, 13, 'Monthly pricing reduces:', 'multiple_choice',
   '{"a": "Churn", "b": "Objections to commitment", "c": "Support needs", "d": "Feature usage"}'::jsonb,
   'b', 'Monthly lowers barrier to entry.'),
  (v_course_id, 14, 'Annual pricing increases:', 'multiple_choice',
   '{"a": "Trial usage", "b": "Commitment and retention", "c": "Complexity", "d": "Refunds"}'::jsonb,
   'b', 'Annual builds deeper commitment.'),
  (v_course_id, 15, 'Partners should use examples by:', 'multiple_choice',
   '{"a": "Guaranteeing results", "b": "Sharing outcomes without promises", "c": "Naming competitors", "d": "Showing revenue"}'::jsonb,
   'b', 'Share outcomes without guaranteeing same results.'),
  (v_course_id, 16, 'Dashboard should be checked:', 'multiple_choice',
   '{"a": "Hourly", "b": "Daily", "c": "Weekly", "d": "Yearly"}'::jsonb,
   'c', 'Weekly reviews keep you informed without stress.'),
  (v_course_id, 17, 'Attribution depends on:', 'multiple_choice',
   '{"a": "Verbal referrals", "b": "Business cards", "c": "Using partner link consistently", "d": "CRM notes"}'::jsonb,
   'c', 'The partner link sets tracking cookie.'),
  (v_course_id, 18, 'Weekly activity plan should include:', 'multiple_choice',
   '{"a": "Cold emails only", "b": "Ads", "c": "5 quality conversations + follow-ups", "d": "Social posting"}'::jsonb,
   'c', '5 conversations per week creates steady growth.'),
  (v_course_id, 19, 'Fastest way to scale:', 'multiple_choice',
   '{"a": "Mass cold outreach", "b": "Niches + referrals", "c": "Discounts", "d": "Demos"}'::jsonb,
   'b', 'Niches and referrals create scalable growth.'),
  (v_course_id, 20, 'Brand compliance protects:', 'multiple_choice',
   '{"a": "Only platform", "b": "Only partner", "c": "Both brand and partner income", "d": "Only customers"}'::jsonb,
   'c', 'Compliance protects everyone.'),
  (v_course_id, 21, 'Recurring income is important because:', 'multiple_choice',
   '{"a": "Feels easier", "b": "Creates stability", "c": "Requires more work", "d": "Eliminates sales"}'::jsonb,
   'b', 'Recurring income provides predictable cash flow.'),
  (v_course_id, 22, 'Creating niche helps by:', 'multiple_choice',
   '{"a": "Limiting opportunities", "b": "Building authority faster", "c": "Increasing competition", "d": "Lowering prices"}'::jsonb,
   'b', 'Specialization builds authority faster.'),
  (v_course_id, 23, 'Common partner mistake:', 'multiple_choice',
   '{"a": "Asking questions", "b": "Overselling to everyone", "c": "Following up", "d": "Using bundles"}'::jsonb,
   'b', 'Chasing everyone wastes time.'),
  (v_course_id, 24, 'White-label is best for partners who:', 'multiple_choice',
   '{"a": "Are brand new", "b": "Want quick money", "c": "Understand and protect system", "d": "Avoid support"}'::jsonb,
   'c', 'White-label is earned by proven partners.'),
  (v_course_id, 25, 'Top-tier partner defined by:', 'multiple_choice',
   '{"a": "Intensity", "b": "Volume", "c": "Consistency over time", "d": "Aggressive selling"}'::jsonb,
   'c', 'Top partners are consistent long-term.'),
  (v_course_id, 26, 'Prospect uses another tool. Best response:', 'scenario',
   '{"a": "Ours is better", "b": "Switch now", "c": "Ask what works/doesn''t, explain gap", "d": "End call"}'::jsonb,
   'c', 'Find gaps and show how Local-Link fills them.'),
  (v_course_id, 27, 'Prospect wants discount. Best action:', 'scenario',
   '{"a": "Discount", "b": "Decline politely, re-explain value", "c": "Offer free months", "d": "Push urgency"}'::jsonb,
   'b', 'Return to value rather than dropping price.'),
  (v_course_id, 28, 'Forgot partner link. What happens:', 'scenario',
   '{"a": "Commission guaranteed", "b": "Attribution may be lost", "c": "Admin fixes it", "d": "Cookies don''t matter"}'::jsonb,
   'b', 'Without link, tracking breaks.'),
  (v_course_id, 29, 'Client confused by features. Best approach:', 'scenario',
   '{"a": "Show everything", "b": "Focus on outcome flow", "c": "Send documentation", "d": "Push add-ons"}'::jsonb,
   'b', 'Simplify with connected flow explanation.'),
  (v_course_id, 30, 'When should upsells stop:', 'scenario',
   '{"a": "Never", "b": "After first no", "c": "When trust is at risk", "d": "After onboarding"}'::jsonb,
   'c', 'Don''t damage trust by pushing too hard.');

END $$;
