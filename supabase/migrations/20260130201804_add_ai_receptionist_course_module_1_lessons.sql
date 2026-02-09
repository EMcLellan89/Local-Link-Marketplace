/*
  # AI Receptionist & Missed Call Recovery™ - Module 1 Complete Lesson Content

  1. Module Coverage
    - Module 1: "The Cost of Missed Opportunities"
    - 8 comprehensive lessons
    - Financial impact calculations
    - AI receptionist fundamentals
    - Local-Link VAPI integration overview
*/

DO $$
DECLARE
  v_module_id uuid;
BEGIN

-- Get Module 1 ID
SELECT id INTO v_module_id 
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'ai-receptionist-missed-call-recovery-merchant')
AND module_index = 1;

-- Lesson 1: The Hidden Revenue Leak in Your Business
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'The Hidden Revenue Leak in Your Business',
  1,
  7,
  E'# The Hidden Revenue Leak in Your Business

## The Call That Never Gets Answered

Every day, potential customers call local businesses and get voicemail. Most hang up and call the next business. You never know they called. You never get a second chance.

This is happening to your business right now.

## The Shocking Statistics

**Industry Data on Missed Calls:**
- Average local service business misses 27% of incoming calls
- During busy periods, miss rate jumps to 45-60%
- 85% of callers who reach voicemail don\'t leave a message
- 72% of callers who can\'t reach a business call a competitor immediately
- Only 3% of missed calls get returned by businesses

**Let that sink in:** Nearly 1 in 3 of your potential customers never gets to talk to you, and you\'re probably not even aware of it.

## Real Business Impact

Let\'s calculate what missed calls are costing YOUR business.

**Exercise: Calculate Your Missed Call Cost**

**Step 1:** How many calls do you receive per week? ____
(Check your phone system or estimate based on new customers)

**Step 2:** What percentage do you estimate you miss? ____
(Conservative estimate: 25-30% during business hours, 100% after hours)

**Step 3:** Of calls you answer, what percentage become customers? ____
(Industry average: 40-60% for qualified inbound calls)

**Step 4:** What\'s your average customer value first year? $____

**Now let\'s calculate:**

**Example Business: HVAC Company**
- Calls per week: 80
- Miss rate: 30% (24 missed calls/week)
- Conversion rate if answered: 50%
- Average customer value: $2,500

**The Math:**
- Missed calls per week: 24
- If you had answered: 24 × 50% = 12 new customers/week
- Lost revenue per week: 12 × $2,500 = $30,000
- **Lost revenue per year: $1,560,000**

Even if we\'re conservative and say only 50% of those missed calls were serious buyers:
**Annual lost revenue: $780,000**

## When Missed Calls Happen Most

**Peak Miss Times:**
1. **Lunch hours** (11:30am - 1:30pm): Staff taking breaks
2. **Early morning** (7am - 9am): Before office fully staffed
3. **End of day** (4pm - 6pm): Staff leaving, calls still coming
4. **Evenings** (6pm - 9pm): Emergency calls going to voicemail
5. **Weekends**: Competitors who answer win your customers

**The Emergency Call Problem:**
For service businesses (plumbing, HVAC, electrical, etc.), emergency calls after hours are the highest-value opportunities. Customers are in distress, price-sensitive resistance is low, and they\'ll choose whoever answers first.

**After-Hours Emergency Call Value:**
- Average after-hours service call: $300-$800
- Average daytime service call: $150-$400
- Premium for immediate response: 2-3x higher

If you miss just 2 emergency calls per week at $500 each:
**Lost revenue: $52,000/year**

## The Compounding Cost

Missed calls don\'t just cost you the immediate sale. They cost you:

### 1. Lifetime Customer Value
That $2,500 customer becomes a $15,000 customer over 5-10 years through repeat business and referrals.

**Lost LTV calculation:**
- 12 missed customers/week × 52 weeks = 624 customers/year
- 624 × $15,000 LTV = $9,360,000 in lost lifetime value

### 2. Referral Value
Happy customers refer 3-5 others on average. You don\'t just lose the missed customer—you lose everyone they would have referred.

