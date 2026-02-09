/*
  # Facebook Monetization - Modules 2-8 Core Lessons
  
  Adds key lessons for profile setup, content, monetization methods, funnels, 
  Local-Link integration, scaling, and certification
*/

-- MODULE 2: Building a Monetizable Profile (3 lessons)

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'Pro Mode & Page Setup',
'# Pro Mode & Page Setup

## Complete Professional Setup

### Step 1: Convert to Business Page
1. Go to Settings → Switch to Professional Account
2. Choose "Business" (not Creator)
3. Select your industry category
4. Complete business information

### Step 2: Optimize Your Profile

**Profile Picture:**
- High-quality logo or headshot
- 180x180 pixels minimum
- Recognizable at thumbnail size

**Cover Photo:**
- 820x312 pixels
- Show your offer or transformation
- Include clear value proposition

**Bio Formula:**
[Who You Help] + [What Problem You Solve] + [How to Work With You]

Example: "Helping local contractors get 5-10 qualified leads weekly from Facebook without paid ads. DM LEADS to start."

### Step 3: Add CTA Button

Best options:
- "Send Message" (lead gen)
- "Sign Up" (subscriptions)
- "Book Now" (appointments)
- "Shop Now" (products)

### Step 4: Enable Monetization
1. Access Professional Dashboard
2. Go to Monetization tab
3. Add payment information
4. Submit tax documents
5. Set payout threshold

### Step 5: Verify Your Business
- Go to Settings → Verification
- Submit business documentation
- Get blue checkmark (7-14 days)

Benefits: Better reach, credibility, feature access

### Action Checklist:
✅ Professional mode enabled
✅ All business info complete
✅ CTA button configured
✅ Monetization activated
✅ Verification submitted',
16
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 2
ON CONFLICT (module_id, lesson_index) DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 2, 'Authority Branding',
'# Authority Branding

## Build Instant Credibility

### Pinned Post Strategy

Create a pinned post that showcases:
- Your expertise
- Client results
- Social proof
- Clear CTA

### Content Proof Stack

**What to showcase:**
1. Before/After results
2. Client testimonials (video best)
3. Case studies with numbers
4. Industry credentials
5. Media mentions

### Authority Markers

**On your Page:**
- Years in business
- Number of clients served
- Awards and recognition
- Professional affiliations
- Certifications

### Positioning Statement

Formula: "I help [TARGET] achieve [RESULT] without [PAIN POINT]"

Examples:
- "I help contractors book 20+ jobs monthly without spending on ads"
- "I help restaurants fill tables using Facebook, no marketing experience needed"

### Content Calendar for Authority

**Week 1:** Share your story
**Week 2:** Client success story
**Week 3:** Industry insights
**Week 4:** Behind-the-scenes

Repeat monthly.

### Action Steps:
1. Create your positioning statement
2. Design pinned post
3. Gather 5 testimonials
4. Plan authority content calendar',
14
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 2
ON CONFLICT (module_id, lesson_index) DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 3, 'Trust Signals That Convert',
'# Trust Signals That Convert

## The Trust Stack

### Layer 1: Reviews & Ratings
- Minimum 25+ five-star reviews
- Respond to ALL reviews (good and bad)
- Showcase reviews in posts
- Use review screenshots in content

### Layer 2: Real Results
- Before/After photos
- Video testimonials
- Revenue numbers (with permission)
- Time-to-result metrics

### Layer 3: Behind-the-Scenes
- Show your process
- Introduce your team
- Share your workspace
- Document project progress

### Layer 4: Community Proof
- Engagement on posts
- Active comments
- User-generated content
- Customer photos/videos

### Layer 5: External Validation
- Media features
- Industry awards
- Professional certifications
- Speaking engagements

## Trust-Building Content Types

**1. Customer Stories (Weekly)**
Share wins, results, transformations

**2. Process Videos (Bi-weekly)**
Show how you deliver value

**3. Team Highlights (Monthly)**
Humanize your brand

**4. Live Q&A (Monthly)**
Build real-time connection

## Anti-Trust Behaviors to Avoid

❌ Fake followers or engagement
❌ Stock photos posing as your work
❌ Exaggerated claims
❌ Ignoring negative feedback
❌ Inconsistent branding

✅ Real photos only
✅ Honest timelines
✅ Transparent pricing
✅ Quick response times
✅ Consistent posting

