/*
  # Seed Business Coach Certification - Modules 5-7 Part 1
  
  Module 5: Sales System Development
  Module 6: Leadership & Team Building
  Module 7: Crisis Management & Turnarounds (Part 1)
*/

-- Module 5: Sales System Development (5 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod5 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 5)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod5.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod5, course,
(VALUES
  ('Building a Predictable Sales Pipeline',
   E'**Transform random sales into a predictable revenue machine.**

Create clear stages: Leads → Qualified → Proposal → Negotiation → Closed Won/Lost. Track conversion rates at each stage. Identify bottlenecks where deals stall. Calculate average time in each stage. Forecast revenue based on pipeline value multiplied by historical close rate. Example: $100K pipeline × 25% close rate = $25K expected revenue. Weekly pipeline review meetings keep deals moving forward. Focus on feeding top of funnel consistently and improving conversion rates systematically.', 1, 40),

  ('Sales Scripts and Objection Handling',
   E'**Confidence comes from preparation. Master the scripts that close deals.**

Discovery phase asks questions before pitching. Find pain points, desired outcomes, budget authority, timeline, and decision process. Presentation phase connects their pain to your solution specifically. Handle price objections by showing ROI and breaking down to daily cost. Handle timing objections by creating urgency with deadlines or limited capacity. Handle authority objections by requesting meeting with all decision makers. Handle competition objections by highlighting unique differentiators and results. Practice scripts until they feel natural and conversational, not robotic.', 2, 45),

  ('Proposal and Closing Techniques',
   E'**The proposal should make the decision obvious and easy.**

Include executive summary with their problem and your solution. Show clear scope of work with specific deliverables. Present pricing with 3 options Good Better Best where most choose middle. Add social proof with testimonials and case studies. Include guarantee to remove risk. Create urgency with expiration date or limited availability. The close is assumptive language like when would you like to start rather than if. Trial close throughout asking does this make sense. When they say yes shut up and get signature immediately. Follow up within 24 hours if they need to think about it.', 3, 40),

  ('Sales Metrics and Performance Tracking',
   E'**If you cannot measure it you cannot improve it.**

Track these metrics weekly: Number of leads generated, qualification rate, proposal sent rate, close rate, average deal size, sales cycle length, and revenue per salesperson. Calculate cost per lead and customer acquisition cost. Monitor win/loss reasons to identify patterns. Review individual salesperson performance against benchmarks. Create dashboard visible to entire team driving accountability. Set clear targets for each metric and review progress in weekly meetings. Improve weakest metric first for biggest overall impact. Most businesses dramatically improve just by starting to measure.', 4, 35),

  ('Building a Sales Team That Sells',
   E'**Hiring selling and managing salespeople requires different skills.**

Hire for attitude and coachability over experience. Look for resilience, competitive nature, strong communication, and hunger to succeed. Create comp plan with base salary plus commission where commission can double base. Provide comprehensive onboarding with product training, sales process training, shadowing, and role play. Implement daily standup meetings and weekly one-on-ones. Use CRM to track activity not just results. Set activity minimums like calls per day and meetings per week. Celebrate wins publicly. Address underperformance quickly with coaching or removal. Top performers earn respect through results not tenure. Culture of healthy competition drives entire team forward.', 5, 45)
) AS lessons(title, content, order_num, minutes);

-- Module 6: Leadership & Team Building (4 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod6 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 6)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod6.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod6, course,
(VALUES
  ('Leading Through Crisis',
   E'**In crisis employees look to leadership for clarity direction and confidence.**

Communicate frequently even when you do not have all answers. Acknowledge reality of situation without sugarcoating but maintain optimism about outcome. Make decisions quickly even if not perfect as indecision creates more fear than wrong decision. Be visible and accessible to team showing you are in it together. Focus team energy on what they can control not external factors. Celebrate small wins to maintain morale. Lead by example working harder and staying calmer than anyone. Ask for input and ideas making team feel part of solution. Be honest about challenges but emphasize capability to overcome them together. Leaders who stay calm create calm teams and teams that perform under pressure.', 1, 45),

  ('Hiring and Building Your A-Team',
   E'**The business is only as good as the team running it.**

Hire slow and fire fast. Define role clearly before posting including responsibilities key results and cultural fit. Screen for alignment with company values first skills second. Conduct working interviews where candidates do actual work not just talk. Check references thoroughly asking about weaknesses and areas for growth. Start with trial period to assess real performance. When someone is not working out address it immediately do not hope it improves. Top performers want to work with other top performers so quality attracts quality. Pay fairly but culture and mission motivate more than money alone. Invest heavily in onboarding first 90 days determines long term success. Create growth paths so people see future within company. Regularly assess team asking is this person making company better or holding it back. Build team slowly and intentionally not desperately to fill seats.', 2, 50),

  ('Creating Accountability Culture',
   E'**Accountability is not punishment it is clarity on expectations and follow through.**

Set crystal clear goals with specific numbers and deadlines. Use OKR framework Objectives and Key Results where objective is what you want and key results are how you measure it. Example Objective improve customer satisfaction Key Results NPS score above 50 response time under 2 hours zero complaints escalated. Review goals in weekly team meetings making progress visible to everyone. When someone misses goal have conversation about what prevented success and what support they need. Distinguish between effort problem and skill problem. Effort problem requires motivation or removal. Skill problem requires training or different role. Hold everyone including yourself to same standards. Public commitments drive accountability as nobody wants to let team down. Consequences for repeated non performance must be real or standards become meaningless. Most important celebrate when people hit goals reinforcing behavior you want.', 3, 45),

  ('Motivation and Team Performance',
   E'**Money motivates to a point beyond that purpose and recognition matter more.**

People want to feel their work matters and contributes to something bigger. Clearly articulate company mission and how each role connects to it. Give autonomy over how work gets done not just instructions to follow. Recognize achievements publicly and specifically not just good job but exactly what they did well. Provide path for growth and skill development. Ask for ideas and input showing their voice matters. Address conflicts quickly before they poison culture. Create team traditions and celebrations building camaraderie. Be transparent about business performance good and bad. Treat people as adults who can handle truth. Invest in their success outside work supporting personal goals. When team feels valued they give discretionary effort going above and beyond. Toxic culture drives talent away while great culture attracts it. The leader sets the tone in everything they do and say. Model the behavior you want to see.', 4, 40)
) AS lessons(title, content, order_num, minutes);

-- Module 7: Crisis Management & Turnarounds (6 lessons)
WITH course AS (SELECT id FROM academy_courses WHERE slug = 'certified-business-coach'),
     mod7 AS (SELECT id FROM academy_modules WHERE course_id = (SELECT id FROM course) AND display_order = 7)
INSERT INTO academy_lessons (module_id, course_id, title, content_type, article_content, display_order, est_minutes, slug)
SELECT
  mod7.id,
  course.id,
  title,
  'text',
  content,
  order_num,
  minutes,
  lower(replace(replace(replace(title, ' ', '-'), '?', ''), '&', 'and'))
FROM mod7, course,
(VALUES
  ('Triage When Business is Bleeding',
   E'**First priority stop the immediate bleeding before treating other wounds.**

Assess runway how many days of cash remain at current burn rate. If under 30 days enter emergency mode. Cut all non essential spending immediately no exceptions. Call largest customers to secure payment or deposits. Negotiate payment extensions with vendors being transparent about situation. Consider factoring receivables for immediate cash. Halt all growth initiatives and marketing spend temporarily. Focus 100 percent on cash generation and preservation. Meet with team explaining situation and required actions. Some may need reduced hours or temporary unpaid leave. Consider selling assets or inventory at discount for quick cash. Personal loans or credit as last resort bridge. Create 13 week cash flow forecast updated daily. Every decision filtered through will this help us survive next 30 days. Once runway extended to 60 plus days can shift to rebuilding phase. Speed is everything in crisis mode what takes 3 days should take 3 hours.', 1, 50),

  ('Negotiating with Creditors and Stakeholders',
   E'**When you cannot pay everyone prioritize and negotiate payment terms.**

Tier creditors by criticality. Tier 1 must pay payroll utilities insurance and rent as these keep doors open. Tier 2 priority vendors key to operations. Tier 3 other vendors who can wait. Tier 4 credit cards and loans. Call creditors proactively before missing payment showing good faith. Offer partial payment immediately plus payment plan for remainder. Most creditors prefer something now over collections later. Be honest about situation but confident in turnaround plan. Ask for temporary reduced payments or deferred payments. Everything is negotiable especially with small vendors who want to keep customer. Document all agreements in writing including new terms. Large creditors may require financial statements and turnaround plan. Personal guarantee makes you responsible but sometimes necessary. Consider debt restructuring or consolidation if multiple creditors. Bankruptcy should be absolute last resort as it destroys business value. Once negotiated meet every commitment religiously to rebuild trust. Keep communication open updating creditors on progress regularly.', 2, 45),

  ('Rapid Revenue Generation Strategies',
   E'**When you need cash fast normal sales cycles are too slow.**

Flash sales at steep discounts converting inventory to cash immediately. Pre sell services at discount requiring deposit today. Call past customers offering special deal for returning. Upsell and cross sell existing customers who already trust you. Create productized service packages that can sell quickly. Partner with complementary business for instant lead source. Run limited time promotion creating urgency to buy now. Accept payment plans or subscriptions instead of waiting for full payment. Offer referral bonuses to customers for immediate introductions. Reach out to warm leads in pipeline with expiring discount. Run webinar or workshop pre-selling program before building it. License intellectual property or processes for upfront fee. Consulting or coaching using your expertise for immediate income. Sell unused equipment or assets at auction or online. Sublet unused office space or resources to others. Every business has hidden assets that can generate cash quickly if creative.', 3, 45),

  ('Making Tough Decisions Fast',
   E'**Crisis demands decisiveness. Indecision kills more businesses than wrong decisions.**

Gather minimum information needed do not wait for perfect data. Consider best case base case worst case scenarios for each option. Choose option with best worst case outcome reducing downside risk. Make decision and commit fully second guessing wastes energy. Communicate decision clearly to team with reasoning behind it. Accept some decisions will be wrong and be ready to pivot. Speed matters more than perfection as delayed decision has cost too. Decision fatigue is real so make big decisions when fresh. Eliminate small decisions by creating rules and delegating. Trust gut instinct when data inconclusive experience guides intuition. Avoid paralysis by analysis which feels productive but accomplishes nothing. Set decision deadline if cannot decide by X go with option Y. Get input from advisors but do not abdicate final decision. Own outcomes of decisions good or bad building trust with team. Review decisions afterward what worked what did not what learned. Strong decisive leadership inspires confidence while waffling creates doubt.', 4, 40),

  ('Turnaround Case Studies',
   E'**Learn from real business rescues what worked and why.**

Case 1 Restaurant losing 10K monthly. Fixed by cutting menu in half reducing food waste 60 percent raising prices 15 percent and implementing reservation system that reduced no-shows. Result profitable in 90 days. Case 2 Service business owner burnout working 80 hours. Fixed by documenting processes hiring operations manager and raising prices 30 percent to work with fewer better clients. Result owner works 25 hours weekly business more profitable. Case 3 Retail store declining sales. Fixed by moving 50 percent inventory online adding subscription box and creating VIP customer program. Result revenue increased 40 percent. Case 4 Contractor cash flow problems. Fixed by requiring 50 percent deposits changing payment terms to net 15 and implementing weekly billing. Result consistent positive cash flow. Common themes raise prices focus on best customers eliminate waste build systems and move fast. Every turnaround required tough decisions and disciplined execution.', 5, 45),

  ('Post-Crisis Growth Strategy',
   E'**After stabilizing business position for sustainable growth not just recovery.**

Document every lesson learned during crisis. Update processes and systems to prevent recurrence. Build cash reserves to 6 months operating expenses minimum. Diversify revenue streams reducing dependency on any single source. Strengthen customer relationships that proved loyal during crisis. Invest in marketing to rebuild pipeline depleted during crisis mode. Hire key team members in areas where owner was bottleneck. Implement financial dashboards and weekly reviews catching issues early. Create strategic plan for next 12 to 36 months with clear milestones. Focus on profit not just revenue as growth without profit causes next crisis. Celebrate team that weathered storm recognizing their contribution. Share story of turnaround as marketing differentiator showing resilience. Maintain discipline that got you through crisis not relaxing too soon. Controlled growth with strong foundation beats rapid growth with weak foundation every time. Most importantly build business that can handle next crisis because challenges always come.', 6, 50)
) AS lessons(title, content, order_num, minutes);
