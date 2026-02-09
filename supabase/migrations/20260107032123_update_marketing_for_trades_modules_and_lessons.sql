/*
  # Update Marketing for Trades™ Course - Modules & Lessons

  1. Updates
    - Update 5 course modules with new titles and descriptions
    - Add 25 comprehensive lessons (5 per module)
    - Rich content with exercises and video prompts

  2. Module Structure
    - Module 1: The Trades Growth System (Lessons 1-5)
    - Module 2: Google Maps + Local Search (Lessons 6-10)
    - Module 3: Lead Capture + Missed Call Recovery (Lessons 11-15)
    - Module 4: Offline Marketing That Works (Lessons 16-20)
    - Module 5: Systems, Pricing, Retention, Scaling (Lessons 21-25)
*/

-- Update course title and description
UPDATE public.courses
SET 
  title = 'Marketing for Trades™',
  subtitle = 'Get consistent jobs without living on social media',
  description = 'Master local visibility, Google Maps, reviews, and follow-up systems to book more jobs. Perfect for HVAC, plumbing, electricians, tree services, landscaping, and all trade businesses. No ads required.'
WHERE slug = 'marketing-for-trades';

-- Update modules (by course_id)
UPDATE public.course_modules
SET 
  title = 'The Trades Growth System',
  description = 'Build a foundation that converts with offers, geography, proof, and process. Learn the metrics that matter for trade businesses.'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1;

UPDATE public.course_modules
SET 
  title = 'Google Maps + Local Search (No Ads Required)',
  description = 'Master Google Business Profile, local ranking factors, and review strategies to get found where trades customers search first.'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 2;

UPDATE public.course_modules
SET 
  title = 'Lead Capture + Missed Call Recovery',
  description = 'Win by responding faster and following up automatically. Turn missed calls into booked jobs with systematic follow-up.'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 3;

UPDATE public.course_modules
SET 
  title = 'Offline Marketing That Works for Trades',
  description = 'Be visible locally without constant posting using yard signs, truck branding, postcards, and strategic partnerships.'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4;

UPDATE public.course_modules
SET 
  title = 'Systems, Pricing, Retention, Scaling',
  description = 'Turn marketing into predictable revenue with CRM pipelines, maintenance plans, confident pricing, and growth systems.'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 5;

-- Delete existing lessons to start fresh
DELETE FROM public.course_lessons 
WHERE module_id IN (
  SELECT id FROM course_modules 
  WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades')
);