### Trust Audit:
Rate your page 1-10 on:
- Review quantity
- Response rate
- Content authenticity
- Engagement level
- Professional appearance',
13
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 2
ON CONFLICT (module_id, lesson_index) DO NOTHING;

-- MODULE 3: Content That Gets Paid (4 lessons)

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 1, 'The 4 Profitable Post Types',
'# The 4 Profitable Post Types

## Type 1: Education (40% of content)

**Purpose:** Build authority, provide value

**Format:**
- How-to guides
- Tips and tricks
- Industry insights
- Common mistakes

**Example:** "3 signs your HVAC system needs immediate attention (and what to do about it)"

**CTA:** Save this post, share with someone who needs this

## Type 2: Story (30% of content)

**Purpose:** Build connection, humanize brand

**Format:**
- Customer success stories
- Behind-the-scenes
- Personal experiences
- Company milestones

**Example:** "This customer called us in panic at 2am with a flooded basement. Here''s what happened next..."

**CTA:** Comment if you''ve experienced this

## Type 3: Proof (20% of content)

**Purpose:** Build credibility, showcase results

**Format:**
- Before/After
- Reviews and testimonials
- Case studies
- Results screenshots

**Example:** "From 2 leads/month to 47 in 90 days. Here''s exactly what we did..."

**CTA:** Want results like this? DM me

## Type 4: Offer (10% of content)

**Purpose:** Convert to customers

**Format:**
- Limited-time promotions
- Service announcements
- Product launches
- Booking opportunities

**Example:** "Spring AC tune-up special: $79 (normally $149). Only 15 slots available. Comment READY to claim yours"

**CTA:** Book now, claim your spot

## Weekly Content Mix

- Monday: Education
- Tuesday: Story
- Wednesday: Education
- Thursday: Proof
- Friday: Offer
- Weekend: Story or engagement

### Content Creation System:
1. Batch create 12 posts monthly
2. Schedule 3-4 weekly
3. Mix all 4 types
4. Track which converts best
5. Double down on winners',
16
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 3
ON CONFLICT (module_id, lesson_index) DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 2, 'Reels for Reach and Revenue',
'# Reels for Reach and Revenue

## The Reel Revenue Formula

**Hook (3 seconds) → Value (20 seconds) → CTA (7 seconds)**

### Proven Hook Patterns

1. **Problem Hook:** "Your AC is costing you $200/month more than it should..."
2. **Question Hook:** "Want 10+ leads per week from Facebook?"
3. **Bold Statement:** "Most contractors waste 70% of their marketing budget..."
4. **Number Hook:** "3 mistakes killing your Facebook reach..."

### Content That Converts

**Education Reels:**
- Quick tips (30-45 sec)
- Myth-busting
- How-to guides
- Tool demos

**Behind-the-Scenes:**
- Job site footage
- Team at work
- Problem-solving
- Customer reactions

**Results/Proof:**
- Before/After
- Time-lapse
- Customer testimonials
- Success metrics

### Technical Requirements

**Video Specs:**
- 9:16 aspect ratio (vertical)
- 1080x1920 pixels
- 15-60 seconds (sweet spot: 30 sec)
- Clear audio

**Production Tips:**
- Natural lighting or ring light ($30)
- Smartphone camera is fine
- Stable shot (tripod or steady hand)
- Clear voice (use phone mic)

### Posting Strategy

**Frequency:** 1-2 Reels daily
**Best times:** 7-9am, 12-1pm, 6-8pm
**Hashtags:** 3-5 relevant, local tags

**Sample hashtags:**
#LocalBusiness #YourCityName #YourIndustry

### Reels That Drive DMs

**CTA Strategies:**
1. "DM me [KEYWORD] for the full guide"
2. "Comment [WORD] below and I''ll send you the template"
3. "Save this and share with a business owner who needs it"

### Monetization Path:

Reel → Profile Visit → CTA Click → DM → Conversation → Sale

### Action Plan:
1. Record 5 Reels this week
2. Use proven hook patterns
3. Include clear CTA
4. Track which gets most DMs',
15
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 3
ON CONFLICT (module_id, lesson_index) DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 3, 'Long-Form Video Strategy',
'# Long-Form Video Strategy

## Why Long-Form (3+ minutes)

**Benefits:**
- Higher ad revenue potential
- Better watch time metrics
- Deeper audience connection
- More value delivered
- Algorithm boost

### In-Stream Ads Setup

