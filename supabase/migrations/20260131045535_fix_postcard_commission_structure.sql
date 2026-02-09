/*
  # Fix Postcard Commission Structure
  
  Update commission information to reflect 50% of profit after printing/postage costs.
  Estimated costs: $1,500 per mailing for printing/postage for 5,000 postcards.
*/

-- Update Module 2 lessons with correct profit-based commissions
UPDATE academy_lessons
SET article_content = E'**YOUR COMMISSION: ~$50 (50% of profit after costs)**

**What They Get:**
- Standard ad spot on postcard
- Reaches 5,000 households
- Professional design
- QR code tracking
- Performance analytics

**Pricing:**
- Merchant pays: $299
- Printing/postage costs: ~$200
- Net profit: ~$100
- Your 50% commission: ~$50

**Best For:**
- Businesses new to postcard advertising
- Smaller businesses testing waters
- Tight marketing budgets

**Sales Pitch:**
"For $299, you reach 5,000 households - that is 6 cents per person. If just 5 become customers, you will 10x your investment. We handle design, printing, mailing."

**Objections:**
"Too expensive" → "Facebook ads to reach 5,000 LOCAL people cost $500-1,000. This is guaranteed delivery."

"I will think about it" → "Next mailing in 2 weeks. Only 4 spots left. Do not miss reaching 5,000 potential customers."'
WHERE title = 'Value Placement - $299' AND module_id IN (
  SELECT m.id FROM academy_modules m
  JOIN academy_courses c ON c.id = m.course_id
  WHERE c.slug = 'selling-postcard-ads'
);

UPDATE academy_lessons
SET article_content = E'**YOUR COMMISSION: ~$100 (50% of profit after costs)**

**Most Popular Choice!**

**What They Get:**
- Better visibility, larger ad space
- Priority placement
- Reaches 5,000 households
- QR code tracking
- Professional design

**Pricing:**
- Merchant pays: $499
- Printing/postage costs: ~$300
- Net profit: ~$200
- Your 50% commission: ~$100

**Why Most Popular:**
- Sweet spot between price and visibility
- Noticeably larger than Value
- Better ROI from increased visibility

**Sales Pitch:**
"Our most popular option gives you significantly more visibility for only $200 more. Larger ad, priority position, impossible to miss."

**Upsell from Value:**
"For just $200 more, Standard placement gives you MUCH better visibility - larger space, priority positioning. If you want to grow quickly, Standard is the smarter investment."'
WHERE title = 'Standard Placement - $499' AND module_id IN (
  SELECT m.id FROM academy_modules m
  JOIN academy_courses c ON c.id = m.course_id
  WHERE c.slug = 'selling-postcard-ads'
);

UPDATE academy_lessons
SET article_content = E'**YOUR COMMISSION: ~$175 (50% of profit after costs)**

**What They Get:**
- Front page, top position
- Maximum visibility
- First thing people see
- Largest standard ad space
- Dedicated analytics

**Pricing:**
- Merchant pays: $799
- Printing/postage costs: ~$450
- Net profit: ~$350
- Your 50% commission: ~$175

**Best For:**
- High-ticket businesses (furniture, auto, contractors)
- Grand openings or special events
- Businesses wanting to dominate

**Sales Pitch:**
"Premium is front-page, top position - FIRST thing people see. For high-ticket businesses, this pays for itself with 1-2 customers."

**Perfect For:**
- Auto dealers: "One car sale = 3 months Premium"
- Furniture: "One living room set = 4 mailings"
- HVAC: "One furnace = 8 mailings"

**Objection:**
"Too expensive" → "What is your average customer value? If this brings 2-3 customers out of 5,000 people, you profit. Front-page dramatically increases response."'
WHERE title = 'Premium Placement - $799' AND module_id IN (
  SELECT m.id FROM academy_modules m
  JOIN academy_courses c ON c.id = m.course_id
  WHERE c.slug = 'selling-postcard-ads'
);

UPDATE academy_lessons
SET article_content = E'**YOUR COMMISSION: ~$500 (50% of profit after costs)**

**What They Get:**
- EXCLUSIVE - only business on postcard
- Full postcard design (front and back)
- NO competition
- Premium tracking
- Highest possible impact

**Pricing:**
- Merchant pays: $2,500
- Printing/postage costs: ~$1,500
- Net profit: ~$1,000
- Your 50% commission: ~$500

**When to Pitch:**
- Grand openings or major events
- Major sales (anniversary, going out of business)
- High-end businesses (luxury auto, furniture)
- When they need BIG splash

**Sales Pitch:**
"Solo is YOUR exclusive mailing - your business is the ONLY one on the entire postcard. No competitors, no distractions. This is for when you need maximum impact."

**ROI Examples:**
- Auto dealer: "1-2 cars covers this"
- Furniture: "Two bedroom sets pays for it"
- Restaurant opening: "Pack your restaurant opening weekend"

**The Power Move:**
"Start with Solo for your grand opening to create massive buzz, then step down to Premium for ongoing visibility."'
WHERE title = 'Solo Mailing - $2,500' AND module_id IN (
  SELECT m.id FROM academy_modules m
  JOIN academy_courses c ON c.id = m.course_id
  WHERE c.slug = 'selling-postcard-ads'
);

-- Update income goals lesson
UPDATE academy_lessons
SET article_content = E'**Commission Breakdown (50% of profit after costs):**
- Value ($299): You earn ~$50
- Standard ($499): You earn ~$100
- Premium ($799): You earn ~$175
- Solo ($2,500): You earn ~$500

**Monthly Income Scenarios:**

**Part-Time ($2,000/month):**
- 40 Value placements ($2,000)
- OR 20 Standard placements ($2,000)
- OR 11 Premium placements ($1,925)
- OR 4 Solo mailings ($2,000)

**Full-Time ($5,000/month):**
- 50 Standard placements ($5,000)
- OR 28 Premium placements ($4,900)
- OR 10 Solo mailings ($5,000)
- OR Mix: 4 Solo + 15 Standard ($3,500)

**Full-Time Aggressive ($10,000/month):**
- 20 Solo mailings ($10,000)
- OR 100 Standard placements ($10,000)
- OR 57 Premium placements ($9,975)
- OR Mix: 10 Solo + 50 Standard ($10,000)

**Realistic Target:**
Focus on 30-50 merchants per month doing recurring monthly placements.
40 merchants × $100 Standard = $4,000/month
Do this every month = $48,000/year from postcards alone!

**Pro Strategy:**
Build a base of recurring Standard clients, then add Premium/Solo for big commission bumps.'
WHERE title = 'Your Income Goals' AND module_id IN (
  SELECT m.id FROM academy_modules m
  JOIN academy_courses c ON c.id = m.course_id
  WHERE c.slug = 'selling-postcard-ads'
);
