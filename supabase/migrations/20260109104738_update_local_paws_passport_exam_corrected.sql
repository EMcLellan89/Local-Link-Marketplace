/*
  # Update Exam Questions for Local Paws Passport™ Course
  
  Replaces all exam questions with content relevant to selling
  Local Paws Passport™ partnerships to local pet businesses.
*/

-- Delete old exam questions
DELETE FROM course_exam_questions
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f';

-- Insert new Local Paws Passport™ exam questions
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation) VALUES

-- Question 1
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 1, 
'What is the primary problem that Local Paws Passport™ solves?',
'multiple_choice',
'[
  {"id": "a", "text": "Information about lost pets is scattered across multiple platforms"},
  {"id": "b", "text": "Pet owners don''t care about finding lost pets"},
  {"id": "c", "text": "Local businesses refuse to help with lost pets"},
  {"id": "d", "text": "Shelters don''t accept found pets"}
]'::jsonb,
'a',
'Local Paws Passport™ creates one centralized, official place per town for reporting lost and found pets, eliminating the confusion of scattered Facebook posts, flyers, and phone calls.'),

-- Question 2
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 2,
'How much does the Standard Partnership tier cost per month?',
'multiple_choice',
'[
  {"id": "a", "text": "$49/month"},
  {"id": "b", "text": "$97/month"},
  {"id": "c", "text": "$197/month"},
  {"id": "d", "text": "$297/month"}
]'::jsonb,
'b',
'The Standard Partnership costs $97/month and includes exclusive category placement, verified listing, Community Pet Safety Partner status, and physical welcome kit materials.'),

-- Question 3
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 3,
'What is your recurring commission rate on all partner subscriptions?',
'multiple_choice',
'[
  {"id": "a", "text": "10%"},
  {"id": "b", "text": "15%"},
  {"id": "c", "text": "20%"},
  {"id": "d", "text": "25%"}
]'::jsonb,
'c',
'As a territory partner, you earn 20% recurring commission on every partner subscription, plus bonuses for merchant services signups.'),

-- Question 4
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 4,
'Why is category exclusivity important when selling Local Paws Passport™?',
'multiple_choice',
'[
  {"id": "a", "text": "It creates urgency and value for businesses"},
  {"id": "b", "text": "It makes it easier to sign up multiple competitors"},
  {"id": "c", "text": "It allows unlimited businesses per category"},
  {"id": "d", "text": "It reduces the commission rate"}
]'::jsonb,
'a',
'Category exclusivity means only ONE business per category per town can be a partner. This creates urgency (sign up before your competitor does) and value (no dilution of trust or visibility).'),

-- Question 5
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 5,
'What should you prioritize when selecting your first town to target?',
'multiple_choice',
'[
  {"id": "a", "text": "The largest city in the state"},
  {"id": "b", "text": "A town where you have local knowledge or connections"},
  {"id": "c", "text": "The wealthiest town regardless of distance"},
  {"id": "d", "text": "A town with no pet businesses"}
]'::jsonb,
'b',
'Start with a manageable town where you have local knowledge, connections, or proximity. Master one town before expanding to others.'),

-- Question 6
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 6,
'Which business category should typically be your highest priority in a new town?',
'multiple_choice',
'[
  {"id": "a", "text": "Dog trainers"},
  {"id": "b", "text": "Pet stores"},
  {"id": "c", "text": "Emergency veterinarians"},
  {"id": "d", "text": "Groomers"}
]'::jsonb,
'c',
'Emergency vets should be highest priority because they see the lost pet problem most acutely, typically choose the Premier tier ($297/month), and have the highest community trust.'),

-- Question 7
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 7,
'When a business says "I need to think about it," what should you do?',
'multiple_choice',
'[
  {"id": "a", "text": "Give up immediately"},
  {"id": "b", "text": "Create urgency by mentioning you''re talking to competitors and set a follow-up date"},
  {"id": "c", "text": "Offer a 50% discount"},
  {"id": "d", "text": "Wait for them to call you back"}
]'::jsonb,
'b',
'Acknowledge their need to think, but create urgency by mentioning category exclusivity and that you''re in conversations with other businesses. Set a specific follow-up date (tomorrow or next day).'),

