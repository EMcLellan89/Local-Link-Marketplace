/*
  # Add Partner Webinar: "How to Sell Facebook Monetization Services"

  ## Overview
  Creates a comprehensive partner-focused webinar that teaches Local-Link partners
  how to sell Facebook monetization services to local businesses.

  ## Webinar Details:
  - Target: Local-Link partners, digital marketers, business consultants
  - Duration: ~50 minutes
  - Goal: Teach partners to position and sell Facebook monetization
  - CTA: Start selling immediately + bonus resources

  ## Structure:
  - Introduction & Opportunity (5 min)
  - Market Analysis (10 min)
  - Positioning & Pricing (15 min)
  - Sales Process (15 min)
  - Scaling & Support (5 min)
*/

-- Create the partner webinar course
INSERT INTO courses (
  slug, 
  title, 
  subtitle, 
  description, 
  image_url,
  is_published,
  target_audience
)
VALUES (
  'partner-webinar-sell-facebook-services',
  'Partner Webinar: How to Sell Facebook Monetization to Local Businesses',
  'Turn Every Local Business Into a $500-$2,000/Month Recurring Client',
  'A 50-minute partner training showing you exactly how to position, pitch, and close Facebook monetization services to local businesses. Learn the proven scripts, pricing models, and delivery frameworks that make this the easiest high-ticket service to sell.',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  true,
  'partner'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Create webinar module
DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'partner-webinar-sell-facebook-services';
  
  IF v_course_id IS NOT NULL THEN
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (
      v_course_id, 
      1, 
      'Complete Partner Training Webinar',
      '50-minute webinar on selling Facebook monetization services to local businesses'
    )
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module_id;
    
    IF v_module_id IS NULL THEN
      SELECT id INTO v_module_id FROM course_modules WHERE course_id = v_course_id AND module_index = 1;
    END IF;
    
    IF v_module_id IS NOT NULL THEN
      -- Lesson 1: Full Partner Webinar Script
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview)
      VALUES (
        v_module_id,
        1,
        'Complete Partner Sales Training',
        '# Partner Webinar: How to Sell Facebook Monetization Services

## PRE-WEBINAR (Before Going Live)
**Build engagement in chat:**
- "Welcome! Drop a 👋 in the chat so I know you''re here"
- "How many clients do you currently have?"
- "What''s your biggest challenge in selling recurring services?"
- Build rapport and understand audience pain points

---

## INTRODUCTION & OPPORTUNITY (5 minutes)

**Opening:**
"What''s up partners! I''m excited to be here with you today because I''m going to show you the EASIEST high-ticket recurring service you can sell to local businesses right now.

And I''m not talking about another complicated SEO package or expensive ad management service that takes months to show results.

I''m talking about **Facebook Monetization** - a service that:
✅ Every local business needs
✅ Requires NO ad spend
✅ Shows results in 30 days or less
✅ Sells for $500-$2,000 per month recurring
✅ Takes you 2-5 hours per month to deliver

In the next 50 minutes, you''re going to learn:
1. Why this is the perfect service to sell RIGHT NOW
2. How to position and price it for maximum profit
3. The exact scripts to close deals fast
4. How to deliver without burning out
5. How to scale to $10K-$50K per month"

**Why Listen to Me:**
"I''ve personally closed [X] Facebook monetization clients in the last [Y] months and helped dozens of partners do the same. This is the real deal, and you''re about to see exactly how it works."

---

## PART 1: THE OPPORTUNITY (10 minutes)

**"Why Facebook Monetization is Perfect for Partners"**

"Let me paint a picture for you:

**The Market Demand:**
- There are 33 MILLION small businesses in the US
- 90% have a Facebook page
- 95% have NO IDEA how to make money from it
- They''re all posting randomly, hoping for results
- They KNOW they should be using Facebook better
- They just don''t know HOW

**Translation:** 
30+ million businesses are sitting on a GOLDMINE (their Facebook audience) but have no idea how to extract value from it.

**Your Opportunity:**
Position yourself as the expert who shows them how to turn their Facebook page into a revenue-generating machine.

**Why This Beats Other Services:**

VS. Facebook Ads Management:
- Ads require budget ($500-$2,000/mo minimum)
- Takes time to optimize
- Risky if results don''t come fast
- VS. Facebook Monetization: NO ad spend, faster results, lower risk

VS. SEO Services:
- Takes 6-12 months to see results
- Complicated to explain ROI
- VS. Facebook Monetization: Results in 30 days, clear ROI

VS. Website Design:
- One-time project (no recurring)
- Competitive market
- VS. Facebook Monetization: Recurring revenue, unique positioning

**The Perfect Storm:**
1. Every business has Facebook (built-in audience)
2. Nobody is using it correctly (opportunity)
3. Organic reach still works (no ad spend needed)
4. Results are fast and measurable (easy to prove value)
5. It''s recurring (monthly retainer)

**Your Commission:**
- Course affiliates: 25% per sale ($49.25 per $197 course)
- Service delivery: $500-$2,000 per client per month
- If you sign 10 clients at $1,000/mo = $10,000 MRR for you

This is THE opportunity right now."

---

## PART 2: POSITIONING & PRICING (15 minutes)

**"How to Package and Price Your Offer"**

"Alright, let''s talk about how to position this service so businesses can''t say no.

### POSITIONING FRAMEWORK

**DON''T position as:**
- "Social media management"
- "Content creation"
- "Facebook marketing"

These are commoditized and businesses associate them with low value.

**DO position as:**
- "Facebook Revenue System"
- "Facebook Monetization Program"
- "Direct Response Facebook Strategy"

You''re not just managing their page. You''re building a SYSTEM that generates REVENUE.

### THE THREE-TIER PRICING MODEL

**Tier 1: Facebook Starter ($500/month)**
What''s included:
- 15 engagement posts per month
- DM conversation training for their team
- Monthly performance report
- Basic Local-Link CRM setup

Best for: Small businesses, solopreneurs, first-time clients

**Tier 2: Facebook Growth ($1,000/month)**
Everything in Starter, plus:
- 25 posts per month
- DM management (we handle 50% of conversations)
- Weekly optimization calls
- Advanced CRM automation
- Lead magnet creation

Best for: Established businesses ready to scale

**Tier 3: Facebook Authority ($2,000/month)**
Everything in Growth, plus:
- 40 posts per month
- Full DM management (we handle 100%)
- Video content creation
- Customer referral program setup
- Priority support

Best for: Businesses doing $50K+/month revenue

### VALUE-BASED PRICING SCRIPT

When they ask "Why does this cost so much?", here''s what you say:

"Great question. Let me break down the ROI:

If we help you generate just 5 extra customers per month at $300 average sale, that''s $1,500 in revenue.

Your investment with us is $[PRICE], which means you''re netting $[DIFFERENCE] in profit from customers you wouldn''t have gotten otherwise.

And that''s being VERY conservative. Most clients see 10-20 new customers per month once the system is dialed in.

So the real question isn''t ''Can you afford this?'' It''s ''Can you afford NOT to do this?''"

### POSITIONING STATEMENT

Use this when pitching:

"We help local businesses turn their Facebook page into a predictable revenue channel using our proven Post-to-DM-to-Deal system. Our clients typically see [X results] within [Y timeframe] without spending a dime on ads."

Simple. Clear. Results-focused.

---

## PART 3: THE SALES PROCESS (15 minutes)

**"How to Close Deals Fast"**

"Now let''s talk about HOW to actually sell this service. I''m going to give you the complete sales process:

### STEP 1: PROSPECTING

**Who to target:**
- Restaurants
- Salons/spas
- Home service providers (HVAC, plumbing, electrical)
- Professional services (attorneys, CPAs, consultants)
- Gyms/fitness studios
- Retail stores
- Any B2C local business

**Where to find them:**
- Local Facebook groups
- Chamber of Commerce
- Networking events
- Your existing network
- Cold outreach (DM or email)

**Opening Script (DM or Email):**

"Hey [Name],

I came across [Business Name] on Facebook and noticed you have [NUMBER] followers. That''s awesome!

Quick question: Are you currently monetizing your Facebook audience, or is it mostly just for brand awareness?

I ask because I help local businesses like yours turn their Facebook page into a revenue generator (our clients add $3K-$15K/mo in sales using a simple system).

Would you be open to a quick 15-minute call to see if this could work for [Business Name]?

[Your Name]"

Response rate: 20-30%

### STEP 2: DISCOVERY CALL

**The 15-Minute Framework:**

Minute 1-3: Build rapport
- "Thanks for hopping on! How''s business been?"
- "How long have you been in business?"

Minute 4-8: Identify pain
- "What are you currently doing for marketing?"
- "How''s Facebook working for you right now?"
- "What would you say is your #1 challenge with getting more customers?"

Minute 9-12: Present solution
- "Got it. So what we do is help businesses like yours turn their Facebook page into a lead and sales machine. We use a system called Post-to-DM-to-Deal where we create engagement posts that start conversations, then we (or your team) close those conversations into sales."
- "Our clients typically see [X result] within [Y timeframe]"

Minute 13-15: Close
- "Based on what you''ve told me, I think you''d be a great fit for our [TIER] program. Are you ready to move forward?"
- If yes: "Awesome! I''ll send you the agreement and we can get started next week."
- If hesitation: "What questions do you have?"

### STEP 3: HANDLING OBJECTIONS

**Objection #1: "I don''t have time for this"**
Response: "That''s exactly why we do this FOR you. You won''t be creating posts or managing DMs - we handle all of that. You just close the deals that we generate."

**Objection #2: "I tried Facebook before and it didn''t work"**
Response: "I totally get it. Most businesses approach Facebook the wrong way - they post about their services and hope people buy. Our system is different. We focus on starting CONVERSATIONS, not just getting likes. That''s why it works."

**Objection #3: "That''s expensive"**
Response: "I understand. Let me ask you this: If we bring you 5 extra customers per month, what''s that worth to your business? [They answer $X]. Okay, so you''d be paying $[YOUR PRICE] to make $[THEIR ANSWER]. That''s a [X]x return on investment. Would that work for you?"

**Objection #4: "Let me think about it"**
Response: "Of course! What specifically do you need to think about? Is it the price, the timeline, or something else? [Let them answer, then address that specific concern]"

### STEP 4: CLOSING

**The Direct Close:**
"Based on everything we''ve discussed, this sounds like a perfect fit. Are you ready to get started?"

**The Assumptive Close:**
"Great! I''ll send you the onboarding form. Do you prefer to start this week or next week?"

**The Urgency Close:**
"I only take on [X] new clients per month because I want to give each one my full attention. I have one spot open right now. Want to grab it?"

**Success Rate:**
If you follow this process:
- 10 discovery calls = 3-5 sales (30-50% close rate)
- Goal: 2-3 discovery calls per day = 20-30 new clients per month

---

## PART 4: DELIVERY & SCALING (10 minutes)

**"How to Deliver Without Burning Out"**

"Okay, you''re closing clients. Now how do you DELIVER the service without working 80 hours a week?

### MONTH 1: FOUNDATION (5 hours total)

**Week 1: Setup**
- Audit their Facebook page
- Connect Local-Link CRM
- Create content calendar
- Train their team on DM handling (if Tier 1)
Time: 2 hours

**Week 2-4: Execution**
- Create/schedule posts (15-25-40 depending on tier)
- Monitor engagement
- Handle DMs (if Tier 2/3)
- Weekly check-in
Time: 1 hour per week = 3 hours

### MONTH 2+: MAINTENANCE (3-4 hours/month)

Once the system is running:
- Content creation: 1 hour
- DM management: 1-2 hours
- Reporting/optimization: 1 hour

**The Automation Secret:**
Use Local-Link CRM to automate:
- Lead capture from Facebook
- Follow-up sequences
- Appointment booking
- Deal tracking

This cuts your workload in HALF.

### SCALING MODEL

**Phase 1: You do everything (1-5 clients)**
- Goal: Perfect the system
- Income: $2,500-$10,000/mo

**Phase 2: Hire VA for content (6-15 clients)**
- You handle sales & strategy
- VA creates posts
- Income: $6,000-$30,000/mo
- VA cost: $500-$1,000/mo

**Phase 3: Hire DM manager (16-30 clients)**
- You handle sales only
- Team handles delivery
- Income: $16,000-$60,000/mo
- Team cost: $2,000-$4,000/mo

**Phase 4: Build agency (30+ clients)**
- Hire sales team
- Build delivery team
- You focus on systems
- Income: $30,000-$150,000+/mo

### WHITE-LABEL SOLUTION

Don''t want to do fulfillment at all?

Local-Link offers **white-label fulfillment** where we:
- Create all content
- Manage DMs
- Handle reporting
- You keep 40-60% margin

You sell, we deliver. Perfect for scaling fast.

---

## PART 5: SUPPORT & RESOURCES (5 minutes)

**"Everything You Need to Succeed"**

"Alright, so here''s what you get as a Local-Link partner:

**Included in Your Partnership:**
✅ Complete Facebook Monetization course (give to clients or sell)
✅ DM scripts and templates
✅ Post swipe files (200+ proven posts)
✅ Sales scripts and objection handlers
✅ Client onboarding templates
✅ Monthly partner training calls
✅ Private partner Facebook group
✅ White-label fulfillment option

**Your Commission Structure:**
- Course sales: 25% ($49.25 per sale)
- Service delivery: 100% (you set your prices)
- White-label fulfillment: 40-60% margin

**Getting Started:**
1. Take the Facebook Monetization course yourself (know it inside-out)
2. Pick your 3 dream clients
3. Reach out using the scripts we covered
4. Close your first deal this week
5. Deliver results and ask for referrals

---

## CLOSING & CALL-TO-ACTION (5 minutes)

**"Your Next Move"**

"So let me bring this all together:

You now know:
✅ Why Facebook monetization is the perfect service to sell
✅ How to position and price your offers
✅ The exact sales process to close deals
✅ How to deliver without burning out
✅ How to scale to $10K-$50K per month

The question is: What are you going to DO with this information?

**Option 1:** Do nothing and stay exactly where you are.

**Option 2:** Take action TODAY and start building your Facebook monetization agency.

For those choosing Option 2, here''s your action plan:

### THIS WEEK:
- Day 1: Make a list of 20 local businesses to contact
- Day 2-3: Send outreach messages using the script
- Day 4-5: Book discovery calls
- Day 6-7: Close your first 1-3 clients

### THIS MONTH:
- Close 5-10 clients
- Deliver exceptional results
- Get testimonials and referrals
- Reinvest profits into team

### THIS QUARTER:
- Scale to 20-30 clients
- Build your team
- Systemize delivery
- Hit $20K-$50K per month

---

**PARTNER RESOURCES:**

Everything we covered today is available in your partner portal:
- [Link to sales scripts]
- [Link to post templates]
- [Link to white-label services]
- [Link to partner community]

**BONUS FOR TODAY''S ATTENDEES:**

If you close your first Facebook monetization client in the next 7 days and send me proof, I''ll personally review your delivery process and give you custom feedback.

Just DM me with "FIRST CLIENT" and your client details.

---

**Final Thoughts:**

"Look, every local business needs this service. The demand is MASSIVE.

The only question is: Are YOU going to be the one providing it?

The businesses in your market are going to find someone to help them monetize Facebook. Why not make sure that someone is YOU?

Start reaching out today. Use the scripts. Book the calls. Close the deals.

I''ll see you in the partner group. Now go get it!"

---

## POST-WEBINAR FOLLOW-UP

**Immediately after:**
- Email replay + script download link
- Post in partner Facebook group
- Tag active participants

**Next 3 days:**
- Share partner success stories
- Host Q&A in Facebook group
- DM those who asked specific questions

**Next 7 days:**
- Check in on first client wins
- Share additional resources
- Invite to next advanced training

**Ongoing:**
- Weekly partner accountability calls
- Monthly case study shares
- Quarterly partner mastermind events',
        50,
        false
      )
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
      
    END IF;
  END IF;
END $$;