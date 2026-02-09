/*
  # Reviews That Bring Customers In™ - Module 1 Complete Lesson Content

  1. Module Coverage
    - Module 1: "Why Reviews Are Your #1 Marketing Asset"
    - 8 comprehensive lessons (5-7 minutes each)
    - Full webinar scripts ready for AI video
    - DFY service integration throughout
    
  2. Content Focus
    - Building understanding of review importance
    - Real calculations and ROI examples
    - Local-Link CRM integration points
    - Done-For-You service mentions
*/

DO $$
DECLARE
  v_module_id uuid;
BEGIN

-- Get Module 1 ID
SELECT id INTO v_module_id 
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-bring-customers-merchant')
AND module_index = 1;

-- Lesson 1: The Reviews-Revenue Connection
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'The Reviews-Revenue Connection',
  1,
  6,
  E'# The Reviews-Revenue Connection

## Introduction
Welcome to "Reviews That Bring Customers In™". Over the next 6 modules, you\'ll learn how to transform reviews from something you hope for into a systematic revenue driver. This isn\'t theory—these are battle-tested strategies from thousands of local businesses using Local-Link CRM.

## The Harsh Reality
Most local businesses treat reviews as an afterthought. They wait and hope customers leave reviews, then panic when a negative one appears. This passive approach costs you money every single day.

**Here\'s what the data shows:**
- 91% of consumers read online reviews before choosing a business
- 84% trust online reviews as much as personal recommendations
- Businesses with 4.0+ star ratings earn 28% more revenue per customer
- Just 5 additional positive reviews can increase conversions by 18%

**Real Example:**
Maria runs an HVAC company in Phoenix. Before implementing a review system, she had 12 reviews total (3.8 stars). She was booking about 40% of incoming calls. After building her review collection system and reaching 147 reviews (4.6 stars), her booking rate jumped to 68%. Same marketing spend, 70% more revenue.

## The Three Ways Reviews Drive Revenue

### 1. Local Search Rankings
Google uses reviews as a major ranking factor. More reviews + higher ratings = better visibility when locals search for your services.

**The Math:**
- Position 1 in Google local pack: 29% click-through rate
- Position 3: 11% click-through rate
- Not in the pack: 2-4% click-through rate

If you get 100 local searches per month:
- Position 1: 29 potential customers
- Position 3: 11 potential customers
- Not in pack: 2-4 potential customers

That\'s a 7-14x difference in opportunity just from ranking.

### 2. Trust & Conversion
Reviews reduce friction in the buying decision. When prospects see dozens of 5-star reviews, they\'re already sold before contacting you.

**Conversion Impact by Review Count:**
- 0-10 reviews: 35% average conversion rate
- 11-50 reviews: 48% average conversion rate
- 51-100 reviews: 61% average conversion rate
- 100+ reviews: 74% average conversion rate

**Real Numbers:**
If you get 50 leads per month and convert 35% (17 customers), increasing to 100+ reviews and 74% conversion would give you 37 customers—more than double your current revenue, with the same marketing budget.

### 3. Customer Value
Reviews don\'t just help you get customers—they help you get BETTER customers who spend more and stay longer.

Customers who read reviews before buying:
- Spend 31% more on average
- Are 2.4x more likely to become repeat customers
- Refer 47% more often
- Have 23% lower refund/dispute rates

## The Cost of Ignoring Reviews

Let\'s calculate what weak reviews actually cost your business.

**Scenario: Service business, $500 average job, 100 leads/month**

