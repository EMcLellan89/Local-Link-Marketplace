/*
  # Seed Profit Network Playbooks - Batch 2: StoryLab Products
  
  Seeds comprehensive playbooks for:
  - StoryLab Kids
  - StoryLab Teen
  - StoryLab Adult
*/

-- StoryLab Kids
INSERT INTO profit_network_playbooks (business_id, title, description, target_audience, selling_strategy, fb_advertising_info, commission_info, year_one_projection, key_benefits, content)
SELECT 
  id,
  'StoryLab Kids - AI-Powered Children''s Storybook Creation Platform',
  'StoryLab Kids is a magical AI platform that helps parents create personalized bedtime stories starring their own children. Parents simply describe their child (name, age, interests) and the AI generates beautifully illustrated, age-appropriate stories in minutes. Every story is unique, educational, and designed to make bedtime special. Stories can be printed as keepsake books or read digitally. Perfect for creating lasting memories and fostering a love of reading.',
  'PARENTS & GIFT-GIVERS: Parents with children ages 2-10, grandparents, aunts/uncles buying gifts, preschool teachers, pediatricians (waiting room content), children''s boutiques, party planners (party favors), and anyone looking for unique, personalized children''s gifts. Also targets parent bloggers, mommy influencers, and parenting groups.',
  'SELLING STRATEGY:
1. Emotional Hook: "What if your child was the hero of their own bedtime story?"
2. Demo the Magic: Show how quickly AI generates a custom story with child''s name, appearance, and interests
3. Educational Angle: "Stories teach valuable lessons (sharing, kindness, bravery) while featuring YOUR child"
4. Gift Opportunity: "Perfect for birthdays, holidays, grandparent gifts, teacher appreciation"
5. Pricing: "$29 per story or $97/month for unlimited stories. Most families create 4-6 stories per month"
6. Social Proof: Show examples of real stories and parent testimonials
7. Upsell: "Add printed hardcover books for $19.99 each - keepsakes that last forever"',
  'FACEBOOK ADVERTISING: Highly visual ads showing adorable illustrated children as story characters. Target parents 25-45 in parenting groups, follow Montessori/Waldorf education, like children''s book publishers (Scholastic, Random House Kids). Retarget visitors with "Your child could be here" carousel ads. Lead with "Create a FREE sample story" offer.',
  'COMMISSION: $29 one-time purchase = $7.25 commission, OR $97/month unlimited = $24.25/month. Upsells (printed books) add $4.99 commission each. Average customer creates 3 stories = $21.75 + 2 printed books = $9.98 = $31.73 total first purchase.',
  '{
    "conservative": {"monthly_sales": 20, "avg_sale": 32, "one_time_revenue": 7680, "year_one_commission": 1920, "plus_subscriptions": "10 @ $97/mo = additional $2,910 first year"},
    "moderate": {"monthly_sales": 50, "avg_sale": 45, "one_time_revenue": 27000, "year_one_commission": 6750, "plus_subscriptions": "25 @ $97/mo = additional $7,275 first year"},
    "aggressive": {"monthly_sales": 100, "avg_sale": 50, "one_time_revenue": 60000, "year_one_commission": 15000, "plus_subscriptions": "50 @ $97/mo = additional $14,550 first year"}
  }'::jsonb,
  ARRAY['Personalized stories featuring child as main character', 'AI generates unique stories in under 2 minutes', 'Age-appropriate content with educational themes', 'Beautiful illustrations match child''s appearance', 'Print as hardcover keepsake books', 'Unlimited story library with subscription', 'Perfect for reluctant readers', 'Creates magical bedtime memories'],
  '# StoryLab Kids Partner Playbook

## Why This Sells Like Crazy
Parents will pay ANYTHING for personalized experiences for their kids. This isn''t just a story - it''s a keepsake that makes children feel special.

## Perfect Timing
- Birthdays (huge gift opportunity)
- Holidays (Christmas, Hanukkah)
- New baby gifts
- Back to school
- Rainy day activities
- Grandparent visits

## Sales Approach
Target parent Facebook groups with: "Just created the most magical bedtime story with my daughter as the princess! She made me read it 5 times! [link to sample story]"

## Viral Potential
Parents LOVE sharing their kids'' stories on social media. Encourage customers to post with #MyStoryLabKid and offer rewards for sharing.

