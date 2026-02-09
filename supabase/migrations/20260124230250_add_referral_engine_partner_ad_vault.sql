/*
  # Add Partner Ad Vault Content for Customer Referral Engine™

  Adds proven ad copy, hooks, and scripts for partners to promote
  the Customer Referral Engine to merchants across different industries.
*/

-- Add Customer Referral Engine ad vault content
insert into public.dfy_ad_vault (
  product_slug,
  channel,
  headline,
  primary_text,
  cta,
  notes
)
select * from (values
  -- Cleaning industry angles
  (
    'customer-referral-engine',
    'facebook',
    'Cleaning business owners: your best customers want to refer you',
    'Most cleaning companies rely on happy customers telling their friends. But without a system, those referrals never happen consistently. This engine automates the entire process: tracking, rewards, notifications — all handled for you. Tap below to see how it works.',
    'Learn More',
    'Use before/after cleaning visuals, emphasize automation'
  ),
  (
    'customer-referral-engine',
    'facebook',
    'Turn one cleaning customer into three (automatically)',
    'Your happiest customers would refer you... if you made it easy enough. This system gives every customer a personal referral link, tracks conversions, and handles rewards automatically. No manual tracking. No forgotten referrals. Just new customers. See pricing below.',
    'See Pricing',
    'Use testimonial or social proof imagery'
  ),
  -- Trades/contractor angles
  (
    'customer-referral-engine',
    'facebook',
    'Contractors: stop losing referrals to disorganization',
    'You know your customers are talking about you. But without a formal referral system, most of those conversations never turn into jobs. This engine tracks everything automatically — who referred who, when they convert, and what reward they earned. Learn more below.',
    'Learn More',
    'Use job site visuals, emphasize ROI'
  ),
  (
    'customer-referral-engine',
    'facebook',
    'Your best customers want to help you grow',
    'But "just tell your friends" doesn''t work. Give them a system: personal referral links, automatic tracking, instant rewards when their referral books. It''s word-of-mouth, automated. See how it works below.',
    'See How It Works',
    'Use contractor working, emphasize simplicity'
  ),
  -- Med spa angles
  (
    'customer-referral-engine',
    'facebook',
    'Med spas: turn satisfied clients into a growth channel',
    'Your clients love your treatments. But asking them to "spread the word" without structure rarely converts. This system makes referrals effortless: branded landing pages, automatic tracking, customizable rewards. Your clients refer, you grow, everyone wins. Learn more below.',
    'Learn More',
    'Use spa aesthetic imagery, premium positioning'
  ),
  (
    'customer-referral-engine',
    'facebook',
    'Stop leaving referrals to chance',
    'Word-of-mouth is powerful — but only when it''s systematic. This engine handles everything: personal share links, conversion tracking, reward fulfillment, fraud protection. Your clients get rewards. You get new bookings. Automatically. See pricing below.',
    'See Pricing',
    'Use results/transformation imagery'
  ),
  -- Restaurant angles
  (
    'customer-referral-engine',
    'facebook',
    'Restaurants: your regulars want to bring their friends',
    'Make it worth their while. This system gives every customer a referral link, tracks when friends dine with you, and automatically issues rewards. No punch cards. No manual tracking. Just more filled tables. Learn more below.',
    'Learn More',
    'Use food photography, emphasize full tables'
  ),
  (
    'customer-referral-engine',
    'facebook',
    'Fill more tables without spending more on ads',
    'Your best marketing is sitting at your tables right now. Give them a reason (and a system) to bring friends: Personal referral links, Automatic tracking, Instant rewards. Word-of-mouth, systematized. Get started below.',
    'Get Started',
    'Use busy restaurant imagery'
  ),
  -- General angles
  (
    'customer-referral-engine',
    'facebook',
    'Your customers would refer you... if you made it easy enough',
    'This system does: Personal referral links for each customer, Automatic conversion tracking, Reward fulfillment (credit, coupons, cash), Fraud protection built-in, Performance dashboard. Turn happy customers into your best sales channel. Learn more below.',
    'Learn More',
    'Use diverse business imagery'
  ),
  (
    'customer-referral-engine',
    'facebook',
    'Stop relying on customers to just tell their friends',
    'That never works consistently. You need a system: Branded referral landing pages, Personal share links, Automatic tracking and rewards, Industry-optimized presets. Setup: $497 Monthly: $97. Your customers refer, you grow, everyone wins. Get started below.',
    'Get Started',
    'Pricing-forward, emphasize ROI'
  )
) as v(product_slug, channel, headline, primary_text, cta, notes)
where not exists (
  select 1 from public.dfy_ad_vault 
  where dfy_ad_vault.product_slug = v.product_slug 
  and dfy_ad_vault.headline = v.headline
);

comment on table public.dfy_ad_vault is 'Pre-written ad copy for partners to promote DFY products';
