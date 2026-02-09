-- ============================================================
-- SEED DATA: Plans, Features, and Content Templates
-- Run this after the schema is set up
-- ============================================================

-- MERCHANT PLANS (Base Plans)
-- ============================================================

INSERT INTO public.plans (name, audience, price_monthly, features, description) VALUES
('CORE', 'merchant', 97, '{
  "addon": false,
  "content_ai": true,
  "scheduler": false,
  "crm": true,
  "leads_per_month": 100,
  "social_accounts": 3,
  "team_members": 1,
  "campaigns": 1,
  "email": false,
  "sms": false,
  "support": "email"
}'::jsonb, 'Perfect for getting started with local marketing automation'),

('GROW', 'merchant', 197, '{
  "addon": false,
  "content_ai": true,
  "scheduler": true,
  "crm": true,
  "leads_per_month": 500,
  "social_accounts": 10,
  "team_members": 3,
  "campaigns": 5,
  "email": true,
  "email_credits": 1000,
  "sms": false,
  "support": "priority"
}'::jsonb, 'Best for growing businesses that need multi-channel automation'),

('REVENUE', 'merchant', 297, '{
  "addon": false,
  "content_ai": true,
  "scheduler": true,
  "crm": true,
  "leads_per_month": 999999,
  "social_accounts": 999,
  "team_members": 10,
  "campaigns": 999,
  "email": true,
  "email_credits": 5000,
  "sms": true,
  "sms_credits": 500,
  "revenue_attribution": true,
  "white_label": false,
  "support": "dedicated"
}'::jsonb, 'Complete solution for businesses focused on ROI and growth');

-- MERCHANT ADD-ONS
-- ============================================================

INSERT INTO public.plans (name, audience, price_monthly, features, description) VALUES
('Advanced Scheduler', 'merchant', 29, '{
  "addon": true,
  "addon_group": "Channels",
  "scheduler": true,
  "scheduler_advanced": true,
  "gbp_posts": true,
  "tiktok_integration": true
}'::jsonb, 'Post to TikTok and Google Business Profile'),

('Email Marketing Pack', 'merchant', 49, '{
  "addon": true,
  "addon_group": "Channels",
  "email": true,
  "email_credits": 2500,
  "email_automation": true
}'::jsonb, '2,500 email credits + automation workflows'),

('SMS Marketing Pack', 'merchant', 79, '{
  "addon": true,
  "addon_group": "Channels",
  "sms": true,
  "sms_credits": 1000,
  "sms_automation": true
}'::jsonb, '1,000 SMS credits + automation'),

('DFY Content Service', 'merchant', 149, '{
  "addon": true,
  "addon_group": "DFY",
  "dfy_content": true,
  "dfy_content_posts_per_month": 20,
  "professional_copywriting": true
}'::jsonb, '20 professionally written posts per month'),

('White-Glove Support', 'merchant', 99, '{
  "addon": true,
  "addon_group": "Support",
  "support": "white_glove",
  "dedicated_manager": true,
  "monthly_strategy_calls": true
}'::jsonb, 'Dedicated account manager + monthly strategy sessions');

-- PARTNER TIERS
-- ============================================================

INSERT INTO public.plans (name, audience, price_monthly, features, description) VALUES
('Partner Starter', 'partner', 0, '{
  "addon": false,
  "commission_rate": 0.10,
  "client_dashboard": true,
  "referral_tracking": true,
  "commission_reports": true,
  "training_access": "basic",
  "partner_portal": true
}'::jsonb, 'Free forever - 10% recurring commissions'),

('Partner Pro', 'partner', 97, '{
  "addon": false,
  "commission_rate": 0.15,
  "client_dashboard": true,
  "referral_tracking": true,
  "commission_reports": true,
  "training_access": "advanced",
  "partner_portal": true,
  "white_label_assets": true,
  "priority_support": true,
  "upline_eligible": true
}'::jsonb, 'Best for active partners - 15% commissions + upline eligibility'),

('Partner Enterprise', 'partner', 297, '{
  "addon": false,
  "commission_rate": 0.20,
  "client_dashboard": true,
  "referral_tracking": true,
  "commission_reports": true,
  "training_access": "full",
  "partner_portal": true,
  "white_label_assets": true,
  "white_label_custom": true,
  "dedicated_manager": true,
  "upline_eligible": true,
  "territory_protection": true
}'::jsonb, 'Maximum earnings - 20% commissions + territory protection');

