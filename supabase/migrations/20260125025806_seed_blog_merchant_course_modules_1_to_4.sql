/*
  # Seed Blog Growth System - Merchant Course Modules 1-4
  
  Creates modules and lessons for the first half of the merchant course:
  - Module 1: Why Blogs Still Win for Local Businesses
  - Module 2: Blog Setup (The Right Way)
  - Module 3: What to Write About
  - Module 4: Writing Blogs That Actually Convert
*/

-- Get course ID
DO $$
DECLARE
  v_course_id uuid;
  v_mod1_id uuid;
  v_mod2_id uuid;
  v_mod3_id uuid;
  v_mod4_id uuid;
BEGIN
  -- Get merchant course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'blog-growth-merchant';
  
  -- =====================================================
  -- MODULE 1: Why Blogs Still Win for Local Businesses
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    1,
    'Why Blogs Still Win for Local Businesses',
    'Understand the lasting power of blogging and why it beats social media and ads for long-term growth.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod1_id;
  
  -- Module 1 Lessons
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod1_id, 1, 'Why blogs beat social posts long-term', 
     E'# Why Blogs Beat Social Posts Long-Term\n\nSocial media posts disappear in 24-48 hours. Blog posts compound over time.\n\n## The Compound Effect\n\nA single blog post can:\n- Rank in Google for years\n- Generate traffic 24/7/365\n- Build authority with every visitor\n- Convert readers into customers automatically\n\n## The Math\n\n**Social Post:** 1,000 views in 2 days = done\n**Blog Post:** 50 views/day × 365 days = 18,250 views/year\n\nAfter 1 year, your blog library generates traffic while you sleep.\n\n## Ownership\n\nYou own your blog. You don''t own your social following.\n\n**Action Step:** Calculate how much traffic your business needs monthly. Blogs can deliver this without paying for ads.', 
     12),
    (v_mod1_id, 2, 'How Google actually ranks local businesses',
     E'# How Google Actually Ranks Local Businesses\n\nGoogle wants to show the BEST answer to local searches.\n\n## The 3 Ranking Factors\n\n### 1. Relevance\nDoes your content match what people search for?\n\n### 2. Authority\nDo other sites link to you? Do you publish consistently?\n\n### 3. User Experience\nDo people stay on your site? Do they click your CTAs?\n\n## Local SEO Advantage\n\nBlogs help you rank for:\n- "plumber near me"\n- "best pizza in [city]"\n- "[service] + [location]"\n\n## Google My Business + Blog = Power\n\nCombine your GMB profile with blog content = local domination.\n\n**Action Step:** Search for your top service + your city. See who ranks. Study their blog.',
     15),
    (v_mod1_id, 3, 'Blog vs ads vs social (and how they work together)',
     E'# Blog vs Ads vs Social\n\n## The Truth\n\nYou need all three, but blogs are your foundation.\n\n### Ads\n- ✅ Fast results\n- ❌ Expensive\n- ❌ Stop paying = stop traffic\n\n### Social Media\n- ✅ Build relationships\n- ❌ Algorithm changes kill reach\n- ❌ You don''t own your audience\n\n### Blogs\n- ✅ You own the traffic\n- ✅ Compounds over time\n- ✅ Converts readers into customers\n- ❌ Takes 3-6 months to see results\n\n## The Perfect System\n\n1. Write blog post\n2. Share on social to drive initial traffic\n3. Let Google rank it organically\n4. Retarget blog visitors with ads\n\n**Action Step:** Audit your current marketing. What % is owned vs rented?',
     10),
    (v_mod1_id, 4, 'Real examples: local businesses winning with blogs',
     E'# Real Examples: Local Businesses Winning With Blogs\n\n## Case Study 1: HVAC Company\n\n**Before:** Spending $4,000/month on Google Ads\n**Strategy:** Published 2 blogs/week for 6 months\n**Result:** Cut ad spend by 60%, doubled leads\n\n## Case Study 2: Med Spa\n\n**Before:** No online visibility\n**Strategy:** Published service-based blogs with local keywords\n**Result:** Ranked #1 for "botox [city name]" in 4 months\n\n## Case Study 3: Law Firm\n\n**Before:** Competing with national firms\n**Strategy:** Published legal guides for local residents\n**Result:** 10x organic traffic, 3x qualified leads\n\n## What They All Did\n\n1. Consistent publishing (weekly minimum)\n2. Local keywords in every post\n3. Service-focused content\n4. Strong calls-to-action\n\n**Action Step:** Choose one case study similar to your business. Model their approach.',
     14)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 2: Blog Setup (The Right Way)
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    2,
    'Blog Setup (The Right Way)',
    'Set up your blog foundation correctly to maximize SEO and conversions from day one.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod2_id;
  
  -- Module 2 Lessons
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod2_id, 1, 'Where your blog should live',
     E'# Where Your Blog Should Live\n\n## The Right Answer: On Your Main Domain\n\nYour blog should live at:\n- yoursite.com/blog\n- NOT blog.yoursite.com (subdomain)\n- NOT medium.com/yourname\n\n## Why?\n\nAll SEO benefits flow to your main domain.\n\n## Platform Choices\n\n### WordPress (Best)\n- Full control\n- SEO plugins\n- Easy to manage\n\n### Wix/Squarespace\n- Good enough\n- Less flexible\n\n### Custom Sites\n- Works if you have a developer\n\n## Local-Link Integration\n\nYou can publish blogs through Local-Link marketplace and sync to your site.\n\n**Action Step:** Confirm your blog lives on your main domain at /blog.',
     10),
    (v_mod2_id, 2, 'Blog structure for local SEO',
     E'# Blog Structure for Local SEO\n\n## The Perfect Blog Architecture\n\n### Homepage\n↓\n### Blog Index (/blog)\n↓\n### Categories\n- Services (/blog/plumbing-tips)\n- Locations (/blog/seattle-plumbing)\n- Authority (/blog/homeowner-guides)\n\n## URL Structure\n\nGood: yoursite.com/blog/how-to-fix-leaky-faucet\nBad: yoursite.com/p=12345\n\n## Internal Linking\n\nEvery blog should link to:\n- Related service pages\n- Other relevant blogs\n- Your contact page\n\n## Mobile-First\n\n70% of local searches happen on mobile. Your blog must be mobile-friendly.\n\n**Action Step:** Draw your blog structure on paper before building.',
     12),
    (v_mod2_id, 3, 'Categories that convert',
     E'# Categories That Convert (Services, Location, Authority)\n\n## The 3 Category Types\n\n### 1. Service Categories\nDirect tie to what you sell.\n\nExamples:\n- "Emergency Plumbing"\n- "Kitchen Remodeling"\n- "Botox & Fillers"\n\n**Purpose:** Catch ready-to-buy searchers\n\n### 2. Location Categories\nTarget your service areas.\n\nExamples:\n- "Seattle Plumbing"\n- "Downtown Dental"\n- "Westside HVAC"\n\n**Purpose:** Dominate local search\n\n### 3. Authority Categories\nEducate and build trust.\n\nExamples:\n- "Homeowner Tips"\n- "Small Business Advice"\n- "Health & Wellness"\n\n**Purpose:** Attract top-of-funnel traffic\n\n## How to Choose\n\nStart with:\n- 2 service categories\n- 1 location category\n- 1 authority category\n\n**Action Step:** List your 4 starting categories.',
     15),
    (v_mod2_id, 4, 'Basic tech setup (no coding)',
     E'# Basic Tech Setup (No Coding Required)\n\n## Step-by-Step Setup\n\n### 1. Install Your Platform\n- WordPress: Use Bluehost 1-click install\n- Wix/Squarespace: Add blog module\n\n### 2. Install SEO Plugin\n- Yoast SEO (WordPress)\n- Built-in SEO tools (Wix/Squarespace)\n\n### 3. Create Your Categories\nAdd the 4 categories from previous lesson\n\n### 4. Design Your Blog Index\n- Show 10 posts per page\n- Include featured image\n- Show excerpt (150 words)\n- Add category label\n\n### 5. Set Up Comments (Optional)\n- Use native comments OR\n- Disable and focus on contact forms\n\n### 6. Add Social Sharing\nMake it easy to share your posts\n\n### 7. Connect Google Analytics\nTrack traffic from day 1\n\n## Common Mistakes\n\n❌ Complicated designs\n❌ Too many plugins\n❌ Forgetting mobile view\n\n**Action Step:** Complete setup checklist. Your blog should be live (even if empty).',
     18)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 3: What to Write About
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    3,
    'What to Write About (Never Run Out of Ideas)',
    'Master the art of finding blog topics that rank and convert. Build a 12-month content calendar.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod3_id;
  
  -- Module 3 Lessons
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod3_id, 1, 'Service-based blog topics that rank',
     E'# Service-Based Blog Topics That Rank\n\n## The Formula\n\n**[Service] + [Problem/Question] + [Location]**\n\nExamples:\n- "How to Fix Low Water Pressure in Seattle Homes"\n- "Best Time to Schedule AC Maintenance in Phoenix"\n- "Emergency Plumbing Services in Downtown LA"\n\n## Topic Types\n\n### How-To Guides\n"How to [solve problem] without [negative outcome]"\n\n### Comparison Posts\n"[Option A] vs [Option B]: Which is Right for You?"\n\n### Service Explainers\n"What is [service]? Everything You Need to Know"\n\n### Cost Guides\n"How Much Does [service] Cost in [location]?"\n\n## Finding Keywords\n\nUse:\n- Google Autocomplete\n- "People Also Ask" boxes\n- Customer questions\n\n**Action Step:** List 10 service-based topics for your business.',
     16),
    (v_mod3_id, 2, 'Location-based posts that dominate Google',
     E'# Location-Based Posts That Dominate Google\n\n## Why Location Content Wins\n\nGoogle prioritizes local results for local searches.\n\n## Location Content Types\n\n### Neighborhood Guides\n"Best [Service] in [Neighborhood]"\n\n### City-Wide Resources\n"Complete Guide to [Service] in [City]"\n\n### Area-Specific Tips\n"Common [Problem] in [Area] and How to Fix Them"\n\n## The Local Multiplier\n\nOne blog × 10 locations = 10 ranking opportunities\n\nExample:\n- "Emergency Plumbing in Ballard"\n- "Emergency Plumbing in Capitol Hill"\n- "Emergency Plumbing in Queen Anne"\n\n## Don''t Duplicate\n\nCustomize each post with:\n- Local landmarks\n- Area-specific problems\n- Neighborhood photos\n\n**Action Step:** List your 5-10 service areas. Plan one blog per location.',
     14),
    (v_mod3_id, 3, 'FAQ blogs that turn into leads',
     E'# FAQ Blogs That Turn Into Leads\n\n## Your Goldmine: Customer Questions\n\nEvery question you answer = content idea.\n\n## Where to Find Questions\n\n1. Your email inbox\n2. Phone calls you receive\n3. Google "People Also Ask"\n4. Forums (Reddit, Quora)\n5. Competitor comment sections\n\n## FAQ Blog Formula\n\n**Title:** Common question customers ask\n**Intro:** Validate their concern\n**Answer:** Detailed solution\n**CTA:** "Need help? Contact us."\n\n## Examples\n\n- "Why is My AC Blowing Warm Air?"\n- "How Long Does a Kitchen Remodel Take?"\n- "When Should I Replace My Water Heater?"\n\n## Volume Play\n\nPublish 1 FAQ blog per week = 52 ranking pages per year.\n\n**Action Step:** Write down 20 questions customers ask you. Each is a blog post.',
     12),
    (v_mod3_id, 4, 'Authority blogs that build trust',
     E'# Authority Blogs That Build Trust\n\n## Purpose\n\nAttract people not yet ready to buy.\n\n## Authority Content Types\n\n### Industry Insights\n"The Future of [Your Industry] in [Year]"\n\n### Behind-the-Scenes\n"A Day in the Life of a [Your Profession]"\n\n### Educational Series\n"Everything You Need to Know About [Topic]"\n\n### Myth-Busting\n"5 Common Myths About [Service] Debunked"\n\n## Why Authority Content Matters\n\n- Builds brand recognition\n- Positions you as expert\n- Attracts backlinks\n- Long-term traffic\n\n## The 80/20 Rule\n\n80% Service + Location content\n20% Authority content\n\n## Examples\n\n**HVAC:** "How to Read Your Energy Bill"\n**Legal:** "Understanding Your Rights as a Tenant"\n**Medical:** "What to Expect at Your First Visit"\n\n**Action Step:** Plan 1 authority post per month for next 6 months.',
     13)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 4: Writing Blogs That Actually Convert
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    4,
    'Writing Blogs That Actually Convert',
    'Learn the exact structure and techniques to write blogs that rank in Google and turn readers into customers.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod4_id;
  
  -- Module 4 Lessons
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod4_id, 1, 'Headlines that get clicked',
     E'# Headlines That Get Clicked\n\n## The 80/20 Rule of Blogging\n\n80% of success = headline\n20% of success = everything else\n\n## Proven Headline Formulas\n\n### How-To Headlines\n"How to [Achieve Desire] Without [Pain Point]"\n\nExample: "How to Fix Your AC Without Calling a Professional"\n\n### List Headlines\n"[Number] Ways to [Solve Problem]"\n\nExample: "7 Ways to Lower Your Energy Bill This Summer"\n\n### Question Headlines\n"Why Does [Problem Happen]?"\n\nExample: "Why Does My Toilet Keep Running?"\n\n### Ultimate Guide Headlines\n"The Complete Guide to [Topic]"\n\nExample: "The Complete Guide to Kitchen Remodeling in Seattle"\n\n## Headlines to Avoid\n\n❌ Clickbait ("You Won''t Believe...")\n❌ Vague ("Some Thoughts on Plumbing")\n❌ Too clever ("H2-Whoa! Water Problems")\n\n**Action Step:** Write 5 headlines for each formula.',
     10),
    (v_mod4_id, 2, 'Crafting introductions that hook readers',
     E'# Crafting Introductions That Hook Readers\n\n## Your First 3 Sentences Decide Everything\n\nIf intro fails = reader leaves.\n\n## The Hook Formula\n\n**Sentence 1:** Identify their problem\n**Sentence 2:** Show you understand\n**Sentence 3:** Promise a solution\n\n## Example\n\n**Bad Intro:**\n"Plumbing is important for every home. In this post, we''ll talk about common issues."\n\n**Good Intro:**\n"It''s 11 PM and your basement is flooding. You need help NOW, not tomorrow. Here''s exactly what to do in the next 10 minutes to minimize damage."\n\n## Intro Checklist\n\n✅ Addresses reader''s pain point\n✅ Creates urgency or curiosity\n✅ Previews what they''ll learn\n✅ Under 100 words\n\n**Action Step:** Rewrite 3 of your old blog intros using this formula.',
     8),
    (v_mod4_id, 3, 'Structuring body content that builds trust',
     E'# Structuring Body Content That Builds Trust\n\n## The Perfect Blog Structure\n\n### 1. Introduction (100 words)\nHook + promise\n\n### 2. Body (800-1500 words)\nDeliver on promise\n\n### 3. Conclusion (100 words)\nSummarize + CTA\n\n## Body Content Rules\n\n### Use Subheadings Every 150-200 Words\nMakes it scannable.\n\n### Include Lists and Bullets\nEasier to read.\n\n### Add Examples\nMakes concepts concrete.\n\n### Use Short Paragraphs\n2-3 sentences maximum.\n\n### Include Images\nBreaks up text, improves engagement.\n\n## The Trust Stack\n\n1. Identify problem\n2. Explain why it happens\n3. Share solution\n4. Prove it works (case study/stat)\n5. Address objections\n6. Next steps\n\n**Action Step:** Outline your next blog using this structure.',
     14),
    (v_mod4_id, 4, 'Writing CTAs that convert without sounding salesy',
     E'# Writing CTAs That Convert Without Sounding Salesy\n\n## The CTA Formula\n\n**Problem + Solution + Easy Action**\n\n## Good vs Bad CTAs\n\n❌ Bad: "Contact us for a quote"\n✅ Good: "Still dealing with low water pressure? Get a free diagnostic check today."\n\n❌ Bad: "Schedule now"\n✅ Good: "Let us handle it. Book your free consultation in 60 seconds."\n\n## Where to Place CTAs\n\n1. **After intro** - For ready-to-buy readers\n2. **Middle of post** - Contextual CTA\n3. **End of post** - Primary CTA\n\n## Types of CTAs\n\n### Soft CTA\n"Download our free checklist"\n\n### Medium CTA\n"Schedule a free consultation"\n\n### Hard CTA\n"Book your service today"\n\n## The "Next Step" Framework\n\n"If [condition], [do this]"\n\nExample:\n"If you''re experiencing any of these symptoms, call us today for a free inspection."\n\n**Action Step:** Write 3 different CTAs for your most popular service.',
     11)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
    
END $$;