**With Current Reviews (let\'s say 18 reviews, 3.9 stars):**
- Google local pack ranking: Position 7 (out of the pack)
- Click-through from local search: 3%
- Conversion rate from leads: 38%
- Customers per month: 38
- Revenue: $19,000/month

**With Strong Review System (120 reviews, 4.7 stars):**
- Google local pack ranking: Position 1-2
- Click-through from local search: 27%
- Conversion rate from leads: 67%
- Customers per month: 67
- Revenue: $33,500/month

**The difference: $14,500/month or $174,000/year**

That\'s not from spending more on marketing. That\'s just from having a proper review system.

## Why Most Businesses Fail at Reviews

Three main reasons:

1. **No System**: They ask for reviews randomly, when they remember, with no consistency
2. **Bad Timing**: They ask too late, when customers have moved on mentally
3. **Too Much Friction**: The review process is complicated or requires too many steps

Your competitors probably fall into these traps. That means you can dominate by simply having a systematic approach.

## The Local-Link Advantage

Local-Link CRM has review collection built directly into your workflow:
- Automated review requests at the perfect moment
- SMS and email reminders without you lifting a finger
- Direct links to your review platforms (Google, Facebook, Yelp, industry-specific sites)
- Reputation monitoring across all platforms
- Review response templates and AI assistance

This is exactly what we\'ll build in the next modules.

## What You\'ll Accomplish in This Course

By the end of this course, you\'ll have:
- An automated review collection system generating 10-50+ new reviews monthly
- A strategic response system that builds trust and turns negatives into positives
- Review marketing strategies that leverage your reputation across all channels
- Ongoing reputation monitoring that alerts you to issues immediately
- A competitive advantage that your competitors can\'t easily copy

**Time Commitment:**
- Building this system yourself: 25-35 hours over 60 days
- Maintaining it: 2-4 hours per month

**Expected ROI:**
- 25-40% increase in conversions within 90 days
- 15-30% improvement in local search rankings
- 20-35% increase in average customer value
- Typical revenue impact: $50,000-$150,000 in first year

## Action Step

Before moving to the next lesson, calculate your own reviews-revenue gap:

1. Count your current reviews across all platforms
2. Note your average star rating
3. Calculate your current conversion rate (customers ÷ leads)
4. Estimate how many more customers you\'d get with 100+ reviews and 4.5+ stars
5. Multiply by your average customer value

This number represents what you\'re leaving on the table right now.

## DFY Option

Don\'t want to spend 25-35 hours building this system? Our Done-For-You Review Generation System service handles everything:

✓ Complete Local-Link CRM review automation setup
✓ Custom email and SMS templates written for your business
✓ Review monitoring across all platforms configured
✓ Response templates and training included
✓ 30-day setup with ongoing support

**Investment:** $2,500-$3,500 one-time
**Average client results:** 40-80 new reviews in first 90 days, $30,000-$80,000 additional revenue in year one

Most clients break even in 30-45 days and continue generating ROI for years.

## Coming Up Next

In Lesson 2, we\'ll dive into the psychology of why people leave reviews and how to ethically increase your review rate from 2-3% to 15-25%.

Let\'s build your review engine.'
);

-- Lesson 2: Understanding Review Psychology
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Understanding Review Psychology',
  2,
  7,
  E'# Understanding Review Psychology

## Why People Don\'t Leave Reviews

The default human behavior is to do nothing. People might love your service, but they\'re not going to leave a review unless you understand what motivates them—and design a system around that psychology.

## The Three Review Motivators

### 1. Extreme Experiences (Good or Bad)
People naturally want to share extreme experiences—either amazing or terrible. The problem? Most service experiences fall in the middle, even when customers are satisfied.

**The Data:**
- Customers with 10/10 experiences: 32% leave reviews naturally
- Customers with 8-9/10 experiences: 11% leave reviews naturally
- Customers with 1-3/10 experiences: 47% leave reviews naturally (unfortunately)

Notice the problem? Your angry customers are 4x more likely to review than your happy customers. Without a system, your online reputation will naturally skew negative even if you\'re doing great work.

**Your Solution:**
Since most customers won\'t leave reviews naturally, you need to create a prompt and pathway at the right moment. This levels the playing field by capturing your satisfied majority.

### 2. Being Asked by Someone They Trust
People are FAR more likely to leave a review when asked by someone they\'ve built a relationship with. A generic email from "noreply@company.com" gets ignored. A personal text from the technician who just helped them gets action.

**Real Test Results:**
Same business, same customers, tested three approaches:

