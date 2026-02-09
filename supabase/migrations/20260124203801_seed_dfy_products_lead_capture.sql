/*
  # Seed DFY Products - Lead Capture & Conversion

  Seeds the first 4 DFY AI tools in the Lead Capture & Conversion category:
  1. AI Missed-Call Text Back + Booking
  2. AI Website Chat Closer
  3. AI Social DM Auto-Responder
  4. AI Speed-to-Lead Dialer
*/

-- Category: Lead Capture & Conversion

-- 1) AI Missed-Call Text Back + Booking
INSERT INTO dfy_products (
  slug,
  name,
  category,
  short_value_prop,
  long_description,
  outcomes,
  includes,
  faq,
  setup_price_cents,
  monthly_price_cents,
  setup_sla_hours,
  sort_order
) VALUES (
  'ai-missed-call-booking',
  'AI Missed-Call Text Back + Booking',
  'lead_capture',
  'Miss a call? AI texts back instantly and books the job.',
  'Never lose another lead to a missed call. Our AI system detects when you miss a call, immediately sends a personalized text, answers their questions, and books them directly into your calendar - all without you lifting a finger. Perfect for busy contractors, service businesses, and local pros who can''t always answer the phone.',
  '["Win back 80% of missed leads automatically", "Book jobs 24/7 without hiring staff", "Qualify leads before they hit your calendar", "Reduce phone tag and no-shows", "Track every missed call opportunity"]',
  '["AI configured for your services and pricing", "Instant SMS follow-up on missed calls", "Two-way conversation capability", "Calendar booking integration", "Lead qualification questions", "Service area filtering", "After-hours coverage", "Real-time notifications", "Monthly performance reports"]',
  '[
    {"q": "Do I need new software?", "a": "No. We integrate with your existing phone system and calendar. Most setups work with what you already have."},
    {"q": "How long does setup take?", "a": "48 hours. We configure the AI, connect your calendar, and test everything before going live."},
    {"q": "What if someone needs to talk to me?", "a": "The AI can transfer to you or schedule a call-back. You stay in control."},
    {"q": "Can I customize the messages?", "a": "Yes. We set up the tone and messaging based on your business during onboarding."},
    {"q": "What phone systems do you support?", "a": "Most major systems including Google Voice, RingCentral, and standard carriers."}
  ]',
  29700,
  9700,
  48,
  1
);

-- 2) AI Website Chat Closer
INSERT INTO dfy_products (
  slug,
  name,
  category,
  short_value_prop,
  long_description,
  outcomes,
  includes,
  faq,
  setup_price_cents,
  monthly_price_cents,
  setup_sla_hours,
  sort_order
) VALUES (
  'ai-website-chat-closer',
  'AI Website Chat Closer',
  'lead_capture',
  'Turn website visitors into booked appointments automatically.',
  'Your website works 24/7 - shouldn''t your sales team? Our AI chat system engages every visitor, answers their questions, qualifies them, and books appointments directly into your calendar. No more "Contact Us" forms that go nowhere. This is a real conversation that closes deals while you sleep.',
  '["Convert 3-5x more website visitors", "Capture leads outside business hours", "Qualify prospects automatically", "Book appointments instantly", "Reduce time-wasting tire-kickers"]',
  '["AI chat widget installed on your site", "Trained on your services and pricing", "Calendar integration for instant booking", "Lead qualification flow", "CRM integration", "Mobile-optimized chat", "Conversation transcripts", "Lead scoring", "Real-time lead alerts"]',
  '[
    {"q": "Will it work on my website platform?", "a": "Yes. We support WordPress, Wix, Squarespace, custom sites, and virtually all major platforms."},
    {"q": "How does it know what to say?", "a": "We train it on your services, pricing, FAQs, and ideal customer profile during setup."},
    {"q": "Can I take over the chat?", "a": "Absolutely. You can jump in anytime or let the AI handle it completely."},
    {"q": "What if someone asks something it doesn''t know?", "a": "The AI captures their contact info and flags it for your follow-up."},
    {"q": "Does it look like a bot?", "a": "It''s clearly AI-powered, but professional and helpful. Customers appreciate instant answers."}
  ]',
  34700,
  9700,
  48,
  2
);

