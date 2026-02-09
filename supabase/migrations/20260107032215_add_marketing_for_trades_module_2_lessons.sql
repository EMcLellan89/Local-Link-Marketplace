/*
  # Marketing for Trades™ - Module 2 Lessons

  1. Module 2: Google Maps + Local Search (Lessons 6-10)
    - GBP Setup
    - Local Rank Factors
    - Map Pack Content Strategy
    - Website Pages That Rank
    - Reviews That Drive Calls
*/

-- Module 2 Lessons (Google Maps + Local Search)
INSERT INTO public.course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, resources, is_preview)
VALUES
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2),
    6,
    'Google Business Profile Setup (Correct Categories + Services)',
    E'# GBP is Your #1 Free Lead Source\n\nGoogle Business Profile (formerly Google My Business) drives more trades leads than any other free channel. Most trades get **60-80% of leads from GBP**.\n\n## Setup Checklist\n\n- **Primary category:** Choose the most specific (e.g., "HVAC contractor" not just "Contractor")\n- **Secondary categories:** Add 2-3 related services\n- **Services list:** Add every service you offer with descriptions\n- **Service areas:** List specific towns (not just radius)\n- **Hours:** Include emergency hours if applicable\n- **Business description:** 750 characters with keywords\n- **Attributes:** Select all that apply (licensed, insured, veteran-owned, etc.)\n\n## Common Mistakes\n\n- Wrong category\n- Incomplete services list\n- Vague service area\n- Missing hours\n- Weak description\n- No attributes selected\n\n## Verification\n\n> **Critical:** Verify your GBP immediately. Unverified profiles get suppressed in search results.\n\n## Exercise\n\nAudit and rewrite your GBP:\n- Screenshot of current GBP setup\n- New services list (at least 10 services)\n- Rewritten 750-character description with town names + services',
    16,
    '{"downloads": ["GBP Setup Checklist", "Category Selection Guide", "Description Template"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2),
    7,
    'Local Rank Factors You Can Control',
    E'# How Google Ranks Local Businesses\n\nGoogle uses three main factors:\n- **Proximity** (how close you are to the searcher)\n- **Relevance** (how well you match the search)\n- **Prominence** (how well-known you are)\n\n## Factors You Can Control\n\n- **Categories:** Primary + secondary categories must match services\n- **Keywords:** Use service + town in business description, posts, and website\n- **Reviews:** Quantity, quality, recency, and keywords in reviews\n- **Photos:** Upload 3-5 photos per week (jobs, team, trucks)\n- **Posts:** Weekly GBP posts with keywords\n- **Citations:** Consistent NAP (Name, Address, Phone) across directories\n- **Website:** Service pages and town pages that match GBP\n- **Q&A:** Answer questions with service + town keywords\n\n## Priority Order\n\nFocus on:\n1. Reviews\n2. Photos\n3. Posts\n4. Website alignment\n\nThese four drive 80% of ranking improvement.\n\n## Target Keywords\n\n> Pick 10 keywords: **[service] + [town]**\n>\n> Example: "HVAC repair Springfield," "AC installation Springfield," "furnace service Springfield"\n\n## Exercise\n\nPick 10 target keywords:\n- List of 10 service + town keywords\n- Current Google rank for each\n- Action plan to improve top 3',
    18,
    '{"downloads": ["Local SEO Checklist", "Keyword Tracker Template"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2),
    8,
    '"Map Pack" Content Strategy (Photos + Posts + Q&A)',
    E'# Consistent Activity Beats Perfect\n\nGoogle rewards active profiles. Regular photos, posts, and Q&A updates signal you''re open, engaged, and relevant.\n\n## Photo Strategy\n\n- Upload **3-5 photos per week** minimum\n- **Mix:** completed jobs, team at work, trucks on site, customer interactions\n- **Add captions** with service + town (e.g., "Tree removal in Springfield")\n- **Before/after photos** perform best\n- **Avoid stock photos**\n\n## Post Strategy\n\n- **1 post per week** minimum\n- **Types:** Offer posts, What''s New posts, Event posts, Update posts\n- **Format:** Headline + 100-150 words + CTA button\n- **Include** service + town keywords naturally\n- **Add a photo** to every post\n\n## Q&A Strategy\n\nAnswer your own FAQs monthly. Example questions:\n- Do you offer emergency service?\n- Are you licensed and insured?\n- What areas do you serve?\n- What services do you provide?\n\n## 4-Week Posting Plan Template\n\n> **Week 1:** Seasonal offer post\n> **Week 2:** Job photo gallery\n> **Week 3:** Customer testimonial\n> **Week 4:** FAQ or tip\n\n## Exercise\n\nCreate a 4-week GBP posting plan:\n- 4 post ideas (one per week)\n- Photo plan for each post\n- Draft copy for Week 1 post',
    14,
    '{"downloads": ["GBP Content Calendar", "Post Templates", "Photo Guidelines"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2),
    9,
    'Website Pages That Rank (Town Pages + Service Pages)',
    E'# One Page Per Service + Town\n\nCreate dedicated pages for each service and each town. Example:\n- HVAC Repair Springfield\n- HVAC Repair Greenfield\n- AC Installation Springfield\n\n## Page Template Structure\n\n1. **H1:** [Service] in [Town]\n2. **Problem:** What''s the pain point?\n3. **Solution:** How you solve it\n4. **Proof:** Reviews, photos, case studies\n5. **Process:** 3-5 steps how it works\n6. **FAQs:** 5-7 common questions\n7. **CTA:** Call now, book estimate, get quote\n\n## Content Tips\n\n- Use natural language\n- Mention the town 3-5 times\n- Include service variations (e.g., "AC repair," "air conditioner repair," "cooling system repair")\n- Add local references (neighborhoods, landmarks)\n\n## Internal Linking\n\n> Link town pages to service pages and vice versa. Link to your GBP. This helps Google understand your relevance.\n\n## Exercise\n\nOutline 5 town pages:\n- List of 5 towns\n- H1 for each page\n- Problem statement for each\n- 3-step process outline',
    20,
    '{"downloads": ["Town Page Template", "SEO Content Guide"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2),
    10,
    'Reviews That Drive Calls (Not Just Stars)',
    E'# Reviews Should Contain Services + Towns\n\nA 5-star review with no details doesn''t rank or convert. A review that says "John fixed my AC in Springfield fast and the price was fair" **ranks and converts**.\n\n## How to Ask for Better Reviews\n\n- **Ask:** "Can you mention the service and town?"\n- **Example prompt:** "Could you mention what we fixed and what town you''re in?"\n- **Timing:** Ask immediately after job completion (same day)\n- **Method:** SMS with direct Google review link\n- **Incentive:** None needed (good service is enough)\n\n## Review Request Scripts\n\n**SMS:**\n"Hi [Name], thanks for trusting us with your [service]. If you have a moment, would you mind leaving a quick review mentioning the service and [town]? [link]"\n\n**Email:**\nSimilar but longer form.\n\n**In-person:**\n"I''d love a Google review if you''re happy—just mention the service and town if you can."\n\n## Review Response Strategy\n\n> Respond to **every review** within 24 hours. Thank them, mention the service and town, and invite them to call again.\n\n## Exercise\n\nWrite 3 review request scripts:\n- SMS script\n- Email script\n- In-person script',
    12,
    '{"downloads": ["Review Request Templates", "Response Templates"]}',
    false
  );