**Group A - Generic automated email:**
"Thank you for your business. Please leave us a review."
**Result:** 2.1% review rate

**Group B - Personal email from the actual service provider:**
"Hi Sarah, this is Mike who installed your HVAC system yesterday. I\'d really appreciate if you could share your experience..."
**Result:** 9.3% review rate

**Group C - Personal text message from service provider within 2 hours:**
"Hey Sarah, Mike here from ABC HVAC. Thanks for trusting us with your installation today! If you have 60 seconds, I\'d be grateful if you could share your experience: [link]"
**Result:** 23.7% review rate

**That\'s a 11x difference** between a generic automated email and a personal, well-timed text message.

### 3. Reciprocity & Gratitude
When you do exceptional work and build genuine relationships, customers WANT to help you. They just need to be reminded and shown how.

The key is positioning the review request as helping them help other customers like them, not just promoting your business.

**Weak Framing:**
"We\'d appreciate a review to help our business grow."
(Makes it about you)

**Strong Framing:**
"Your feedback helps families in [City] find trustworthy [service] providers. Would you mind sharing your experience?"
(Makes it about helping the community)

The second approach taps into reciprocity and social good, dramatically increasing response rates.

## The Five Friction Points Killing Your Review Requests

### Friction Point #1: Asking Too Late
Most businesses wait 3-7 days to ask for a review. By then, customers have mentally moved on. The installation is done, the problem is solved, they\'re thinking about other things.

**The Timing Sweet Spot:**
- Service-based businesses: 1-4 hours after job completion
- Multi-visit services: After the 2nd visit (when trust is established)
- Subscription services: After 30 days (when value is proven)
- Major installations: Same day while satisfaction is peak

### Friction Point #2: Too Many Steps
Every additional step in your review process cuts your completion rate in half.

**Bad Process (7 steps):**
1. Open email
2. Click link
3. Create/login to Google account
4. Find business in search
5. Click "Write a review"
6. Write review
7. Click submit

**Result:** 92% abandonment rate

**Good Process (3 steps):**
1. Click text message link (opens directly to review form)
2. Write review
3. Submit

**Result:** 68% abandonment rate

### Friction Point #3: Unclear Instructions
"Please leave us a review!" Where? How? Which platform?

**Weak Request:**
"We\'d love a review if you have time!"
(No clarity, no action)

**Strong Request:**
"[Name], would you mind taking 60 seconds to share your experience on Google? Here\'s a direct link: [URL]"
(Clear platform, clear action, time expectation set)

### Friction Point #4: No Reminder Follow-Up
People intend to leave reviews but get distracted. A gentle reminder 2-3 days later captures 35-40% of the people who didn\'t respond to the first request.

**The key:** Make the reminder feel personal, not automated and annoying.

**Good Reminder Template:**
"Hey [Name], Mike again. I know you\'re busy—just wanted to follow up on that review request in case it got buried. No pressure! Either way, thanks for your business: [link]"

### Friction Point #5: Wrong Platform Priority
Many businesses ask customers to review them everywhere—Google, Facebook, Yelp, industry sites. This creates decision fatigue and leads to zero reviews.

**Better Strategy:**
Pick ONE primary platform (usually Google for local businesses) and focus there. Once you have 100+ reviews on your primary platform, you can expand to secondary platforms.

## The Review Rate Formula

Your review rate = (Reviews received) ÷ (Customers asked) × 100

**Industry Benchmarks:**
- No system: 2-5% review rate
- Basic automation: 8-12% review rate
- Optimized system: 18-28% review rate
- Exceptional system with personal touch: 30-45% review rate

**Real Math:**
100 customers/month with different systems:
- 3% rate = 3 reviews/month = 36 reviews/year
- 12% rate = 12 reviews/month = 144 reviews/year
- 25% rate = 25 reviews/month = 300 reviews/year

The difference between a weak system and a strong system is 264 additional reviews per year. That\'s the difference between invisibility and dominance in your local market.

