/*
  # Seed Premium Courses - LCA & UGC (5 lessons per module)

  1. Local Customers on Autopilot™ - 6 modules
  2. UGC From Home™ - 6 modules
*/

-- Local Customers on Autopilot™
SELECT public.seed_course_modules_lessons(
  'local-customers-on-autopilot',
  '[
    {
      "title":"How Local Customers Buy Today (2026)",
      "desc":"Understand modern local buyer behavior and where Local-Link wins.",
      "lessons":[
        "Search vs Browse: intent categories",
        "Marketplace trust vs website trust",
        "The 3-second trust test (photo/reviews/offer)",
        "Your 1-line positioning statement (template)",
        "Quick win: improve trust in 15 minutes"
      ]
    },
    {
      "title":"Listing That Converts (Local-Link Listing Mastery)",
      "desc":"Build a listing that turns views into calls/messages.",
      "lessons":[
        "Category + service area strategy",
        "Keywords that matter (service + town + urgency)",
        "Photo formula: hero, proof, people, process, offer",
        "Description copy template (problem→promise→proof→CTA)",
        "15-point listing conversion checklist"
      ]
    },
    {
      "title":"Offers That Bring Buyers Without Killing Margin",
      "desc":"Offer ladder + scarcity without discounting yourself into loss.",
      "lessons":[
        "Offer ladder: free/low/core/premium",
        "Discount alternatives: bonus/bundle/guarantee/priority",
        "Scarcity that is real (capacity/season/slots)",
        "10 offer templates by industry",
        "How to test offers weekly (simple scorecard)"
      ]
    },
    {
      "title":"Reviews Engine + Reputation Protection",
      "desc":"Automate reviews and protect against reputation damage.",
      "lessons":[
        "When to ask: timing rules",
        "Ask scripts: in-person/SMS/email/QR",
        "Automation schedule: 24h/72h/7d",
        "Responding to reviews: 5-star + 1-star templates",
        "Bad review prevention playbook"
      ]
    },
    {
      "title":"Loyalty + Repeat Business Systems",
      "desc":"Turn first-time customers into repeat buyers.",
      "lessons":[
        "Drive Repeat Business (non-point) workflows",
        "Point program basics (when it works/when it fails)",
        "Win-back campaigns: 30/60/90 days",
        "Referral prompts that don''t feel salesy",
        "12-month repeat calendar template"
      ]
    },
    {
      "title":"CRM Tracking + Follow-Up Automation",
      "desc":"Install a simple pipeline that prints revenue.",
      "lessons":[
        "Pipeline stages: lead→booked→done→repeat",
        "Follow-up scripts: book now / thinking / ghost",
        "Missed call recovery tie-in",
        "Weekly KPI dashboard (leads/bookings/close/repeat)",
        "15-minute weekly CEO review routine"
      ]
    }
  ]'::jsonb,
  false
);

-- UGC From Home™
SELECT public.seed_course_modules_lessons(
  'ugc-from-home',
  '[
    {
      "title":"UGC Foundations (No Followers Needed)",
      "desc":"What brands actually pay for and how to position yourself.",
      "lessons":[
        "UGC vs influencer vs affiliate (differences)",
        "Deliverables brands buy (ads, hooks, demos, testimonials)",
        "Best niches for SAHMs (low effort, high demand)",
        "10 UGC ideas using products you already own",
        "Creator mindset: hired talent, not ''posting''"
      ]
    },
    {
      "title":"High-Converting UGC Structure + Hooks",
      "desc":"Make videos brands can run as ads (even if you''re shy).",
      "lessons":[
        "Hook bank: curiosity/pain/proof/outcome",
        "Script formula: hook→problem→demo→result→CTA",
        "Shot list: 10 clips brands want every time",
        "Voiceover + captions workflow (easy mode)",
        "Quality checklist: what gets you rehired"
      ]
    },
    {
      "title":"Portfolio + Offer That Sells",
      "desc":"Build a portfolio before you get clients and sell packages.",
      "lessons":[
        "Portfolio without clients (3 sample videos plan)",
        "Rate card basics (simple, not confusing)",
        "Bundle packages (Starter/Growth/Pro)",
        "Usage rights explained (simple language)",
        "Delivery checklist: what to send brands"
      ]
    },
    {
      "title":"Outreach Pipeline (Daily Routine That Works)",
      "desc":"Find brands and get replies consistently.",
      "lessons":[
        "Where to find brands (IG/TikTok/LinkedIn/Shopify)",
        "DM script that gets replies",
        "Email script that gets replies",
        "Follow-up sequence (3 touches, no cringe)",
        "Tracking sheet: leads→replies→deals"
      ]
    },
    {
      "title":"Pricing + Negotiation (Without Feeling Weird)",
      "desc":"Charge confidently and handle objections cleanly.",
      "lessons":[
        "Starter pricing guidelines",
        "Bundle pricing guidelines",
        "Handling: ''we have no budget''",
        "Handling: ''we need it cheaper''",
        "When and how to raise your rates"
      ]
    },
    {
      "title":"Retainers + Monthly Income",
      "desc":"Turn one-off projects into predictable monthly revenue.",
      "lessons":[
        "Retainer packages (4/mo, 8/mo, 12/mo)",
        "Batching workflow (film/edit/deliver days)",
        "Content calendar for brands",
        "Client success: what keeps retainers",
        "Goal plan: 2 retainers in 60 days"
      ]
    }
  ]'::jsonb,
  false
);