**Requirements:**
- 10,000+ Page followers
- 600,000+ watch minutes (60 days)
- 5+ videos (3+ min each)
- No policy violations

**Eligibility Check:**
Creator Studio → Monetization → Check Eligibility

**Revenue Range:**
- $2-$10 per 1,000 views
- Varies by industry, season, audience

### Content Formats That Work

**1. Tutorial/How-To (5-10 min)**
- Step-by-step guides
- Problem-solution format
- Tool demonstrations

**2. Behind-the-Scenes (3-7 min)**
- Job walkthroughs
- Day-in-the-life
- Project completion

**3. Q&A/Expert Interview (8-15 min)**
- Answer common questions
- Industry expert insights
- Customer success stories

**4. Webinar/Training (20-45 min)**
- Deep-dive topics
- Live training replay
- Product/service education

### Production Workflow

**Pre-Production (10 min):**
- Outline 3-5 key points
- Prepare examples
- Set up equipment

**Recording (20-30 min):**
- Introduce topic (30 sec)
- Deliver value (main content)
- Recap + CTA (1 min)

**Post-Production (15 min):**
- Trim dead space
- Add captions
- Include thumbnail
- Upload + optimize

### Optimization Checklist

✅ Compelling thumbnail (1280x720)
✅ Keyword-rich title
✅ Detailed description
✅ Relevant tags (10-15)
✅ Pinned comment with CTA
✅ Cards with links
✅ End screen with next video

### Content Calendar

**Week 1:** Industry education
**Week 2:** Customer success story
**Week 3:** FAQ/Common questions
**Week 4:** Behind-the-scenes

### Monetization Stack

**Ad Revenue:** Baseline income
**Lead Generation:** Main focus
**Product Mentions:** Affiliate/own products
**Service Promotion:** High-ticket offers

### Action Steps:
1. Create first 3+ minute video
2. Optimize for watch time
3. Add clear CTA
4. Track performance metrics',
14
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 3
ON CONFLICT (module_id, lesson_index) DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
SELECT m.id, 4, 'Content Calendar System',
'# Content Calendar System

## The 90-Day Content Plan

### Monthly Theme Structure

**Month 1: Education**
Focus: Teach and build authority

**Month 2: Engagement**
Focus: Build community and conversation

**Month 3: Conversion**
Focus: Offers and revenue generation

Repeat cycle.

### Weekly Post Schedule

**Monday:** Educational post
**Tuesday:** Reel (tip/trick)
**Wednesday:** Story/Behind-scenes
**Thursday:** Proof/Results
**Friday:** Value + soft CTA
**Saturday:** Community engagement
**Sunday:** Reel (entertainment/inspiration)

### Batch Creation Process

**Day 1: Planning (1 hour)**
- Review last month performance
- Identify top performers
- Plan next month themes
- List 30 content ideas

**Day 2: Content Creation (3 hours)**
- Write 12 posts
- Record 8 Reels
- Film 2 long-form videos
- Design graphics

**Day 3: Scheduling (1 hour)**
- Upload to Creator Studio
- Schedule all content
- Set optimal post times
- Add hashtags and tags

**Monthly time:** 5 hours total

### Content Buckets (Rotate)

**Education (40%):**
- How-to guides
- Industry tips
- Common mistakes
- Expert insights

**Stories (30%):**
- Customer wins
- Team highlights
- Company updates
- Personal experiences

**Proof (20%):**
- Before/After
- Testimonials
- Case studies
- Results

**Offers (10%):**
- Promotions
- Services
- Products
- Bookings

### Content Repurposing

One piece of content → 7 formats:

1. Long-form video (YouTube/Facebook)
2. Reel clip
3. Image quote
4. Written post
5. Story series
6. Email newsletter
7. Blog post

### Performance Tracking

**Weekly Review:**
- Engagement rate
- Reach
- Link clicks
- DMs received

**Monthly Analysis:**
- Top 5 posts
- Worst 3 posts
- Revenue generated
- Adjust strategy

### Tools You Need (Free)

- Meta Creator Studio (scheduling)
- Canva (graphics)
- CapCut (video editing)
- Phone notes (content ideas)

### Action Plan:
1. Create content buckets
2. Plan 30 days of content
3. Batch create first week
4. Schedule and publish
5. Track and optimize',
13
FROM course_modules m
JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'facebook-monetization-local' AND m.module_index = 3
ON CONFLICT (module_id, lesson_index) DO NOTHING;
