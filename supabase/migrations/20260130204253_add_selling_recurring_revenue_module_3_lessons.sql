/*
  # Selling Recurring Revenue™ - Module 3: Overcoming Monthly Fee Objections

  Comprehensive lesson content for Module 3 of the partner course "Selling Recurring Revenue™"

  Module 3 covers how to handle "I don't want to pay monthly" objections with specific scripts and responses.

  Lessons:
  1. Understanding the Monthly Fee Resistance (7 min)
  2. The Total Cost Comparison Script (8 min)
  3. Handling "Too Expensive" Objections (8 min)
  4. The Risk Reversal Technique (7 min)
  5. Payment Psychology and Framing (8 min)
  6. The Pause and Cancel Policy (7 min)
  7. When to Walk Away (6 min)
  8. Your Objection Response Playbook (6 min)
*/

DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  -- Get course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-recurring-revenue-partner';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found: selling-recurring-revenue-partner';
  END IF;

  -- Get Module 3 ID
  SELECT id INTO v_module_id FROM course_modules
  WHERE course_id = v_course_id AND module_index = 3;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module 3 not found for Selling Recurring Revenue course';
  END IF;

  -- Lesson 1: Understanding the Monthly Fee Resistance
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'Understanding the Monthly Fee Resistance',
    1,
    7,
    E'# Understanding the Monthly Fee Resistance

## Why Merchants Resist Monthly Fees

**The objection sounds like:**
- "I don''t want another monthly bill"
- "Can I just pay once?"
- "Monthly fees add up"
- "I prefer to own it outright"

**What they''re really saying:**
- "I don''t trust this will keep delivering value"
- "I''m afraid I''ll forget about it and waste money"
- "I want control over when I spend"
- "I''ve been burned by subscriptions before"

## The Psychology Behind the Resistance

**Fear #1: Loss of Control**
Monthly payments feel like giving up control. They''re recurring automatically, which feels risky.

**Fear #2: Subscription Fatigue**
They already have Netflix, Spotify, software subscriptions. Another one feels overwhelming.

**Fear #3: Forgotten Waste**
"I''ll sign up, forget about it, and pay for something I''m not using."

**Fear #4: Commitment Phobia**
Monthly = long-term commitment. One-time = done and finished.

## The Real Issue: Perceived Risk

**High perceived risk:**
- Untested relationship
- Unclear value delivery
- No exit strategy
- Unknown results

**Low perceived risk:**
- Proven results in advance
- Clear value each month
- Easy cancellation
- Guaranteed outcomes

**Your job:** Lower the perceived risk until monthly feels SAFER than one-time.

## Why One-Time Feels Safer (But Isn''t)

**Merchant thinking:**
"If I pay $2,500 once, at least I own it."

**Reality:**
- They own something that becomes obsolete
- No support when things break
- No updates when platforms change
- No optimization when performance drops

**Real Example:**

**Merchant A:** Paid $3,000 for one-time website
- Used it for 18 months
- Never updated or optimized
- Results declined steadily
- Eventually needed complete rebuild
- **Total cost:** $3,000 + $3,000 rebuild = $6,000 over 2 years

**Merchant B:** Paid $249/month for website + maintenance
- Constantly optimized and updated
- Support when needed
- Adapted to algorithm changes
- Results improved over time
- **Total cost:** $5,976 over 2 years
- **Better results** with similar investment

## The Trust Gap

**Monthly subscriptions require more trust because:**
- You''re asking for ongoing payments
- They must believe you''ll keep delivering
- Results must justify continued investment

**Building that trust:**
- Show proof of ongoing value delivery
- Demonstrate your track record
- Offer guarantees and easy exits
- Communicate value continuously

## Reframing Monthly as Safer

**Script:**
"I understand monthly fees feel risky. But let me ask you this: What''s riskier—paying monthly for ongoing optimization and support, or paying once for something that becomes outdated with no help when things change? Most of our clients find monthly is actually LOWER risk because if it stops working, they can stop paying. With a one-time project, you''re stuck with whatever you bought."

## Action Steps

**Before handling objections:**

1. **List all reasons** merchants might resist monthly fees
   - What fears might they have?
   - What bad experiences might they remember?

2. **Write your response** to each fear
   - How do you address it?
   - What proof can you offer?

3. **Practice reframing** monthly as lower risk
   - Compare to one-time alternatives
   - Show why monthly is actually safer

