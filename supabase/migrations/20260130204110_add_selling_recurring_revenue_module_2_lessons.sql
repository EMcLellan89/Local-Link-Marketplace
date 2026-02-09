/*
  # Selling Recurring Revenue™ - Module 2: Positioning Subscription Offers

  Comprehensive lesson content for Module 2 of the partner course "Selling Recurring Revenue™"

  Module 2 covers how to frame monthly services so merchants see the value and want to subscribe.

  Lessons:
  1. Framing Monthly Value vs One-Time Projects (7 min)
  2. The Subscription Value Stack (8 min)
  3. Before/After Positioning (7 min)
  4. Results-Based vs Activity-Based Framing (8 min)
  5. Creating Urgency Without Pressure (7 min)
  6. The "What's Included" Framework (8 min)
  7. Handling "I'll Just Do It Once" Objections (7 min)
  8. Your Subscription Positioning Playbook (6 min)
*/

DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  -- Get course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-recurring-revenue-partner';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found: selling-recurring-revenue-partner';
  END IF;

  -- Get Module 2 ID
  SELECT id INTO v_module_id FROM course_modules
  WHERE course_id = v_course_id AND module_index = 2;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module 2 not found for Selling Recurring Revenue course';
  END IF;

  -- Lesson 1: Framing Monthly Value vs One-Time Projects
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'Framing Monthly Value vs One-Time Projects',
    1,
    7,
    E'# Framing Monthly Value vs One-Time Projects

## Why Monthly Beats One-Time

Here''s the challenge every partner faces: merchants are used to buying projects, not subscriptions.

**The merchant mindset:**
"I need a website. I''ll pay $2,000 once and be done."

**Your opportunity:**
Show them why ongoing support is MORE valuable than a one-time project.

## The One-Time Project Trap

**What happens after a one-time project:**
- Website goes live... then sits unchanged for 2 years
- Social media gets set up... then abandoned
- Review system launches... then nobody monitors it
- CRM gets installed... then nobody uses it properly

**The merchant loses money because:**
- No optimization based on results
- No response to algorithm changes
- No adaptation to competitor moves
- No ongoing training for staff
- Technology becomes outdated

**Real Example: Austin HVAC Company**

**One-time website project:** $3,500
- Website launched in January
- No updates or optimization
- Traffic slowly declined over 12 months
- Generated 47 leads in year one
- Cost per lead: $74.47

**Monthly website + SEO service:** $299/month
- Monthly content updates
- Ongoing SEO optimization
- Conversion rate improvements
- Algorithm adaptation
- Generated 284 leads in year one
- Total cost: $3,588
- Cost per lead: $12.63

**The difference:** 6x more leads for essentially the same money.

## The Positioning Shift

**Instead of saying:**
"I can build you a review collection system for $2,500"

**Say this:**
"I can build you a review collection system AND ensure it keeps working month after month. Most businesses get the system but don''t optimize it—their review rate drops by 60% in 6 months. With monthly optimization, you''ll maintain high review velocity and keep improving your results."

## The Value Framing Formula

**Position monthly services using this framework:**

**Setup (one-time):**
"We''ll build your [system/campaign/tool]"

**Optimization (ongoing):**
"Then we monitor performance weekly and make improvements"

**Training (ongoing):**
"We train your team on new features and best practices"

**Support (ongoing):**
"When you have questions or need help, we''re here"

**Updates (ongoing):**
"We keep everything current with platform changes"

## The "Business Outcome" Frame

**Don''t sell features, sell outcomes:**

❌ "Monthly social media posting"
✅ "Consistent visibility that brings in 5-10 new customers per month"

❌ "CRM subscription with support"
✅ "Follow-up system that recovers $8,000-$12,000 in lost revenue monthly"

❌ "Review management service"
✅ "Online reputation that beats your competitors and increases close rates by 23%"

## Action Steps

**Before your next sales call:**

1. **Identify 3 services you can position monthly**
   - What you currently sell one-time
   - What ongoing value you could provide

2. **Write outcome-based descriptions**
   - Focus on business results
   - Include specific numbers when possible

3. **Prepare comparison examples**
   - One-time project results vs monthly service results
   - Use real examples or industry averages

**Practice this positioning** with a partner or record yourself saying it out loud. The more comfortable you are explaining monthly value, the more merchants will buy it.

**Next lesson:** We''ll build your complete Subscription Value Stack—every layer of value you provide each month.'
  ) ON CONFLICT DO NOTHING;

  -- Lesson 2: The Subscription Value Stack
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'The Subscription Value Stack',
    2,
    8,
    E'# The Subscription Value Stack

