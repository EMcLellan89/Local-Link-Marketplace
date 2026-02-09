/*
  # Seed 3 Core DFY Campaigns
  
  1. Campaigns Created
    - Customer Reactivation Program™ (7-touch sequence)
    - Review Growth & Protection Program™ (6-touch sequence)
    - Local Visibility Booster Program™ (8-touch sequence)
  
  2. Campaign Steps
    - Each campaign has sequenced steps across multiple channels
    - Supports variable replacement: {{business_name}}, {{offer}}, {{service_area}}, etc.
    - Includes delay timing for automation
*/

-- Campaigns
insert into dfy_campaigns (id, title, industry, description, objective)
values
  ('11111111-1111-1111-1111-111111111111', 'Customer Reactivation Program™', null,
   'Bring past customers back with a 7-touch sequence across SMS/Email/Social.', 'reactivation'),
  ('22222222-2222-2222-2222-222222222222', 'Review Growth & Protection Program™', null,
   'Generate new 5-star reviews and respond fast to protect reputation.', 'reviews'),
  ('33333333-3333-3333-3333-333333333333', 'Local Visibility Booster Program™', null,
   'Increase local discovery with GBP + social posts + quick offers.', 'leads')
on conflict (id) do nothing;

-- Reactivation Campaign Steps (7 touches)
insert into dfy_campaign_steps (campaign_id, step_order, channel, title, template_body, delay_days, delay_hours)
values
  ('11111111-1111-1111-1111-111111111111', 1, 'email', 'We saved you a spot',
   'Subject: Quick question — still need help with {{keyword}}?\n\nHi {{name}},\n\nIt''s been a minute — this is {{business_name}}. We''re reaching out because we''re opening a few spots in {{service_area}}.\n\nIf you still need help with {{keyword}}, here''s a simple offer: {{offer}}.\n\nBook here: {{booking_link}}\nOr reply "YES" and we''ll set it up.\n\n— {{business_name}}', 0, 0),
  ('11111111-1111-1111-1111-111111111111', 2, 'sms', 'Quick offer text',
   '{{business_name}}: Hey {{name}} 👋 quick question — still need help with {{keyword}} in {{service_area}}? We''re doing: {{offer}}. Book: {{booking_link}}', 0, 6),
  ('11111111-1111-1111-1111-111111111111', 3, 'social', 'Before/after + offer post',
   'POST: {{service_area}} — quick availability this week.\n\nIf you''ve been putting off {{keyword}}, here''s a simple way to get it done:\n✅ {{offer}}\n\nComment "INFO" or book now: {{booking_link}}\n\n#{{service_area}} #localbusiness', 1, 0),
  ('11111111-1111-1111-1111-111111111111', 4, 'email', 'The "are we still your go-to?" email',
   'Subject: Are we still your go-to?\n\nHi {{name}},\n\nJust checking in — are we still your go-to for {{keyword}}?\n\nIf not, no worries. If yes, we can make it easy:\n{{offer}}\nBook: {{booking_link}}\n\nReply with 1) YES  2) Later  3) Not needed', 2, 0),
  ('11111111-1111-1111-1111-111111111111', 5, 'sms', 'Last call SMS',
   '{{business_name}}: last call for this week''s {{offer}} in {{service_area}}. Want us to hold a spot? Reply YES or book: {{booking_link}}', 3, 3),
  ('11111111-1111-1111-1111-111111111111', 6, 'gbp', 'Google Business Profile post',
   'GBP POST: {{offer}} — available in {{service_area}}.\n\nIf you need help with {{keyword}}, we can usually schedule quickly.\nCall {{phone}} or book: {{booking_link}}', 4, 0),
  ('11111111-1111-1111-1111-111111111111', 7, 'email', 'Soft close / keep-in-touch',
   'Subject: Should we stop reaching out?\n\nHi {{name}},\n\nWe don''t want to bug you. Should we stop reaching out about {{keyword}}?\n\nIf you''d like to keep the occasional offer, just reply "KEEP".\nIf you want to book now: {{booking_link}}\n\n— {{business_name}}', 7, 0)
