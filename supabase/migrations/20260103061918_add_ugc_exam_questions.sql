/*
  # UGC From Home™ - Exam Questions (30 total)

  MCQ and scenario questions covering all course modules
  Passing score: 80% (24/30 correct)
*/

DO $$
DECLARE
  c_id uuid;
BEGIN
  SELECT id INTO c_id FROM public.courses WHERE slug='ugc-from-home';
  IF c_id IS NULL THEN RAISE EXCEPTION 'Course not found: ugc-from-home'; END IF;

  -- Optional: wipe existing questions for a clean reseed
  DELETE FROM public.course_exam_questions WHERE course_id = c_id;

  INSERT INTO public.course_exam_questions
    (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
  VALUES

  -- 1
  (c_id, 1, 'UGC is best described as:', 'mcq',
   '{"a":"Influencer posting to their followers","b":"Creator-for-hire content brands can run on their own pages/ads","c":"Only affiliate links","d":"Only unboxing videos"}'::jsonb,
   'b', 'UGC is paid creative, not follower-based influence.'),

  -- 2
  (c_id, 2, 'The biggest advantage of UGC for SAHMs is:', 'mcq',
   '{"a":"You need 100k followers","b":"You can get paid without posting to your own audience","c":"You must be famous","d":"You must travel weekly"}'::jsonb,
   'b', 'UGC is deliverable-based, not audience-based.'),

  -- 3
  (c_id, 3, 'A strong UGC structure is:', 'mcq',
   '{"a":"Long intro about your life","b":"Hook → problem → demo → result → CTA","c":"Only music montage","d":"No speaking ever"}'::jsonb,
   'b', 'This is the conversion structure brands buy.'),

  -- 4
  (c_id, 4, 'Which is a "hook" example?', 'mcq',
   '{"a":"Hello my name is…","b":"I was shocked when this fixed ___ in 30 seconds…","c":"Thanks for watching","d":"Here is my cat"}'::jsonb,
   'b', 'Hooks create immediate curiosity/attention.'),

  -- 5
  (c_id, 5, 'Best first portfolio move with no clients:', 'mcq',
   '{"a":"Wait until someone hires you","b":"Create 3 sample videos using products you own","c":"Buy followers","d":"Only create a logo"}'::jsonb,
   'b', 'Samples prove capability and speed up closes.'),

  -- 6
  (c_id, 6, 'Which niche tends to have consistent UGC demand?', 'mcq',
   '{"a":"Seasonal only hobbies","b":"Beauty, home, food, pets, baby/parenting","c":"Rare industrial equipment only","d":"None"}'::jsonb,
   'b', 'These niches buy creative constantly.'),

  -- 7
  (c_id, 7, 'What are "usage rights"?', 'mcq',
   '{"a":"A discount code","b":"Permission for a brand to use your content in ads/timeframes","c":"A type of camera","d":"A social media hashtag"}'::jsonb,
   'b', 'Usage rights determine how/where content is used.'),

  -- 8
  (c_id, 8, 'A common UGC deliverable bundle is:', 'mcq',
   '{"a":"1 video forever","b":"3 videos + 10 raw clips + 3 hooks","c":"Only photos","d":"Only one long 5-minute video"}'::jsonb,
   'b', 'Brands love packages they can test quickly.'),

  -- 9
  (c_id, 9, 'Outreach best practice:', 'mcq',
   '{"a":"One message then stop","b":"3-touch follow-up sequence (DM/email/follow-up)","c":"Spam daily forever","d":"Never follow up"}'::jsonb,
   'b', 'Most deals come from follow-up touches.'),

  -- 10
  (c_id,10, 'Where can you find brands to pitch?', 'mcq',
   '{"a":"Only TV commercials","b":"IG/TikTok, LinkedIn, Shopify stores, Amazon brands","c":"Only magazines","d":"Only billboards"}'::jsonb,
   'b', 'UGC leads are everywhere online.'),

  -- 11
  (c_id,11, 'Best DM opener style:', 'mcq',
   '{"a":"Hey give me money","b":"Quick compliment + clear value + ask if they need UGC this month","c":"Long essay about your story","d":"Send 10 messages in one DM"}'::jsonb,
   'b', 'Short, clear, value-forward works.'),

  -- 12 (Scenario)
  (c_id,12, 'Scenario: Brand replies "What do you charge?" Your best response:', 'scenario',
   '{"a":"It depends. What''s your budget?","b":"Here are 3 packages + what''s included + turnaround time","c":"I''ll do it free","d":"Ignore them"}'::jsonb,
   'b', 'Packages reduce friction and close faster.'),

  -- 13
  (c_id,13, 'Best filming approach for beginners:', 'mcq',
   '{"a":"Hollywood production","b":"Simple lighting + phone + shot list + captions","c":"No planning","d":"Only drone shots"}'::jsonb,
   'b', 'Consistency beats complexity.'),

  -- 14
  (c_id,14, '"Batching" means:', 'mcq',
   '{"a":"Filming, editing, delivering in one chaotic day","b":"Grouping tasks (film day, edit day, deliver day)","c":"Only filming at night","d":"Only using one angle"}'::jsonb,
   'b', 'Batching increases output with less stress.'),

  -- 15
  (c_id,15, 'What keeps retainers?', 'mcq',
   '{"a":"Random content","b":"Predictable delivery + performance-minded creative + communication","c":"Never replying","d":"Posting on your own page only"}'::jsonb,
   'b', 'Reliability and results keep monthly clients.'),

  -- 16
  (c_id,16, 'A retainer is typically:', 'mcq',
   '{"a":"One time payment forever","b":"Monthly package for X deliverables","c":"Only an affiliate deal","d":"Only a discount"}'::jsonb,
   'b', 'Retainers = predictable monthly output.'),

  -- 17
  (c_id,17, 'If a brand says "no budget," best move:', 'mcq',
   '{"a":"Argue","b":"Offer a smaller starter package or 1-video test option","c":"Block them","d":"Drop price to $5"}'::jsonb,
   'b', 'Downsell without devaluing.'),

  -- 18
  (c_id,18, 'Good UGC CTA example:', 'mcq',
   '{"a":"Bye","b":"Tap the link to try it today / Use code / Learn more","c":"No CTA","d":"Subscribe to my channel"}'::jsonb,
   'b', 'CTAs must align with brand goals.'),

  -- 19
  (c_id,19, 'The "hook bank" is used to:', 'mcq',
   '{"a":"Make random jokes","b":"Test multiple openers for ad performance","c":"Avoid talking","d":"Only sell to friends"}'::jsonb,
   'b', 'Hooks drive scroll-stopping and testing.'),

  -- 20 (Scenario)
  (c_id,20, 'Scenario: Brand asks for usage rights for paid ads. You should:', 'scenario',
   '{"a":"Say yes for free forever","b":"Clarify timeframe/placements and charge for usage rights if broader","c":"Refuse all usage","d":"Ignore it"}'::jsonb,
   'b', 'Usage scope should be clear and priced appropriately.'),

  -- 21
  (c_id,21, 'A strong beginner pricing model:', 'mcq',
   '{"a":"$0 always","b":"Starter $150–$300 per video or bundle packages","c":"$10 per video","d":"Only profit share"}'::jsonb,
   'b', 'Packages are the easiest to sell.'),

  -- 22
  (c_id,22, 'Why captions matter:', 'mcq',
   '{"a":"They don''t","b":"Most people watch muted; captions increase retention and clarity","c":"Only for fun","d":"Only for YouTube"}'::jsonb,
   'b', 'Captions improve understanding and performance.'),

  -- 23
  (c_id,23, 'The best portfolio page includes:', 'mcq',
   '{"a":"Only your bio","b":"Samples, niches, packages, turnaround time, contact button","c":"Only memes","d":"Only photos"}'::jsonb,
   'b', 'Portfolio must remove purchase friction.'),

  -- 24 (Scenario)
  (c_id,24, 'Scenario: You''re shy on camera. Best strategy:', 'scenario',
   '{"a":"Quit","b":"Voiceover + hands-only demos + captions + simple scripts","c":"Only dance videos","d":"Never film"}'::jsonb,
   'b', 'You can sell without talking head.'),

  -- 25
  (c_id,25, 'A "shot list" is:', 'mcq',
   '{"a":"A list of excuses","b":"A planned list of angles/clips needed to build the video","c":"A contract clause","d":"A music playlist"}'::jsonb,
   'b', 'Shot lists make filming efficient and repeatable.'),

  -- 26
  (c_id,26, 'Best follow-up schedule for outreach:', 'mcq',
   '{"a":"Never follow up","b":"Day 2 + Day 5 + Day 10 (short, friendly)","c":"Every hour","d":"Only after 6 months"}'::jsonb,
   'b', 'A simple follow-up cadence increases closes.'),

  -- 27
  (c_id,27, 'Deliverable clarity is important because:', 'mcq',
   '{"a":"It isn''t","b":"It prevents scope creep and protects your time","c":"It makes you look strict","d":"It reduces quality"}'::jsonb,
   'b', 'Clear scope protects margins.'),

  -- 28
  (c_id,28, 'Pro tier "Creator Listing" should require:', 'mcq',
   '{"a":"Nothing","b":"Portfolio + niches + turnaround time + deliverable packages","c":"Only a selfie","d":"Only your phone number"}'::jsonb,
   'b', 'Quality standards maintain marketplace trust.'),

  -- 29
  (c_id,29, 'Passing score requirement should be:', 'mcq',
   '{"a":"50%","b":"60%","c":"80%","d":"100%"}'::jsonb,
   'c', '80% ensures credibility.'),

  -- 30
  (c_id,30, 'The #1 retainer killer is:', 'mcq',
   '{"a":"Clear communication","b":"Late delivery / inconsistent output","c":"Using templates","d":"Batching work"}'::jsonb,
   'b', 'Reliability is everything for monthly clients.');

END $$;
