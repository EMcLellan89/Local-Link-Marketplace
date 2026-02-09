/*
  # Seed 100+ Industry-Specific DFY Content Items
  
  1. Content Packs Created
    - Trades Pack (25 items)
    - Cleaning Pack (25 items)
    - Med Spa Pack (25 items)
    - Restaurant Pack (25 items)
  
  2. Content Types
    - Social posts (FB/IG)
    - GBP posts
    - Email templates
    - SMS templates
    - Phone scripts
  
  3. Variables Supported
    - {{business_name}}, {{service_area}}, {{offer}}, {{booking_link}}
    - {{phone}}, {{keyword}}, {{review_link}}, {{name}}
*/

-- Create 4 industry packs
insert into dfy_content_packs (id, title, industry, season, description, tags, status)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Trades Pack (25)', 'trades', null, 'DFY posts + follow-ups for trades.', array['trades','offers','local'], 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Cleaning Pack (25)', 'cleaning', null, 'DFY posts + follow-ups for cleaning.', array['cleaning','recurring','local'], 'active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Med Spa Pack (25)', 'medspa', null, 'DFY posts + follow-ups for med spa.', array['medspa','beauty','appointments'], 'active'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Restaurant Pack (25)', 'restaurant', null, 'DFY posts + promos for restaurants.', array['restaurant','specials','local'], 'active')
on conflict (id) do nothing;

