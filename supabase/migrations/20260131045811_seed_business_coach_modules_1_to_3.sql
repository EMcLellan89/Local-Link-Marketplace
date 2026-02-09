/*
  # Seed Business Coach Certification - Modules 1-3
  
  Module 1: Business Assessment & Diagnosis
  Module 2: Financial Rescue Strategies
  Module 3: Marketing Systems That Work
*/

-- Module 1: Business Assessment & Diagnosis (5 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
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
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod1, course,
(VALUES
  ('The 60-Minute Business Health Check',
   E'**Master the rapid assessment framework that identifies critical business issues in under an hour.**

**The 4-Quadrant Analysis:**

**1. CASH QUADRANT (15 min)**
- Current cash on hand vs. monthly burn rate
- Accounts receivable aging (30/60/90 days)
- Accounts payable pressure points
- Upcoming big expenses or obligations

**Red Flags:**
- Less than 30 days cash runway
- 60+ day AR over 40% of total
- Cannot pay yourself or payroll on time

**2. CUSTOMER QUADRANT (15 min)**
- Number of active customers
- Customer acquisition cost vs. lifetime value
- Repeat purchase rate
- Top 3 customer complaints

**Red Flags:**
- Relying on 1-2 big customers for 80%+ revenue
- Customer churn over 30% annually
- No repeat customers

**3. OPERATIONS QUADRANT (15 min)**
- Owner working hours per week
- Documented systems and processes
- Staff turnover rate
- Major bottlenecks

**Red Flags:**
- Owner working 70+ hours/week
- No systems documented
- High staff turnover
- Everything depends on owner

**4. PROFIT QUADRANT (15 min)**
- Gross margin percentage
- Net profit percentage
- Pricing strategy
- Cost of goods sold trends

**Red Flags:**
- Gross margin under 40%
- No net profit or consistent losses
- Pricing below market
- Rising COGS with flat pricing

**The One-Page Diagnostic:**
Create a visual dashboard showing all 4 quadrants with red/yellow/green indicators. This becomes your coaching roadmap.', 1, 45),

  ('Finding the Real Problem',
   E'**Most business problems are symptoms, not causes. Learn to dig deeper.**

**The 5 Whys Technique:**

Business says: "We need more customers"
- Why? Sales are down
- Why? Fewer people buying
- Why? Prices too high
- Why? Had to raise prices
- Why? Costs went up 40%
**REAL PROBLEM: Cost structure problem, not marketing problem**

**Common Symptom-Problem Mismatches:**

**Symptom:** "Need more marketing"
**Usually Actually:** Broken sales process, poor retention

**Symptom:** "Need to cut costs"
**Usually Actually:** Pricing too low, wrong customers

**Symptom:** "Staff is not motivated"
**Usually Actually:** No clear goals, poor leadership

**Symptom:** "Can not find good employees"
**Usually Actually:** Underpaying, bad culture, no systems

**The Critical Question Framework:**
1. What is the business goal?
2. What is preventing that goal?
3. What causes that prevention?
4. What causes THAT?
5. Now we have the real problem

**Out-of-the-Box Assessment Tools:**

**The "What Would Happen If..." Test:**
- What if owner took a 2-week vacation?
- What if top customer left?
- What if top employee quit?
- What if had to double in size?

If answers are all negative, you have found systemic issues.

**The Profit Leak Analysis:**
Where is money being wasted?
- Unused subscriptions
- Inefficient processes
- Poor inventory management
- Marketing that does not work
- Employees in wrong roles', 2, 40),

  ('Reading Financial Statements Like a Doctor',
   E'**Financial statements reveal the business health story. Learn to read them diagnostically.**

**The P&L Story:**

**Revenue Section - The Pulse:**
- Growing? Flat? Declining?
- Seasonal patterns?
- Revenue concentration risk?

**COGS Section - The Blood Pressure:**
- Gross margin percentage
- Trending up or down?
- Compared to industry standard?

**Operating Expenses - The Weight:**
- As percentage of revenue
- Fixed vs. variable
- Any unusually high categories?

**Net Income - The Overall Health:**
- Profitable or losing money?
- Trend over 12 months?
- Industry comparison?

**The Balance Sheet Story:**

**Assets - What They Own:**
- Cash and equivalents
- AR collection time
- Inventory turnover
- Equipment condition

**Liabilities - What They Owe:**
- Debt-to-equity ratio
- Payment terms
- Personal guarantees
- Credit card debt

**Red Flag Patterns:**

1. **The Death Spiral:**
   - Revenue declining
   - Expenses staying same or rising
   - Debt increasing
   - Cash decreasing

2. **The Fake Profit:**
   - Showing profit on P&L
   - But cash always tight
   - Problem: AR not collecting or inventory bloated

3. **The Growth Trap:**
   - Revenue growing
   - But profitability shrinking
   - Problem: Wrong pricing or scaling too fast

**Quick Ratio Analysis:**

**Current Ratio:** Current Assets / Current Liabilities
- Under 1.0 = Crisis mode
- 1.0-1.5 = Danger zone
- 1.5-2.0 = Healthy
- Over 2.0 = Too conservative

**Quick Ratio:** (Current Assets - Inventory) / Current Liabilities
- Tests real liquidity
- Under 1.0 = Cash flow problem

**The 3-Statement Story:**
Always read all three statements together. They tell different parts of the same story.', 3, 50),

  ('Prioritizing Issues for Maximum Impact',
   E'**Not all problems are equal. Learn the triage system that saves businesses.**

**The ICE Framework:**
Rate each issue 1-10 on:
- **Impact:** How much will fixing this help?
- **Confidence:** How sure are you this is a real issue?
- **Ease:** How easy is it to fix?

Multiply: Impact × Confidence × Ease = Priority Score

**Example:**
Issue: No email marketing
- Impact: 7 (could drive repeat sales)
- Confidence: 9 (definitely missing opportunity)
- Ease: 8 (simple to set up)
- Score: 504

Issue: Rebuild entire website
- Impact: 6 (might help conversions)
- Confidence: 5 (not sure if needed)
- Ease: 2 (expensive, time-consuming)
- Score: 60

**Start with highest scores first.**

**The Cash vs. Growth Matrix:**

**Quadrant 1 - URGENT (Fix First):**
Issues threatening cash flow or survival
- Example: Major customer about to leave
- Example: Payroll problem next week
- Example: Lawsuit pending

**Quadrant 2 - IMPORTANT (Fix Next):**
Issues limiting growth or profitability
- Example: No marketing system
- Example: Owner burnout
- Example: Inefficient operations

**Quadrant 3 - MAINTENANCE:**
Issues that need attention but not urgent
- Example: Update website design
- Example: Rebrand
- Example: New office space

**Quadrant 4 - IGNORE:**
Nice-to-haves that do not move needle
- Example: Perfect logo
- Example: Fancy business cards
- Example: Trade show booth

**The 80/20 Rule for Business Rescue:**

Find the 20% of changes that will create 80% of results:
- Which customers drive 80% of profit?
- Which products drive 80% of revenue?
- Which activities drive 80% of growth?
- Which problems cause 80% of stress?

Focus your coaching on maximizing the first three and eliminating the last one.

**Quick Win Strategy:**
Always identify 1-2 quick wins (30-day results) while working on bigger issues. Early wins build momentum and trust.', 4, 45),

  ('Creating the Transformation Roadmap',
   E'**Turn your assessment into an actionable 90-day rescue plan.**

**The 3-Phase Framework:**

**PHASE 1: STABILIZE (Days 1-30)**
Stop the bleeding, create breathing room

**Must-Do Actions:**
- Fix immediate cash flow crisis
- Secure critical customers/staff
- Eliminate obvious waste
- Set up basic tracking systems
- Create 13-week cash flow forecast

**Metrics to Watch:**
- Days of cash remaining
- Weekly revenue
- Daily cash position

**PHASE 2: SYSTEMATIZE (Days 31-60)**
Build foundation for sustainable business

**Must-Do Actions:**
- Document core processes
- Implement marketing system
- Fix pricing if needed
- Build sales process
- Create management dashboard

**Metrics to Watch:**
- Revenue growth week-over-week
- Gross margin
- Customer acquisition
- Cash flow positive weeks

**PHASE 3: SCALE (Days 61-90)**
Position for growth and owner freedom

**Must-Do Actions:**
- Hire or promote key role
- Launch growth initiative
- Build customer retention system
- Create strategic plan
- Celebrate wins

**Metrics to Watch:**
- Profitability
- Customer lifetime value
- Owner hours worked
- Team productivity

**The Roadmap One-Pager:**

Create a visual timeline showing:
- Current state (assessment results)
- 30-day goals
- 60-day goals
- 90-day goals
- Key metrics at each stage
- Who is responsible for what

**Critical Success Factors:**

1. **Weekly Check-ins:** Never go more than 7 days without contact
2. **Accountability:** Client must complete action items
3. **Measurement:** Track 3-5 key metrics weekly
4. **Flexibility:** Adjust plan based on results
5. **Celebration:** Acknowledge every win

**The Contract:**
Get client to commit to:
- Completing action items
- Tracking agreed metrics
- Attending weekly meetings
- Being 100% honest
- Making tough decisions when needed

Without commitment, coaching will fail.', 5, 50)
) AS lessons(title, content, order_num, minutes);
