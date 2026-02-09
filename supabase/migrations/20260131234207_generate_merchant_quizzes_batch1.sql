/*
  # Generate Quizzes Batch 1 (8 courses)
  
  1. New Data
    - 10 questions per course
    - Covers: AI Receptionist, Automation AI, Blog Growth, Care Coordination
      Customer Reactivation, Facebook Monetization, Financial Basics, Hiring
*/

-- AI Receptionist & Missed Call Recovery™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'What percentage of calls go to voicemail for most small businesses?', '20-30%', '40-50%', '60-70%', '80-90%', 'C', '60-70% of calls typically go unanswered during busy periods.', 1),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'How quickly should an AI receptionist respond?', 'Within 24 hours', 'Within 1 hour', 'Within 5 minutes', 'Instantly', 'D', 'AI receptionists respond instantly to capture leads.', 2),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'What info should AI collect?', 'Just name', 'Name and number only', 'Name, number, service needed', 'Full address', 'C', 'Name, number, and service details enable effective follow-up.', 3),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'Average value of missed call for home services?', '$50-$100', '$150-$300', '$500-$800', '$1000+', 'C', 'Most home service jobs average $500-$800 per call.', 4),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'Best tone for AI messages?', 'Formal', 'Friendly and helpful', 'Aggressive', 'Casual', 'B', 'Friendly and helpful tones build trust.', 5),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'When is best time for AI follow-up?', 'Next day', 'Within 1 hour', 'Under 60 seconds', 'After 24 hours', 'C', 'Immediate response captures customers in buying mode.', 6),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'What happens after AI captures lead?', 'Wait for callback', 'Send to CRM and notify owner', 'Delete record', 'Post on social', 'B', 'Leads flow to CRM with owner notification.', 7),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'How to track missed call ROI?', 'Count total calls', 'Track AI follow-up bookings', 'Monitor voicemail length', 'Check call duration', 'B', 'ROI measured by AI-recovered lead conversions.', 8),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'Why customers don''t leave voicemails?', 'Prefer email', 'Don''t have time', 'Call competitor instead', 'Voicemails outdated', 'C', 'Customers move to next business rather than wait.', 9),
('2bb3fc7e-b1f2-44e1-9ff4-94404bb50bbc', 'e1685700-8735-4fc2-98a1-9b0b57966d3f', 'AI receptionist vs voicemail difference?', 'Same thing', 'Actively engages leads', 'Only records', 'Costs more', 'B', 'AI actively engages and qualifies leads.', 10);

-- Automation & AI for Local Business™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'First task to automate?', 'Social media', 'Lead follow-up', 'Invoicing', 'Inventory', 'B', 'Lead follow-up has highest immediate ROI.', 1),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Time saved weekly with automation?', '1-2 hours', '5-10 hours', '15-20 hours', '30+ hours', 'C', 'Most businesses save 15-20 hours weekly.', 2),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Best way to start with AI?', 'Automate everything', 'One high-impact task', 'Hire consultant', 'Wait for maturity', 'B', 'Start with one high-impact task for quick wins.', 3),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Process NOT to fully automate?', 'Appointment reminders', 'Initial consultations', 'Review requests', 'FAQ emails', 'B', 'Consultations need human touch for trust.', 4),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'ROI timeframe for basic automation?', '6-12 months', '3-6 months', '1-3 months', '1-2 weeks', 'D', 'Basic tools show ROI within 1-2 weeks.', 5),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'How to measure automation success?', 'Number of tools', 'Time saved + revenue', 'Social likes', 'Website traffic', 'B', 'Success measured by time and revenue.', 6),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Biggest automation mistake?', 'Starting too small', 'Over-automating', 'Too few tools', 'Too slow', 'B', 'Over-automation damages customer relationships.', 7),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Touchpoint to keep human?', 'Confirmations', 'Problem resolution', 'Payment reminders', 'Review requests', 'B', 'Complaints require human empathy.', 8),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Review automation frequency?', 'Annually', 'Quarterly', 'Monthly', 'Weekly', 'C', 'Monthly reviews optimize performance.', 9),
('f68befbe-d307-4a6a-8d66-e04c3594b473', '1d9ae84a-f29d-4317-8d1d-62533ba86678', 'Sign automation needs adjustment?', 'Working perfectly', 'Customer complaints about robots', 'Saving time', 'Revenue up', 'B', 'Robot complaints indicate over-automation.', 10);

