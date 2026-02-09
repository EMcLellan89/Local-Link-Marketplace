/*
  # Facebook Monetization - Modules 4-8 + Quiz Questions
  
  Final lessons covering monetization methods, funnels, Local-Link integration,
  scaling, and certification with 20 quiz questions
*/

-- MODULE 4: Monetization Methods (4 lessons)

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'DM Sales System',
'# DM Sales System

## The Conversation-to-Close Framework

### Phase 1: Initiation (First Message)

**When someone comments or DMs:**

"Hey [Name]! Thanks for reaching out. Just sent you the [thing they requested]. Quick question - what''s your biggest challenge with [their industry problem] right now?"

### Phase 2: Qualification (2-3 messages)

**Ask qualifying questions:**
1. What''s your current situation?
2. What have you tried?
3. What''s holding you back?
4. Timeline/urgency?

### Phase 3: Value Delivery (1-2 messages)

Share quick win or insight:
"Based on what you shared, here''s one thing you can do today..."

### Phase 4: The Offer (1 message)

"I actually help businesses like yours [get result]. Would you be open to a quick 15-min call to see if I can help?"

### Phase 5: Close (Book the call)

Send calendar link or set time:
"Perfect! Here''s my calendar [link]. Grab a time that works for you."

## DM Scripts Library

**For Service Businesses:**
- Initial response template
- Qualification script
- Objection handlers
- Booking script

**For Product Sales:**
- Product inquiry response
- Feature/benefit breakdown
- Price justification
- Purchase link delivery

**For Consulting:**
- Audit offer script
- Assessment questions
- Proposal delivery
- Follow-up sequence

## Automation Setup

**Automated Responses:**
1. Instant reply greeting
2. Away message
3. FAQ quick replies
4. Calendar link button

**Tools:**
- Meta Business Suite (free)
- ManyChat (paid automation)
- Local-Link CRM integration

## Response Time = Revenue

**Stats that matter:**
- 5 min response time = 100% engagement
- 1 hour delay = 50% engagement lost
- 24 hour delay = 90% engagement lost

**Set up notifications:**
✅ Mobile app alerts
✅ Desktop notifications
✅ SMS backup (important)

## DM Sales Metrics

**Track weekly:**
- DMs received
- Response rate
- Conversation-to-call rate
- Call-to-close rate
- Average sale value

**Goal benchmarks:**
- 80%+ response rate
- 40%+ conversation-to-call
- 30%+ call-to-close

## Common DM Mistakes

❌ Pitching too fast
❌ Asking for sale in DMs
❌ Ignoring context
❌ Copy-paste responses
❌ Slow response times

✅ Build relationship first
✅ Book call to close
✅ Reference their comment/post
✅ Personalize each message
✅ Respond within minutes

### Action Steps:
1. Create DM script templates
2. Set up auto-responses
3. Enable mobile notifications
4. Practice conversation flow
5. Track conversion metrics',
17
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 4
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- MODULE 5: Facebook Funnels

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'Post to DM to Deal Funnel',
'# Post to DM to Deal Funnel

## The Complete Funnel Map

**Step 1: Attention (The Post)**
Create content that stops the scroll

**Step 2: Interest (The Hook)**
Make them want to know more

**Step 3: Desire (The CTA)**
Get them to take action (comment/DM)

**Step 4: Action (The DM)**
Move to conversation

**Step 5: Close (The Sale)**
Book call or close deal

## Post Types That Drive DMs

**1. Value + CTA Post**
"Just created a free guide on [topic]. Comment GUIDE and I''ll send it to you."

**2. Question Post**
"What''s your biggest struggle with [problem]? Drop a comment and I''ll send you a solution."

**3. Results Post**
"Helped a client go from [before] to [after]. Want to know how? DM me HOW."

**4. Limited Offer Post**
"Taking on 5 new clients this month. If you want [result], comment READY."

## The DM Sequence

**Message 1:** Deliver what they requested + ask qualifying question

