/*
  # Local Customers on Autopilot™ - Complete Course Content
  
  Adds all 6 modules and 30 lessons with full webinar scripts
  for the merchant version of Local Customers on Autopilot.
*/

-- Get the course ID
DO $$
DECLARE
  v_course_id uuid;
  v_module_1_id uuid;
  v_module_2_id uuid;
  v_module_3_id uuid;
  v_module_4_id uuid;
  v_module_5_id uuid;
  v_module_6_id uuid;
BEGIN
  -- Get course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'local-customers-on-autopilot-merchant';
  
  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- MODULE 1: WHY MOST LOCAL MARKETING FAILS
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Why Most Local Marketing Fails',
    'Understand why traditional advertising stops working and learn the foundation of autopilot growth systems.',
    1
  )
  RETURNING id INTO v_module_1_id;

  -- Lesson 1.1
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_1_id,
    'Why Ads Stop Working for Local Businesses',
    1,
    E'If you''re a local business owner, you''ve probably been told the same thing over and over again:\n\n"Just run ads."\n\nFacebook ads. Google ads. Boosted posts.\n\nAnd maybe at first, they worked.\n\nBut over time, the results slowed down… the costs went up… and suddenly you were paying more just to get the same phone calls.\n\nHere''s the truth most platforms won''t tell you:\n\n**Ads are rented attention.**\n\nThe moment you stop paying, everything stops.\n\nLocal Customers on Autopilot is about building **owned attention** — systems that keep working even when you''re not spending money.\n\nIn this course, you''ll learn how local businesses actually grow:\n- Through visibility\n- Through trust\n- Through relationships\n- Through systems that compound over time\n\nNo hacks. No chasing algorithms. Just real-world local growth.',
    5
  );

  -- Lesson 1.2
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_1_id,
    'How Customers Really Choose Local Businesses',
    2,
    E'When someone needs a plumber, a cleaner, a groomer, or a contractor, they don''t think like marketers.\n\nThey think like neighbors.\n\nThey ask questions like:\n- "Who do people trust?"\n- "Who shows up?"\n- "Who feels safe?"\n\n**Customers choose the business they recognize** — not the one with the fanciest ad.\n\nAutopilot growth happens when your business keeps showing up:\n- In searches\n- In reviews\n- In community spaces\n- In conversations\n\nThis course teaches you how to build those touchpoints so customers come to you already warmed up.',
    5
  );

  -- Lesson 1.3
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_1_id,
    'The Difference Between Leads and Relationships',
    3,
    E'A lead is just a name.\n\nA relationship is someone who remembers you.\n\nLocal businesses that win long-term don''t chase leads — they build relationships.\n\nThat means:\n- Following up consistently\n- Staying visible\n- Making it easy for people to come back when they''re ready\n\n**In Autopilot systems, relationships are built once and work forever.**\n\nThis is how businesses survive slow seasons and win during busy ones.',
    5
  );

  -- Lesson 1.4
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_1_id,
    'What "Autopilot" Actually Means (And What It Doesn''t)',
    4,
    E'Autopilot does NOT mean lazy.\n\nIt means:\n- You build systems once\n- Then they keep working in the background\n\nThink of it like this:\n\nYou don''t manually turn your refrigerator on every day. You set it up once.\n\n**Autopilot marketing is the same.**\n\nYou''ll still run your business. You''ll still deliver great service.\n\nBut customer flow no longer depends on constant hustle.',
    5
  );

  -- Lesson 1.5
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_1_id,
    'The 4 Pillars of Local Autopilot Growth',
    5,
    E'Every successful local autopilot system has four pillars:\n\n**One: Visibility** — people can find you.\n\n**Two: Trust** — people believe you.\n\n**Three: Follow-up** — people aren''t forgotten.\n\n**Four: Consistency** — systems don''t take days off.\n\nEvery lesson in this course fits into one of these pillars.\n\nOnce you understand them, growth stops feeling random — and starts feeling predictable.',
    6
  );

  -- MODULE 2: BUILDING LOCAL VISIBILITY WITHOUT ADS
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Building Local Visibility Without Ads',
    'Learn where local customers actually look and how to dominate those spaces without paying for advertising.',
    2
  )
  RETURNING id INTO v_module_2_id;

  -- Module 2 Lessons
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_2_id, 'Where Local Customers Actually Look', 1,
    E'When people need a local service, they don''t scroll forever.\n\nThey look in very specific places:\n- Google search results\n- Google Maps\n- Reviews\n- Facebook groups\n- Local recommendations\n\n**The mistake most businesses make is trying to be everywhere.**\n\nAutopilot growth comes from dominating the few places that matter.\n\nIn this module, you''ll learn exactly where to show up — and how to stay visible without paying for ads.',
    5
  ),
  (
    v_module_2_id, 'Google Is Your First Autopilot Engine', 2,
    E'Google is the biggest referral source you will ever have.\n\nWhen someone types "best plumber near me," they are already ready to buy.\n\n**Autopilot growth means:**\n- Your business shows up\n- Your reviews look strong\n- Your information is correct\n\nYou don''t need tricks. You need consistency.\n\nGoogle rewards businesses that stay active, accurate, and trusted.',
    6
  ),
  (
    v_module_2_id, 'Reviews Are Visibility Multipliers', 3,
    E'Reviews don''t just build trust. They increase visibility.\n\n- More reviews = more clicks\n- Better reviews = higher ranking\n\n**Autopilot businesses don''t "hope" for reviews. They build simple systems that ask at the right time.**\n\nWhen reviews run on autopilot, customers sell for you.',
    5
  ),
  (
    v_module_2_id, 'Local Social Proof Without Posting Daily', 4,
    E'You do not need to post every day to win locally.\n\nYou need **proof**.\n\nProof looks like:\n- Before-and-after photos\n- Customer feedback\n- Community involvement\n- Consistent branding\n\n**Autopilot visibility comes from reusing the same proof everywhere.**\n\nOne photo can work on Google, Facebook, email, and your website.',
    5
  ),
  (
    v_module_2_id, 'Visibility That Compounds Over Time', 5,
    E'Ads stop the moment you stop paying.\n\n**Visibility systems compound.**\n\nEvery review, post, mention, and listing builds on the last one.\n\nThis is why autopilot businesses feel "busy" even in slow seasons.\n\nThey didn''t get lucky. They built systems.',
    5
  );

  -- MODULE 3: TURNING INTEREST INTO TRUST
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Turning Interest Into Trust',
    'Master the art of building trust before the first conversation, so sales become easier and faster.',
    3
  )
  RETURNING id INTO v_module_3_id;

  -- Module 3 Lessons
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_3_id, 'Why Trust Closes Faster Than Price', 1,
    E'Most customers don''t price-shop. They **trust-shop**.\n\nThey ask:\n- "Do I feel safe?"\n- "Do I feel confident?"\n\nWhen trust is high, price becomes secondary.\n\n**Autopilot systems build trust before the first conversation.**',
    5
  ),
  (
    v_module_3_id, 'The Role of Reviews in Closing Sales', 2,
    E'Reviews answer objections before you speak.\n\nThey say:\n- "This business shows up."\n- "They do what they say."\n\n**When reviews are visible everywhere, sales calls get shorter.**\n\nThat''s autopilot working for you.',
    5
  ),
  (
    v_module_3_id, 'Showing Proof Without Testimonials', 3,
    E'You don''t always need written testimonials.\n\nProof can be:\n- Photos\n- Screenshots\n- Results\n- Timelines\n- Behind-the-scenes clips\n\n**Proof removes doubt. Doubt is what kills sales.**',
    5
  ),
  (
    v_module_3_id, 'Consistency Beats Perfection', 4,
    E'Perfect marketing rarely exists. Consistent marketing always wins.\n\nAutopilot systems focus on:\n- Repeatable actions\n- Simple updates\n- Steady presence\n\n**Small actions done weekly beat big actions done once.**',
    5
  ),
  (
    v_module_3_id, 'Pricing Conversations Made Easy', 5,
    E'When trust is built early, pricing becomes simple.\n\nCustomers aren''t asking: "Why are you expensive?"\n\nThey''re asking: "When can you start?"\n\n**Autopilot trust makes pricing conversations calm — not stressful.**',
    6
  );

  -- MODULE 4: FOLLOW-UP THAT RUNS WITHOUT YOU
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Follow-Up That Runs Without You',
    'Build automated follow-up systems that feel personal and convert prospects without manual effort.',
    4
  )
  RETURNING id INTO v_module_4_id;

  -- Module 4 Lessons
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_4_id, 'Why Most Businesses Lose Sales After First Contact', 1,
    E'Most sales are lost after the first conversation.\n\nNot because of price — but because of **silence**.\n\n**Autopilot businesses follow up automatically.**\n\nNo awkward chasing. No forgetting. Just helpful reminders.',
    5
  ),
  (
    v_module_4_id, 'Simple Follow-Up That Feels Human', 2,
    E'Follow-up doesn''t have to feel robotic.\n\nIt can be:\n- "Just checking in."\n- "Let me know if you have questions."\n\n**When automated properly, follow-up feels thoughtful — not spammy.**',
    5
  ),
  (
    v_module_4_id, 'Timing Matters More Than Frequency', 3,
    E'The right message at the wrong time fails.\n\nAutopilot systems follow timing rules:\n- Same day\n- Next day\n- One week later\n\n**This keeps your business top of mind without being annoying.**',
    5
  ),
  (
    v_module_4_id, 'Turning "Maybe Later" Into Yes', 4,
    E'"Not right now" doesn''t mean no.\n\nIt means: "I''m not ready yet."\n\n**Autopilot follow-up catches people when they become ready.**\n\nThat''s where most businesses miss out.',
    5
  ),
  (
    v_module_4_id, 'Follow-Up Is Customer Service', 5,
    E'Good follow-up isn''t sales pressure. It''s **service**.\n\nYou''re helping customers remember a decision they already wanted to make.\n\nThat''s autopilot done right.',
    5
  );

  -- MODULE 5: SYSTEMS THAT SCALE WITHOUT BURNOUT
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Systems That Scale Without Burnout',
    'Create documented processes and repeatable systems that allow your business to grow without overwhelming you.',
    5
  )
  RETURNING id INTO v_module_5_id;

  -- Module 5 Lessons
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_5_id, 'Why Hustle Breaks Businesses', 1,
    E'Hustle works short-term. It fails long-term.\n\n**Autopilot systems reduce burnout by removing decision fatigue.**\n\nYou stop guessing. You start running playbooks.',
    5
  ),
  (
    v_module_5_id, 'Document Once, Use Forever', 2,
    E'Every process you repeat should be documented once.\n\n- Booking\n- Follow-up\n- Reviews\n\n**Autopilot businesses don''t rely on memory. They rely on systems.**',
    5
  ),
  (
    v_module_5_id, 'Delegation Without Chaos', 3,
    E'Systems make delegation easy.\n\nWhen processes are clear, anyone can help.\n\n**This is how businesses grow without losing control.**',
    5
  ),
  (
    v_module_5_id, 'Measuring What Actually Matters', 4,
    E'Autopilot businesses track:\n- Calls\n- Bookings\n- Reviews\n- Repeat customers\n\nNot vanity metrics.\n\n**Clarity replaces stress.**',
    5
  ),
  (
    v_module_5_id, 'Growth That Feels Predictable', 5,
    E'Predictable growth isn''t boring. It''s **freeing**.\n\nYou can plan. You can hire. You can breathe.\n\nThat''s the real goal of autopilot.',
    5
  );

  -- MODULE 6: TURNING THIS INTO A LONG-TERM ADVANTAGE
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Turning This Into a Long-Term Advantage',
    'Make autopilot systems your competitive advantage and build a business that competitors can''t easily copy.',
    6
  )
  RETURNING id INTO v_module_6_id;

  -- Module 6 Lessons
  INSERT INTO course_lessons (module_id, title, lesson_index, content_md, video_duration_minutes)
  VALUES (
    v_module_6_id, 'Why Most Competitors Never Catch Up', 1,
    E'Most businesses never build systems. They rely on effort instead of structure.\n\n**Once autopilot is running, competitors can''t easily copy it.**',
    5
  ),
  (
    v_module_6_id, 'Staying Consistent Even When Busy', 2,
    E'The busiest businesses often stop marketing.\n\n**Autopilot prevents that.**\n\nSystems keep running when you''re focused elsewhere.',
    5
  ),
  (
    v_module_6_id, 'Building a Brand People Recognize', 3,
    E'Recognition builds trust. Trust builds sales.\n\n**Autopilot branding makes your business familiar before first contact.**',
    5
  ),
  (
    v_module_6_id, 'When to Add Advanced Tools', 4,
    E'Tools don''t create growth. Systems do.\n\n**Add advanced tools after fundamentals are solid.**\n\nOtherwise, complexity slows you down.',
    5
  ),
  (
    v_module_6_id, 'The Autopilot Mindset', 5,
    E'Autopilot isn''t about doing less.\n\nIt''s about doing the right things once — and letting them work for you.\n\n**Businesses that win long-term think in systems, not sprints.**',
    6
  );

END $$;
