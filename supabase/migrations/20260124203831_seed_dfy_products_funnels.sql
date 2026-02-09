/*
  # Seed DFY Products - Funnels & Sales Automation

  Seeds 3 DFY AI tools in the Funnels & Sales Automation category:
  5. AI-Powered Marketing Funnels (DFY)
  6. AI Quote Generator + Follow-Up
  7. AI Customer Reactivation Engine
*/

-- Category: Funnels & Sales Automation

-- 5) AI-Powered Marketing Funnels (DFY)
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
  'ai-marketing-funnels',
  'AI-Powered Marketing Funnels (DFY)',
  'funnels',
  'Complete funnel built, launched, and optimized for you.',
  'Stop losing leads to complicated forms and slow follow-up. We build you a complete marketing funnel - landing page, lead capture, AI follow-up, and booking - all optimized for local service businesses. You get a proven system that turns clicks into customers automatically. Perfect for running ads or organic traffic.',
  '["Get a proven funnel without hiring an agency", "Convert traffic into booked jobs automatically", "AI follows up via text and email", "Track every lead and conversion", "Works with your existing calendar and CRM"]',
  '["Custom landing page designed and built", "Thank you page with next steps", "Lead capture form optimized for mobile", "AI SMS and email follow-up sequences", "Calendar booking integration", "Facebook Pixel and Google tracking", "CRM integration", "A/B testing setup", "Monthly optimization included"]',
  '[
    {"q": "Do I need a website already?", "a": "No. This funnel lives on its own URL (or we can add it to your domain)."},
    {"q": "Can you run ads for me?", "a": "Ad setup is available as a $497 add-on. We handle strategy, creative, and launch."},
    {"q": "How long does it take to build?", "a": "72 hours. We need your offer details, photos, and brand colors during onboarding."},
    {"q": "What if I want changes after launch?", "a": "Included. We optimize monthly based on performance."},
    {"q": "Can I use this for multiple services?", "a": "Yes, or you can add extra campaigns as an add-on for $47/mo each."}
  ]',
  99700,
  14700,
  72,
  5
);

-- 6) AI Quote Generator + Follow-Up
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
  'ai-quote-generator',
  'AI Quote Generator + Follow-Up',
  'funnels',
  'Instant quotes + automatic follow-up = more closed deals.',
  'Your customers want pricing now, not after a phone tag marathon. Our AI system generates accurate quotes based on your pricing rules, sends them instantly, and follows up automatically until they book or decline. Perfect for contractors, cleaners, movers, and any business with service-based pricing.',
  '["Send quotes in minutes, not days", "Follow up automatically without manual work", "Increase quote-to-close ratio", "Track every quote and outcome", "Reduce time spent on tire-kickers"]',
  '["AI quote calculator configured", "Pricing rules based on your services", "Instant quote delivery via SMS/email", "Automated follow-up sequence", "Booking CTA included", "Quote expiration reminders", "Win/loss tracking", "Integration with your CRM", "Monthly quote analytics"]',
  '[
    {"q": "How does it calculate pricing?", "a": "We configure it based on your pricing structure - by square foot, hourly, flat rate, etc."},
    {"q": "Can it handle complex jobs?", "a": "For simple quotes, yes. Complex jobs can trigger a call-back request."},
    {"q": "What if the quote is wrong?", "a": "You approve the pricing logic during setup, and can override any quote manually."},
    {"q": "Does it integrate with QuickBooks?", "a": "Not directly, but we can export quotes to your accounting system."},
    {"q": "Can I customize the follow-up?", "a": "Yes. We set the tone, timing, and number of follow-ups during onboarding."}
  ]',
  49700,
  9700,
  48,
  6
);

-- 7) AI Customer Reactivation Engine
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
  'ai-customer-reactivation',
  'AI Customer Reactivation Engine™',
  'funnels',
  'Bring back old customers automatically with AI.',
  'Your past customers are your easiest sales - but most businesses never follow up. Our AI system reaches out to inactive customers with personalized offers, answers their questions, and books them back automatically. It''s like having a retention specialist working 24/7 to win back lost revenue.',
  '["Reactivate 15-25% of dormant customers", "Automate winback campaigns", "Personalize outreach at scale", "Book repeat business automatically", "Track reactivation ROI"]',
  '["Customer list import and segmentation", "AI-generated winback offers", "Personalized SMS and email campaigns", "Two-way conversation capability", "Booking integration", "Opt-out management", "Campaign scheduling", "Reactivation tracking", "Monthly performance reports"]',
  '[
    {"q": "How do you get my customer list?", "a": "You upload it (CSV) or we pull it from your CRM during setup."},
    {"q": "What if customers opted out of marketing?", "a": "We respect all opt-outs and only contact customers who haven''t opted out."},
    {"q": "Can I approve messages before they send?", "a": "Yes, during setup. Once live, campaigns run automatically."},
    {"q": "How often does it reach out?", "a": "Based on your preferences - typically 2-3 touchpoints over 2 weeks."},
    {"q": "Can I add new lists?", "a": "Yes, additional list imports are $49 each."}
  ]',
  39700,
  9700,
  48,
  7
);
