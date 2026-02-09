/*
  # Seed Premium $197/$297 Courses (5 lessons per module)

  1. Partner Accelerator™ ($197) - 5 modules
  2. Selling Recurring Revenue™ ($297) - 5 modules  
  3. Marketing for Trades™ ($197) - 5 modules
  4. Pet Businesses That Get Found First™ ($197) - 5 modules
*/

-- Partner Accelerator™
SELECT public.seed_course_modules_lessons(
  'partner-accelerator',
  '[
    {"title":"Ecosystem Overview + What to Sell","desc":"Know what to recommend and why.","lessons":["Products map (Marketplace/CRM/AI/Courses)","Who each product is for","Common pain points to listen for","Best quick-start bundles","What NOT to promise"]},
    {"title":"Prospecting + Lead Sources","desc":"Find business owners daily.","lessons":["10 lead sources list","How to qualify fast","Cold DM script","Email script","Follow-up cadence"]},
    {"title":"Sales Calls (Non-Pushy)","desc":"Convert without pressure.","lessons":["Discovery call structure","Questions that uncover urgency","Presenting options (good/better/best)","Objection handling script pack","Close + next steps"]},
    {"title":"Bundling + Pricing Strategy","desc":"Increase deal size and retention.","lessons":["Bundle frameworks by industry","How to position ROI","Avoiding discount traps","Upsell triggers","Renewal / expansion prompts"]},
    {"title":"Partner Ops + Scaling Income","desc":"Run partner income like a business.","lessons":["Tracking referrals + pipeline","Weekly activity targets","Monthly revenue goals","Retention and support boundaries","How to earn recurring predictably"]}
  ]'::jsonb,
  false
);

-- Selling Recurring Revenue™
SELECT public.seed_course_modules_lessons(
  'selling-recurring-revenue',
  '[
    {"title":"Recurring Revenue Foundations","desc":"Why subscriptions win and how to package them.","lessons":["One-time vs recurring math","Offer ladder for retainers","Value stacking bonuses","Pricing anchors and tiers","Simple packaging worksheet"]},
    {"title":"Discovery Calls That Convert","desc":"Get to the real pain and budget.","lessons":["Qualification checklist","Questions that drive urgency","Budget framing without awkwardness","Decision-maker strategy","Call flow template"]},
    {"title":"Objections + Negotiation","desc":"Handle pushback like a pro.","lessons":["Too expensive responses","Let me think responses","Already have someone responses","Discount vs value alternatives","Negotiation rules"]},
    {"title":"Retention + Renewals","desc":"Keep clients long-term.","lessons":["Onboarding success milestones","Quarterly review structure","Reporting that retains","Expansion offer prompts","Churn prevention checklist"]},
    {"title":"Systems + Forecasting","desc":"Predict revenue and hit targets.","lessons":["CRM pipeline structure","Weekly activity math","Forecasting sheet","KPI dashboard","Hiring/outsourcing triggers"]}
  ]'::jsonb,
  false
);

-- Marketing for Trades™
SELECT public.seed_course_modules_lessons(
  'marketing-for-trades',
  '[
    {"title":"Trade Buyer Behavior","desc":"Know what makes homeowners call now.","lessons":["Emergency vs planned jobs","Trust triggers for trades","Speed-to-quote advantage","Neighborhood psychology","Offer positioning template"]},
    {"title":"Google Maps Optimization","desc":"Win local search without ads.","lessons":["Profile checklist","Services + service areas strategy","Photo strategy for trades","Review keywords strategy","Weekly GMB maintenance routine"]},
    {"title":"Local-Link Listing + Offers","desc":"Turn Local-Link into a job pipeline.","lessons":["Listing conversion checklist","Seasonal offer playbook","Urgency without discounts","Bundling add-ons","Calendar-based capacity scarcity"]},
    {"title":"Follow-Up Systems That Win Jobs","desc":"Close more estimates.","lessons":["Estimate follow-up scripts","3-touch follow-up cadence","Missed call recovery flow","No-show recovery","Job confirmation templates"]},
    {"title":"Referral Flywheel","desc":"Turn jobs into neighbors and repeats.","lessons":["Neighbor referral prompts","Partner referrals (realtors/PMs)","Review-to-referral bridge script","Win-back schedule","Monthly KPI review"]}
  ]'::jsonb,
  false
);

-- Pet Businesses That Get Found First™
SELECT public.seed_course_modules_lessons(
  'pet-businesses-first',
  '[
    {"title":"Pet Owner Search Behavior","desc":"How pet parents choose who to trust.","lessons":["Emergency vs routine bookings","Trust signals in pet niches","What photos matter most","What reviews matter most","Offer template for pet services"]},
    {"title":"PawConnect Integration (Use, Not Build)","desc":"Become PawConnect-ready and visible.","lessons":["What PawConnect does for you","How to present ''PawConnect Ready''","Community positioning","Partnership checklist (shelters/rescues)","Monthly activation plan"]},
    {"title":"Emergency Alerts + Community Trust","desc":"Use urgency ethically to build loyalty.","lessons":["Lost pet workflow","What to post + when","Community response scripts","Local partnerships playbook","Trust protection checklist"]},
    {"title":"Reviews + Reputation in Pet Services","desc":"Handle emotional reviews and keep 5-star status.","lessons":["Ask scripts for pet clients","Automation timing rules","Responding to emotional complaints","Turning reviews into content","Bad review prevention plan"]},
    {"title":"Repeat Booking + Loyalty","desc":"Increase frequency without discounting.","lessons":["Reminder cadence (grooming/training)","Membership model basics","Referral rewards (non-discount)","Win-back messages","KPI tracking"]}
  ]'::jsonb,
  false
);
