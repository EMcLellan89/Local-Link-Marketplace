/*
  # Add Customer Referral Engine™ to DFY Product Catalog

  1. New Product
    - Adds Customer Referral Engine to dfy_products
    - Setup: $497 one-time
    - Monthly: $97/mo
    - Partners can sell it with standard commission tiers

  2. Marketplace Entry
    - Makes it available for partners to promote
    - Sets commission structure
*/

-- Add Customer Referral Engine product
insert into public.dfy_products (
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
  is_active,
  sort_order,
  image_url
) values (
  'customer-referral-engine',
  'Customer Referral Engine™',
  'growth',
  'Turn happy customers into your best sales channel — automatically',
  $$Transform your satisfied customers into a powerful acquisition channel. The Customer Referral Engine makes it effortless for customers to refer friends and family, with automatic tracking, rewards, and notifications all handled for you.

**Setup (Done For You):**
- Referral program installed and branded
- Reward rules configured (industry-optimized presets available)
- Coupon/credit logic enabled
- Custom referral landing page with your branding
- Optional "Refer & Earn" website widget

**Monthly Management:**
- Automated referral tracking and attribution
- Reward fulfillment automation
- Fraud protection guardrails (self-referral blocking, max limits)
- Monthly optimization recommendations
- Performance reporting dashboard

**How It Works:**
1. Every customer gets a personal referral link
2. When a friend books/purchases through their link, we track it
3. Referrer gets their reward (credit, coupon, or gift card)
4. You get a new customer
5. Everything happens automatically

**Industry-Optimized Presets:**
- **Cleaning:** "Refer a Neighbor" — $25 credit for referrer, $15 coupon for friend
- **Trades:** "Refer & Save" — $30 credit for referrer, $20 off for friend
- **Med Spa:** "Share the Glow" — $20 credit for both parties
- **Restaurant:** "Bring a Friend" — $15 off for referrer, $10 off for friend
- **General:** Fully customizable for any business type$$,
  to_jsonb(array[
    'Customers trust recommendations from people they know',
    'Local businesses thrive on word-of-mouth marketing',
    'Automated systems ensure nothing slips through the cracks',
    'Rewards create a win-win-win (customer, friend, business)',
    'Turn one-time buyers into repeat customers and advocates'
  ]),
  to_jsonb(array[
    'Branded referral landing page',
    'Personal share links for each customer',
    'Automatic referral tracking & attribution',
    'Flexible reward types (credit, coupon, cash, gift card)',
    'Industry-optimized presets (cleaning, trades, medspa, restaurant)',
    'Fraud protection (self-referral blocking, max limits)',
    'Automated reward fulfillment',
    'Email/SMS notifications for referrers and referees',
    'Performance dashboard with real-time metrics',
    'Monthly optimization recommendations',
    'Optional website widget integration',
    'Mobile-friendly share experience',
    'Custom qualifying events (first purchase, minimum spend)',
    'Unlimited referral links',
    'Priority support'
  ]),
  to_jsonb(array[
    jsonb_build_object(
      'question', 'How quickly can this be set up?',
      'answer', 'Typically 3-5 business days. We handle the entire setup including branding, reward configuration, and landing page creation.'
    ),
    jsonb_build_object(
      'question', 'What types of rewards can I offer?',
      'answer', 'You can offer account credits, discount coupons, cash payments, gift cards, or even free services. We recommend starting with our industry-optimized presets and adjusting based on results.'
    ),
    jsonb_build_object(
      'question', 'How do you prevent fraud?',
      'answer', 'We automatically block self-referrals (customers can''t refer themselves), set maximum rewards per customer, and flag suspicious patterns for review.'
    ),
    jsonb_build_object(
      'question', 'Can I customize the rewards and qualifying events?',
      'answer', 'Absolutely. While we provide industry presets as a starting point, you can customize reward amounts, types, minimum purchase requirements, and what counts as a "qualified" referral.'
    ),
    jsonb_build_object(
      'question', 'What if a customer doesn''t have an account?',
      'answer', 'We can create referral links based on email addresses. When they make their first purchase, we connect their referral activity to their new account automatically.'
    ),
    jsonb_build_object(
      'question', 'Can I run limited-time referral campaigns?',
      'answer', 'Yes! You can adjust reward values anytime and we offer optional "Double Reward Week" campaigns ($149 one-time setup).'
    )
  ]),
  49700,
  9700,
  72,
  true,
  150,
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
) on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  short_value_prop = excluded.short_value_prop,
  long_description = excluded.long_description,
  outcomes = excluded.outcomes,
  includes = excluded.includes,
  faq = excluded.faq,
  setup_price_cents = excluded.setup_price_cents,
  monthly_price_cents = excluded.monthly_price_cents,
  is_active = excluded.is_active,
  image_url = excluded.image_url;

-- Add to marketplace_affiliate_products (using 'service' type)
insert into public.marketplace_affiliate_products (
  sku,
  name,
  type,
  description,
  price_cents,
  recurring,
  commission_rate_bp,
  category,
  active,
  metadata
) values (
  'customer-referral-engine',
  'Customer Referral Engine™',
  'service',
  $$Turn your merchants' customers into their best sales channel. Fully automated referral tracking, rewards, and fulfillment. Industry-optimized presets for cleaning, trades, med spa, and restaurants.$$,
  49700,
  true,
  2000,
  'growth_systems',
  true,
  jsonb_build_object(
    'recurring_price_cents', 9700,
    'setup_commission_rate_bp', 2000,
    'recurring_commission_rate_bp', 1500,
    'tags', array['referrals', 'word-of-mouth', 'customer-acquisition', 'retention'],
    'image_url', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  )
) on conflict (sku) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  recurring = excluded.recurring,
  commission_rate_bp = excluded.commission_rate_bp,
  active = excluded.active,
  metadata = excluded.metadata;
