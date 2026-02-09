/*
  # Seed DFY Products - Reviews, Visibility & Operations

  Seeds the remaining 7 DFY AI tools:
  - Reviews & Reputation (2 tools)
  - Visibility & Content (3 tools)
  - Operations & Retention (2 tools)
*/

-- Category: Reviews & Reputation

-- 8) AI Review Booster + Protection
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
  'ai-review-booster',
  'AI Review Booster + Protection',
  'reviews',
  'More 5-star reviews, fewer public complaints.',
  'Reviews drive local business growth - but most customers never leave one. Our AI system automatically requests reviews after every job, captures unhappy customers privately before they blast you online, and even responds to reviews professionally. Get more 5-star reviews and protect your reputation simultaneously.',
  '["Get 5-10x more Google reviews", "Intercept unhappy customers before they post", "Auto-respond to reviews professionally", "Boost local search rankings", "Build trust with prospects"]',
  '["Automated review request system", "Unhappy customer routing (private feedback)", "AI-powered review responses", "Google Business Profile integration", "Facebook review support", "Timing optimization", "Review monitoring", "Sentiment analysis", "Monthly review reports"]',
  '[
    {"q": "How does it know when to ask for reviews?", "a": "You trigger it manually or we integrate with your CRM/calendar to send after completed jobs."},
    {"q": "What if someone leaves a bad review anyway?", "a": "The AI drafts a professional response for your approval."},
    {"q": "Can I customize the review request?", "a": "Yes. We set the tone and messaging during onboarding."},
    {"q": "Does it work with Yelp?", "a": "Yelp doesn''t allow automated requests, but we can include them in manual campaigns."},
    {"q": "What''s the unhappy customer routing?", "a": "If someone rates you low, we capture their feedback privately instead of sending them to Google."}
  ]',
  24700,
  7900,
  48,
  8
);

-- 9) AI Google Business Profile Manager
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
  'ai-gbp-manager',
  'AI Google Business Profile Manager',
  'reviews',
  'Keep your Google profile active and optimized automatically.',
  'An active Google Business Profile ranks higher and drives more calls. Our AI posts weekly updates, responds to Q&A, promotes your services, and keeps your profile optimized - all automatically. Perfect for businesses that know they should post on Google but never have time.',
  '["Improve local search rankings", "Stay top-of-mind with regular posts", "Answer customer questions automatically", "Promote services and offers", "Save 5+ hours per week"]',
  '["Weekly Google posts (AI-generated)", "Q&A monitoring and responses", "Service updates and promotions", "Photo optimization recommendations", "Profile completeness monitoring", "Local SEO best practices", "Performance tracking", "Holiday and seasonal content"]',
  '[
    {"q": "Will the posts sound robotic?", "a": "No. We train the AI on your business and brand voice during setup."},
    {"q": "Can I approve posts before they publish?", "a": "Yes, if you prefer. Otherwise they auto-publish weekly."},
    {"q": "What if someone asks a question it can''t answer?", "a": "It flags it for your review and suggests a response."},
    {"q": "Do I need GBP admin access?", "a": "Yes, you''ll grant us manager-level access during setup."},
    {"q": "Can you optimize my profile during setup?", "a": "Yes! We audit and optimize your profile as part of the setup process."}
  ]',
  19700,
  5900,
  24,
  9
);

-- Category: Visibility & Content

-- 10) AI Local SEO Page Generator
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
  'ai-local-seo-pages',
  'AI Local SEO Page Generator',
  'visibility',
  'Rank for "Your Service + Every City" automatically.',
  'Local SEO is about covering every city, neighborhood, and service combo. Our AI generates optimized landing pages for every location and service you offer, publishes them on a schedule, and keeps them fresh. Dominate local search without hiring a content team or agency.',
  '["Rank for hundreds of local keywords", "Cover every service area automatically", "Generate content 100x faster than manual writing", "Improve organic traffic by 300-500%", "Stay compliant with Google''s helpful content guidelines"]',
  '["AI generates pages for your cities/services", "SEO-optimized for local search", "Published on your website automatically", "Internal linking strategy", "Schema markup included", "Scheduled publishing", "Content refresh cycle", "Google Search Console integration", "Monthly traffic reports"]',
  '[
    {"q": "Will Google penalize me for AI content?", "a": "No. We follow Google''s guidelines and add real business info, reviews, and unique elements."},
    {"q": "How many pages will you create?", "a": "Based on your service areas and services. Typically 50-200 pages."},
    {"q": "Can I edit the content?", "a": "Yes. You review during setup, and we can edit anytime."},
    {"q": "What CMS do you support?", "a": "WordPress, Wix, Squarespace, and most major platforms."},
    {"q": "How long until I see traffic?", "a": "SEO takes 60-90 days, but some pages rank within 30 days."}
  ]',
  49700,
  12700,
  72,
  10
);

