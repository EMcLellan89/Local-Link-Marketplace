/*
  # Seed Comprehensive Industry-Specific Ad Vault

  Seeds extensive ad copy for partners to use across 4 industries:
  - Cleaning
  - Trades (contractors)
  - Med Spa & Beauty
  - Restaurants

  For each industry, provides:
  - 5+ ad variants
  - 5+ hook variants
  - 5+ caption templates
  - 5+ DM scripts
*/

-- Additional cleaning industry content
insert into public.industry_ad_packs (
  industry_key,
  product_slug,
  pack_name,
  description,
  ad_variants,
  hook_variants,
  caption_templates,
  dm_scripts
) values (
  'cleaning',
  'bundle-faceless-ai-funnel',
  'Cleaning: Consistency Angle',
  'Focus on consistent posting without being on camera',
  to_jsonb(array[
    $$Most cleaning companies disappear online between jobs.

That's exactly when customers book someone else.

This system keeps you visible with faceless content + a funnel that captures leads 24/7.

Learn more 👇$$,
    $$You don't need to be an influencer to run a cleaning business.

You just need to stay visible consistently.

We handle your monthly content (no camera required) + build a funnel that books jobs on autopilot.

See how it works 👇$$,
    $$Posting when you're busy is impossible.
Not posting means fewer bookings.

This bundle solves both: faceless content done for you + a funnel running 24/7.

Tap to start 👇$$
  ]),
  to_jsonb(array[
    'Cleaning companies lose work when they disappear online',
    'You don''t need to be an influencer to run a cleaning business',
    'If posting falls off when you''re busy, this fixes that',
    'Your best customers forget about you when you''re not visible',
    'Consistent content = more bookings (even when you''re fully booked)'
  ]),
  to_jsonb(array[
    'No camera. No guessing. Just consistent content that books jobs.',
    'Your cleaning business deserves a system that works as hard as you do.',
    'Stop choosing between posting and getting work done.',
    'Visibility shouldn''t depend on motivation.',
    'Faceless content + conversion funnel = booked calendar'
  ]),
  to_jsonb(array[
    $$Hey! Thanks for reaching out about our cleaning services.

Quick question: Are you looking for regular maintenance or a one-time deep clean?

Let me get you our availability and pricing 👇$$,
    $$Hi! We''d love to help. 

What area are you located in, and what type of cleaning are you interested in?

I can send you a quote right away.$$,
    $$Thanks for your message!

We have spots opening up next week. 

Can you share your address and preferred days? I''ll check our schedule and get back to you within the hour.$$
  ])
) on conflict do nothing;

-- Additional trades industry content
insert into public.industry_ad_packs (
  industry_key,
  product_slug,
  pack_name,
  description,
  ad_variants,
  hook_variants,
  caption_templates,
  dm_scripts
) values (
  'trades',
  'bundle-faceless-ai-funnel',
  'Trades: Trust & Consistency',
  'Build trust through consistent visibility without showing your face',
  to_jsonb(array[
    $$Trades don''t lose jobs because of skill.

They lose jobs because customers forget about them.

This bundle keeps you visible with faceless content + a funnel that captures leads while you''re on the job.

Learn more 👇$$,
    $$The best contractors aren''t the loudest.
They''re the most consistent.

We handle your monthly content (no camera) + build a funnel that books estimates 24/7.

See how it works 👇$$,
    $$If you only post when work is slow, you''re already behind.

This system keeps your business visible year-round with faceless content + a conversion funnel.

Get started 👇$$
  ]),
  to_jsonb(array[
    'Trades don''t lose jobs because of skill — they lose jobs because customers forget about them',
    'The best contractors aren''t the loudest — they''re the most consistent',
    'Your work speaks for itself. Your content should too.',
    'If posting only happens when work is slow, this fixes that',
    'Focus on the work — not Instagram'
  ]),
  to_jsonb(array[
    'Consistent visibility = year-round work.',
    'Your business doesn''t need viral videos. It needs a system.',
    'No camera required. Just results.',
    'Built for contractors who are too busy to post.',
    'Faceless content + lead funnel = booked calendar'
  ]),
  to_jsonb(array[
    $$Hey! Thanks for reaching out.

What type of project are you working on? I can get you a free estimate this week.$$,
    $$Hi! We''d be happy to help.

Can you share some details about the job? (Location, timeline, scope)

I''ll follow up within 24 hours.$$,
    $$Thanks for your message!

We''re booking 2-3 weeks out right now. 

Want to schedule a walkthrough to get your project on the calendar?$$
  ])
) on conflict do nothing;