-- 3) AI Social DM Auto-Responder
INSERT INTO dfy_products (
  slug,
  name,
  category,
  short_value_prop,
  long_description,
  outcomes,
  includes,
  faq,
  setup_price_cents,
  monthly_price_cents,
  setup_sla_hours,
  sort_order
) VALUES (
  'ai-social-dm-responder',
  'AI Social DM Auto-Responder (FB/IG)',
  'lead_capture',
  'Never miss a Facebook or Instagram lead again.',
  'Social media leads are the hottest leads you''ll ever get - but they go cold in minutes. Our AI responds to every Facebook and Instagram DM instantly, answers questions, qualifies the lead, and books them or captures their info. Perfect for businesses running social ads or getting organic inquiries.',
  '["Respond to social DMs in under 60 seconds", "Capture leads when they''re hottest", "Handle unlimited message volume", "Qualify leads automatically", "Book appointments from social"]',
  '["Facebook Messenger integration", "Instagram DM integration", "AI trained on your offer", "Qualification questions", "Booking link integration", "Lead capture to CRM", "After-hours coverage", "Conversation logs", "Performance tracking"]',
  '[
    {"q": "Do I need a Facebook Business account?", "a": "Yes, but we can help you set one up if needed."},
    {"q": "Can it handle ad comment replies too?", "a": "Yes! We offer that as an add-on for $29/mo."},
    {"q": "What if someone is rude or spammy?", "a": "The AI is trained to handle objections professionally and ignore spam."},
    {"q": "Can I review messages before they send?", "a": "During setup, yes. Once live, the AI handles it automatically with your approval."},
    {"q": "Does it work with WhatsApp?", "a": "Not yet, but WhatsApp integration is coming soon."}
  ]',
  29700,
  7900,
  48,
  3
);

-- 4) AI Speed-to-Lead Dialer
INSERT INTO dfy_products (
  slug,
  name,
  category,
  short_value_prop,
  long_description,
  outcomes,
  includes,
  faq,
  setup_price_cents,
  monthly_price_cents,
  setup_sla_hours,
  sort_order
) VALUES (
  'ai-speed-to-lead-dialer',
  'AI Speed-to-Lead Dialer',
  'lead_capture',
  'AI calls new leads in under 60 seconds automatically.',
  'Speed-to-lead is everything. Studies show calling a lead within 5 minutes increases conversions by 400%. Our AI system calls every new lead instantly, qualifies them, answers questions, and either books them or transfers to you. Never let a hot lead go cold again.',
  '["Call leads 100x faster than manual follow-up", "Increase conversion rates by 400%", "Qualify leads before transfer", "Handle high lead volume without extra staff", "Track every call and outcome"]',
  '["AI voice system configured", "Instant call trigger on new leads", "Lead source integrations", "Qualification script customized", "Call transfer to your team", "Voicemail drop capability", "Call recordings and transcripts", "Lead scoring", "Performance dashboard"]',
  '[
    {"q": "Does it sound like a robot?", "a": "It''s AI-powered but sounds natural and professional. Leads respond well to speed."},
    {"q": "What lead sources can trigger calls?", "a": "Most CRMs, Facebook Lead Ads, Google Ads, web forms, and manual imports."},
    {"q": "Can it transfer calls to me?", "a": "Yes. If a lead is qualified and ready to talk, it transfers to your number."},
    {"q": "What if I''m not available?", "a": "The AI books a callback or appointment automatically."},
    {"q": "How many calls can it make per day?", "a": "Unlimited. It scales with your lead volume."}
  ]',
  39700,
  12700,
  72,
  4
);