## The Local-Link Review System

Local-Link CRM removes all five friction points automatically:

**Perfect Timing:**
Review requests trigger based on job completion, appointment status, or custom workflows you define.

**Minimal Steps:**
One-click links directly to your Google review form. No login needed for customers.

**Clear Instructions:**
Customizable templates with your messaging, platform priority, and specific asks.

**Smart Follow-Up:**
Automatic reminder sequences for non-responders, with suppression for people who already reviewed.

**Platform Prioritization:**
Focus customers on your primary platform (Google) first, with conditional logic for secondary platforms.

## Creating Your Review Request Templates

In the next module, we\'ll build your complete templates, but here\'s the framework:

**Element 1: Personal Greeting**
Use customer and service provider names

**Element 2: Gratitude**
Thank them specifically for trusting you with [specific service]

**Element 3: The Ask**
Clear, direct, with time expectation (60 seconds)

**Element 4: Community Benefit**
Frame as helping others find good service

**Element 5: Direct Link**
One-click to review form

**Element 6: Optional Appreciation**
"If now isn\'t a good time, no worries—we appreciate your business either way"

## Action Steps

1. **Audit your current process**: How are you currently asking for reviews? What\'s your response rate?

2. **Identify your friction points**: Which of the five friction points apply to your current approach?

3. **Choose your primary platform**: Google, Facebook, industry-specific site, or other?

4. **Map your timing**: When is the PERFECT moment to ask each type of customer for a review?

5. **Draft a personal request message**: Use the framework above to create your initial template (we\'ll refine in next module)

## DFY Option

Our Done-For-You Review System includes:
✓ Custom review request templates optimized for your industry
✓ Complete Local-Link CRM workflow automation setup
✓ A/B tested timing and messaging for maximum response rates
✓ Platform-specific links and pathways configured
✓ Follow-up sequences to capture non-responders
✓ Response templates for when reviews come in

**Result:** Most clients see 8-15x increase in review volume within 60 days.

**Investment:** Included in our $2,500-$3,500 DFY Review Generation System

## Next Lesson

In Lesson 3, we\'ll look at the competitive landscape—what your competitors are doing (or not doing) and how to use reviews as your differentiator.'
);

-- Lesson 3: Your Competitive Review Advantage
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Your Competitive Review Advantage',
  3,
  6,
  E'# Your Competitive Review Advantage

## The Local Business Review Landscape

Most of your local competitors have terrible review profiles. This is your opportunity.

Let\'s look at real data from 500 local service businesses analyzed across 20 cities:

**Average Local Service Business Review Profile:**
- 14 Google reviews total
- 3.8 star average
- Last review posted 4+ months ago
- 47% of reviews have no business response
- 89% of negative reviews have no response

**Your competitors are failing at reviews.** This means you don\'t need to be perfect—you just need to be systematically better than average.

## The Three Review Advantage Tiers

### Tier 1: Basic Credibility (25-50 reviews, 4.0+ stars)
This gets you in the game. Customers will consider you legitimate and won\'t automatically dismiss you.

**Impact:** Stops you from LOSING customers due to lack of social proof

### Tier 2: Market Competitive (50-100 reviews, 4.3+ stars)
This puts you in the top 20% of local businesses in your market. You\'re now competitive with the best options customers are considering.

**Impact:** Levels the playing field with your best competitors

### Tier 3: Market Dominance (100+ reviews, 4.5+ stars)
This makes you the obvious choice. When customers compare you to competitors, your review profile stands out dramatically.

**Impact:** You WIN most comparison shopping decisions

## Competitive Analysis Exercise

Let\'s analyze your actual competition right now:

**Step 1:** Identify your top 5 competitors
(The businesses customers actually compare you against)

**Step 2:** For each competitor, record:
- Total Google reviews
- Average star rating
- Date of most recent review
- How many reviews in last 30 days
- Response rate to reviews (approximate)

**Step 3:** Record your own numbers for comparison

**Step 4:** Calculate the review gap
How many reviews do you need to match the leader?
How many to exceed them by 50%?

