/*
  # Add Remaining Facebook Monetization Quiz Questions (6-20)

  ## Overview
  Completes the 20-question certification exam for Facebook Monetization course.
  Questions 6-20 cover Modules 3-8.

  ## Question Coverage:
  - Questions 6-8: Module 3 (Content Strategy)
  - Questions 9-11: Module 4 (Monetization Methods)
  - Questions 12-14: Module 5 (Funnels)
  - Questions 15-16: Module 6 (Local-Link Integration)
  - Questions 17-18: Module 7 (Scaling)
  - Questions 19-20: Module 8 (Launch Plan)
*/

-- Questions 6-8: Module 3 (Content That Converts)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 6, 
'What is the 80/20 content rule for Facebook monetization?',
'multiple_choice',
jsonb_build_object(
  'A', '80% promotional posts, 20% educational',
  'B', '80% value-driven content, 20% direct sales',
  'C', '80% personal stories, 20% business content',
  'D', '80% video content, 20% text posts'
),
'B',
'The 80/20 rule means 80% of your content should provide value (education, entertainment, inspiration) while only 20% should be direct promotional or sales content. This builds trust and engagement before asking for the sale.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 7,
'Which content format typically generates the highest engagement for local businesses on Facebook?',
'multiple_choice',
jsonb_build_object(
  'A', 'Long text posts with no images',
  'B', 'Short video testimonials and behind-the-scenes content',
  'C', 'Shared articles from news sites',
  'D', 'Product catalogs with prices'
),
'B',
'Short videos (15-60 seconds) showcasing customer testimonials, behind-the-scenes footage, and authentic moments consistently generate the highest engagement for local businesses. They feel personal and build trust.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 8,
'What is the primary purpose of "engagement bait" posts in your content strategy?',
'multiple_choice',
jsonb_build_object(
  'A', 'To get people to comment and start conversations that move to DMs',
  'B', 'To trick the Facebook algorithm into showing your posts',
  'C', 'To collect email addresses for spam',
  'D', 'To get more page likes'
),
'A',
'Engagement posts (polls, questions, fill-in-the-blank) are designed to get people commenting publicly, which then allows you to naturally move qualified leads into DM conversations where you can close sales.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

-- Questions 9-11: Module 4 (Monetization Methods)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 9,
'Which monetization method provides the most predictable monthly revenue for local businesses?',
'multiple_choice',
jsonb_build_object(
  'A', 'One-time service sales',
  'B', 'Recurring membership or subscription programs',
  'C', 'Seasonal promotions',
  'D', 'Affiliate marketing'
),
'B',
'Recurring memberships and subscriptions provide predictable monthly recurring revenue (MRR). Examples include maintenance plans, VIP clubs, monthly retainers, or subscription boxes. This creates stability and compounds over time.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 10,
'What is the "Lead Magnet to Low-Ticket to High-Ticket" strategy?',
'multiple_choice',
jsonb_build_object(
  'A', 'A bait-and-switch sales tactic',
  'B', 'A value ladder that builds trust before selling premium services',
  'C', 'A way to only sell expensive services',
  'D', 'A discount strategy for clearance items'
),
'B',
'This is a value ladder strategy: offer something free (lead magnet) to build trust, then sell a low-priced offer ($27-$97) to convert them into buyers, then upsell to high-ticket services ($500-$5,000+). Each step builds trust for the next.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 11,
'Why is the DM (Direct Message) sales approach more effective than commenting publicly on Facebook?',
'multiple_choice',
jsonb_build_object(
  'A', 'It allows you to send spam without consequences',
  'B', 'Private conversations feel more personal and remove public objections',
  'C', 'Facebook algorithm rewards DM activity',
  'D', 'You can pressure people more easily in private'
),
'B',
'DMs create a private, personal conversation space where prospects feel comfortable asking questions without public scrutiny. It removes the fear of looking foolish in front of others and allows you to address specific objections directly.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