-- CONTENT TEMPLATES (Industry-Specific)
-- ============================================================

-- HVAC Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('hvac', 'post', 'When was the last time you changed your air filter? Most homeowners forget this simple task that can save hundreds on energy bills. Drop a 🙋 if you need a reminder!', 'Book Service', ARRAY['maintenance', 'tip', 'engagement']),
('hvac', 'post', 'That weird noise coming from your AC? It''s trying to tell you something. Here are 3 sounds you should NEVER ignore... [Thread]', 'Schedule Inspection', ARRAY['educational', 'urgent', 'thread']),
('hvac', 'post', '🔥 SPECIAL OFFER: Pre-season AC tune-up for just $79 (reg. $129). Book before [DATE] and beat the summer rush. Limited slots!', 'Book Now', ARRAY['offer', 'seasonal', 'urgency']),
('hvac', 'email', 'Subject: Your AC Won''t Survive Summer Without This\n\nHi {{business}},\n\nSummer temps hit triple digits around here. Last year, we had over 200 emergency calls from people whose AC died in the heat.\n\nDon''t be one of them.\n\nOur pre-season tune-up checks 23 points and catches problems before they become expensive emergencies.\n\n$79 (save $50) - Book by {{date}}', 'Schedule Service', ARRAY['email', 'seasonal', 'prevention']);

-- Plumbing Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('plumbing', 'post', 'PSA: If you hear water running when nothing is on, you have a leak. Even small leaks waste 10,000 gallons/year. That''s $100+ down the drain. 💰', 'Free Leak Check', ARRAY['psa', 'savings', 'awareness']),
('plumbing', 'post', 'Storm season is here. Your sump pump hasn''t been tested since last year. Want to find out it doesn''t work when your basement floods? Or test it now?', 'Book Inspection', ARRAY['prevention', 'seasonal', 'fear']),
('plumbing', 'post', '🚨 EMERGENCY PLUMBER AVAILABLE 24/7 🚨\nBurst pipe? Water heater failure? We answer in under 5 minutes.\nSave this number: [PHONE]', 'Call Now', ARRAY['emergency', 'urgency', 'save']);

-- Home Services General
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('home_services', 'post', 'Behind the scenes at {{business}}! Meet [NAME], one of our techs who''s been serving {{city}} for [X] years. Drop a wave if you''ve worked with them! 👋', 'Meet The Team', ARRAY['team', 'local', 'trust']),
('home_services', 'post', 'Real talk: We could be $50 cheaper than our competitors. But then we''d have to cut corners. Here''s what you get for that extra $50... 🧵', 'Learn More', ARRAY['value', 'transparency', 'differentiation']),
('home_services', 'post', '5-star review from [NAME] in {{city}}: "[CUSTOMER QUOTE]" ⭐⭐⭐⭐⭐\n\nThis is why we do what we do.', 'Read More Reviews', ARRAY['social_proof', 'testimonial', 'trust']);

-- Restaurant Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('restaurant', 'post', 'New menu alert! 🎉 Our chef just dropped [DISH NAME] and it''s already getting rave reviews. Who wants to be our official taste tester?', 'Reserve Table', ARRAY['menu', 'new', 'engagement']),
('restaurant', 'post', 'TONIGHT ONLY: Live music + half-price appetizers. Because Tuesday nights shouldn''t be boring. Doors open at 6pm!', 'Book Now', ARRAY['event', 'special', 'urgency']),
('restaurant', 'post', 'The secret to our [SIGNATURE DISH]? [INGREDIENT] from [LOCAL SUPPLIER]. We source locally because flavor matters. 🌱', 'Try It', ARRAY['local', 'quality', 'story']);

-- Automotive Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('automotive', 'post', 'That oil change you''ve been putting off? It''s the difference between a $50 service and a $5,000 engine replacement. Which would you prefer?', 'Schedule Service', ARRAY['maintenance', 'prevention', 'savings']),
('automotive', 'post', 'FREE BRAKE INSPECTION this week only. If your brakes are squeaking, grinding, or pulsing - you need this. Your family''s safety isn''t worth the gamble.', 'Book Free Check', ARRAY['safety', 'free', 'urgency']),
('automotive', 'post', 'Customer shout-out to [NAME] for trusting us with their [VEHICLE]. In and out in 45 minutes with new tires and an alignment. Back on the road safe! 🚗✨', 'Read Reviews', ARRAY['testimonial', 'trust', 'speed']);

