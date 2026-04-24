/*
  # Seed: Local-Link Partner Launch Academy — 10-Module Onboarding Track

  Creates the core partner onboarding course that every new partner should complete.
  Covers how the platform works, the commission plan, dashboard usage, first sale
  system, selling all product lines, marketing kit, recruiting, and scaling.

  New Data:
  - academy_courses: 1 new course (slug: partner-launch-academy)
  - academy_modules: 10 modules
  - academy_lessons: ~30 lessons (content_type: 'text')

  Modules:
  1. Welcome and How the Platform Works
  2. Your Commission Plan
  3. Using Your Partner Dashboard
  4. The First Sale System (Day 1–7)
  5. Selling Merchant Plans
  6. Selling 1Hub CRM / CPA
  7. Selling Visibility Products
  8. Using the Marketing Kit
  9. Recruit Partners and Earn Overrides
  10. Your 90-Day Scale Plan
*/

DO $$
DECLARE
  v_course_id uuid;
  v_mod1 uuid; v_mod2 uuid; v_mod3 uuid; v_mod4 uuid; v_mod5 uuid;
  v_mod6 uuid; v_mod7 uuid; v_mod8 uuid; v_mod9 uuid; v_mod10 uuid;
BEGIN

  INSERT INTO academy_courses (
    id, slug, title, subtitle, description, target_audience, audience,
    difficulty_level, is_free, is_published, display_order
  ) VALUES (
    gen_random_uuid(),
    'partner-launch-academy',
    'Local-Link Partner Launch Academy',
    'Your Complete Guide to Earning from Day One',
    'Everything you need to launch your partner business. Ten focused modules cover the platform, your commission plan, how to use your dashboard, the proven first-sale system, how to sell every product line, your marketing kit, recruiting, and your 90-day scale plan. Complete this course before you start prospecting.',
    'partner',
    'partner',
    'beginner',
    true,
    true,
    10
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    is_published = true
  RETURNING id INTO v_course_id;

  -- MODULE 1: Welcome and How the Platform Works
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Welcome and How the Platform Works', 'Understand what Local-Link is, how you fit in, and what you are selling.', 1)
  RETURNING id INTO v_mod1;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod1, v_course_id, 'pla-what-is-locallink', 'What Is Local-Link?', 'text',
     'Local-Link is a growth platform for local businesses. Merchants subscribe to get access to a deals marketplace, customer loyalty tools, digital marketing services, CRM software, AI tools, and more. As a partner, you introduce local business owners to the platform and earn commissions every time they subscribe or buy a product. The platform is designed so that once a merchant joins, they keep paying because it drives real results for their business.',
     1, true, 5),
    (gen_random_uuid(), v_mod1, v_course_id, 'pla-partner-role', 'Your Role as a Partner', 'text',
     'You are a local growth advisor. You identify business owners who need more customers, better tools, or a smarter way to manage their operations. You introduce them to the right Local-Link solution, help them get started, and earn a recurring commission as long as they stay active. You do not build anything, you do not provide support, and you do not manage fulfillment. Your job is to connect and close.',
     2, true, 4),
    (gen_random_uuid(), v_mod1, v_course_id, 'pla-what-you-sell', 'What You Are Selling (Product Overview)', 'text',
     'The four main product lines you will sell: 1. Merchant Subscriptions ($197–$597/month) — the core marketplace membership that gives businesses their deals page, loyalty program, and customer tools. 2. 1Hub CRM ($197–$597/month business, $497–$4,997/month CPA firms) — all-in-one business software. 3. Visibility Products — DFY ad campaigns, social media management, reputation management, postcard marketing. 4. Partner Subscriptions — recruit other partners and earn overrides on their sales.',
     3, false, 6);

  -- MODULE 2: Your Commission Plan
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Your Commission Plan', 'Understand exactly what you earn on every product and when you get paid.', 2)
  RETURNING id INTO v_mod2;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod2, v_course_id, 'pla-tier-rates', 'Tier Rates: Starter Through Enterprise', 'text',
     'Your commission rate is based on your partner tier. Starter (49/month): 10% on most products. Growth (99/month): 15%. Pro (149/month): 20%. Enterprise (299/month): 25%. Your tier rate applies to Merchant Subscriptions and most marketplace products. 1Hub CRM always pays 30% regardless of tier — that is why it is the highest-priority product to sell.',
     1, false, 5),
    (gen_random_uuid(), v_mod2, v_course_id, 'pla-recurring-vs-onetime', 'Recurring vs. One-Time Commissions', 'text',
     'Merchant subscriptions pay first-month commission only (not recurring). 1Hub CRM pays 30% recurring every month. DFY services pay your tier rate one time on the sale. The fastest way to build passive income is to stack 1Hub CRM clients. Ten clients at the Pro tier earns you $891/month before you make another sale.',
     2, false, 5),
    (gen_random_uuid(), v_mod2, v_course_id, 'pla-override-system', '7% Override on Recruited Partners', 'text',
     'When you recruit a partner and that partner makes sales, you earn 7% of their commissionable amount automatically. This is paid on top of your own earnings. Example: your recruit earns $500 this month. You earn $35 in override with zero extra work. Overrides apply to all product types. There is no limit on how many partners you can recruit.',
     3, false, 5),
    (gen_random_uuid(), v_mod2, v_course_id, 'pla-payout-mechanics', 'Payout Mechanics and Schedule', 'text',
     'Commissions are calculated weekly. Payouts go out every Friday via Stripe Connect for the prior week. Minimum threshold is $50 — balances below that roll forward. You must complete Stripe Connect setup in your Partner Dashboard before you can receive funds. Go to Dashboard, then Earnings, then Set Up Payouts. Setup takes 5–10 minutes.',
     4, false, 4);

  -- MODULE 3: Using Your Partner Dashboard
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Using Your Partner Dashboard', 'Navigate every section of your dashboard and know where to find what you need.', 3)
  RETURNING id INTO v_mod3;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod3, v_course_id, 'pla-dashboard-kpis', 'Reading Your KPI Cards', 'text',
     'Your dashboard shows four key numbers at the top: Earnings This Month, Pending Commission (earned but not yet paid out), Active Subscriptions Sold (number of currently active clients you referred), and Conversion Rate (percentage of clicks that became sales). Check these weekly. If your conversion rate drops, focus on improving your demo. If active subscriptions drop, a client churned — reach out to re-engage them.',
     1, false, 5),
    (gen_random_uuid(), v_mod3, v_course_id, 'pla-referral-links', 'Your Referral Links and Tracking', 'text',
     'Every sale must come through your tracked link to be credited to you. Your links are in Dashboard under Referral Links. You have a main link (locallinkmarketplace.com/{your-slug}) and product-specific links for /merchant, /1hub, /cpa, and /join. Use the /merchant link when talking to business owners about subscriptions. Use /1hub for CRM prospects. Use /cpa for accounting firms. Use /join for recruiting partners.',
     2, false, 5),
    (gen_random_uuid(), v_mod3, v_course_id, 'pla-dashboard-funnel', 'Understanding Your Funnel', 'text',
     'The funnel on your dashboard shows: Clicks (total link visits), Leads (people who started a form or trial), and Sales (completed purchases). Industry average is 1–3% clicks-to-sales. If you have 100 clicks and 0 sales, the problem is usually targeting or the landing page. If you have 20 leads and 0 sales, the problem is follow-up or your close. Know which stage your funnel is breaking down and fix that one thing.',
     3, false, 5);

  -- MODULE 4: The First Sale System (Day 1–7)
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'The First Sale System (Day 1–7)', 'A proven day-by-day plan to get your first commission within 7 days.', 4)
  RETURNING id INTO v_mod4;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod4, v_course_id, 'pla-day0-setup', 'Day 0: Complete Your Setup (Before You Prospect)', 'text',
     'Before you contact a single prospect, complete these four things: 1. Set up Stripe Connect in Dashboard under Earnings so you can receive your commission. 2. Copy your tracked links from Dashboard under Referral Links. 3. Download the Marketing Kit from Dashboard under Marketing Kit — you will need the ad copy and post templates. 4. Complete modules 1–3 of this course. Setup takes 30–60 minutes. Do not skip it.',
     1, false, 5),
    (gen_random_uuid(), v_mod4, v_course_id, 'pla-day1-warm-list', 'Day 1: Your Warm List (Start Here)', 'text',
     'Write down 20 local business owners you already know. This is your warm list. These are people who already trust you, so the close rate is 3–5x higher than cold outreach. Categories to pull from: friends who own businesses, former coworkers, businesses you are a customer of, people from church/community, neighbors. Do not pre-qualify too hard. Write the 20 names first, then prioritize.',
     2, false, 6),
    (gen_random_uuid(), v_mod4, v_course_id, 'pla-day2-first-outreach', 'Day 2–3: First Outreach Message', 'text',
     'Text or DM the top 10 on your list. Use this exact message: "Hey [Name], quick question — are you open to seeing a new tool that a lot of [local business type] owners are using to get more customers and simplify their operations? I can show you in 10 minutes." Do not explain the platform. Do not use the word "software." Your only goal is to get a yes to a demo. Send 10 messages. Aim for 3–5 yeses.',
     3, false, 6),
    (gen_random_uuid(), v_mod4, v_course_id, 'pla-day4-demos', 'Day 4–5: Run Your Demos', 'text',
     'Run your demos in person or on a video call. Use the 15-minute structure: 2 minutes discovery, 7 minutes showing the one feature that solves their pain, 5 minutes close. Do not over-explain. Do not try to demo everything. After the demo, send the recap email the same day with your tracked link. Follow up on Day 3, Day 7, and Day 14 as needed.',
     4, false, 6),
    (gen_random_uuid(), v_mod4, v_course_id, 'pla-day6-first-commission', 'Day 6–7: First Commission', 'text',
     'If you ran 3–5 demos from your warm list, you should have at least 1 close by Day 7. When a merchant signs up through your tracked link, your commission appears in your dashboard within 24 hours as Pending. It moves to Available on the next Friday payout. Your first goal is not to earn the most money — it is to prove to yourself that the system works. One close changes everything.',
     5, false, 5);

  -- MODULE 5: Selling Merchant Plans
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Selling Merchant Plans', 'How to position and close Local-Link merchant subscriptions.', 5)
  RETURNING id INTO v_mod5;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod5, v_course_id, 'pla-merchant-tiers', 'The Four Merchant Tiers', 'text',
     'Starter ($197/month): Basic marketplace listing, loyalty program, and customer engagement tools. Growth ($297/month): All Starter features plus CRM access, email marketing, and advanced analytics. Pro ($397/month): All Growth features plus DFY campaigns, AI tools, and priority support. Enterprise ($597/month): All Pro features plus white-label options and dedicated success manager. Start by recommending Growth for most businesses — it has the best value and lowest churn.',
     1, false, 6),
    (gen_random_uuid(), v_mod5, v_course_id, 'pla-merchant-pitch', 'The Merchant Pitch (2 Minutes)', 'text',
     '"[Business Name] already has great products/services. The problem is most people in [city] do not know you exist, and the ones who do visit once and never come back. Local-Link puts you in front of active local shoppers, gives you a loyalty program that brings them back, and gives you the tools to follow up automatically. It is [price] a month. Most merchants see ROI in the first 30 days." Then show the demo. That is the whole pitch.',
     2, false, 5),
    (gen_random_uuid(), v_mod5, v_course_id, 'pla-merchant-best-verticals', 'Best Verticals for Merchant Sales', 'text',
     'Highest close rates: restaurants and food businesses (everyone wants more repeat customers), salons and spas (loyalty and booking are huge pain points), fitness studios and gyms, home services (HVAC, plumbing, cleaning — they need the CRM), and retail shops. Lowest close rates: businesses that are already at capacity, very new businesses with no customer base, and businesses with no marketing budget. Focus your time on established businesses with 6+ months of operation.',
     3, false, 5);

  -- MODULE 6: Selling 1Hub CRM / CPA
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Selling 1Hub CRM / CPA', 'How to position and close 1Hub deals for 30% recurring commission.', 6)
  RETURNING id INTO v_mod6;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod6, v_course_id, 'pla-1hub-why-priority', 'Why 1Hub Is Your Highest-Priority Product', 'text',
     '1Hub is the only product that pays 30% recurring every month. A single Business CRM Pro client at $297/month earns you $89.10/month — forever. A CPA Growth client at $997/month earns you $299.10/month — forever. No other product compounds your income like this. After your first merchant sale, your second focus should always be finding 1Hub clients.',
     1, false, 5),
    (gen_random_uuid(), v_mod6, v_course_id, 'pla-1hub-who-to-approach', 'Who to Approach for 1Hub', 'text',
     'Business CRM targets: any service business with a team (2–20 employees) that juggles multiple software tools. CPA firm targets: small-to-mid accounting and bookkeeping firms drowning in email and document management. The key question to qualify both: "How many different tools do you use to manage clients and billing right now?" Anyone with 3+ tools is a strong 1Hub prospect.',
     2, false, 5),
    (gen_random_uuid(), v_mod6, v_course_id, 'pla-1hub-full-training-link', 'Complete 1Hub Training', 'text',
     'For the full 1Hub sales system — including pricing, word-for-word scripts, objection handling, demo walkthrough, and a complete follow-up sequence — complete the dedicated 1Hub track in your Academy. Navigate to Academy, then find "Sell 1Hub CRM / CPA." That course has 10 modules specifically focused on closing 1Hub deals. This module is an overview. The full course is where you will get certified.',
     3, false, 3);

  -- MODULE 7: Selling Visibility Products
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Selling Visibility Products', 'Add-on products that increase your commission per merchant.', 7)
  RETURNING id INTO v_mod7;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod7, v_course_id, 'pla-visibility-what-is-it', 'What Are Visibility Products?', 'text',
     'Visibility products are done-for-you marketing services that merchants buy on top of their subscription. They include: DFY Facebook and Instagram ad campaigns, DFY Google ads, social media content management, reputation management and review building, postcard and direct mail campaigns, and website design and SEO. These are one-time or monthly add-ons. You earn your tier rate on every sale.',
     1, false, 5),
    (gen_random_uuid(), v_mod7, v_course_id, 'pla-visibility-when-to-pitch', 'When to Pitch Visibility Products', 'text',
     'The best time to pitch a visibility product is immediately after a merchant has been active for 30 days. They have seen the platform work. Now they want more. Ask: "Now that you are set up, are you running any paid ads right now?" If the answer is no or not really: "We have a done-for-you ad service where our team builds and manages your campaigns. Most merchants who add this see a 2–3x increase in deal redemptions. Want to see what that looks like?"',
     2, false, 5),
    (gen_random_uuid(), v_mod7, v_course_id, 'pla-visibility-stacking', 'Stacking Multiple Add-Ons', 'text',
     'A merchant on the Growth plan ($297/month) who also buys DFY social ($299/month) and reputation management ($149/month) is now paying $745/month. At your Pro tier rate of 20%, that is $149/month from one client. The goal is not to upsell aggressively — it is to solve real problems. Listen for the pain ("I am not getting enough new customers" = ads, "My reviews are bad" = reputation management) and recommend the product that solves that specific problem.',
     3, false, 5);

  -- MODULE 8: Using the Marketing Kit
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Using the Marketing Kit', 'Everything you need to generate leads without starting from scratch.', 8)
  RETURNING id INTO v_mod8;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod8, v_course_id, 'pla-kit-whats-included', 'What Is in the Marketing Kit', 'text',
     'Your Marketing Kit (Dashboard under Marketing Kit) includes: Facebook and Instagram ad copy for each product line, social media post templates (10 posts per product), email outreach templates (cold and warm), SMS templates, short video scripts, Canva design templates, and your tracked QR codes. Everything is pre-written and ready to customize with your name and tracked links.',
     1, false, 5),
    (gen_random_uuid(), v_mod8, v_course_id, 'pla-kit-fastest-start', 'Fastest Way to Start Generating Leads', 'text',
     'Week 1 priority: post 3 social media posts from the kit to your personal Facebook and LinkedIn. Use the merchant-focused post templates. Include your tracked /merchant link. This costs nothing and takes 15 minutes. If you get even one inbound message from someone who asks "what is this?" that is a warm prospect. Week 2: run a $5/day Facebook ad using the ad copy from the kit targeted to business owners in your city.',
     2, false, 6),
    (gen_random_uuid(), v_mod8, v_course_id, 'pla-kit-qr-codes', 'Using QR Codes for In-Person Prospecting', 'text',
     'Your dashboard generates a QR code linked to your main referral link. Download it and print it on a 3x5 card or include it in any printed material. When you meet a business owner in person, show them the QR code: "Scan this and it takes you directly to the platform overview page." It is a professional touch that makes the conversation feel easier and removes the need to type a long URL. Find your QR code in Dashboard under Referral Links.',
     3, false, 4);

  -- MODULE 9: Recruit Partners and Earn Overrides
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Recruit Partners and Earn Overrides', 'Build a team and earn 7% on everything they sell.', 9)
  RETURNING id INTO v_mod9;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod9, v_course_id, 'pla-recruit-why', 'Why Recruiting Partners Multiplies Your Income', 'text',
     'When you sell, you earn once. When a partner you recruited sells, you earn 7% on their commissionable amount every time they do — with no extra work on your part. If you recruit 5 active partners who each earn $1,000/month in commissions, you earn $350/month in overrides on top of your own sales. At 10 active partners earning $1,500/month each, you earn $1,050/month in overrides. This is the multiplier that separates top earners from average earners.',
     1, false, 5),
    (gen_random_uuid(), v_mod9, v_course_id, 'pla-recruit-who', 'Who Makes a Great Partner', 'text',
     'Best partner recruits: salespeople who already call on local businesses (insurance agents, payroll reps, marketing consultants), real estate agents (they know every business owner in town), retired business owners who want income without a job, people already promoting local businesses on social media, and networkers who attend Chamber or BNI events. The best predictor of success is whether they already talk to business owners regularly.',
     2, false, 5),
    (gen_random_uuid(), v_mod9, v_course_id, 'pla-recruit-pitch', 'How to Pitch the Partner Opportunity', 'text',
     'Keep it simple: "I work with a platform that pays you every time you refer a local business to their software. No inventory, no support, no delivery — just introductions. The commission is 10–25% depending on your plan, and 1Hub CRM pays 30% recurring. I am building a small team in [city]. Want to see how it works?" Send them to your /join tracked link for the partner overview page. Then follow up within 48 hours.',
     3, false, 5);

  -- MODULE 10: Your 90-Day Scale Plan
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Your 90-Day Scale Plan', 'A concrete roadmap from $0 to $3,000+/month in commissions.', 10)
  RETURNING id INTO v_mod10;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod10, v_course_id, 'pla-month1-goal', 'Month 1: First 3 Clients', 'text',
     'Month 1 goal: close 3 merchants (warm list outreach) and complete the 1Hub CRM course. Target income: $100–$300 in first-month commissions. Actions: complete your setup (Day 0), work through your 20-person warm list, run demos, make your first sales. Secondary action: post 3 social media posts per week using the marketing kit to start building inbound awareness. Do not start cold outreach until you have closed at least 1 warm deal.',
     1, false, 6),
    (gen_random_uuid(), v_mod10, v_course_id, 'pla-month2-goal', 'Month 2: First 1Hub Client + Start Recruiting', 'text',
     'Month 2 goal: close your first 1Hub CRM client and recruit 1–2 partners. Target income: $300–$800/month (combination of first-month merchant commissions + 1Hub recurring). Actions: prospect for 1Hub clients using the "who to approach" criteria from the 1Hub course, run 5–10 demos focused on 1Hub, start having recruiting conversations with 3–5 people in your network who call on businesses.',
     2, false, 6),
    (gen_random_uuid(), v_mod10, v_course_id, 'pla-month3-goal', 'Month 3: Stack and Scale', 'text',
     'Month 3 goal: 5+ active 1Hub clients, 10+ merchant subscriptions sold, 2+ recruited partners active. Target income: $1,500–$3,000+/month. By month 3, your income should be a combination of: 1Hub recurring commissions (growing monthly), first-month merchant commissions (from ongoing prospecting), override commissions from your recruited partners, and upsell commissions from visibility products. Review your funnel metrics. Double down on what is working and cut what is not.',
     3, false, 6),
    (gen_random_uuid(), v_mod10, v_course_id, 'pla-next-steps', 'Your Next Steps After This Course', 'text',
     'Immediately after completing this course: 1. Set up Stripe Connect if you have not already. 2. Copy your tracked links and save them somewhere accessible. 3. Write your 20-person warm list. 4. Post your first social media post using the marketing kit. 5. Complete the full 1Hub CRM / CPA course to get certified on the highest-commission product. Your partner dashboard tracks your progress. Check it weekly and use the numbers to guide where you focus your time.',
     4, false, 5);

END $$;