**Next lesson:** The Total Cost Comparison Script—how to show monthly is actually more affordable.'
  ) ON CONFLICT DO NOTHING;

  -- Lesson 2: The Total Cost Comparison Script
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES (
    v_module_id,
    'The Total Cost Comparison Script',
    2,
    8,
    E'# The Total Cost Comparison Script

## The "Monthly is Expensive" Objection

**Merchant says:**
"$249/month is too expensive. That''s $2,988 per year!"

**Most partners respond:**
"Well, that''s what it costs" (and lose the sale)

**Successful partners respond:**
"Let''s compare what $2,988 per year gets you versus any other option..."

## The Comparison Framework

**Always compare apples to apples:**

### Option 1: Monthly Service ($249/month)
- Setup and launch
- Monthly optimization
- Ongoing support
- Platform updates
- Training and education
- Performance monitoring
- **Total Year 1:** $2,988
- **Includes everything above**

### Option 2: One-Time Project ($2,500)
- Setup and launch
- No optimization
- No support after 30 days
- No updates
- No training
- No monitoring
- **Year 1 cost:** $2,500
- **But when it breaks or needs updates:** +$800-$1,500
- **Actual Year 1 cost:** $3,300-$4,000
- **And you get LESS value**

### Option 3: Do It Yourself ($0)
- Your time: 80 hours at $75/hour = $6,000
- Tools and software: $50-$200/month = $600-$2,400/year
- Training and learning: 40 hours at $75/hour = $3,000
- Mistakes and do-overs: $1,000-$3,000
- **Actual Year 1 cost:** $10,600-$14,400
- **Results:** Usually inferior to professional work

## The Real Comparison Script

**Full script to use:**

"I understand $249/month sounds like a lot. Let''s break down what that investment actually gets you compared to other options.

**Option 1: Do It Yourself**
You''ll spend 80-100 hours learning and building, which at your hourly rate is $6,000-$7,500 in opportunity cost. Plus $600-$2,400 per year in tools and software. Total real cost: $6,600-$10,000 for Year 1.

**Option 2: One-Time Project**
You can hire someone to build it for $2,500-$3,500. But when platforms update, when things break, when you need changes—that''s all extra. Most of our clients who went this route spent another $1,500-$3,000 within the first year on fixes and updates. Total: $4,000-$6,500.

**Option 3: Monthly with Us**
$249/month = $2,988 for the entire year. That includes setup, ongoing optimization, unlimited support, all updates, training, and monitoring. If something breaks, we fix it—no extra charge. If performance drops, we optimize—no extra charge. You get MORE for LESS total investment.

**Plus:** With monthly, if it ever stops delivering value, you can cancel. With the one-time option, you''re stuck with what you bought. Which option actually sounds lower risk?"

## The Per-Day Breakdown

**Make big numbers feel small:**

"$249 per month breaks down to:
- $8.30 per day
- $1.16 per hour (24/7)
- Less than a lunch

**For that investment, you''re getting:**
- A full marketing system
- Professional optimization
- Expert support
- Continuous improvements

Most of our clients find that this generates 10-15 new customers per month. If each customer is worth $500-$1,000, you''re getting a 20x-40x return. Can you think of any other investment with that kind of ROI?"

## The "Break-Even" Calculation

**Show them exactly when they break even:**

"Let''s figure out exactly how many customers you need to break even on this investment.

**Your investment:** $249/month

**Your average customer value:** $800

**Break-even:** You need 1 customer every 3 months to break even. Just ONE customer every 90 days.

**Our typical results:** 10-15 new customers per month from this system.

**That means:** Customers 2-15 each month are pure profit. Everything after that first customer every 3 months is ROI.

Does getting 1 customer every 3 months from this system sound achievable?"

## Real Example: CRM Subscription ROI

**The math:**

**Monthly investment:** $159
**Average customer value:** $750
**Close rate improvement:** 23% (from 45% to 68%)
**Monthly quotes sent:** 40

**Calculation:**
- Before: 40 quotes × 45% = 18 customers
- After: 40 quotes × 68% = 27 customers
- Additional customers: 9 per month
- Additional revenue: 9 × $750 = $6,750/month
- Cost: $159/month
- **Net gain: $6,591/month**
- **ROI: 4,144%**

"You''re not spending $159/month. You''re investing $159 to make an additional $6,750. That''s the best investment most business owners will ever make."

## Handling the "I''ll Think About It" Response

**When they say they need to think about it after seeing the comparison:**

"Absolutely, think about it. While you''re thinking, consider this: every month you wait costs you [X amount in lost revenue]. If you need 3 months to think about it, that''s [X × 3] in revenue you''ll never get back. What questions can I answer right now that would help you make a confident decision today?"

## Action Steps

**Build your comparison script:**

1. **Calculate all three options** for your main service:
   - DIY (time + tools + learning curve)
   - One-time (initial + maintenance + updates)
   - Monthly (your price including everything)

2. **Create the break-even calculation**
   - Your monthly price
   - Their average customer value
   - How many customers needed to break even

3. **Write your full script**
   - Include all three comparisons
   - Add the per-day breakdown
   - Include the break-even math
   - Close with the ROI question

**Practice this script** until you can deliver it naturally without notes. The more confident you sound with the numbers, the more convincing it is.

**Next lesson:** Handling "Too Expensive" Objections—what to say when they still say it costs too much.'
  ) ON CONFLICT DO NOTHING;

  -- Remaining lessons abbreviated for migration size
  INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
  VALUES
    (v_module_id, 'Handling "Too Expensive" Objections', 3, 8, E'# Handling "Too Expensive" Objections\n\n## When They Say "Too Expensive"\n\n**Merchant:** "That''s just too expensive for me right now."\n\n**Don''t say:** "Well, I could lower the price..."\n\n**Do say:** "Too expensive compared to what? Let me show you why this is actually the most affordable option..."\n\n## The Value Question\n\n**"Is it too expensive, or are you not seeing the value yet?**\n\nIf it''s about value, let me show you [explain ROI again].\n\nIf it''s about cash flow, we can discuss payment timing or starting with a smaller package."\n\n**This separates** price objections (they have the money) from budget objections (they don''t).\n\n## Action Step\n\nPractice responding to "too expensive" without defending your price. Instead, ask clarifying questions to understand the real objection.'),
    (v_module_id, 'The Risk Reversal Technique', 4, 7, E'# The Risk Reversal Technique\n\n## Removing All Risk\n\n**The guarantee that closes deals:**\n\n"Start with us for 90 days. We''ll track every lead, every conversion, every dollar generated. At the end of 90 days, if you''re not seeing at least 10x ROI, we''ll refund your last month and help you transition out—no hard feelings."\n\n## Why This Works\n\n- All risk shifts to you\n- They can''t lose\n- Shows confidence in your service\n- Most will stay after 90 days when seeing results\n\n## The Numbers\n\n**Partner using this guarantee:**\n- 47 clients started with 90-day guarantee\n- 44 stayed past 90 days (93.6% retention)\n- 3 canceled (all were bad-fit clients anyway)\n\n**The guarantee INCREASED sales by 67%** while barely increasing cancellations.\n\n## Action Step\n\nCreate your risk-reversal guarantee. What can you confidently guarantee?'),
    (v_module_id, 'Payment Psychology and Framing', 5, 8, E'# Payment Psychology and Framing\n\n## How You Present Price Matters\n\n**Bad framing:**\n"It''s $249 per month, every month, for as long as you want it."\n\n**Good framing:**\n"Your investment is $249 monthly, which breaks down to about $8 per day for everything included—setup, optimization, support, training, and updates."\n\n## The Anchoring Technique\n\n**Always show the high option first:**\n\n"Our premium package is $499/month and includes [everything].\n\nOur standard package is $249/month with [most things].\n\nWhich one makes sense for your business?"\n\n**Psychology:** $249 looks affordable next to $499.\n\n## Action Step\n\nRewrite how you present your pricing using anchoring and per-day breakdown.'),
    (v_module_id, 'The Pause and Cancel Policy', 6, 7, E'# The Pause and Cancel Policy\n\n## Making It Easy to Exit\n\n**Most partners fear:** "If I make it easy to cancel, everyone will leave!"\n\n**Reality:** Easy cancellation INCREASES sign-ups and DECREASES actual cancellations.\n\n## Your Cancellation Policy\n\n**Recommended:**\n"You can pause or cancel anytime with 30 days notice. No contracts, no penalties, no hard feelings. We earn your business every single month by delivering results."\n\n**Why this works:**\n- Removes barrier to signing up\n- Shows confidence\n- Creates pressure on YOU to deliver (which is good)\n- Most clients never cancel when seeing results\n\n## Action Step\n\nCreate your pause/cancel policy that removes friction from signing up.'),
    (v_module_id, 'When to Walk Away', 7, 6, E'# When to Walk Away\n\n## Not Every Objection is Closeable\n\n**Some prospects will never buy monthly services, and that''s okay.**\n\n## Red Flags to Walk Away:\n\n1. **They want guaranteed results before paying**\n   "Show me it works first, then I''ll pay"\n\n2. **They compare you to DIY templates**\n   "I can get a template for $99"\n\n3. **They fight every aspect of the offer**\n   Constant negotiation and pushback\n\n4. **They''re not financially qualified**\n   Can''t afford it even if they wanted it\n\n**Walking away is success** when the client would be problematic anyway.\n\n## Action Step\n\nCreate your "walk away" criteria. What red flags mean you should decline the business?'),
    (v_module_id, 'Your Objection Response Playbook', 8, 6, E'# Your Objection Response Playbook\n\n## The Complete Objection Handbook\n\n**Build your playbook with:**\n\n**Objection 1:** "Too expensive"\n**Response:** [Your comparison script]\n\n**Objection 2:** "I don''t want monthly fees"\n**Response:** [Your risk-reversal offer]\n\n**Objection 3:** "I need to think about it"\n**Response:** [Your cost-of-delay calculation]\n\n**Objection 4:** "Can I just pay once?"\n**Response:** [Your one-time vs monthly comparison]\n\n**Objection 5:** "I want to do it myself"\n**Response:** [Your DIY cost analysis]\n\n## Action Steps\n\n1. **List every objection** you''ve heard in the last 30 days\n2. **Write your response** to each one\n3. **Practice until natural**\n4. **Update based on results**\n\n**Next module:** Demonstrating Ongoing Value—how to keep subscribers happy and prevent churn.')
  ON CONFLICT DO NOTHING;

END $$;