-- Questions 12-14: Module 5 (Funnels That Print Money)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 12,
'What are the three core stages of the "Post to DM to Deal" funnel?',
'multiple_choice',
jsonb_build_object(
  'A', 'Post, Comment, Close',
  'B', 'Awareness, Engagement, Conversion',
  'C', 'Like, Share, Buy',
  'D', 'Advertise, Email, Upsell'
),
'B',
'The funnel is: 1) Awareness (engaging post gets seen), 2) Engagement (they comment/react, you move to DM), 3) Conversion (close the sale in DM). This simple 3-stage funnel works for any local business on Facebook.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 13,
'What is the purpose of a "trip wire" offer in your funnel?',
'multiple_choice',
jsonb_build_object(
  'A', 'To trick people into buying something they don''t want',
  'B', 'A low-cost initial purchase that converts leads into buyers',
  'C', 'A trap to collect credit card information',
  'D', 'An expensive premium service'
),
'B',
'A trip wire is a low-cost, high-value offer ($7-$47) designed to convert free leads into paying customers. Once someone becomes a buyer (even for something small), they are 10x more likely to buy from you again. It breaks the "freebie seeker" barrier.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 14,
'In the Facebook monetization funnel, what should happen immediately after a successful sale?',
'multiple_choice',
jsonb_build_object(
  'A', 'Ignore the customer and find new leads',
  'B', 'Present a relevant upsell or add-on offer',
  'C', 'Ask them to leave a review',
  'D', 'Send them a discount code for next time'
),
'B',
'Immediately after purchase is the best time to present an upsell because the customer is in "buying mode" and has their wallet out. Strike while the iron is hot with a complementary offer that enhances what they just bought.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

-- Questions 15-16: Module 6 (Local-Link CRM Integration)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 15,
'What is the main benefit of connecting Facebook leads to Local-Link CRM?',
'multiple_choice',
jsonb_build_object(
  'A', 'It makes Facebook run faster',
  'B', 'Automated follow-up and lead nurturing without manual work',
  'C', 'It increases your post reach',
  'D', 'It gives you more Facebook followers'
),
'B',
'Local-Link CRM automates the entire follow-up sequence. When someone engages on Facebook, they automatically enter your CRM for email/SMS follow-up, appointment booking, and deal tracking. This ensures no leads fall through the cracks while you focus on closing deals.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 16,
'Which Local-Link feature automatically rewards customers for sharing your business on Facebook?',
'multiple_choice',
jsonb_build_object(
  'A', 'The email marketing tool',
  'B', 'The customer referral engine with reward tracking',
  'C', 'The appointment scheduler',
  'D', 'The invoice generator'
),
'B',
'The Customer Referral Engine tracks when customers share your business, refer friends, or post reviews. It automatically awards points/rewards and can trigger thank-you messages or bonus offers, creating a viral growth loop for your Facebook strategy.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

-- Questions 17-18: Module 7 (Scaling Without Burning Out)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 17,
'What is the "Rule of 10" for scaling your Facebook monetization?',
'multiple_choice',
jsonb_build_object(
  'A', 'Post 10 times per day',
  'B', 'When you reach 10 sales per month consistently, hire help',
  'C', 'Spend 10 minutes per day on Facebook',
  'D', 'Charge 10% more each month'
),
'B',
'The Rule of 10: Once you consistently generate 10 sales per month from your Facebook system, it''s time to hire a virtual assistant or team member to handle repetitive tasks. This frees you to focus on high-value activities like closing bigger deals and strategy.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 18,
'Which metric matters most when tracking Facebook monetization success?',
'multiple_choice',
jsonb_build_object(
  'A', 'Total number of page likes',
  'B', 'How many posts you publish per week',
  'C', 'Revenue per engaged follower (RPEF)',
  'D', 'Total reach and impressions'
),
'C',
'Revenue Per Engaged Follower (RPEF) is the ultimate metric. It measures how much money you generate per person who actively engages with your content. A page with 500 engaged followers making $5,000/month ($10 RPEF) beats a page with 10,000 followers making $1,000/month ($0.10 RPEF).'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

-- Questions 19-20: Module 8 (Launch & Certification)
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 19,
'What should be your primary focus in the first 30 days of your Facebook monetization launch?',
'multiple_choice',
jsonb_build_object(
  'A', 'Getting as many followers as possible',
  'B', 'Making your first 3-5 sales to validate the system',
  'C', 'Creating perfect posts with professional graphics',
  'D', 'Running expensive Facebook ads'
),
'B',
'The first 30 days are about VALIDATION. Your only goal is to make 3-5 sales using organic methods (posts + DMs) to prove the system works. Once validated, you can scale. Don''t worry about perfection or growth yet—just get those first wins.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 20,
'What is the fastest way to get your first sale using Facebook monetization?',
'multiple_choice',
jsonb_build_object(
  'A', 'Create a viral post and wait for sales to come in',
  'B', 'Directly message your existing network with a specific offer',
  'C', 'Run paid ads to a sales page',
  'D', 'Wait until you have 10,000 followers'
),
'B',
'The fastest path to your first sale is to DM your existing connections (friends, past customers, warm contacts) with a specific, valuable offer. You already have trust with these people, so the conversation-to-close rate is high. Start with who you know, then expand to cold outreach.'
FROM courses c WHERE c.slug = 'facebook-monetization-local';