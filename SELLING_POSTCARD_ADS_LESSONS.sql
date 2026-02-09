-- Lessons for Module 1: Understanding Postcard Advertising
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod1 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 1)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod1.id,
  course.id,
  title,
  'article',
  content,
  order_num,
  minutes,
  lower(replace(replace(title, ' ', '-'), '?', ''))
FROM mod1, course,
(VALUES
  ('Why Postcard Advertising Works',
   E'Postcard advertising is one of the highest-converting offline marketing channels for local businesses.

**98% Open Rate** - Unlike email (20% open rate), physical mail gets opened 98% of the time. People MUST look at their mail.

**Tangible & Memorable** - A postcard sits on counters and fridges for days. Digital ads disappear in seconds.

**No Algorithm** - Guaranteed delivery to every household. No Facebook algorithm, no Google changes.

**Perfect Local Targeting** - We mail to exactly 5,000 households in the target area.

**The Numbers:**
- Average response rate: 4-5%
- 200-250 people take action per mailing
- 15-30 redemptions per mailing average
- Businesses typically 10x their investment', 1, 15),

  ('Who Is Your Ideal Customer?',
   E'Your ideal customers for postcard advertising:

**Local Service Businesses**
- Plumbers, electricians, HVAC, landscaping
- These businesses need constant new customers

**Home & Auto**
- Furniture stores, auto dealers, car repair
- High-ticket sales justify marketing cost

**Restaurants & Food**
- All types of dining establishments
- Drive foot traffic weekly

**Retail & Shopping**
- Boutiques, salons, spas, jewelry stores

**Professional Services**
- Real estate agents, insurance, financial advisors

**RED FLAGS (Bad Fit)**
- Online-only businesses
- National chains (corporate marketing)
- No physical location
- Very low-margin businesses', 2, 12),

  ('Real Postcard Examples',
   E'Visit /merchant/postcards in the platform to see actual postcard examples!

**What to Show Prospects:**
The postcards feature multiple businesses with:
- Clear QR codes for tracking
- Professional design
- Strong offers and calls-to-action
- Contact information prominently displayed

**Key Sales Points:**
1. Show these examples to prospects
2. Point out quality and professionalism
3. WE handle design, printing, mailing
4. They just provide offer and contact info
5. Emphasize QR code tracking

**What Merchants Love:**
- "It looks so professional!"
- "My ad really stands out"
- "This reaches every house?"', 3, 10)
) AS lessons(title, content, order_num, minutes);

-- Lessons for Module 2: Pricing Tiers
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod2 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 2)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod2.id,
  course.id,
  title,
  'article',
  content,
  order_num,
  minutes,
  lower(replace(replace(title, ' ', '-'), '?', ''))
FROM mod2, course,
(VALUES
  ('Value Placement - $299',
   E'**YOUR COMMISSION: $149.50 (50%)**

**What They Get:**
- Standard ad spot on postcard
- Reaches 5,000 households
- Professional design
- QR code tracking
- Performance analytics

**Best For:**
- Businesses new to postcard advertising
- Smaller businesses testing waters
- Tight marketing budgets

**Sales Pitch:**
"For $299, you reach 5,000 households - that is 6 cents per person. If just 5 become customers, you will 10x your investment. We handle design, printing, mailing."

**Objections:**
"Too expensive" → "Facebook ads to reach 5,000 LOCAL people cost $500-1,000. This is guaranteed delivery."

"I will think about it" → "Next mailing in 2 weeks. Only 4 spots left. Do not miss reaching 5,000 potential customers."', 1, 15),

  ('Standard Placement - $499',
   E'**YOUR COMMISSION: $249.50 (50%)**

**Most Popular Choice!**

**What They Get:**
- Better visibility, larger ad space
- Priority placement
- Reaches 5,000 households
- QR code tracking
- Professional design

**Why Most Popular:**
- Sweet spot between price and visibility
- Noticeably larger than Value
- Better ROI from increased visibility

**Sales Pitch:**
"Our most popular option gives you significantly more visibility for only $200 more. Larger ad, priority position, impossible to miss."

**Upsell from Value:**
"For just $200 more, Standard placement gives you MUCH better visibility - larger space, priority positioning. If you want to grow quickly, Standard is the smarter investment."', 2, 15),

  ('Premium Placement - $799',
   E'**YOUR COMMISSION: $399.50 (50%)**

**What They Get:**
- Front page, top position
- Maximum visibility
- First thing people see
- Largest standard ad space
- Dedicated analytics

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
"Too expensive" → "What is your average customer value? If this brings 2-3 customers out of 5,000 people, you profit. Front-page dramatically increases response."', 3, 15),

  ('Solo Mailing - $2,500',
   E'**YOUR COMMISSION: $1,250 (50%) - YES, $1,250!**

**What They Get:**
- EXCLUSIVE - only business on postcard
- Full postcard design (front and back)
- NO competition
- Premium tracking
- Highest possible impact

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
"Start with Solo for your grand opening to create massive buzz, then step down to Premium for ongoing visibility."', 4, 20)
) AS lessons(title, content, order_num, minutes);
