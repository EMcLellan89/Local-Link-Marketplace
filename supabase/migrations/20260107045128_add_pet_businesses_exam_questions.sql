/*
  # Pet Businesses That Get Found First™ - Exam Questions

  1. Adds 25 comprehensive exam questions
    - Tests understanding of course concepts
    - Multiple choice with 4 options each
    - 80% passing score (20/25 questions)
    - Covers all 5 modules

  2. Question Distribution
    - Module 1: Pet Owner Behavior (5 questions)
    - Module 2: Local SEO & GBP (5 questions)
    - Module 3: Reviews & Reputation (5 questions)
    - Module 4: Partnerships & Community (5 questions)
    - Module 5: Retention & Revenue (5 questions)
*/

DO $$
DECLARE
  v_course_id uuid;
BEGIN
  -- Get course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'pet-businesses-first';
  
  -- Delete existing questions if any
  DELETE FROM course_exam_questions WHERE course_id = v_course_id;
  
  -- Insert exam questions
  INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation) VALUES
  
  -- Module 1: Pet Owner Behavior Questions (1-5)
  (v_course_id, 1, 'What percentage of pet service searches include location terms like "near me"?', 'mcq',
   '{"a": "45%", "b": "58%", "c": "78%", "d": "92%"}'::jsonb,
   'c', 'Pet owners search locally with high intent, making "near me" searches critical for visibility.'),
   
  (v_course_id, 2, 'What is the PRIMARY trust barrier pet owners face when booking services?', 'mcq',
   '{"a": "Price concerns", "b": "Safety concerns about their pet", "c": "Lack of online booking", "d": "Distance from their home"}'::jsonb,
   'b', 'Pet owners treat their animals like family and need safety reassurance above all else.'),
   
  (v_course_id, 3, 'Which offer tier strategy is most effective for pet services?', 'mcq',
   '{"a": "Single flat-rate pricing", "b": "3-tier structure with middle tier marked most popular", "c": "5-tier premium options", "d": "Dynamic pricing based on demand"}'::jsonb,
   'b', 'The 3-tier approach with anchoring guides customers to the profitable middle option.'),
   
  (v_course_id, 4, 'What is the recommended markup for add-on services like nail trims?', 'mcq',
   '{"a": "10-20% margin", "b": "100-200% margin", "c": "400-500% margin ($15 charge for $3 cost)", "d": "50% margin"}'::jsonb,
   'c', 'Add-ons have minimal time investment and can carry premium margins without price resistance.'),
   
  (v_course_id, 5, 'What is the main benefit of becoming "PawConnect Ready"?', 'mcq',
   '{"a": "Lower insurance rates", "b": "Community trust and differentiation", "c": "Government grants", "d": "Free advertising"}'::jsonb,
   'b', 'PawConnect positioning shows you care about community safety beyond just transactions.'),
   
  -- Module 2: Local SEO & Google Business Profile (6-10)
  (v_course_id, 6, 'How many photos with pets should a pet business have on their Google Business Profile?', 'mcq',
   '{"a": "5-10 photos", "b": "10-15 photos", "c": "20+ photos", "d": "Photos don''t matter"}'::jsonb,
   'c', 'Visual proof with 20+ photos showing real pets builds trust and engagement in search results.'),
   
  (v_course_id, 7, 'What are the 3 main Google local ranking factors?', 'mcq',
   '{"a": "Price, Reviews, Photos", "b": "Proximity, Relevance, Prominence", "c": "Age, Size, Location", "d": "Budget, Keywords, Links"}'::jsonb,
   'b', 'Google ranks local businesses on Proximity, Relevance to search, and Prominence (reviews/citations).'),
   
  (v_course_id, 8, 'What type of keywords should pet businesses target?', 'mcq',
   '{"a": "Generic terms like pet care", "b": "Breed-specific and near me variations", "c": "National brand terms", "d": "Only emergency terms"}'::jsonb,
   'b', 'Specific, local-intent keywords like "poodle grooming near me" convert far better than generic terms.'),
   
  (v_course_id, 9, 'How often should you perform Google Business Profile maintenance?', 'mcq',
   '{"a": "Once per year", "b": "Monthly", "c": "Weekly (15-minute routine)", "d": "Daily"}'::jsonb,
   'c', 'A consistent weekly 15-minute routine keeps your profile fresh and ahead of inactive competitors.'),
   
  (v_course_id, 10, 'What should pet business facility photos emphasize?', 'mcq',
   '{"a": "Awards and certifications", "b": "Clean facilities, staff with animals, happy pet pickups", "c": "Owner headshots", "d": "Pricing charts"}'::jsonb,
   'b', 'Pet owners want to see real interactions, facility conditions, and happy outcomes—not credentials.'),
   
  -- Module 3: Reviews & Reputation (11-15)
  (v_course_id, 11, 'What is the target conversion rate for automated review requests?', 'mcq',
   '{"a": "10-15%", "b": "20-30%", "c": "40%+", "d": "60%+"}'::jsonb,
   'c', 'Well-timed, automated review requests can achieve 40%+ response rates in pet services.'),
   
  (v_course_id, 12, 'Why do pet owners leave more emotional reviews?', 'mcq',
   '{"a": "They treat pets like family", "b": "Services are expensive", "c": "They have more free time", "d": "Reviews are required"}'::jsonb,
   'a', 'Pet owners have deep emotional bonds with their animals, making reviews more passionate and detailed.'),
   
  (v_course_id, 13, 'What is the best response to an emotional negative review?', 'mcq',
   '{"a": "Ignore it", "b": "Argue your side publicly", "c": "Empathy + acknowledgment + solution offer", "d": "Offer full refund immediately"}'::jsonb,
   'c', 'Empathetic responses that acknowledge feelings and offer solutions demonstrate professionalism.'),
   
  (v_course_id, 14, 'What makes reviews 3x more trustworthy for pet owners?', 'mcq',
   '{"a": "Length of review", "b": "Video testimonials", "c": "Star rating", "d": "Response from owner"}'::jsonb,
   'b', 'Video testimonials showing real pets and emotional pet owners are far more credible than text.'),
   
  (v_course_id, 15, 'How should you repurpose positive reviews?', 'mcq',
   '{"a": "Keep them only on Google", "b": "Turn into social posts, website testimonials, email campaigns", "c": "Print them for in-store only", "d": "Don''t share them elsewhere"}'::jsonb,
   'b', 'Every positive review is marketing gold—multiply its impact across all channels.'),
   
  -- Module 4: Partnerships & Community (16-20)
  (v_course_id, 16, 'What is the main benefit of veterinarian referral partnerships?', 'mcq',
   '{"a": "Discounted vet services", "b": "Win-win referral exchange that generates bookings", "c": "Shared office space", "d": "Joint ownership opportunities"}'::jsonb,
   'b', 'Vets refer grooming/boarding; you refer vet care—creating consistent referral flow.'),
   
  (v_course_id, 17, 'How should you approach shelter partnerships?', 'mcq',
   '{"a": "Ask for payment for services", "b": "Offer free/discounted services in exchange for promotion", "c": "Only donate money", "d": "Ignore them—no ROI"}'::jsonb,
   'b', 'Giving back to rescues creates goodwill, community visibility, and referral opportunities.'),
   
  (v_course_id, 18, 'What should you do when a PawConnect lost pet alert is received?', 'mcq',
   '{"a": "Delete it", "b": "Check facility, share alert, mobilize community, follow up", "c": "Forward to competitors", "d": "Wait for owner to contact you"}'::jsonb,
   'b', 'Active emergency response shows you care and builds trust during emotional crisis moments.'),
   
  (v_course_id, 19, 'What type of businesses should you cross-promote with?', 'mcq',
   '{"a": "Direct competitors only", "b": "Non-competing pet services (groomers, trainers, walkers)", "c": "Non-pet businesses", "d": "National chains"}'::jsonb,
   'b', 'Complementary pet services can share customers without competing, growing all businesses.'),
   
  (v_course_id, 20, 'What is a good community event for pet businesses?', 'mcq',
   '{"a": "Political rallies", "b": "Adoption days, dog park sponsorships, costume contests", "c": "Timeshare presentations", "d": "Real estate seminars"}'::jsonb,
   'b', 'Pet-focused community events create visibility, goodwill, and direct customer engagement.'),
   
  -- Module 5: Retention & Revenue (21-25)
  (v_course_id, 21, 'What is the main benefit of membership models for pet services?', 'mcq',
   '{"a": "One-time revenue boost", "b": "Predictable recurring revenue and 3x longer retention", "c": "Easier cancellations", "d": "Lower prices"}'::jsonb,
   'b', 'Memberships create predictable cash flow and dramatically increase customer lifetime value.'),
   
  (v_course_id, 22, 'How should loyalty programs reward customers?', 'mcq',
   '{"a": "Steep discounts on every visit", "b": "Points, perks, VIP tiers without devaluing service", "c": "Cash back only", "d": "Free services after 3 visits"}'::jsonb,
   'b', 'Reward frequency and loyalty with perks that don''t train customers to expect discounts.'),
   
  (v_course_id, 23, 'When should you trigger a win-back campaign?', 'mcq',
   '{"a": "After 7 days", "b": "After 30 days", "c": "After 60+ days of no booking", "d": "After 1 year"}'::jsonb,
   'c', 'After 60+ days, customers are at risk of churn—win-back campaigns can re-engage them.'),
   
  (v_course_id, 24, 'What KPI indicates healthy rebooking?', 'mcq',
   '{"a": "10% rebooking rate", "b": "30% rebooking rate", "c": "60%+ rebooking rate", "d": "90% rebooking rate"}'::jsonb,
   'c', 'A 60%+ rebooking rate shows customers are satisfied and choosing you repeatedly.'),
   
  (v_course_id, 25, 'What is the smartest alternative to discounting?', 'mcq',
   '{"a": "Lowering prices across the board", "b": "Adding bonus services/perks instead", "c": "Closing your business", "d": "Matching competitor prices"}'::jsonb,
   'b', 'Add value instead of cutting price—preserves margins while rewarding customers.');
   
END $$;
