/*
  # Seed All Lessons for "Selling Postcard Ads" Partner Course

  Complete lesson content for all 5 modules teaching partners how to sell postcard advertising.
  Partners earn 50% commission on all postcard ad sales ($299-$2,500).
*/

-- Module 1: Understanding Postcard Advertising (3 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod1 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 1)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod1.id,
  course.id,
  title,
  'text',
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

-- Module 2: Pricing Tiers & Commissions (4 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod2 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 2)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod2.id,
  course.id,
  title,
  'text',
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

-- Module 3: Sales Process (3 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod3 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 3)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod3.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(title, ' ', '-'), '?', ''))
FROM mod3, course,
(VALUES
  ('The Perfect Opening Script',
   E'**Phone Script:**

"Hi [Name], this is [Your Name] with Local Link Marketplace. We are mailing postcards to 5,000 local households next week featuring local businesses. Do you have 2 minutes?"

**If YES:**
"Perfect! We design, print, and mail professional postcards to 5,000 homes in [area]. Your ad includes a QR code so you track exactly how many people respond. Our businesses typically 10x their investment. Most popular is $499 Standard placement - larger ad, priority positioning. Would that work for your budget?"

**If NO:**
"No problem! Quick question - if I could get your business in front of 5,000 local households for less than the cost of a Facebook ad, would you want to hear about it? [pause for response] Great, takes 2 minutes..."

**Face-to-Face:**
"Have you seen these?" [show postcard examples]
"We mail these to 5,000 households monthly. I can get your business featured - we handle everything. Most businesses go with Standard at $499. Interested?"', 1, 20),

  ('Qualifying Questions',
   E'Before you pitch, ask these questions:

**1. "How do you currently get new customers?"**
- Listen for: word of mouth, Facebook, nothing consistent
- This shows they NEED marketing help

**2. "What is your average customer worth to you?"**
- If $100+, postcard pays for itself with 3-5 customers
- If $1,000+, they should do Premium or Solo

**3. "Have you tried direct mail before?"**
- If YES and it worked: "Then you know it works!"
- If YES and failed: "What went wrong?" (usually poor design/offer)
- If NO: "You are missing out on the highest-converting channel"

**4. "How many new customers would make this worth it?"**
- Use THEIR number in your pitch
- "If this brings you [their number] customers, you are profitable"

**Disqualifiers:**
- Online-only business
- No budget at all (broke)
- "I do not believe in marketing"', 2, 18),

  ('Presenting the Options',
   E'**Show Postcard Examples FIRST**
Always lead with visuals. Go to /merchant/postcards and show them.

**The Tiered Approach:**
1. Start with Standard ($499) - most popular
2. If budget concern, mention Value ($299)
3. If they want MORE, upsell to Premium ($799)
4. Solo ($2,500) ONLY for grand openings/major events

**The Presentation:**
"We have three main options: Value at $299 gets you on the postcard. Standard at $499 gives you much better visibility - most popular. Premium at $799 is front-page feature. Which fits your marketing budget?"

**Let Them Choose**
Do not push one specific option. Present all three and let them self-select.

**The Silence Close:**
After asking "which fits your budget?" - STOP TALKING. First person to speak loses.

**Next Steps:**
"Perfect! I will get your spot reserved. I need your business info and the offer you want to promote. Can we do that now?"', 3, 15)
) AS lessons(title, content, order_num, minutes);

-- Module 4: Handling Objections (2 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod4 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 4)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod4.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(title, ' ', '-'), '?', ''))
FROM mod4, course,
(VALUES
  ('Common Objections & Responses',
   E'**"It is too expensive"**
→ "Compared to what? Facebook ads cost $500-1,000 to reach 5,000 people and most never see it. This is guaranteed delivery to 5,000 homes for $299-$499."

**"I need to think about it"**
→ "Totally understand. What specifically do you need to think about? [listen] Let me address that..." OR "Next mailing is in 2 weeks and we only have 4 spots left. I would hate for you to miss this."

**"I tried direct mail before and it did not work"**
→ "What exactly happened? [listen] Usually it is poor design or weak offer. That is why WE handle the design professionally. Plus QR tracking shows exactly what is working."

**"I do not have a budget for marketing"**
→ "I hear you. But how much does it cost you NOT to market? If you are not growing, you are shrinking. Even $299 Value placement could bring 10-20 new customers."

**"I will just do Facebook ads"**
→ "Facebook is great! But only 2-3% of your followers even see your posts. Postcards have 98% open rate. Why not do both?"

**"Can I see results first?"**
→ "I wish I could, but we cannot give free spots. However, our merchants average 15-30 redemptions per mailing. You track everything with QR codes."', 1, 20),

  ('Price Objections Masterclass',
   E'When they say "too expensive" they mean one of these:

**1. "I cannot afford it" (broke)**
→ Start with Value ($299): "Our entry option is $299 - less than $10/day for a month of exposure"
→ Payment plan: "We can split it: $150 now, $149 in 2 weeks"

**2. "I do not see the value" (skeptical)**
→ Math breakdown: "That is 6 cents per person. Where else can you advertise to 5,000 LOCAL people for 6 cents each?"
→ Show examples: "Look at these results from other businesses"

**3. "I want to negotiate" (tire-kicker)**
→ Stay firm: "Our pricing is fixed - these spots sell out every mailing"
→ Scarcity: "I only have 4 spots left for next mailing"

**The ROI Calculator:**
"What is your average sale worth? [$X]
If just 3 people become customers [$X × 3], you profit.
Out of 5,000 households, getting 3 customers is easy."

**Last Resort:**
"What budget DO you have for marketing this month?" [wait for number]
Work backwards from their number to find the right placement.', 2, 18)
) AS lessons(title, content, order_num, minutes);

-- Module 5: Closing & Follow-Up (3 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'selling-postcard-ads'),
     mod5 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 5)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod5.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(title, ' ', '-'), '?', ''))