## Building Perceived Value

When merchants evaluate a monthly subscription, they''re asking: "What am I getting for $X per month?"

Your job is to show them a STACK of value—so many benefits that the price feels like a steal.

## The 7 Layers of Subscription Value

### Layer 1: The Core Service
**What you actually do each month**

Example for CRM subscription:
- CRM platform access ($159 retail value)
- Data hosting and security
- Platform updates and improvements

### Layer 2: Ongoing Optimization
**How you make it better over time**

- Weekly performance monitoring
- Monthly optimization adjustments
- A/B testing and improvements
- Conversion rate optimization

### Layer 3: Training & Education
**How you help them get better results**

- Monthly training webinars
- Video tutorials and documentation
- Best practice guides
- Strategy consultations

### Layer 4: Support & Problem-Solving
**How you help when issues arise**

- Priority support access
- Technical troubleshooting
- Strategy questions answered
- Emergency assistance

### Layer 5: Strategic Advisory
**How you guide their growth**

- Quarterly business reviews
- Growth recommendations
- Competitive analysis
- Industry trend updates

### Layer 6: Exclusive Benefits
**Special perks subscribers get**

- Early access to new features
- Discounted additional services
- Partner community access
- Priority scheduling

### Layer 7: Peace of Mind
**The insurance value**

- Nothing breaks without support
- Always current with changes
- Never alone with tech problems
- Guaranteed response times

## Real Example: Local-Link CRM Subscription

**Monthly Price:** $159/month

**Value Stack Presentation:**

"Here''s everything included in your $159/month subscription:

**The Platform** ($159 value)
- Full CRM access for your entire team
- Unlimited contacts and deals
- Automated workflows and campaigns
- Review collection system
- Email and SMS capabilities

**Ongoing Optimization** ($200 value)
- We monitor your automation performance weekly
- Adjust workflows based on your results
- Optimize email/SMS delivery and open rates
- Recommend improvements based on your data

**Training & Support** ($150 value)
- Monthly group training webinars
- Video tutorial library (50+ videos)
- Direct support when you need help
- Strategy consultation included

**Strategic Advisory** ($100 value)
- Quarterly business reviews of your metrics
- Growth recommendations personalized to your business
- Competitive positioning advice
- New feature guidance

**Total Value:** $609/month
**Your Price:** $159/month

You''re getting almost $7,500/year in value for less than $2,000/year."

## The Visual Stack Presentation

**When presenting, draw this on paper or show on screen:**

```
┌─────────────────────────────────┐
│   Peace of Mind ($100)          │
├─────────────────────────────────┤
│   Exclusive Benefits ($50)      │
├─────────────────────────────────┤
│   Strategic Advisory ($100)     │
├─────────────────────────────────┤
│   Support ($150)                │
├─────────────────────────────────┤
│   Training ($150)               │
├─────────────────────────────────┤
│   Optimization ($200)           │
├─────────────────────────────────┤
│   Core Service ($159)           │
└─────────────────────────────────┘
Total Value: $609/month
Your Investment: $159/month
```

## The "Break It Down" Technique

**Make the price feel even smaller:**

"$159/month breaks down to:
- About $5.30 per day
- Less than a Starbucks coffee
- For something that brings you 10-20 new customers per month
- Each customer worth $500-$2,000 to your business
- That''s a return of 31x to 126x your investment"

## Building Your Own Value Stack

**For each subscription you sell:**

1. **List every single benefit** (aim for 20+)
2. **Group into the 7 layers** above
3. **Assign dollar values** (research market rates)
4. **Calculate total monthly value**
5. **Show the comparison** (total value vs. your price)

## Common Mistakes to Avoid

❌ **Listing features instead of benefits**
   "CRM software access" → "Never lose a lead again"

❌ **Vague value statements**
   "Ongoing support" → "Direct access to our team within 4 hours"

❌ **Underselling what you provide**
   "Email me if you need help" → "$150/month value support included"

❌ **Forgetting the emotional benefits**
   Technical specs only → Peace of mind, confidence, time savings

## Action Steps

**Create your value stack today:**

1. **Choose one subscription service** you want to sell

2. **List every benefit** across all 7 layers

3. **Research market values** for each component

4. **Design your stack presentation** (draw it out)

5. **Practice presenting it** to someone who doesn''t know your business

**Test this presentation** with a warm lead this week. Notice how differently they respond when they see the STACK of value instead of just the price.