-- Blog Growth System™  
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Best blog topic for local business?', 'Company history', 'How-to solve customer problems', 'Industry news', 'Employee spotlights', 'B', 'Problem-solving content attracts customers searching for solutions.', 1),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Ideal blog post length?', '300-500 words', '800-1200 words', '2000+ words', '100-200 words', 'B', '800-1200 words balances depth and readability.', 2),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'How often to publish blogs?', 'Daily', '2-3 times per week', 'Weekly', 'Monthly', 'C', 'Weekly publishing maintains consistency without burnout.', 3),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Most important SEO element?', 'Keyword density', 'Title tag with target keyword', 'Image alt text', 'Meta description', 'B', 'Title tags are strongest ranking factor.', 4),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Where to promote blog posts?', 'Only on website', 'Social media and email', 'Paid ads only', 'Don''t promote', 'B', 'Multi-channel promotion maximizes reach.', 5),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Best call-to-action for blogs?', 'Buy now', 'Call for free consultation', 'Share this post', 'Subscribe to newsletter', 'B', 'Consultation offers match blog reader intent.', 6),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'How long until blog shows results?', '1-2 weeks', '1-2 months', '3-6 months', '12+ months', 'C', 'SEO momentum builds over 3-6 months.', 7),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Should you outsource blog writing?', 'Always DIY', 'Outsource with oversight', 'Never outsource', 'Hire full-time writer', 'B', 'Outsourcing with guidance scales content production.', 8),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Best way to find blog topics?', 'Random ideas', 'Customer questions', 'Competitor topics', 'Industry trends', 'B', 'Customer questions reveal high-value topics.', 9),
('b6c4b703-8b48-455f-930c-83d313a41bb9', '702b518a-6a3f-4667-9455-21ccf5f2765a', 'Metric to track blog success?', 'Page views', 'Leads generated', 'Social shares', 'Comments', 'B', 'Leads directly measure business impact.', 10);

-- Care Coordination for Families™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Target market for care coordination?', 'Everyone', 'Families with aging parents', 'Young adults', 'Businesses', 'B', 'Families managing elder care are ideal clients.', 1),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Average value per care coordination client?', '$500/year', '$2000/year', '$5000/year', '$10000/year', 'C', 'Annual contracts average $5000 for ongoing services.', 2),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Primary marketing channel?', 'TV ads', 'Senior centers and healthcare', 'Radio', 'Billboards', 'B', 'Healthcare partnerships drive qualified referrals.', 3),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Key service to offer?', 'Medical care', 'Appointment scheduling', 'Financial planning', 'Legal services', 'B', 'Scheduling reduces family stress significantly.', 4),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'How to price services?', 'Hourly rate', 'Monthly retainer', 'Per appointment', 'Annual contract', 'B', 'Monthly retainers provide predictable income.', 5),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Essential certification needed?', 'Medical degree', 'None specifically', 'Law degree', 'RN license', 'B', 'No specific certification required to start.', 6),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Best way to get first clients?', 'Cold calling', 'Network with healthcare providers', 'Facebook ads', 'Door to door', 'B', 'Healthcare provider networks are most effective.', 7),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Technology tool most needed?', 'CRM system', 'Accounting software', 'Video conferencing', 'Website builder', 'A', 'CRM tracks client needs and appointments.', 8),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Biggest client pain point?', 'Cost', 'Coordinating multiple providers', 'Transportation', 'Insurance', 'B', 'Managing multiple providers is overwhelming.', 9),
('a67447fc-efa5-476a-84eb-5880ce0b2754', '266ab671-ef70-45d7-b404-a34a8774bad2', 'Ideal client acquisition cost?', '$50-100', '$200-500', '$1000-2000', '$5000+', 'B', '$200-500 CAC allows profitable scaling.', 10);