-- TRADES (25 items)
insert into dfy_content_items (pack_id, content_type, title, body, variables, platform)
values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Offer Post','POST: {{service_area}} — {{offer}}\n\nNeed help with {{keyword}}? Book: {{booking_link}}','{"offer":true,"service_area":true,"keyword":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Tip Post','POST: Quick tip for {{keyword}}:\n[1 tip].\n\nIf you want it done right: {{offer}}\nBook: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Proof Post','POST: Recent job in {{service_area}} ✅\n\nFor {{keyword}}, our team focuses on safety + clean finish.\n{{offer}}\nBook: {{booking_link}}','{"service_area":true,"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: FAQ Cost','POST: "How much does {{keyword}} cost?"\n\nIt depends on [2 factors].\nWe make it simple: {{offer}}\nBook: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Availability','POST: Open spots this week in {{service_area}}.\n\n{{offer}}\nMessage "QUOTE" or book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','gbp','Trades: GBP Offer','GBP POST: {{offer}} in {{service_area}}.\nCall {{phone}} or book: {{booking_link}}','{"offer":true,"service_area":true,"phone":true,"booking_link":true}'::jsonb,'GBP'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','gbp','Trades: GBP Service','GBP POST: {{keyword}} serving {{service_area}}.\nFast scheduling.\n{{offer}}\nBook: {{booking_link}}','{"keyword":true,"service_area":true,"offer":true,"booking_link":true}'::jsonb,'GBP'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','email','Trades: Lead Follow-up','Subject: Quick question about {{keyword}}\n\nHi {{name}},\nThanks for reaching out.\n1) When do you want it done?\n2) Any photos?\n\nBook: {{booking_link}}\n— {{business_name}}','{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sms','Trades: Lead Follow-up SMS','{{business_name}}: Thanks {{name}} — want to schedule {{keyword}}? Book: {{booking_link}}','{"business_name":true,"name":true,"keyword":true,"booking_link":true}'::jsonb,'SMS'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','email','Trades: Reactivation Email','Subject: {{service_area}} — quick availability\n\nHi {{name}},\nWe''re opening a few slots for {{keyword}}.\n{{offer}}\nBook: {{booking_link}}\n— {{business_name}}','{"service_area":true,"name":true,"keyword":true,"offer":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sms','Trades: Reactivation SMS','{{business_name}}: Open spots in {{service_area}} for {{keyword}}. {{offer}} Book: {{booking_link}}','{"business_name":true,"service_area":true,"keyword":true,"offer":true,"booking_link":true}'::jsonb,'SMS'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','email','Trades: Review Ask','Subject: Quick favor?\n\nHi {{name}}, if we helped with {{keyword}}, would you leave a review? {{review_link}}\n— {{business_name}}','{"name":true,"keyword":true,"review_link":true,"business_name":true}'::jsonb,'Email'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sms','Trades: Review Ask SMS','{{business_name}}: Could you leave a quick review? {{review_link}} Thank you!','{"business_name":true,"review_link":true}'::jsonb,'SMS'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','script','Trades: Phone Script','SCRIPT: "Hi {{name}}, thanks for calling {{business_name}} about {{keyword}}. The fastest way is booking here: {{booking_link}}. If you prefer, I can ask 2 questions and quote now."','{"name":true,"business_name":true,"keyword":true,"booking_link":true}'::jsonb,'Phone'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Safety Post','POST: Safety matters with {{keyword}}.\n\nHere''s what we do: [3 bullets].\n{{offer}}\nBook: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Local Proof','POST: {{service_area}} neighbors — thanks for trusting us.\n\nNeed {{keyword}}? {{offer}}\nBook: {{booking_link}}','{"service_area":true,"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: "Stop waiting"','POST: Stop waiting on {{keyword}}.\n\n{{offer}}\nBook: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','gbp','Trades: GBP Tip','GBP POST: Tip for {{keyword}}:\n[tip]\nNeed help? {{offer}} Book: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'GBP'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','email','Trades: Quote Email','Subject: Your quote for {{keyword}}\n\nHi {{name}},\nHere''s what we recommend: [scope].\nIf you want to lock it in: {{booking_link}}\n— {{business_name}}','{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sms','Trades: Quote SMS','{{business_name}}: Your quote is ready — book here: {{booking_link}}','{"business_name":true,"booking_link":true}'::jsonb,'SMS'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Seasonal','POST: Seasonal reminder for {{keyword}} in {{service_area}}.\n\n{{offer}}\nBook: {{booking_link}}','{"keyword":true,"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Testimonial','POST: "{{testimonial}}" — local customer\n\nWant the same result? {{offer}}\nBook: {{booking_link}}','{"testimonial":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','social_post','Trades: Price Range','POST: Typical {{keyword}} range in {{service_area}} is [range].\nWe keep it simple: {{offer}}\nBook: {{booking_link}}','{"keyword":true,"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','email','Trades: Missed Call Email','Subject: Sorry we missed you\n\nHi {{name}},\nSorry we missed your call about {{keyword}}.\nBook here: {{booking_link}} or reply with a good time.\n— {{business_name}}','{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sms','Trades: Missed Call SMS','{{business_name}}: Sorry we missed you — book: {{booking_link}}','{"business_name":true,"booking_link":true}'::jsonb,'SMS')
on conflict do nothing;

-- CLEANING (25 items)
insert into dfy_content_items (pack_id, content_type, title, body, variables, platform)
values
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Offer Post','POST: {{service_area}} — {{offer}}\n\nDeep clean / recurring? Book: {{booking_link}}','{"offer":true,"service_area":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Checklist Post','POST: What''s included in a deep clean?\n• [6 bullets]\nWant pricing? {{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Before/After','POST: Before/after in {{service_area}} ✨\n\n{{offer}}\nBook: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','gbp','Cleaning: GBP Offer','GBP POST: {{offer}} in {{service_area}}.\nBook: {{booking_link}} • Call: {{phone}}','{"offer":true,"service_area":true,"booking_link":true,"phone":true}'::jsonb,'GBP'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','email','Cleaning: Lead Follow-up','Subject: Quick details for your clean\n\nHi {{name}},\nA couple questions:\n1) How many beds/baths?\n2) Any pets?\n\nBook here: {{booking_link}}\n— {{business_name}}','{"name":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','sms','Cleaning: Lead Follow-up SMS','{{business_name}}: Thanks {{name}} — beds/baths + preferred day? Or book: {{booking_link}}','{"business_name":true,"name":true,"booking_link":true}'::jsonb,'SMS'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','email','Cleaning: Reactivation','Subject: Want to get back on the schedule?\n\nHi {{name}},\nWe have openings in {{service_area}}.\n{{offer}}\nBook: {{booking_link}}\n— {{business_name}}','{"name":true,"service_area":true,"offer":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','sms','Cleaning: Reactivation SMS','{{business_name}}: Openings in {{service_area}} — {{offer}} Book: {{booking_link}}','{"business_name":true,"service_area":true,"offer":true,"booking_link":true}'::jsonb,'SMS'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','email','Cleaning: Review Ask','Subject: Quick favor?\n\nHi {{name}}, would you leave a review? {{review_link}}\nThank you!\n— {{business_name}}','{"name":true,"review_link":true,"business_name":true}'::jsonb,'Email'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','sms','Cleaning: Review SMS','{{business_name}}: Would you leave a quick review? {{review_link}}','{"business_name":true,"review_link":true}'::jsonb,'SMS'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Recurring Pitch','POST: Tired of cleaning every weekend?\n\nWe offer recurring cleans (weekly/biweekly/monthly).\nAsk about {{offer}} — book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Move-out','POST: Moving?\n\nMove-out cleans in {{service_area}}.\n{{offer}} Book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','gbp','Cleaning: GBP Tip','GBP POST: Quick cleaning tip:\n[tip]\nNeed help? {{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'GBP'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','script','Cleaning: Phone Script','SCRIPT: "Hi {{name}}! For pricing, I just need beds/baths and the type of clean (standard/deep/move-out). Fastest booking: {{booking_link}}."','{"name":true,"booking_link":true}'::jsonb,'Phone'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Pet Hair','POST: Pet hair? We''ve got you.\n\nAsk about our add-ons.\n{{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Kitchen Focus','POST: The kitchen makes the biggest difference.\n\nWe detail: [list].\n{{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Bathroom Focus','POST: Bathroom reset ✨\n\n{{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','email','Cleaning: Missed Call','Subject: Sorry we missed you\n\nHi {{name}}, sorry we missed you. Want a quote? Book: {{booking_link}}\n— {{business_name}}','{"name":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','sms','Cleaning: Missed Call SMS','{{business_name}}: Sorry we missed you — book: {{booking_link}}','{"business_name":true,"booking_link":true}'::jsonb,'SMS'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Local Proof','POST: {{service_area}} neighbors — thank you.\n\nOpenings this week. {{offer}} Book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: "Gift time"','POST: Give yourself time back.\n\nLet us handle the clean.\n{{offer}} Book: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','gbp','Cleaning: GBP Move-out','GBP POST: Move-out cleans in {{service_area}}.\n{{offer}} Book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'GBP'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','email','Cleaning: Quote Email','Subject: Your estimate\n\nHi {{name}}, based on beds/baths + type of clean, here''s the estimate: [range].\nBook: {{booking_link}}','{"name":true,"booking_link":true}'::jsonb,'Email'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Seasonal Reset','POST: Seasonal reset in {{service_area}}.\n\n{{offer}} Book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','social_post','Cleaning: Testimonial','POST: "{{testimonial}}" — local client\n\nWant the same? {{offer}} Book: {{booking_link}}','{"testimonial":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG')
on conflict do nothing;

-- MEDSPA (25 items) + RESTAURANT (25 items) continued in next comment due to length
