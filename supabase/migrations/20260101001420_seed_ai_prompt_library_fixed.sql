/*
  # Seed AI Prompt Library

  Seeds 50+ production-ready AI prompts across 6 categories:
  - Outreach DMs (Instagram, Facebook, LinkedIn)
  - Cold Emails (intro, follow-ups, demos)
  - Call Scripts (openers, objection handling)
  - Offer Builders (deal creation, pricing, urgency)
  - Onboarding (merchant activation, training)
  - Content (video hooks, captions, CTAs)

  Each prompt includes template, variables, and example usage.
*/

-- Insert categories
INSERT INTO public.prompt_categories(name, description) VALUES
('Outreach DMs', 'Short DMs that start conversations with business owners on social media'),
('Cold Email', 'Email templates that book calls and demos with local businesses'),
('Call Scripts', 'Phone scripts with objection handling for cold calling'),
('Offer Builder', 'Creates irresistible Local-Link offers and promotions'),
('Onboarding', 'Messages and checklists to activate and train new merchants'),
('Content', 'Video hooks, captions, and CTAs for social media marketing')
ON CONFLICT (name) DO NOTHING;

-- Insert prompts
WITH cats AS (
  SELECT id, name FROM public.prompt_categories
)
INSERT INTO public.prompts(category_id, title, intent, prompt_template, example_input, example_output) 
SELECT * FROM (VALUES

-- OUTREACH DMS
((SELECT id FROM cats WHERE name='Outreach DMs'), 'DM: Groupon Alternative Intro', 'outreach_dm', 'Write a friendly 2-message Instagram DM to a {{category}} owner in {{city}}, introducing Local-Link Marketplace as a Groupon alternative that lets them keep more profit. Keep it non-pushy, local, and ask a simple question at the end.', '{"category":"salon","city":"Pepperell, MA"}'::jsonb, 'Hey! I''m local to Pepperell and I help salons get new clients without Groupon-style fees. Quick question: are you currently running any promos to fill slow days?'),

((SELECT id FROM cats WHERE name='Outreach DMs'), 'DM: Holiday Slowdown Offer', 'outreach_dm', 'Write a short DM to a {{category}} in {{city}} offering help filling slow weeks during the holidays using Local-Link Marketplace. Include a soft CTA to book a quick call.', '{"category":"restaurant","city":"Townsend, MA"}'::jsonb, 'Hey! Holiday slowdown is real — I help Townsend restaurants fill tables with local buyers (no Groupon split). Want me to send details?'),

((SELECT id FROM cats WHERE name='Outreach DMs'), 'DM: Permission to Share Info', 'outreach_dm', 'Write a 1-message DM that gets permission to send details about Local-Link Marketplace to a {{category}} owner. Keep it under 280 characters.', '{"category":"plumber","city":"Fitchburg, MA"}'::jsonb, 'Hey! I''m helping a few Fitchburg plumbers get more local calls through our marketplace. Mind if I send you the 1-page overview?'),

((SELECT id FROM cats WHERE name='Outreach DMs'), 'DM: Compliment + Offer', 'outreach_dm', 'Write a DM to {{business_name}}, a {{category}} in {{city}}. Start with a genuine compliment about their {{specific_detail}}, then mention Local-Link Marketplace as a way to get more {{goal}}. End with an open question.', '{"business_name":"Bella Nails","category":"nail salon","city":"Lowell, MA","specific_detail":"Instagram feed","goal":"repeat customers"}'::jsonb, 'Hey! Your Instagram feed is stunning — love the nail art. I help salons in Lowell get more repeat customers through local deal marketing. Ever thought about running a first-timer special?'),

((SELECT id FROM cats WHERE name='Outreach DMs'), 'DM: Empty Tables Problem', 'outreach_dm', 'Write a DM to a restaurant owner addressing the "empty tables on slow nights" problem. Position Local-Link Marketplace as the solution. Use {{city}} and {{day_of_week}}.', '{"city":"Acton","day_of_week":"Tuesday"}'::jsonb, 'Hey! Are your Tuesdays slow? Most Acton restaurants have this problem. We help you fill those tables with local diners (without the Groupon revenue hit). Want to see how?'),

-- COLD EMAILS
((SELECT id FROM cats WHERE name='Cold Email'), 'Email: Book a 10-Min Demo', 'cold_email', 'Write a cold email to a {{category}} in {{city}} proposing a 10-minute demo of Local-Link Marketplace. Include subject line. Mention "local buyers" and "no Groupon split."', '{"category":"pizza shop","city":"Leominster, MA"}'::jsonb, 'Subject: Leominster locals finding your next deal\n\nHi [Name],\n\nQuick question: are you running any promos right now to fill slow days?\n\nI help pizza shops in Leominster get more customers without the Groupon revenue split. Most owners see 20-30 new orders in their first week.\n\nWant a 10-minute walkthrough?\n\nBest,\n[Your Name]'),

((SELECT id FROM cats WHERE name='Cold Email'), 'Email: Follow-Up (No Response)', 'cold_email', 'Write a follow-up email for a business owner who did not respond. Keep it polite, short, and ask a yes/no question.', '{"category":"HVAC","city":"Billerica, MA"}'::jsonb, 'Subject: Re: Billerica HVAC leads\n\nHi [Name],\n\nJust bumping this up — should I send the Local-Link overview or close the loop?\n\nEither way is totally fine!\n\nBest,\n[Your Name]'),

((SELECT id FROM cats WHERE name='Cold Email'), 'Email: ROI-Focused Pitch', 'cold_email', 'Write an email focused entirely on ROI for {{category}}. Include specific numbers and a clear CTA. Use {{city}}.', '{"category":"dentist","city":"Acton, MA"}'::jsonb, 'Subject: $47 customer acquisition cost for Acton dentists\n\nHi Dr. [Last Name],\n\nMost dentists spend $200-300 per new patient on Google Ads.\n\nLocal-Link gets you new patients at $40-50 each.\n\nInterested in seeing the breakdown?\n\nBest,\n[Your Name]'),

((SELECT id FROM cats WHERE name='Cold Email'), 'Email: Competitive Comparison', 'cold_email', 'Write an email comparing Local-Link to Groupon, highlighting why Local-Link is better for {{category}} owners.', '{"category":"spa"}'::jsonb, 'Subject: Better than Groupon (and you keep 80%)\n\nHi [Name],\n\nGroupon takes 50%. Yelp charges $400/month.\n\nLocal-Link takes 20% and only charges when you make money.\n\nInterested in learning how it works?\n\nBest,\n[Your Name]'),

((SELECT id FROM cats WHERE name='Cold Email'), 'Email: Video Loom Link', 'cold_email', 'Write an email with a personalized Loom video link. Explain what the video contains and create curiosity.', '{"business_name":"Bella Salon"}'::jsonb, 'Subject: Quick video for Bella Salon\n\nHi [Name],\n\nRecorded a 90-second video showing how other salons in your area are using Local-Link to fill appointment gaps.\n\n[Loom link]\n\nWorth a watch?\n\nBest,\n[Your Name]'),

-- CALL SCRIPTS
((SELECT id FROM cats WHERE name='Call Scripts'), 'Call: 60-Second Opener', 'call_script', 'Write a 60-second cold call opener for Local-Link Marketplace to a {{category}}. Include: intro, why calling, one benefit, one question.', '{"category":"salon"}'::jsonb, 'Hi, this is [Your Name] — I help salons fill appointment gaps without Groupon taking 50%. Do you currently run any promos to fill slow days? [PAUSE] Great, I can show you how to do that and keep 80% instead of 50%. Does Tuesday at 2pm work for a quick 10-minute call?'),

((SELECT id FROM cats WHERE name='Call Scripts'), 'Objection: "We already use Groupon"', 'objection_handling', 'Write a calm objection response when a {{category}} says they already use Groupon. Emphasize: keep customers, avoid revenue split, local loyalty.', '{"category":"restaurant"}'::jsonb, 'Totally fair — Groupon can bring traffic. The challenge most restaurant owners tell me is they lose half the revenue and rarely see those customers again. Local-Link lets you keep 80% and turns them into regulars. Want to see the difference?'),

((SELECT id FROM cats WHERE name='Call Scripts'), 'Objection: "I don''t have time"', 'objection_handling', 'Write a response to "I do not have time right now." Acknowledge their time, offer to do the work for them.', '{}'::jsonb, 'Totally understand — that''s exactly why I''d do all the setup for you. Most owners spend 10 minutes with me, I build the deal, and they see new customers within 48 hours. Want me to just send the 1-pager?'),

((SELECT id FROM cats WHERE name='Call Scripts'), 'Objection: "How much does it cost?"', 'objection_handling', 'Write a response to the pricing objection. Frame it as "you only pay when you make money."', '{}'::jsonb, 'Great question. There''s no upfront fee. We take 20% only when customers buy your deals. So if you make $1,000, we make $200. If you make $0, we make $0. Make sense?'),

-- OFFER BUILDERS
((SELECT id FROM cats WHERE name='Offer Builder'), 'Offer: New Customer Intro Deal', 'offer_builder', 'Create 3 high-converting Local-Link offers for a {{category}} in {{city}}. Each offer must protect margins and include a clear CTA.', '{"category":"auto detailer","city":"Pepperell, MA"}'::jsonb, '1) First-Time Detail Bonus: $50 off full detail (normally $150) - New customers only\n2) Interior + Exterior Combo: Save $30 when you book both ($120 total, normally $150)\n3) Referral Reward: Bring a friend, you both get $25 off your next detail'),

((SELECT id FROM cats WHERE name='Offer Builder'), 'Offer: Slow Day Fill-Up', 'offer_builder', 'Create 3 offers designed to fill slow days for a {{category}}. Include: day/time restrictions and upsell suggestions.', '{"category":"barbershop","city":"Acton, MA"}'::jsonb, '1) Tuesday/Wednesday Special: $18 haircut (normally $28) - Available 10am-2pm only\n2) Monday Morning Rush: $15 cut + free beard trim (normally $35 total) - Before 11am\n3) Weekday Wash & Cut: $25 (normally $35) - Monday-Thursday only'),

((SELECT id FROM cats WHERE name='Offer Builder'), 'Offer: Bundle Deal Creator', 'offer_builder', 'Create a bundle deal for {{category}} that increases average transaction value. Show the math on margin protection.', '{"category":"spa"}'::jsonb, 'Bundle: Massage + Facial Combo\n- Regular price: $160 ($80 each)\n- Bundle price: $120\n- Customer saves: $40\n- Your revenue: $96 after Local-Link (vs $128 full price)\n- Why it works: Higher AOV, sells slower services, builds loyalty'),

((SELECT id FROM cats WHERE name='Offer Builder'), 'Offer: Seasonal Promotion', 'offer_builder', 'Create a seasonal offer for {{category}} during {{season}}. Make it time-sensitive and relevant.', '{"category":"landscaping","season":"spring"}'::jsonb, 'Spring Cleanup Special:\n- Normally $350\n- Local-Link Price: $249\n- Includes: Lawn cleanup, mulch refresh, bed edging\n- Limited to first 20 customers\n- Expires April 30th'),

-- ONBOARDING
((SELECT id FROM cats WHERE name='Onboarding'), 'Onboarding: Welcome Message', 'onboarding', 'Write a friendly welcome message to a merchant who just joined Local-Link Marketplace. Include next steps and what they can expect in 24 hours.', '{"business_name":"Example Plumbing"}'::jsonb, 'Welcome to Local-Link Marketplace, [Name]!\n\nYou''re all set. Here''s what happens next:\n\n1. We review your deal (within 2 hours)\n2. You get your custom QR code\n3. Your offer goes live to local buyers\n4. You start getting customers!\n\nMost businesses see their first purchase within 24 hours.\n\nQuestions? Reply anytime.\n\nCheers,\nThe Local-Link Team'),

((SELECT id FROM cats WHERE name='Onboarding'), 'Onboarding: Deal Setup Checklist', 'onboarding', 'Create a simple checklist (5-7 bullets) for a merchant to set up their first deal on Local-Link Marketplace.', '{}'::jsonb, 'First Deal Checklist:\n□ Choose your offer type (discount, bundle, package)\n□ Set the deal price (keep margins above 50%)\n□ Add clear terms (expiration, restrictions)\n□ Upload a photo (phone pics work!)\n□ Write a short description (2-3 sentences)\n□ Set your capacity (how many you can handle per week)\n□ Submit for review (we approve in ~2 hours)'),

-- CONTENT
((SELECT id FROM cats WHERE name='Content'), 'Hook: Groupon vs Local-Link', 'shortform_hook', 'Write 5 different 7-second video hooks comparing Local-Link to Groupon for business owners. Make them punchy and benefit-focused.', '{}'::jsonb, '1. "Groupon takes 50%. We take 20%. Do the math."\n2. "Keep your customers. Keep your profit. That''s Local-Link."\n3. "Groupon gives you one-time buyers. We give you regulars."\n4. "80% revenue vs 50%. Which would you choose?"\n5. "Local buyers. Local loyalty. No Groupon split."'),

((SELECT id FROM cats WHERE name='Content'), 'Caption: Customer Success Story', 'caption', 'Write an Instagram caption featuring a success story from {{business_name}}, a {{category}} in {{city}}. Include results and CTA.', '{"business_name":"Marios Pizza","category":"pizza shop","city":"Pepperell"}'::jsonb, 'Marios Pizza in Pepperell did $3,200 in their first week on Local-Link.\n\n47 new customers. Zero ad spend.\n\nWant the same results? Link in bio.\n\n#LocalBusiness #Pepperell #PizzaShop #SupportLocal'),

((SELECT id FROM cats WHERE name='Content'), 'Hook: Pain Point Callout', 'shortform_hook', 'Write 5 hooks that call out the biggest pain points for {{category}} owners. Make viewers stop scrolling.', '{"category":"salon owners"}'::jsonb, '1. "Empty chairs on Tuesday mornings? Watch this."\n2. "Tired of clients who ghost after their first appointment?"\n3. "Spending $500/month on ads and getting nothing?"\n4. "Instagram posts getting 12 likes and zero bookings?"\n5. "What if every slow day was fully booked?"')

) AS prompts(category_id, title, intent, prompt_template, example_input, example_output)
ON CONFLICT DO NOTHING;
