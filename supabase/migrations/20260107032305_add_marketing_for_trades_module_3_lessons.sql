/*
  # Marketing for Trades™ - Module 3 Lessons

  1. Module 3: Lead Capture + Missed Call Recovery (Lessons 11-15)
    - Lead Sources Trades Should Use
    - Phone Answering Rules
    - Missed Call Recovery
    - Estimate Follow-Up System
    - Job Follow-Up
*/

-- Module 3 Lessons (Lead Capture + Missed Call Recovery)
INSERT INTO public.course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, resources, is_preview)
VALUES
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3),
    11,
    'Lead Sources Trades Should Use (Beyond Social)',
    E'# Stop Living on Social Media\n\nSocial media is a time sink for trades. **Focus on lead sources where customers already search with intent.**\n\n## Top Lead Sources for Trades\n\n- **Google Business Profile** (60-80% of leads)\n- **Local-Link marketplace listing**\n- **Partner referrals** (property managers, realtors)\n- **Yard signs + QR codes**\n- **Truck branding + phone number**\n- **Postcards** to target neighborhoods\n- **Online directories** (Yelp, Angi, Thumbtack - use selectively)\n- **Neighborhood Facebook groups** (minimal time)\n\n## Priority Order\n\n1. Start with GBP\n2. Then add Local-Link\n3. Then yard signs\n4. Then one partner channel\n\n**Do not spread thin.**\n\n## Tracking\n\n> Use unique phone numbers or ask "How did you hear about us?" Track source to ROI.\n\n## Exercise\n\nChoose your top 5 lead sources:\n- Ranked list of 5 sources\n- Current status of each (active, needs setup, not started)\n- Action plan to activate top 3 in next 30 days',
    10,
    '{"downloads": ["Lead Source Tracker", "Channel Priority Matrix"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3),
    12,
    'Phone Answering Rules (The 3-Line Booking Framework)',
    E'# Book Fast, Don''t Quote Over Phone\n\nMost trades lose jobs by giving quotes over the phone. **Price without context = objection.** Book the estimate instead.\n\n## The 3-Line Booking Framework\n\n**Line 1:** Confirm the problem\n"What''s going on with your [AC/drain/tree]?"\n\n**Line 2:** Confirm the location\n"What town are you in?"\n\n**Line 3:** Book the estimate window\n"I can get someone out [today/tomorrow]. Morning or afternoon?"\n\n## Handling Price Questions\n\n**Customer:** "How much?"\n\n**You:** "Great question—price depends on a few factors. I can get you an exact quote after a quick look. I have [morning/afternoon] available. Which works better?"\n\n## Speed Wins\n\n> Offer **same-day or next-day estimates** whenever possible. Speed beats price in trades.\n\n## Exercise\n\nWrite your 3-line booking script:\n- Line 1: Problem confirmation script\n- Line 2: Location confirmation script\n- Line 3: Estimate booking script\n- Price objection response script',
    14,
    '{"downloads": ["3-Line Booking Script", "Phone Answering Checklist"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3),
    13,
    'Missed Call Recovery (SMS + Callback in 2 Minutes)',
    E'# Missed Calls = Lost Money\n\nStudies show **85% of missed calls never call back**. But a 2-minute callback converts 60% of them.\n\n## Missed Call Flow\n\n**Step 1:** Auto-text within 60 seconds\n"Hi, I see I missed your call. I''m available now. What can I help with?"\n\n**Step 2:** Call attempt within 2 minutes\n\n**Step 3:** If no answer, send booking link\n"Book your estimate here: [link]"\n\n**Step 4:** Follow-up text 2 hours later if still no response\n\n## Technology\n\nUse Local-Link CRM, Jobber, ServiceTitan, or simple tools like Zapier + Twilio to automate the SMS. Manual callback by your team.\n\n## Missed Call SMS Template\n\n> "Hi [Name], this is [Your Name] from [Company]. I see I missed your call about [service]. I''m available now—call me at [number] or text me what you need."\n\n## Exercise\n\nWrite your missed-call SMS:\n- SMS template 1: Immediate auto-text\n- SMS template 2: Booking link text\n- SMS template 3: 2-hour follow-up',
    12,
    '{"downloads": ["Missed Call Flow Diagram", "SMS Templates", "Automation Setup Guide"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3),
    14,
    'Estimate Follow-Up System (3 Touches in 72 Hours)',
    E'# Most Money is in Follow-Up\n\n**Average close rate without follow-up:** 20-30%\n**With systematic follow-up:** 50-60%\n\nFollow-up is where you win.\n\n## 3-Touch Sequence\n\n**Day 0 (same day):** Text\n"Thanks for meeting with me. Here''s your estimate: [link]. Any questions?"\n\n**Day 1:** Call\n"Just checking in. Did you get a chance to review the estimate? Any questions I can answer?"\n\n**Day 3:** Email/Text\n"Should I close your file, or would you like to move forward?" (The scarcity nudge works.)\n\n## Objection Handling\n\n**Price too high:** Explain warranty, process, quality\n**Getting other quotes:** "No problem—here''s why we''re different"\n**Need to think:** "What questions can I answer to help you decide?"\n\n## Follow-Up Calendar\n\n> **Schedule follow-ups in your CRM immediately after estimate.** Do not rely on memory.\n\n## Exercise\n\nBuild your follow-up sequence:\n- Day 0 text template\n- Day 1 call script\n- Day 3 email/text template\n- 3 objection responses',
    16,
    '{"downloads": ["3-Touch Follow-Up Template", "Objection Handler Script", "Follow-Up Calendar"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3),
    15,
    'Job Follow-Up → Reviews + Referrals + Upsells',
    E'# After Job = Best Moment\n\nRight after completing a job, **trust is highest**. This is when to ask for reviews, referrals, and future business.\n\n## Job Complete Script\n\n**Step 1: Walkthrough**\nShow the customer what you did and confirm satisfaction\n\n**Step 2: Review ask**\n"If you''re happy, would you leave us a quick Google review? Mention the service and town if you can. Here''s the link: [SMS]"\n\n**Step 3: Referral ask**\n"Do you know anyone else who needs [service]? We''d love to help your neighbors too."\n\n**Step 4: Next-step offer**\n"Would you like to schedule your next maintenance visit now? We offer a discount for pre-booking."\n\n## Timing\n\n- **Review:** Same day (via SMS)\n- **Referral:** In-person before leaving\n- **Next-step:** Follow-up email within 2 days\n\n## Incentives\n\n> **Do not** incentivize reviews (against Google policy).\n> **Do** incentivize referrals ($50 credit, gift card, discount on next service).\n\n## Exercise\n\nCreate job complete script:\n- In-person walkthrough script\n- Review request SMS\n- Referral ask script\n- Next-step offer email',
    14,
    '{"downloads": ["Job Complete Checklist", "Review Request SMS", "Referral Program Template"]}',
    false
  );