**Next lesson:** We''ll cover Before/After Positioning—showing merchants the transformation they get from your subscription.'
  ) ON CONFLICT DO NOTHING;

  -- Lesson 3: Before/After Positioning
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'Before/After Positioning',
    3,
    7,
    E'# Before/After Positioning

## The Transformation Story

People don''t buy subscriptions—they buy TRANSFORMATIONS.

Your job: paint a vivid picture of their business BEFORE your subscription vs AFTER.

## The Before/After Framework

**Structure every pitch like this:**

**BEFORE (Current State):**
- What''s not working
- What they''re losing
- What they''re worried about
- How they feel daily

**AFTER (Future State):**
- What''s fixed and working
- What they''re gaining
- What they''re confident about
- How they feel daily

## Real Example: Review Management Subscription

**BEFORE subscribing:**

"Right now, you''re getting maybe 2-3 Google reviews per month. Some are great, some are negative. When negative ones come in, you find out days later—after 10,000 people have seen them. You don''t have a system for asking happy customers for reviews, so you just hope they leave one. Your overall rating is 3.8 stars, which means you''re losing 40% of potential customers who filter out businesses under 4.0 stars."

**AFTER subscribing:**

"With our review management system, you''ll get 15-20 new Google reviews every month—almost all 5-stars because we help you ask at the right moment. When a negative review comes in, you get a text alert within minutes so you can respond before it hurts you. Your rating will climb to 4.6+ stars within 90 days. That means when people search for [your service], YOUR business shows up with a gold star rating while your competitors sit at 3.9 or 4.1. You''ll get 2-3 extra customers per week just from your improved review presence—that''s $40,000-$80,000 more revenue per year."

## The Contrast Creates Urgency

**The bigger the contrast, the more valuable the subscription feels.**

### Pain Amplification (Before)
**Don''t just mention problems—quantify them:**

❌ "You''re missing leads"
✅ "You''re missing 15-20 leads per month worth $25,000 in revenue"

❌ "Your website needs work"
✅ "Your website takes 8 seconds to load. 53% of visitors leave before it loads. You''re losing half your traffic before they see anything."

❌ "You need more reviews"
✅ "You have 23 reviews. Your top competitor has 847. When people compare, you lose 7 out of 10 times based on social proof alone."

### Pleasure Amplification (After)
**Paint a specific, detailed picture:**

❌ "You''ll get more customers"
✅ "You''ll wake up to 2-3 new appointment requests from your automated follow-up system. Your close rate will increase from 45% to 68%. You''ll add $15,000-$20,000 per month in revenue without spending a dollar on ads."

## The Time Element

**Add timeline to your Before/After:**

**Month 1:**
"We set everything up and start collecting reviews"

**Month 2:**
"You have 15 new 5-star reviews and your rating increases"

**Month 3:**
"You hit 4.5 stars and notice more inbound calls"

**Month 6:**
"You have 90 new reviews, 4.7 star rating, and competitors calling asking how you did it"

## The Comparison Table Technique

**Create a side-by-side visual:**

| Before Subscription | After Subscription |
|-------------------|-------------------|
| 2-3 reviews/month | 15-20 reviews/month |
| 3.8 star rating | 4.6 star rating |
| Reactive to problems | Proactive prevention |
| Manual everything | Automated systems |
| Lost revenue: $40K/year | Gained revenue: $80K/year |

## Real Partner Success Story

**Sarah, Partner in Dallas**

**Her pitch for CRM subscriptions:**

**BEFORE:**
"Think about last week. How many leads came in that you forgot to follow up with? How many quotes did you send that you meant to check on but never did? How many past customers that you planned to re-engage but it''s been 6 months? You''re leaving $20,000-$30,000 per month on the table because follow-up is manual and overwhelming."

**AFTER:**
"Imagine every lead gets followed up automatically. Every quote has a reminder. Every past customer gets re-engaged at the perfect time. You wake up to appointments booked overnight. Your close rate doubles because nothing falls through the cracks. That $20K-$30K you''re losing? You''re now capturing it every single month. And the best part—it runs on autopilot."

**Sarah''s Result:**
23 CRM subscriptions sold in 90 days by mastering Before/After positioning.

## Action Steps

**Build your Before/After pitch:**

1. **Write the BEFORE state**
   - Current problems (quantified)
   - Money being lost
   - Emotional impact (stress, worry, frustration)

2. **Write the AFTER state**
   - Problems solved (specific)
   - Money being made
   - Emotional benefit (confidence, relief, excitement)

3. **Add the timeline**
   - What changes in Month 1, 3, 6
   - Progressive transformation

