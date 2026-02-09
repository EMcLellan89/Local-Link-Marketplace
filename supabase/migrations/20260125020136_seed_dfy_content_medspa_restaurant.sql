/*
  # Seed MedSpa and Restaurant DFY Content (50 items)
  
  1. Content for Med Spa (25 items)
  2. Content for Restaurant (25 items)
*/

-- MEDSPA (25 items)
insert into dfy_content_items (pack_id, content_type, title, body, variables, platform)
values
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Offer Post','POST: {{service_area}} — {{offer}}\n\nBook your appointment: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Benefit Post','POST: Why clients love {{keyword}}:\n• [benefit]\n• [benefit]\n\n{{offer}} Book: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: FAQ Post','POST: FAQ — "Does {{keyword}} hurt?"\n\nShort answer: [answer].\n{{offer}} Book: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','gbp','MedSpa: GBP Offer','GBP POST: {{offer}} in {{service_area}}.\nBook: {{booking_link}}','{"offer":true,"service_area":true,"booking_link":true}'::jsonb,'GBP'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','email','MedSpa: Lead Follow-up','Subject: Your appointment options\n\nHi {{name}},\nThanks for your interest in {{keyword}}.\nWant weekday or weekend?\nBook: {{booking_link}}\n— {{business_name}}','{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','sms','MedSpa: Lead Follow-up SMS','{{business_name}}: Hi {{name}} — want to book {{keyword}}? Here''s the link: {{booking_link}}','{"business_name":true,"name":true,"keyword":true,"booking_link":true}'::jsonb,'SMS'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','email','MedSpa: Reactivation','Subject: Ready for your next visit?\n\nHi {{name}},\nWe have openings this week.\n{{offer}}\nBook: {{booking_link}}','{"name":true,"offer":true,"booking_link":true}'::jsonb,'Email'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','sms','MedSpa: Reactivation SMS','{{business_name}}: Open appointments this week — {{offer}} Book: {{booking_link}}','{"business_name":true,"offer":true,"booking_link":true}'::jsonb,'SMS'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','email','MedSpa: Review Ask','Subject: Quick favor?\n\nHi {{name}}, would you leave a quick review? {{review_link}}\n— {{business_name}}','{"name":true,"review_link":true,"business_name":true}'::jsonb,'Email'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','sms','MedSpa: Review SMS','{{business_name}}: Would you leave a quick review? {{review_link}} Thank you!','{"business_name":true,"review_link":true}'::jsonb,'SMS'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: "What to expect"','POST: What to expect at your {{keyword}} appointment:\n1) [step]\n2) [step]\n3) [step]\nBook: {{booking_link}}','{"keyword":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Social proof','POST: "{{testimonial}}" ✨\n\n{{offer}} Book: {{booking_link}}','{"testimonial":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','script','MedSpa: Booking Script','SCRIPT: "Hi {{name}}, we can book you for {{keyword}}. Any goals (glow/lines/texture)? Book here: {{booking_link}}."','{"name":true,"keyword":true,"booking_link":true}'::jsonb,'Phone'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Limited spots','POST: Limited spots this week.\n\n{{offer}}\nBook: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','gbp','MedSpa: GBP Tip','GBP POST: Tip before your {{keyword}}:\n[tip]\nBook: {{booking_link}}','{"keyword":true,"booking_link":true}'::jsonb,'GBP'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Bundle offer','POST: Ask about bundles for {{keyword}}.\n\n{{offer}} Book: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','email','MedSpa: Missed Call','Subject: Sorry we missed you\n\nHi {{name}}, want to book {{keyword}}? {{booking_link}}\n— {{business_name}}','{"name":true,"keyword":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','sms','MedSpa: Missed Call SMS','{{business_name}}: Sorry we missed you — book: {{booking_link}}','{"business_name":true,"booking_link":true}'::jsonb,'SMS'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Education','POST: 3 myths about {{keyword}}:\n1) [myth]\n2) [myth]\n3) [myth]\nBook: {{booking_link}}','{"keyword":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: "Who it''s for"','POST: Who is {{keyword}} for?\n[answer]\n{{offer}} Book: {{booking_link}}','{"keyword":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: New client','POST: New client special — {{offer}}.\nBook: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','gbp','MedSpa: GBP New Client','GBP POST: New client special — {{offer}}.\nBook: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'GBP'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','email','MedSpa: Prep Email','Subject: Before your appointment\n\nHi {{name}}, here''s how to prep for {{keyword}}: [3 tips].\nReschedule/Book: {{booking_link}}','{"name":true,"keyword":true,"booking_link":true}'::jsonb,'Email'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Seasonal','POST: Seasonal glow-up in {{service_area}}.\n\n{{offer}} Book: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','social_post','MedSpa: Gift cards','POST: Gift cards available.\n\nGive someone a glow ✨\nBook: {{booking_link}}','{"booking_link":true}'::jsonb,'FB/IG')
on conflict do nothing;

-- RESTAURANT (25 items)
insert into dfy_content_items (pack_id, content_type, title, body, variables, platform)
values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Today''s Special','POST: Today''s special 🍕\n\n{{offer}}\nOrder/Reserve: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Local Love','POST: {{service_area}} — thanks for supporting local ❤️\n\nTonight: {{offer}}\nReserve: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Behind the scenes','POST: Behind the scenes:\n[chef prep]\n\nCome try it: {{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','gbp','Restaurant: GBP Special','GBP POST: Today''s special — {{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'GBP'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','email','Restaurant: Weekly Email','Subject: This week at {{business_name}}\n\nHi {{name}},\nHere''s what''s happening:\n• {{offer}}\n• [event]\nReserve/order: {{booking_link}}','{"name":true,"business_name":true,"offer":true,"booking_link":true}'::jsonb,'Email'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','sms','Restaurant: Text Special','{{business_name}}: Tonight''s special — {{offer}}. Order/reserve: {{booking_link}}','{"business_name":true,"offer":true,"booking_link":true}'::jsonb,'SMS'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Review Ask','POST: If you loved your meal, would you leave a quick review?\n{{review_link}}','{"review_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','sms','Restaurant: Review SMS','{{business_name}}: Quick favor — would you leave a review? {{review_link}}','{"business_name":true,"review_link":true}'::jsonb,'SMS'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','email','Restaurant: Review Email','Subject: Quick favor?\n\nHi {{name}}, would you leave a quick review? {{review_link}}\n— {{business_name}}','{"name":true,"review_link":true,"business_name":true}'::jsonb,'Email'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Event Night','POST: Event night in {{service_area}} 🎉\n\n{{offer}}\nReserve: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Family Deal','POST: Family deal 🍽️\n\n{{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','gbp','Restaurant: GBP Family','GBP POST: Family deal — {{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'GBP'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Lunch Promo','POST: Lunch promo 🥗\n\n{{offer}}\nOrder: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Dessert','POST: Dessert spotlight 🍨\n\n{{offer}}\nOrder/reserve: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: New Item','POST: New menu item!\n\n{{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','script','Restaurant: Phone Script','SCRIPT: "Hi! Thanks for calling {{business_name}}. Want a reservation or takeout? You can also order here: {{booking_link}}."','{"business_name":true,"booking_link":true}'::jsonb,'Phone'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Catering','POST: Catering available.\n\nAsk about: {{offer}}\nInquiry: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','gbp','Restaurant: GBP Catering','GBP POST: Catering available — inquire here: {{booking_link}}','{"booking_link":true}'::jsonb,'GBP'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Local Proof','POST: "{{testimonial}}" — thank you!\n\nTonight: {{offer}} Reserve: {{booking_link}}','{"testimonial":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','email','Restaurant: Missed Call','Subject: Sorry we missed you\n\nHi {{name}}, want to reserve? {{booking_link}}\n— {{business_name}}','{"name":true,"booking_link":true,"business_name":true}'::jsonb,'Email'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','sms','Restaurant: Missed Call SMS','{{business_name}}: Sorry we missed you — reserve/order: {{booking_link}}','{"business_name":true,"booking_link":true}'::jsonb,'SMS'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Happy Hour','POST: Happy hour 🍻\n\n{{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Weekend','POST: Weekend plans?\n\n{{offer}}\nReserve: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'FB/IG'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','gbp','Restaurant: GBP Weekend','GBP POST: Weekend special — {{offer}}\nReserve/order: {{booking_link}}','{"offer":true,"booking_link":true}'::jsonb,'GBP'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','social_post','Restaurant: Seasonal','POST: Seasonal feature in {{service_area}} 🍂\n\n{{offer}}\nReserve/order: {{booking_link}}','{"service_area":true,"offer":true,"booking_link":true}'::jsonb,'FB/IG')
on conflict do nothing;

-- Auto-schedule function for 30-day installs
create or replace function rpc_install_pack_schedule_30_days(
  p_org_id uuid,
  p_pack_id uuid,
  p_start_date date,
  p_post_hour int default 9
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_day int := 0;
  r record;
  v_dt timestamptz;
begin
  for r in
    select id, content_type, platform
    from dfy_content_items
    where pack_id = p_pack_id
    order by created_at asc
  loop
    v_dt := (p_start_date::timestamptz + make_interval(days => v_day, hours => p_post_hour));
    insert into merchant_content_installs(org_id, dfy_content_item_id, scheduled_for, status, variables)
    values (
      p_org_id,
      r.id,
      v_dt,
      'scheduled',
      '{}'::jsonb
    );
    v_count := v_count + 1;
    v_day := v_day + 1;
    if v_day >= 30 then exit; end if;
  end loop;

  return v_count;
end $$;

grant execute on function rpc_install_pack_schedule_30_days(uuid,uuid,date,int) to authenticated;