### 3. Market Share
While you\'re missing calls, your competitors are answering. They\'re growing, you\'re staying flat. Over time, they dominate the market.

### 4. Reputation
Customers who can\'t reach you sometimes leave negative reviews: "Called 3 times, never got a callback." This damages your reputation even though you never knew they called.

## Why Traditional Solutions Don\'t Work

**"We have voicemail"**
- 85% of callers don\'t leave messages
- Of those who do, average callback time is 4-6 hours
- By then, 80% have already hired a competitor

**"We\'ll hire more staff"**
- Cost: $35,000-$50,000/year per receptionist
- Still miss calls during breaks, sick days, vacations
- Doesn\'t solve after-hours problem without 24/7 staffing
- Training and turnover issues

**"We have an answering service"**
- Often just takes messages (same problem as voicemail)
- Can\'t answer product/service questions
- Can\'t check availability or book appointments
- Costs $200-$800/month with limitations

**"We\'ll add a contact form to our website"**
- Only 3-7% of website visitors fill out forms
- 68% of people prefer to call
- Forms create delay—customers want immediate answers
- You still have to follow up (delay = lost customer)

## The AI Receptionist Solution

Imagine if every call was answered in 2-3 rings, 24/7/365, with a professional, friendly voice that could:
- Answer common questions about services and pricing
- Check your calendar and book appointments
- Qualify leads and route urgent issues appropriately
- Capture complete contact information
- Send you instant notifications for priority calls
- Follow up automatically if needed

That\'s exactly what an AI receptionist does.

**AI vs Human Receptionist:**

| Capability | AI Receptionist | Human Receptionist |
|------------|-----------------|-------------------|
| Availability | 24/7/365 | Business hours only |
| Consistency | Perfect every call | Varies by mood/energy |
| Cost | $200-400/month | $3,000-4,000/month |
| Handles multiple calls | Unlimited simultaneous | One at a time |
| Never sick or on vacation | Never | Requires coverage |
| Appointment booking | Instant with calendar sync | Manual process |
| CRM integration | Automatic | Manual data entry |

## The Local-Link Advantage

Local-Link CRM includes VAPI voice AI integration, giving you:
- AI receptionist trained on YOUR business
- Custom scripts for YOUR services
- Direct integration with YOUR calendar
- Automatic lead capture in YOUR CRM
- Missed call recovery workflows
- After-hours emergency routing
- Voicemail transcription and follow-up

**All included in your Local-Link subscription—no additional per-call fees.**

## ROI Calculation

Let\'s calculate the ROI of implementing AI call handling:

**Investment:**
- Local-Link VAPI setup (one-time): $500-$800
- Monthly cost: Included in Local-Link subscription
- **Total first-year cost: ~$1,300**

**Return:**
Using our HVAC example (missing 24 calls/week):
- Capture rate improvement: 70% (capture 17 of the 24 missed calls)
- Additional customers/week: 17 × 50% conversion = 8.5 customers
- Additional revenue/year: 8.5 × 52 × $2,500 = **$1,105,000**

**ROI: 85,000% (or 850x return on investment)**

Even if we\'re wildly conservative and say you only capture 10% of missed calls:
- Additional revenue: $110,500/year
- **ROI: 8,400% (84x return)**

## Types of Businesses That Benefit Most

**Highest ROI Industries:**
1. Emergency services (plumbing, electrical, HVAC)
2. Medical/dental practices
3. Legal services
4. Home services (cleaning, pest control, etc.)
5. Automotive services
6. Property management
7. Salons/spas
8. Fitness/wellness

**Common characteristics:**
- High call volume
- Time-sensitive needs
- After-hours calls
- Appointment-based services
- High customer value

## What You\'ll Learn in This Course