-- Question 8
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 8,
'What is included in the physical welcome kit that partners receive?',
'multiple_choice',
'[
  {"id": "a", "text": "Only a welcome letter"},
  {"id": "b", "text": "Window sticker, counter card, QR flyers, and welcome letter"},
  {"id": "c", "text": "Just QR codes sent via email"},
  {"id": "d", "text": "Business cards for the partner"}
]'::jsonb,
'b',
'The welcome kit includes a vinyl window sticker, counter card/table tent, stack of QR flyers, welcome letter, and partner instruction guide—all assembled and shipped by corporate.'),

-- Question 9
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 9,
'What is the best approach method for local businesses within 30 minutes of your location?',
'multiple_choice',
'[
  {"id": "a", "text": "Send a cold email"},
  {"id": "b", "text": "Make a phone call only"},
  {"id": "c", "text": "Walk-in visit during non-peak hours"},
  {"id": "d", "text": "Send a text message"}
]'::jsonb,
'c',
'Walk-in visits are most effective for local businesses because they build immediate rapport, show professionalism, and are harder to dismiss. Best timing is Tuesday-Thursday, 10am-2pm.'),

-- Question 10
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 10,
'How should you respond when a business asks for a discount?',
'multiple_choice',
'[
  {"id": "a", "text": "Immediately offer 20% off"},
  {"id": "b", "text": "Explain that all partners pay the same rate to maintain fairness"},
  {"id": "c", "text": "Give them the first month free"},
  {"id": "d", "text": "Negotiate down to their budget"}
]'::jsonb,
'b',
'Never discount. Explain that all partners pay the same rate to maintain fairness across territories. You can mention the annual prepay option (2 months free) if they commit to a year.'),

-- Question 11
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 11,
'What is the most important factor in retaining partners long-term?',
'multiple_choice',
'[
  {"id": "a", "text": "Calling them every week"},
  {"id": "b", "text": "Setting realistic expectations and providing quarterly check-ins"},
  {"id": "c", "text": "Offering constant discounts"},
  {"id": "d", "text": "Promising immediate ROI"}
]'::jsonb,
'b',
'Retention comes from setting realistic expectations upfront (this is infrastructure, not daily marketing) and maintaining regular but not intrusive communication through quarterly check-ins.'),

-- Question 12
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 12,
'If you have 10 Standard partners at $97/month, what is your monthly recurring commission?',
'multiple_choice',
'[
  {"id": "a", "text": "$97"},
  {"id": "b", "text": "$194"},
  {"id": "c", "text": "$970"},
  {"id": "d", "text": "$485"}
]'::jsonb,
'b',
'10 partners × $97/month = $970 total MRR. Your 20% commission = $194/month in recurring income.'),

-- Question 13
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 13,
'What should you do during the first 7 days after a partner signs up?',
'multiple_choice',
'[
  {"id": "a", "text": "Nothing—let them figure it out"},
  {"id": "b", "text": "Send welcome email, set expectations, and follow up when kit arrives"},
  {"id": "c", "text": "Visit them daily to check on progress"},
  {"id": "d", "text": "Ask for a referral immediately"}
]'::jsonb,
'b',
'Day 1: Send welcome email and set expectations. Day 3: Check-in email about kit arrival. Day 7: Follow-up call to ensure kit arrived and answer questions.'),

-- Question 14
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 14,
'When should you attempt to upsell a partner to a higher tier?',
'multiple_choice',
'[
  {"id": "a", "text": "Immediately at signup"},
  {"id": "b", "text": "After 3-6 months when they''re comfortable and confident"},
  {"id": "c", "text": "Never—upselling is pushy"},
  {"id": "d", "text": "Only when they threaten to cancel"}
]'::jsonb,
'b',
'Wait 3-6 months for partners to see value and build confidence, then mention upgrade options as consultant-style suggestions, not aggressive sales pitches.'),

-- Question 15
('55b2c984-58ca-4f1b-9ae8-1337db30e15f', 15,
'What is the best way to generate new leads after you have several happy partners?',
'multiple_choice',
'[
  {"id": "a", "text": "Cold calling only"},
  {"id": "b", "text": "Asking happy partners for referrals to other pet businesses"},
  {"id": "c", "text": "Buying email lists"},
  {"id": "d", "text": "Posting on social media"}
]'::jsonb,
'b',
'After 2-3 months, ask satisfied partners if they know other pet business owners who might be interested. Offer a $50 credit for successful referrals. Referrals become your best lead source over time.');
