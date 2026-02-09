/*
  # Seed Business Coach Certification - Modules 2 & 3
  
  Module 2: Financial Rescue Strategies (6 lessons)
  Module 3: Marketing Systems That Work (5 lessons)
*/

-- Module 2: Financial Rescue Strategies (6 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
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
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod2, course,
(VALUES
  ('Emergency Cash Flow Rescue',
   E'**When a business has less than 30 days of cash, every minute counts.**

**The 48-Hour Cash Injection Plan:**

**Day 1 Morning: Collect Money Owed**
- Call top 5 customers with outstanding invoices
- Offer 10% discount for payment today
- Accept credit cards (yes, pay the fee)
- Set up payment plans for large amounts

**Day 1 Afternoon: Generate Quick Cash**
- Flash sale on inventory or services
- Pre-sell packages at discount
- Sell unused equipment/assets
- Personal loan or line of credit as last resort

**Day 2 Morning: Cut Immediate Expenses**
- Cancel unused subscriptions TODAY
- Pause all marketing spend temporarily
- Defer non-essential vendor payments
- Negotiate payment terms with key vendors

**Day 2 Afternoon: Secure Credit**
- Max out credit cards if needed (temporarily)
- Business line of credit
- Invoice factoring for AR
- Merchant cash advance (expensive but fast)

**The 13-Week Cash Flow Forecast:**

Create a spreadsheet showing EVERY week:
- Starting cash
- Expected revenue
- Expected expenses
- Ending cash

This shows EXACTLY when you will run out of money and helps prioritize actions.

**Negotiating with Vendors:**

**Script for vendors:**
"I am working with a business coach to turn things around. I can pay you $X now and $Y in 30 days, or you can wait and risk getting nothing. Which works for you?"

Most will take partial payment.

**The Bare Minimum Budget:**
Calculate the absolute minimum to keep doors open:
- Payroll (cannot skip)
- Rent (landlords are tough)
- Critical supplies
- Insurance (cannot lapse)
- Utilities

Everything else is negotiable or cuttable.

**Creative Cash Sources:**
- Customer deposits on future work
- Selling gift cards/memberships
- Licensing your IP or processes
- Consulting services using your expertise
- Renting unused space/equipment', 1, 50),

  ('Fixing Pricing for Profitability',
   E'**Most struggling businesses are underpriced. Fix this and everything changes.**

**The True Cost Calculator:**

**Step 1: Calculate REAL Cost**
- Direct costs (materials, labor, etc.)
- Overhead allocation (rent, utilities, admin)
- Your time (yes, you count)
- Profit margin (20-30% minimum)

**Example:**
- Direct costs: $50
- Overhead (30% of direct): $15
- Owner time: $25
- Subtotal: $90
- Profit margin (25%): $22.50
- **REAL PRICE: $112.50**

If you are charging $75, you are losing money.

**Common Pricing Mistakes:**

**Mistake 1: "I charge what competitors charge"**
- You are not your competitors
- They might be underpriced too
- Race to the bottom = everyone loses

**Mistake 2: "Customers will not pay more"**
- Wrong customers
- Weak value proposition
- Poor positioning

**Mistake 3: "I will make it up in volume"**
- Math does not work
- More volume = more costs
- Bankruptcy at scale

**Value-Based Pricing Framework:**

**Instead of:** "My service costs $1,000"
**Say:** "This service will increase your revenue by $10,000. Investment is $1,000."

**Instead of:** Hourly rates
**Use:** Project pricing based on value delivered

**Instead of:** Comparing to competitors
**Use:** Unique positioning and differentiation

**The Price Increase Strategy:**

**For Existing Customers:**
- Give 60-day notice
- Grandfather some customers (best ones)
- Explain value improvements
- Expect to lose 10-20% (that is okay)

**For New Customers:**
- New pricing starts immediately
- No grandfather clause
- Premium positioning
- Better customers

**When to Raise Prices:**
- Immediate if underwater
- Cannot deliver quality at current prices
- Demand exceeds capacity
- Adding significant value

**The Premium Positioning:**
- Best quality, not cheapest price
- Specialized expertise
- Guaranteed results
- Exceptional service
- Time savings for customer', 2, 45),

  ('Building a Cash Reserve System',
   E'**Once stabilized, build a fortress so crisis never happens again.**

**The 3-Account System:**

**Account 1: Operating (Checking)**
- Day-to-day business expenses
- Payroll
- Vendor payments
- Keep 2-3 weeks of expenses

**Account 2: Tax (Savings)**
- Set aside 25-30% of profit
- Pay quarterly estimated taxes
- Never touch for operations

**Account 3: Profit Reserve (Savings)**
- Goal: 3-6 months operating expenses
- Start with 1% of revenue
- Increase 1% per quarter
- Only for true emergencies

**The Profit First Method:**

**Every time money comes in:**
1. Take 5% for owner pay
2. Take 15% for taxes
3. Take 5% for profit reserve
4. Use remainder for expenses

**Forces you to run leaner and build reserves.**

**Monthly Financial Rituals:**

**10th of Month:**
- Review previous month P&L
- Calculate profitability
- Transfer to reserves
- Pay owner distribution

**20th of Month:**
- Review AR aging
- Follow up on late invoices
- Adjust cash forecast
- Plan for next month

**Cash Flow Buffers:**

**Buffer 1: Payment Terms**
- Get paid upfront or on delivery
- Customer pays Net 15
- You pay vendors Net 30
- Creates 30-day float

**Buffer 2: Credit Lines**
- Establish before you need it
- Keep unused as safety net
- Only for opportunities or emergencies

**Buffer 3: Retained Earnings**
- Leave profit in business
- Build up over time
- Provides cushion for rough months

**Red Flag Prevention:**

**Weekly Dashboard:**
- Cash balance
- This week revenue vs. goal
- A/R over 30 days
- Upcoming big expenses

If any metric goes red, take immediate action.

**The "Never Again" Commitment:**
Once you have 30 days cash, commit to never going below it. If you hit 35 days, pause growth spending and focus on cash collection until back to 60+ days.', 3, 45),

  ('Profitable Product and Service Mix',
   E'**Not all revenue is good revenue. Some products/services are killing profitability.**

**The Product Profit Matrix:**

**For each product/service, calculate:**
1. Revenue per unit/sale
2. Direct cost per unit
3. Time required to deliver
4. Gross margin percentage

**Example Analysis:**

**Service A:**
- Revenue: $500
- Direct costs: $100
- Time: 5 hours
- Gross margin: 80%
- Profit per hour: $80

**Service B:**
- Revenue: $2,000
- Direct costs: $1,500
- Time: 20 hours
- Gross margin: 25%
- Profit per hour: $25

**Service A is 3x more profitable!**

**The 4-Quadrant Product Matrix:**

**STARS (High Profit + High Demand)**
- Promote heavily
- Raise prices
- Expand capacity
- Build entire business around these

**QUESTION MARKS (High Profit + Low Demand)**
- Market harder
- Better positioning
- Find right customers
- Improve sales process

**CASH COWS (Low Profit + High Demand)**
- Raise prices
- Reduce costs
- Add premium options
- Consider dropping

**DOGS (Low Profit + Low Demand)**
- Kill immediately
- No exceptions
- Free up time for STARS

**Pruning Strategy:**

**Step 1:** Calculate profit per hour for everything
**Step 2:** Rank from best to worst
**Step 3:** Draw line at 50% mark
**Step 4:** Stop selling everything below the line
**Step 5:** Double down on top 20%

**Most businesses instantly increase profitability 30-50% just by stopping their worst offerings.**

**The Packaging Strategy:**

**Instead of:** Ala carte pricing
**Create:** Good-Better-Best packages

**Example:**

**Good:** Basic service - $500
**Better:** Basic + extras - $1,000 (most choose)
**Best:** Premium + VIP - $2,500

**Most customers choose middle, which is more profitable than selling just basic.**

**Upsell and Cross-Sell Systems:**

**At point of sale:**
- "Would you like to add X for just $Y more?"
- Increases average transaction 20-40%

**After purchase:**
- "Customers who bought this also need..."
- Increases LTV significantly

**Service Business Leverage:**

**Low Leverage:** Everything is custom
**High Leverage:** Productized services, packages, retainers

Transform from selling hours to selling results.', 4, 50),

  ('Accounts Receivable Management',
   E'**Money owed is not money earned. Get paid faster.**

**The Collection System:**

**Day 0 (Invoice Sent):**
- Clear payment terms
- Multiple payment options
- Due date prominent
- Professional invoice

**Day 7:**
- Friendly reminder email
- "Just making sure you received this"
- Include invoice again

**Day 14 (Due Date):**
- Payment should arrive
- If not, call that day
- Email and call

**Day 17:**
- Second call
- More firm tone
- "When can I expect payment?"
- Set specific date

**Day 21:**
- Final notice
- Late fee applied (if in terms)
- Payment plan option
- Mention collections

**Day 30:**
- Stop all work
- Serious tone
- Collections threat
- Consider legal action

**Prevention > Collection:**

**Get Paid Upfront:**
- 50% deposit before work starts
- Remaining 50% on delivery
- Never finance customers

**For Large Projects:**
- 33% to start
- 33% at milestone
- 34% on completion

**Payment Terms That Work:**
- Net 15 (not Net 30)
- Credit card on file
- Auto-pay when possible
- Retainer agreements

**The Credit Policy:**

**Before accepting new customer:**
1. Check references
2. Run credit check (large jobs)
3. Start with COD
4. Earn payment terms

**Red Flags:**
- Hesitant to pay deposit
- Negotiating payment terms hard
- Past bounced checks
- Poor credit

**When someone will not pay:**

**Option 1:** Payment plan
- Small payments over time
- Better than nothing
- Keep relationship

**Option 2:** Discount for immediate payment
- 20% off if paid today
- Cash in hand beats waiting

**Option 3:** Collections/Legal
- Last resort
- Costs money
- Damages relationship
- But necessary sometimes

**The Millionaire Habit:**
- Invoice same day work is done
- Follow up within 7 days
- Never let AR go past 30 days
- Fire slow-paying customers', 5, 45),

  ('Financial Forecasting and Planning',
   E'**Successful businesses predict the future and plan accordingly.**

**The 12-Month Revenue Forecast:**

**Method 1: Bottom-Up**
- How many leads per month?
- What is close rate?
- What is average sale?
- Leads × Close Rate × Avg Sale = Revenue

**Example:**
- 100 leads × 20% close × $1,000 = $20,000/mo

**Method 2: Top-Down**
- Historical average
- Growth percentage
- Market conditions
- Seasonal adjustments

**Example:**
- Last year: $200,000
- Growth target: 25%
- This year: $250,000
- Monthly: $20,833 average

**Seasonal Business Planning:**

**High Season:**
- Bank extra cash
- Hire temporary staff
- Max out capacity
- Build reserves

**Low Season:**
- Live off reserves
- Marketing for next high
- Training and improvement
- Cost control

**The Scenario Planning:**

**Best Case (30% chance):**
- Everything goes well
- How much revenue?
- What would you do?
- How to capture opportunity?

**Base Case (50% chance):**
- Realistic expectations
- Normal growth
- Standard operations
- Most likely outcome

**Worst Case (20% chance):**
- What if things go wrong?
- Minimum revenue
- How to survive?
- Trigger points for action

**Plan for all three scenarios.**

**The Monthly Finance Meeting:**

**Agenda (30 minutes):**
1. Review last month actual vs. forecast (10 min)
2. Update current month forecast (5 min)
3. Review key metrics dashboard (5 min)
4. Identify issues and opportunities (5 min)
5. Set action items (5 min)

**Key Metrics Dashboard:**
- Revenue (actual vs. goal)
- Gross margin percentage
- Operating expenses percentage
- Net profit percentage
- Cash balance
- AR over 30 days
- Customer count

**The Annual Financial Plan:**

**Q1: Build Foundation**
- Systems and processes
- Marketing infrastructure
- Team training

**Q2: Growth Phase**
- Customer acquisition
- Capacity expansion
- Product launches

**Q3: Optimization**
- Improve margins
- Efficiency gains
- Cost reduction

**Q4: Harvest and Plan**
- Bank profits
- Year-end planning
- Next year strategy

**Financial Goals Setting:**

**Revenue Goal:** Specific number
**Profit Goal:** Percentage of revenue
**Owner Pay Goal:** Monthly amount
**Reserve Goal:** Months of expenses
**Growth Goal:** Percentage increase

Review quarterly and adjust as needed.', 6, 50)
) AS lessons(title, content, order_num, minutes);

-- Module 3: Marketing Systems That Work (5 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
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
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod3, course,
(VALUES
  ('Building a Lead Generation Machine',
   E'**Most struggling businesses have an inconsistent lead flow. Fix this first.**

**The Marketing Funnel:**

**Top of Funnel (Awareness):**
- Google My Business optimization
- Social media presence
- Local SEO
- Content marketing
- Referral programs

**Middle of Funnel (Consideration):**
- Email nurture sequences
- Retargeting ads
- Case studies and testimonials
- Educational content
- Free consultations

**Bottom of Funnel (Purchase):**
- Clear call-to-action
- Easy buying process
- Risk reversal
- Urgency and scarcity
- Follow-up system

**The Low-Cost Lead Gen Strategy:**

**Week 1: Foundation**
- Claim and optimize Google My Business
- Set up Facebook business page
- Create simple website or landing page
- Install tracking (Google Analytics)

**Week 2: Referral System**
- Ask every customer for referral
- Create incentive program
- Make asking automatic
- Track referral sources

**Week 3: Content Creation**
- Answer 10 common customer questions
- Create blog posts or videos
- Share on social media
- Repurpose everywhere

**Week 4: Paid Testing**
- $10/day Google ads
- $10/day Facebook ads
- Track what works
- Double down on winners

**The Offer That Sells:**

**Weak Offer:**
"Buy our service for $500"

**Strong Offer:**
"Get [SPECIFIC RESULT] in [TIMEFRAME] or [GUARANTEE]. Only $500. [REASON TO ACT NOW]."

**Example:**
"Get 20 qualified leads in 30 days or we work for free. Only $500. 3 spots left this month."

**Lead Magnet Strategy:**

**Give away something valuable for contact info:**
- Free guide or checklist
- Video training series
- Assessment or audit
- Tool or template
- Webinar or workshop

**Then nurture with email until ready to buy.**

**Partnership Marketing:**

**Find businesses that serve your customers:**
- Not competitors
- Complementary services
- Similar customers
- Good reputation

**Create cross-referral agreements:**
- You send them customers
- They send you customers
- Win-win-win', 1, 45),

  ('Converting Leads to Customers',
   E'**Leads are worthless unless they become paying customers.**

**The Follow-Up Formula:**

**Within 5 minutes:**
- Respond to every inquiry
- Phone call preferred
- Text is okay
- Email minimum

**Fast response increases close rate 10x.**

**The Sales Call Structure:**

**1. Rapport (2 minutes)**
- "Thanks for reaching out"
- Small talk
- Build connection

**2. Discover (10 minutes)**
- What is their problem?
- What have they tried?
- What is the impact?
- What is the urgency?

**3. Present (5 minutes)**
- How you solve their specific problem
- Results you have gotten
- Why you are different
- Pricing and options

**4. Handle Objections (5 minutes)**
- Listen to concerns
- Address directly
- Provide proof
- Reassure

**5. Close (2 minutes)**
- Ask for the sale
- Shut up and wait
- Get commitment
- Schedule start date

**Total: 25 minutes per call**

**The Email Follow-Up Sequence:**

**Day 1:** Inquiry response (immediate)
**Day 2:** Additional information
**Day 4:** Case study/testimonial
**Day 7:** Special offer
**Day 10:** Last chance
**Day 14:** Break up email ("Should I close your file?")
**Day 30:** Re-engagement

**This sequence alone increases conversions 40%.**

**Common Objections and Responses:**

**"Too expensive"**
→ "Compared to what? Let me show you the ROI..."

**"I need to think about it"**
→ "Of course. What specifically do you need to think about?"

**"I want to shop around"**
→ "Smart. What are you comparing? Here is why we are different..."

**"Not right now"**
→ "I understand. When would be better? Can I follow up then?"

**"I need to talk to my partner"**
→ "Great! Can we set up a call with both of you?"

**The Risk Reversal:**

**Money-Back Guarantee:**
"100% satisfaction guaranteed or full refund"

**Results Guarantee:**
"Get [RESULT] or we work for free"

**Time Guarantee:**
"Delivered in [TIMEFRAME] or it is free"

**The Close:**

**Assumptive Close:**
"So when would you like to start?"

**Alternative Close:**
"Would Monday or Wednesday work better?"

**Direct Close:**
"Are you ready to move forward?"

**Then shut up. First person to speak loses.**

**The CRM System:**

**Every lead gets:**
- Status (new/contacted/quoted/won/lost)
- Source (where they came from)
- Next action date
- Notes from conversations
- Automated follow-ups

**Track conversion rates at each stage to identify bottlenecks.**', 2, 45),

  ('Customer Retention is Cheaper than Acquisition',
   E'**It costs 5-7x more to get a new customer than keep an existing one.**

**The Retention Metrics:**

**Repeat Purchase Rate:**
Customers who bought 2+ times / Total customers
- Under 20% = Problem
- 20-40% = Average
- 40%+ = Excellent

**Customer Lifetime Value (LTV):**
Average purchase × Average purchases per year × Average years as customer

**Example:**
$500 × 4 times/year × 3 years = $6,000 LTV

**Customer Churn Rate:**
Lost customers / Total customers
- Under 5% = Excellent
- 5-15% = Good
- 15-30% = Need work
- Over 30% = Crisis

**The Retention System:**

**Day 1 (Purchase):**
- Thank you email
- Set expectations
- Next steps clear
- Welcome sequence starts

**Day 7 (One Week After):**
- Check-in call or email
- "How is everything?"
- Address any issues
- Build relationship

**Day 30 (One Month):**
- Request review/testimonial
- Ask for referrals
- Upsell opportunity
- "What else can we help with?"

**Day 90 (Three Months):**
- Re-engagement campaign
- Special offer for repeat
- New products/services
- "We miss you"

**The VIP Program:**

**Identify top 20% of customers by revenue.**

**Give them:**
- Special pricing or discounts
- Priority service
- Exclusive access
- Personal attention
- Surprise gifts

**They will spend more and stay longer.**

**The Win-Back Campaign:**

**For lost customers:**

**Email 1:** "We miss you"
**Email 2:** "Here is what is new"
**Email 3:** "Special comeback offer"
**Email 4:** "Last chance"

**Win back 10-20% of lost customers.**

**Why Customers Leave:**

1. **Poor service (68%)**
   - Fix: Over-deliver on service
   - Regular check-ins
   - Fast response times

2. **Better offer elsewhere (12%)**
   - Fix: Better positioning
   - Unique value prop
   - Not competing on price

3. **No longer need (10%)**
   - Fix: Can not control
   - Stay in touch anyway
   - They might need again

4. **Forgot about you (10%)**
   - Fix: Regular communication
   - Email newsletters
   - Social media presence

**The Surprise and Delight:**

**Random acts of kindness:**
- Handwritten thank you notes
- Unexpected discounts
- Birthday cards or gifts
- Free upgrades
- Personal attention

**Creates raving fans who refer others.**

**The Subscription Model:**

**Transform one-time buyers into subscribers:**
- Monthly retainer
- Membership program
- Recurring delivery
- Subscription box

**Benefits:**
- Predictable revenue
- Higher LTV
- Better cash flow
- Easier to scale', 3, 45),

  ('Digital Marketing Essentials',
   E'**Every business needs a basic digital presence in 2025.**

**The Minimum Viable Marketing Stack:**

**1. Google My Business (Free)**
- Claim your listing
- Complete 100% of profile
- Post weekly updates
- Collect and respond to reviews
- Add photos regularly

**This alone can drive 20-50 leads per month for local businesses.**

**2. Facebook Business Page (Free)**
- Professional profile
- Contact information
- Reviews enabled
- Regular posts (3x/week)
- Respond to messages fast

**3. Simple Website or Landing Page ($50-500)**
- Clear headline (what you do)
- Benefits and features
- Testimonials and reviews
- Strong call-to-action
- Contact form or phone number

**No need for fancy. Simple converts better.**

**4. Email Marketing ($10-50/month)**
- Build email list
- Weekly or biweekly newsletter
- Mix of value and offers
- Automated sequences

**The Content Formula:**

**80/20 Rule:**
- 80% helpful/educational
- 20% selling/promoting

**Content Ideas:**
- Answer common questions
- Behind-the-scenes
- Customer success stories
- How-to guides
- Industry tips and trends

**Post Everywhere:**
- Google My Business
- Facebook
- Instagram
- LinkedIn
- Your website
- Email newsletter

**Repurpose one piece of content 10 different ways.**

**Paid Advertising Basics:**

**Start with $10-20/day:**
- Google Ads (search intent)
- Facebook/Instagram Ads (targeting)
- Test different ads
- Track conversions
- Scale what works

**The Ad Formula:**

**Headline:** Attention-grabbing
**Image:** Scroll-stopping
**Body:** Problem and solution
**CTA:** Clear next step
**Offer:** Reason to act now

**Social Media Strategy:**

**Platform Selection:**
- **B2C Local:** Facebook + Instagram
- **B2B:** LinkedIn
- **Home Services:** Facebook + Google
- **Retail:** Instagram + Facebook
- **Professional:** LinkedIn + Google

**Do not try to be on every platform. Master 1-2.**

**The Posting Schedule:**

**Monday:** Educational content
**Wednesday:** Behind-the-scenes
**Friday:** Customer spotlight
**Weekend:** Engagement post

**Consistency > Perfection**

**Review Management:**

**The Review Request System:**

**After positive experience:**
1. Ask in person
2. Send text with link
3. Follow up via email
4. Thank them publicly

**For negative reviews:**
1. Respond publicly (professional)
2. Take conversation offline
3. Fix the problem
4. Ask them to update review

**Goal: 50+ 5-star reviews on Google**

**This builds trust and drives conversions.**

**The Analytics Dashboard:**

**Track Weekly:**
- Website visitors
- Lead sources
- Conversion rate
- Cost per lead
- ROI by channel

**Double down on what works. Cut what does not.**', 4, 50),

  ('Referral Programs That Actually Work',
   E'**Referred customers are cheaper, better, and more loyal than any other source.**

**Why Referral Programs Fail:**

1. **Too complicated**
   - Simple beats complex
   - Easy to understand
   - Easy to participate

2. **Weak incentive**
   - Not valuable enough
   - Not immediate enough
   - Not compelling

3. **Not systematic**
   - Only ask occasionally
   - No follow-through
   - No tracking

**The 3-Tier Referral System:**

**Tier 1: Ask Every Customer**
"Who else do you know that needs [service]?"

Do this EVERY time:
- After great service
- When they compliment you
- At project completion
- During reviews

**Tier 2: Incentivized Referrals**
"Refer a friend, both get $50 off"

Or:
- Gift card rewards
- Service discounts
- Cash payments
- Free upgrades

**Tier 3: Partner Program**
Strategic partners who actively refer

**Pay 10-20% commission on every sale.**

**The Referral Request Script:**

**"[Name], I am so glad you are happy with our work. Quick question - who else do you know who could benefit from [service]? I would love to help them too."**

[Wait for answer]

**"Great! Would you mind introducing us? I can send you a text/email to forward, or you can just send me their contact info and I will mention you sent me."**

**Make it easy.**

**The Ambassador Program:**

**Find your 10 best customers.**

**Make them official ambassadors:**
- Special title/recognition
- Premium benefits
- Referral rewards
- Inside access

**They become your sales force.**

**Referral Marketing Assets:**

**Create and share:**
- Referral cards (physical)
- Social media graphics
- Email templates
- Text message templates
- Links with tracking

**Make it effortless to refer you.**

**The Referral Tracking System:**

**Every referral gets:**
- Source tracking (who referred)
- Date and details
- Status updates
- Reward fulfillment
- Thank you process

**Referral Incentive Ideas:**

**For Referrer:**
- Cash bonus
- Service discount
- Gift cards
- Free service
- Exclusive perks

**For Referred:**
- New customer discount
- Free trial/consultation
- Bonus included
- VIP treatment
- Risk reversal offer

**The Thank You Process:**

**When you get a referral:**

1. **Thank immediately**
   - Text or call
   - Sincere appreciation
   - Let them know next steps

2. **Update along the way**
   - "Just met with them"
   - "They became a customer"
   - Keep them in loop

3. **Deliver reward**
   - As soon as promised
   - Add little extra
   - Make them hero

4. **Public recognition**
   - Social media shoutout
   - Customer spotlight
   - Referral leaderboard

**Strategic Partnership Referrals:**

**Find businesses that:**
- Serve your ideal customer
- Are not competitors
- Are reputable
- Are growth-oriented

**Propose partnership:**
- Cross-referral agreement
- Co-marketing opportunities
- Bundled packages
- Revenue sharing

**Example:**
- Web designer + Photographer
- Accountant + Lawyer
- Landscaper + Pool company
- Dentist + Orthodontist

**Each partner has access to the other\'s customer base.**

**The Referral Culture:**

**Make referrals part of company culture:**
- Celebrate every referral publicly
- Track and display referral metrics
- Reward staff who generate referrals
- Build reputation as "referral-worthy"

**When you do great work consistently, referrals become automatic.**', 5, 45)
) AS lessons(title, content, order_num, minutes);