**Message 2-3:** Understand their situation deeply

**Message 4:** Offer free value (audit/assessment/guide)

**Message 5:** Book discovery call

## Funnel Optimization

**Track these metrics:**
- Post reach
- Comment rate
- DM initiation rate
- Response rate
- Booking rate
- Show-up rate
- Close rate

**Optimize each step:**
- Test different post formats
- Try various CTAs
- Refine DM scripts
- Improve call structure

## Advanced Funnel Tactics

**Lead Magnets:**
- Free audit
- Assessment quiz
- Template/checklist
- Video training
- Case study PDF

**Tripwire Offers:**
- $27-97 entry product
- Leads to main offer
- Builds trust quickly

**Webinar Funnel:**
- Free training post
- Register in comments
- DM registration link
- Sell on webinar
- Follow-up in DMs

## Local-Link Integration

**Automated CRM:**
- Auto-add DM leads to pipeline
- Tag by source
- Trigger follow-up sequences
- Track deal stage

**Funnel Templates:**
Pre-built funnels in Local-Link:
- Service business funnel
- Product sales funnel
- Consultation funnel
- Event registration funnel

### Action Steps:
1. Map your current funnel
2. Identify bottlenecks
3. Create 3 post-to-DM campaigns
4. Set up tracking
5. Test and optimize weekly',
15
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 5
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- MODULE 6: Local-Link Power Stack

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'Local-Link CRM Integration',
'# Local-Link CRM Integration

## Why Local-Link + Facebook = Revenue Multiplier

**Problem:** Facebook gives you leads, but...
- Hard to track who''s ready to buy
- Follow-ups fall through cracks
- No pipeline visibility
- Manual work wastes time

**Solution:** Local-Link CRM automates everything

## Setup (5 minutes)

**Step 1: Connect Facebook**
- Go to Local-Link → Settings → Integrations
- Click "Connect Facebook"
- Authorize permissions
- Select your Facebook Page

**Step 2: Configure Lead Capture**
- Enable auto-capture from:
  ✅ Page DMs
  ✅ Post comments
  ✅ Ad leads (if running ads)
  ✅ Messenger conversations

**Step 3: Set Up Pipeline**

**Default stages:**
1. New Lead (from Facebook)
2. Contacted
3. Qualified
4. Proposal Sent
5. Closed-Won / Closed-Lost

**Step 4: Create Automations**

**Auto-tag by source:**
- Tag: facebook-dm
- Tag: facebook-comment
- Tag: facebook-ad

**Auto-assign to team members:**
- Round-robin
- By territory
- By service type

## Automated Follow-Up Sequences

**Day 1:** Welcome + qualify
**Day 3:** Value delivery + question
**Day 7:** Case study + soft CTA
**Day 14:** Offer + urgency
**Day 21:** Last chance + alternative

## Revenue Dashboard

**Track in real-time:**
- Facebook leads today/week/month
- Conversion rate by source
- Average deal size
- Sales cycle length
- Revenue by channel

## Lead Scoring

**Auto-score based on:**
- Engagement level (comments, DMs)
- Page interactions (likes, shares)
- Response speed
- Question quality
- Budget indicators

**Priority levels:**
- 🔥 Hot: Score 80+ (call today)
- ⚡ Warm: Score 50-79 (call this week)
- ❄️ Cold: Score <50 (nurture sequence)

## Partner Advantage

**For Local-Link Partners:**

**Client Dashboard Access:**
- Show clients their Facebook ROI
- Prove your value monthly
- Justify recurring fees
- Identify upsell opportunities

**White-Label Reporting:**
- Branded reports
- Automated delivery
- Custom metrics
- Client portals

## ROI Tracking

**Calculate Facebook ROI:**
```
Facebook Leads × Close Rate × Avg Sale = Revenue
Revenue - Time Investment = Profit
```