## Upsell Strategy
- Start: Single story ($29)
- Upgrade: Monthly unlimited ($97)
- Add-on: Printed hardcover (+$19.99)
- Bundle: 5-story package ($99)
- Premium: Sibling stories (2+ characters)

## Commission Breakdown
- Single story: $7.25
- Monthly subscriber: $24.25/month (avg 8-month retention = $194)
- Printed book: $4.99
- Average customer lifetime value: $200-300 in commissions

## Marketing Angles
1. "Bedtime battles solved" - for parents of difficult sleepers
2. "Reading motivation" - for kids who don''t like reading
3. "Personalized gifts" - for grandparents/relatives
4. "Educational entertainment" - for learning-focused parents
5. "Keepsake memories" - for sentimental parents

## Best Platforms
- Pinterest (huge parenting audience)
- Instagram (visual platform, parent influencers)
- Facebook parent groups
- TikTok (short demos go viral)
- Parent blogs (affiliate partnerships)

## Sample Pitch
"Hey mama! Quick question - does your kiddo love hearing stories about themselves? I just found this AI tool that creates custom bedtime stories with YOUR child as the main character. My daughter literally asked me to read hers 8 times last night! They even print it as a hardcover book. Game changer for bedtime. Want me to send you a link?"'
FROM profit_network_businesses
WHERE business_key = 'storylab_kids'
ON CONFLICT (business_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, updated_at = now();

-- StoryLab Teen
INSERT INTO profit_network_playbooks (business_id, title, description, target_audience, selling_strategy, fb_advertising_info, commission_info, year_one_projection, key_benefits, content)
SELECT 
  id,
  'StoryLab Teen - AI Creative Writing Platform for Teens',
  'StoryLab Teen empowers teenagers (ages 12-18) to become authors. Using advanced AI, teens can write novels, fan fiction, creative stories, and even screenplays. The AI acts as a co-writer, helping with plot development, character creation, dialogue, and overcoming writer''s block. Built-in content filters ensure age-appropriate material. Perfect for aspiring young authors, creative writing students, and teens who love reading and want to create their own stories.',
  'TEENS & PARENTS: Teens ages 12-18 interested in creative writing, fan fiction, English/Language Arts students, homeschool families, creative writing teachers, school libraries, NaNoWriMo participants, bookworms, aspiring authors, and parents of creative kids. Also targets: Wattpad users, AO3 readers, book bloggers, and teens in drama/theater programs.',
  'SELLING STRATEGY:
1. Empowerment Message: "Turn your story ideas into full novels - AI helps you become a published author"
2. Show the Process: Demonstrate how AI helps brainstorm plots, develop characters, and write scenes
3. Combat Writer''s Block: "Never get stuck - AI suggests plot twists and dialogue when you need help"
4. Portfolio Building: "Create a portfolio for college applications - published authors stand out"
5. Safe Environment: "Built-in content moderation ensures appropriate material"
6. Pricing: "$19.99/month for unlimited writing or $149/year (save $90)"
7. Bonus: "Export to PDF/ePub, publish on Amazon KDP, create a real author profile"',
  'FACEBOOK ADVERTISING: Target parents of teens and teens directly (13+). Ads feature teen success stories: "I wrote my first novel at 14" testimonials. Show before/after: blank page → completed chapter. Target interests: Wattpad, fan fiction, Harry Potter, Hunger Games, creative writing, National Novel Writing Month. Instagram and TikTok ads showing the writing process.',
  'COMMISSION: $19.99/month = $5.00/month per subscriber, OR $149/year = $37.25 per annual sale. Average retention: 14 months for monthly, 2+ years for annual buyers. Lifetime value: $70-140 per customer.',
  '{
    "conservative": {"monthly_subscribers": 15, "annual_buyers": 5, "monthly_recurring": 3598, "year_one_commission": 900, "annual_commissions": 186},
    "moderate": {"monthly_subscribers": 40, "annual_buyers": 15, "monthly_recurring": 9592, "year_one_commission": 2400, "annual_commissions": 559},
    "aggressive": {"monthly_subscribers": 80, "annual_buyers": 30, "monthly_recurring": 19184, "year_one_commission": 4800, "annual_commissions": 1118}
  }'::jsonb,
  ARRAY['AI co-writing partner helps overcome writer''s block', 'Generate novels, fan fiction, or original stories', 'Character development and plot brainstorming tools', 'Age-appropriate content filters and moderation', 'Export to PDF, ePub, or Word for self-publishing', 'Track word count and writing streak achievements', 'Perfect for college application portfolios', 'Community features to share and get feedback'],
  '# StoryLab Teen Partner Playbook