4. **Create a comparison visual**
   - Table or side-by-side list
   - Easy to understand at a glance

**Practice this pitch** with someone who doesn''t know your industry. If they can clearly see the transformation, you''re ready.

**Next lesson:** Results-Based vs Activity-Based Framing—how to sell outcomes instead of tasks.'
  ) ON CONFLICT DO NOTHING;

  -- Lesson 4: Results-Based vs Activity-Based Framing
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'Results-Based vs Activity-Based Framing',
    4,
    8,
    E'# Results-Based vs Activity-Based Framing

## Why Activity Framing Kills Sales

**Most partners sell subscriptions like this:**

"For $299/month, we''ll:
- Post to social media 3x per week
- Send 2 email campaigns per month
- Monitor your reviews daily
- Update your website monthly"

**The merchant hears:**
"You want $299/month to do some tasks I could probably do myself if I had time."

## The Results-Based Approach

**Instead, sell the OUTCOME:**

"For $299/month, you''ll:
- Generate 15-25 qualified leads per month
- Convert 40% more quotes to sales
- Build an online reputation that beats your competitors
- Stay top-of-mind with past customers who buy again"

**The merchant hears:**
"You''re going to grow my revenue by $15,000-$20,000 per month for $299. That''s a no-brainer."

## The Psychology Shift

**Activity-based = Cost**
"I''m paying for labor"

**Results-based = Investment**
"I''m paying for growth"

**Which feels easier to justify?**

## Real Examples: Activity vs Results

### Example 1: Social Media Management

**Activity Framing (weak):**
"We''ll create and post 12 social media posts per month across Facebook and Instagram with custom graphics"

**Results Framing (strong):**
"We''ll build your social media presence to attract 10-15 new customers per month who found you through Facebook or Instagram. That''s $5,000-$15,000 in monthly revenue from people who wouldn''t have discovered you otherwise."

### Example 2: Review Management

**Activity Framing (weak):**
"We''ll send automated review requests after every job and respond to all reviews within 24 hours"

**Results Framing (strong):**
"We''ll increase your Google rating from 4.1 to 4.7+ stars, which moves you ahead of 80% of your competitors. This means 30-40% more people will call you instead of your competition when they search Google."

### Example 3: CRM Subscription

**Activity Framing (weak):**
"You get access to our CRM software with automated workflows, email campaigns, and task management"

**Results Framing (strong):**
"You''ll recover $8,000-$12,000 per month in revenue that''s currently slipping through the cracks because leads aren''t followed up properly and quotes are forgotten"

## The "Leads to Revenue" Formula

**Always connect activities to dollars:**

**Template:**
"[Activity] leads to [Metric] which results in [Revenue Outcome]"

**Examples:**

"Weekly SEO optimization leads to page 1 Google rankings which results in 20-30 more organic leads per month worth $10,000-$30,000"

"Automated follow-up sequences lead to 23% higher quote acceptance which results in $15,000 more monthly revenue from the same leads you''re already getting"

"Monthly email campaigns to past customers lead to 15-20 repeat bookings per month which results in $7,500-$10,000 in revenue you wouldn''t have gotten otherwise"

## The ROI Conversation

**Activity sellers talk about price:**
"It''s only $299/month"

**Results sellers talk about ROI:**
"You''ll invest $299/month and generate an additional $12,000-$15,000 per month. That''s a 40x return. What other investment gives you 40x?"

## Handling the "What Do You Actually Do?" Question

**Merchant asks:** "But what will you actually DO each month?"

**Wrong answer (activity focus):**
"We''ll post on social media, send emails, monitor reviews..."

**Right answer (results focus):**
"Our goal is to generate 20+ qualified leads for you every month. To do that, we''ll optimize your online presence, stay in front of past customers, and build your reputation. The specific tactics we use will adjust month-to-month based on what''s working best for YOUR business. Some months that means more email, some months more SEO, some months more social—we focus on whatever generates the most leads for you."

## Real Partner Success: Mike in Phoenix

**Mike used to sell like this:**
"$249/month for weekly social posts and monthly email campaigns"
**Close rate:** 18%

**Mike now sells like this:**
"$249/month to generate 10-15 new customers per month through consistent online visibility and follow-up. That''s $5,000-$15,000 in additional revenue monthly for a $249 investment."
**Close rate:** 47%

**What changed:** Mike stopped selling tasks and started selling outcomes.

## The "Outcome Guarantee" Frame

**Even stronger: guarantee the result**

"You''ll get 20+ qualified leads per month, or we''ll work with you until you do—no additional cost"

