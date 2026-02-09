/*
  # Seed Blog Growth System - Merchant Course Modules 5-8
  
  Creates modules and lessons for the second half of the merchant course:
  - Module 5: AI + Blogging (Do in Minutes, Not Hours)
  - Module 6: Distributing Blogs for Maximum Reach
  - Module 7: Tracking Results & Scaling
  - Module 8: Done-For-You Options (Local-Link Upsell)
*/

-- Get course ID and create modules
DO $$
DECLARE
  v_course_id uuid;
  v_mod5_id uuid;
  v_mod6_id uuid;
  v_mod7_id uuid;
  v_mod8_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'blog-growth-merchant';
  
  -- =====================================================
  -- MODULE 5: AI + Blogging
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    5,
    'AI + Blogging (Do in Minutes, Not Hours)',
    'Use AI safely and effectively to write blogs 10x faster without sacrificing quality or SEO.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod5_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod5_id, 1, 'Using AI safely without hurting SEO',
     E'# Using AI Safely Without Hurting SEO\n\n## The Truth About AI Content\n\nGoogle doesn''t penalize AI content. It penalizes LOW-QUALITY content.\n\n## AI Can Help You:\n- Write first drafts faster\n- Generate outlines\n- Create headlines\n- Research topics\n\n## AI Cannot Replace:\n- Your expertise\n- Local knowledge\n- Real examples\n- Your voice\n\n## The Safe AI Method\n\n1. Use AI for structure\n2. Add YOUR expertise\n3. Include local details\n4. Edit for your voice\n5. Add real examples\n\n## What Google Wants\n\n✅ Helpful content\n✅ Original insights\n✅ Clear answers\n✅ Good user experience\n\n❌ Generic fluff\n❌ Keyword stuffing\n❌ Copied content\n\n**Action Step:** Choose one blog idea. We''ll write it with AI in the next lessons.',
     12),
    (v_mod5_id, 2, 'Prompt formulas for local blogs',
     E'# Prompt Formulas for Local Blogs\n\n## The Master Prompt Template\n\n```\nWrite a [word count] blog post for a [your business type] \nin [your city]. Title: "[your title]"\n\nInclud:\n- Introduction addressing [specific pain point]\n- [Number] main points\n- Local context for [your area]\n- Call-to-action for [your service]\n\nTone: [Professional/Friendly/Educational]\nAudience: [Your customer avatar]\n```\n\n## Example Prompts\n\n### Service Blog\n"Write a 1000-word blog for a Seattle plumber titled \'5 Signs You Need Emergency Plumbing Services\'. Include local context about older Seattle homes and rainy weather. Tone: Helpful and professional."\n\n### Location Blog\n"Write a 800-word guide for a Phoenix HVAC company titled \'Best Time to Service Your AC in Phoenix\'. Address extreme heat concerns. Include CTA to schedule maintenance."\n\n### FAQ Blog\n"Write a 600-word answer to \'Why is my water heater making noise?\' for a residential plumbing company. Explain causes, solutions, and when to call a pro."\n\n**Action Step:** Write 3 prompts for your business using this template.',
     10),
    (v_mod5_id, 3, 'Editing AI content to sound human',
     E'# Editing AI Content to Sound Human\n\n## The 5-Minute Edit\n\n### 1. Add Your Voice\nReplace generic phrases with how YOU would say it.\n\n### 2. Insert Local Details\n- Neighborhood names\n- Local landmarks\n- Area-specific problems\n- Regional climate/conditions\n\n### 3. Include Real Examples\nReplace made-up scenarios with actual customer stories.\n\n### 4. Remove AI Tells\n\nDelete these phrases:\n- "It''s important to note..."\n- "In today''s world..."\n- "In conclusion..."\n- "At the end of the day..."\n\n### 5. Add Personality\n- Use contractions (it''s, don''t, you''re)\n- Ask questions\n- Break the fourth wall\n- Use humor (if appropriate)\n\n## Before vs After\n\n**AI Version:**\n"It is important to note that regular maintenance is essential."\n\n**Human Version:**\n"Here''s the deal: skip maintenance = expensive repairs later."\n\n**Action Step:** Edit the AI draft from previous lesson.',
     9),
    (v_mod5_id, 4, 'Publishing faster than competitors',
     E'# Publishing Faster Than Competitors\n\n## The Speed Advantage\n\nMost local businesses publish 1-2 blogs per YEAR.\n\nYou''ll publish 1-2 blogs per WEEK.\n\n## The 30-Minute Blog System\n\n**Minutes 0-10:** Generate AI draft\n**Minutes 10-20:** Edit and add local details\n**Minutes 20-25:** Add images and formatting\n**Minutes 25-30:** Publish and share\n\n## Batch Creation\n\nWrite 4 blogs in one sitting:\n- Monday: Generate 4 AI drafts\n- Tuesday: Edit all 4\n- Wednesday: Format and publish\n\n## Quality > Quantity (But Speed Matters)\n\n- 4 good blogs per month > 1 perfect blog\n- Consistency beats perfection\n- You can always update posts later\n\n## Tools to Speed Up\n\n- AI for drafts (ChatGPT, Claude)\n- Grammarly for editing\n- Canva for images\n- WordPress for publishing\n\n**Action Step:** Commit to publishing schedule. Start with 2/month, scale to 1/week.',
     11)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 6: Distributing Blogs for Maximum Reach
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    6,
    'Distributing Blogs for Maximum Reach',
    'Get more eyes on every blog post. Learn distribution strategies that multiply your traffic.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod6_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod6_id, 1, 'Where to share blog posts',
     E'# Where to Share Blog Posts\n\n## The 1-Hour Distribution Plan\n\nEvery blog = 1 hour of distribution.\n\n## Social Media\n\n### Facebook\n- Share in business page\n- Share in local community groups\n- Post in relevant industry groups\n\n### LinkedIn\n- Share on company page\n- Share on personal profile\n- Tag relevant connections\n\n### Instagram\n- Story with link sticker\n- Carousel post with key points\n- Link in bio\n\n### Twitter/X\n- Thread the key points\n- Tag industry influencers\n- Use relevant hashtags\n\n## Email List\nSend to customers and prospects.\n\n## Google My Business\nPost as GMB update (great for local SEO).\n\n## Local Directories\nShare in your Yelp/Nextdoor profiles.\n\n**Action Step:** Create distribution checklist for every blog.',
     13),
    (v_mod6_id, 2, 'Turning one blog into multiple posts',
     E'# Turning One Blog Into Multiple Posts\n\n## The Content Multiplication Strategy\n\nOne blog = 10+ pieces of content.\n\n## From Blog to Social\n\n### From 1 Blog, Create:\n\n1. **Twitter Thread** (8-10 tweets)\n2. **LinkedIn Post** (key insight)\n3. **Instagram Carousel** (5-7 slides)\n4. **Facebook Post** (with question)\n5. **Instagram Story** (3-5 frames)\n6. **Email Newsletter** (excerpt + link)\n7. **YouTube Short** (60 seconds)\n8. **TikTok** (if relevant)\n9. **GMB Post** (150 words)\n10. **Quote Graphics** (3-5 images)\n\n## Repurposing Tools\n\n- Canva (graphics)\n- Descript (video captions)\n- Buffer/Hootsuite (scheduling)\n\n## The 80/20 Rule\n\n20% of content = 80% of engagement.\n\nIdentify your top performers and multiply them.\n\n**Action Step:** Take your best blog. Create 5 social posts from it today.',
     11),
    (v_mod6_id, 3, 'Email + social distribution',
     E'# Email + Social Distribution\n\n## Email Strategy\n\n### When to Send\nSend blog emails:\n- Tuesday-Thursday\n- 9 AM or 2 PM\n- NOT weekends\n\n### Email Structure\n\n**Subject:** Question or benefit\n**Preview:** Hook them\n**Body:** 3-4 sentences + link\n**CTA:** "Read the full guide"\n\n### Example\n\n**Subject:** "Your AC might fail this summer"\n\n**Body:**\nLast summer, 40% of our emergency calls were preventable.\n\nMost breakdowns happen because of one simple oversight.\n\nI wrote a quick guide showing exactly what to check before summer hits.\n\n[Read the 5-minute guide →]\n\n## Social Strategy\n\n### Best Posting Times\n- Facebook: 1-3 PM\n- LinkedIn: 8 AM or 5 PM\n- Instagram: 11 AM or 7 PM\n\n### Engagement Tactics\n- Ask questions in captions\n- Respond to every comment\n- Tag relevant accounts\n\n**Action Step:** Schedule next blog email. Plan 3 social posts.',
     10),
    (v_mod6_id, 4, 'Local backlinks & directory mentions',
     E'# Local Backlinks & Directory Mentions\n\n## What Are Backlinks?\n\nWhen other websites link to yours = backlink.\n\nBacklinks = ranking power.\n\n## Local Backlink Sources\n\n### Chamber of Commerce\nMost have member directories.\n\n### Local News\nPitch your expertise for quotes.\n\n### Industry Associations\nGet listed in directories.\n\n### Local Bloggers\nOffer to guest post or collaborate.\n\n### Sponsor Local Events\nGet website mentions.\n\n## The Outreach Email\n\n```\nSubject: Quick question about [their content]\n\nHi [Name],\n\nI came across your article on [topic] and loved [specific detail].\n\nI recently published a comprehensive guide on [related topic] that your readers might find helpful: [link]\n\nThought it might be worth mentioning if you ever update the piece.\n\nEither way, keep up the great work!\n\n[Your name]\n```\n\n## Directory Listings\n\nGet listed on:\n- Yelp\n- Nextdoor\n- Local.com\n- Yellow Pages\n- Industry-specific directories\n\n**Action Step:** Get 3 local backlinks this month.',
     12)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 7: Tracking Results & Scaling
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    7,
    'Tracking Results & Scaling',
    'Measure what matters, optimize what works, and scale your blog into a lead-generating machine.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod7_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod7_id, 1, 'What metrics matter',
     E'# What Metrics Matter\n\n## The 5 Metrics That Matter\n\n### 1. Organic Traffic\nHow many people find you through Google?\n\n**Goal:** 10% monthly growth\n\n### 2. Time on Page\nAre people reading or bouncing?\n\n**Goal:** 2+ minutes average\n\n### 3. Conversion Rate\nHow many readers take action?\n\n**Goal:** 2-5% (contact forms, calls, etc.)\n\n### 4. Rankings\nWhat position are you for target keywords?\n\n**Goal:** Page 1 (top 10) within 6 months\n\n### 5. Leads Generated\nHow many quality inquiries?\n\n**Goal:** 10+ per month from blog\n\n## Metrics That DON''T Matter\n\n❌ Page views (vanity metric)\n❌ Social shares (nice but not revenue)\n❌ Time to write (speed up over time)\n\n## Where to Track\n\n- Google Analytics (traffic, behavior)\n- Google Search Console (rankings)\n- Your CRM (leads, revenue)\n\n**Action Step:** Set up tracking today. Record baseline numbers.',
     14),
    (v_mod7_id, 2, 'How long before blogs pay off',
     E'# How Long Before Blogs Pay Off\n\n## The Realistic Timeline\n\n### Month 1-3: The Desert\n- Low traffic\n- Few rankings\n- Minimal leads\n\n**What to do:** Keep publishing. Trust the process.\n\n### Month 4-6: The Momentum\n- Traffic starts climbing\n- Some posts hit page 1\n- First blog-generated leads\n\n**What to do:** Double down on what''s working.\n\n### Month 7-12: The Payoff\n- Consistent organic traffic\n- Multiple ranking posts\n- Steady lead flow\n\n**What to do:** Scale and optimize.\n\n### Year 2+: The Compound\n- Blog becomes #1 lead source\n- Old posts still generate traffic\n- Reduced marketing costs\n\n## Why Most Businesses Quit\n\nThey stop at month 2.\n\n## The 90-Day Rule\n\nCommit to 90 days minimum.\nPublish 2/week = 24 posts.\nThat''s enough to see results.\n\n**Action Step:** Mark your calendar 90 days out. Commit.',
     10),
    (v_mod7_id, 3, 'When to outsource vs DIY',
     E'# When to Outsource vs DIY\n\n## DIY Makes Sense When:\n\n✅ You''re just starting\n✅ Budget is tight\n✅ You have 2-3 hours per week\n✅ You enjoy writing\n\n## Outsource Makes Sense When:\n\n✅ Blog is generating revenue\n✅ Your time is worth $100+/hour\n✅ You want to scale to 2+ posts/week\n✅ You hate writing\n\n## The Hybrid Approach\n\nYou: Strategy, editing, approval\nThem: Research, drafting, formatting\n\n## What to Outsource First\n\n1. **Research** ($25-50/post)\n2. **First draft** ($50-150/post)\n3. **Editing** ($25-75/post)\n4. **Graphics** ($10-30/post)\n5. **Full service** ($150-300/post)\n\n## Red Flags\n\n❌ Offshore content mills\n❌ No local knowledge\n❌ Can''t provide samples\n❌ Too cheap (under $50/post)\n\n## Where to Find Writers\n\nLocal-Link marketplace connects you with certified blog partners.\n\n**Action Step:** Calculate your hourly rate. Is DIY worth it?',
     13),
    (v_mod7_id, 4, 'Scaling content through Local-Link services',
     E'# Scaling Content Through Local-Link Services\n\n## How Local-Link Helps You Scale\n\n### Certified Blog Partners\nVetted writers trained in local SEO.\n\n### Fixed Pricing\nKnow exactly what you''ll pay.\n\n### Quality Guarantee\nRevisions included.\n\n### Fast Turnaround\n3-5 days per post.\n\n## Service Packages\n\n### Starter Package\n- 2 blogs/month\n- $300/month\n- Research + writing + editing\n\n### Growth Package\n- 4 blogs/month\n- $500/month\n- Everything in Starter\n- Graphics included\n\n### Scale Package\n- 8 blogs/month\n- $900/month\n- Everything in Growth\n- Distribution support\n\n## How It Works\n\n1. Complete this course\n2. Post a job in marketplace\n3. Review partner proposals\n4. Choose your writer\n5. Approve content calendar\n6. Receive drafts for approval\n7. Publish and track results\n\n## ROI Calculation\n\nIf blog generates 10 leads/month\nAnd you close 20% = 2 customers\nAt $500 profit each = $1,000\n\nYour $500 investment = 100% ROI\n\n**Action Step:** If ready to scale, post your first job listing.',
     15)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
  
  -- =====================================================
  -- MODULE 8: Done-For-You Options (Local-Link Upsell)
  -- =====================================================
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id,
    8,
    'Done-For-You Options (Local-Link Upsell)',
    'Let Local-Link certified partners handle everything. Focus on running your business while we handle your blog.'
  )
  ON CONFLICT (course_id, module_index) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description
  RETURNING id INTO v_mod8_id;
  
  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes)
  VALUES
    (v_mod8_id, 1, 'When outsourcing makes sense',
     E'# When Outsourcing Makes Sense\n\n## The Break-Even Point\n\nIf your time is worth $75+/hour, outsourcing wins.\n\n## 4 Signs You''re Ready\n\n### 1. You''re Too Busy\nBlog keeps getting pushed to "next week."\n\n### 2. You Hate Writing\nForcing yourself = low quality.\n\n### 3. Blog Is Working\nYou''re seeing results and want more.\n\n### 4. Time to Scale\nNeed 4-8 posts/month to compete.\n\n## DIY vs Outsource: Real Math\n\n**DIY:**\n- 3 hours/post × 4 posts = 12 hours\n- At $100/hour = $1,200 opportunity cost\n\n**Outsource:**\n- $500/month for 4 posts\n- 2 hours/month for editing\n- Saves 10 hours\n\n## What You Still Control\n\n✅ Strategy\n✅ Topics\n✅ Brand voice\n✅ Final approval\n\n**Action Step:** Calculate your true hourly rate. Run the math.',
     11),
    (v_mod8_id, 2, 'How to post a blog job in Local-Link',
     E'# How to Post a Blog Job in Local-Link\n\n## Step-by-Step Job Posting\n\n### 1. Log Into Marketplace\nGo to your merchant dashboard.\n\n### 2. Click "Post a Job"\nSelect "Content Services" → "Blog Writing"\n\n### 3. Fill Out Job Details\n\n**Title:**\n"Need 4 SEO Blogs/Month for [Your Business Type] in [City]"\n\n**Description:**\nInclude:\n- Your business type\n- Target audience\n- Topics you want covered\n- Tone/voice preferences\n- Turnaround time needed\n\n**Budget:**\n- Per post: $75-150\n- Monthly package: $300-900\n\n**Requirements:**\n- Local-Link certification required\n- Portfolio samples\n- Must understand local SEO\n\n### 4. Review Proposals\nPartners apply with:\n- Their background\n- Writing samples\n- Proposed timeline\n- Pricing\n\n### 5. Interview Top 3\nAsk about:\n- Experience in your industry\n- Understanding of local SEO\n- Revision policy\n- Communication style\n\n**Action Step:** Draft your job posting now.',
     13),
    (v_mod8_id, 3, 'Hiring partners to write/manage blogs',
     E'# Hiring Partners to Write/Manage Blogs\n\n## What to Look For\n\n### Must-Haves\n✅ Local-Link certification\n✅ Portfolio with local business samples\n✅ Understanding of your industry\n✅ Clear communication\n✅ Reasonable pricing\n\n### Red Flags\n❌ No samples\n❌ Prices too low (under $50/post)\n❌ Generic proposals\n❌ No questions about your business\n\n## The Interview Questions\n\n1. "Show me a blog you wrote for a [your industry] business."\n2. "How do you research local keywords?"\n3. "What''s your revision policy?"\n4. "How do you ensure content isn''t AI-generated fluff?"\n5. "What''s your typical turnaround time?"\n\n## Setting Expectations\n\n**In Writing:**\n- Number of posts per month\n- Word count per post\n- Turnaround time\n- Number of revisions included\n- Cancellation policy\n\n## Managing the Relationship\n\n- Provide brand guidelines\n- Share customer FAQs\n- Give feedback promptly\n- Pay on time\n- Build long-term partnership\n\n**Action Step:** Create your partner evaluation checklist.',
     12),
    (v_mod8_id, 4, 'Getting the most from your blog partnership',
     E'# Getting the Most From Your Blog Partnership\n\n## Set Your Partner Up for Success\n\n### Onboarding Checklist\n\n□ Share brand voice guide\n□ Provide customer avatars\n□ Send FAQ document\n□ Give access to past content\n□ Clarify forbidden topics\n□ Set communication preferences\n\n### Monthly Workflow\n\n**Week 1:** Approve content calendar\n**Week 2:** Review first drafts\n**Week 3:** Approve final drafts\n**Week 4:** Publish and track\n\n## Communication Best Practices\n\n### Be Specific\n❌ "This doesn''t sound right"\n✅ "Can you make the tone more conversational? Use contractions and shorter sentences."\n\n### Provide Examples\nShow them blogs you like.\n\n### Give Feedback Fast\nWithin 48 hours of receiving drafts.\n\n## Measuring Partner Performance\n\n### Monthly Review\n- On-time delivery?\n- Quality consistent?\n- Rankings improving?\n- Leads increasing?\n\n### Quarterly Review\n- Compare to previous quarter\n- Adjust topics if needed\n- Renegotiate scope\n\n## Long-Term Partnership\n\nGood partners are gold.\nTreat them well:\n- Pay promptly\n- Give credit where due\n- Increase scope over time\n- Refer them to others\n\n**Action Step:** Create your partner onboarding document.\n\n---\n\n## 🎓 CONGRATULATIONS!\n\nYou''ve completed the Blog Growth System.\n\nYou now know:\n✅ Why blogs win long-term\n✅ How to set up properly\n✅ What to write about\n✅ How to write that converts\n✅ Using AI effectively\n✅ Distribution strategies\n✅ Tracking & optimization\n✅ When and how to outsource\n\n## Next Steps\n\n1. **Start your blog** (if not done)\n2. **Publish your first post** (this week)\n3. **Set publishing schedule** (commit to consistency)\n4. **Track your baseline** (analytics setup)\n5. **Join Local-Link community** (connect with others)\n\n## Need Help?\n\nPost a job in the marketplace if you want a certified partner to handle this for you.\n\nOr keep going solo - you have everything you need.\n\n**Now go build your blog empire.**',
     14)
  ON CONFLICT (module_id, lesson_index) DO UPDATE SET
    title = EXCLUDED.title,
    content_md = EXCLUDED.content_md;
    
END $$;
