/*
  # Complete Business Coach Certification System
  
  1. Add 40 certification exam questions
  2. Add certification requirement tracking to dfy_jobs
  3. Update Business Coaching products with certification requirement
*/

-- Add 40 certification exam questions with uppercase answers
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     final_module AS (
       SELECT id FROM academy_modules 
       WHERE course_id = (SELECT id FROM course) 
       AND display_order = 10
     )
INSERT INTO academy_quizzes (course_id, module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order)
SELECT 
  course.id,
  final_module.id,
  question,
  opt_a,
  opt_b,
  opt_c,
  opt_d,
  answer,
  explain,
  order_num
FROM course, final_module,
(VALUES
  ('What does less than 30 days cash runway indicate?', 'Yellow flag', 'Minor concern', 'Red flag - emergency action required', 'Normal for small business', 'C', 'Less than 30 days cash is critical emergency', 1),
  ('First priority in emergency cash flow rescue?', 'Cut expenses', 'Call customers with outstanding invoices', 'Apply for loans', 'Lay off staff', 'B', 'Collect money already owed first', 2),
  ('Minimum profit margin in pricing?', '5-10%', '10-15%', '15-20%', '20-30%', 'D', '20-30% minimum for healthy business', 3),
  ('Months operating expenses in Profit Reserve?', '1-2 months', '2-3 months', '3-6 months', '6-12 months', 'C', '3-6 months protects against crisis', 4),
  ('Response time to increase close rate 10x?', 'Within 1 hour', 'Within 5 minutes', 'Within 24 hours', 'Same day', 'B', 'Within 5 minutes dramatically increases conversion', 5),
  ('Content marketing 80/20 rule?', '80% selling 20% value', '80% value 20% selling', '80% video 20% text', '80% social 20% email', 'B', '80% educational 20% promotional', 6),
  ('Excellent repeat purchase rate?', 'Over 10%', 'Over 20%', 'Over 30%', 'Over 40%', 'D', '40%+ repeat rate excellent', 7),
  ('Main benefit of documented systems?', 'Look professional', 'Business runs without owner and can scale', 'Impress investors', 'Reduce costs', 'B', 'Systems enable scaling and owner freedom', 8),
  ('Level 3 owner freedom?', 'Operator doing everything', 'Manager managing team', 'Executive with team managing operations', 'Investor passive income', 'C', 'Executive level team manages you set strategy', 9),
  ('Pipeline revenue calculation?', 'Total pipeline value', 'Number deals × average', 'Pipeline value × historical close rate', 'Pipeline ÷ months', 'C', 'Pipeline × close rate predicts revenue', 10),
  ('Commission should allow salespeople to?', 'Match base', 'Earn 25% more', 'Double base salary through performance', 'Triple base', 'C', 'Commission should enable doubling base', 11),
  ('Leaders in crisis should?', 'Hide bad news', 'Communicate frequently even without all answers', 'Wait for perfect info', 'Reduce visibility', 'B', 'Frequent communication builds confidence', 12),
  ('Hire slow fire fast means?', 'Thorough hiring quick performance action', 'Hire fast fire slowly', 'Slow all HR', 'Fast everything', 'A', 'Take time hiring address non-performance quickly', 13),
  ('Best goal-setting framework?', 'SMART goals', 'OKR Objectives and Key Results', 'KPI tracking', 'Annual reviews', 'B', 'OKRs define what and how to measure', 14),
  ('What motivates beyond money?', 'Job titles', 'Purpose and recognition', 'Perks', 'Vacations', 'B', 'Purpose and recognition drive motivation', 15),
  ('First action under 30 days cash?', 'Marketing plan', 'Cut all non-essential spending immediately', 'Hire consultant', 'Rebrand', 'B', 'Stop bleeding cut non-essentials first', 16),
  ('How to prioritize creditors?', 'Newest first', 'By criticality payroll utilities insurance rent', 'Largest first', 'Whoever calls', 'B', 'Tier by criticality of operations', 17),
  ('Turnaround success themes?', 'Hire consultants', 'Raise prices focus best customers eliminate waste fast', 'Cut prices', 'Rebrand', 'B', 'Price increases customer focus waste elimination', 18),
  ('Post-crisis cash reserve goal?', '1-2 months', '3-4 months', '6 months', '1 year', 'C', '6 months reserves prevent next crisis', 19),
  ('Value-based pricing basis?', 'Your costs', 'Competitor prices', 'Value delivered to customer', 'Industry standards', 'C', 'Price on value to customer not costs', 20),
  ('Healthy gross profit margin?', 'Over 20%', 'Over 30%', 'Over 40%', 'Over 50%', 'D', 'Over 50% gross margin healthy', 21),
  ('Target net profit percentage?', '5-10%', '10-15%', '15-25%', '25-40%', 'C', '15-25% net profit target', 22),
  ('Impact 1% margin improvement?', 'Slight increase', 'Flows straight to bottom line', 'Reduced by taxes', 'No impact', 'B', '1% margin 100% profit increase', 23),
  ('Loyal customer value vs new?', '2x lifetime value', '5x lifetime value', '10x lifetime value', 'Same value', 'C', '10x LTV plus referrals', 24),
  ('Excellent NPS score?', 'Above 20', 'Above 30', 'Above 50', 'Above 70', 'C', 'NPS 50+ excellent 70+ world class', 25),
  ('Top reason customers leave?', 'Better offer', 'No longer need', 'Forgot', 'Poor service', 'D', 'Poor service causes 68% churn', 26),
  ('Healthy referral rate target?', '10-20%', '20-30%', '30-50%', '50-70%', 'C', '30-50% referral rate healthy', 27),
  ('5% retention increase profit?', '5-15%', '10-25%', '25-95%', '100%+', 'C', '25-95% profit increase 5% retention', 28),
  ('Who do satisfied customers refer?', 'Everyone', 'A few', 'No one only raving fans refer', 'Family', 'C', 'Satisfied neutral only raving fans refer', 29),
  ('Number one business killer?', 'Competition', 'Market changes', 'Premature scaling', 'Poor marketing', 'C', 'Premature scaling kills most businesses', 30),
  ('Profitability before scaling?', '2-3 months', '4-5 months', '6+ months', '1 year', 'C', '6+ months profit before scaling', 31),
  ('Sustainable growth rate?', 'Triple 6mo', 'Double every 12-18 months', '50% annually', '200% annually', 'B', 'Double 12-18mo aggressive sustainable', 32),
  ('Lowest risk growth strategy?', 'New markets', 'New products', 'Diversification', 'Market penetration to existing', 'D', 'Existing customers markets lowest risk', 33),
  ('Service business sale multiple?', '1-2x EBITDA', '2-4x EBITDA', '4-6x EBITDA', '6-10x EBITDA', 'B', 'Service 2-4x EBITDA typical', 34),
  ('Top valuation factor?', 'Revenue size', 'Years in business', 'Owner independent operations', 'Physical location', 'C', 'Business without owner top value driver', 35),
  ('Business sale timeline?', '1-2 months', '3-4 months', '6-12 months', '18-24 months', 'C', '6-12 months start to close typical', 36),
  ('ICE Framework meaning?', 'Income Compliance Efficiency', 'Impact Confidence Ease', 'Inventory Cash Expenses', 'Investment Capital Equity', 'B', 'Impact Confidence Ease for priority', 37),
  ('Best time ask referrals?', 'During onboarding', 'After they give praise', 'End year', 'Never interrupt', 'B', 'Ask immediately after positive feedback', 38),
  ('Primary benefit OKRs?', 'Looks professional', 'Clear measurable goals and key results', 'Reduces meetings', 'Increases bonuses', 'B', 'OKRs clarity objectives measurement', 39),
  ('Vacation test owner independence?', '1 week off', '2 weeks off phone email business runs', '1 month sabbatical', 'Work remotely', 'B', '2 weeks disconnected business operates', 40)
) AS questions(question, opt_a, opt_b, opt_c, opt_d, answer, explain, order_num);

-- Add required_certification column to dfy_jobs if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dfy_jobs' AND column_name = 'required_certification'
  ) THEN
    ALTER TABLE dfy_jobs ADD COLUMN required_certification TEXT;
    COMMENT ON COLUMN dfy_jobs.required_certification IS 'Required certification badge name for partners to accept this job. Ex: Certified Business Coach';
    CREATE INDEX idx_dfy_jobs_required_certification ON dfy_jobs(required_certification) WHERE required_certification IS NOT NULL;
  END IF;
END $$;

-- Update Business Coaching marketplace products with certification requirement
UPDATE marketplace_affiliate_products
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{required_certification}',
  '"Certified Business Coach"'
)
WHERE name LIKE '%Business Coach%' OR name LIKE '%Business Coaching%';