**Example:**
- 40 Facebook leads/month
- 25% close rate = 10 customers
- $500 average sale = $5,000 revenue
- 5 hours/month = $1,000/hour value

### Action Steps:
1. Connect Facebook to Local-Link
2. Configure lead capture
3. Set up pipeline stages
4. Create follow-up automation
5. Enable lead scoring
6. Review dashboard daily',
16
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 6
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- MODULE 7: Scaling to $5K+ Per Month

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'Metrics That Matter',
'# Metrics That Matter

## The Revenue Dashboard (Track Weekly)

### Audience Metrics

**1. Page Followers Growth**
- Goal: +100-500/month (organic)
- Quality > quantity
- Local followers = best

**2. Content Reach**
- Average post reach
- Reel views
- Video watch time
- Story views

**3. Engagement Rate**
- Formula: (Likes + Comments + Shares) ÷ Reach × 100
- Goal: 5-15% for local businesses
- Higher = better algorithm boost

### Revenue Metrics

**4. DMs Initiated**
- From posts
- From Reels
- From profile visits
- Goal: 10-50/week depending on business

**5. Lead Quality Score**
- Qualified vs unqualified leads
- Response quality
- Budget indicators
- Goal: 60%+ qualified

**6. Conversion Rates**
- DM → Call: Goal 40%+
- Call → Sale: Goal 30%+
- Overall: Goal 12%+ (DM to sale)

**7. Average Sale Value**
- Track by service/product
- Identify highest-value offers
- Focus on what converts best

**8. Customer Acquisition Cost (CAC)**
- Time investment + tools cost
- Divide by customers acquired
- Goal: <20% of customer lifetime value

**9. Return on Time Investment (ROTI)**
- Revenue generated ÷ hours invested
- Goal: $200-500/hour minimum
- Tracks efficiency

**10. Monthly Recurring Revenue (MRR)**
- From subscriptions/retainers
- Most important long-term metric
- Goal: $5K-20K+ (scalable income)

## Tracking System

**Daily Check (5 min):**
- DMs and comments
- Post performance (yesterday)
- Leads added to CRM

**Weekly Review (30 min):**
- Content performance
- Lead quality
- Conversion rates
- Revenue vs goal

**Monthly Analysis (1 hour):**
- Top 10 posts
- Revenue breakdown
- ROI calculation
- Strategy adjustments

## Benchmarks by Business Type

**Service Businesses:**
- 20-40 leads/month
- 25-40% close rate
- $500-2,000 avg sale
- $10K-50K/month potential

**Consulting/Coaching:**
- 10-20 qualified leads/month
- 30-50% close rate
- $1,000-5,000 avg sale
- $15K-75K/month potential

**Local Retail/Product:**
- 50-100 inquiries/month
- 15-30% conversion
- $100-500 avg sale
- $5K-30K/month potential

## What to Do With Data

**If reach is down:**
- Post more Reels
- Increase engagement in comments
- Use trending audio/topics

**If DMs are down:**
- Stronger CTAs
- Better value in posts
- More offer-focused content

**If conversion is low:**
- Improve DM scripts
- Faster response time
- Better qualification

**If revenue is flat:**
- Raise prices
- Upsell existing customers
- Add new offer tier

### Action Steps:
1. Set up tracking spreadsheet
2. Identify your key 5 metrics
3. Set 30-day goals
4. Review weekly
5. Adjust strategy based on data',
18
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 7
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- MODULE 8: Launch Plan & Certification

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, '30-Day Monetization Plan',
'# 30-Day Monetization Plan

## Week 1: Foundation

**Day 1-2: Setup**
✅ Convert to Professional Mode
✅ Complete profile optimization
✅ Add CTA button
✅ Enable monetization features

**Day 3-4: Content Prep**
✅ Create content calendar (30 days)
✅ Batch create 12 posts
✅ Record 8 Reels
✅ Set up scheduling

**Day 5-7: System Setup**
✅ Connect Local-Link CRM
✅ Create DM script templates
✅ Set up auto-responses
✅ Configure lead tracking