-- Additional medspa industry content
insert into public.industry_ad_packs (
  industry_key,
  product_slug,
  pack_name,
  description,
  ad_variants,
  hook_variants,
  caption_templates,
  dm_scripts
) values (
  'medspa',
  'bundle-faceless-ai-funnel',
  'Med Spa: Premium Positioning',
  'Professional content without filming staff or clients',
  to_jsonb(array[
    $$Posting consistently matters.
Being on camera every day doesn''t.

This bundle keeps your med spa visible with faceless content + a funnel optimized for consultations.

No filming. No staff time wasted.

Learn more 👇$$,
    $$Burnout doesn''t come from clients.
It comes from content pressure.

We handle your monthly content (no camera) + build a funnel that books consultations 24/7.

See pricing 👇$$,
    $$Your med spa doesn''t need influencer-style content.

It needs consistent, professional visibility + a system that converts views into bookings.

Get started 👇$$
  ]),
  to_jsonb(array[
    'Posting consistently matters — but being on camera every day doesn''t',
    'Burnout doesn''t come from clients — it comes from content pressure',
    'Your clients don''t need to see your face to trust your expertise',
    'Professional content shouldn''t require filming every day',
    'Consistent visibility without content burnout'
  ]),
  to_jsonb(array[
    'Faceless content. Professional results. Zero filming required.',
    'Built for med spas that are too busy serving clients to create content.',
    'Your expertise speaks for itself. Let your content do the same.',
    'Premium visibility without the content chaos.',
    'Consultation-optimized funnel + monthly content system'
  ]),
  to_jsonb(array[
    $$Hi! Thanks for reaching out about [service].

Are you looking to book a consultation, or do you have questions about the treatment first?$$,
    $$Hey! We''d love to help you with [service].

Our next consultation openings are [dates]. 

Would any of those work for you?$$,
    $$Thanks for your message!

I''m sending you our consultation booking link now. 

Is there anything specific you''d like to discuss during your visit?$$
  ])
) on conflict do nothing;

-- Additional restaurant industry content
insert into public.industry_ad_packs (
  industry_key,
  product_slug,
  pack_name,
  description,
  ad_variants,
  hook_variants,
  caption_templates,
  dm_scripts
) values (
  'restaurant',
  'bundle-faceless-ai-funnel',
  'Restaurant: Local Visibility',
  'Stay top-of-mind locally without becoming a content creator',
  to_jsonb(array[
    $$Restaurants don''t need viral videos.
They need consistent visibility.

This bundle keeps your restaurant top-of-mind with faceless content + a funnel that drives reservations.

No filming required.

Learn more 👇$$,
    $$If posting always gets pushed to "later"... this fixes that.

We handle your monthly content + build a funnel that fills tables — even when you''re slammed in the kitchen.

See how it works 👇$$,
    $$Great food doesn''t market itself.

But consistent visibility + a reservation funnel gets close.

This bundle handles both. No camera. No chaos.

Get started 👇$$
  ]),
  to_jsonb(array[
    'Restaurants don''t need viral videos — they need consistent visibility',
    'If posting always gets pushed to "later"… this fixes that',
    'Great food doesn''t market itself',
    'Focus on the kitchen — not Instagram',
    'The best restaurants stay top-of-mind without chasing trends'
  ]),
  to_jsonb(array[
    'Faceless content + reservation funnel = full tables.',
    'Built for restaurants that are too busy to post daily.',
    'Your food speaks for itself. Your content should too.',
    'Consistent visibility in your local market.',
    'No trends. No filming. Just results.'
  ]),
  to_jsonb(array[
    $$Hey! Thanks for reaching out.

Are you looking to make a reservation or inquire about private events?$$,
    $$Hi! We''d love to host you.

What date and party size are you thinking?

I can check availability right now.$$,
    $$Thanks for your message!

We have availability [days/times]. 

Would you like me to hold a table for you?$$
  ])
) on conflict do nothing;

comment on table public.industry_ad_packs is 'Industry-specific ad copy vault for partners to promote products';