on conflict do nothing;

-- Review Campaign Steps (6 touches)
insert into dfy_campaign_steps (campaign_id, step_order, channel, title, template_body, delay_days, delay_hours)
values
  ('22222222-2222-2222-2222-222222222222', 1, 'sms', 'Review request (warm)',
   '{{business_name}}: Thanks again, {{name}} — could you leave a quick review? It helps a ton: {{review_link}}', 0, 2),
  ('22222222-2222-2222-2222-222222222222', 2, 'email', 'Review request (with 2 prompts)',
   'Subject: Quick favor (30 seconds)\n\nHi {{name}},\n\nIf we did a great job, would you leave a quick review?\nLink: {{review_link}}\n\nTwo prompts if helpful:\n1) What did we help you with?\n2) What was the best part of working with us?\n\nThank you!\n— {{business_name}}', 0, 6),
  ('22222222-2222-2222-2222-222222222222', 3, 'sms', 'Gentle nudge',
   '{{business_name}}: quick reminder — your review helps neighbors find us. Here''s the link: {{review_link}} 🙏', 2, 0),
  ('22222222-2222-2222-2222-222222222222', 4, 'social', 'Review proof post',
   'POST: Local neighbors said it best ⭐⭐⭐⭐⭐\n\nWe''re grateful for every review.\nIf we''ve helped you with {{keyword}}, leave yours here: {{review_link}}\n\n#{{service_area}} #5star', 3, 0),
  ('22222222-2222-2222-2222-222222222222', 5, 'gbp', 'GBP "thank you" post',
   'GBP POST: Thank you {{service_area}}! If we''ve helped you with {{keyword}}, leave a quick review:\n{{review_link}}', 4, 0),
  ('22222222-2222-2222-2222-222222222222', 6, 'email', 'Protection: "tell us first"',
   'Subject: Anything we could''ve done better?\n\nHi {{name}},\n\nIf anything wasn''t perfect, hit reply and tell us — we''ll make it right.\nIf everything was great, here''s our review link:\n{{review_link}}\n\n— {{business_name}}', 7, 0)
on conflict do nothing;

-- Visibility Booster Steps (8 touches)
insert into dfy_campaign_steps (campaign_id, step_order, channel, title, template_body, delay_days, delay_hours)
values
  ('33333333-3333-3333-3333-333333333333', 1, 'gbp', 'Offer post',
   'GBP POST: {{offer}} in {{service_area}}.\n\nCall {{phone}} or book: {{booking_link}}\n\n(Ask us about {{keyword}}.)', 0, 0),
  ('33333333-3333-3333-3333-333333333333', 2, 'social', 'Local tip post',
   'POST: Local tip for {{keyword}} ({{service_area}})\n\nMost people don''t realize: [INSERT TIP].\n\nIf you want help, we''re running: {{offer}}\nBook: {{booking_link}}', 0, 8),
  ('33333333-3333-3333-3333-333333333333', 3, 'social', 'FAQ post',
   'POST: FAQ — "How much does {{keyword}} cost?"\n\nIt depends on [2 factors].\nWe make it simple: {{offer}}\nMessage "QUOTE" or book: {{booking_link}}', 2, 0),
  ('33333333-3333-3333-3333-333333333333', 4, 'email', 'Neighborhood blast',
   'Subject: {{service_area}} — quick availability\n\nHi {{name}},\n\nWe''re opening a few slots in {{service_area}} for {{keyword}}.\nOffer: {{offer}}\nBook: {{booking_link}}\n\n— {{business_name}}', 3, 0),
  ('33333333-3333-3333-3333-333333333333', 5, 'sms', 'Short availability text',
   '{{business_name}}: Open spots in {{service_area}} this week. {{offer}}. Book: {{booking_link}}', 3, 6),
  ('33333333-3333-3333-3333-333333333333', 6, 'social', 'Proof post',
   'POST: Recent results in {{service_area}} ✅\n\nIf you need {{keyword}}, here''s the current offer: {{offer}}\nBook: {{booking_link}}', 5, 0),
  ('33333333-3333-3333-3333-333333333333', 7, 'gbp', 'Service spotlight',
   'GBP POST: {{keyword}} in {{service_area}}\n\nWhat you get:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\nBook: {{booking_link}}', 7, 0),
  ('33333333-3333-3333-3333-333333333333', 8, 'email', 'Soft close',
   'Subject: Want us to hold a spot?\n\nHi {{name}},\n\nWant us to hold a spot for {{keyword}}?\nOffer: {{offer}}\nBook: {{booking_link}}\n\nReply YES and we''ll help.\n— {{business_name}}', 10, 0)