FROM mod5, course,
(VALUES
  ('Closing Techniques That Work',
   E'**The Assumptive Close:**
"Perfect! Let me get your spot reserved. What is your business name and phone number?"
(Act like they already said yes)

**The Alternative Close:**
"Do you want Value or Standard placement?"
(Assumes they are buying, just choosing which)

**The Urgency Close:**
"Next mailing is February 15th. Deadline is February 8th. We only have 4 spots left. Want me to reserve yours?"

**The Puppy Dog Close:**
"Tell you what - let us try Value at $299 this month. If you love the results, upgrade to Standard next month. Sound fair?"

**The Takeaway Close:**
"You know what, this might not be right for you. Most of our clients are businesses that are ready to grow aggressively. Is that you?"
(They will usually defend themselves and want IN)

**The Direct Close:**
[After presenting everything]
"So... want to do this?"
[SHUT UP AND WAIT]

**Getting Payment:**
"I can take payment right now over the phone, or I can send you an invoice. Which works better?"', 1, 18),

  ('Follow-Up Systems',
   E'**If They Say "Not Now":**

**Day 1:** Send postcard examples via text/email
**Day 3:** "Just checking if you looked at those examples?"
**Day 7:** "Next mailing in 1 week - last call!"
**Day 14:** "Mailing went out! Next one in 4 weeks, want in?"

**After First Mailing:**
Call them 7 days after mailing drops:
"How did the postcard work for you? See any results yet?"

**Track Everything:**
- Who said yes
- Who said no but interested
- Who to never call again
- Results for each merchant

**Convert "No" to "Yes":**
- Share success stories from other merchants
- Offer to show them another business results
- Create FOMO: "Just so you know, Premium spot sold out in 2 hours"

**Stay in Touch:**
Monthly check-ins with prospects:
"Quick check-in - are you ready to do postcard advertising yet?"', 2, 15),

  ('Your Income Goals',
   E'**Commission Breakdown:**
- Value ($299): You earn $149.50
- Standard ($499): You earn $249.50
- Premium ($799): You earn $399.50
- Solo ($2,500): You earn $1,250

**Monthly Income Scenarios:**

**Part-Time ($2,000/month):**
- 8 Value placements ($1,196)
- OR 4 Standard placements ($998)
- OR 2 Premium + 2 Standard ($1,298)
- OR 2 Solo mailings ($2,500)

**Full-Time ($5,000/month):**
- 20 Value placements ($2,990)
- OR 10 Standard placements ($2,495)
- OR 6 Premium placements ($2,397)
- OR 4 Solo mailings ($5,000)
- OR Mix: 2 Solo + 2 Premium ($3,299)

**Full-Time Aggressive ($10,000/month):**
- 8 Solo mailings ($10,000)
- OR 25 Standard placements ($6,238)
- OR 13 Premium placements ($5,194)

**Realistic Target:**
Focus on 10-15 merchants per month doing recurring monthly placements.
10 merchants × $249.50 = $2,495/month
Do this every month = $30,000/year from postcards alone!', 3, 20)
) AS lessons(title, content, order_num, minutes);