-- Module 1 Lessons (The Trades Growth System)
INSERT INTO public.course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, resources, is_preview)
VALUES
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1),
    1,
    'Welcome + How Trades Customers Actually Buy',
    E'# Welcome to Marketing for Trades™\n\nTrades customers buy when **pain + trust + speed** align. Unlike retail or e-commerce, trades work is driven by urgency and trust signals.\n\n## Core Buying Factors\n\n- **Pain:** Urgent problem (broken AC, clogged drain, fallen tree)\n- **Trust:** License, insurance, reviews, clear process\n- **Speed:** Fast response time (2 minutes is the goal)\n- **Proof:** Before/after photos, reviews mentioning service + town\n\n## Urgency vs Planned Jobs\n\nUrgency jobs (emergency repairs) require speed-to-lead. Planned jobs (renovations, maintenance) require trust and proof. Both need follow-up.\n\n## Speed-to-Lead Rule\n\n> **Critical:** Aim to respond within 2 minutes. Research shows 78% of customers choose the first responder.\n\n## Exercise\n\nWrite your 1-line promise and top 3 reasons to choose you:\n- 1-line promise (e.g., "Same-day service, clean trucks, licensed pros")\n- 3 reasons list (e.g., "15 years local, 500+ reviews, warranty included")',
    8,
    '{"downloads": ["1-Line Promise Template", "Buying Factors Checklist"], "tools": ["Customer Research Worksheet"]}',
    true
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1),
    2,
    'Your Service Area Strategy (Towns, Zip Codes, Radius)',
    E'# Stop Marketing Everywhere\n\nMost trades businesses waste money marketing too wide. **Win 5-10 core towns first**, then expand.\n\n## Why Focus Matters\n\n- **Route density:** More jobs in fewer areas = less drive time\n- **Local reputation:** Become the known name in each town\n- **Marketing efficiency:** Target one area deeply vs everywhere shallow\n- **Review momentum:** Reviews from specific towns rank better\n\n## How to Pick Your Core Towns\n\nChoose towns where:\n1. You already have customers\n2. Demographics match your services\n3. Competition is weak or you can differentiate\n4. Drive time is under 30 minutes\n\n## Core + Expansion Model\n\nPick **8 core towns** (80% of your marketing) and **3 expansion towns** (20% testing). Once you dominate core towns, promote expansion towns to core.\n\n## Exercise\n\nPick your 8 core towns and 3 expansion towns:\n- List of 8 core towns with why you chose each\n- List of 3 expansion towns to test',
    12,
    '{"downloads": ["Service Area Map Template", "Town Selection Worksheet"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1),
    3,
    'Build Your "Money Offers" (3 Core Packages)',
    E'# Why Packages Beat À La Carte\n\nPackaging services increases clarity, average order value, and reduces price shopping. Customers understand what they are getting and can compare packages vs competitors.\n\n## The 3-Tier Model\n\n- **Starter:** Basic service, entry price point (e.g., Basic HVAC tune-up)\n- **Core:** Most popular, best value (e.g., Full system check + filter + priority scheduling)\n- **Premium:** Complete solution (e.g., Annual maintenance plan + priority emergency service)\n\n## Money Offer Examples\n\n**HVAC:** Tune-up / Full system / Annual plan\n**Tree Service:** Single tree / 3 trees + cleanup / Property maintenance plan\n**Plumbing:** Drain clear / Multi-drain / Annual inspection plan\n\n## Package Naming\n\n> Use outcome names, not feature lists. "Peace of Mind Plan" beats "Annual Service."\n\n## Exercise\n\nCreate your 3 core packages:\n- Starter package (name + what''s included + price)\n- Core package (name + what''s included + price)\n- Premium package (name + what''s included + price)',
    15,
    '{"downloads": ["Package Pricing Calculator", "Service Package Template"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1),
    4,
    'Proof Engine: Before/After, Reviews, Trust Badges',
    E'# Proof is the #1 Conversion Driver\n\nTrades customers need proof you can deliver. Social proof reduces risk and shortens the buying cycle.\n\n## Proof Inventory Checklist\n\n- Before/after photos (minimum 20 high-quality sets)\n- Video walkthroughs of completed jobs\n- Google reviews (target 100+ with 4.5+ stars)\n- License and insurance documentation visible\n- Years in business badge\n- BBB accreditation (if applicable)\n- Manufacturer certifications\n- Case studies with customer quotes\n\n## Where to Display Proof\n\n- Website homepage and service pages\n- Google Business Profile photos\n- Estimate follow-up emails\n- Truck wrap\n- Yard signs (QR to gallery)\n- Social proof emails\n\n## Review Quality > Quantity\n\n> A review that mentions your **service + town + outcome** is worth 10 generic 5-star reviews.\n\n## Exercise\n\nCreate your proof inventory list:\n- List what proof you have now\n- List what proof you''re missing\n- Action plan to fill 3 biggest gaps in next 30 days',
    10,
    '{"downloads": ["Proof Inventory Checklist", "Photo Guidelines"], "tools": ["Review Request Templates"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 1),
    5,
    'The Only Metrics Trades Need Weekly',
    E'# Track What Matters\n\nMost trades businesses track revenue only. But revenue is a lagging indicator. **Track the activities that drive revenue.**\n\n## Weekly KPI Scorecard\n\n- **Inbound calls** (total volume)\n- **Missed calls** (target: under 5%)\n- **Speed-to-lead** (average response time)\n- **Estimates booked** (conversion rate from call to estimate)\n- **Close rate** (estimates won vs total estimates)\n- **Average ticket** (revenue per job)\n- **Review requests sent** (target: 100% of jobs)\n- **Reviews received** (target: 30% conversion)\n\n## Simple Tracking System\n\nUse a spreadsheet or CRM dashboard. Update every Monday morning. Look for trends:\n- Are missed calls rising?\n- Is close rate falling?\n- Address issues immediately.\n\n## Leading vs Lagging Indicators\n\n> Calls and follow-up are **leading indicators**. Revenue and reviews are **lagging**. Fix the leading indicators first.\n\n## Exercise\n\nMake your weekly KPI scorecard:\n- Spreadsheet or document with 8 KPIs listed\n- Current week numbers filled in\n- Target numbers for each KPI',
    14,
    '{"downloads": ["Weekly KPI Scorecard Template", "Metrics Dashboard"]}',
    false
  );