-- Customer Reactivation Mastery™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Inactive customer threshold?', '30 days', '90 days', '6 months', '1 year', 'C', '6 months without purchase signals need for reactivation.', 1),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Best reactivation offer?', 'Generic discount', 'Personalized based on history', 'Free service', 'No offer', 'B', 'Personalization shows you remember them.', 2),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Reactivation email subject line?', 'Special offer inside', 'We miss you [Name]', 'Come back now', 'Discount available', 'B', 'Personal subject lines increase open rates.', 3),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Best channel for reactivation?', 'Email only', 'Multi-channel approach', 'Phone only', 'Mail only', 'B', 'Multiple touchpoints increase success.', 4),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Reactivation campaign length?', '1 touchpoint', '3-5 touchpoints', '10+ touchpoints', '20+ touchpoints', 'B', '3-5 touchpoints balance persistence and annoyance.', 5),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Expected reactivation rate?', '5-10%', '15-25%', '40-50%', '60-70%', 'B', '15-25% reactivation is strong performance.', 6),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Value of reactivated customer?', 'Same as new', 'Higher than new', 'Lower than new', 'No value', 'B', 'Reactivated customers have higher lifetime value.', 7),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'When to stop reactivation attempts?', 'After 1 try', 'After 5 tries', 'After 10 tries', 'Never stop', 'B', '5 attempts covers most recoverable customers.', 8),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Reactivation message tone?', 'Apologetic', 'Welcoming and grateful', 'Aggressive', 'Desperate', 'B', 'Welcoming tone rebuilds positive feelings.', 9),
('34784fe7-7510-4dce-b9de-26c09697d9e6', '50d51ec6-8fc1-4516-93d1-b5aef2cbd714', 'Best time to start reactivation?', 'Immediately at 6 months', 'Wait until 1 year', 'At 2 years', 'Never', 'A', 'Start at 6 months while still remembered.', 10);

-- Facebook Monetization for Local Businesses™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Best content type for engagement?', 'Product photos', 'Before/after results', 'Company news', 'Quotes', 'B', 'Before/after proves value emotionally.', 1),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Posting frequency?', 'Multiple daily', 'Once daily', '3-5 weekly', 'Weekly', 'C', '3-5 weekly maintains visibility without fatigue.', 2),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Best posting time?', 'Early morning', 'Lunch time', 'Evening', 'Varies by audience', 'D', 'Optimal times depend on YOUR audience.', 3),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Boost every post?', 'Yes always', 'Only high-performing', 'Never', 'Only promos', 'B', 'Boost posts with strong organic traction.', 4),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Best CTA for local services?', 'Like if agree', 'Share with friend', 'Comment INTERESTED', 'Visit website', 'C', 'Comments show active interest and qualify.', 5),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Initial ad spend?', '$10-20/day', '$50-100/day', '$200+/day', '$5/day', 'A', '$10-20 allows testing without major risk.', 6),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Best targeting radius?', 'Entire state', '1-15 miles', '25+ miles', 'No targeting', 'B', '1-15 miles captures realistic service area.', 7),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Best ad objective for leads?', 'Boost engagement', 'Lead gen forms', 'Page likes', 'Video views', 'B', 'Lead forms capture info without friction.', 8),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Handle negative comments?', 'Delete immediately', 'Ignore them', 'Respond professionally', 'Argue publicly', 'C', 'Professional response shows you care.', 9),
('273a7551-09d8-48ab-b357-ab9959b10b98', 'ee48533d-820e-4530-92b5-9efc61ee956a', 'Top monetization mistake?', 'Not posting enough', 'Being too salesy', 'Posting too much', 'Using video', 'B', 'Constant sales pitches turn off audiences.', 10);

