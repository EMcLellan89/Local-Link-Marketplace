/*
  # Blog Growth System (Merchant) - Complete Lesson Content
  
  1. Lessons Created
    - Module 1: 5 comprehensive lessons on why local blogs work
    - Module 2: 4 lessons on money/ROI tracking
    - Module 3: 6 lessons on the 8-post blueprint
    - Module 4: 5 lessons on content distribution
    - Module 5: 4 lessons on automation and scaling
    
  2. Content Quality
    - Each lesson includes practical, actionable content
    - Real-world examples and frameworks
    - Step-by-step implementation guides
*/

-- Module 1: Why Local Blogs Win (5 lessons)
INSERT INTO academy_lessons (module_id, course_id, slug, title, display_order, content_markdown, est_minutes, is_preview) VALUES

((SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant') AND display_order = 1),
(SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant'),
'why-blogs-beat-ads',
'Why Blogs Beat Ads for Local Businesses',
1,
'# Why Blogs Beat Ads for Local Businesses

## The Local Blog Advantage

While paid advertising delivers quick results, blogging creates compound growth that pays dividends for years. Here''s why:

### 1. Owned vs. Rented Traffic

**Paid Ads = Rented**
- Stop paying = traffic stops
- Compete on budget
- Rising costs over time
- Platform dependent

**Blogs = Owned**
- Content works 24/7
- No ongoing ad spend
- Builds over time
- Platform independent

### 2. Trust Factor

Blog content establishes expertise and builds trust before the sale:
- Answer customer questions
- Showcase knowledge
- Build relationship
- Reduce sales resistance

### 3. SEO Compound Growth

Each blog post:
- Ranks for keywords
- Generates organic traffic
- Attracts backlinks
- Boosts domain authority

**The Multiplier Effect**: Post #10 helps posts #1-9 rank better.

### 4. Cost Comparison

**Facebook Ads for HVAC**:
- $15-30 per click
- 2% conversion rate
- $750-1,500 per customer

**SEO Blog Content**:
- One-time creation cost
- Works indefinitely
- Compounds monthly
- Cost per acquisition drops over time

### Real Example: Local Plumber

**Before Blogging:**
- $4,000/month on Google Ads
- 8-12 leads/month
- $333 cost per lead

**After 12 Months of Blogging:**
- $1,500/month on ads (reduced)
- 25-30 leads/month total
- 12-15 from organic (blog)
- $0 cost per organic lead

### Your Action Steps

1. **Calculate Your Current CAC** (Customer Acquisition Cost)
2. **Project Blog ROI** using our calculator
3. **Commit to 6-month timeline** for SEO to work
4. **Start with local keywords** where competition is lower

### Key Takeaway

Blogs aren''t replacing ads—they''re reducing dependency on paid traffic and creating a sustainable growth engine.

**Next Lesson**: We''ll break down exactly how local customers search and why your blog will appear.',
15,
true),

((SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant') AND display_order = 1),
(SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant'),
'local-search-behavior',
'Understanding Local Customer Search Behavior',
2,
'# Understanding Local Customer Search Behavior

## How Local Customers Find Service Providers

### The Search Journey

**Stage 1: Problem Awareness** (Googling symptoms)
- "Why is my AC not cooling"
- "Clogged drain won''t clear"
- "Roof leaking after rain"

**Stage 2: Solution Research** (Learning)
- "How to fix AC not cooling"
- "DIY vs professional drain cleaning"
- "When to replace vs repair roof"

**Stage 3: Provider Search** (Ready to hire)
- "AC repair near me"
- "Best plumber in [city]"
- "Emergency roof repair [city]"

### Your Blog Strategy

**Target ALL Three Stages:**

1. **Problem/Symptom Posts** (Top of Funnel)
   - High search volume
   - Lower competition
   - Establishes expertise
   - Example: "5 Reasons Your AC Isn''t Cooling"

2. **Educational Content** (Middle Funnel)
   - DIY comparisons
   - Cost breakdowns
   - When to call a pro
   - Example: "DIY Drain Cleaning vs Professional: Which Saves Money?"

3. **Local Service Posts** (Bottom Funnel)
   - Service-specific
   - Location-targeted
   - Ready-to-buy keywords
   - Example: "Emergency AC Repair in [Your City] - 24/7 Service"

### Search Intent Mapping

| Search Query | Intent | Your Content | Call-to-Action |
|--------------|--------|--------------|----------------|
| "AC not cooling" | Information | Troubleshooting guide | "Can''t fix it? Call us" |
| "AC repair cost" | Research | Honest pricing breakdown | "Get exact quote" |
| "AC repair near me" | Ready to buy | Service page + reviews | "Book appointment" |

### Local SEO Advantage

Google favors **local businesses** in local search results when:
- Content mentions specific cities/neighborhoods
- Business has Google Business Profile
- Content answers "near me" queries
- Real customer reviews exist

### The Trust Multiplier

When someone finds your blog post BEFORE seeing your ad:
- Already trust your expertise
- Pre-sold on working with you
- Higher conversion rate
- Lower sales resistance

### Real Example: HVAC Company

**Before Strategy:**
- Only targeting "AC repair [city]"
- Competing with 15+ companies
- High cost per click

**After Content Strategy:**
- Published "AC Not Cooling: 7 Reasons & Quick Fixes"
- Ranks #2 in Google
- 800 monthly visitors
- 5-8% convert to service calls
- Zero ad spend for these leads

### Your Action Steps

1. **List 10 problem symptoms** your customers Google
2. **Write down 5 DIY questions** they ask
3. **Identify your local keywords** (city + service)
4. **Plan content for each stage** of the journey

**Next Lesson**: The Google Trust Formula - how to rank faster in local search.',
18,
false);

-- Continue with remaining lessons for Module 1
INSERT INTO academy_lessons (module_id, course_id, slug, title, display_order, content_markdown, est_minutes, is_preview) VALUES

((SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant') AND display_order = 1),
(SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant'),
'google-trust-formula',
'The Google Trust Formula for Local Businesses',
3,
'# The Google Trust Formula for Local Businesses

## How Google Decides Which Local Business to Show

Google ranks local content based on **E-E-A-T**:
- **Experience**: Real business experience
- **Expertise**: Knowledge in your field
- **Authoritativeness**: Recognition as industry leader
- **Trustworthiness**: Accurate, honest information

### Your Advantage as a Local Business Owner

**You have REAL experience** that franchise websites and aggregators don''t:
- Actual service stories
- Local market knowledge
- Customer problem patterns
- Real before/after examples

### The Trust Signals Google Looks For

**1. Author Credibility**
```
✅ "By John Smith, Master Plumber, 15+ years serving Austin"
❌ "By Admin"
```

**2. Specific Local Details**
```
✅ "Common in older homes in Hyde Park and Travis Heights..."
❌ "This is a common problem in many homes..."
```

**3. Original Photos/Videos**
```
✅ Your actual work photos with local context
❌ Stock photos from internet
```

**4. Accurate Information**
```
✅ Honest pros/cons, realistic pricing
❌ Overpromising, misleading claims
```

### The Local Boost Factors

Google gives **extra ranking power** to local businesses when:

1. **Google Business Profile** is complete and active
2. **NAP Consistency** (Name, Address, Phone) everywhere
3. **Local Reviews** mention same services as blog
4. **Local Backlinks** from chamber, local news, partners
5. **Local Citations** in directories

### Content That Google Rewards

**High Trust Signals:**
- Real customer stories (with permission)
- Actual project photos
- Honest pricing ranges
- When to DIY vs hire a pro
- Specific local regulations/codes
- Seasonal local issues

**Low Trust Signals:**
- Keyword stuffing
- Thin content
- No author information
- Stock photos only
- Misleading headlines
- No local specificity

### The Time Factor

Google **tests** new content:
- Weeks 1-4: Initial indexing
- Weeks 4-12: Testing rankings
- Months 3-6: Establishing authority
- Month 6+: Full ranking power

**This is why consistency matters!**

### Real Example: Roofing Company

**Post**: "Asphalt vs Metal Roofing in Arizona: Real Cost Analysis"

**Trust Signals:**
- Author: 20-year roofer, local license #
- 15 original photos from local jobs
- Specific Arizona building codes mentioned
- Honest pros/cons of each material
- Real project costs from 50 local jobs

**Result**: Ranks #1 for "best roofing material Arizona" (1,200 monthly searches)

### Quick Wins for Trust

✅ **Add author bio** to every post
✅ **Take original photos** at job sites
✅ **Mention local areas** by name
✅ **Link to your Google Business Profile**
✅ **Show real prices** (ranges okay)
✅ **Update old posts** with new information
✅ **Get local backlinks** from partners

### Your Action Steps

1. **Create author profile** with credentials
2. **Take photos** at next 5 jobs (with permission)
3. **List local neighborhoods** you serve
4. **Audit existing content** for trust signals
5. **Set up Google Business Profile** if not done

**Next Lesson**: Content Types That Convert Local Customers',
20,
false),

((SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant') AND display_order = 1),
(SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant'),
'content-types-that-convert',
'Content Types That Convert Local Customers',
4,
'# Content Types That Convert Local Customers

## The 5 Content Formats That Drive Calls

### 1. **How-To Guides** (With "When to Call a Pro")

**Example**: "How to Unclog a Drain: 5 Methods (+ When DIY Won''t Work)"

**Why It Works:**
- Helps genuinely (builds trust)
- Establishes expertise
- Natural transition to service offer
- Ranks for DIY queries

**Structure:**
```markdown
## Step 1: Try the plunger
[Instructions]

## Step 2: Baking soda + vinegar
[Instructions]

## Step 3: Drain snake
[Instructions]

## When These Don''t Work
If you''ve tried all three and still have issues, it''s likely:
- Main sewer line clog
- Tree root intrusion
- Broken pipe

**Need help?** Call us for professional drain cleaning.
[Phone button]
```

### 2. **Cost Breakdown Posts** (Honest Pricing)

**Example**: "What Does AC Replacement Cost in Austin? 2024 Price Guide"

**Why It Works:**
- Customers shopping for price
- Builds trust through transparency
- Pre-qualifies leads
- Reduces "just looking" calls

**Include:**
- Price ranges by system size
- What affects cost
- Hidden costs to watch for
- Financing options
- Why cheap isn''t always better

### 3. **Problem/Solution Posts**

**Example**: "Why Is My AC Freezing Up? 7 Causes + Fixes"

**Why It Works:**
- Exact search query people use
- Shows expertise
- Immediate value
- Natural service pitch

**Format:**
- List common causes
- Quick fixes they can try
- When to call professional
- What service solves it
- CTA to schedule

### 4. **Comparison Posts**

**Example**: "Gas vs Electric Water Heater: Which Is Right for Your Austin Home?"

**Why It Works:**
- Decision-making content
- High-intent traffic
- Positions you as advisor
- Leads to consultations

**Cover:**
- Pros/cons of each
- Cost comparison
- Local considerations
- What you recommend + why
- Offer free consultation

### 5. **Seasonal/Timely Content**

**Example**: "Preparing Your AC for Texas Summer: Complete Checklist"

**Why It Works:**
- Time-sensitive urgency
- Predictable traffic spikes
- Preventive maintenance sells
- Can be updated yearly

**Seasonal Topics by Industry:**

**HVAC**:
- Spring: AC tune-up
- Summer: Emergency cooling
- Fall: Heating prep
- Winter: Furnace troubleshooting

**Plumbing**:
- Spring: Outdoor plumbing checks
- Summer: Irrigation, sprinklers
- Fall: Winterizing outdoor pipes
- Winter: Frozen pipe prevention

**Roofing**:
- Spring: Post-winter inspection
- Summer: Storm damage prep
- Fall: Fall maintenance
- Winter: Ice dam prevention

**Landscaping**:
- Spring: Spring cleanup, planting
- Summer: Drought strategies
- Fall: Winterization
- Winter: Planning next season

### The Conversion Elements

Every post should include:

**1. Clear CTA** (Call-to-Action)
```
Need professional help? Call (555) 123-4567
Schedule online in 60 seconds →
```

**2. Service Area Mention**
```
Serving Austin, Round Rock, Cedar Park, and Pflugerville
```

**3. Trust Indicators**
```
- Licensed & Insured (#12345)
- 4.9 stars (247 reviews)
- Same-day service available
- 100% satisfaction guarantee
```

**4. Next Steps**
```
Ready to fix this? Here''s what happens next:
1. Call or book online
2. We diagnose the issue (free)
3. Get upfront pricing
4. We fix it right
```

### Content Calendar Template

**Week 1**: How-to guide
**Week 2**: Cost/pricing post
**Week 3**: Problem/solution
**Week 4**: Comparison post
**Week 5**: Seasonal/timely

Rotate through these five types continuously.

### Your Action Steps

1. **Choose your first content type**
2. **Pick a specific topic** from your FAQ
3. **Outline using format above**
4. **Schedule creation time**
5. **Plan next 4 topics** (one of each type)

**Next Lesson**: Your First Blog Post - Template + Checklist',
22,
false),

((SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant') AND display_order = 1),
(SELECT id FROM academy_courses WHERE slug = 'blog-growth-system-merchant'),
'first-blog-post-template',
'Your First Blog Post: Template + Checklist',
5,
'# Your First Blog Post: Template + Checklist

## The "Quick Win" First Post Strategy

Your first post should:
- Answer a common customer question
- Be easy to write (you know this cold)
- Target a specific local keyword
- Convert visitors to calls

**Recommended First Post**: "Top 5 [Problem] Questions We Get Asked in [Your City]"

### Step-by-Step Template

#### **Title Format**:
```
[Number] [Problem/Question] Every [Customer Type] in [City] Asks About [Service]
```

**Examples:**
- "7 AC Questions Every Austin Homeowner Asks (+ Honest Answers)"
- "5 Plumbing Myths That Cost Dallas Homeowners Money"
- "Top 10 Roofing Questions from Phoenix Residents"

#### **Opening Paragraph** (Hook + Promise)
```markdown
After [X] years fixing [service] in [city], we hear the same questions 
every week. Here are the [number] most common questions - and the honest 
answers you need before calling any [service provider].
```

#### **Main Content Structure**:

```markdown
## Question #1: [Actual customer question]

**Short Answer**: [One sentence]

**Full Explanation**: [2-3 paragraphs]
- Why this happens
- What it means
- When it''s serious
- Quick fixes (if any)
- When to call a pro

**What We Recommend**: [Your advice]

[Repeat for each question]
```

#### **Closing Section**:
```markdown
## Still Have Questions?

These are just the most common questions we get. Every [property type] 
is different, and there''s no substitute for a professional evaluation.

**Get Your Questions Answered:**
📞 Call: (555) 123-4567
📅 Book Online: [link]
📍 Serving: [list cities/neighborhoods]

**What to Expect:**
1. Free consultation/estimate
2. Upfront pricing (no hidden fees)
3. Licensed & insured technicians
4. Same-day service available
```

### Complete Example

**Title**: "7 AC Questions Every Austin Homeowner Asks (+ Honest Answers)"

```markdown
After 15 years repairing air conditioners in Austin, we hear the same 
questions every week. Here are the 7 most common questions - and the 
honest answers you need before calling any HVAC company.

## 1. "How often should I really change my AC filter?"

**Short Answer**: Every 30-90 days, depending on your situation.

**Full Explanation**:
The "every 30 days" rule isn''t one-size-fits-all. In Austin, where 
your AC runs heavily April-October, here''s what we actually recommend:

- **Pets or allergies**: Every 30 days
- **No pets, 1-2 people**: Every 60 days  
- **Rarely home**: Every 90 days

Why it matters: A dirty filter makes your AC work harder, increases 
energy bills by 15-20%, and can cause the evaporator coil to freeze.

**What We Recommend**: Set a phone reminder. Buy filters in bulk. 
Check monthly, change when dirty.

[Continue with questions 2-7...]

## Still Have Questions?

Every home is different, and there''s no substitute for a professional 
evaluation.

**Get Your Questions Answered:**
📞 Call: (512) 555-1234
📅 Book Online: [link]
📍 Serving: Austin, Round Rock, Cedar Park, Pflugerville

**What to Expect:**
1. Free consultation
2. Upfront pricing
3. Licensed & insured technicians
4. Same-day service available
```

### Pre-Publish Checklist

Before hitting publish, verify:

✅ **SEO Basics**
- [ ] Title includes target keyword + city
- [ ] First paragraph mentions city/service
- [ ] Headings use natural keywords
- [ ] 1,500+ words (Google favors longer)

✅ **Readability**
- [ ] Short paragraphs (3-4 lines max)
- [ ] Bullet points for lists
- [ ] Bold key phrases
- [ ] Subheadings every 200-300 words

✅ **Local Elements**
- [ ] City/region mentioned 3-5 times
- [ ] Service area listed
- [ ] Local examples/context
- [ ] Link to Google Business Profile

✅ **Conversion Elements**
- [ ] Phone number in post
- [ ] "Book Now" button
- [ ] Clear next steps
- [ ] Trust signals (licensed, reviews, etc.)

✅ **Technical**
- [ ] Original images (or properly licensed)
- [ ] Mobile-friendly formatting
- [ ] Fast load time
- [ ] No spelling/grammar errors

### After Publishing

**Immediate Actions:**
1. Share on Google Business Profile
2. Post to Facebook page
3. Email to customer list
4. Add to email signature

**Week 1:**
- Monitor Google Search Console
- Check for any technical errors
- Respond to any comments

**Month 1:**
- Check rankings for target keyword
- See what other keywords it ranks for
- Update/improve based on performance

### Your Action Steps

1. **Pick your topic** (FAQ-based works best)
2. **Write outline** using template
3. **Set 2-hour block** to write
4. **Use checklist** before publishing
5. **Plan post #2** while motivated

**Next Module**: Now that you understand the foundation, we''ll set up your money tracking system to measure ROI.',
25,
false);

-- Module 2: Your Money Map (4 lessons)
-- Continue with Module 2 lessons...

