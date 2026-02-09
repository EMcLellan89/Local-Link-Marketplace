/*
  # Marketing for Trades™ - Certification Exam

  1. Exam Setup
    - 25 comprehensive questions
    - Passing score: 80% (20/25)
    - Covers all 5 modules
    - Multiple choice format

  2. Topics Covered
    - Trade buyer behavior and growth systems
    - Google Maps and local search optimization
    - Lead capture and follow-up systems
    - Offline marketing strategies
    - Systems, pricing, and scaling
*/

-- Delete existing exam questions for this course (if any)
DELETE FROM public.course_exam_questions 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades');

-- Insert exam questions for Marketing for Trades course
INSERT INTO public.course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
VALUES
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 1, 'Trades customers typically decide based on:', 'mcq', 
   '{"a": "Lowest price only", "b": "Pain + trust + speed", "c": "Brand colors", "d": "Social media followers"}', 'b',
   'Urgency + trust signals + fast response drive trades conversions.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 2, 'A strong service area strategy means:', 'mcq',
   '{"a": "Marketing every town", "b": "Focusing on 5-10 core towns first", "c": "Only marketing online", "d": "Only marketing offline"}', 'b',
   'Density and local proof win before expansion.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 3, 'A "money offer" is best described as:', 'mcq',
   '{"a": "A vague list of services", "b": "A packaged offer with clear outcome", "c": "A coupon-only deal", "d": "A seasonal post"}', 'b',
   'Packages increase clarity and AOV.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 4, 'The most important weekly KPI for trades is:', 'mcq',
   '{"a": "Instagram likes", "b": "Speed-to-lead and follow-up completion", "c": "Logo redesigns", "d": "Number of posts"}', 'b',
   'Fast response and follow-up directly affect bookings.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 5, 'GBP is primarily used to:', 'mcq',
   '{"a": "Sell products online", "b": "Get discovered in Google Maps searches", "c": "Run payroll", "d": "Store contracts"}', 'b',
   'GBP drives Maps visibility and calls.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 6, 'Reviews that convert best include:', 'mcq',
   '{"a": "Only star ratings", "b": "Service + town + outcome", "c": "Discount codes", "d": "Emoji-only messages"}', 'b',
   'Specificity builds trust and relevance.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 7, 'A good GBP posting cadence is:', 'mcq',
   '{"a": "Daily long posts", "b": "1 post/week + steady photos", "c": "Once a year", "d": "Only when slow"}', 'b',
   'Consistency beats intensity.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 8, 'Town/service pages should include:', 'mcq',
   '{"a": "Just keywords", "b": "Problem → solution → proof → process → CTA", "c": "Only stock photos", "d": "Only pricing"}', 'b',
   'A conversion layout improves calls and form fills.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 9, 'Best missed-call recovery goal:', 'mcq',
   '{"a": "Text next day", "b": "SMS within 2 minutes", "c": "Ignore missed calls", "d": "Only email follow-up"}', 'b',
   'Speed wins trades leads.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 10, 'The 3-line booking framework focuses on:', 'mcq',
   '{"a": "Quoting over the phone", "b": "Confirming problem + location + booking window", "c": "Upselling first", "d": "Talking longer"}', 'b',
   'Book fast, don''t debate pricing.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 11, 'Estimate follow-up best practice is:', 'mcq',
   '{"a": "One text only", "b": "3 touches in 72 hours", "c": "No follow-up", "d": "Discount immediately"}', 'b',
   'Follow-up drives closes without discounting.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 12, 'Job follow-up should prioritize:', 'mcq',
   '{"a": "Asking for money again", "b": "Reviews + referrals + next-step offer", "c": "No contact", "d": "Only social posts"}', 'b',
   'The post-job moment is the highest trust point.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 13, 'Yard signs work best when:', 'mcq',
   '{"a": "Placed randomly", "b": "Placed near completed jobs", "c": "No phone number", "d": "Only indoors"}', 'b',
   'Neighbors seeing real work increases trust.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 14, 'Truck branding should include:', 'mcq',
   '{"a": "Only logo", "b": "Service + phone + trust + QR (optional)", "c": "Only Instagram handle", "d": "Nothing readable"}', 'b',
   'Simple readable contact info wins.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 15, 'Postcards succeed most when:', 'mcq',
   '{"a": "Sent once", "b": "Sent consistently with clear CTA", "c": "Only discounts", "d": "No tracking"}', 'b',
   'Frequency + clarity wins.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 16, 'Best referral partners for trades are:', 'mcq',
   '{"a": "Influencers", "b": "Property managers, realtors, HOAs", "c": "Random online groups", "d": "Only family"}', 'b',
   'These partners control recurring work.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 17, 'A town takeover strategy means:', 'mcq',
   '{"a": "Serving every state", "b": "Building proof and visibility in one town first", "c": "Only paid ads", "d": "Changing names"}', 'b',
   'Localized dominance expands faster.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 18, 'Pricing confidence is built by:', 'mcq',
   '{"a": "Discounting", "b": "Selling process, safety, warranty, proof", "c": "Arguing", "d": "Avoiding the topic"}', 'b',
   'Value language reduces price objections.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 19, 'A simple trades CRM pipeline should track:', 'mcq',
   '{"a": "Only invoices", "b": "Lead → booked → estimate → won/lost → complete → review", "c": "Only calls", "d": "Only marketing"}', 'b',
   'Pipeline ensures follow-up and forecasting.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 20, 'Maintenance plans are used to:', 'mcq',
   '{"a": "Reduce customers", "b": "Create recurring revenue and retention", "c": "Stop marketing", "d": "Lower quality"}', 'b',
   'Plans stabilize income and repeat service.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 21, 'A strong review request asks for:', 'mcq',
   '{"a": "Just stars", "b": "Service + town + outcome mentioned", "c": "Nothing specific", "d": "A discount trade"}', 'b',
   'Specific reviews rank and convert.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 22, 'A "no social media" lead source is:', 'mcq',
   '{"a": "GBP + Local-Link listing", "b": "Only TikTok", "c": "Only Instagram", "d": "Only influencers"}', 'a',
   'Maps + directories drive calls without posting.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 23, 'Hire trigger metrics typically include:', 'mcq',
   '{"a": "Feeling bored", "b": "Missed calls + slow follow-up + backlog growth", "c": "More colors", "d": "New logo"}', 'b',
   'Operations strain signals it''s time.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 24, 'Best next step after proof inventory is:', 'mcq',
   '{"a": "Wait", "b": "Fill the gaps (photos, badges, reviews, case stories)", "c": "Raise prices without proof", "d": "Stop asking for reviews"}', 'b',
   'More proof increases conversion.'),
  
  ((SELECT id FROM courses WHERE slug = 'marketing-for-trades'), 25, 'The 90-day sprint should focus on:', 'mcq',
   '{"a": "Random marketing", "b": "Maps + reviews + follow-up + one offline channel", "c": "Only branding", "d": "Only posting"}', 'b',
   'A tight execution loop produces wins fast.');
