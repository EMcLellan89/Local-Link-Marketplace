/*
  # Add New Done For You AI Tools

  1. New AI Bot Products (Monthly Subscriptions)
    - AI Marketing Funnels Bot ($297/month) - Complete automated marketing funnel builder
    - AI Content Calendar Bot ($147/month) - 30-day content calendar with posts
    - AI Landing Page Optimizer Bot ($197/month) - Optimize landing pages for conversion
    - AI Email Sequence Builder Bot ($177/month) - Pre-built email sequences
    - AI Competitor Analysis Bot ($247/month) - Monitor competitors automatically
    - AI Local SEO Optimizer Bot ($227/month) - Optimize for local search
    - AI Chatbot Builder Bot ($197/month) - Custom AI chatbot for your website
    - AI Ad Campaign Manager Bot ($277/month) - Manage and optimize ad campaigns
    - AI Video Script Writer Bot ($167/month) - Professional video scripts
    - AI Testimonial Generator Bot ($127/month) - Convert customer feedback to testimonials

  2. Features
    - All bots include setup, training, and 24/7 support
    - Partner commission rates vary by tier
    - Can be bundled with existing packages for additional savings
*/

-- Insert new AI bot products into automation_addons
INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, is_active, sort_order) VALUES
(
  'AI Marketing Funnels Bot',
  'ai_marketing_funnels',
  'Build complete marketing funnels in minutes. Creates landing pages, email sequences, thank you pages, and upsell pages. Includes A/B testing, analytics, and conversion optimization. Turn more visitors into customers automatically.',
  29700,
  297000,
  'ai_marketing_funnels',
  'ai_bots',
  true,
  106
),
(
  'AI Content Calendar Bot',
  'ai_content_calendar',
  'Never run out of content ideas. Generates a full 30-day content calendar with posts, captions, and hashtags for all your social platforms. Tailored to your industry and optimized for engagement.',
  14700,
  147000,
  'ai_content_calendar',
  'ai_bots',
  true,
  107
),
(
  'AI Landing Page Optimizer Bot',
  'ai_landing_page_optimizer',
  'Maximize conversions with AI-powered optimization. Analyzes your landing pages, suggests improvements, and automatically tests variations. Increase conversion rates by 30-50% on average.',
  19700,
  197000,
  'ai_landing_page_optimizer',
  'ai_bots',
  true,
  108
),
(
  'AI Email Sequence Builder Bot',
  'ai_email_sequence_builder',
  'Pre-built email sequences for every scenario: welcome series, abandoned cart, post-purchase, re-engagement, and more. Fully customizable and proven to convert. Set it once and let it run.',
  17700,
  177000,
  'ai_email_sequence_builder',
  'ai_bots',
  true,
  109
),
(
  'AI Competitor Analysis Bot',
  'ai_competitor_analysis',
  'Know exactly what your competitors are doing. Monitors their prices, promotions, ads, reviews, and SEO strategy. Get weekly competitive intelligence reports and stay one step ahead.',
  24700,
  247000,
  'ai_competitor_analysis',
  'ai_bots',
  true,
  110
),
(
  'AI Local SEO Optimizer Bot',
  'ai_local_seo_optimizer',
  'Dominate local search results. Optimizes your Google Business Profile, manages citations, monitors rankings, and generates location-specific content. Show up first when customers search for you.',
  22700,
  227000,
  'ai_local_seo_optimizer',
  'ai_bots',
  true,
  111
),
(
  'AI Chatbot Builder Bot',
  'ai_chatbot_builder',
  'Add a smart AI chatbot to your website in minutes. Answers FAQs, qualifies leads, books appointments, and provides 24/7 customer support. Train it on your business info and let it handle inquiries.',
  19700,
  197000,
  'ai_chatbot_builder',
  'ai_bots',
  true,
  112
),
(
  'AI Ad Campaign Manager Bot',
  'ai_ad_campaign_manager',
  'Set-and-forget ad campaign management. Automatically creates, tests, and optimizes Facebook, Google, and Instagram ads. Adjusts bids, pauses underperformers, and scales winners. Maximize your ROAS.',
  27700,
  277000,
  'ai_ad_campaign_manager',
  'ai_bots',
  true,
  113
),
(
  'AI Video Script Writer Bot',
  'ai_video_script_writer',
  'Professional video scripts in seconds. Creates engaging scripts for explainer videos, testimonials, ads, social media, and more. Includes hooks, body, CTA, and even b-roll suggestions.',
  16700,
  167000,
  'ai_video_script_writer',
  'ai_bots',
  true,
  114
),
(
  'AI Testimonial Generator Bot',
  'ai_testimonial_generator',
  'Turn customer feedback into powerful testimonials. Analyzes reviews, messages, and surveys to create compelling testimonials with permission. Automatically formats for website, social, and ads.',
  12700,
  127000,
  'ai_testimonial_generator',
  'ai_bots',
  true,
  115
);

-- Add new bundle package: Marketing Automation Suite
INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, is_active, sort_order) VALUES
(
  'Marketing Automation Suite',
  'marketing_automation_suite',
  'Complete marketing automation in one package. Includes AI Marketing Funnels Bot, AI Content Calendar Bot, AI Email Sequence Builder Bot, AI Ad Campaign Manager Bot, and AI Landing Page Optimizer Bot. Save over $250/month vs buying separately.',
  99700,
  997000,
  'marketing_automation_suite',
  'ai_packages',
  true,
  200
),
(
  'Local Business Domination Package',
  'local_business_domination',
  'Everything you need to dominate your local market. Includes AI Local SEO Optimizer Bot, AI Reputation Monitor Bot, AI Review Responder Bot, AI Competitor Analysis Bot, and AI Chatbot Builder Bot. Save over $200/month vs buying separately.',
  89700,
  897000,
  'local_business_domination',
  'ai_packages',
  true,
  201
);