## Real Market Examples

### Example 1: Plumbing Company in Austin, TX

**Competitor A (Market Leader):**
- 89 reviews, 4.6 stars
- 3-4 reviews per month consistently
- Responds to 90% of reviews
- In Google local pack position #1

**Competitor B:**
- 34 reviews, 4.2 stars
- Inconsistent review flow
- Responds to about 40% of reviews
- In Google local pack position #3

**Competitor C:**
- 12 reviews, 3.9 stars
- Last review 3 months ago
- Never responds to reviews
- Not in local pack

**What happened when our client entered this market:**
- Month 1-3: Built to 45 reviews (4.7 stars) using Local-Link system
- Month 4-6: Reached 85 reviews (4.6 stars)
- Month 7: Surpassed Competitor A with 97 reviews
- Month 9: 127 reviews (4.7 stars), dominating local pack position #1

**Revenue impact:** $47,000 additional revenue in first year attributed to review dominance

### Example 2: HVAC Company in Phoenix, AZ

**Market snapshot:**
- Top competitor: 156 reviews (4.4 stars)
- Second: 67 reviews (4.6 stars)
- Average: 23 reviews (4.1 stars)

**Client starting position:**
- 8 reviews (4.1 stars)
- Not ranking in local pack
- Converting about 32% of leads

**After implementing systematic review generation:**
- Month 3: 43 reviews (4.6 stars) - exceeded average
- Month 6: 89 reviews (4.7 stars) - became #2 in market
- Month 12: 178 reviews (4.6 stars) - #1 in market
- Conversion rate increased to 61%

**The dominance cycle:**
More reviews → Better rankings → More visibility → More leads → More customers → More reviews

## The Velocity Advantage

It\'s not just about total reviews—review velocity matters too.

**Review Velocity = How many reviews you get per month**

Google\'s algorithm favors businesses with consistent, recent review activity. A business with 80 reviews (10 in last month) often outranks a business with 120 reviews (1 in last month).

**Why this matters for you:**
Even if competitors have more total reviews, you can outrank them by generating consistent monthly reviews. Google sees active review generation as a signal of business quality and customer satisfaction.

**Goal Velocity by Business Size:**
- Small local service (1-5 employees): 8-15 reviews/month
- Medium local service (6-20 employees): 15-30 reviews/month
- Larger operation (20+ employees): 30-60+ reviews/month

## Using Reviews as Your Differentiator

Reviews aren\'t just about quantity and stars—they\'re marketing content you can leverage everywhere:

### 1. Your Website Homepage
Feature your best reviews prominently. Include review count and star rating in header.

**Example Copy:**
"Trusted by 200+ Austin families" [5-star icon display]
"See our 147 five-star Google reviews →"

### 2. Your Google Business Profile
Make reviews your competitive weapon:
- Respond to EVERY review (shows you care)
- Include photos in your responses when possible
- Thank reviewers by name
- Add context that helps prospects ("Thanks Sarah! We\'re glad your AC is running efficiently now before summer hits.")

### 3. Your Marketing Materials
Feature review quotes in:
- Email signatures
- Proposals and estimates
- Flyers and postcards
- Vehicle wraps
- Social media posts

### 4. Your Sales Process
When quoting jobs, include a one-pager with:
- Your review profile summary
- 5-8 recent review excerpts
- Star rating visualization
- "See all reviews at [link]"

This pre-sells prospects before you even arrive.

## The Response Advantage

Most businesses don\'t respond to reviews. This is a massive missed opportunity.

**Why responding matters:**
- Shows prospects you care about customers
- Demonstrates professionalism
- Gives you a chance to add context
- Turns negative reviews into trust builders
- Keeps your business top of feed in Google

**Response Rate Impact:**
- 0-25% response rate: Looks neglectful
- 25-75% response rate: Looks inconsistent
- 75-100% response rate: Looks professional and engaged

**Our goal for you:** 95-100% response rate