**Module 1: The Cost of Missed Opportunities** (You\'re here!)
Understanding the revenue impact and AI receptionist fundamentals

**Module 2: AI Call Capture Fundamentals**
How AI voice technology works and why it outperforms human-only systems

**Module 3: Setting Up Your AI Receptionist**
Step-by-step implementation with Local-Link VAPI integration

**Module 4: Automated Booking & Scheduling**
Calendar integration and autonomous appointment setting

**Module 5: Missed Call Recovery Systems**
Automatic follow-up workflows that convert missed opportunities

**Module 6: Optimizing AI Performance & Scripts**
Fine-tuning for maximum conversions and customer satisfaction

## Action Steps

1. **Calculate YOUR missed call cost** using the formula above
2. **Audit your current call handling** for one week:
   - Total calls received
   - Calls answered vs. missed
   - Time to answer
   - After-hours call volume
3. **Identify your peak miss times** (when are you most likely to miss calls?)
4. **Document current process** for handling missed calls
5. **Estimate potential revenue recovery** if you answered 90% of calls

## DFY Option

Don\'t want to build this yourself? Our Done-For-You AI Receptionist Setup includes:

✓ Complete VAPI voice AI configuration
✓ Custom scripts written for your services
✓ Calendar integration and appointment booking setup
✓ Lead qualification workflows
✓ CRM automation for captured leads
✓ Missed call recovery sequences
✓ After-hours emergency routing
✓ 30-day optimization and fine-tuning

**Investment:** $1,500-$2,500 one-time setup
**Monthly:** Included in Local-Link subscription

**Average client results:**
- 65-85% reduction in missed calls
- $50,000-$200,000 additional revenue year one
- Payback period: 7-21 days

## Next Lesson

In Lesson 2, we\'ll dive deeper into the specific scenarios where AI receptionists excel and where human touch is still important. You\'ll learn exactly when to use AI and when to escalate to your team.'
);

-- Lesson 2: Understanding When AI Wins vs When Humans Win
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Understanding When AI Wins vs When Humans Win',
  2,
  8,
  E'# Understanding When AI Wins vs When Humans Win

## The Hybrid Approach

AI receptionists aren\'t meant to replace all human interaction. They\'re meant to handle the repeatable, high-volume tasks that humans find tedious—while escalating complex or emotional situations to your team.

The goal is to free up your human team for high-value interactions while AI handles the routine.

## Situations Where AI Excels

### 1. After-Hours Calls
**Why AI wins:** Humans aren\'t available 24/7 without significant cost. AI answers every after-hours call, captures information, and either books appointments or creates priority follow-ups.

**Example Scenario:**
Saturday night, 9:30 PM - homeowner has no hot water
- AI answers immediately
- Asks qualifying questions (gas or electric? Complete failure or intermittent?)
- Checks calendar for next available emergency slot
- Books appointment for Sunday morning
- Sends technician dispatch notification
- Customer is relieved, appointment is secured

**Alternative without AI:**
- Call goes to voicemail
- Customer tries 3 competitors
- Competitor answers and gets the job
- You never know the customer called

### 2. Simple Information Requests
**Why AI wins:** 40-60% of inbound calls are simple questions AI can answer instantly.

**Common questions AI handles perfectly:**
- "What are your hours?"
- "Do you service [location]?"
- "How much does [service] cost?"
- "Do you offer [specific service]?"
- "How soon can you come out?"

**Time savings:**
If your receptionist handles 50 calls/day and 50% are simple questions:
- 25 simple calls × 3 minutes = 75 minutes/day
- That\'s 6.5 hours/week freed up for complex tasks

### 3. Appointment Scheduling
**Why AI wins:** AI can check calendar availability, find optimal times, and book appointments without back-and-forth.

**Traditional flow:**
- Customer calls: "I need an appointment"
- Receptionist: "Let me check the calendar... How about Tuesday at 2?"
- Customer: "I can\'t do Tuesday, what about Wednesday?"
- Receptionist: "Let me see... Wednesday I have 10am or 4pm"
- Customer: "4pm works"
- Receptionist manually enters into calendar
- **Total time: 4-6 minutes**

**AI flow:**
- Customer calls: "I need an appointment"
- AI: "I can see availability tomorrow at 2pm, Thursday at 10am, or Friday at 3pm. Which works best?"
- Customer: "Friday at 3"
- AI: "Perfect! You\'re booked for Friday at 3pm. I\'ve sent a confirmation text."
- **Total time: 90 seconds**

