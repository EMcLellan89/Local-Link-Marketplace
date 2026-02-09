/*
  # Generate Quizzes Batch 3 - Final 8 courses
  
  1. New Data
    - Covers: Pet Businesses, Pricing, Review Growth, Reviews Convert
      Scaling, Social Media, Side Hustle, UGC
*/

-- Pet Businesses That Get Found First™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Best pet business niche?', 'All pets', 'Specific pet type', 'Exotics only', 'Farm animals', 'B', 'Specialization attracts ideal clients.', 1),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Pet owner search behavior?', 'Price only', 'Proximity + reviews', 'Brand names', 'Random selection', 'B', 'Pet owners prioritize nearby quality.', 2),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Photo importance for pet businesses?', 'Not needed', 'Absolutely critical', 'Minor benefit', 'Hurts business', 'B', 'Pet photos drive emotional decisions.', 3),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Best marketing channel?', 'TV ads', 'Local Facebook groups', 'Radio', 'Newspapers', 'B', 'Pet owner communities are goldmines.', 4),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Pet business reviews critical?', 'Not needed', 'Extremely important', 'Minor factor', 'Don''t matter', 'B', 'Pet owners thoroughly research before trusting.', 5),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Partnership opportunities?', 'None exist', 'Vets, groomers, trainers', 'Only corporate', 'Too competitive', 'B', 'Pet service partnerships create referrals.', 6),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Pet owner lifetime value?', '$100-500', '$1000-3000', '$5000-10000', '$20000+', 'C', 'Pet services have high lifetime value.', 7),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Best retention tactic?', 'Lower prices', 'Membership programs', 'One-time discounts', 'Nothing needed', 'B', 'Memberships create recurring revenue.', 8),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Content to create?', 'Sales pitches', 'Pet care tips', 'Competitor bashing', 'Political content', 'B', 'Educational content builds authority.', 9),
('14b21a5f-0c86-413b-833e-e4943bdcf497', 'b3cd5c1a-a3f8-4a07-a41f-e63a279406c9', 'Pet emergency coverage?', 'Not my problem', 'Essential to communicate', 'Scare customers', 'Never mention', 'B', 'Emergency protocols build trust.', 10);

-- Pricing & Profitability™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Pricing based on?', 'What competitors charge', 'Your costs + value', 'Customer budget', 'Random guess', 'B', 'Value-based pricing maximizes profit.', 1),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Raise prices how often?', 'Never', 'Annually', 'Every 5 years', 'When costs increase', 'B', 'Annual increases keep pace with inflation.', 2),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Discount strategy?', 'Discount often', 'Rarely, strategically', 'Never discount', 'Always 50% off', 'B', 'Rare discounts maintain value perception.', 3),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Profit margin target?', '5-10%', '20-30%', '50-60%', '80%+', 'B', '20-30% ensures business health.', 4),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Present pricing how?', 'Lowest to highest', 'Highest to lowest', 'Middle option prominent', 'Single option only', 'C', 'Middle option anchors expectations.', 5),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Package pricing vs itemized?', 'Always itemize', 'Packages convert better', 'No difference', 'Confuses customers', 'B', 'Packages simplify decisions and increase value.', 6),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Raise prices lose customers?', 'Always lose many', 'Lose few if communicated', 'Lose all customers', 'Never lose any', 'B', 'Proper communication retains most customers.', 7),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Premium pricing works when?', 'Never', 'With superior service/results', 'Only luxury markets', 'Only big cities', 'B', 'Premium pricing requires premium delivery.', 8),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Calculate true cost by?', 'Rough estimate', 'Track all expenses + time', 'Industry average', 'Competitor prices', 'B', 'Accurate tracking reveals true profitability.', 9),
('4e302c0a-4edf-4859-bfa7-474b0837bf11', 'e6741fcb-2520-4649-9f24-8b746d82a994', 'Price objection response?', 'Lower price immediately', 'Emphasize value and ROI', 'Walk away', 'Get defensive', 'B', 'Value demonstration justifies pricing.', 10);

-- Review Growth & Protection™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'When to ask for reviews?', 'Never ask', 'Immediately after service', 'After 1 week', 'After 1 month', 'B', 'Ask while satisfaction is highest.', 1),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Response to negative reviews?', 'Ignore them', 'Respond professionally', 'Argue back', 'Delete if possible', 'B', 'Professional response shows character.', 2),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Review quantity vs quality?', 'Quantity only', 'Quality only', 'Both matter', 'Neither matters', 'C', 'Volume and ratings both drive trust.', 3),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Automate review requests?', 'Never automate', 'Yes with personal touch', 'Fully robotic', 'Against rules', 'B', 'Automation with personalization scales effectively.', 4),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Review platforms to prioritize?', 'All equally', 'Google + industry-specific', 'Only Facebook', 'Only Yelp', 'B', 'Focus on platforms customers use.', 5),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Incentivize reviews?', 'Pay for reviews', 'Gentle reminders only', 'Aggressive demands', 'No incentives allowed', 'B', 'Gentle nudges avoid policy violations.', 6),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Deal with fake negative reviews?', 'Ignore them', 'Report and respond', 'Retaliate', 'Pay to remove', 'B', 'Report to platform and address publicly.', 7),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Review generation rate?', '1 per month', '5-10 per month', '20-30 per month', '100+ per month', 'B', '5-10 monthly reviews build strong profile.', 8),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Display reviews where?', 'Only on Google', 'Website + all platforms', 'Hide them', 'Only positive ones', 'B', 'Multi-platform display builds credibility.', 9),
('25f29aee-9490-48e1-bc29-3604fd9ac184', 'd4076e83-051b-4345-aea8-f91229ad8d29', 'Respond to positive reviews?', 'Not necessary', 'Yes, thank everyone', 'Only negative', 'Wastes time', 'B', 'Thanking reviewers encourages more reviews.', 10);