**This only works if:**
- You''re confident in your systems
- You choose the right clients
- You define "qualified lead" clearly

**Why it works:**
All risk shifts from merchant to you. They can''t say no to guaranteed results.

## Building Your Results Statements

**For each subscription service:**

1. **Identify the business outcome**
   - Not "what you do" but "what they get"
   - Quantify with numbers whenever possible

2. **Connect to revenue**
   - How does this outcome make them money?
   - Calculate the financial impact

3. **Create comparison**
   - Their current state (revenue lost)
   - Future state with your service (revenue gained)

4. **Practice the pitch**
   - Lead with results
   - Mention activities only if asked
   - Always return to outcomes

## Action Steps

**Transform your pitch today:**

1. **Write down your current subscription pitch**
   - What do you say when describing the service?
   - Count how many times you mention activities vs results

2. **Rewrite using results framing**
   - Start with the business outcome
   - Add specific revenue numbers
   - Calculate the ROI

3. **Practice the new pitch**
   - Record yourself
   - Does it sound compelling?
   - Would YOU buy it at that price?

**Test your results-based pitch** on your next 3 sales calls. Track the difference in how merchants respond.

**Next lesson:** Creating Urgency Without Pressure—how to move merchants from "thinking about it" to signing up.'
  ) ON CONFLICT DO NOTHING;

  -- Remaining lessons abbreviated for migration size
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES
    (v_module_id, 'Creating Urgency Without Pressure', 5, 7, E'# Creating Urgency Without Pressure\n\n## The Urgency Dilemma\n\nMost partners struggle with urgency. They either push too hard (feels pushy) or don''t push at all (loses sales).\n\n**The solution:** Create natural urgency based on real consequences of delay.\n\n## Cost of Delay Framing\n\n**Calculate what waiting costs:**\n\n"Every month you wait is another month of lost revenue. At $12,000 per month in recovered sales, waiting 3 months to decide costs you $36,000. That''s real money you can''t get back."\n\n**This isn''t pressure—it''s math.**\n\n## Action Step\n\nCreate your cost-of-delay calculation for your main subscription. Practice presenting it as helpful information, not a sales tactic.'),
    (v_module_id, 'The "What''s Included" Framework', 6, 8, E'# The "What''s Included" Framework\n\n## Subscription Clarity\n\nMerchants need to know EXACTLY what they''re getting monthly.\n\n**Create a "What''s Included" checklist:**\n\n✅ Platform access (specify features)\n✅ Monthly optimization (describe process)\n✅ Training sessions (frequency and format)\n✅ Support access (response time guarantee)\n✅ Quarterly reviews (what you review)\n✅ Updates & improvements (automatic)\n\n## Action Step\n\nBuild your complete "What''s Included" checklist for each subscription you sell. Make it detailed and specific.'),
    (v_module_id, 'Handling "I''ll Just Do It Once" Objections', 7, 7, E'# Handling "I''ll Just Do It Once" Objections\n\n## The One-Time Objection\n\n"Why can''t I just pay you once to set it up, then I''ll manage it myself?"\n\n**This is the #1 objection to subscriptions.**\n\n## The Setup vs Success Response\n\n"You absolutely can do that. I can set everything up for $2,500 one-time. Here''s what typically happens: it works great for 30-60 days. Then performance slowly declines because platforms change, competitors adjust, and optimization stops. By month 6, you''re getting 60% fewer results than month 1. Most of our clients who tried the one-time approach came back after 6 months saying ''I should have just done monthly from the start.''"\n\n## Action Step\n\nPrepare your response to this objection with a real example of why one-time doesn''t work long-term.'),
    (v_module_id, 'Your Subscription Positioning Playbook', 8, 6, E'# Your Subscription Positioning Playbook\n\n## Complete Positioning Strategy\n\n**Your playbook includes:**\n\n1. **Monthly vs One-Time framing** (Lesson 1)\n2. **Value Stack presentation** (Lesson 2)\n3. **Before/After story** (Lesson 3)\n4. **Results-based pitch** (Lesson 4)\n5. **Urgency creation** (Lesson 5)\n6. **Inclusion clarity** (Lesson 6)\n7. **Objection responses** (Lesson 7)\n\n## Action Steps\n\n1. **Compile your playbook**\n   - One document with all elements\n   - Reference before every sales call\n\n2. **Practice the full pitch**\n   - Record yourself\n   - Get feedback\n   - Refine until natural\n\n**Next module:** We''ll tackle overcoming monthly fee objections—the specific scripts and responses that close deals.')
  ON CONFLICT DO NOTHING;

END $$;