-- Real Estate Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('real_estate', 'post', 'JUST LISTED: [ADDRESS] - [BEDS]bd/[BATHS]ba, [SQFT] sq ft. [STANDOUT FEATURE]. Priced to sell at $[PRICE]. Virtual tour link in bio!', 'Schedule Showing', ARRAY['listing', 'new', 'urgency']),
('real_estate', 'post', 'Market update for {{city}}: Home prices [UP/DOWN] [X]% this quarter. What does this mean for buyers and sellers? Thread 🧵', 'Get Market Report', ARRAY['market', 'educational', 'authority']),
('real_estate', 'post', 'Congrats to the [FAMILY NAME] on closing their dream home today! 🎉🏠 Another happy family in {{city}}. Who''s next?', 'Start Your Search', ARRAY['social_proof', 'celebration', 'testimonial']);

-- Pet Services Templates
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('pet_services', 'post', 'Does your dog pull on walks? Bark at strangers? Jump on guests? These aren''t "bad dogs" - they''re untrained dogs. Let''s fix that. 🐕', 'Free Consultation', ARRAY['training', 'solution', 'engagement']),
('pet_services', 'post', 'PET OF THE WEEK: Meet [PET NAME]! [CUTE STORY]. Drop a ❤️ if you want to see more of our furry clients!', 'Book Appointment', ARRAY['engagement', 'cute', 'social']),
('pet_services', 'post', '⚠️ Flea season is HERE. One flea = 1,000 fleas in 3 weeks. Protect your pets now. Call for same-day treatment: [PHONE]', 'Book Treatment', ARRAY['prevention', 'urgency', 'seasonal']);

-- ALL INDUSTRIES
INSERT INTO public.content_templates (industry, format, prompt, default_cta, tags) VALUES
('all', 'post', 'Monday motivation from the {{business}} team: "[INSPIRATIONAL QUOTE]" - [AUTHOR]\n\nWhat''s one goal you''re crushing this week?', 'Learn More', ARRAY['motivation', 'engagement', 'brand']),
('all', 'post', 'We''re hiring! Looking for a [POSITION] to join our {{city}} team. If you love [INDUSTRY] and want to work with amazing people, DM us!', 'Apply Now', ARRAY['hiring', 'team', 'culture']),
('all', 'post', 'BIG NEWS: We just hit [MILESTONE]! Thank you {{city}} for supporting us all these years. Here''s to the next chapter! 🎉', 'Celebrate With Us', ARRAY['milestone', 'gratitude', 'community']);

-- CAMPAIGN TEMPLATES
-- ============================================================

INSERT INTO public.campaign_templates (name, industry, goal, duration_days, description) VALUES
('Storm Cleanup Blitz', 'home_services', 'calls', 7, 'Emergency response campaign for severe weather events'),
('Back-to-School Special', 'all', 'sales', 30, 'Capture families preparing for school year'),
('Holiday Gift Card Push', 'all', 'sales', 45, 'November-December gift card sales campaign'),
('Slow Season Reactivation', 'all', 'bookings', 30, 'Re-engage dormant customers during slow months'),
('Review Explosion', 'all', 'reviews', 14, 'Concentrated effort to gather 5-star reviews'),
('Grand Opening', 'all', 'foot_traffic', 30, 'New business launch campaign'),
('Anniversary Sale', 'all', 'sales', 14, 'Celebrate business milestones with special offers'),
('Summer Maintenance Reminder', 'home_services', 'bookings', 60, 'Pre-season preventive maintenance push'),
('Valentine''s Day Special', 'restaurant', 'reservations', 21, 'Premium dining experience promotion'),
('Spring Cleaning', 'home_services', 'bookings', 30, 'Annual deep cleaning and maintenance services');

-- FEATURE FLAGS SETUP
-- ============================================================

-- Link feature flags to plans (ensures consistency)
INSERT INTO public.feature_flags (plan_id, key, enabled)
SELECT
  p.id,
  feat.key,
  (p.features->>feat.key)::boolean
FROM public.plans p
CROSS JOIN LATERAL (
  SELECT jsonb_object_keys(p.features) as key
) feat
WHERE jsonb_typeof(p.features->feat.key) = 'boolean'
ON CONFLICT (plan_id, key) DO UPDATE
  SET enabled = excluded.enabled;