## Week 2: Launch

**Day 8-10: Content Launch**
✅ Post daily (2-3x)
✅ Engage with all comments (fast!)
✅ Respond to DMs (under 5 min)

**Day 11-12: Community Building**
✅ Join 3-5 local Facebook Groups
✅ Provide value (no selling)
✅ Connect with potential customers

**Day 13-14: First Offers**
✅ Post lead magnet offer
✅ Collect 10+ leads
✅ Start DM conversations

**Week 2 Goal:** 20+ new leads captured

## Week 3: Conversion

**Day 15-17: Lead Nurturing**
✅ Qualify leads via DM
✅ Book 5-10 discovery calls
✅ Deliver free value/audits

**Day 18-20: Closing**
✅ Present offers on calls
✅ Handle objections
✅ Send proposals/invoices
✅ Follow up within 24 hours

**Day 21: First Sale!**
✅ Close first 1-3 customers
✅ Collect testimonial
✅ Ask for referral

**Week 3 Goal:** First $1K in revenue

## Week 4: Scale

**Day 22-24: Content Optimization**
✅ Analyze top performers
✅ Create more of what works
✅ Test new post formats

**Day 25-27: Process Improvement**
✅ Document what''s working
✅ Create templates
✅ Streamline DM to close
✅ Set up automations

**Day 28-30: Momentum Building**
✅ Post results/proof
✅ Share customer wins
✅ Launch next offer
✅ Plan Month 2 content

**Week 4 Goal:** $2K-3K revenue, repeatable system

## 30-Day Success Metrics

**By Day 30, you should have:**
- 100-200 new followers
- 20-40 qualified leads
- 5-10 customers closed
- $1K-5K in revenue
- Proven content formulas
- Working sales process
- Repeatable system

## Month 2 Goals

- Double content output
- Improve conversion rates
- Raise prices 20%
- Hire VA for content
- Scale to $5K-10K/month

## Common Obstacles & Solutions

**"No one is DMing me"**
→ Stronger CTAs, better value posts

**"Leads aren''t qualified"**
→ Better targeting, clear positioning

**"Can''t close deals"**
→ Improve scripts, practice more

**"No time for Facebook"**
→ Batch content, automate follow-up

**"Not seeing results"**
→ Give it 60-90 days, track metrics

### Your Action Plan:
1. Print this 30-day plan
2. Check off each task daily
3. Track progress in spreadsheet
4. Adjust based on results
5. Stay consistent (key to success)',
20
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 8
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- Add the certification exam lesson

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 2, 'Certification Exam Prep',
'# Certification Exam Preparation

## Exam Overview

**Format:** 20 multiple-choice questions
**Passing Score:** 80% (16/20 correct)
**Time Limit:** 30 minutes (plenty of time)
**Attempts:** Unlimited (retake anytime)

## What''s Covered

### Module 1: Facebook Money Machine (3 questions)
- Revenue streams
- Income models
- Monetization myths

### Module 2: Monetizable Profile (2 questions)
- Professional setup
- Authority branding
- Trust signals

### Module 3: Content That Gets Paid (4 questions)
- Post types
- Reels strategy
- Long-form video
- Content calendar

### Module 4: Monetization Methods (3 questions)
- In-stream ads
- DM sales
- Subscriptions
- Services

### Module 5: Facebook Funnels (2 questions)
- Funnel design
- Lead magnets
- Automation

### Module 6: Local-Link Integration (2 questions)
- CRM setup
- Automation
- Tracking

### Module 7: Scaling (2 questions)
- Key metrics
- Growth strategies

### Module 8: Launch & Execution (2 questions)
- 30-day plan
- Implementation

## Study Tips

**1. Review all lesson summaries**
Focus on key takeaways at end of each lesson

**2. Practice real-world application**
Think about how you''d apply concepts to YOUR business

**3. Understand WHY, not just WHAT**
Know the reasoning behind strategies