-- Reviews That Bring Customers In™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Review impact on conversions?', 'No impact', 'Increase by 50-200%', 'Slight increase', 'Hurts conversions', 'B', 'Reviews dramatically boost trust and sales.', 1),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Minimum reviews for credibility?', '1-5', '10-25', '50-100', '500+', 'B', '10-25 reviews establish initial trust.', 2),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Reviews influence local rankings?', 'No impact', 'Major ranking factor', 'Minor benefit', 'Hurts rankings', 'B', 'Reviews are top 3 local SEO factor.', 3),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Feature reviews on website?', 'Not allowed', 'Absolutely showcase', 'Unnecessary', 'Hurts credibility', 'B', 'Website reviews convert visitors.', 4),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Video reviews vs text?', 'Text better', 'Video 10x more powerful', 'Same impact', 'Video too difficult', 'B', 'Video reviews build strongest trust.', 5),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Share reviews on social?', 'Seems bragging', 'Share regularly', 'Never share', 'Only once', 'B', 'Social sharing amplifies social proof.', 6),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Recent reviews matter more?', 'Old reviews better', 'Recent are prioritized', 'Age doesn''t matter', 'Only first reviews count', 'B', 'Fresh reviews signal active business.', 7),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Review keywords important?', 'Don''t matter', 'Help SEO and credibility', 'Hurt rankings', 'Too technical', 'B', 'Service keywords in reviews boost SEO.', 8),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Detailed vs short reviews?', 'Short better', 'Detailed more credible', 'Same value', 'Detailed suspicious', 'B', 'Detail proves authenticity.', 9),
('0a4356a6-0701-4265-b5cf-198694b4427c', '6dba21ed-cc6b-4128-b7a3-5dbe43877bd4', 'Use reviews in ads?', 'Against rules', 'Highly effective', 'Doesn''t help', 'Confuses customers', 'B', 'Review-based ads outperform standard ads.', 10);

-- Scaling Your Local Business™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'First scaling step?', 'Hire immediately', 'Systemize current operations', 'Open new location', 'Raise prices', 'B', 'Systems enable scalable growth.', 1),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Document processes via?', 'Mental notes', 'Video SOPs', 'Nothing needed', 'Verbal only', 'B', 'Video SOPs scale training.', 2),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'When to hire first employee?', 'Day one', 'When consistently busy', 'After 10 years', 'Never hire', 'B', 'Consistent demand justifies hiring.', 3),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Scaling bottleneck usually?', 'Money', 'Owner doing everything', 'Market size', 'Technology', 'B', 'Owner involvement limits growth.', 4),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Multiple locations timing?', 'Immediately', 'After mastering one', 'Never expand', 'After 20 years', 'B', 'Perfect one location first.', 5),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Maintain quality while scaling?', 'Impossible', 'Through systems + training', 'Accept lower quality', 'Limit growth', 'B', 'Proper systems maintain standards.', 6),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Marketing during scaling?', 'Stop marketing', 'Increase marketing investment', 'Same budget', 'Cut marketing', 'B', 'Growth requires fuel.', 7),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Financing for growth?', 'Personal savings only', 'Mix of options', 'Never use debt', 'Max credit cards', 'B', 'Strategic financing accelerates growth.', 8),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Owner role in scaled business?', 'Do all tasks', 'Work ON not IN business', 'Fully absent', 'Only sales', 'B', 'Strategic leadership drives growth.', 9),
('5fc3a141-8b82-4e93-a3d7-ad5583fccb51', 'c1a468f5-971c-48f2-bf1e-ea590cac9f80', 'Scaling success metric?', 'Total revenue', 'Profit per location/employee', 'Number of employees', 'Years in business', 'B', 'Profitability per unit matters most.', 10);