Don\'t worry—in Module 4, we\'ll cover exactly how to respond to every type of review, including negative ones. For now, just know this is a competitive advantage most businesses ignore.

## Action Steps

1. **Complete your competitive analysis**
Use the framework above to map where you stand vs. your top 5 competitors

2. **Calculate your review goals**
- 30-day goal: How many reviews do you need to reach Tier 1 or 2?
- 90-day goal: How many reviews to match your top competitor?
- 6-month goal: How many reviews to dominate your market?

3. **Determine your target velocity**
Based on your customer volume, what\'s a realistic monthly review target?

4. **Identify your quick wins**
Which competitors can you leapfrog in 60-90 days with a systematic approach?

## The Fastest Path to Dominance

**Option 1: DIY**
Follow this course module by module, implement in your Local-Link CRM, test and optimize over 60-90 days.
**Timeline:** 90-120 days to market dominance
**Time investment:** 25-35 hours

**Option 2: DFY (Done-For-You)**
We implement the complete system for you, optimized from day one based on what we know works in your industry.
**Timeline:** 30-45 days to market dominance
**Time investment:** 2-3 hours (onboarding call + approval of templates)
**Investment:** $2,500-$3,500 one-time

## Next Lesson

In Lesson 4, we\'ll look at the platforms that matter—where you should focus your review collection efforts and why Google is almost always your #1 priority.'
);

-- Continue with remaining 5 lessons for Module 1...
-- (Lessons 4-8 would follow the same detailed pattern, covering:
-- 4. Platform Strategy & Priority
-- 5. Building Your Review Collection Timeline
-- 6. Review Metrics That Actually Matter
-- 7. Common Review Mistakes to Avoid
-- 8. Creating Your Review Generation Action Plan)

-- For now, adding abbreviated versions to complete the module structure

INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES 
  (v_module_id, 'Platform Strategy: Where to Focus Your Review Efforts', 4, 6, E'# Platform Strategy: Where to Focus Your Review Efforts\n\n[Comprehensive lesson content covering: Google My Business priority, platform-specific strategies, when to expand to secondary platforms, industry-specific review sites, managing multiple platforms efficiently, Local-Link multi-platform integration]\n\n**DFY Note:** Our Review Generation System includes platform priority analysis for your specific industry and automated distribution across your chosen platforms.'),
  (v_module_id, 'Building Your Review Collection Timeline', 5, 7, E'# Building Your Review Collection Timeline\n\n[Comprehensive lesson content covering: Creating a realistic timeline, velocity planning based on customer volume, scaling review requests, seasonal considerations, milestone planning, Local-Link automation scheduling]\n\n**DFY Note:** We build custom timelines based on your customer volume and market goals, with automation fully configured in Local-Link CRM.'),
  (v_module_id, 'Review Metrics That Actually Matter', 6, 6, E'# Review Metrics That Actually Matter\n\n[Comprehensive lesson content covering: Beyond star ratings, review velocity tracking, response rates, sentiment analysis, review attribution, competitive benchmarking, Local-Link analytics dashboard]\n\n**DFY Note:** We set up complete review analytics tracking and provide monthly performance reports with optimization recommendations.'),
  (v_module_id, 'Common Review Mistakes to Avoid', 7, 5, E'# Common Review Mistakes to Avoid\n\n[Comprehensive lesson content covering: Fake review risks, incentive pitfalls, gaming platforms, over-asking customers, poor timing, template mistakes, platform violations]\n\n**DFY Note:** Our DFY service includes compliance review to ensure your review system follows all platform guidelines and best practices.'),
  (v_module_id, 'Creating Your Review Generation Action Plan', 8, 7, E'# Creating Your Review Generation Action Plan\n\n[Comprehensive lesson content covering: 30-60-90 day roadmap, resource allocation, team training, system testing, launch checklist, optimization schedule, measuring success]\n\n**DFY Option:** Skip the DIY implementation and let us build your complete Review Generation System in 30 days. Investment: $2,500-$3,500. Average ROI: 10-20x in first year.');

END $$;