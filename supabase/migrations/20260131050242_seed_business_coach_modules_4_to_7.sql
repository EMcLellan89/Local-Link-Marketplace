/*
  # Seed Business Coach Certification - Modules 4-7
  
  Module 4: Operations Optimization (5 lessons)
  Module 5: Sales System Development (5 lessons)
  Module 6: Leadership & Team Building (4 lessons)
  Module 7: Crisis Management & Turnarounds (6 lessons)
*/

-- Module 4: Operations Optimization (5 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
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
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod4, course,
(VALUES
  ('Documenting Systems and Processes',
   E'**If it is not documented, it does not exist. Build the operations manual.**

**Why Systems Matter:**

**Without Systems:**
- Everything depends on owner
- Inconsistent quality
- Cannot scale
- Cannot sell business
- Constant firefighting

**With Systems:**
- Anyone can do the work
- Consistent results
- Easy to train
- Easy to scale
- Business has value

**The 80/20 of Documentation:**

**Start with these 5 core processes:**

1. **Customer Onboarding**
   - From sale to first delivery
   - What happens when?
   - Who does what?
   - Documents and tools needed

2. **Service/Product Delivery**
   - Step-by-step workflow
   - Quality checks
   - Timeline and handoffs
   - Customer communication

3. **Customer Communication**
   - How we respond
   - Response time standards
   - Tone and messaging
   - Escalation process

4. **Billing and Collections**
   - When invoices go out
   - Payment methods
   - Collection process
   - Dispute handling

5. **Customer Offboarding**
   - Project completion
   - Follow-up process
   - Review request
   - Referral ask

**Document these first. They drive 80% of business.**

**The Simple SOP Format:**

**Process Name:** [Clear title]
**Purpose:** [Why this exists]
**When:** [When to use this]
**Who:** [Role responsible]

**Steps:**
1. [First action]
2. [Second action]
3. [And so on...]

**Tools Needed:** [Software, templates, etc.]
**Common Problems:** [What goes wrong and fixes]
**Last Updated:** [Date]

**How to Document Fast:**

**Method 1: Record Yourself**
- Use Loom or phone
- Talk through the process
- Have someone transcribe
- Clean up and format

**Method 2: Over-the-Shoulder Training**
- Train someone while recording
- Transcribe the training
- Turn into SOP

**Method 3: Have Team Member Document**
- Ask them to write what they do
- Review and refine
- Add to manual

**The Living Operations Manual:**

**Store in:**
- Google Docs (simple)
- Notion (organized)
- Process Street (automated)
- Trainual (professional)

**Keep Updated:**
- Review quarterly
- Update when process changes
- Version control
- Assign ownership

**Process Improvement Loop:**

1. **Document** current process
2. **Measure** performance
3. **Identify** bottlenecks
4. **Test** improvements
5. **Update** documentation
6. **Train** team
7. **Repeat**

**Out-of-the-Box Systems Thinking:**

**The McDonald\'s Model:**
- Everything documented
- Everything measured
- Everything repeatable
- Teenager can run it

**Your business should be the same.**

**The Delegation Test:**
- Could you hand the SOP to someone
- With zero experience
- And they could complete the task?

If no, the SOP is not good enough.', 1, 45),

  ('Eliminating Waste and Bottlenecks',
   E'**Every business has hidden waste eating profits. Find and eliminate it.**

**The 8 Types of Waste:**

**1. Time Waste**
- Waiting for approvals
- Meetings with no purpose
- Searching for information
- Redoing poor work

**Fix:** Clear decision authority, eliminate bad meetings, organize systems

**2. Motion Waste**
- Physical movement
- Switching between tools
- Multiple locations
- Disorganization

**Fix:** Optimize workspace layout, consolidate tools, organize everything

**3. Inventory Waste**
- Excess materials sitting
- Cash tied up
- Storage costs
- Obsolescence risk

**Fix:** Just-in-time ordering, consignment, reduce batch sizes

**4. Defects Waste**
- Errors and mistakes
- Customer complaints
- Returns and refunds
- Rework time

**Fix:** Quality checks, training, better processes, root cause analysis

**5. Overproduction Waste**
- Making more than needed
- Ahead of demand
- Creating bottlenecks

**Fix:** Pull-based production, customer orders first

**6. Transportation Waste**
- Unnecessary movement
- Multiple handoffs
- Shipping inefficiency

**Fix:** Reduce movement, consolidate locations, optimize routes

**7. Overprocessing Waste**
- Doing more than customer values
- Gold plating
- Unnecessary features

**Fix:** Ask what customer actually wants, minimum viable product

**8. Talent Waste**
- Wrong person wrong role
- Underutilized skills
- No autonomy

**Fix:** Match skills to tasks, delegate more, empower team

**The Value Stream Mapping:**

**Map every step from order to delivery:**

1. Customer places order
2. Order enters system (how long?)
3. Production scheduled (how long?)
4. Materials gathered (how long?)
5. Work performed (how long?)
6. Quality check (how long?)
7. Delivered to customer (how long?)

**Total time vs. actual work time = efficiency**

**Example:**
- Total time: 10 days
- Actual work time: 4 hours
- Efficiency: 0.4%!

**Most of the time is WAITING.**

**Finding Bottlenecks:**

**The Theory of Constraints:**

**Identify the ONE thing that limits throughput.**

**Questions:**
- Where does work pile up?
- What takes longest?
- What fails most often?
- What are we always waiting for?

**Fix the bottleneck first. Everything else is secondary.**

**The 5S System:**

**Sort:** Remove what you do not need
**Set in Order:** Organize what remains
**Shine:** Clean and maintain
**Standardize:** Create rules
**Sustain:** Make it habit

**Applies to physical and digital workspace.**

**Time Tracking Reality Check:**

**For one week, track:**
- Every task
- Time spent
- Value created

**You will be shocked:**
- 40-60% is waste
- Meetings are black holes
- Interruptions kill productivity

**Then eliminate, delegate, or automate the waste.**

**The Kaizen Approach:**

**Continuous improvement:**
- 1% better every day
- Small changes compound
- Everyone participates
- Never stop improving

**Weekly improvement meetings:**
- What slowed us down this week?
- What can we improve?
- Who will do it?
- By when?', 2, 45),

  ('Automation and Technology Leverage',
   E'**Technology should save time, not create complexity.**

**The Automation Hierarchy:**

**Level 1: Manual Everything**
- Writing every invoice by hand
- Sending individual emails
- Tracking in notebooks
- Maximum time waste

**Level 2: Templates**
- Invoice templates
- Email templates
- Document templates
- Slight improvement

**Level 3: Tools**
- Accounting software
- CRM system
- Project management
- Email marketing
- Much better

**Level 4: Integration**
- Tools talk to each other
- Data flows automatically
- Minimal manual entry
- Significant time savings

**Level 5: Full Automation**
- Trigger-based workflows
- No human intervention
- Scale infinitely
- Maximum leverage

**The Essential Business Tech Stack:**

**1. CRM ($0-100/month)**
- HubSpot (free tier)
- Pipedrive
- Close
- Follow Up Boss

**Tracks:** Leads, customers, communications, deals

**2. Accounting ($0-50/month)**
- QuickBooks Online
- FreshBooks
- Wave (free)
- Xero

**Automates:** Invoicing, expenses, reports, taxes

**3. Email Marketing ($0-50/month)**
- Mailchimp (free tier)
- ConvertKit
- ActiveCampaign
- Klaviyo

**Automates:** Nurture sequences, broadcasts, segmentation

**4. Scheduling ($0-15/month)**
- Calendly
- Acuity Scheduling
- Square Appointments

**Eliminates:** Back-and-forth emails

**5. Project Management ($0-25/month)**
- Asana (free tier)
- Trello
- ClickUp
- Monday.com

**Organizes:** Tasks, deadlines, team collaboration

**Automation Workflows to Set Up:**

**New Lead Workflow:**
1. Lead fills form
2. Auto-added to CRM
3. Confirmation email sends
4. Task created for follow-up
5. Added to nurture sequence

**New Customer Workflow:**
1. Sale closes in CRM
2. Invoice auto-generated
3. Welcome email sequence starts
4. Onboarding tasks created
5. Team notified

**Abandoned Cart Workflow:**
1. Customer adds to cart but does not buy
2. Wait 1 hour
3. Send reminder email
4. Wait 24 hours
5. Send discount offer
6. Wait 3 days
7. Send last chance email

**Review Request Workflow:**
1. Project marked complete
2. Wait 3 days
3. Send satisfaction check email
4. If positive, request review
5. If negative, request call

**The AI Advantage:**

**Use AI for:**
- Writing email responses
- Creating content
- Customer service chat
- Data analysis
- Report generation

**Tools:**
- ChatGPT for writing
- Jasper for marketing
- Zapier for automation
- Make (Integromat) for complex workflows

**When NOT to Automate:**

**Keep human touch for:**
- High-value sales
- Complex customer issues
- Relationship building
- Strategic decisions
- Creative work

**Automation Decision Matrix:**

**Automate if:**
- Repeated frequently
- Takes significant time
- Follows clear rules
- Low risk if wrong

**Keep manual if:**
- Done rarely
- Requires judgment
- Relationship-critical
- High risk if wrong

**The Implementation Order:**

1. **Month 1:** Accounting automation
2. **Month 2:** Email marketing
3. **Month 3:** CRM integration
4. **Month 4:** Advanced workflows
5. **Month 5:** AI tools
6. **Month 6:** Optimization

**Do not try to automate everything at once.**', 3, 50),

  ('Building Owner Independence',
   E'**The goal is a business that runs without you.**

**The Owner Trap:**

**Signs you are trapped:**
- Cannot take vacation
- Work 60+ hours weekly
- Everything needs your approval
- Customers ask for you specifically
- Business stops when you stop

**This is not a business. It is a job.**

**The 4 Levels of Owner Freedom:**

**Level 1: Operator**
- You do everything
- Business runs only when you work
- Cannot scale
- Cannot sell
- 60-80 hours/week

**Level 2: Manager**
- You manage team
- Still involved daily
- Some delegation
- Limited time off
- 40-50 hours/week

**Level 3: Executive**
- Team manages
- You set strategy
- Weekly meetings
- Can take vacations
- 20-30 hours/week

**Level 4: Investor**
- CEO runs business
- You review financials
- Monthly meetings
- Passive income
- 5-10 hours/week

**Most small businesses are Level 1-2. Goal is Level 3-4.**

**The Delegation Framework:**

**What to Delegate:**

**Task if:**
- Repeated regularly
- Clear process
- Low risk
- Not strategic
- Someone else can do 80% as well

**Keep if:**
- High-stakes decisions
- Strategic planning
- Key relationships
- Company culture
- One-off tasks

**The Delegation Process:**

**1. Document** the task fully
**2. Train** team member thoroughly
**3. Observe** them doing it
**4. Let** them do it with oversight
**5. Trust** them to own it
**6. Review** results regularly

**Common Delegation Mistakes:**

**Mistake 1: Not training enough**
Result: Poor execution, frustrated team

**Mistake 2: Micromanaging**
Result: No real freedom, team resentment

**Mistake 3: No checkpoints**
Result: Problems discovered too late

**Mistake 4: Taking it back**
Result: Team learns you do not trust them

**Building the Leadership Team:**

**Key Hire #1: Operations Manager**
- Runs day-to-day
- Manages staff
- Ensures quality
- Frees you from daily ops

**Key Hire #2: Sales Manager**
- Drives revenue
- Manages pipeline
- Closes deals
- Takes sales off your plate

**Key Hire #3: Marketing Manager**
- Generates leads
- Manages campaigns
- Creates content
- Builds brand

**With these three, you move to executive level.**

**The CEO Mindset Shift:**

**Stop thinking:** "How do I do this?"
**Start thinking:** "Who can do this?"

**Stop thinking:** "It is faster if I do it"
**Start thinking:** "Teaching them is an investment"

**Stop thinking:** "They won\'t do it right"
**Start thinking:** "I need better systems and training"

**The Weekly Time Audit:**

**Track your time for one week:**
- $10/hour tasks (anyone can do)
- $100/hour tasks (trained person can do)
- $1,000/hour tasks (only you can do)

**Goal: Eliminate $10 tasks, delegate $100 tasks, focus on $1,000 tasks.**

**Creating Standard Operating Procedures:**

**For every repeated task:**
- Document step-by-step
- Create templates
- Record training videos
- Build checklists
- Make foolproof

**Then delegate.**

**The Vacation Test:**

**Can you take 2 weeks off with:**
- Phone turned off
- No email access
- No check-ins
- Business runs fine

**If no, you have work to do.**

**Building Business Value:**

**Business worth more when:**
- Runs without owner
- Systems documented
- Consistent revenue
- Strong team
- Clean financials

**Owner-dependent business = worthless for sale.**', 4, 50),

  ('Quality Control and Consistency',
   E'**Inconsistent quality kills businesses. Build systems that ensure excellence.**

**The Quality Problem:**

**Without Quality Control:**
- Happy customers one day, angry next
- Team does things differently
- Surprises and complaints
- Lost customers
- Bad reputation

**With Quality Control:**
- Consistent experience
- Predictable results
- Fewer complaints
- Happy customers
- Strong reputation

**The Quality Assurance System:**

**1. Set Standards**
- Define what "good" looks like
- Specific and measurable
- Written down
- Trained to all staff

**Example Standards:**
- Phone answered within 3 rings
- Email replied within 2 hours
- Project delivered on promised date
- Zero defects on final delivery
- Customer satisfaction 9+ out of 10

**2. Build Checkpoints**
- Quality checks at key stages
- Checklists used every time
- Nothing leaves without review
- Catch problems early

**Example Checkpoints:**
- Pre-delivery quality review
- Mid-project status check
- Customer communication touchpoints
- Final walkthrough before completion

**3. Measure Everything**
- Track quality metrics
- Customer satisfaction scores
- Defect rates
- Redo/rework time
- Complaint rates

**4. Fix Root Causes**
- Do not just fix symptoms
- Ask why 5 times
- Update systems
- Train team

**5. Continuous Improvement**
- Review weekly
- What went wrong?
- What went right?
- How to improve?

**The Checklist Culture:**

**Create checklists for:**
- Every repeatable process
- Pre-flight style
- Cannot skip steps
- Sign-off when complete

**Aviation uses checklists to prevent crashes.**
**Your business should too.**

**Example Checklist - Customer Delivery:**

□ All work completed per scope
□ Quality review completed
□ Customer notified of completion
□ Follow-up scheduled
□ Invoice sent
□ Documentation filed
□ Request for review sent
□ Request for referral sent
□ Added to retention sequence
□ CRM updated

**The Quality Circle:**

**Weekly Team Meeting:**
- What quality issues came up?
- Root cause analysis
- Solutions proposed
- Action items assigned
- Follow-up next week

**Empower team to fix quality problems.**

**Customer Feedback Loop:**

**After every interaction:**
- Ask for feedback
- Simple rating 1-10
- Open comment option
- Act on feedback immediately

**Anything under 8 = problem to fix.**

**The Service Recovery Process:**

**When something goes wrong:**

**1. Acknowledge** immediately
   - Do not make excuses
   - Validate their feelings
   - Take responsibility

**2. Apologize** sincerely
   - Specific to their issue
   - Genuine remorse
   - No "but" statements

**3. Fix** the problem
   - Do whatever it takes
   - Go above and beyond
   - Exceed expectations

**4. Prevent** recurrence
   - Update systems
   - Train team
   - Document lesson

**5. Follow-up** later
   - "Did we make it right?"
   - Rebuild relationship
   - Turn angry to raving fan

**Great service recovery creates more loyalty than perfection.**

**Quality vs. Speed vs. Cost:**

**Pick two:**
- Fast + Cheap = Low quality
- Fast + High quality = Expensive
- Cheap + High quality = Slow

**Most small businesses should choose: High quality + reasonable speed = fair price.**

**The Reputation Builder:**

**Consistent quality = strong reputation**

**Strong reputation = referrals, premium pricing, customer loyalty**

**This is how you build a business that lasts.**', 5, 45)
) AS lessons(title, content, order_num, minutes);
