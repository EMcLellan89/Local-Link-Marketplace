/*
  # Marketing for Trades™ - Module 5 Lessons

  1. Module 5: Systems, Pricing, Retention, Scaling (Lessons 21-25)
    - Pricing Confidence
    - Simple CRM Pipeline
    - Monthly Maintenance Plans
    - Hiring + Dispatch Basics
    - 90-Day Growth Sprint
*/

-- Module 5 Lessons (Systems, Pricing, Retention, Scaling)
INSERT INTO public.course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, resources, is_preview)
VALUES
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5),
    21,
    'Pricing Confidence (Stop Competing on Price)',
    E'# Sell Safety, Speed, Cleanup, Warranty, Process\n\nLow-price trades businesses struggle and fail. **You''re not selling a commodity—you''re selling peace of mind, safety, and results.**\n\n## Value Language Framework\n\n- **Safety:** Licensed, insured, background-checked team\n- **Speed:** Same-day/next-day service, fast response\n- **Cleanup:** "We leave it cleaner than we found it"\n- **Warranty:** X-year warranty on parts and labor\n- **Process:** Clear steps, no surprises, upfront pricing\n- **Experience:** X years, X jobs completed, X reviews\n\n## Price Objection Response\n\n**Customer:** "Your price is higher."\n\n**You:** "I understand. Here''s why: [explain warranty, process, safety]. We don''t cut corners. Our customers choose us because they want it done right the first time."\n\n## Confidence\n\n> If you **don''t believe in your pricing**, neither will your customers. Practice your value language until it''s natural.\n\n## Exercise\n\nWrite your price objection response:\n- Value language script (6 value points)\n- Price objection response script\n- Practice recording (record yourself saying it out loud)',
    14,
    '{"downloads": ["Value Language Script", "Pricing Confidence Guide", "Objection Handler"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5),
    22,
    'Simple CRM Pipeline for Trades (Lead → Job → Invoice)',
    E'# One Pipeline, One Source of Truth\n\nMost trades use spreadsheets, sticky notes, and memory. This causes **missed follow-ups, lost leads, and chaos**. A simple CRM fixes this.\n\n## Pipeline Stages\n\n1. **New lead** - All inbound leads start here\n2. **Contacted** - You reached them and confirmed the problem\n3. **Estimate booked** - Appointment scheduled\n4. **Estimate sent** - Quote delivered\n5. **Won** - They said yes\n6. **Lost** - They said no (track reason)\n7. **Scheduled** - Job on calendar\n8. **Completed** - Job done\n9. **Invoiced** - Invoice sent\n10. **Paid** - Payment received\n11. **Review requested** - Asked for review\n\n## CRM Tools for Trades\n\n- Local-Link CRM (built-in)\n- Jobber\n- ServiceTitan\n- Housecall Pro\n- Simple: Airtable or Google Sheets with automation\n\n## Weekly Pipeline Review\n\n> Every Monday: Review pipeline. Follow up on stuck leads. **Forecast weekly revenue** based on "Won" stage.\n\n## Exercise\n\nBuild your pipeline stages:\n- List of 11 pipeline stages\n- Choose CRM tool\n- Import current leads into CRM\n- Schedule weekly pipeline review',
    16,
    '{"downloads": ["CRM Setup Guide", "Pipeline Template", "Weekly Review Checklist"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5),
    23,
    'Monthly Maintenance Plans (Recurrence for Trades)',
    E'# Service Plans Create Stability\n\nOne-time jobs are unpredictable. **Monthly or annual maintenance plans create recurring revenue and retention.**\n\n## Maintenance Plan Examples\n\n- **HVAC:** Annual tune-up (spring + fall) + priority service + discounts\n- **Plumbing:** Annual inspection + drain cleaning + priority emergency\n- **Tree service:** Quarterly trimming + storm cleanup priority\n- **Landscaping:** Monthly mowing + seasonal cleanups\n- **Pest control:** Monthly or quarterly treatments\n\n## 3-Tier Maintenance Plan\n\n**Basic:** Annual visit + inspection\n\n**Standard:** 2-3 visits + priority scheduling + 10% discount\n\n**Premium:** Quarterly visits + priority emergency + 20% discount + free small repairs\n\n## Pricing\n\n> Price plans at **70-80% of à la carte pricing**. Customers save, you get recurring revenue and retention.\n\n## Exercise\n\nCreate a 3-tier maintenance plan:\n- Basic plan (name + what''s included + price)\n- Standard plan (name + what''s included + price)\n- Premium plan (name + what''s included + price)',
    12,
    '{"downloads": ["Maintenance Plan Template", "Pricing Calculator", "Service Agreement"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5),
    24,
    'Hiring + Dispatch Basics (When to Add Help)',
    E'# Hire When Operations Strain\n\nMost trades owners **wait too long to hire**. Missed calls, slow follow-up, and backlog growth are signals it''s time.\n\n## Hire Trigger Metrics\n\n- Missed calls rising above **5%**\n- Follow-up completion falling below **80%**\n- Job backlog over **2 weeks**\n- Owner working **60+ hours/week** on operations\n- Revenue growth stalled due to capacity\n\n## First Hires for Trades\n\n**1st hire:** Admin/dispatcher (answers calls, schedules, follows up)\n\n**2nd hire:** Technician (scales job capacity)\n\n**3rd hire:** Marketing assistant (runs ads, posts, reviews)\n\n## Dispatcher Role\n\n> Dispatcher handles:\n> - Answering calls\n> - Booking estimates\n> - Follow-up sequences\n> - Review requests\n> - Scheduling\n> - CRM updates\n\n## Exercise\n\nDefine your hire trigger metrics:\n- Current missed call %\n- Current follow-up completion %\n- Current job backlog (days)\n- Owner hours/week\n- Hire decision (yes/no/soon)',
    14,
    '{"downloads": ["Hire Trigger Checklist", "Job Description Templates", "Onboarding Guide"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5),
    25,
    '90-Day Growth Sprint + Scorecard',
    E'# Execute Fast: Maps, Reviews, Follow-Up, Print\n\nDon''t try to do everything. **Pick 4 priorities and execute them relentlessly for 90 days.** Measure weekly. Adjust as needed.\n\n## 90-Day Sprint Template\n\n### Month 1\n- GBP optimization\n- Weekly posts\n- 30 reviews collected\n- Missed call system launched\n\n### Month 2\n- 5 town pages live\n- Yard signs on every job\n- Postcard campaign 1 sent\n- 30 more reviews\n\n### Month 3\n- Partner outreach (10 contacts)\n- Maintenance plans launched\n- CRM pipeline live\n- 30 more reviews\n\n## Weekly Scorecard\n\n**Track:**\n- Calls, missed calls\n- Estimates booked\n- Close rate\n- Jobs completed\n- Reviews received\n- Postcards sent\n- Partner meetings\n\n**Review every Monday.**\n\n## Accountability\n\n> Share your 90-day plan with a partner, mentor, or accountability group. **Weekly check-ins** keep you on track.\n\n## Exercise\n\nBuild your 90-day action plan:\n- Month 1 priorities (4 items)\n- Month 2 priorities (4 items)\n- Month 3 priorities (4 items)\n- Weekly scorecard template',
    20,
    '{"downloads": ["90-Day Sprint Template", "Weekly Scorecard", "Accountability Partner Guide"]}',
    false
  );