## The Opportunity
Teens are PROLIFIC content creators. They spend hours on creative projects when passionate. This platform turns that energy into actual novels they can be proud of.

## Marketing Strategy
### Target Platforms
1. **TikTok**: Showcase the writing process, "Day 1 vs Day 30" progress videos
2. **Instagram**: Quote graphics from teen-written stories
3. **Wattpad**: Partner with popular young authors
4. **YouTube**: "How I Wrote My First Novel at 15" videos
5. **Schools**: Reach out to English teachers and creative writing clubs

### Messaging Angles
- **For Teens**: "Your fanfic could be a real book"
- **For Parents**: "Productive screen time that builds valuable skills"
- **For Teachers**: "Engage reluctant writers with AI assistance"
- **College Prep**: "Stand out with a published novel on your application"

## Selling Points
1. **Confidence Building**: Many teens have ideas but fear starting
2. **Skill Development**: Actual writing practice, not just scrolling
3. **Portfolio Creation**: Real accomplishment for resumes/applications
4. **Community**: Connect with other young writers
5. **Publishing Path**: Direct route to self-publishing

## Objection Handling
- "AI is cheating": It''s a tool like spell-check. The ideas and creativity come from the teen.
- "Too expensive": Compare to other hobbies ($20/month for unlimited creative output)
- "Will they actually use it": 14-day free trial lets them test it risk-free
- "Is it safe": Built-in content moderation and parental controls

## Partnership Opportunities
- Creative writing classes (group discounts)
- NaNoWriMo participants (November surge)
- Book clubs (reading → writing transition)
- Drama clubs (screenplay writing)
- Homeschool co-ops (writing curriculum)

## Commission Strategy
Focus on annual plans! $149 upfront = $37.25 commission immediately vs. waiting 8 months for monthly subscriptions to catch up.

Offer: "Pay annually and save $90" - easier close, better commission timing.'
FROM profit_network_businesses
WHERE business_key = 'storylab_teen'
ON CONFLICT (business_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, updated_at = now();

-- StoryLab Adult  
INSERT INTO profit_network_playbooks (business_id, title, description, target_audience, selling_strategy, fb_advertising_info, commission_info, year_one_projection, key_benefits, content)
SELECT 
  id,
  'StoryLab Adult - Professional AI Book Creation for Authors & Businesses',
  'StoryLab Adult is the professional-grade AI book creation platform for serious authors, entrepreneurs, and businesses. Create novels, non-fiction books, lead magnets, course materials, business books, and marketing content. The AI assists with research, outlining, writing, editing, and formatting. Includes advanced features like multiple genre templates, SEO optimization for kindle, cover design tools, and direct publishing integration. Perfect for aspiring authors, coaches creating course materials, businesses writing company books, and marketers creating lead magnets.',
  'PROFESSIONAL AUTHORS & BUSINESSES: Aspiring novelists, non-fiction authors, business coaches creating course content, consultants writing authority books, real estate agents creating neighborhood guides, financial advisors creating lead magnets, speakers writing keynote books, marketers creating ebooks, self-help authors, business owners establishing authority, and anyone monetizing knowledge. Annual revenue $50K+ professionals.',
  'SELLING STRATEGY:
1. Authority Positioning: "A published book makes you THE expert in your field"
2. Lead Generation: "Your book becomes a 24/7 lead generation machine"
3. Speed to Market: "Write and publish your book in 30 days instead of 12 months"
4. ROI Focus: "One client from your book can pay for 10 years of this platform"
5. Show Examples: Display real books created on the platform
6. Pricing: "$49/month or $399/year for unlimited books"
7. Upsell: "Professional formatting, cover design, and Amazon optimization services available"',
  'FACEBOOK ADVERTISING: Target entrepreneurs, coaches, consultants, authors. Ads feature: "Published author in 30 days" challenge, before/after of blank screen to published book, testimonials from coaches who got clients from their books. Target interests: Tony Robbins, Gary Vaynerchuk, self-publishing, Amazon KDP, online courses, coaching, consulting.',
  'COMMISSION: $49/month = $12.25/month per subscriber, OR $399/year = $99.75 per annual sale. Average retention: 24+ months for monthly, 3+ years for annual. Lifetime value: $294-882 per customer. Add-on services (editing, covers, formatting) generate additional $24-75 per commission.',
  '{
    "conservative": {"monthly_subscribers": 10, "annual_buyers": 5, "monthly_recurring": 5880, "year_one_commission": 1470, "annual_commissions": 499, "total_year_one": 1969},
    "moderate": {"monthly_subscribers": 25, "annual_buyers": 15, "monthly_recurring": 14700, "year_one_commission": 3675, "annual_commissions": 1496, "total_year_one": 5171},
    "aggressive": {"monthly_subscribers": 50, "annual_buyers": 30, "monthly_recurring": 29400, "year_one_commission": 7350, "annual_commissions": 2993, "total_year_one": 10343}
  }'::jsonb,
  ARRAY['Professional AI writing assistant for serious authors', 'Create unlimited books, ebooks, and lead magnets', 'Advanced outlining and research tools', 'Multiple genre templates (business, fiction, self-help)', 'SEO optimization for Amazon KDP', 'Direct publishing integration', 'Professional formatting and export options', 'Collaboration tools for co-authors and editors'],
  '# StoryLab Adult Partner Playbook

