/*
  # Add Selling Recurring Revenue™ Course Exam

  Adds 25 exam questions with answers
  - Passing score: 80% (20/25 questions)
  - Mix of multiple choice covering all 5 modules
*/

DO $$
DECLARE
  v_course_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-recurring-revenue';
  
  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation) VALUES
    -- Module 1 questions (Recurring Revenue Foundations)
    (v_course_id, 1, 'Which is the safest guarantee style for recurring offers?', 'mcq',
     '{"a":"Unconditional money-back guarantee anytime","b":"Conditional guarantee based on onboarding completion and monthly actions","c":"Guarantee a specific revenue number","d":"No terms or conditions needed"}'::jsonb,
     'b', 'Conditional guarantees protect you from non-cooperative clients while still reducing buyer risk. Activity-based guarantees are safest.'),
    
    (v_course_id, 2, 'What is the best way to present recurring pricing?', 'mcq',
     '{"a":"Hourly breakdown showing time spent","b":"Outcome-focused with three pricing options","c":"Discount-first approach","d":"Single take-it-or-leave-it price"}'::jsonb,
     'b', 'Outcome framing plus 3 options increases choice and confidence while focusing on value, not tasks.'),
    
    (v_course_id, 3, 'In the MRR offer stack, what should the core subscription focus on?', 'mcq',
     '{"a":"Maximum features at lowest price","b":"Platform or base service that is easy to deliver","c":"Most expensive tier to maximize revenue","d":"Everything the client might ever need"}'::jsonb,
     'b', 'The core should be a platform or base service that is sustainable to deliver and provides clear value. Add-ons come later.'),
    
    (v_course_id, 4, 'Why does recurring revenue build higher business valuation than one-time sales?', 'mcq',
     '{"a":"One-time sales are taxed higher","b":"Recurring revenue is predictable and compounds, making it worth 3-5x ARR","c":"Recurring clients never churn","d":"Banks prefer subscription models"}'::jsonb,
     'b', 'Predictable recurring revenue compounds and businesses with MRR sell for 3-5x annual recurring revenue multiples.'),
    
    (v_course_id, 5, 'What should you anchor your pricing to?', 'mcq',
     '{"a":"Your costs and desired profit margin","b":"The cost of the problem to the client","c":"Industry standard hourly rates","d":"What competitors charge"}'::jsonb,
     'b', 'Always anchor to the cost of the problem, not your costs or competitor pricing. This shows clear ROI.'),

    -- Module 2 questions (Offer & Packaging)
    (v_course_id, 6, 'What is the correct niche promise formula?', 'mcq',
     '{"a":"We offer [features] at [price]","b":"We help [niche] get [result] in [time] without [pain]","c":"We are the best at [service]","d":"We have [years] of experience in [industry]"}'::jsonb,
     'b', 'The promise formula focuses on who you help, what result they get, timeframe, and what pain you remove.'),
    
    (v_course_id, 7, 'In a 3-tier pricing ladder, which tier do most clients choose?', 'mcq',
     '{"a":"Starter tier (cheapest)","b":"Core tier (middle)","c":"Premium tier (most expensive)","d":"They split evenly across all three"}'::jsonb,
     'b', 'Most clients choose the middle Core tier when presented with 3 options. This is called price anchoring.'),
    
    (v_course_id, 8, 'What is the purpose of the NOT included deliverables list?', 'mcq',
     '{"a":"To upsell additional services","b":"To avoid scope creep by setting clear boundaries","c":"To make the offer look smaller","d":"To reduce client expectations"}'::jsonb,
     'b', 'The not included list prevents scope creep by clearly defining what is outside the monthly service.'),
    
    (v_course_id, 9, 'In the 90-day onboarding sprint, what is the Month 1 focus?', 'mcq',
     '{"a":"Scale and retention","b":"Setup and quick wins","c":"Optimization and refinement","d":"Upsells and expansion"}'::jsonb,
     'b', 'Month 1 focuses on setup and quick wins to prove value immediately and build client confidence.'),
    
    (v_course_id, 10, 'When bundling the Local-Link ecosystem, what is the main benefit?', 'mcq',
     '{"a":"Higher profit margins","b":"One invoice, one login, one system (easier to sell and stickier)","c":"Ability to charge more","d":"Reduces support requests"}'::jsonb,
     'b', 'Bundling creates one integrated system that is easier to sell and harder to leave, increasing retention.'),

    -- Module 3 questions (Sales System & Pipeline)
    (v_course_id, 11, 'In the weekly MRR sales rhythm, what are the key KPIs to track?', 'mcq',
     '{"a":"Revenue, profit, expenses","b":"Conversations, appointments, shows, closes, onboards","c":"Social media followers, likes, shares","d":"Website traffic, bounce rate, conversions"}'::jsonb,
     'b', 'Track the full funnel: conversations to appointments to shows to closes to onboards to identify bottlenecks.'),
    
    (v_course_id, 12, 'Which discovery question creates the most urgency?', 'mcq',
     '{"a":"What is your budget?","b":"If this continues for 90 days, what happens?","c":"Who is your current provider?","d":"When do you want to start?"}'::jsonb,
     'b', 'Future-pacing the pain creates urgency by making the prospect visualize the cost of inaction.'),
    
    (v_course_id, 13, 'When presenting 3-tier pricing, which tier should you anchor to?', 'mcq',
     '{"a":"Starter (cheapest)","b":"Core (middle) - where you want them","c":"Premium (most expensive)","d":"Let them choose without guidance"}'::jsonb,
     'b', 'Anchor to the Core middle tier as the best value - this is where you want most clients.'),
    
    (v_course_id, 14, 'What is the start-date close technique?', 'mcq',
     '{"a":"Offering a discount to start today","b":"Asking when they want to start instead of if they want to start","c":"Setting a deadline for the offer","d":"Scheduling a follow-up call"}'::jsonb,
     'b', 'The start-date close assumes the sale and asks when they want to start, not if they want to buy.'),
    
    (v_course_id, 15, 'Best prospecting sources for local businesses without relying on social media?', 'mcq',
     '{"a":"Cold calling from phone book","b":"Google Maps, local directories, LinkedIn company search, referrals","c":"TV and radio advertising","d":"Direct mail campaigns only"}'::jsonb,
     'b', 'Google Maps, directories, LinkedIn, and referrals are the most effective for targeted local prospecting.'),

    -- Module 4 questions (Objections, Retention, Expansion)
    (v_course_id, 16, 'What is the objection handling framework?', 'mcq',
     '{"a":"Argue, Convince, Close","b":"Discount, Apologize, Follow-up","c":"Clarify, Reframe, Prove, Ask","d":"Ignore, Redirect, Pitch"}'::jsonb,
     'c', 'The framework is: Clarify the real concern, Reframe it, Prove with evidence, Ask for the next step.'),
    
    (v_course_id, 17, 'When a client says too expensive, what should you do first?', 'mcq',
     '{"a":"Offer a discount immediately","b":"Clarify: Too expensive compared to what?","c":"Defend your pricing","d":"Walk away from the deal"}'::jsonb,
     'b', 'Always clarify the objection first. Too expensive might mean they do not see the value or have budget concerns.'),
    
    (v_course_id, 18, 'How often should you hold retention meetings with clients?', 'mcq',
     '{"a":"Only when they have problems","b":"Monthly touchpoints with performance review","c":"Quarterly only","d":"Weekly check-ins"}'::jsonb,
     'b', 'Monthly meetings keep clients engaged, show value consistently, and create expansion opportunities.'),
    
    (v_course_id, 19, 'What is an expansion trigger?', 'mcq',
     '{"a":"When you need more revenue","b":"A client event or milestone that justifies offering an upsell","c":"When a competitor launches","d":"End of fiscal year"}'::jsonb,
     'b', 'Expansion triggers are specific client situations that naturally create opportunities for add-ons.'),
    
    (v_course_id, 20, 'What is the first churn warning signal?', 'mcq',
     '{"a":"They ask for a refund","b":"Skipped monthly meeting 2x in a row or not using the system","c":"They mention a competitor","d":"Invoice is past due"}'::jsonb,
     'b', 'Skipped meetings and low system usage are early warning signals that allow you to intervene before cancellation.'),

    -- Module 5 questions (Delivery, Automation, Scaling)
    (v_course_id, 21, 'In the Day 1-7 onboarding checklist, what should happen by Day 7?', 'mcq',
     '{"a":"Contract signed and first payment collected","b":"First win report showing quick results","c":"Everything fully optimized","d":"Client trained on all advanced features"}'::jsonb,
     'b', 'By Day 7, deliver a first win report showing quick results to prove value and build momentum.'),
    
    (v_course_id, 22, 'What is the purpose of creating SOPs for recurring fulfillment?', 'mcq',
     '{"a":"To micromanage your team","b":"To ensure consistent, scalable delivery that does not depend on you","c":"To impress clients with documentation","d":"To meet compliance requirements"}'::jsonb,
     'b', 'SOPs create consistent delivery and allow you to scale without quality dropping or being dependent on one person.'),
    
    (v_course_id, 23, 'Which workflow should be automated first?', 'mcq',
     '{"a":"Annual client surveys","b":"Missed call recovery and follow-up","c":"Billing reminders","d":"Social media posting"}'::jsonb,
     'b', 'Missed call recovery has immediate ROI and is a core value driver that should be automated first.'),
    
    (v_course_id, 24, 'What is the ideal partner commission structure for recurring revenue?', 'mcq',
     '{"a":"One-time payment of $500 per referral","b":"20-30% recurring commission for the life of the client","c":"50% of first month only","d":"Flat monthly fee regardless of referrals"}'::jsonb,
     'b', 'Recurring commission aligns partner incentives with client retention and creates passive income for partners.'),
    
    (v_course_id, 25, 'In the 30-day action plan, what is the Week 2 focus?', 'mcq',
     '{"a":"Offer finalization","b":"Pipeline building and starting conversations","c":"Closing deals","d":"Client retention"}'::jsonb,
     'b', 'Week 2 focuses on building your prospect list and starting outreach conversations to book discovery calls.')
  ON CONFLICT (course_id, question_index) DO NOTHING;

END $$;