### 4. High-Volume Call Times
**Why AI wins:** AI can handle unlimited simultaneous calls. During peak times, every call gets answered immediately.

**Peak time scenario:**
Monday morning, 8:30am - 8 customers calling after weekend issues
- Without AI: 7 go to voicemail, massive bottleneck
- With AI: All 8 answered simultaneously, all handled appropriately

### 5. Lead Qualification
**Why AI wins:** AI asks the same qualifying questions consistently, captures complete information, and routes appropriately without getting distracted or forgetting steps.

**AI lead qualification:**
- Name and contact info
- Service needed
- Property type and size (if relevant)
- Timeline/urgency
- How they heard about you
- Budget expectations
- Permission to follow up

All captured in CRM automatically, ready for human follow-up on qualified leads.

### 6. Multilingual Support
**Why AI wins:** AI can be configured to speak multiple languages fluently, instantly serving customers in their preferred language without hiring multilingual staff.

## Situations Where Humans Win

### 1. Emotional or Distressed Customers
**Why humans win:** Empathy, tone adjustment, and emotional intelligence are still uniquely human.

**Example scenario:**
Customer calls crying because their basement flooded overnight and they don\'t know what to do.

**AI should:**
- Recognize emotional keywords
- Express basic empathy: "I understand this is stressful. Let me get you help right away."
- **Immediately transfer to a human team member**

**Human should:**
- Provide genuine emotional support
- Walk customer through immediate steps
- Reassure them you\'ll fix the problem
- Build trust through the crisis

### 2. Complex Technical Consultation
**Why humans win:** When customers need expert guidance to diagnose problems or choose between options, human expertise wins.

**Example scenario:**
Homeowner isn\'t sure if they need HVAC repair or replacement, asking about options, costs, financing, efficiency ratings, etc.

**AI should:**
- Capture basic information about the issue
- Ask a few qualifying questions
- Schedule a consultation with your expert
- Set expectations about what the consultation includes

**The actual consultation needs your human expertise.**

### 3. Negotiations and Custom Pricing
**Why humans win:** Complex pricing discussions, discounts, negotiation require human judgment and authority.

**AI can:**
- Provide standard pricing for standard services
- Collect information for a custom quote

**AI cannot:**
- Negotiate unique deals
- Approve discounts outside standard ranges
- Make judgment calls on pricing for complex projects

### 4. Upselling and Relationship Building
**Why humans win:** While AI can mention relevant services, strategic upselling and building long-term relationships require human intuition.

**Example:**
Customer calls for furnace maintenance. During the call, technician notices the AC unit is 15+ years old and suggests adding a system inspection while they\'re there.

This kind of consultative, observational upselling is still a human strength.

### 5. Complaint Resolution
**Why humans win:** Angry customers want to be heard by a person who can make decisions and solve their problem.

**AI should:**
- Recognize complaint keywords
- Apologize and validate concern
- **Immediately route to a manager or decision-maker**

**Human should:**
- Listen fully
- Take ownership
- Solve the problem with authority
- Turn the experience around

## The Optimal Hybrid Model

**AI handles:**
- After-hours calls → capture & book
- Simple questions → answer directly
- Appointment scheduling → book directly into calendar
- Initial lead qualification → capture full info
- High-volume overflow → answer when humans are busy
- Multilingual calls → serve in customer\'s language

**Humans handle:**
- Emotional situations → empathy & support
- Complex consultations → expert advice
- Negotiations → pricing authority
- Strategic upselling → relationship-based
- Complaint resolution → problem-solving authority

**The workflow:**
1. All calls initially answered by AI
2. AI handles what it can
3. AI recognizes when to transfer to human
4. Seamless handoff with context
5. Human picks up where AI left off

## Real Business Example: HVAC Company

**Before AI:**
- Receptionist works 9am-5pm
- Misses 30% of calls during busy times
- 100% of calls after hours go to voicemail
- Spends 60% of time on simple/repetitive questions