## The Big Opportunity
Everyone wants to write a book. Business owners know they SHOULD write a book. But they don''t because it takes forever. We solve that.

## Target Markets

### 1. Business Coaches & Consultants
**Pain**: Need authority content to attract high-ticket clients
**Pitch**: "Your $2,000 coaching package needs a $20 book to sell it"
**ROI**: One client pays for 3+ years of the platform

### 2. Real Estate Agents
**Pain**: Need unique marketing materials
**Pitch**: "Create a ''Complete Guide to [Your City] Real Estate'' book as your calling card"
**ROI**: One extra listing covers 5 years

### 3. Financial Advisors
**Pain**: Compliance-friendly lead generation is hard
**Pitch**: "Your ''Retirement Planning Guide'' positions you as the expert"
**ROI**: One new client = lifetime value of $50K+

### 4. Aspiring Novelists
**Pain**: Traditional publishing is nearly impossible
**Pitch**: "Self-publish your novel and keep 70% royalties vs 10% from traditional publishers"
**ROI**: Novels on Amazon can generate passive income forever

## Sales Process

### Discovery Questions
1. "Have you ever thought about writing a book?"
2. "What''s stopped you from starting?"
3. "If you had a published book tomorrow, how would you use it?"

### Common Answers & Responses
- "No time": That''s why AI does the heavy lifting - you guide it
- "Not a good writer": AI handles the writing, you provide the knowledge
- "Don''t know where to start": We have templates for 20+ book types

### The Close
"Let''s do this: Start with one month at $49. Pick your book type - business authority book, lead magnet, or novel. Spend 30 minutes per day with the AI. In 30 days you''ll have a complete first draft. If you don''t, I''ll refund you myself. Deal?"

## Partnership Opportunities

### Coaching Programs
Partner with business coaching programs to offer StoryLab as part of their curriculum.

### Masterminds
Pitch to mastermind groups: "Every member should publish their signature book"

### Speaking Bureaus
Speakers need books for credibility - approach speaker networks

### Marketing Agencies
Agencies can resell StoryLab to clients for content creation

## Commission Snowball

### Month 1-3 Focus
Get 10 annual buyers ($399 each) = $997.50 in commissions
Total effort: 10 sales calls

### Month 4-6 Focus
Add 20 monthly subscribers = $245/month recurring
These compound every single month

### Month 12 Reality
- 30 annual buyers = $2,993 in year-one commissions
- 50 monthly subscribers = $612.50/month recurring = $7,350/year
- **Total Year One: $10,343**

### Year 2 Reality
Year 1 customers renew, plus new sales = $15K-25K annual commission run rate

## Marketing Content Ideas
1. "I wrote my book in 30 days" case studies
2. Before/after of blank page to Amazon listing
3. Author income reports (show Amazon royalty checks)
4. "How my book got me on podcasts" testimonials
5. Expert positioning videos

## Key Message
"Your knowledge is valuable. Your book proves it. Let AI turn your expertise into authority."'
FROM profit_network_businesses
WHERE business_key = 'storylab_adult'
ON CONFLICT (business_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, updated_at = now();
