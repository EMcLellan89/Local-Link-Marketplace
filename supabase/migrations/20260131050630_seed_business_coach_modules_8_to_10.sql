/*
  # Seed Business Coach Certification - Modules 8-10
  
  Module 8: Pricing & Profitability
  Module 9: Customer Retention & Loyalty
  Module 10: Scaling & Growth Strategies
*/

-- Module 8: Pricing & Profitability (4 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod8 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 8)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod8.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod8, course,
(VALUES
  ('Mastering Value-Based Pricing',
   E'**Price based on value delivered not cost or competition.**

Cost plus pricing leaves money on table if delivering high value. Competitor pricing means racing to bottom and commoditization. Value pricing charges based on worth to customer not your costs. Calculate client ROI from your service multiply by fraction for fair pricing. Example save client 100K annually charge 20K for 5x ROI still good deal. Anchor to business outcome not time spent. Position as investment with return not expense. Create pricing tiers allowing self-selection based on value needed. Premium tier 3 to 5x base price for more attention and guarantees. Price objections mean you have not demonstrated enough value. Articulate value in client terms their revenue savings or outcomes. Raise prices regularly at least annually testing ceiling. Lost deals from price too high better than won deals priced too low. Confident pricing attracts better clients who value quality over cheap.', 1, 45),

  ('Understanding True Profitability',
   E'**Revenue is vanity profit is sanity cash is reality.**

Calculate gross profit revenue minus direct costs percentage above 50 percent healthy. Calculate net profit after all operating expenses target 15 to 25 percent. Track profit per customer identifying most and least profitable. Analyze by product service and customer segment. Fix or eliminate anything with negative or low profit margin. Hidden costs often missed owner time overhead allocated benefits and wear. Break even analysis how many sales to cover fixed costs. Contribution margin per unit helps optimize product mix. Profit first method automatically allocate profit before expenses. Monitor profit weekly not just annually catching trends early. Compare to industry benchmarks for your sector size and stage. Increase profit by raising prices reducing costs or both. Growth without profit dangerous leading to cash crunch. Profitable business gives options while unprofitable requires constant hustle. Make pricing and profit decisions data driven not emotional.', 2, 40),

  ('Margin Optimization Strategies',
   E'**Small improvements in margin create massive profit increases.**

Every 1 percent margin improvement flows straight to bottom line. Reduce COGS by negotiating better supplier terms buying in bulk. Source materials from multiple vendors creating competition. Reduce waste and defects which directly hit margins. Optimize labor costs through training efficiency and scheduling. Implement time tracking seeing where hours actually go. Bundle products and services increasing average transaction size. Upsell higher margin items or premium versions. Eliminate low margin offerings that consume resources. Automate repetitive tasks reducing labor costs. Outsource non-core activities if cheaper than internal. Renegotiate recurring vendor contracts and subscriptions annually. Reduce payment processing fees by choosing right processor. Implement inventory management preventing overstock and spoilage. Service businesses optimize utilization rate of billable hours. Retail businesses optimize inventory turns and shrinkage. Every industry has specific levers focus on yours.', 3, 40),

  ('Profit-Driven Decision Making',
   E'**Filter every decision through impact on profitability.**

New opportunity ask does this increase profit or distract. New hire calculate ROI of position revenue enabled minus cost. Marketing spend track cost per acquisition and customer LTV. Equipment or software purchase calculate payback period. Product launch estimate margin and volume required for profitability. Customer request evaluate if profitable or scope creep. Growth initiative ensure unit economics work before scaling. Busy work elimination free up time for profit driving activities. Say no to opportunities that do not move profit needle. Focus beats diversification when optimizing for profit. Review P and L monthly comparing to prior periods and budget. Identify largest expense categories for reduction opportunities. Benchmark against top performers in your industry. Set profit targets and bonus structure around hitting them. Communicate profit importance to team everyone impacts it. Celebrate profit wins as team accomplishment not owner alone. Profitable business is resilient business weathering any storm.', 4, 35)
) AS lessons(title, content, order_num, minutes);

-- Module 9: Customer Retention & Loyalty (4 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod9 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 9)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod9.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod9, course,
(VALUES
  ('Building Customer Loyalty Systems',
   E'**Loyal customers are worth 10x new customers in lifetime value.**

Create VIP program for top 20 percent customers by revenue. Offer exclusive benefits early access special pricing dedicated support. Communicate regularly with personalized content not generic blasts. Implement points or rewards program incentivizing repeat purchases. Birthday and anniversary recognition makes customers feel valued. Surprise and delight unexpected gifts upgrades or discounts. Create community connecting customers to each other not just you. Host events workshops or webinars building relationships. Ask for feedback and actually implement suggestions showing you listen. Respond to all reviews especially negative ones professionally. Track NPS Net Promoter Score asking how likely to recommend. Score above 50 is excellent above 70 is world class. Segment customers by engagement level and nurture accordingly. Win back lapsed customers with targeted reactivation campaigns. Make cancellation or leaving difficult through switching costs. Invest heavily in onboarding first 90 days determines retention. Happy customers become brand evangelists worth more than any ad.', 1, 45),

  ('Reducing Churn and Increasing LTV',
   E'**Every percentage point reduction in churn dramatically increases profit.**

Calculate current churn rate lost customers divided by total monthly. Identify churn reasons through exit surveys and data analysis. Common reasons poor service better alternatives cost or no longer need. Address top 3 churn reasons systematically with process changes. Implement early warning system flagging at risk customers. Indicators reduced usage late payments complaints or disengagement. Proactively reach out before they churn offering solutions. Create annual contracts or commitments reducing casual churn. Make value visible with regular reporting on ROI and results. Increase switching costs through data integrations customizations or training. Offer incentives for longer commitments discounts for annual vs monthly. Build relationships at multiple levels in client organization. Regular business reviews discussing performance and future needs. Continuous improvement based on feedback showing commitment. Calculate customer lifetime value average revenue per customer × months retained. Increase LTV by extending retention period or increasing purchase frequency. 5 percent increase in retention can increase profits 25 to 95 percent per research.', 2, 45),

  ('Creating Raving Fans',
   E'**Satisfied customers do not refer. Raving fans do.**

Exceed expectations consistently delivering more than promised. Under promise and over deliver surprising positively every time. Respond to inquiries and issues faster than anyone expects. Personalize experience using customer data and preferences. Remember details from past conversations showing you care. Go above and beyond fixing problems with extra compensation. Thank customers personally and specifically for their business. Feature customers in case studies testimonials and spotlights. Create wow moments memorable experiences they talk about. Empower team to solve problems without asking permission. Give more value than you charge making ROI obvious. Be easy to work with removing friction from every interaction. Admit mistakes quickly apologize sincerely and make it right. Ask for feedback and show how you implemented it. Build emotional connection beyond transactional relationship. Raving fans refer frequently post positive reviews and defend you publicly. They are immune to competitor poaching loyal even when offered better price. One raving fan worth more than 10 satisfied customers combined.', 3, 40),

  ('Referral and Advocacy Programs',
   E'**Word of mouth is most powerful and cheapest marketing.**

Ask every happy customer for referrals make it part of process. Best time to ask immediately after they give praise or positive feedback. Make asking easy with simple question who else needs this. Provide tools making referring effortless referral cards links templates. Incentivize referrals with rewards for referrer and referee. Monetary rewards work but recognition and exclusive perks work too. Track referral sources in CRM seeing who refers most. Thank referrers immediately and update them on referred customer progress. Create ambassador program for top referrers with special status. Partner with complementary businesses for cross referrals. Make your customers look good when they refer you. Ensure referred customers get VIP treatment validating referrer judgment. Feature referrers in newsletter or social media recognizing contribution. Calculate referral rate percentage of customers who refer. Target 30 to 50 percent referral rate for healthy business. Make referring you part of their identity I am the person who knows best X. Turn customers into active salespeople through advocacy program.', 4, 40)
) AS lessons(title, content, order_num, minutes);

-- Module 10: Scaling & Growth Strategies (5 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod10 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 10)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod10.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod10, course,
(VALUES
  ('When and How to Scale',
   E'**Scaling too early kills businesses. Scaling too late leaves money on table.**

Signs you are ready to scale consistent profitability for 6 plus months. Operating systems documented and repeatable. Strong leadership team managing daily operations. Positive cash flow and financial reserves built. Proven product market fit with strong demand. Unit economics work profitably at current scale. Infrastructure and technology can handle growth. Team capacity exists or clear hiring plan. Market opportunity large enough to support growth. Capital available to fund growth phase. Premature scaling number one killer of businesses per research. Scale only what works do not scale broken business. Fix first then scale. Growth without systems creates chaos. Growth without profit creates cash crisis. Controlled growth beats rapid growth every time. Double revenue every 12 to 18 months is aggressive but sustainable. Faster growth requires significant capital and carries high risk. Start scaling by adding capacity team or systems incrementally. Test new markets or products before full commitment. Monitor key metrics closely during growth catching issues early.', 1, 50),

  ('Building Scalable Systems',
   E'**Business must run without you to scale successfully.**

Document every process so anyone can execute it. Create training programs onboarding new team in days not months. Implement project management tools Asana Trello or ClickUp. Use CRM for sales and customer management HubSpot or Pipedrive. Automate repetitive tasks with Zapier or Make. Standardize deliverables and outputs ensuring consistency. Build templates and checklists for common tasks. Create organizational chart defining roles and reporting structure. Establish clear KPIs for every role measuring performance. Implement regular meeting rhythms daily standup weekly reviews monthly planning. Use cloud based tools enabling remote work and collaboration. Create standard operating procedures library accessible to all team. Build financial dashboard tracking metrics in real time. Implement quality control processes catching errors before delivery. Create customer journey map standardizing touchpoints. Build knowledge base for common questions and issues. Scalable systems allow growth without proportional increase in overhead. Test systems by having new person follow them successfully. Continuously improve systems based on feedback and results.', 2, 50),

  ('Strategic Growth Planning',
   E'**Growth without strategy leads to chaos. Plan before executing.**

Define 3 year vision where do you want business to be. Set 1 year goals breaking vision into annual milestones. Create quarterly objectives focusing team on 90 day priorities. Identify growth constraints what limits current growth. Address constraints systematically before pushing growth. Choose growth strategy market penetration new markets new products or diversification. Market penetration is lowest risk selling more to existing customers and market. New markets is medium risk taking proven product to new geography or segment. New products is higher risk developing new offerings for existing customers. Diversification is highest risk new products and new markets simultaneously. Most businesses should exhaust market penetration before other strategies. Set growth targets revenue profit and team size. Calculate required marketing sales and operational capacity. Build financial model projecting cash flow profit and funding needs. Identify leading indicators predicting future growth. Create strategic initiatives specific projects driving growth. Assign ownership and deadlines for each initiative. Review progress monthly adjusting plan based on results. Communication plan ensuring team aligned on priorities and why. Balance growth ambition with practical execution capability.', 3, 50),

  ('Raising Capital and Funding Growth',
   E'**Growth often requires capital. Know your options and costs.**

Bootstrap grow using operating cash flow and profit. Advantages no dilution full control no debt obligations. Disadvantages slower growth limited by cash flow. Best for service businesses with low capital needs. Debt financing loans or lines of credit. Advantages retain ownership tax deductible interest. Disadvantages monthly payments personal guarantee often required. Best for businesses with consistent cash flow and collateral. Equity financing sell ownership stake to investors. Advantages no repayment large capital available expertise and network. Disadvantages dilution loss of control investor expectations. Best for high growth potential businesses needing significant capital. Revenue based financing repay percentage of monthly revenue. Advantages no dilution flexible payments based on revenue. Disadvantages expensive long repayment period. Best for businesses with recurring revenue. Alternative options vendor financing equipment leasing invoice factoring. Friends and family fastest but can damage relationships if goes wrong. Calculate true cost of capital including fees interest and dilution. Only raise what you need excess cash leads to wasteful spending. Have clear plan for use of capital not just we need money. Investors want to see traction metrics team and path to profitability.', 4, 50),

  ('Exit Strategy and Business Valuation',
   E'**Build business with end in mind. Every business eventually exits.**

Exit options sell to competitor sell to private equity sell to employee management buyout pass to family IPO. Most common for small business is strategic sale to competitor or private equity. Business valuation methods multiple of earnings discounted cash flow asset based. Service businesses typically 2 to 4x EBITDA earnings before interest tax depreciation amortization. Product businesses 3 to 6x EBITDA. SaaS and tech businesses 4 to 10x revenue if high growth. Factors increasing value recurring revenue low customer concentration strong team documented systems. Owner independent operations meaning business runs without you. Clean financials showing consistent profitability and growth. Large addressable market with growth runway. Unique IP or competitive moat. Strong brand and customer loyalty. Factors decreasing value high customer concentration owner dependent operations. Inconsistent financials or profitability. Limited growth potential or declining market. Weak systems and team. Prepare for exit 2 to 3 years in advance optimizing value drivers. Hire business broker or M&A advisor for significant transactions. Expect 6 to 12 month sale process from initial contact to close. Due diligence is intensive buyer examines everything. Have exit strategy even if not selling soon forces building sellable business. Exit is not end it is next chapter for you and business legacy.', 5, 50)
) AS lessons(title, content, order_num, minutes);
