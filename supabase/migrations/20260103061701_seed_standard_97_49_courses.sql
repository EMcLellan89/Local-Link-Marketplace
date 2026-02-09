/*
  # Seed Standard $97/$49 Courses (3 lessons per module)

  1. Online Sales Without Ads™ ($97) - 5 modules
  2. AI Receptionist™ ($97) - 5 modules
  3. Reviews Course™ ($49) - 5 modules
  4. Care Coordination™ ($97) - 5 modules
  5. Side Hustle™ ($97) - 5 modules
*/

-- Online Sales Without Ads™
SELECT public.seed_course_modules_lessons(
  'online-sales-without-ads',
  '[
    {"title":"Offer Design That Sells","desc":"Build an irresistible offer without ads.","lessons":["Offer clarity formula","Value stacking bonuses","Pricing tiers that convert"]},
    {"title":"Organic Content That Converts","desc":"Post with intention and get DMs.","lessons":["Content pillars","Post formats that sell","30-day content plan"]},
    {"title":"DM Closing System","desc":"Close without being salesy.","lessons":["DM opener script","Qualify + invite flow","Follow-up sequence"]},
    {"title":"Simple Funnel Setup","desc":"Minimal tech, maximum results.","lessons":["Landing page essentials","Checkout and upsells","Email welcome sequence"]},
    {"title":"Delivery + Retention","desc":"Create happy buyers who refer.","lessons":["Onboarding checklist","Milestones and outcomes","Referrals + testimonials system"]}
  ]'::jsonb,
  false
);

-- AI Receptionist™
SELECT public.seed_course_modules_lessons(
  'ai-receptionist-missed-calls',
  '[
    {"title":"Missed Call Math","desc":"Know exactly what missed calls cost you.","lessons":["Lost revenue calculator","Why voicemail fails","Speed-to-lead advantage"]},
    {"title":"Receptionist Setup","desc":"Configure tone, rules, and boundaries.","lessons":["Business profile setup","Hours + routing rules","FAQ + service boundaries"]},
    {"title":"Booking Workflow","desc":"Turn calls into appointments automatically.","lessons":["Qualification questions","Calendar rules","Confirmations + reminders"]},
    {"title":"Follow-Up Automation","desc":"Recover jobs you would have lost.","lessons":["30-second text back","Quote follow-ups","No-show recovery"]},
    {"title":"CRM Handoff + Reporting","desc":"Track and improve performance.","lessons":["Lead creation + pipeline","Call logs & notes","KPIs dashboard"]}
  ]'::jsonb,
  false
);

-- Reviews Course™
SELECT public.seed_course_modules_lessons(
  'reviews-that-convert',
  '[
    {"title":"Review Psychology","desc":"Why reviews drive calls more than ads.","lessons":["Trust triggers","Where reviews matter","What customers look for"]},
    {"title":"Asking Scripts","desc":"Get reviews without awkwardness.","lessons":["In-person script","SMS script","QR + signage"]},
    {"title":"Automation System","desc":"Make reviews consistent.","lessons":["Timing rules","Reminder cadence","Simple workflow"]},
    {"title":"Responding Like a Pro","desc":"Protect reputation with responses.","lessons":["5-star responses","1–3 star responses","Escalation steps"]},
    {"title":"Turn Reviews Into Content","desc":"Use reviews to market everywhere.","lessons":["Review→post","Review→ad copy","Review→website proof"]} 
  ]'::jsonb,
  false
);

-- Care Coordination™
SELECT public.seed_course_modules_lessons(
  'care-coordination-for-families',
  '[
    {"title":"The Care Chaos Problem","desc":"What breaks families and how to fix it.","lessons":["What to track","Common failure points","Care system overview"]},
    {"title":"Setting Up the System","desc":"Roles, permissions, and routines.","lessons":["Roles explained","Permission rules","Daily workflow"]},
    {"title":"Safety + Emergency Planning","desc":"Be ready without panic.","lessons":["Emergency plan","Check-in workflows","Medication basics"]},
    {"title":"Communication + Providers","desc":"Keep everyone aligned.","lessons":["Family comms rules","Provider updates","Documentation habits"]},
    {"title":"Routines That Reduce Stress","desc":"Make it sustainable.","lessons":["Weekly review","Change management","Templates + checklists"]}
  ]'::jsonb,
  false
);

-- Side Hustle™
SELECT public.seed_course_modules_lessons(
  'local-service-side-hustle',
  '[
    {"title":"Pick the Right Hustle","desc":"Choose based on speed-to-cash.","lessons":["Fastest niches","Profit vs time","Simple pricing"]},
    {"title":"Setup Basics","desc":"Start clean and professional.","lessons":["Policies","Payments","Intake forms"]},
    {"title":"Get Customers Without Ads","desc":"Local outreach that works.","lessons":["FB group strategy","Partnership strategy","Referral offer"]},
    {"title":"Customer Experience","desc":"Get repeat buyers fast.","lessons":["Scripts","Quality control","Review requests"]},
    {"title":"Scale Safely","desc":"Grow without chaos.","lessons":["Contractors","Systems","Monthly goals"]}
  ]'::jsonb,
  false
);
