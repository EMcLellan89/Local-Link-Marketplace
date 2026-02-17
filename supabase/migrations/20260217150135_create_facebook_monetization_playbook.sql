/*
  # Create Facebook Monetization Execution Playbook
  
  1. New Playbook
    - Facebook Monetization execution playbook for partners
    - Step-by-step guide to sell and deliver Facebook services
  
  2. Modules & Lessons
    - Prospecting & Qualification
    - Discovery & Diagnosis
    - Proposal & Pricing
    - Close & Onboard
    - Delivery & Results
    - Upsell & Retention
*/

-- Create the main playbook
INSERT INTO partner_playbooks (
  slug, title, subtitle, description, thumbnail_url, 
  category, difficulty_level, estimated_duration_minutes, is_published, display_order
) VALUES (
  'facebook-monetization-execution',
  'Facebook Monetization: Complete Sales & Delivery System',
  'Turn local businesses into $500-$2,000/month recurring Facebook clients',
  'Complete step-by-step playbook for selling Facebook Group monetization services to local businesses. Includes prospecting scripts, discovery frameworks, pricing models, proposal templates, onboarding checklists, delivery playbooks, and retention strategies.',
  'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
  'sales',
  'intermediate',
  180,
  true,
  10
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- Get playbook ID
DO $$
DECLARE
  v_playbook_id uuid;
  v_module1_id uuid;
  v_module2_id uuid;
  v_module3_id uuid;
  v_module4_id uuid;
  v_module5_id uuid;
  v_module6_id uuid;
BEGIN
  SELECT id INTO v_playbook_id FROM partner_playbooks WHERE slug = 'facebook-monetization-execution';

  -- Module 1: Prospecting & Qualification
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Prospecting & Qualification', 'Identify and qualify ideal Facebook monetization prospects', 1)
  RETURNING id INTO v_module1_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module1_id, 'Ideal Client Profile', '# Ideal Facebook Monetization Client

## Perfect Fit Businesses:
- **Trade Services:** HVAC, Plumbing, Electrical, Roofing
- **Home Services:** Landscaping, Pool Service, Pest Control
- **Professional Services:** Real Estate, Insurance, Financial Planning
- **Health & Wellness:** Chiropractors, Med Spas, Fitness Studios
- **Pet Services:** Groomers, Vets, Boarding

## Key Indicators:
✓ 5+ years in business
✓ $500K+ annual revenue
✓ Local service area (not nationwide)
✓ High customer lifetime value ($2K+)
✓ Strong reputation/reviews
✓ Existing customer base (100+ past customers)

## Red Flags:
✗ Retail/product-only businesses
✗ National chains (no local autonomy)
✗ Startups (<2 years)
✗ Low-margin businesses
✗ Bad reputation/reviews

## Why These Businesses Win:
- They already have customer relationships
- They need recurring revenue
- Facebook Groups create community
- Easy to monetize with memberships
- High-value upsells available', 1, 'content'),

  (v_module1_id, 'Prospecting Scripts', '# Prospecting Scripts

## Cold Outreach (Email):
**Subject:** Quick question about [Business Name]''s recurring revenue

Hi [Name],

I help local service businesses like [Business Type] turn their existing customers into $2K-$10K/month recurring revenue through private Facebook communities.

Most [Business Type] owners are sitting on a goldmine - hundreds of past customers who would happily pay $20-50/month for exclusive perks, priority service, and community access.

Would you be open to a 15-minute call to see if this makes sense for [Business Name]?

Best,
[Your Name]

## Warm Referral:
"Hey [Name], [Referrer] mentioned you might be interested in adding recurring revenue to your business. I specialize in helping [Business Type] companies monetize their customer base through membership programs. Have 15 minutes this week?"

## Social Media DM:
"Hi [Name]! Saw you''re killing it with [Business Name]. Quick question - have you thought about turning your past customers into recurring monthly revenue? I help local businesses do exactly that. Open to a quick chat?"

## Follow-Up (Day 3):
"[Name] - following up on my note about recurring revenue for [Business Name]. Most [Business Type] owners are surprised when they see the numbers. 15-minute call this week?"', 2, 'content'),

  (v_module1_id, 'Qualification Checklist', '# Qualification Checklist

## Use This Before Booking Discovery:

### Business Basics:
- [ ] In business 3+ years?
- [ ] Annual revenue $300K+?
- [ ] Local/regional (not nationwide)?
- [ ] B2C or local B2B?

### Customer Base:
- [ ] 100+ existing customers?
- [ ] Customer LTV $1,000+?
- [ ] Good reputation/reviews?
- [ ] Regular repeat business?

### Decision Making:
- [ ] Owner or decision maker?
- [ ] Authority to spend $1K-$3K/month?
- [ ] Open to new marketing strategies?

### Fit Assessment:
- [ ] Service-based business?
- [ ] Community-friendly industry?
- [ ] Has customer relationships?
- [ ] Needs recurring revenue?

## Scoring:
- **12+ Yes:** PERFECT - Book discovery immediately
- **8-11 Yes:** GOOD - Qualify further
- **4-7 Yes:** MAYBE - Proceed with caution
- **<4 Yes:** PASS - Not a fit

## Disqualifiers (Automatic No):
✗ Retail/product only
✗ National chain
✗ Bad reputation
✗ No authority/budget
✗ Less than 50 customers', 3, 'content');

  -- Module 2: Discovery & Diagnosis
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Discovery & Diagnosis', 'Uncover pain points and quantify the opportunity', 2)
  RETURNING id INTO v_module2_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module2_id, 'Discovery Call Framework', '# Discovery Call Framework (45 Minutes)

## Opening (5 min):
"Thanks for your time today. My goal is to understand your business and see if there''s an opportunity to add $2K-$10K in recurring monthly revenue. Sound good?"

## Current State Questions (15 min):
1. "Tell me about your business - how long, what you do, who you serve?"
2. "How many customers do you have? How often do they buy?"
3. "What''s your average customer value over their lifetime?"
4. "Do you have any recurring revenue today?"
5. "What''s your biggest challenge right now?"

## Pain Discovery (10 min):
1. "How predictable is your monthly revenue?"
2. "What happens in slow months?"
3. "How much do you spend to acquire a new customer?"
4. "What''s your current strategy for getting repeat business?"
5. "If you could wave a magic wand, what would change?"

## Vision Questions (10 min):
1. "If you had $5K in guaranteed recurring revenue every month, what would that mean?"
2. "What would you do with more predictable cash flow?"
3. "How would it feel to have customers paying you monthly?"

## Opportunity Quantification (5 min):
"Let me share what I''m seeing... You have [X] past customers. If just 10% joined a membership at $29/month, that''s $[Y]/month in pure recurring revenue. Does that interest you?"

## Close (5 min):
"I''d like to put together a custom plan for [Business Name]. Give me 48 hours and I''ll show you exactly how to build this. Sound good?"', 1, 'content'),

  (v_module2_id, 'Pain Point Matrix', '# Pain Point Matrix

## Primary Pains (Hit These Hard):
- **Unpredictable Revenue:** "Feast or famine months"
- **Customer Acquisition Cost:** "Too expensive to get new customers"
- **One-Time Transactions:** "Customers only buy once"
- **Cash Flow Issues:** "Can''t plan or invest"
- **Competitor Pressure:** "Race to the bottom on pricing"

## Secondary Pains:
- Staff idle time
- Marketing doesn''t work
- Can''t afford to hire
- Stress about slow periods
- Constantly chasing new business

## Agitate Questions:
- "How much revenue did you lose last slow month?"
- "What''s it costing you not to have recurring customers?"
- "If this continues, where will you be in 12 months?"
- "What opportunities are you missing without predictable revenue?"

## Amplify Impact:
- Calculate annual lost revenue
- Show competitor advantage
- Highlight stress/time cost
- Project 12-month future state', 2, 'content'),

  (v_module2_id, 'Opportunity Calculator', '# Opportunity Calculator

## The Math:
**Total Past Customers:** _______
**× Conversion Rate (10%):** _______
**= Potential Members:** _______
**× Monthly Price ($29-$49):** _______
**= Monthly Recurring Revenue:** _______

## Example:
- 500 past customers
- × 10% conversion = 50 members
- × $39/month = **$1,950/month**
- × 12 months = **$23,400/year**

## Conservative Projection:
**Month 1-3:** 20-30 members ($600-$1,200/mo)
**Month 4-6:** 40-60 members ($1,200-$2,400/mo)
**Month 7-12:** 60-100 members ($2,000-$4,000/mo)

## Present This Way:
"Based on your numbers, here''s the opportunity I see..."
[Show calculator]
"And this is just from your existing customer base. What if you had this every month?"

## Close Question:
"If I could show you how to get even half of this, would you want to see it?"', 3, 'content');

  -- Module 3: Proposal & Pricing
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Proposal & Pricing', 'Present compelling proposals with clear ROI', 3)
  RETURNING id INTO v_module3_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module3_id, 'Proposal Structure', '# Facebook Monetization Proposal

## Section 1: Executive Summary
- Their business name and situation
- The opportunity (recurring revenue potential)
- Your solution (Facebook Group membership)
- Expected results (numbers)

## Section 2: The Problem
- Recap their pain points
- Show the cost of doing nothing
- Highlight missed opportunities

## Section 3: The Solution
**Private Facebook Group Membership Program**
- Exclusive community for customers
- Monthly membership pricing
- Premium perks and benefits
- Priority service access

## Section 4: Membership Structure
**Bronze Level ($29/month):**
- Community access
- Monthly tips/advice
- Priority scheduling
- Members-only discounts

**Silver Level ($49/month):**
- Everything in Bronze
- Monthly expert training
- Quarterly in-person events
- Exclusive giveaways

**Gold Level ($99/month):**
- Everything in Silver
- 24/7 priority support
- Annual VIP event
- Special product discounts

## Section 5: Revenue Projection
[Show the calculator with their numbers]

## Section 6: What You Get
- Group setup and branding
- Membership platform integration
- Launch campaign strategy
- Content calendar (3 months)
- Member onboarding system
- Monthly management

## Section 7: Investment
**Setup Fee:** $2,500 (one-time)
**Monthly Management:** $500-$1,500/month

**ROI:** First member covers management. 10 members = profitable.', 1, 'content'),

  (v_module3_id, 'Pricing Models', '# Pricing Models

## Model 1: Flat Fee + Revenue Share
**Setup:** $1,500
**Monthly:** $500 + 20% of membership revenue

**Best For:** New partners, risk-averse clients
**Pitch:** "You only pay more when you make more"

## Model 2: Pure Revenue Share (No Setup)
**Setup:** $0
**Monthly:** 30% of membership revenue

**Best For:** Clients with no budget, high trust
**Pitch:** "No money down. I make money when you do"

## Model 3: Flat Monthly (All-Inclusive)
**Setup:** $2,500
**Monthly:** $1,500

**Best For:** Established clients, predictable costs
**Pitch:** "One price, everything included, no surprises"

## Model 4: Performance Tiers
**Setup:** $2,000
**0-50 members:** $750/month
**51-100 members:** $1,250/month
**100+ members:** $1,750/month

**Best For:** Growth-oriented clients
**Pitch:** "Pricing scales with your success"

## Recommended: Start with Model 1
Most flexible, easiest to sell, covers your costs while aligning incentives.', 2, 'content'),

  (v_module3_id, 'Objection Handling', '# Common Objections & Responses

## "It''s too expensive"
**Response:** "I understand. Let''s look at the ROI. If you get just 10 members at $39/month, that''s $390/month or $4,680/year. My fee is covered in the first 3 months, and you keep the recurring revenue forever."

## "I don''t have time"
**Response:** "That''s exactly why I''m here. I handle everything - setup, content, management, engagement. You spend 1 hour/month on live Q&A. That''s it."

## "Will my customers actually pay?"
**Response:** "Great question. People already pay for Costco, Amazon Prime, and Netflix. Your best customers will happily pay for priority access and perks. Plus, we''ll give them exclusive benefits they can''t get anywhere else."

## "I''m not tech-savvy"
**Response:** "Perfect. You don''t need to be. I handle all the tech. You show up for one monthly call with your members. That''s it. We make it completely turnkey."

## "I need to think about it"
**Response:** "Absolutely. Can I ask - what specifically are you thinking about? Is it the investment, the time commitment, or something else? Let''s address that right now."

## "Can I start smaller?"
**Response:** "I appreciate that. Here''s what I recommend: We start with a 3-month pilot. If you''re not seeing results, we part ways. Fair?"

## Pro Tip: Always Circle Back to ROI
"Remember, you''re not spending $X - you''re investing $X to make $Y. That''s a [Z]% return."', 3, 'content');

  -- Module 4: Close & Onboard
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Close & Onboard', 'Close the deal and onboard clients smoothly', 4)
  RETURNING id INTO v_module4_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module4_id, 'Closing Scripts', '# Closing Scripts

## Assumptive Close:
"Based on everything we''ve discussed, I''m confident we can add $2K-$5K in recurring revenue within 6 months. Let''s get your agreement signed and kick off next week. Sound good?"

## Alternative Close:
"Would you prefer to start with the flat monthly model or the revenue share model? Both work great."

## Trial Close:
"If we could guarantee you 25 members in the first 90 days, would you move forward today?"

## Urgency Close:
"I only take on 3 new clients per month to ensure quality. I have one spot left this month. Can we lock that in for you?"

## Takeaway Close:
"I''m not sure this is the right fit. Your customer base might be too small to hit our minimum targets. What do you think?"

## Direct Close:
"Do you want to do this?"

## After Objections:
"I''ve addressed [objection 1], [objection 2], and [objection 3]. What else is holding you back?"

## Silence Close:
[Present proposal]
[Stop talking]
[Wait for response]

## The Three-Question Close:
1. "Does this make sense for your business?"
2. "Can you see yourself having 50+ members in 6 months?"
3. "When would you like to start?"', 1, 'content'),

  (v_module4_id, 'Onboarding Checklist', '# Client Onboarding Checklist

## Week 1: Setup & Strategy
- [ ] Sign agreement and collect payment
- [ ] Schedule kickoff call (90 minutes)
- [ ] Get access to Facebook Business Page
- [ ] Collect business assets (logo, colors, images)
- [ ] Get customer email list
- [ ] Define membership tiers and pricing
- [ ] Create member benefit list

## Week 2: Build
- [ ] Create private Facebook Group
- [ ] Design cover image and branding
- [ ] Set up group rules and guidelines
- [ ] Create welcome post template
- [ ] Build membership payment page
- [ ] Set up email sequences
- [ ] Create content calendar (first 30 days)

## Week 3: Content & Launch Prep
- [ ] Record welcome video
- [ ] Write first 10 posts
- [ ] Create launch email campaign
- [ ] Design launch graphics
- [ ] Set up member onboarding flow
- [ ] Test payment system

## Week 4: Launch
- [ ] Send launch email to customer list
- [ ] Post launch announcement on business page
- [ ] Go live with launch video
- [ ] Respond to all questions within 2 hours
- [ ] Onboard first 10 members
- [ ] Send welcome kit to new members

## Ongoing:
- [ ] Weekly check-in with client
- [ ] 3 posts per week in group
- [ ] Monthly live Q&A session
- [ ] Monthly performance report', 2, 'content'),

  (v_module4_id, 'Contract Template', '# Service Agreement Template

**FACEBOOK COMMUNITY MONETIZATION SERVICES**

**Client:** [Business Name]
**Service Provider:** [Your Company]
**Start Date:** [Date]

## Services Included:
1. Private Facebook Group setup and branding
2. Membership tier structure design
3. Payment system integration
4. Launch campaign execution
5. Content creation and posting (12 posts/month)
6. Member onboarding and support
7. Monthly live Q&A facilitation
8. Monthly performance reporting

## Investment:
**Setup Fee:** $[Amount] (due upon signing)
**Monthly Management:** $[Amount] (due 1st of each month)

## Payment Terms:
- Setup fee due upon contract signing
- Monthly fees billed in advance
- Payment methods: ACH, Credit Card, Wire
- Late fees: 5% after 10 days

## Term:
- Initial term: 6 months
- Auto-renews month-to-month
- Either party may cancel with 30 days notice

## Performance Expectations:
- Goal: [X] members within 6 months
- Minimum requirement: [Y] members or contract renegotiation

## Client Responsibilities:
- Provide business assets and customer list
- Participate in 1-hour monthly strategy call
- Host monthly live Q&A in group
- Respond to member questions within 24 hours

## Signatures:
Client: __________________ Date: __________
Provider: ________________ Date: __________', 3, 'content');

  -- Module 5: Delivery & Results
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Delivery & Results', 'Execute the program and drive member growth', 5)
  RETURNING id INTO v_module5_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module5_id, 'Launch Campaign Blueprint', '# Launch Campaign Blueprint

## Pre-Launch (Week Before):
**Email 1 (7 days out):** Teaser
"Something exciting is coming..."

**Email 2 (5 days out):** Problem
"Most [business type] customers don''t get..."

**Email 3 (3 days out):** Solution Preview
"Introducing the [Business Name] VIP Community"

## Launch Day:
**Email 4:** Full announcement
- What it is
- Benefits
- Pricing
- Call to action

**Social Posts:**
- Facebook Business Page
- Instagram
- LinkedIn

**Live Video:**
- Owner announces community
- Shows behind-the-scenes
- Answers questions
- Special launch bonus

## Post-Launch (Week 1):
**Email 5 (Day 2):** Social proof
"10 members joined in first 24 hours!"

**Email 6 (Day 4):** Testimonials
Real member feedback

**Email 7 (Day 7):** Last call
"Founding member pricing ends tonight"

## Week 2-4:
- Daily engagement posts in group
- Member spotlights
- Value demonstrations
- Referral campaigns

## Key Metrics:
- Email open rates (target: 25%+)
- Click-through rates (target: 5%+)
- Conversion rate (target: 10%+)
- Member retention (target: 85%+)', 1, 'content'),

  (v_module5_id, 'Content Calendar Template', '# Monthly Content Calendar

## Week 1: Education
**Monday:** Industry tip/hack
**Wednesday:** How-to tutorial
**Friday:** Q&A recap

## Week 2: Engagement
**Monday:** Member spotlight
**Wednesday:** Poll/survey
**Friday:** Behind-the-scenes

## Week 3: Value
**Monday:** Expert interview
**Wednesday:** Case study
**Friday:** Resource roundup

## Week 4: Community
**Monday:** Challenge/contest
**Wednesday:** Member success story
**Friday:** Month-end recap + next month preview

## Special Posts:
- **Monthly Live Q&A:** Last Friday of month
- **New Member Welcomes:** Daily as they join
- **Exclusive Offers:** 1st of each month
- **Member Anniversaries:** Weekly roundup

## Content Types:
- **Text posts:** 40%
- **Images:** 30%
- **Videos:** 20%
- **Live streams:** 10%

## Engagement Tactics:
- Ask questions in every post
- Tag members by name
- Respond to all comments within 2 hours
- Create polls 2x/month
- Host challenges monthly', 2, 'content'),

  (v_module5_id, 'Performance Tracking', '# Performance Tracking

## Weekly KPIs:
- New members joined
- Member churn (cancellations)
- Net member growth
- Engagement rate (posts/members)
- Revenue (MRR)

## Monthly Report Template:

**MEMBERSHIP METRICS:**
- Starting members: [X]
- New members: [Y]
- Churned members: [Z]
- Ending members: [Total]
- Growth rate: [%]

**REVENUE:**
- Monthly Recurring Revenue: $[X]
- Growth from last month: $[Y] ([Z]%)
- Projected annual value: $[X × 12]

**ENGAGEMENT:**
- Posts published: [X]
- Total comments: [Y]
- Total reactions: [Z]
- Engagement rate: [%]

**CONTENT:**
- Live Q&A attendance: [X]
- Most popular post: [Title]
- Member testimonials: [X]

**NEXT MONTH GOALS:**
- Member target: [X]
- Revenue target: $[Y]
- Retention target: [Z]%

**ACTION ITEMS:**
1. [Tactic to improve growth]
2. [Tactic to improve retention]
3. [Tactic to improve engagement]

Send this report to client by 5th of each month.', 3, 'content');

  -- Module 6: Upsell & Retention
  INSERT INTO partner_playbook_modules (playbook_id, title, description, display_order)
  VALUES (v_playbook_id, 'Upsell & Retention', 'Maximize lifetime value and minimize churn', 6)
  RETURNING id INTO v_module6_id;

  INSERT INTO partner_playbook_lessons (module_id, title, content, display_order, lesson_type) VALUES
  (v_module6_id, 'Upsell Opportunities', '# Upsell Opportunities

## Level 1: Membership Tiers
**Bronze → Silver:**
- Offer after 3 months
- Show additional value
- Limited-time upgrade offer
- 30-40% conversion target

**Silver → Gold:**
- Offer after 6 months
- VIP treatment pitch
- Exclusive perks
- 20-30% conversion target

## Level 2: Add-On Services
**Premium Training:**
- Quarterly workshops ($97/session)
- Annual summit ($297/ticket)
- Certification programs ($497)

**VIP Services:**
- Concierge scheduling ($49/month)
- Extended warranties ($99/year)
- Equipment rental programs

**Product Bundles:**
- Member-exclusive products
- Bulk purchase discounts
- Subscription boxes

## Level 3: Client Expansion
**Upgrade Their Service:**
- "Let''s add a customer referral program"
- "Want me to manage your email marketing?"
- "Should we add SMS to your members?"

**Additional Locations:**
- Multi-location group management
- Franchise territory programs

## Upsell Timing:
- Month 3: First tier upgrade
- Month 6: Add-on service
- Month 9: Second tier upgrade
- Month 12: Expansion/renewal

## Upsell Script:
"Your members love [current benefit]. Based on the feedback, I think they''d really value [new benefit]. Want to test it?"', 1, 'content'),

  (v_module6_id, 'Retention Strategies', '# Retention Strategies

## Prevent Churn:

### Early Warning Signs:
- Decreased engagement (no posts/comments in 7 days)
- Payment issues (failed charges)
- Complaints about value
- No attendance at events

### Intervention Tactics:
1. **Personal Outreach:** DM members who go silent
2. **Re-engagement Campaign:** "We miss you" email
3. **Feedback Request:** "How can we improve?"
4. **Special Offer:** Exclusive perk for staying

## Membership Retention Program:

**Month 1: Onboarding**
- Welcome video call
- Orientation checklist
- Quick win assignment
- 7-day check-in

**Month 2-3: Engagement**
- Personal intro to other members
- Feature in member spotlight
- Invite to exclusive event

**Month 4-6: Value Reinforcement**
- Calculate savings/benefits received
- Share success metrics
- Gather testimonial

**Month 7-12: Community Building**
- Make them an ambassador
- Ask for referrals
- Invite to advisory board

## Cancellation Prevention:

**When Member Wants to Cancel:**
1. "Can I ask what prompted this?"
2. "What would it take to keep you?"
3. "Can we fix [their concern]?"
4. "How about we pause for 30 days instead?"

**Offers to Save:**
- One month free
- Tier downgrade (keep them)
- Custom solution
- Pause membership (vs cancel)

**If They Still Leave:**
- Exit survey
- Thank you message
- Stay-in-touch list
- Win-back campaign (90 days)

## Retention Targets:
- Month 1: 90% (high due to launch excitement)
- Month 2-3: 85%
- Month 4-6: 90%
- Month 7-12: 92%
- Year 2+: 95%', 2, 'content'),

  (v_module6_id, 'Client Renewal Strategy', '# Client Renewal Strategy

## 90 Days Before Contract End:

**Performance Review:**
- Schedule renewal discussion
- Prepare results report
- Calculate ROI
- Show year-over-year growth

**Renewal Proposal:**
- Year 2 results projection
- Enhanced services offer
- Multi-year discount option

## Renewal Script:

"[Client Name], we''re coming up on your annual renewal. Let''s talk about what we''ve accomplished and where we''re going next."

**Show Results:**
"Year 1 Results:
- Started with 0 members
- Now at [X] members
- $[Y]/month recurring revenue
- $[Z] total revenue generated
- [ROI]% return on your investment"

**Future Vision:**
"Year 2 Projection:
- Grow to [X] members
- $[Y]/month MRR
- Add [new tier/service]
- [specific improvement]"

**Renewal Options:**

**Option 1: Continue As-Is**
$[current price]/month

**Option 2: Growth Plan**
$[+20% price]/month
- Add SMS campaigns
- Quarterly in-person events
- Enhanced reporting

**Option 3: Enterprise**
$[+40% price]/month
- Everything in Growth
- Dedicated account manager
- Custom integrations
- Multi-location support

**Multi-Year Discount:**
"Or lock in for 2 years and save 15%"

## Closing:
"What sounds best for [Business Name]?"

## If They Hesitate:
"I understand. Let me ask - what would make this a no-brainer renewal for you?"

## Renewal Targets:
- 85%+ client retention
- 20%+ revenue increase per renewal
- 50%+ upgrade to higher tier', 3, 'content');

END $$;