-- Financial Basics for Small Business™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Most important financial metric?', 'Revenue', 'Profit margin', 'Cash flow', 'Assets', 'C', 'Cash flow determines business survival.', 1),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Minimum profit margin target?', '5-10%', '15-20%', '30-40%', '50%+', 'B', '15-20% margins ensure sustainability.', 2),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'How often review finances?', 'Annually', 'Quarterly', 'Monthly', 'Weekly', 'C', 'Monthly reviews catch issues early.', 3),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Separate business and personal?', 'Not necessary', 'Always separate', 'Only at tax time', 'Only if incorporated', 'B', 'Separation protects personal assets.', 4),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Emergency fund size?', '1 month expenses', '3 months expenses', '6 months expenses', '12 months expenses', 'C', '6 months covers most business disruptions.', 5),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Best accounting method?', 'Cash basis', 'Accrual basis', 'Hybrid', 'No tracking', 'B', 'Accrual gives true financial picture.', 6),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'When to hire bookkeeper?', 'Immediately', 'At $50K revenue', 'At $100K revenue', 'Never', 'B', '$50K revenue justifies professional help.', 7),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Pricing strategy to use?', 'Match competitors', 'Cost plus margin', 'Value-based', 'Lowest price', 'C', 'Value-based pricing maximizes profit.', 8),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Tax filing frequency?', 'Annual only', 'Quarterly estimated', 'Monthly', 'Semi-annual', 'B', 'Quarterly estimated payments avoid penalties.', 9),
('1a5927ff-0f95-4034-8910-7b27583ccb9e', 'b111647a-9cc5-4ec5-ba7b-c8d8bb09cd63', 'Key financial report to track?', 'Only bank statements', 'P&L statement', 'Tax returns', 'Invoices', 'B', 'P&L shows profitability clearly.', 10);

-- Hiring & Outsourcing for Local Business™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'First role to outsource?', 'Sales', 'Admin tasks', 'Marketing', 'Accounting', 'B', 'Admin tasks free you for revenue work.', 1),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Best platform for virtual assistants?', 'Craigslist', 'Upwork or Fiverr', 'Local newspaper', 'Social media', 'B', 'Upwork/Fiverr have vetted talent pools.', 2),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Ideal VA hourly rate?', '$5-10', '$15-25', '$40-60', '$80+', 'B', '$15-25 balances quality and affordability.', 3),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'How to train new hire?', 'Figure it out themselves', 'Record video SOPs', 'Shadow you daily', 'Written notes only', 'B', 'Video SOPs are reusable and clear.', 4),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'When to hire full-time?', 'Day one', 'When consistently busy', 'Never', 'After 5 years', 'B', 'Hire when demand consistently exceeds capacity.', 5),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Red flag in hiring?', 'Asks questions', 'No references', 'Negotiates rate', 'Has experience', 'B', 'No references suggests poor past performance.', 6),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Best way to test candidates?', 'Long interview', 'Paid trial project', 'Check resume', 'Trust gut feeling', 'B', 'Paid trials reveal actual work quality.', 7),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Manage remote workers how?', 'Constant calls', 'Daily check-ins + project tools', 'Micromanage', 'Leave alone', 'B', 'Daily check-ins maintain accountability.', 8),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'When to fire underperformer?', 'Immediately', 'After warning + 30 days', 'Never', 'After 1 year', 'B', 'Warning + 30 days gives fair chance.', 9),
('832bce80-a16f-4d32-a5fd-fcc554d94791', '48c14871-7596-4c1e-bd4d-3964220d9e2e', 'Cost of bad hire?', 'Nothing', '2-3x their salary', 'Minor inconvenience', 'Just time', 'B', 'Bad hires cost 2-3x salary in lost time/revenue.', 10);