-- Social Media for Local Business™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Best social platform for local?', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter', 'B', 'Facebook dominates local audience.', 1),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Posting frequency goal?', 'Daily', '3-5 times weekly', 'Weekly', 'Monthly', 'B', '3-5 weekly maintains engagement.', 2),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Content mix ratio?', '100% sales', '80% value, 20% sales', '50/50 split', '100% education', 'B', 'Value-first builds audience.', 3),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Engagement strategy?', 'Post and ghost', 'Actively respond to all', 'Ignore comments', 'Auto-reply only', 'B', 'Engagement builds community.', 4),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'User-generated content?', 'Ignore it', 'Reshare with permission', 'Steal without credit', 'Not valuable', 'B', 'UGC provides authentic social proof.', 5),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Social media ROI?', 'Impossible to track', 'Track engagement to sales', 'Only follower count', 'Don''t measure', 'B', 'Connection to sales proves value.', 6),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Video vs image posts?', 'Images always better', 'Video gets more reach', 'No difference', 'Text only best', 'B', 'Video prioritized by algorithms.', 7),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Hashtag strategy?', 'No hashtags', 'Mix of popular + niche', 'Only trending', 'Maximum allowed', 'B', 'Balanced hashtags reach right audience.', 8),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Schedule posts or real-time?', 'Only real-time', 'Mix of scheduled + real-time', 'Never schedule', 'Only scheduled', 'B', 'Scheduling ensures consistency.', 9),
('e4e4f022-becc-4b07-af69-82846260bc9a', '479d6dbe-9992-4f29-9c92-ad7923093e53', 'Handle social media complaints?', 'Delete them', 'Respond and resolve publicly', 'Ignore them', 'Block user', 'B', 'Public resolution shows customer care.', 10);

-- Start a Local Service Side Hustle™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Best side hustle to start?', 'High investment business', 'Low overhead service', 'Franchise', 'Manufacturing', 'B', 'Service businesses start with minimal capital.', 1),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Starting capital needed?', '$50000+', '$10000-25000', '$1000-5000', '$500 or less', 'D', 'Many services start under $500.', 2),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Get first customers?', 'Wait for website', 'Tell everyone you know', 'Big ad campaign', 'Wait and hope', 'B', 'Personal network launches business.', 3),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Quit day job when?', 'Day one', 'When side income exceeds job', 'After 5 years', 'Never quit', 'B', 'Match income before leaving security.', 4),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Price side hustle services?', 'Lowest in market', 'Market rate or higher', 'Work for free', 'Extremely high', 'B', 'Value pricing from day one.', 5),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Legal structure to start?', 'Corporation immediately', 'Sole proprietor then upgrade', 'Partnership', 'No structure needed', 'B', 'Start simple, formalize as you grow.', 6),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Time to first dollar?', '6-12 months', '3-6 months', '1-4 weeks', '1-2 years', 'C', 'Services can earn quickly.', 7),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Work hours for side hustle?', '40+ hours weekly', '10-15 hours weekly', '2-5 hours weekly', 'Sporadic hours', 'B', '10-15 hours weekly builds momentum.', 8),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Biggest side hustle mistake?', 'Starting too small', 'Perfectionism delaying launch', 'Charging too much', 'Too much marketing', 'B', 'Launch imperfectly and iterate.', 9),
('3dc15b1c-461a-47b9-976e-ac6df2c87225', '62b6584c-d5a3-4c93-8d4d-e3c646447854', 'Scale side hustle by?', 'Work more hours', 'Raise prices + systems', 'Lower prices', 'Give up', 'B', 'Pricing and efficiency enable scaling.', 10);

-- UGC From Home™
INSERT INTO academy_quizzes (module_id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'What is UGC?', 'User Generated Content', 'Universal Game Console', 'Unified Graphics Card', 'Urban Garden Center', 'A', 'UGC is authentic content created by real people.', 1),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'UGC earning potential?', '$100-500/month', '$1000-3000/month', '$5000-10000/month', '$20000+/month', 'C', 'Full-time UGC creators earn $5K-10K+.', 2),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'Equipment needed?', 'Professional studio', 'Smartphone only', '$10K camera', 'Film crew', 'B', 'Quality smartphone is sufficient.', 3),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'Find UGC clients?', 'Cold outreach + platforms', 'Wait for discovery', 'Only agencies', 'Traditional ads', 'A', 'Proactive outreach lands clients.', 4),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'Price per UGC video?', '$10-25', '$50-100', '$150-300', '$1000+', 'C', '$150-300 is standard for quality UGC.', 5),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'UGC portfolio needed?', 'Not necessary', 'Absolutely essential', 'Nice to have', 'Hurts chances', 'B', 'Portfolio proves capability to brands.', 6),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'Best UGC niches?', 'Everything', 'Specific verticals', 'Only tech', 'Only beauty', 'B', 'Niche specialization attracts ideal clients.', 7),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'UGC vs influencer difference?', 'Same thing', 'UGC focuses on product not creator', 'Influencer better', 'No difference', 'B', 'UGC highlights product authentically.', 8),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'Time to first UGC payment?', '6-12 months', '3-6 months', '2-6 weeks', '2+ years', 'C', 'First payments come within weeks.', 9),
('58319a76-6c9f-4351-b340-e0f85259762d', 'df50abd6-260b-4df9-a6d1-6350d89f5111', 'UGC content rights?', 'Creator keeps all', 'Usually brand owns', 'Shared forever', 'No one owns', 'B', 'Brands typically purchase full rights.', 10);
