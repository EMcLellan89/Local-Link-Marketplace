/*
  # Seed: Sell 1Hub CRM / CPA — Partner Academy Track

  Creates a full 10-module course teaching partners how to sell 1Hub CRM and CPA firm packages.
  Partners earn 30% recurring commission + 7% override on recruits.

  New Tables/Data:
  - academy_courses: 1 new course (slug: sell-1hub-crm-cpa)
  - academy_modules: 10 modules
  - academy_lessons: ~35 lessons (content_type: 'text', valid enum value)

  Modules:
  1. What 1Hub CRM/CPA Is
  2. Who to Sell It To
  3. 1Hub Business CRM Pricing
  4. 1Hub CPA Firm Pricing
  5. Commission Training
  6. Sales Scripts
  7. Objection Handling
  8. Demo Walkthrough
  9. Ads + Referral Links
  10. Follow-Up System
*/

DO $$
DECLARE
  v_course_id uuid;
  v_mod1 uuid; v_mod2 uuid; v_mod3 uuid; v_mod4 uuid; v_mod5 uuid;
  v_mod6 uuid; v_mod7 uuid; v_mod8 uuid; v_mod9 uuid; v_mod10 uuid;
BEGIN

  -- Insert course (no 'category' column; use target_audience/audience enums)
  INSERT INTO academy_courses (
    id, slug, title, subtitle, description, target_audience, audience,
    difficulty_level, is_free, is_published, display_order
  ) VALUES (
    gen_random_uuid(),
    'sell-1hub-crm-cpa',
    'Sell 1Hub CRM / CPA',
    'High-Ticket Track — Earn 30% Recurring Commission',
    'Learn how to sell 1Hub CRM to local businesses and CPA/accounting firms. Earn 30% recurring commission every month your client stays active. This high-ticket track covers pricing, scripts, objections, demos, and a complete follow-up system.',
    'partner',
    'partner',
    'intermediate',
    true,
    true,
    50
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    is_published = true
  RETURNING id INTO v_course_id;

  -- MODULE 1
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'What 1Hub CRM/CPA Is', 'Understand the product you are selling — the full feature set and value proposition.', 1)
  RETURNING id INTO v_mod1;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod1, v_course_id, '1hub-what-is-crm', 'What Is 1Hub CRM?', 'text',
     '1Hub CRM is an all-in-one business platform that replaces 5–10 separate tools. It includes: contacts and pipeline management, invoicing and payments, appointment scheduling, email and SMS automation, reputation management (review requests), and AI-powered follow-up. It is built for local businesses that want to stop juggling multiple subscriptions and get everything in one login.',
     1, true, 5),
    (gen_random_uuid(), v_mod1, v_course_id, '1hub-cpa-module', 'The CPA / Accounting Firm Module', 'text',
     'The CPA version of 1Hub adds: client portal with document upload, tax deadline tracking, engagement letter automation, billing and retainer management, payroll integration hooks, and a white-label client-facing dashboard. CPA firms save 8–12 hours per week per staff member and can onboard clients 3x faster.',
     2, false, 5),
    (gen_random_uuid(), v_mod1, v_course_id, '1hub-why-partners-love-it', 'Why Partners Love 1Hub', 'text',
     'You earn 30% recurring every month your client is active. On a $297/mo Business CRM client that is $89.10/month, every month. Sign 10 clients and you have $891/month in passive income. The platform has near-zero churn because businesses build their entire workflow inside it.',
     3, false, 4);

  -- MODULE 2
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Who to Sell It To', 'Identify the best prospects for 1Hub CRM and CPA packages.', 2)
  RETURNING id INTO v_mod2;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod2, v_course_id, '1hub-ideal-business-customers', 'Ideal Business CRM Customers', 'text',
     'Best-fit businesses: service businesses with 1–20 employees (HVAC, plumbing, cleaning, salons, med spas, dental, chiro), any business using separate tools for CRM plus invoicing plus scheduling plus email marketing, businesses spending $300–$800/month across multiple software subscriptions. Red flags: businesses under 6 months old, e-commerce only, or companies with dedicated IT departments already locked into enterprise software.',
     1, false, 6),
    (gen_random_uuid(), v_mod2, v_course_id, '1hub-ideal-cpa-customers', 'Ideal CPA / Accounting Firm Customers', 'text',
     'Best-fit CPA prospects: small-to-mid CPA firms (2–25 staff), bookkeeping firms, enrolled agents, tax preparation businesses, accounting firms drowning in email and spreadsheets. They are paying for separate tools: client portal, billing software, document management, scheduling. 1Hub consolidates all of this. Average deal size is $497–$997/month.',
     2, false, 6),
    (gen_random_uuid(), v_mod2, v_course_id, '1hub-where-to-find-prospects', 'Where to Find Your Prospects', 'text',
     'Business owners: your existing merchant clients, Chamber of Commerce events, BNI networking groups, Facebook business groups, Google Maps searches for local service businesses. CPA firms: LinkedIn search "CPA firm [city]", accountant Facebook groups, local AICPA chapter events, referrals from existing business clients. Your referral link: locallinkmarketplace.com/{your-slug}/1hub',
     3, false, 5);

  -- MODULE 3
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, '1Hub Business CRM Pricing', 'Know every price point cold — monthly fees and setup fees for all Business CRM tiers.', 3)
  RETURNING id INTO v_mod3;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod3, v_course_id, '1hub-biz-starter', 'Business CRM Starter — $197/mo + $499 Setup', 'text',
     'Starter tier: $197/month recurring + $499 one-time setup fee. Includes: up to 2,500 contacts, 1 pipeline, invoicing, appointment booking, email automation (500 sends/mo), review requests, basic reporting. Best for solo operators and very small teams. Your commission: $59.10/month recurring + $149.70 on setup fee.',
     1, false, 5),
    (gen_random_uuid(), v_mod3, v_course_id, '1hub-biz-pro', 'Business CRM Pro — $297/mo + $2,500 Setup', 'text',
     'Pro tier: $297/month recurring + $2,500 one-time setup fee. Includes: up to 10,000 contacts, unlimited pipelines, full invoicing and payment processing, advanced automation, SMS campaigns, reputation management, team access (up to 5 users), custom reporting. Best for established local businesses with a team. Your commission: $89.10/month recurring + $750 on setup fee.',
     2, false, 5),
    (gen_random_uuid(), v_mod3, v_course_id, '1hub-biz-growth', 'Business CRM Growth — $597/mo + $7,500 Setup', 'text',
     'Growth tier: $597/month recurring + $7,500 one-time setup fee. Includes: unlimited contacts, all Pro features plus white-label client portal, API access, dedicated onboarding specialist, priority support, custom integrations. Best for scaling businesses and multi-location operators. Your commission: $179.10/month recurring + $2,250 on setup fee.',
     3, false, 5);

  -- MODULE 4
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, '1Hub CPA Firm Pricing', 'Know every price point for CPA and accounting firm packages.', 4)
  RETURNING id INTO v_mod4;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod4, v_course_id, '1hub-cpa-starter', 'CPA Starter — $497/mo + $499 Setup', 'text',
     'CPA Starter: $497/month recurring + $499 one-time setup. Up to 50 clients, client portal, document upload, deadline tracking, billing and retainer management, basic engagement letter templates. Your commission: $149.10/month recurring + $149.70 on setup.',
     1, false, 5),
    (gen_random_uuid(), v_mod4, v_course_id, '1hub-cpa-growth', 'CPA Growth — $997/mo + $2,500 Setup', 'text',
     'CPA Growth: $997/month recurring + $2,500 one-time setup. Up to 200 clients, all Starter features plus payroll integration hooks, advanced automation, team collaboration tools (up to 10 users), custom client onboarding workflows. Your commission: $299.10/month recurring + $750 on setup.',
     2, false, 5),
    (gen_random_uuid(), v_mod4, v_course_id, '1hub-cpa-pro', 'CPA Pro — $1,997/mo + $7,500 Setup', 'text',
     'CPA Pro: $1,997/month recurring + $7,500 one-time setup. Unlimited clients, all Growth features plus white-label portal, API access, dedicated account manager, custom integrations, multi-location support. Your commission: $599.10/month recurring + $2,250 on setup.',
     3, false, 5),
    (gen_random_uuid(), v_mod4, v_course_id, '1hub-cpa-enterprise', 'CPA Enterprise — $4,997/mo + $7,500 Setup', 'text',
     'CPA Enterprise: $4,997/month recurring + $7,500 one-time setup. Designed for large firms and regional accounting groups. All Pro features plus custom SLA, dedicated infrastructure, enterprise SSO, compliance reporting. Your commission: $1,499.10/month recurring + $2,250 on setup. One Enterprise client equals $17,989/year in commissions.',
     4, false, 5);

  -- MODULE 5
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Commission Training', 'Understand exactly how and when you get paid.', 5)
  RETURNING id INTO v_mod5;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod5, v_course_id, '1hub-30pct-recurring', '30% Recurring Commission Explained', 'text',
     '1Hub pays 30% recurring, meaning you earn every single month that your client is active. Example: You close a Business CRM Pro client at $297/month. You earn $89.10 every month. After 12 months, that one client has paid you $1,069.20. Your commission is tracked automatically in your Partner Dashboard under Earnings.',
     1, false, 6),
    (gen_random_uuid(), v_mod5, v_course_id, '1hub-setup-fee-commission', 'Setup Fee Commission', 'text',
     'You also earn 30% of setup fees. Business CRM Pro setup fee: $2,500 x 30% = $750 paid out in the same payout cycle as first month. CPA Growth setup: $2,500 x 30% = $750. CPA Enterprise setup: $7,500 x 30% = $2,250. Setup fees are one-time but represent a significant immediate payout.',
     2, false, 5),
    (gen_random_uuid(), v_mod5, v_course_id, '1hub-7pct-override', '7% Override on Recruited Partners', 'text',
     'When you recruit another partner and that partner sells 1Hub, you earn 7% of their commissionable amount on top of your own. Example: Your recruit earns $300 in 1Hub commissions this month. You earn $21 as an override. This stacks with your own sales. The override applies to all product types, not just 1Hub.',
     3, false, 5),
    (gen_random_uuid(), v_mod5, v_course_id, '1hub-payout-schedule', 'Payout Schedule and Minimum', 'text',
     'Commissions are calculated weekly and paid via Stripe Connect every Friday for the prior week. Minimum payout threshold is $50. If your balance is below $50, it rolls to the next week. You must have Stripe Connect set up in your Partner Dashboard to receive funds. Navigate to Partner Dashboard, then Earnings, then Set Up Payouts.',
     4, false, 4);

  -- MODULE 6
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Sales Scripts', 'Word-for-word scripts for every prospect type.', 6)
  RETURNING id INTO v_mod6;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod6, v_course_id, '1hub-script-business-owner', 'Script: Business Owner Cold Approach', 'text',
     'Opening (in person or DM): "Hey [Name], quick question — how many different tools are you using right now to manage customers, send invoices, and follow up with leads?" Let them answer. "What if you could replace all of that with one login for under $300 a month? I work with a platform called 1Hub — built specifically for [their industry]. Can I show you a 10-minute demo this week?" Close: "Based on what you told me, the Pro plan would save you [X] per month compared to what you are paying now. Want me to set you up?"',
     1, false, 7),
    (gen_random_uuid(), v_mod6, v_course_id, '1hub-script-cpa-firm', 'Script: CPA Firm Owner', 'text',
     'Opening: "Hi [Name], I work with a client management platform that a lot of CPA firms in [city] are switching to. It replaces your client portal, billing software, and document management in one place. Most firms save 8–10 hours a week and reduce their software bill by $400–$600/month. Do you have 15 minutes for a demo?" Value bridge: "What are you currently using for client documents? For billing? For scheduling calls?" Map pain to 1Hub features. Close: "The Growth plan handles all of that at $997/month. Most firms make that back in the first 2 weeks of saved time."',
     2, false, 7),
    (gen_random_uuid(), v_mod6, v_course_id, '1hub-script-bookkeeper', 'Script: Bookkeeper / Accountant', 'text',
     'Bookkeepers and accountants (not firm owners) are often your path into a firm. Script: "Do you ever get frustrated with the number of tools your firm uses? A lot of bookkeepers I talk to spend 2–3 hours a week just chasing clients for documents and signatures. There is a platform that automates all of that. Would it be worth a quick look?" Ask them to connect you with the decision-maker: "If this looks good to you, is this something you could bring to your manager or the firm owner?"',
     3, false, 6);

  -- MODULE 7
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Objection Handling', 'Confident responses to every common objection.', 7)
  RETURNING id INTO v_mod7;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod7, v_course_id, '1hub-obj-too-expensive', 'Objection: "That is too expensive"', 'text',
     'Response: "I hear you. What are you currently paying for your CRM, your invoicing tool, your scheduling software, and your email marketing?" Pause for answer. "Most businesses I work with are paying $400–$800/month across those tools separately. 1Hub replaces all of them for $197–$297/month. So it is actually a savings, not an extra cost. Can I show you the breakdown?"',
     1, false, 5),
    (gen_random_uuid(), v_mod7, v_course_id, '1hub-obj-have-crm', 'Objection: "I already have a CRM"', 'text',
     'Response: "That is great. What CRM are you on?" Listen. "And does it also handle your invoicing? Your appointment booking? Your review requests?" They say no. "That is the difference. Most CRMs are contact databases. 1Hub is a full business operating system. You keep your contacts and we handle everything else your CRM does not do. Would a side-by-side comparison be helpful?"',
     2, false, 5),
    (gen_random_uuid(), v_mod7, v_course_id, '1hub-obj-use-quickbooks', 'Objection: "We use QuickBooks"', 'text',
     'Response: "QuickBooks is great for accounting. 1Hub is not trying to replace that. It handles the client-facing side: intake forms, scheduling, invoicing to clients, follow-up sequences, and review requests. A lot of clients use both. 1Hub has a QuickBooks sync so your payments flow right into your books. Want me to show you how that works?"',
     3, false, 5),
    (gen_random_uuid(), v_mod7, v_course_id, '1hub-obj-no-automation', 'Objection: "We do not need automation"', 'text',
     'Response: "I understand. Can I ask: how are you currently following up with leads who do not convert right away? And how do you request Google reviews from happy customers?" Listen. "That is exactly where automation earns its keep — the stuff that takes 5 minutes each time but needs to happen 50 times a week. Most business owners tell me they just do not get to it. 1Hub does it for you in the background."',
     4, false, 5);

  -- MODULE 8
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Demo Walkthrough', 'How to run a 15-minute demo that closes.', 8)
  RETURNING id INTO v_mod8;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod8, v_course_id, '1hub-demo-structure', 'The 15-Minute Demo Structure', 'text',
     'Minutes 0–2: Discovery. "Before I show you anything, tell me — what is your biggest frustration with managing customers right now?" Let them tell you the pain. Minutes 3–7: Show the ONE feature that solves their specific pain first. If they said follow-up is the problem, show the automation builder first. Minutes 8–12: Dashboard overview. Show the single login, the pipeline view, the inbox. Keep it high level. Minutes 13–15: Close. "Based on what you told me, the Pro plan fits best. It is $297/month and I can have you set up this week. Ready to get started?"',
     1, false, 8),
    (gen_random_uuid(), v_mod8, v_course_id, '1hub-demo-what-to-show', 'What to Show First (and What to Skip)', 'text',
     'Always show first: the unified inbox (all messages in one place), the pipeline view (visual deal tracking), and the automation trigger they care about most. Skip on first demo: advanced reporting, API settings, white-label options, billing configuration. Those create confusion and stall the close. The goal of the first demo is to get them to say "yes this solves my problem" — not to show every feature.',
     2, false, 6),
    (gen_random_uuid(), v_mod8, v_course_id, '1hub-demo-close', 'Closing After the Demo', 'text',
     'After the demo, use the assumptive close: "Which plan fits better for where you are right now — Starter or Pro?" Do not ask "Do you want to sign up?" That invites a no. Give them a choice between two yes options. If they say they need to think about it: "What is the one thing that would need to be true for this to be a yes?" Address that specific concern. Then: "If I can confirm that for you today, are you ready to get started?" Always end with a specific next step and date.',
     3, false, 7);

  -- MODULE 9
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Ads + Referral Links', 'Use your tracked links and ready-made ad copy to drive inbound leads.', 9)
  RETURNING id INTO v_mod9;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod9, v_course_id, '1hub-referral-links', 'Your 1Hub and CPA Referral Links', 'text',
     'Your tracked links — Business CRM: locallinkmarketplace.com/{your-slug}/1hub — CPA Firms: locallinkmarketplace.com/{your-slug}/cpa — Every click and signup through these links is attributed to you. Find your slug in Partner Dashboard under Referral Links. Copy your links from there and use them in all ads, posts, emails, and DMs.',
     1, false, 4),
    (gen_random_uuid(), v_mod9, v_course_id, '1hub-facebook-ads', 'Facebook Ad Copy for 1Hub', 'text',
     'Ad 1 (Business owners) — Headline: "Stop Paying for 5 Apps. Get 1Hub." Body: "Most local business owners are paying $400–$800/month for separate tools that do not talk to each other. 1Hub replaces your CRM, invoicing, scheduling, email marketing, and review requests in one login. Starting at $197/month." Use your tracked link. Ad 2 (CPA firms) — Headline: "Cut 10 Hours a Week from Client Management" Body: "1Hub is the all-in-one platform built for CPA firms. Client portal, billing, deadlines, document uploads — one login." Use your CPA tracked link.',
     2, false, 6),
    (gen_random_uuid(), v_mod9, v_course_id, '1hub-social-posts', 'Social Media Post Templates', 'text',
     'Post 1: "If you are running a local business and still using 3+ apps to manage customers, I want to show you something. Reply INFO and I will send you a quick overview." Post 2: "CPA firm owners — how much time does your team spend chasing clients for documents? I work with a platform that automates that. DM me." Post 3: "Just helped a [salon/HVAC/plumbing] owner replace $600/month in software with one tool at $297. Here is what changed for them: [short story]. Link in bio." Always send people to your tracked link.',
     3, false, 5);

  -- MODULE 10
  INSERT INTO academy_modules (id, course_id, title, description, display_order)
  VALUES (gen_random_uuid(), v_course_id, 'Follow-Up System', 'A complete email, SMS, and DM follow-up sequence to close more deals.', 10)
  RETURNING id INTO v_mod10;

  INSERT INTO academy_lessons (id, module_id, course_id, slug, title, content_type, article_content, display_order, is_preview, est_minutes)
  VALUES
    (gen_random_uuid(), v_mod10, v_course_id, '1hub-followup-email-sequence', 'Email Follow-Up Sequence (5 Emails)', 'text',
     'Email 1 (Same day after demo) — Subject: "Quick recap + your custom pricing" Body: "Thanks for taking the time today. Based on what you shared, the [Pro/Growth] plan is the best fit. Your pricing: $[X]/month + $[Y] setup. Ready to get started? [Link]" Email 2 (Day 3): "Did you get a chance to look at that? What is the one question you still have?" Email 3 (Day 7): "I can hold your onboarding slot through Friday. After that I cannot guarantee same-week setup." Email 4 (Day 14): Share a short win from another client in their industry. Email 5 (Day 30): "I know the timing was not right. When things change, I am here."',
     1, false, 8),
    (gen_random_uuid(), v_mod10, v_course_id, '1hub-followup-sms', 'SMS Follow-Up Templates', 'text',
     'SMS 1 (1 hour after demo): "Hey [Name], great talking with you. I sent a recap to your email — let me know if you have questions." SMS 2 (Day 2): "Did you get a chance to look at the 1Hub recap I sent? Happy to answer questions over text." SMS 3 (Day 5): "Hey [Name] — I have two onboarding slots open this week. Want one of them?" Keep SMS short. Never pitch in the first text. Use texts to move the conversation, not to sell.',
     2, false, 6),
    (gen_random_uuid(), v_mod10, v_course_id, '1hub-followup-dm', 'DM Follow-Up for Social Media', 'text',
     'LinkedIn/Facebook DM sequence — DM 1 (connection/follow request): "Hey [Name], I work with a lot of [their industry] owners in [city]. Followed you to stay in touch." DM 2 (2–3 days later): "I saw your post about [relevant topic]. I work with a platform that helps with exactly that — mind if I share a quick overview?" DM 3 (after they show interest): "Here is a 2-minute video overview and a link to book a quick call: [your tracked link]." Do not pitch in DM 1. Build rapport first. The goal of DMs is to earn the right to send a link.',
     3, false, 6);

END $$;
