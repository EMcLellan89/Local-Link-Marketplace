/*
  # Add Merchant Webinar: "Turn Your Facebook Page Into a Revenue Machine"

  ## Overview
  Creates a comprehensive merchant-focused webinar that teaches local business owners
  how to monetize their Facebook presence without ads.

  ## Webinar Details:
  - Target: Local business owners (restaurants, salons, contractors, retailers, etc.)
  - Duration: ~45 minutes
  - Goal: Show them how to generate revenue from Facebook organically
  - CTA: Enroll in course or book strategy session

  ## Structure:
  - Introduction & Hook (5 min)
  - Problem Identification (10 min)
  - Solution Framework (15 min)
  - Case Studies (10 min)
  - Action Plan (5 min)
*/

-- Create the merchant webinar course
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
  'merchant-webinar-facebook-monetization',
  'Merchant Webinar: Turn Your Facebook Page Into a Revenue Machine',
  'Stop Posting for Likes. Start Posting for Profit.',
  'A 45-minute live training showing local business owners exactly how to generate consistent revenue from their Facebook page without spending money on ads. Learn the proven "Post to DM to Deal" system that local businesses are using to add $3,000-$15,000 per month in revenue.',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  true,
  'merchant'
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
  SELECT id INTO v_course_id FROM courses WHERE slug = 'merchant-webinar-facebook-monetization';
  
  IF v_course_id IS NOT NULL THEN
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (
      v_course_id, 
      1, 
      'Complete Webinar Training',
      '45-minute webinar training on Facebook monetization for local businesses'
    )
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module_id;
    
    IF v_module_id IS NULL THEN
      SELECT id INTO v_module_id FROM course_modules WHERE course_id = v_course_id AND module_index = 1;
    END IF;
    
    IF v_module_id IS NOT NULL THEN
      -- Lesson 1: Full Webinar Script
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, is_preview)
      VALUES (
        v_module_id,
        1,
        'Full Webinar Presentation Script',
        '# Merchant Webinar: Turn Your Facebook Page Into a Revenue Machine

## PRE-WEBINAR (Before Going Live)
**Chat with early attendees:**
- Welcome everyone as they join
- Ask: "Where are you joining from and what type of business do you run?"
- Build rapport and get people engaged in chat

---

## INTRODUCTION & HOOK (5 minutes)

**Opening:**
"Hey everyone! Welcome to today''s training. My name is [NAME] and I''m fired up to be here with you today because we''re going to talk about something that most local business owners are doing COMPLETELY WRONG on Facebook.

You know what I''m talking about... You post pictures of your work, share updates about your business, maybe even go live once in a while... and what happens? 

A few likes. Maybe a comment or two from your mom. But no actual MONEY hitting your bank account.

Here''s the truth: **Your Facebook page should be making you money. Real money. Consistent money.**

In the next 45 minutes, I''m going to show you exactly how to turn your Facebook page into a revenue-generating machine that brings in $3,000, $5,000, even $10,000+ per month in EXTRA revenue without spending a dime on ads."

**Agenda Overview:**
1. Why your current Facebook strategy isn''t working (and it''s not your fault)
2. The simple 3-step system that turns posts into profit
3. Real case studies from businesses just like yours
4. Your 30-day action plan to get your first sales

**Ground Rules:**
- Stay until the end (I have a special gift for those who stay)
- Take notes
- Ask questions in the chat
- Turn off distractions

---

## PART 1: THE PROBLEM (10 minutes)

**"Why Most Local Businesses Fail at Facebook"**

"Let me ask you something... be honest in the chat:
- How many of you post on Facebook regularly but rarely get sales from it?
- How many of you feel like you''re just shouting into the void?
- How many of you have tried Facebook ads and either lost money or got terrible results?

I see a lot of hands (or chat messages) going up. And here''s why this is happening:

**Mistake #1: You''re treating Facebook like a billboard.**
You post your services, your prices, your promotions... and then wonder why nobody is buying. People don''t go on Facebook to shop. They go to be entertained and stay connected.

**Mistake #2: You''re focused on the wrong metrics.**
You''re worried about likes, followers, and reach. But those vanity metrics don''t pay your bills. I''d rather have 200 engaged followers who buy than 10,000 random followers who never spend a dime.

**Mistake #3: You''re not having conversations.**
You post and ghost. You share content but never engage. The money is in the CONVERSATION, not the post itself.

**Mistake #4: You think you need to spend money on ads.**
Facebook wants you to believe this. But here''s the truth: Some of the most successful local businesses on Facebook have never run a single ad. They use organic strategies that we''re going to cover today.

**The Real Problem:**
Nobody taught you the right way to use Facebook for your business. Your competitors aren''t doing it right either. Everyone is just copying what everyone else is doing wrong.

But there''s good news..."

---

## PART 2: THE SOLUTION (15 minutes)

**"The Post to DM to Deal System"**

"What if I told you there''s a simple 3-step system that local businesses are using right now to generate thousands of dollars per month from Facebook organically?

No ads. No complicated funnels. Just simple posts, strategic conversations, and closed deals.

I call it the **Post to DM to Deal** system. Let me break it down:

### STEP 1: The Engagement Post

Instead of posting about your services, you post content designed to start CONVERSATIONS.

Examples:
- Poll posts: "Quick question: What''s the #1 thing stopping you from [getting result]? A) Lack of time, B) Cost, C) Not sure where to start, D) Something else"
- Fill-in-the-blank: "I wish someone would just handle my _____ so I could focus on running my business."
- Story posts: "Remember when [relatable struggle]? Here''s what changed everything for me..."

These posts get people to COMMENT. And when they comment, you have permission to start a conversation.

### STEP 2: The DM Transition

Once someone comments, you move the conversation to direct message. Here''s the script:

"Hey [Name]! I saw your comment on my post about [topic]. I''d love to chat more about that. Mind if I send you a quick message?"

Or even simpler: Just react to their comment with a heart/like, then send them a friendly DM:

"Hey [Name]! Thanks for engaging with my post. I''d love to learn more about your situation. Are you currently [relevant business challenge]?"

The goal is to get them TALKING in a private conversation where you can learn about their needs.

### STEP 3: The Natural Close

In the DM, you follow this simple framework:
1. ASK questions about their situation
2. LISTEN to their pain points
3. PRESENT your solution naturally
4. CLOSE with a clear call-to-action

Example:
- You: "So it sounds like you''re struggling with [their problem]. How long has this been going on?"
- Them: "About 6 months now..."
- You: "Got it. And what happens if you don''t solve this soon?"
- Them: "My business will keep struggling..."
- You: "I totally understand. Good news is, this is exactly what we help with. We have a [service] that handles [specific solution]. Most of our clients see results within [timeframe]. Would you like me to send you some details?"

It''s that simple. Natural conversation that leads to a sale.

**The Magic of This System:**

✅ No ads required
✅ Works with any size following
✅ Takes 30 minutes per day
✅ Scales as you grow
✅ Builds real relationships

---

## PART 3: CASE STUDIES (10 minutes)

**"Real Businesses Getting Real Results"**

Let me share a few quick examples of businesses using this exact system:

**Case Study 1: Local HVAC Company**
- Started with 400 Facebook followers
- Posted "Poll: When''s the last time you had your AC serviced? A) This year, B) 1-2 years ago, C) I don''t remember, D) What''s AC servicing?"
- Got 47 comments
- Moved 12 people to DM conversations
- Closed 5 maintenance agreements at $299 each
- **Result: $1,495 from one post**

**Case Study 2: Hair Salon Owner**
- Created post: "Fill in the blank: The worst part about finding a new salon is _____"
- Got 83 comments from local women
- DMed 20 of them offering "New Client VIP Experience"
- Booked 14 appointments at $120 average
- **Result: $1,680 + ongoing recurring clients**

**Case Study 3: Landscaping Business**
- Posted before/after photos with "Comment your address if you want a free quote"
- 31 people commented
- Sent personalized DMs with rough estimates
- Closed 8 jobs averaging $850 each
- **Result: $6,800 from one post**

See the pattern? 
- Engaging post
- Move to DMs
- Close the deal

This works for ANY local business. Restaurants, contractors, salons, gyms, attorneys, consultants, retailers... everyone.

---

## PART 4: YOUR ACTION PLAN (5 minutes)

**"The 30-Day Facebook Money Plan"**

Alright, here''s exactly what to do starting TODAY to get your first sales from Facebook:

**Week 1: Foundation**
- Day 1-2: Audit your Facebook page. Update profile, cover photo, and about section
- Day 3-4: Create 7 engagement posts (polls, questions, fill-in-blanks)
- Day 5-7: Post one per day and practice moving commenters to DMs

**Week 2: Conversations**
- Start having 3-5 DM conversations per day
- Practice the question framework (ASK → LISTEN → PRESENT → CLOSE)
- Goal: Have at least 15 sales conversations this week

**Week 3: Closing**
- Focus on closing your first 3-5 deals
- Refine your DM script based on what''s working
- Document your process

**Week 4: Scale**
- Increase posting frequency (2-3x per day)
- Add team member to help with DM follow-up
- Track your metrics: Posts → Comments → DMs → Sales

**The Numbers:**
If you follow this plan consistently:
- 20 engaging posts = 200-400 comments
- 200 comments = 50 DM conversations
- 50 conversations = 10-15 sales (20-30% close rate)
- 10 sales × $300 average = **$3,000 in your first month**

And it scales from there. Month 2: $5,000. Month 3: $8,000+.

---

## CLOSING & CALL-TO-ACTION (5 minutes)

**"Your Next Steps"**

"Alright, so here''s where you are right now:

You know the system. You have the framework. You understand it works.

Now you have a choice:

**Option 1:** Try to figure this out on your own. Post randomly, hope for the best, maybe get some results after months of trial and error.

**Option 2:** Get the complete step-by-step blueprint that walks you through EXACTLY what to post, what to say in DMs, how to close deals, and how to scale to $10K+ per month.

For those of you who want Option 2, I have something special:

**[OFFER]**
I''ve created the complete **Facebook Monetization for Local Businesses™** course that includes:
- 8 modules covering every step of the system
- 30+ video lessons
- DM scripts and templates
- Post swipe files
- Real conversation examples
- Certificate upon completion

**Investment:** Only $197 (less than the profit from your first sale)

**BONUS for today''s attendees:**
If you enroll in the next 24 hours, I''m also including:
- Private Facebook group access
- Monthly Q&A calls
- Local-Link CRM integration guide (automate your follow-up)

**Click the link in the chat to enroll now: [ENROLLMENT LINK]**

---

**"But wait, there''s more..."**

For those of you who want DONE-FOR-YOU help:

We also offer a **VIP Implementation Package** where we:
- Set up your entire system
- Write your posts
- Train your team
- Handle everything for you

If you''re interested in VIP, send me a DM with "VIP" and I''ll send you details.

---

**Final Thoughts:**

"Look, most business owners will watch this webinar, think ''that''s cool,'' and then do nothing.

Don''t be that person.

You have everything you need to start making money from Facebook TODAY. Pick one engagement post, share it, start conversations, and close deals.

And if you want the complete roadmap, grab the course at the link in the chat.

I''ll see you on the inside. Thanks for joining me today. Now go make some money!"

---

## POST-WEBINAR FOLLOW-UP

**Immediately after:**
- Email all attendees with replay link
- Send special offer reminder (24-hour deadline)
- DM those who asked questions

**Next 3 days:**
- Email sequence with testimonials
- Share case studies
- Final enrollment reminder

**Next 7 days:**
- Check in with those who enrolled
- Invite non-buyers to free Facebook group
- Plant seeds for next webinar',
        45,
        false
      )
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
      
    END IF;
  END IF;
END $$;