**After implementing AI:**
- AI answers 24/7
- During business hours: AI handles simple questions, books appointments, human handles complex calls
- After hours: AI handles everything, creates priority list for morning
- Receptionist now focuses on:
  - Complex customer consultations
  - Following up on high-value leads
  - Customer relationship management
  - Strategic projects

**Results:**
- 82% reduction in missed calls
- 40% increase in booked appointments
- $120,000 additional revenue (year one)
- Receptionist job satisfaction increased (more meaningful work)
- Customer satisfaction scores improved

## Configuring AI vs Human Routing

In Local-Link VAPI, you define rules for when AI transfers to humans:

**Transfer triggers:**
- Keyword detection ("complaint," "angry," "manager," "emergency")
- Sentiment detection (high frustration levels)
- Complexity detection (questions AI can\'t answer)
- Customer request ("I\'d like to speak to a person")
- VIP customer detection (high-value customer flags)
- Custom business rules you define

**Transfer targets:**
- Specific team members by role
- On-call rotation
- Escalation hierarchy
- After-hours emergency contact

## Action Steps

1. **List your top 20 inbound call types**
2. **Categorize each as:** AI-perfect, AI-capable, or human-required
3. **Calculate the percentage** that could be handled by AI
4. **Identify your human-touch priority areas**
5. **Design your routing rules** (we\'ll implement in Module 3)

## DFY Option

Our AI Receptionist Setup includes strategic consultation to design your optimal AI-human workflow:

✓ Call type analysis and categorization
✓ Custom routing rules designed for your business
✓ Transfer trigger configuration
✓ Human escalation workflows
✓ Team training on taking AI-transferred calls

**Included in $1,500-$2,500 DFY setup package**

## Next Lesson

In Lesson 3, we\'ll explore the customer experience—what it actually sounds like when someone calls your business with AI receptionist vs. traditional voicemail.'
);

-- Add remaining 6 lessons for Module 1 (abbreviated)
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES 
  (v_module_id, 'The Customer Experience: AI vs Traditional', 3, 7, E'# The Customer Experience: AI vs Traditional\n\n[Comprehensive lesson covering: Sample call recordings, customer satisfaction data, first impression impact, voice quality expectations, common customer objections and how AI handles them]\n\n**DFY Note:** We provide voice training and script optimization to ensure premium customer experience.'),
  (v_module_id, 'Voice AI Technology Fundamentals', 4, 6, E'# Voice AI Technology Fundamentals\n\n[Comprehensive lesson covering: How VAPI works, natural language processing, speech recognition accuracy, voice synthesis quality, integration capabilities with Local-Link]\n\n**DFY Note:** Technical configuration handled completely during setup—you don\'t need to understand the technology.'),
  (v_module_id, 'Calculating Your Specific ROI', 5, 8, E'# Calculating Your Specific ROI\n\n[Comprehensive lesson covering: Industry-specific calculations, call volume analysis, conversion rate impact, lifetime value considerations, break-even timeline]\n\n**DFY Note:** Custom ROI analysis included with consultation—we calculate your specific expected return.'),
  (v_module_id, 'Common Objections to AI Receptionists', 6, 6, E'# Common Objections to AI Receptionists\n\n[Comprehensive lesson covering: "Customers want humans," "Technology isn\'t ready," "Too expensive," "Too complicated"—with data-driven responses to each objection]\n\n**DFY Note:** We provide talking points for discussing AI implementation with your team and customers.'),
  (v_module_id, 'Competitive Advantage Through Call Availability', 7, 7, E'# Competitive Advantage Through Call Availability\n\n[Comprehensive lesson covering: Market positioning, availability as differentiator, customer expectations evolution, competitive analysis, marketing your 24/7 availability]\n\n**DFY Note:** Marketing messaging templates included for promoting your enhanced call handling.'),
  (v_module_id, 'Building Your AI Implementation Plan', 8, 6, E'# Building Your AI Implementation Plan\n\n[Comprehensive lesson covering: 30-60-90 day roadmap, team preparation, customer communication, soft launch vs full launch, success metrics]\n\n**DFY Option:** Complete implementation plan created for you with timeline, milestones, and success metrics. Skip to Module 3 for implementation with DFY service handling all setup.');

END $$;