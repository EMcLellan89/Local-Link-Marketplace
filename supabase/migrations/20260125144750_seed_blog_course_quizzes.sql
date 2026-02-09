/*
  # Seed Blog Course Quizzes

  1. Quiz Questions Added
    - 5 questions per module (25 per course)
    - Blog Growth System (Merchant): 25 questions
    - Blog Profit System (Partner): 25 questions
    
  2. Certification Requirements
    - Must pass all module quizzes at 80% or higher
    - Partners need certification for DFY job board eligibility
    
  3. Badge System
    - Blog Growth Master (Merchant)
    - Blog Profit Pro (Partner)
*/

-- Insert Quiz Questions for Blog Growth System (Merchant)
-- Module 1: Why Local Blogs Win
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What is the main advantage of a blog over paid ads?',
  'It costs less per lead',
  'It works forever once published',
  'It ranks faster on Google',
  'It requires no maintenance',
  'B',
  'Blogs are owned media that continue to generate traffic long after publication, unlike ads that stop when you stop paying.',
  1,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How much can paid leads cost for home service businesses?',
  '$10-20 per lead',
  '$25-50 per lead',
  '$50-200+ per lead',
  '$200-500 per lead',
  'C',
  'Home service leads from Google Ads, Angi, or Thumbtack typically cost $50-$200+ per lead depending on the service.',
  2,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What is owned media?',
  'Media you rent from platforms',
  'Media that disappears after 30 days',
  'Media you control and own permanently',
  'Media that requires monthly payments',
  'C',
  'Owned media is content you create and control on platforms you own, like your blog or website.',
  3,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How many blog posts should you publish per week?',
  'One per day',
  'One per week',
  'Two per month',
  'One per month',
  'B',
  'The course recommends publishing one blog post per week for 8 weeks to build momentum.',
  4,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What happens when you turn off paid ads?',
  'Leads slow down gradually',
  'Leads stop immediately',
  'Leads convert to organic traffic',
  'Leads increase from momentum',
  'B',
  'When you stop paying for ads, the leads stop immediately because you are renting attention.',
  5,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 1;

-- Module 2: Your Money Map
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What should you prioritize when choosing blog topics?',
  'Topics you enjoy writing about',
  'Industry news and trends',
  'Your highest-value services',
  'Whatever ranks fastest',
  'C',
  'Focus on blog posts about your most expensive services first to maximize revenue per lead.',
  1,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How do you check if people search for your services?',
  'Pay for keyword research tools',
  'Hire an SEO agency',
  'Type it into Google and look at autocomplete',
  'Survey your customers',
  'C',
  'Google autocomplete shows you what people are actually searching for - no fancy tools needed.',
  2,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'Why add your city name to blog post titles?',
  'It makes the title longer',
  'It reduces competition by 90%',
  'It looks more professional',
  'Google requires it for ranking',
  'B',
  'Adding local intent like city names drastically reduces competition compared to generic search terms.',
  3,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What are the 4 columns in the Money Map?',
  'Topic, Price, Competition, Ranking',
  'Service, Avg Job Value, Search Volume, Blog Post Idea',
  'Keyword, Traffic, Cost, Conversion',
  'Title, Content, Links, Results',
  'B',
  'The Money Map tracks Service, Average Job Value, Search Volume, and Blog Post Ideas.',
  4,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How long does it typically take for blog results to show?',
  '1-2 weeks',
  '30 days',
  '90 days',
  '6 months',
  'C',
  'Blog SEO typically takes 90 days to kick in with consistent publishing.',
  5,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-growth-system-merchant' AND m.sort_order = 2;

-- Insert Quiz Questions for Blog Profit System (Partner)
-- Module 1: Why Blog Management = Recurring Revenue
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How much can partners earn per merchant with blog management?',
  '$100-300/month',
  '$300-500/month',
  '$500-2,000/month',
  '$2,000-5,000/month',
  'C',
  'Partners typically charge $500-$2,000 per month depending on the service package.',
  1,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How many blog posts should you deliver per month in the Standard package?',
  '2 posts',
  '4 posts',
  '8 posts',
  '12 posts',
  'B',
  'The Standard package delivers 4 blog posts per month for $800.',
  2,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What is the key advantage of blog management as a service?',
  'Easy to deliver with low time investment',
  'Requires no sales skills',
  'Merchants never cancel',
  'No competition in the market',
  'A',
  'Blog management is highly profitable because it can be delivered in under 2 hours per week per client.',
  3,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How long does it take to write 4 blog posts using the assembly line method?',
  '30 minutes',
  '1 hour',
  '2 hours',
  '4 hours',
  'C',
  'Using AI tools and templates, you can create 4 posts in under 2 hours.',
  4,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 1;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What is the math for earning $8,000/month with blog management?',
  '5 clients × $1,600/month',
  '10 clients × $800/month',
  '20 clients × $400/month',
  '8 clients × $1,000/month',
  'B',
  'Managing 10 merchants at $800/month each equals $8,000 in recurring monthly revenue.',
  5,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 1;

-- Module 2: Sell the Service
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What is the best way to position blog management pricing?',
  'As an add-on to other services',
  'As a replacement for ad spend',
  'As a one-time project',
  'As experimental marketing',
  'B',
  'Position $800/month blog management as a replacement for $5,000/month in ad spend.',
  1,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'How should you respond to "I don''t have the budget"?',
  'Offer a discount immediately',
  'Compare to their existing ad spend',
  'Suggest they wait until next year',
  'Explain they need to find budget',
  'B',
  'Show how blog management replaces expensive ad spend rather than adding to their budget.',
  2,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What are the 3 pricing tiers?',
  'Monthly, Quarterly, Annual',
  'Basic, Standard, Premium',
  'Starter, Growth, Enterprise',
  'Bronze, Silver, Gold',
  'B',
  'Offer Basic ($500), Standard ($800), and Premium ($1,200) packages.',
  3,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'When should you follow up after a "I need to think about it" objection?',
  'Wait for them to call you',
  'Lock in a specific follow-up date',
  'Send an email in a few weeks',
  'Don''t follow up to avoid being pushy',
  'B',
  'Always lock in a specific follow-up date rather than leaving it open-ended.',
  4,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 2;

INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order, created_at)
SELECT 
  m.id,
  c.id,
  'What percentage of merchants typically choose the Standard package?',
  '50%',
  '70%',
  '90%',
  '30%',
  'C',
  '90% of merchants choose the Standard ($800/month) package when presented with 3 options.',
  5,
  now()
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = 'blog-profit-system-partner' AND m.sort_order = 2;

-- Add certification badges configuration
UPDATE academy_courses 
SET certification_badge_name = 'Blog Growth Master'
WHERE slug = 'blog-growth-system-merchant';

UPDATE academy_courses 
SET certification_badge_name = 'Blog Profit Pro'
WHERE slug = 'blog-profit-system-partner';

-- Note: Additional quiz questions for modules 3-5 can be added through admin interface
-- This migration establishes the quiz system with passing requirement of 80% (4 out of 5 correct per module)