on conflict do nothing;

-- Starter content pack
insert into dfy_content_packs (id, title, industry, season, description, tags, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Local-Link Starter Pack (30 posts/emails/SMS)', null, null,
   'A ready-to-install starter pack for local visibility, offers, reviews, and referrals.', array['starter','local','offers','reviews','referrals'], 'active')
on conflict (id) do nothing;

-- 10 starter content items
insert into dfy_content_items (pack_id, content_type, title, body, variables, platform)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'social_post', 'Offer Post (simple)',
   'POST: {{service_area}} — quick special:\n\n{{offer}}\n\nComment "INFO" or book: {{booking_link}}', '{"offer":true,"service_area":true,"booking_link":true}'::jsonb, 'FB/IG'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'social_post', 'Proof Post (before/after)',
   'POST: Another one in {{service_area}} ✅\n\nIf you need {{keyword}}, here''s the deal: {{offer}}\nBook: {{booking_link}}', '{"keyword":true,"offer":true,"service_area":true,"booking_link":true}'::jsonb, 'FB/IG'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'social_post', 'FAQ Post',
   'POST: FAQ — "How does {{keyword}} work?"\n\nShort answer: [explain].\nWant help? {{offer}}\nBook: {{booking_link}}', '{"keyword":true,"offer":true,"booking_link":true}'::jsonb, 'FB/IG'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'social_post', 'Referral Post',
   'POST: Want to earn rewards?\n\nShare this link with friends — when they become a customer, you earn.\nGet your link here: {{customer_share_page}}', '{"customer_share_page":true}'::jsonb, 'FB/IG'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'gbp', 'GBP Offer',
   'GBP POST: {{offer}} in {{service_area}}.\nCall {{phone}} or book: {{booking_link}}', '{"offer":true,"service_area":true,"phone":true,"booking_link":true}'::jsonb, 'GBP'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', 'Lead Follow-up (fast)',
   'Subject: Got it — quick question\n\nHi {{name}},\n\nThanks for reaching out about {{keyword}}.\n1) When do you want this done?\n2) Are there any photos you can text/email?\n\nIf you want the fastest option: {{booking_link}}\n\n— {{business_name}}', '{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb, 'Email'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sms', 'Lead Follow-up SMS',
   '{{business_name}}: Thanks {{name}} — want to get scheduled for {{keyword}}? Book here: {{booking_link}}', '{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb, 'SMS'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', 'Review Ask',
   'Subject: Quick 30-second favor\n\nHi {{name}},\n\nIf we did a great job, would you leave a quick review?\n{{review_link}}\n\nThank you!\n— {{business_name}}', '{"name":true,"review_link":true,"business_name":true}'::jsonb, 'Email'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sms', 'Review Ask SMS',
   '{{business_name}}: Could you leave a quick review? {{review_link}} Thanks! 🙏', '{"review_link":true,"business_name":true}'::jsonb, 'SMS'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'script', 'Phone Script (booking)',
   'SCRIPT:\n"Hi {{name}}, it''s {{business_name}}. Thanks for reaching out about {{keyword}}.\nWe can usually get you scheduled quickly. The easiest option is to book here: {{booking_link}}.\nIf you''d rather, I can ask 2 quick questions and quote it now."', '{"name":true,"business_name":true,"keyword":true,"booking_link":true}'::jsonb, 'Phone')
on conflict do nothing;