-- 11) AI Social Content Repurposer
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
  'ai-social-repurposer',
  'AI Social Content Repurposer',
  'visibility',
  'Turn reviews, photos, and jobs into social posts automatically.',
  'You already have great content - your reviews, before/after photos, completed jobs. Our AI turns them into social posts automatically and schedules them across Facebook, Instagram, and more. Stay visible on social without creating content from scratch.',
  '["Post consistently without manual work", "Repurpose existing reviews and photos", "Stay top-of-mind with followers", "Drive engagement and referrals", "Save 10+ hours per month"]',
  '["AI content generation from your assets", "Multi-platform scheduling (FB, IG, LinkedIn)", "Review-to-post automation", "Before/after photo showcases", "Seasonal and trending topics", "Hashtag optimization", "Engagement tracking", "Monthly content calendar"]',
  '[
    {"q": "Where does the content come from?", "a": "Your reviews, photos, completed jobs, and topics you provide during onboarding."},
    {"q": "Can I approve posts before they publish?", "a": "Yes, if preferred. Otherwise they auto-publish on your schedule."},
    {"q": "What platforms do you support?", "a": "Facebook, Instagram, LinkedIn. Twitter/X coming soon."},
    {"q": "How often will it post?", "a": "You choose - typically 3-5 times per week."},
    {"q": "Can I add my own posts too?", "a": "Absolutely. This supplements your posting, not replaces it."}
  ]',
  19700,
  4900,
  48,
  11
);

-- 12) AI Short-Form Ad Copy Generator (Local)
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
  'ai-ad-copy-generator',
  'AI Short-Form Ad Copy Generator',
  'visibility',
  'Fresh ad copy every week, optimized for local businesses.',
  'Running the same ad over and over kills performance. Our AI generates fresh, high-converting ad copy every week based on your services, target customer, and seasonal trends. Perfect for Facebook, Google, and Instagram ads. Stop creative burnout and improve your ad results.',
  '["Get 10-20 ad variations per week", "Test different hooks and angles", "Improve ad performance over time", "Stay relevant with seasonal messaging", "Save 5+ hours per week"]',
  '["Weekly ad copy packs delivered", "Multiple variations per campaign", "Optimized for FB, IG, Google", "Seasonal and trending angles", "Headline and body copy included", "CTA recommendations", "A/B testing suggestions", "Performance tracking templates"]',
  '[
    {"q": "Do you run the ads for me?", "a": "No, but we provide copy you can paste into your ad manager."},
    {"q": "How many variations do I get?", "a": "10-20 per week, depending on your services and campaigns."},
    {"q": "Can I request specific topics?", "a": "Yes. We take requests and adjust based on performance."},
    {"q": "What if the copy doesn''t match my voice?", "a": "We train the AI on your brand voice during onboarding."},
    {"q": "Can I use this for email too?", "a": "Yes! The copy works for ads, emails, and social posts."}
  ]',
  9700,
  3900,
  24,
  12
);

-- Category: Operations & Retention

-- 13) AI Upsell & Cross-Sell Engine
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
  'ai-upsell-engine',
  'AI Upsell & Cross-Sell Engine',
  'operations',
  'Increase average customer value automatically.',
  'Your best upsell opportunities happen right after a completed job - but most businesses forget to follow up. Our AI identifies upsell and cross-sell opportunities, reaches out with personalized offers, and books the next service automatically. Increase customer lifetime value without extra sales effort.',
  '["Increase average customer value by 25-40%", "Automate upsell timing", "Personalize offers based on past services", "Book add-ons automatically", "Track upsell revenue"]',
  '["AI identifies upsell opportunities", "Personalized offer generation", "Automated outreach (SMS/email)", "Seasonal promotion campaigns", "Booking integration", "Cross-sell recommendation engine", "Customer segmentation", "Revenue tracking", "Monthly upsell reports"]',
  '[
    {"q": "How does it know what to upsell?", "a": "You configure your upsells during onboarding (e.g., after lawn mowing → fertilization)."},
    {"q": "Can I customize the offers?", "a": "Yes. You set the services, timing, and discounts."},
    {"q": "What if a customer isn''t interested?", "a": "The AI respects their decision and moves on."},
    {"q": "Does it work for seasonal services?", "a": "Perfect for it. Schedule offers based on time of year."},
    {"q": "Can I track ROI?", "a": "Yes. You''ll see exactly how much revenue comes from upsells."}
  ]',
  29700,
  7900,
  48,
  13
);

-- 14) AI Subscription Saver (Churn Reduction)
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
  'ai-subscription-saver',
  'AI Subscription Saver (Churn Reduction)',
  'operations',
  'Keep customers from canceling automatically.',
  'Losing a customer costs you all their future revenue. Our AI detects cancellation signals, reaches out proactively with retention offers, and saves subscriptions before they churn. For businesses with recurring revenue, memberships, or service plans, this pays for itself immediately.',
  '["Reduce churn by 30-50%", "Save subscriptions automatically", "Identify at-risk customers early", "Offer pause/downgrade alternatives", "Increase customer lifetime value"]',
  '["Churn prediction and monitoring", "Automated retention campaigns", "Win-back offers and discounts", "Pause and downgrade options", "Exit survey capture", "Re-engagement sequences", "Churn reason tracking", "Customer health scoring", "Monthly retention reports"]',
  '[
    {"q": "How does it know someone might cancel?", "a": "It monitors behavior like reduced usage, payment issues, or support complaints."},
    {"q": "What if they still want to cancel?", "a": "The AI captures their reason and processes it gracefully."},
    {"q": "Can I offer custom retention deals?", "a": "Yes. You configure discount thresholds and offers during setup."},
    {"q": "Does it work with my billing system?", "a": "We integrate with Stripe, PayPal, and most subscription platforms."},
    {"q": "What''s the success rate?", "a": "Typically 30-50% of at-risk customers stay when reached proactively."}
  ]',
  24700,
  6700,
  48,
  14
);
