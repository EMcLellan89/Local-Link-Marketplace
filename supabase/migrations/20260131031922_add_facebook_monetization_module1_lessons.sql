/*
  # Facebook Monetization - Module 1: The Facebook Money Machine
  
  3 Lessons covering revenue streams, income models, and myth busting
*/

-- Lesson 1.1: How Facebook Actually Pays You
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'How Facebook Actually Pays You',
'# How Facebook Actually Pays You

## The Truth About Facebook Revenue

Facebook offers multiple monetization paths, but not all are equal for local businesses.

### Primary Revenue Streams:

**1. Ad Revenue (In-Stream & Reels)**
- Facebook pays based on ad views in your content
- Requirements: 10K+ followers, 600K+ watch minutes (60 days)
- Reality: $2-$10 per 1,000 views
- Best for: Consistent video creators

**2. Direct Sales (Highest Profit) ⭐**
- Services, consulting, courses, products
- No follower requirements
- Profit margins: 70-95%
- Best for: Local businesses, service providers

**3. Fan Subscriptions (Recurring Income)**
- Monthly payments from loyal fans ($4.99-$29.99/mo)
- Provides exclusive content access
- Requirements: 10K+ followers, engaged community
- Best for: Coaches, experts, thought leaders

**4. Hybrid Model (Recommended)**
- Combine ads + sales + subscriptions
- Diversified income reduces risk
- Maximizes revenue per follower

## Local Business Advantage

Local businesses have a unique edge:
- ✅ Built-in trust in community
- ✅ Existing customer base
- ✅ Immediate monetization potential
- ✅ No need for viral content

### Reality Check:

❌ Myth: "Go viral to make money"
✅ Truth: Targeted local content converts better

❌ Myth: "Need 100K followers"
✅ Truth: 1,000 engaged local followers > 100K random

❌ Myth: "Ads are the only way"
✅ Truth: Direct sales generate 10x more revenue

## Your Monetization Strategy

For local businesses, the winning formula:

**Content → Trust → Conversations → Sales → Retention**

This beats ad-only monetization every time.

### Action Steps:
1. Identify which revenue streams fit your business
2. Calculate your current Facebook follower value
3. Choose your primary monetization model
4. Set your 90-day revenue goal',
15
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 1
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- Lesson 1.2: Choosing Your Income Model
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 2, 'Choosing Your Income Model',
'# Choosing Your Income Model

## The 4 Proven Income Models

### Model 1: Lead Generation
**Best for:** Service businesses, contractors, professionals

**How it works:**
1. Post valuable content
2. Capture leads via comments/DMs
3. Convert to consultations
4. Close to monthly services

**Revenue potential:** $3K-$20K+/month  
**Time to first dollar:** 7-14 days

### Model 2: Consulting/Coaching
**Best for:** Experts, advisors, specialized knowledge

**How it works:**
1. Demonstrate expertise through content
2. Offer free audits or assessments
3. Sell consulting packages
4. Upsell to retainers

**Revenue potential:** $5K-$50K+/month  
**Time to first dollar:** 14-30 days

### Model 3: Subscription/Membership
**Best for:** Ongoing value delivery, community leaders

**How it works:**
1. Build engaged community
2. Offer exclusive access
3. Monthly recurring payment
4. Deliver consistent value

**Revenue potential:** $500-$10K+/month  
**Time to first dollar:** 30-60 days

### Model 4: Hybrid Stack (Recommended) ⭐
**Best for:** Maximum revenue diversification

**How it works:**
1. Combine multiple models
2. Ad revenue as baseline
3. Direct sales for quick wins
4. Subscriptions for predictability

**Revenue potential:** $10K-$100K+/month  
**Time to first dollar:** 7 days

## Decision Framework

### Ask yourself:

**1. What do you sell?**
- Services → Lead Gen
- Expertise → Consulting
- Ongoing value → Subscription
- Multiple → Hybrid

**2. What''s your timeline?**
- Quick income → Lead Gen or Consulting
- Long-term → Subscription
- Both → Hybrid

**3. What''s your capacity?**
- Limited time → High-ticket consulting
- Scalable → Subscription or courses
- Team available → Hybrid

## Income Model Decision Matrix

| Business Type | Model | Timeline | Revenue Range |
|--------------|-------|----------|---------------|
| Plumber, HVAC | Lead Gen | 7-14 days | $5K-$30K/mo |
| Coach, Consultant | Consulting | 14-30 days | $8K-$50K/mo |
| Agency, Marketing | Hybrid | 14-30 days | $10K-$100K/mo |
| Content Creator | Subscription | 30-60 days | $2K-$20K/mo |
| Local Business | Lead Gen + Ads | 7-21 days | $3K-$25K/mo |

### Your Action Plan:
1. Select your primary income model
2. Set your 30-day revenue goal
3. Identify your offer/service
4. Plan your launch sequence',
18
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 1
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- Lesson 1.3: Monetization Myths Busted
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 3, 'Monetization Myths Busted',
'# Monetization Myths Busted

## The Lies Holding You Back

### Myth #1: "I need to go viral"

**The Truth:**
- Viral content rarely converts to sales
- Local engagement beats viral views
- 1,000 targeted followers > 100,000 randoms

**What to do instead:**
- Focus on your local market
- Build genuine relationships
- Create content that solves problems

### Myth #2: "More followers = more money"

**The Truth:**
- Engagement matters more than follower count
- 500 engaged locals can generate $10K/month
- Quality > Quantity every time

**What to do instead:**
- Nurture your existing audience
- Focus on conversation rate
- Build community, not just followers

### Myth #3: "Facebook ads are the only way"

**The Truth:**
- Ad revenue is supplemental income
- Direct sales generate 10x more profit
- Services beat ad revenue for local businesses

**What to do instead:**
- Use content to generate leads
- Close deals via DM
- Ads become bonus income

### Myth #4: "You need expensive equipment"

**The Truth:**
- Smartphone is enough
- Content quality > production quality
- Authenticity beats perfection

**What to do instead:**
- Start with your phone
- Invest in lighting ($30)
- Focus on message, not production

### Myth #5: "Post every day or fail"

**The Truth:**
- Consistency beats frequency
- 3 quality posts/week > 7 mediocre posts
- Strategy matters more than volume

**What to do instead:**
- Post 3-5x per week minimum
- Quality + consistency = results
- Batch create content

### Myth #6: "Organic reach is dead"

**The Truth:**
- Facebook still rewards good content
- Local content gets prioritized
- Community posts reach 30-60% of followers

**What to do instead:**
- Create conversation-starting content
- Engage with your community
- Use Groups + Pages strategically

### Myth #7: "Only certain niches make money"

**The Truth:**
- Every local business can monetize Facebook
- Boring businesses win with consistency
- Service businesses print money

**What to do instead:**
- Focus on your local advantage
- Demonstrate expertise
- Build trust through content

## The Real Success Formula

✅ **What actually works:**

1. Know your monetization model
2. Create consistent valuable content
3. Engage with your local community
4. Capture leads via DMs
5. Close with proven scripts
6. Deliver results
7. Get referrals
8. Scale with systems

### The Truth About Timeline:

- First $1K: 7-30 days (with right strategy)
- First $5K/month: 30-90 days
- First $10K/month: 90-180 days
- $20K+/month: 6-12 months

### Key Takeaways:
- Ignore vanity metrics
- Focus on local engagement
- Monetize through conversations
- Build systems that scale',
12
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 1
ON CONFLICT (module_id, lesson_index) DO NOTHING;
