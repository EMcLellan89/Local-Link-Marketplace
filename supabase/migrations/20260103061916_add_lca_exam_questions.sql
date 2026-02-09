/*
  # Local Customers on Autopilot™ - Exam Questions (30 total)

  MCQ and scenario questions covering all course modules
  Passing score: 80% (24/30 correct)
*/

DO $$
DECLARE
  c_id uuid;
BEGIN
  SELECT id INTO c_id FROM public.courses WHERE slug='local-customers-on-autopilot';
  IF c_id IS NULL THEN RAISE EXCEPTION 'Course not found: local-customers-on-autopilot'; END IF;

  -- Optional: wipe existing questions for a clean reseed
  DELETE FROM public.course_exam_questions WHERE course_id = c_id;

  INSERT INTO public.course_exam_questions
    (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
  VALUES

  -- 1
  (c_id, 1, 'Search vs Browse: Which is MOST likely a "search" intent?', 'mcq',
   '{"a":"Scrolling a marketplace for ideas","b":"Typing \"emergency plumber near me\"","c":"Watching a local community video","d":"Asking a friend for recommendations"}'::jsonb,
   'b', 'Search intent usually includes urgent keywords and "near me."'),

  -- 2
  (c_id, 2, 'The "3-second trust test" includes which 4 elements?', 'mcq',
   '{"a":"Logo, slogan, website, phone","b":"Offer, reviews, category clarity, photo proof","c":"Price list, long description, awards, coupons","d":"Social followers, hashtags, ads, trends"}'::jsonb,
   'b', 'People decide quickly based on proof, clarity, and an offer.'),

  -- 3
  (c_id, 3, 'Which listing headline is strongest?', 'mcq',
   '{"a":"We do great work","b":"Quality services in your area","c":"Tree Removal & Trimming — Pepperell | Fast Scheduling + Cleanup Included","d":"Family-owned business"}'::jsonb,
   'c', 'Specific service + location + outcome converts best.'),

  -- 4
  (c_id, 4, 'Which photo set is BEST for conversion?', 'mcq',
   '{"a":"Only logo and business card","b":"Random stock images","c":"Hero result, before/after, crew at work, proof of cleanup, happy customer","d":"Only equipment photos"}'::jsonb,
   'c', 'Results + proof + people + process builds trust.'),

  -- 5
  (c_id, 5, 'Offer ladder: correct order?', 'mcq',
   '{"a":"Premium → Core → Low → Free","b":"Free/Lead magnet → Low ticket → Core → Premium","c":"Core → Free → Premium → Low","d":"Low → Premium → Free → Core"}'::jsonb,
   'b', 'This ladder creates easy entry and upgrades.'),

  -- 6
  (c_id, 6, 'Which is a discount alternative?', 'mcq',
   '{"a":"20% off everything forever","b":"Bundle add-on bonus (free gutter clean with roof wash)","c":"Race to the bottom pricing","d":"Removing service guarantees"}'::jsonb,
   'b', 'Bonuses/bundles preserve margin while increasing value.'),

  -- 7
  (c_id, 7, 'Scarcity that is "real" should be based on:', 'mcq',
   '{"a":"Fake timers","b":"Capacity/slots/seasonality","c":"Pretending inventory is low","d":"Random urgency phrases"}'::jsonb,
   'b', 'Ethical scarcity is about real constraints.'),

  -- 8
  (c_id, 8, 'Best time window to request a review?', 'mcq',
   '{"a":"Immediately after satisfaction is highest (same day/within 24 hours)","b":"6 months later","c":"Before service is complete","d":"Only when business is slow"}'::jsonb,
   'a', 'Recency + emotion increases response rate.'),

  -- 9
  (c_id, 9, 'Which review ask script is best?', 'mcq',
   '{"a":"Leave us a review now.","b":"If you feel we earned it, could you leave a quick Google review? It helps local customers find us.","c":"We need reviews, please.","d":"Review us or we can''t help next time."}'::jsonb,
   'b', 'Polite + benefit + low pressure works best.'),

  -- 10
  (c_id,10, 'A good 1-star review response should first:', 'mcq',
   '{"a":"Argue publicly","b":"Offer a refund immediately no questions","c":"Acknowledge, apologize for experience, invite offline resolution","d":"Threaten legal action"}'::jsonb,
   'c', 'Professional tone protects brand and invites resolution.'),

  -- 11
  (c_id,11, 'Drive Repeat Business (non-point) is MOST about:', 'mcq',
   '{"a":"Coupons every week","b":"Follow-up sequences and reminders timed to buyer needs","c":"Giving away free services","d":"Only social media posts"}'::jsonb,
   'b', 'Repeat is driven by proactive reminders and timing.'),

  -- 12
  (c_id,12, 'Win-back campaign timing is typically:', 'mcq',
   '{"a":"30/60/90 days","b":"Every day forever","c":"Once a year only","d":"Never follow up"}'::jsonb,
   'a', 'Staggered follow-ups maximize returns without spamming.'),

  -- 13
  (c_id,13, 'Referral prompt that works best:', 'mcq',
   '{"a":"Send me 10 referrals","b":"Know anyone who needs ___? If so I can take care of them this week.","c":"Referrals only if you pay","d":"Tell everyone about me"}'::jsonb,
   'b', 'Simple + specific + timing-based request converts.'),

  -- 14 (Scenario)
  (c_id,14, 'Scenario: Your listing gets views but few calls. What is the FIRST fix?', 'scenario',
   '{"a":"Lower prices immediately","b":"Improve photo proof + offer clarity + first 2 lines of description","c":"Remove your phone number","d":"Post memes daily"}'::jsonb,
   'b', 'Conversion is usually trust + clarity + offer.'),

  -- 15
  (c_id,15, 'Best KPI sequence for a local listing funnel:', 'mcq',
   '{"a":"Likes → followers → shares","b":"Views → clicks/calls → bookings → completed jobs → repeats","c":"Hashtags → trends → virality","d":"Impressions only"}'::jsonb,
   'b', 'Measure what drives revenue.'),

  -- 16
  (c_id,16, 'Pipeline stages should be:', 'mcq',
   '{"a":"Random and changing daily","b":"Lead → Qualified → Booked → Completed → Repeat/Referral","c":"Only \"New\" and \"Closed\"","d":"No pipeline needed"}'::jsonb,
   'b', 'Simple consistent stages drive follow-up discipline.'),

  -- 17
  (c_id,17, 'Missed call recovery best practice:', 'mcq',
   '{"a":"Call back next week","b":"Text back within 30 seconds + offer booking link","c":"Wait for them to call again","d":"Only email them"}'::jsonb,
   'b', 'Speed-to-lead dramatically increases conversion.'),

  -- 18
  (c_id,18, 'Which description line is best?', 'mcq',
   '{"a":"We have been in business a long time.","b":"We do many services.","c":"Fast scheduling this week • Cleanup included • Licensed/insured — Request a quote in 60 seconds","d":"Call us sometime."}'::jsonb,
   'c', 'Outcome + proof + CTA.'),

  -- 19
  (c_id,19, 'Featured listing "boost" should be awarded based on:', 'mcq',
   '{"a":"Who asks loudest","b":"Consistent trust signals + activity + responsiveness","c":"Who has the cheapest pricing","d":"Who posts the most emojis"}'::jsonb,
   'b', 'Featured should reward quality + reliability.'),

  -- 20
  (c_id,20, 'A "good" offer should include:', 'mcq',
   '{"a":"Only a discount percent","b":"Problem + promise + proof + deadline/next step","c":"Long story without CTA","d":"Complicated terms"}'::jsonb,
   'b', 'This structure converts and reduces confusion.'),

  -- 21
  (c_id,21, 'Which is BEST for review keyword strategy?', 'mcq',
   '{"a":"Ask customers to mention the exact service + town naturally","b":"Ask for random generic reviews only","c":"Never mention services","d":"Copy/paste the same review"}'::jsonb,
   'a', 'Service + town improves local relevance.'),

  -- 22
  (c_id,22, 'Which weekly routine is best?', 'mcq',
   '{"a":"Do nothing until slow season","b":"Weekly: check KPIs, refresh offer, request reviews, follow up leads","c":"Only post once a year","d":"Only run discounts"}'::jsonb,
   'b', 'Weekly micro-optimizations compound.'),

  -- 23 (Scenario)
  (c_id,23, 'Scenario: A competitor has fewer reviews but ranks higher. Most likely reason?', 'scenario',
   '{"a":"They bought followers","b":"Their listing has clearer categories, better photos, more recent reviews, stronger offer","c":"They use more emojis","d":"They have a longer story"}'::jsonb,
   'b', 'Conversion and freshness often beat raw volume.'),

  -- 24
  (c_id,24, 'The best CTA on a local listing is:', 'mcq',
   '{"a":"DM me if you want","b":"Request a quote / Book now / Call now with a clear next step","c":"Check my website maybe","d":"No CTA"}'::jsonb,
   'b', 'Clear CTAs reduce friction.'),

  -- 25
  (c_id,25, 'Point programs work best when:', 'mcq',
   '{"a":"Purchase frequency is high and repeat is natural (coffee, salons)","b":"Jobs happen once every 10 years","c":"Margins are extremely thin","d":"You want complicated rules"}'::jsonb,
   'a', 'Higher frequency supports points programs.'),

  -- 26
  (c_id,26, 'Non-point loyalty works best when:', 'mcq',
   '{"a":"Services are infrequent (tree service, roof, HVAC)","b":"Customers visit daily","c":"You only want discounts","d":"You have no follow-up tools"}'::jsonb,
   'a', 'Reminders + win-back suits infrequent cycles.'),

  -- 27 (Scenario)
  (c_id,27, 'Scenario: Customer says "I''ll think about it." Best follow-up?', 'scenario',
   '{"a":"Ok bye","b":"Send one reminder in 30 days","c":"Ask what they need to feel confident + offer 2 options + follow up in 48 hours","d":"Offer 50% off immediately"}'::jsonb,
   'c', 'Clarify hesitation, keep options simple, follow up soon.'),

  -- 28
  (c_id,28, 'Highest leverage first improvement for new listings:', 'mcq',
   '{"a":"Complex automation","b":"Proof photos + clear offer + review ask system","c":"Hiring a big team","d":"Expensive branding only"}'::jsonb,
   'b', 'Trust signals + offer create immediate lift.'),

  -- 29
  (c_id,29, 'Your monthly CEO review should include:', 'mcq',
   '{"a":"Only vanity metrics","b":"Leads, bookings, close rate, repeat rate, review velocity, response speed","c":"Only website visits","d":"Only followers"}'::jsonb,
   'b', 'These metrics tie to revenue.'),

  -- 30
  (c_id,30, 'Passing score requirement for certification should be:', 'mcq',
   '{"a":"50%","b":"60%","c":"80%","d":"100%"}'::jsonb,
   'c', '80% is a strong but fair standard.');

END $$;