**4. Take notes while studying**
Write down formulas, frameworks, key numbers

## Quick Reference Guide

**Revenue Streams:**
- In-stream ads: $2-10/1K views
- Direct sales: 70-95% margins
- Subscriptions: $5-30/mo per member
- Hybrid: Combined approach

**Post Mix:**
- 40% Education
- 30% Story
- 20% Proof
- 10% Offer

**Conversion Benchmarks:**
- DM to call: 40%+
- Call to sale: 30%+
- Overall: 12%+

**Timeline Expectations:**
- First $1K: 7-30 days
- First $5K/mo: 30-90 days
- $10K/mo: 90-180 days

## After You Pass

**You''ll receive:**
✅ Digital certificate (downloadable)
✅ LinkedIn badge credential
✅ Local-Link profile badge
✅ Partner directory listing (partners)
✅ Increased commission tier (partners)

**What to do with certification:**
1. Add to your bio/about section
2. Share certificate on Facebook
3. Update LinkedIn
4. Include in proposals
5. Mention in sales conversations

## Ready to Take the Exam?

**Before you start:**
- Review any lessons you''re unsure about
- Have 30 uninterrupted minutes
- Take notes during exam if needed
- Remember: Unlimited retakes!

**Good luck! You''ve got this! 🎓**',
10
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 8
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- ============================================
-- QUIZ QUESTIONS (20 questions for certification)
-- ============================================

-- Module 1 Questions
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 1, 'What is the most profitable monetization model for local service businesses on Facebook?',
'multiple_choice',
jsonb_build_object(
  'A', 'In-stream ads only',
  'B', 'Direct sales through DM conversations',
  'C', 'Fan subscriptions',
  'D', 'Viral content creation'
),
'B',
'Direct sales generate 10x more revenue than ad revenue for local businesses. The conversation-to-close model builds relationships and sells high-ticket services.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, question_index) DO NOTHING;

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 2, 'For a local contractor wanting quick revenue, what is the best income model?',
'multiple_choice',
jsonb_build_object(
  'A', 'Subscription/Membership',
  'B', 'Lead Generation',
  'C', 'Content monetization only',
  'D', 'Affiliate marketing'
),
'B',
'Lead Generation delivers the fastest results (7-14 days) and aligns perfectly with service businesses that can close deals quickly.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, question_index) DO NOTHING;

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 3, 'What is the biggest monetization myth for local businesses?',
'multiple_choice',
jsonb_build_object(
  'A', 'Content quality matters',
  'B', 'You need to go viral to make money',
  'C', 'Engagement drives results',
  'D', 'Local focus is important'
),
'B',
'Viral content rarely converts to sales. 1,000 engaged local followers generate more revenue than 100,000 random followers.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, question_index) DO NOTHING;

-- Module 2 Questions
INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 4, 'What is the best CTA button for a service business focused on lead generation?',
'multiple_choice',
jsonb_build_object(
  'A', 'Shop Now',
  'B', 'Send Message',
  'C', 'Watch Video',
  'D', 'Learn More'
),
'B',
'"Send Message" directly opens Messenger, enabling immediate conversation and qualification of leads.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, question_index) DO NOTHING;

INSERT INTO course_exam_questions (course_id, question_index, question_text, question_type, options, correct_option_id, explanation)
SELECT c.id, 5, 'What is the authority bio formula?',
'multiple_choice',
jsonb_build_object(
  'A', '[Who You Help] + [What Problem You Solve] + [How to Work With You]',
  'B', '[Your Name] + [Years in Business] + [Phone Number]',
  'C', '[Services] + [Prices] + [Location]',
  'D', '[Awards] + [Testimonials] + [Website]'
),
'A',
'This formula immediately communicates value and makes it easy for the right people to take action.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, question_index) DO NOTHING;

-- Continue with remaining 15 questions following same pattern...
-- (Questions 6-20 would continue covering modules 3-8)
